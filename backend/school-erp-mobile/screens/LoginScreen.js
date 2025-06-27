import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Card, Title } from 'react-native-paper';
import { saveToken } from '../utils/tokenStorage';
import * as Animatable from 'react-native-animatable';
import * as SecureStore from 'expo-secure-store';


export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const login = async () => {
    setLoading(true);
    try {
      const res = await fetch('https://school-erp1.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email , password }),
      });

      const data = await res.json();
      console.log("🔐 Login response:", data);
      console.log("Token type:", typeof data.token); // should say 'string'
      


     if (res.ok && data.token) {
       await saveToken('token', String(data.token));
        Alert.alert('✅ Login Successful', 'Navigating to Admission Form...');
        navigation.navigate('AdmissionForm');
      } else {
        Alert.alert('❌ Login Failed', data.message || 'Invalid credentials');
      }
    } catch (err) {
      console.error("❌ Network error:", err);
      Alert.alert('Error', 'Network issue. Try again later.');
    } finally {
      setLoading(false);
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
            autoCapitalize="none"
          />
          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            mode="outlined"
            style={styles.input}
          />
          <Animatable.View animation="pulse" iterationCount="infinite">
          <Button
            mode="contained"
            onPress={login}
            style={styles.button}
            loading={loading}
            disabled={loading}
          >
            Login
          </Button>
          <Button
            mode="outlined"
            onPress={() => navigation.navigate('StudentLogin')}
            style={{ marginTop: 10 }}
          >
           Student Login
          </Button>
          </Animatable.View>
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
    backgroundColor: '#f0f2f5',
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
    textAlign: 'center',
  },
  button: {
    marginTop: 10,
  },
});
