import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import DestinationScreen from '../screens/DestinationScreen';
import CategoryDetails from '../components/CategoryDetails';
import ProfileScreen from '../screens/ProfileScreen';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignupScreen';
import useAuth from '../../hooks/useAuth';

const Stack = createNativeStackNavigator();

export default function AppNavigation() {
  const user = useAuth();

  if (user) {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Welcome'>
          <Stack.Screen name="Welcome" options={{ headerShown: false }} component={WelcomeScreen} />
          <Stack.Screen name="Home" options={{ headerShown: false }} component={HomeScreen} />
          <Stack.Screen name="Profile" options={{ headerShown: false }} component={ProfileScreen} />
          <Stack.Screen name="CategoryDetails" options={{ headerShown: false }} component={CategoryDetails} />
          <Stack.Screen name="Destination" options={{ headerShown: false }} component={DestinationScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    )
  } else {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Welcome'>
          <Stack.Screen name="SignUp" options={{ headerShown: false }} component={SignUpScreen} />
          <Stack.Screen name="Home" options={{ headerShown: false }} component={HomeScreen} />
          <Stack.Screen name="Login" options={{ headerShown: false }} component={LoginScreen} />
          <Stack.Screen name="Welcome" options={{ headerShown: false }} component={WelcomeScreen} />
          <Stack.Screen name="Profile" options={{ headerShown: false }} component={ProfileScreen} />
          <Stack.Screen name="CategoryDetails" options={{ headerShown: false }} component={CategoryDetails} />
          <Stack.Screen name="Destination" options={{ headerShown: false }} component={DestinationScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    )
  }
}