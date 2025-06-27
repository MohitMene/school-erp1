import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Button, Card, Title } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function StudentDashboardScreen({ navigation }) {
  const [marks, setMarks] = useState([]);

  const fetchMarks = async () => {
    const token = await AsyncStorage.getItem('studentToken');
    try {
      const res = await fetch('https://school-erp1.onrender.com/api/student/marks', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setMarks(data.marks);
      }
    } catch (err) {
      console.log("Error fetching marks:", err);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('studentToken');
    navigation.reset({ index: 0, routes: [{ name: 'StudentLogin' }] });
  };

  useEffect(() => {
    fetchMarks();
  }, []);

  return (
    <View style={styles.container}>
      <Title>📊 Your Marks</Title>
      <FlatList
        data={marks}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Content>
              <Text>📚 Subject: {item.subject}</Text>
              <Text>📝 Marks: {item.marks}</Text>
              <Text>📆 Exam: {item.exam}</Text>
            </Card.Content>
          </Card>
        )}
      />
      <Button onPress={handleLogout} mode="outlined" style={styles.logout}>
        Logout
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  card: { marginBottom: 10 },
  logout: { marginTop: 20 },
});
