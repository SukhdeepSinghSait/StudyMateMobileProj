import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, LogBox } from 'react-native';
import { ExpandableCalendar, AgendaList, CalendarProvider } from 'react-native-calendars';
import { getSchedules, deleteSchedule } from '../firebase'; // Import Firestore functions

// Suppressing specific warning for ExpandableCalendar defaultProps deprecation
LogBox.ignoreLogs([
  'Warning: ExpandableCalendar: Support for defaultProps will be removed from function components in a future major release.',
]);

const ScheduleScreen = ({ userId }) => {
  const [items, setItems] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    // Adding dummy schedules for testing
    const today = new Date().toISOString().split('T')[0]; // Today's date in "YYYY-MM-DD" format
    const dummySchedules = [
      {
        title: 'Morning Yoga',
        date: today,
        time: '07:00 AM',
        description: 'Start the day with a relaxing yoga session.',
        id: '1',
      },
      {
        title: 'Team Meeting',
        date: today,
        time: '10:00 AM',
        description: 'Weekly sync with the project team.',
        id: '2',
      },
      {
        title: 'Doctor Appointment',
        date: today,
        time: '02:00 PM',
        description: 'Regular check-up at Health Center.',
        id: '3',
      },
    ];
    setItems(dummySchedules);
  }, []);

  const handleDelete = async (scheduleId) => {
    try {
      const updatedItems = items.filter(item => item.id !== scheduleId);
      setItems(updatedItems);
    } catch (error) {
      console.error('Error deleting schedule:', error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.time}>{item.time}</Text>
      <Text>{item.description}</Text>
      <TouchableOpacity onPress={() => handleDelete(item.id)}>
        <Text style={styles.deleteButton}>Delete</Text>
      </TouchableOpacity>
    </View>
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
      <AgendaList
        sections={[{
          title: selectedDate,
          data: items.filter(item => item.date === selectedDate),
        }]}
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
