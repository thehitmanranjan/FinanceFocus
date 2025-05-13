import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';

// Screens
import HomeScreen from './app/HomeScreen';
import BudgetScreen from './app/BudgetScreen';
import SettingsScreen from './app/SettingsScreen';

// Context providers
import { DateProvider } from './contexts/DateContext';

// Create a query client
const queryClient = new QueryClient();

// Create a stack navigator
const Stack = createStackNavigator();

// Create a custom theme
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#4CAF50', // Green for income
    secondary: '#2196F3', // Blue for expenses
    accent: '#2196F3',
    background: '#F5F5F5',
  },
};

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider theme={theme}>
        <StatusBar style="auto" />
        <DateProvider>
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName="Home"
              screenOptions={{
                headerShown: false,
              }}
            >
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="Budget" component={BudgetScreen} />
              <Stack.Screen name="Settings" component={SettingsScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </DateProvider>
      </PaperProvider>
    </QueryClientProvider>
  );
}