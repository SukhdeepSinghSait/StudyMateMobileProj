import React from "react";
import { SafeAreaView, StyleSheet, StatusBar, Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "react-native-vector-icons";

import LoginScreen from "./screens/LoginScreen";
import SignUpScreen from "./screens/SignUpScreen";
import ScheduleScreen from "./screens/ScheduleScreen";
import AddScheduleScreen from "./screens/AddScheduleScreen";
import { auth } from './firebase';

// Create stack and tab navigators
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Tab Navigator for Schedule and Add Event
const TabNavigator = () => {
  const userId = auth.currentUser?.uid; // Dynamically fetch userId

  return (
    <SafeAreaView style={styles.safeArea}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === "Schedule") {
              iconName = focused ? "calendar" : "calendar-outline";
            } else if (route.name === "Add Event") {
              iconName = focused ? "add-circle" : "add-circle-outline";
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "#00adf5",
          tabBarInactiveTintColor: "gray",
        })}
      >
        <Tab.Screen
          name="Schedule"
          component={ScheduleScreen}
          initialParams={{ userId }} // Pass userId here
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name="Add Event"
          component={AddScheduleScreen}
          initialParams={{ userId }} // Pass userId here as well
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
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUpScreen" component={SignUpScreen} />

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
