// AddScheduleScreen.js

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity, Keyboard, ScrollView } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { addSchedule, getSchedules } from '../firebase'; // Ensure getSchedules is imported
import { TextInput, Button, Text, Provider as PaperProvider, Checkbox, RadioButton, Appbar } from 'react-native-paper';
import theme from '../theme';

const daysOfWeek = [
  { name: 'Sunday', index: 0 },
  { name: 'Monday', index: 1 },
  { name: 'Tuesday', index: 2 },
  { name: 'Wednesday', index: 3 },
  { name: 'Thursday', index: 4 },
  { name: 'Friday', index: 5 },
  { name: 'Saturday', index: 6 },
];

const AddScheduleScreen = ({ route, navigation }) => {
  const { userId } = route.params || {};
  if (!userId) {
    return <Text>User ID is not available!</Text>;
  }

  const [scheduleData, setScheduleData] = useState({
    title: '',
    startDateTime: new Date(),
    endDateTime: new Date(),
    description: '',
    location: '',
    repeatDays: [],
  });
  const [isDatePickerVisible, setDatePickerVisibility] = useState({ start: false, end: false });
  const [repeatOption, setRepeatOption] = useState('Never');

  const handleSubmit = async () => {
    const { title, description, location, startDateTime, endDateTime, repeatDays } = scheduleData;

    // Validations
    if (!title) {
      Alert.alert("Error", "Please enter a title.");
      return;
    }
    if (!description) {
      Alert.alert("Error", "Please enter a description.");
      return;
    }
    if (!location) {
      Alert.alert("Error", "Please enter a location.");
      return;
    }
    if (startDateTime >= endDateTime) {
      Alert.alert("Error", "Start date and time must be before end date and time.");
      return;
    }
    if (repeatOption !== 'Never' && repeatDays.length === 0) {
      Alert.alert("Error", "Please select at least one repeat day or set repeat to 'Never'.");
      return;
    }

    try {
      // Fetch existing schedules
      const existingSchedules = await getSchedules(userId);

      // Check for time clashes
      const hasClash = existingSchedules.some((schedule) => {
        const existingStart = new Date(schedule.startDateTime);
        const existingEnd = new Date(schedule.endDateTime);

        // Check if there's an overlap
        const overlap =
          (startDateTime < existingEnd && endDateTime > existingStart) &&
          (
            // For non-repeating schedules
            (repeatOption === 'Never' && schedule.repeatDays.length === 0) ||
            // For repeating schedules, check if repeat days overlap
            (repeatOption !== 'Never' && schedule.repeatDays.some(day => repeatDays.includes(day)))
          );

        return overlap;
      });

      if (hasClash) {
        Alert.alert("Error", "This schedule overlaps with an existing schedule.");
        return;
      }

      // Proceed to add the schedule
      const formattedData = {
        ...scheduleData,
        startDateTime: scheduleData.startDateTime.toISOString(),
        endDateTime: scheduleData.endDateTime.toISOString(),
        repeatDays: repeatOption === 'Never' ? [] : repeatDays,
      };

      await addSchedule(userId, formattedData);
      Alert.alert("Success", "Schedule added successfully.");

      // Clear the form fields
      setScheduleData({
        title: '',
        startDateTime: new Date(),
        endDateTime: new Date(),
        description: '',
        location: '',
        repeatDays: [],
      });
      setRepeatOption('Never');

      // Navigate back
      navigation.goBack();
    } catch (error) {
      console.error("Error adding schedule:", error.message);
      Alert.alert("Error", "Failed to add schedule. Please try again.");
    }
  };

  const handleConfirm = (pickerType, dateTime) => {
    if (pickerType === 'start') {
      setScheduleData({ ...scheduleData, startDateTime: dateTime });
      setDatePickerVisibility({ ...isDatePickerVisible, start: false });
    } else if (pickerType === 'end') {
      setScheduleData({ ...scheduleData, endDateTime: dateTime });
      setDatePickerVisibility({ ...isDatePickerVisible, end: false });
    }
  };

  const showDatePicker = (pickerType) => {
    Keyboard.dismiss();
    setDatePickerVisibility({ ...isDatePickerVisible, [pickerType]: true });
  };

  const hideDatePicker = (pickerType) => {
    setDatePickerVisibility({ ...isDatePickerVisible, [pickerType]: false });
  };

  const toggleRepeatDay = (dayIndex) => {
    setScheduleData((prevState) => {
      const repeatDays = prevState.repeatDays.includes(dayIndex)
        ? prevState.repeatDays.filter((d) => d !== dayIndex)
        : [...prevState.repeatDays, dayIndex];
      return { ...prevState, repeatDays };
    });
  };

  // Determine if the event is a single-day event
  const isSingleDay = scheduleData.startDateTime.toDateString() === scheduleData.endDateTime.toDateString();

  // If the event becomes single-day and repeat option is not 'Never', reset it
  useEffect(() => {
    if (isSingleDay && repeatOption !== 'Never') {
      setRepeatOption('Never');
      setScheduleData((prev) => ({ ...prev, repeatDays: [] }));
    }
  }, [isSingleDay]);

  return (
    <PaperProvider theme={theme}>
      <View style={{ flex: 1 }}>
        {/* Custom App Bar with Back Button */}
        <Appbar.Header style={styles.appbar}>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title="Add Event" />
        </Appbar.Header>

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.container}>

            <TextInput
              label="Title *"
              mode="outlined"
              value={scheduleData.title}
              onChangeText={(text) => setScheduleData({ ...scheduleData, title: text })}
              style={styles.input}
              theme={{ colors: { primary: theme.colors.primary } }}
            />
            <TextInput
              label="Description *"
              mode="outlined"
              value={scheduleData.description}
              onChangeText={(text) => setScheduleData({ ...scheduleData, description: text })}
              style={styles.input}
              theme={{ colors: { primary: theme.colors.primary } }}
            />
            <TextInput
              label="Location *"
              mode="outlined"
              value={scheduleData.location}
              onChangeText={(text) => setScheduleData({ ...scheduleData, location: text })}
              style={styles.input}
              theme={{ colors: { primary: theme.colors.primary } }}
            />

            {/* Start DateTime Picker */}
            <Text style={styles.label}>Start Date & Time: {scheduleData.startDateTime.toLocaleString()}</Text>
            <TouchableOpacity onPress={() => showDatePicker('start')} style={styles.pickerButton}>
              <Text style={styles.pickerButtonText}>Select Start Date & Time</Text>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={isDatePickerVisible.start}
              mode="datetime"
              onConfirm={(date) => handleConfirm('start', date)}
              onCancel={() => hideDatePicker('start')}
              minimumDate={new Date()} // Disable past dates
            />

            {/* End DateTime Picker */}
            <Text style={styles.label}>End Date & Time: {scheduleData.endDateTime.toLocaleString()}</Text>
            <TouchableOpacity onPress={() => showDatePicker('end')} style={styles.pickerButton}>
              <Text style={styles.pickerButtonText}>Select End Date & Time</Text>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={isDatePickerVisible.end}
              mode="datetime"
              onConfirm={(date) => handleConfirm('end', date)}
              onCancel={() => hideDatePicker('end')}
              minimumDate={scheduleData.startDateTime} // End date can't be before start date
            />

            {/* Repeat Days */}
            <Text style={styles.label}>Repeat:</Text>
            <RadioButton.Group onValueChange={value => setRepeatOption(value)} value={repeatOption}>
              <View style={styles.radioButtonContainer}>
                <RadioButton value="Never" />
                <Text>Never</Text>
              </View>
              {!isSingleDay && (
                <View style={styles.radioButtonContainer}>
                  <RadioButton value="Custom" />
                  <Text>Custom</Text>
                </View>
              )}
            </RadioButton.Group>

            {repeatOption === 'Custom' && !isSingleDay && (
              <View style={styles.checkboxContainer}>
                {daysOfWeek.map((day) => (
                  <View key={day.index} style={styles.checkbox}>
                    <Checkbox
                      status={scheduleData.repeatDays.includes(day.index) ? 'checked' : 'unchecked'}
                      onPress={() => toggleRepeatDay(day.index)}
                    />
                    <Text>{day.name}</Text>
                  </View>
                ))}
              </View>
            )}

            <Button
              mode="contained"
              onPress={handleSubmit}
              style={[styles.button, { backgroundColor: theme.colors.primary }]}
              labelStyle={{ color: '#fff', fontSize: 16 }}
            >
              Add Schedule
            </Button>
          </View>
        </ScrollView>
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  appbar: {
    elevation: 4, // Adds shadow for iOS
    shadowColor: '#000', // Adds shadow for Android
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    // padding: 16, // Removed to avoid double padding with scrollContainer
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center', // Center the header if desired
  },
  label: {
    fontSize: 16,
    marginVertical: 8,
    color: '#555',
  },
  input: {
    marginBottom: 12,
  },
  pickerButton: {
    backgroundColor: '#00adf5',
    padding: 10,
    borderRadius: 5,
    marginVertical: 8,
  },
  pickerButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkboxContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  button: {
    marginTop: 16,
  },
  disabledText: {
    color: '#aaa',
  },
});

export default AddScheduleScreen;