// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';
import LoginScreen from './screens/LoginScreen';
import AdmissionForm from './screens/AdmissionForm';
import PaymentScreen from './screens/PaymentScreen';
import ViewAdmissionsScreen from './screens/ViewAdmissionsScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="AdmissionForm" component={AdmissionForm} />
          <Stack.Screen name="Payment" component={PaymentScreen} />
          <Stack.Screen name="ViewAdmissions" component={ViewAdmissionsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
