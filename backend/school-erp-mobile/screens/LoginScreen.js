// screens/LoginScreen.js
import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Card, Title, Text } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const login = async () => {
    try {
      const res = await fetch('https://school-erp1.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, password }),
      });

      const data = await res.json();
      console.log("🔐 Login response:", data);

      if (res.ok && data.token) {
        await AsyncStorage.setItem('token', data.token);
        Alert.alert('✅ Login Successful', 'Navigating to Admission Form...');
        navigation.navigate('AdmissionForm');
      } else {
        Alert.alert('❌ Login Failed', data.message || 'Invalid credentials');
      }
    } catch (err) {
      console.error("❌ Network error:", err);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Admin Login</Title>

          <TextInput
            label="Username"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            mode="outlined"
            style={styles.input}
          />
          <Button mode="contained" onPress={login} style={styles.button}>
            Login
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
  },
  card: {
    padding: 20,
    elevation: 4,
  },
  input: {
    marginBottom: 15,
  },
  title: {
    marginBottom: 20,
    fontSize: 24,
    alignSelf: 'center',
  },
  button: {
    marginTop: 10,
  },
});
