
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { listenSchedules } from '../firebase';
import { Card, Title, Paragraph, Provider as PaperProvider, Text } from 'react-native-paper';
import theme from '../theme';

const DashboardScreen = ({ route }) => {
  const { userId } = route.params || {};
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (!userId) return;
    const unsubscribe = listenSchedules(userId, (schedules) => {
      // Sort by start time
      schedules.sort((a, b) => new Date(a.startDateTime) - new Date(b.startDateTime));
      setEvents(schedules);
    });

    return () => unsubscribe && unsubscribe();
  }, [userId]);

  const renderItem = ({ item }) => (
    <Card style={styles.card} elevation={3}>
      <Card.Content>
        <Title>{item.title}</Title>
        <Paragraph>{new Date(item.startDateTime).toLocaleString()}</Paragraph>
        <Paragraph>{item.location}</Paragraph>
      </Card.Content>
    </Card>
  );

  return (
    <PaperProvider theme={theme}>
      <View style={styles.container}>
        <Text style={styles.title}>Upcoming Events</Text>
        {events.length === 0 ? (
          <Text style={styles.noEvents}>No upcoming events.</Text>
        ) : (
          <FlatList
            data={events}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
          />
        )}
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: theme.colors.primary,
  },
  noEvents: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
  card: {
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  list: {
    flexGrow: 1,
  },
});

export default DashboardScreen;
