// ScheduleScreen.js

import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert, LogBox } from 'react-native';
import { ExpandableCalendar, AgendaList, CalendarProvider } from 'react-native-calendars';
import { listenSchedules, deleteSchedule } from '../firebase';
import { Card, Title, Paragraph, IconButton, Provider as PaperProvider, Text, ActivityIndicator, FAB } from 'react-native-paper';
import theme from '../theme';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Suppress warnings for ExpandableCalendar defaultProps
LogBox.ignoreLogs([
  'Warning: ExpandableCalendar: Support for defaultProps will be removed from function components in a future major release.',
]);

const ScheduleScreen = ({ route, navigation }) => {
  const { userId } = route.params || {};
  if (!userId) {
    return <Text style={{ color: theme.colors.text }}>User ID is not available!</Text>;
  }
  const [items, setItems] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = listenSchedules(userId, (schedules) => {
      console.log("Fetched Schedules:", schedules);
      setItems(schedules);
      setIsLoading(false);
    });

    return () => unsubscribe && unsubscribe();
  }, [userId]);

  const handleDelete = (scheduleId) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this schedule?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteSchedule(scheduleId);
              Alert.alert("Success", "Schedule deleted successfully.");
            } catch (error) {
              console.error("Error deleting schedule:", error.message);
              Alert.alert("Error", "Failed to delete schedule.");
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const renderItem = ({ item }) => (
    <Card style={styles.card} elevation={3}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <Title style={styles.cardTitle}>{item.title}</Title>
          <IconButton
            icon="delete"
            color="#B00020"
            size={24}
            onPress={() => handleDelete(item.id)}
          />
        </View>
        <View style={styles.cardRow}>
          <Ionicons name="time-outline" size={20} color="#555" />
          <Paragraph style={styles.cardText}>
            {new Date(item.startDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
            {new Date(item.endDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Paragraph>
        </View>
        {item.location ? (
          <View style={styles.cardRow}>
            <Ionicons name="location-outline" size={20} color="#555" />
            <Paragraph style={styles.cardText}>Location: {item.location}</Paragraph>
          </View>
        ) : null}
        <Paragraph style={styles.cardDescription}>{item.description}</Paragraph>
      </Card.Content>
    </Card>
  );

  return (
    <PaperProvider theme={theme}>
      {isLoading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <View style={styles.container}>
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
                monthTextColor: theme.colors.text,
                dayTextColor: theme.colors.text,
                textSectionTitleColor: theme.colors.text,
                calendarBackground: '#f8f9fa',
              }}
            />
            <AgendaList
              sections={[
                {
                  title: selectedDate,
                  data: items.filter((item) => {
                    const selectedDateObj = new Date(`${selectedDate}T00:00:00Z`); // UTC time
                    const itemStartDate = new Date(item.startDateTime);
                    const itemEndDate = new Date(item.endDateTime);

                    // Adjust dates to UTC for comparison
                    const selectedDateUTC = Date.UTC(
                      selectedDateObj.getUTCFullYear(),
                      selectedDateObj.getUTCMonth(),
                      selectedDateObj.getUTCDate()
                    );
                    const itemStartDateUTC = Date.UTC(
                      itemStartDate.getUTCFullYear(),
                      itemStartDate.getUTCMonth(),
                      itemStartDate.getUTCDate()
                    );
                    const itemEndDateUTC = Date.UTC(
                      itemEndDate.getUTCFullYear(),
                      itemEndDate.getUTCMonth(),
                      itemEndDate.getUTCDate()
                    );

                    // Check if selectedDate is within the event's date range
                    if (selectedDateUTC < itemStartDateUTC || selectedDateUTC > itemEndDateUTC) {
                      return false;
                    }

                    // Non-repeating event on selectedDate
                    const itemDate = itemStartDate.toISOString().split('T')[0];
                    if (item.repeatDays.length === 0 && itemDate === selectedDate) {
                      return true;
                    }

                    // For repeating events, check if the selectedDate matches a repeat day
                    const repeatDayIndex = selectedDateObj.getUTCDay(); // 0-6, UTC
                    return item.repeatDays.includes(repeatDayIndex);
                  }),
                },
              ]}
              renderItem={renderItem}
              keyExtractor={(item, index) => `${item.id}-${selectedDate}-${index}`} // Unique keys
            />
          </CalendarProvider>
          <FAB
            style={styles.fab}
            icon="plus"
            color="#fff"
            onPress={() => navigation.navigate('AddScheduleScreen', { userId })}
          />
        </View>
      )}
    </PaperProvider>
  );
};
const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    backgroundColor: theme.colors.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    color: theme.colors.text,
    fontWeight: 'bold',
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardText: {
    marginLeft: 8,
    fontSize: 14,
    color: theme.colors.text,
  },
  cardDescription: {
    fontSize: 14,
    color: theme.colors.placeholder,
    marginTop: 4,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.primary,
  },
});


export default ScheduleScreen;