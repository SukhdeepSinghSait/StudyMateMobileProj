import React, { useState } from 'react';
import { Text, View, TextInput, Button, StyleSheet, Alert, Platform, TouchableOpacity, Keyboard } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { addSchedule } from '../firebase';

const AddScheduleScreen = ({ route, navigation }) => {
  const { userId } = route.params || {}; // Safely access params
  if (!userId) {
    return <Text>User ID is not available!</Text>; // Error handling for missing userId
  }
  const [scheduleData, setScheduleData] = useState({
    title: '',
    date: new Date(),
    startTime: new Date(),
    endTime: new Date(),
    description: '',
    location: '',
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  const handleSubmit = async () => {
    const { title, description, location, startTime, endTime } = scheduleData;

    // Validation for empty fields
    if (!title || !description || !location) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    try {
      const formattedData = {
        ...scheduleData,
        date: scheduleData.date.toISOString().split("T")[0], // Format date as YYYY-MM-DD
        startTime: startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), // Format time
        endTime: endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), // Format time
      };

      await addSchedule(userId, formattedData);
      Alert.alert("Success", "Schedule added successfully.");

      // Clear the form fields after successful addition
      setScheduleData({
        title: '',
        date: new Date(),
        startTime: new Date(),
        endTime: new Date(),
        description: '',
        location: '',
      });

      // Navigate back
      navigation.goBack();
    } catch (error) {
      console.error("Error adding schedule:", error.message);
      Alert.alert("Error", "Failed to add schedule. Please try again.");
    }
  };

  const handleDateChange = (event, date) => {
    setShowDatePicker(false);
    if (date) {
      setScheduleData({ ...scheduleData, date });
    }
  };

  const handleTimeChange = (pickerType, event, time) => {
    if (pickerType === 'start') {
      setShowStartTimePicker(false);
      if (time) {
        setScheduleData({ ...scheduleData, startTime: time });
      }
    } else if (pickerType === 'end') {
      setShowEndTimePicker(false);
      if (time) {
        setScheduleData({ ...scheduleData, endTime: time });
      }
    }
  };

  const openDatePicker = () => {
    Keyboard.dismiss(); // Close the keyboard before opening the picker
    setShowDatePicker(true);
  };

  const openStartTimePicker = () => {
    Keyboard.dismiss(); // Close the keyboard before opening the picker
    setShowStartTimePicker(true);
  };

  const openEndTimePicker = () => {
    Keyboard.dismiss(); // Close the keyboard before opening the picker
    setShowEndTimePicker(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add Event</Text>
      <Text style={styles.label}>User ID: {userId}</Text>

      <TextInput
        style={styles.input}
        placeholder="Title *"
        value={scheduleData.title}
        onChangeText={(text) => setScheduleData({ ...scheduleData, title: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Description *"
        value={scheduleData.description}
        onChangeText={(text) => setScheduleData({ ...scheduleData, description: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Location *"
        value={scheduleData.location}
        onChangeText={(text) => setScheduleData({ ...scheduleData, location: text })}
      />

      {/* Date Picker */}
      <Text style={styles.label}>Selected Date: {scheduleData.date.toDateString()}</Text>
      <TouchableOpacity onPress={openDatePicker} style={styles.pickerButton}>
        <Text style={styles.pickerButtonText}>Select Date</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={scheduleData.date}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
        />
      )}

      {/* Start Time Picker */}
      <Text style={styles.label}>Start Time: {scheduleData.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
      <TouchableOpacity onPress={openStartTimePicker} style={styles.pickerButton}>
        <Text style={styles.pickerButtonText}>Select Start Time</Text>
      </TouchableOpacity>
      {showStartTimePicker && (
        <DateTimePicker
          value={scheduleData.startTime}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, time) => handleTimeChange('start', event, time)}
        />
      )}

      {/* End Time Picker */}
      <Text style={styles.label}>End Time: {scheduleData.endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
      <TouchableOpacity onPress={openEndTimePicker} style={styles.pickerButton}>
        <Text style={styles.pickerButtonText}>Select End Time</Text>
      </TouchableOpacity>
      {showEndTimePicker && (
        <DateTimePicker
          value={scheduleData.endTime}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, time) => handleTimeChange('end', event, time)}
        />
      )}

      <Button title="Add Schedule" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginVertical: 8,
    color: '#555',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  pickerButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginVertical: 8,
  },
  pickerButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default AddScheduleScreen;
