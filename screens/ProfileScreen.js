// screens/ProfileScreen.js

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Avatar, Button, Provider as PaperProvider } from 'react-native-paper';
import { auth } from '../firebase';
import theme from '../theme';

const ProfileScreen = ({ navigation }) => {
  const user = auth.currentUser;

  const handleSignOut = () => {
    auth.signOut()
      .then(() => navigation.replace('Login'))
      .catch((error) => console.error('Error signing out:', error));
  };

  return (
    <PaperProvider theme={theme}>
      <View style={styles.container}>
        <Avatar.Icon size={100} icon="account" />
        <Text style={styles.name}>{user?.email}</Text>
        <Button
          mode="contained"
          onPress={handleSignOut}
          style={styles.button}
          labelStyle={{ color: '#fff' }}
        >
          Sign Out
        </Button>
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 50,
    backgroundColor: '#fff',
  },
  name: {
    fontSize: 20,
    marginTop: 20,
  },
  button: {
    marginTop: 30,
    backgroundColor: theme.colors.primary,
  },
});

export default ProfileScreen;