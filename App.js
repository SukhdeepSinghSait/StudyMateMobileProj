// App.js

import React from "react";
import { SafeAreaView, StyleSheet, StatusBar, Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";

import LoginScreen from "./screens/LoginScreen";
import SignUpScreen from "./screens/SignUpScreen";
import ScheduleStack from "./navigation/ScheduleStack";
import ProfileScreen from "./screens/ProfileScreen";
import NotesScreen from "./screens/NotesScreen";
import DashboardScreen from "./screens/DashboardScreen"; // Import DashboardScreen
import { auth } from './firebase';

// Create stack and tab navigators
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Tab Navigator for Dashboard, Schedule, Profile, and Notes
const TabNavigator = ({ route }) => {
  const { userId } = route.params || {};

  return (
    <SafeAreaView style={styles.safeArea}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === "Dashboard") {
              iconName = focused ? "home" : "home-outline";
            } else if (route.name === "Schedule") {
              iconName = focused ? "calendar" : "calendar-outline";
            } else if (route.name === "Notes") {
              iconName = focused ? "book" : "book-outline";
            } else if (route.name === "Profile") {
              iconName = focused ? "person" : "person-outline";
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "#9ac2eb", // was 00adf
          tabBarInactiveTintColor: "1E282D",
        })}
      >
        <Tab.Screen
          name="Dashboard"
          component={DashboardScreen} // Add DashboardScreen here
          initialParams={{ userId }}
          options={{ headerShown: false }}
        />

        <Tab.Screen
          name="Schedule"
          component={ScheduleStack}
          initialParams={{ userId }}
          options={{ headerShown: false }}
        />
        
        <Tab.Screen
          name="Notes"
          component={NotesScreen}
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
        backgroundColor="#fff"
        translucent={true}
      />
      <Stack.Navigator initialRouteName="Login">
        {/* Login and SignUp Screens */}
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />

        {/* Main Tab Screens */}
        <Stack.Screen
          name="Main"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});
