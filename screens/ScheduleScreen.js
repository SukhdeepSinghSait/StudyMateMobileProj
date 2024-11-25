import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, LogBox, Pressable, Alert } from 'react-native';
import { ExpandableCalendar, AgendaList, CalendarProvider } from 'react-native-calendars';
import { listenSchedules, deleteSchedule } from '../firebase'; // Import Firestore functions

// Suppressing specific warning for ExpandableCalendar defaultProps deprecation
LogBox.ignoreLogs([
  'Warning: ExpandableCalendar: Support for defaultProps will be removed from function components in a future major release.',
]);

const ScheduleScreen = ({ route }) => {
  const { userId } = route.params || {}; // Safely access params
  if (!userId) {
    return <Text>User ID is not available!</Text>; // Error handling for missing userId
  }
  const [items, setItems] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const unsubscribe = listenSchedules(userId, (schedules) => {
      setItems(schedules);
    });

    return () => unsubscribe && unsubscribe(); // Cleanup listener on unmount
  }, [userId]);

  const handleDelete = async (scheduleId) => {
    try {
      await deleteSchedule(scheduleId);
      Alert.alert("Success", "Schedule deleted successfully.");
    } catch (error) {
      console.error("Error deleting schedule:", error.message);
      Alert.alert("Error", "Failed to delete schedule.");
    }
  };

  const renderItem = ({ item }) => (
    <Pressable style={styles.item} onPress={() => Alert.alert(item.title)}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.time}>
        {item.startTime} - {item.endTime}
      </Text>
      <Text>{item.description}</Text>
      <TouchableOpacity onPress={() => handleDelete(item.id)}>
        <Text style={styles.deleteButton}>Delete</Text>
      </TouchableOpacity>
    </Pressable>
  );

  return (
    <CalendarProvider date={selectedDate} onDateChanged={setSelectedDate}>
      <ExpandableCalendar
        firstDay={1}
        markedDates={{
          [selectedDate]: { selected: true },
        }}
        onDayPress={(day) => setSelectedDate(day.dateString)}
      />
      <Text>Welcome User: {userId}</Text>
      <AgendaList
        sections={[
          {
            title: selectedDate,
            data: items.filter((item) => item.date === selectedDate),
          },
        ]}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </CalendarProvider>
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  time: {
    color: '#888',
    fontSize: 14,
  },
  deleteButton: {
    color: 'red',
    marginTop: 5,
    fontSize: 14,
  },
});

export default ScheduleScreen;
