// App.js

import React from "react";
import { SafeAreaView, StyleSheet, StatusBar, Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";

import LoginScreen from "./screens/LoginScreen";
import SignUpScreen from "./screens/SignUpScreen";
import ScheduleStack from "./navigation/ScheduleStack"; // Updated import
import ProfileScreen from "./screens/ProfileScreen";
import { auth } from './firebase';

// Create stack and tab navigators
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Tab Navigator for Schedule and Profile
const TabNavigator = ({ route }) => {
  const { userId } = route.params || {};

  return (
    <SafeAreaView style={styles.safeArea}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === "Schedule") {
              iconName = focused ? "calendar" : "calendar-outline";
            } else if (route.name === "Profile") {
              iconName = focused ? "person" : "person-outline";
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "#00adf5",
          tabBarInactiveTintColor: "gray",
        })}
      >
        <Tab.Screen
          name="Schedule"
          component={ScheduleStack} // Use ScheduleStack instead of ScheduleScreen
          initialParams={{ userId }} // Pass userId here
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          initialParams={{ userId }}
          options={{ headerShown: false }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar
        barStyle={Platform.OS === "ios" ? "dark-content" : "dark-content"}
        backgroundColor="#fff" // Matches background of SafeAreaView
        translucent={true} // Makes status bar transparent
      />
      <Stack.Navigator initialRouteName="Login">
        {/* Login and SignUp Screens */}
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />

        {/* Main Tab Screens */}
        <Stack.Screen
          name="Main"
          component={TabNavigator}
          options={{ headerShown: false }} // Hide header for Main
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff", // Optional: Set a background color for better visuals
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});