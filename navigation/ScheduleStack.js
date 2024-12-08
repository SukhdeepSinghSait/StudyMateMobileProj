// navigation/ScheduleStack.js

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ScheduleScreen from '../screens/ScheduleScreen';
import AddScheduleScreen from '../screens/AddScheduleScreen';

const Stack = createStackNavigator();

const ScheduleStack = ({ route }) => {
  const { userId } = route.params || {};

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ScheduleScreen"
        component={ScheduleScreen}
        initialParams={{ userId }}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddScheduleScreen"
        component={AddScheduleScreen}
        initialParams={{ userId }}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default ScheduleStack;