// App.js
import React from 'react';
import { NavigationContainer, DefaultTheme as NavDefault, DarkTheme as NavDark } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider , MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
import LoginScreen from './screens/LoginScreen';
import AdmissionForm from './screens/AdmissionForm';
import PaymentScreen from './screens/PaymentScreen';
import ViewAdmissionsScreen from './screens/ViewAdmissionsScreen';
import StudentLoginScreen from './screens/StudentLoginScreen';
import StudentDashboardScreen from './screens/StudentDashboardScreen';


const Stack = createNativeStackNavigator();

const darkTheme = {
  ...NavDark,
  colors: {
    ...NavDark.colors,
    background: '#121212',
    card: '#1f1f1f',
    text: '#ffffff',
  },
};

export default function App() {
  const useDarkMode = true; // change to false for light theme
  return (
    <PaperProvider theme={useDarkMode ? MD3DarkTheme : MD3LightTheme}>
      <NavigationContainer theme={useDarkMode ? darkTheme : NavDefault}>
        <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false, animation: 'slide_from_right',animationTypeForReplace: 'push',}}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="AdmissionForm" component={AdmissionForm} />
          <Stack.Screen name="Payment" component={PaymentScreen} />
          <Stack.Screen name="ViewAdmissions" component={ViewAdmissionsScreen} />
          <Stack.Screen name="StudentLogin" component={StudentLoginScreen} />
          <Stack.Screen name="StudentDashboard" component={StudentDashboardScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
