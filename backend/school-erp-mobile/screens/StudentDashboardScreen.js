import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, Alert, Dimensions, View } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BarChart } from 'react-native-chart-kit';

export default function StudentDashboardScreen({ navigation }) {
  const [marks, setMarks] = useState([]);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = await AsyncStorage.getItem('studentToken');
      if (!token) {
        Alert.alert('Session Expired', 'Please login again');
        navigation.navigate('StudentLogin');
        return;
      }

      try {
        // Fetch Marks
        const marksRes = await fetch('https://school-erp1.onrender.com/api/marks/student', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const marksData = await marksRes.json();
        if (marksRes.ok) setMarks(marksData.data || marksData.marks);

        // Fetch Profile
        const profileRes = await fetch('https://school-erp1.onrender.com/api/student/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const profileData = await profileRes.json();
        if (profileRes.ok) setProfile(profileData.profile);

      } catch (err) {
        console.error('❌ Fetch error:', err);
        Alert.alert('Error', 'Failed to load dashboard data');
      }
    };

    fetchDashboardData();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('studentToken');
    navigation.reset({ index: 0, routes: [{ name: 'StudentLogin' }] });
  };

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Text style={styles.subject}>{item.subject}</Text>
        <Text style={styles.marks}>Marks: {item.marks}</Text>
      </Card.Content>
    </Card>
  );

  const chartData = {
    labels: marks.map((m) => m.subject),
    datasets: [
      {
        data: marks.map((m) => m.marks),
      },
    ],
  };

  return (
    <FlatList
      ListHeaderComponent={
        <View style={{ padding: 16 }}>
          <Text style={styles.title}>🎓 Student Dashboard</Text>

          {profile && (
            <Card style={styles.profileCard}>
              <Card.Content>
                <Text style={styles.profileTitle}>👤 Profile</Text>
                <Text>Username: {profile.username}</Text>
                <Text>ID: {profile._id}</Text>
              </Card.Content>
            </Card>
          )}

          {marks.length > 0 && (
            <BarChart
              data={chartData}
              width={Dimensions.get('window').width - 32}
              height={220}
              fromZero
              yAxisSuffix="%"
              chartConfig={{
                backgroundColor: '#fff',
                backgroundGradientFrom: '#E3F2FD',
                backgroundGradientTo: '#E3F2FD',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(25, 118, 210, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
              style={{ marginBottom: 24, borderRadius: 10 }}
            />
          )}
        </View>
      }
      data={marks}
      keyExtractor={(item, index) => index.toString()}
      renderItem={renderItem}
      contentContainerStyle={{ paddingBottom: 40 }}
      ListFooterComponent={
        <Button mode="outlined" onPress={handleLogout} style={styles.logoutButton}>
          Logout
        </Button>
      }
    />
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, marginBottom: 20, textAlign: 'center' },
  profileCard: {
    backgroundColor: '#FFF8E1',
    marginBottom: 20,
    borderRadius: 10,
  },
  profileTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  card: {
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#E3F2FD',
    borderRadius: 10,
  },
  subject: { fontSize: 18, fontWeight: 'bold' },
  marks: { fontSize: 16, marginTop: 4 },
  logoutButton: {
    marginTop: 20,
    alignSelf: 'center',
    borderColor: '#1976D2',
  },
});
