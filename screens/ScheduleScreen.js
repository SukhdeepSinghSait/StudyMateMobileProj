import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert, LogBox } from 'react-native';
import { ExpandableCalendar, AgendaList, CalendarProvider } from 'react-native-calendars';
import { listenSchedules, deleteSchedule } from '../firebase'; // Import Firestore functions
import { Card, Title, Paragraph, Button, Provider as PaperProvider, Text } from 'react-native-paper';
import theme from '../theme'; // Import the custom theme

// Suppress warnings for ExpandableCalendar defaultProps
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
    <Card style={styles.card}>
      <Card.Content>
        <Title>{item.title}</Title>
        <Paragraph>{item.startTime} - {item.endTime}</Paragraph>
        <Paragraph>{item.description}</Paragraph>
      </Card.Content>
      <Card.Actions>
        <Button
          mode="contained"
          buttonColor={theme.colors.error}
          textColor="#fff"
          onPress={() => handleDelete(item.id)}
        >
          Delete
        </Button>
      </Card.Actions>
    </Card>
  );

  return (
    <PaperProvider theme={theme}>
      <CalendarProvider date={selectedDate} onDateChanged={setSelectedDate}>
        <ExpandableCalendar
          firstDay={1}
          markedDates={{
            [selectedDate]: { selected: true },
          }}
          onDayPress={(day) => setSelectedDate(day.dateString)}
          theme={{
            selectedDayBackgroundColor: theme.colors.primary,
            todayTextColor: theme.colors.primary,
            arrowColor: theme.colors.primary,
          }}
        />
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
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 10,
    borderRadius: 8,
    backgroundColor: '#fff', // Ensure the background color is white
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
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
    color: '#f00',
    marginTop: 5,
    fontSize: 14,
  },
});

export default ScheduleScreen;