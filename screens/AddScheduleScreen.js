import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { addSchedule } from '../firebase';

const AddScheduleScreen = ({ userId, navigation }) => {
  const [scheduleData, setScheduleData] = useState({
    title: '',
    date: new Date(),
    startTime: new Date(),
    endTime: new Date(),
    description: '',
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  const handleSubmit = async () => {
    if (!scheduleData.title || !scheduleData.description) {
      Alert.alert('Error', 'Please fill in all the required fields.');
      return;
    }

    try {
      const formattedData = {
        ...scheduleData,
        date: scheduleData.date.toISOString().split('T')[0], // Format date as YYYY-MM-DD
        startTime: scheduleData.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        endTime: scheduleData.endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      await addSchedule(userId, formattedData);
      Alert.alert('Success', 'Schedule added successfully.');
      navigation.goBack(); // Navigate back to the schedule screen
    } catch (error) {
      console.error('Error adding schedule:', error);
      Alert.alert('Error', 'Failed to add schedule. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
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
      <Button title="Select Date" onPress={() => setShowDatePicker(true)} />
      {showDatePicker && (
        <DateTimePicker
          value={scheduleData.date}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, date) => {
            setShowDatePicker(false);
            if (date) {
              setScheduleData({ ...scheduleData, date });
            }
          }}
        />
      )}
      <Button title="Select Start Time" onPress={() => setShowStartTimePicker(true)} />
      {showStartTimePicker && (
        <DateTimePicker
          value={scheduleData.startTime}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, time) => {
            setShowStartTimePicker(false);
            if (time) {
              setScheduleData({ ...scheduleData, startTime: time });
            }
          }}
        />
      )}
      <Button title="Select End Time" onPress={() => setShowEndTimePicker(true)} />
      {showEndTimePicker && (
        <DateTimePicker
          value={scheduleData.endTime}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, time) => {
            setShowEndTimePicker(false);
            if (time) {
              setScheduleData({ ...scheduleData, endTime: time });
            }
          }}
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
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
});

export default AddScheduleScreen;
