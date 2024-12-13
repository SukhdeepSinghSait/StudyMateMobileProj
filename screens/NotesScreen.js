import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Alert, Keyboard } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TextInput, Button, Card, Paragraph, IconButton, Provider as PaperProvider, Text } from 'react-native-paper';
import theme from '../theme';

const NotesScreen = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const savedNotes = await AsyncStorage.getItem('notes');
      if (savedNotes) {
        setNotes(JSON.parse(savedNotes));
      }
    } catch (e) {
      console.error('Error loading notes:', e.message);
    }
  };

  const saveNotes = async (updatedNotes) => {
    try {
      await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
      setNotes(updatedNotes);
    } catch (e) {
      console.error('Error saving notes:', e.message);
    }
  };

  const addNote = () => {
    if (!newNote.trim()) {
      Alert.alert('Error', 'Please enter a note.');
      return;
    }
    const updatedNotes = [...notes, { id: Date.now(), text: newNote }];
    saveNotes(updatedNotes);
    setNewNote('');
    Keyboard.dismiss();
  };

  const deleteNote = (id) => {
    Alert.alert('Confirm Delete', 'Are you sure you want to delete this note?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          const updatedNotes = notes.filter((note) => note.id !== id);
          saveNotes(updatedNotes);
        },
      },
    ]);
  };

  const renderItem = ({ item }) => (
    <Card style={styles.card} elevation={3}>
      <Card.Content>
        <View style={styles.cardContent}>
          <Paragraph style={styles.cardText}>{item.text}</Paragraph>
          <IconButton
            icon="delete"
            color="#B00020"
            size={24}
            onPress={() => deleteNote(item.id)}
          />
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <PaperProvider theme={theme}>
      <View style={styles.container}>
        <Text style={styles.title}>Notes</Text>
        <TextInput
          mode="outlined"
          placeholder="Add a new note..."
          value={newNote}
          onChangeText={setNewNote}
          style={styles.input}
        />
        <Button
          mode="contained"
          onPress={addNote}
          style={styles.addButton}
          labelStyle={{ color: '#fff' }}
        >
          Add Note
        </Button>
        <FlatList
          data={notes}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
        />
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
    textAlign: 'center',
    color: theme.colors.primary,
  },
  input: {
    marginBottom: 12,
  },
  addButton: {
    marginBottom: 16,
    backgroundColor: theme.colors.primary,
  },
  list: {
    flexGrow: 1,
  },
  card: {
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
});
export default NotesScreen;
