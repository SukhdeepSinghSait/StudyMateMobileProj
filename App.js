import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "react-native-vector-icons";

import LoginScreen from "./screens/LoginScreen";
import SignUpScreen from "./screens/SignUpScreen";
import ScheduleScreen from "./screens/ScheduleScreen";
import AddScheduleScreen from "./screens/AddScheduleScreen";

// Create stack and tab navigators
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Tab Navigator for Schedule and Add Event
const TabNavigator = () => {
  return (
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
        tabBarActiveTintColor: "blue",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen
        name="Schedule"
        component={ScheduleScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Add Event"
        component={AddScheduleScreen}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        {/* Login and SignUp Screens */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUpScreen" component={SignUpScreen} />

        {/* Main Tab Screens */}
        <Stack.Screen
          name="Main"
          component={TabNavigator}
          options={{ headerShown: true }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
