import React, { useState, useCallback } from 'react';
import { ScrollView, View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Card, Title } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { deleteToken, getToken } from '../utils/tokenStorage';
import * as Animatable from 'react-native-animatable';


export default function AdmissionForm({ navigation }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    course: '',
    message: '',
  });

  // ✅ Protect screen by checking if token exists
  useFocusEffect(
    useCallback(() => {
      const checkAuth = async () => {
        const token = await getToken('token');
        if (!token) {
          Alert.alert('Session Expired', 'Please login again.');
          navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
        }
      };
      checkAuth();
    }, [])
  );

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const submitForm = async () => {
    try {
      const res = await fetch('https://school-erp1.onrender.com/api/admission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        Alert.alert('✅ Admission Submitted!');
        navigation.navigate('Payment');
      } else {
        Alert.alert('❌ Error', data.message || 'Submission failed');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('⚠️ Network Error', 'Please try again');
    }
  };

  const handleLogout = async () => {
    await deleteToken('token');
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Admission Form</Title>

          <TextInput
            label="Name"
            mode="outlined"
            value={form.name}
            onChangeText={(v) => handleChange('name', v)}
            style={styles.input}
          />
          <TextInput
            label="Email"
            mode="outlined"
            value={form.email}
            onChangeText={(v) => handleChange('email', v)}
            style={styles.input}
            keyboardType="email-address"
          />
          <TextInput
            label="Phone"
            mode="outlined"
            value={form.phone}
            onChangeText={(v) => handleChange('phone', v)}
            style={styles.input}
            keyboardType="phone-pad"
          />
          <TextInput
            label="Course"
            mode="outlined"
            value={form.course}
            onChangeText={(v) => handleChange('course', v)}
            style={styles.input}
          />
          <TextInput
            label="Message"
            mode="outlined"
            value={form.message}
            onChangeText={(v) => handleChange('message', v)}
            style={styles.input}
            multiline
            numberOfLines={3}
          />

          <Button mode="contained" onPress={submitForm} style={styles.button}>
            Submit
          </Button>

          <Button
            mode="outlined"
            onPress={() => navigation.navigate('ViewAdmissions')}
            style={styles.viewButton}
          >
            📄 View Submissions
          </Button>

          <Animatable.View animation="pulse" iterationCount="infinite">
          <Button
            mode="contained"
            onPress={handleLogout}
            style={styles.logoutButton}
            buttonColor="#d32f2f"
            textColor="white"
          >
            🔓 Logout
          </Button>
          </Animatable.View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f1f3f6',
    flexGrow: 1,
  },
  card: {
    padding: 15,
    elevation: 4,
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
    alignSelf: 'center',
  },
  input: {
    marginBottom: 12,
  },
  button: {
    marginTop: 15,
  },
  viewButton: {
    marginTop: 10,
    borderColor: '#4CAF50',
  },
  logoutButton: {
    marginTop: 20,
  },
});
