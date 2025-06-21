import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Alert,
  RefreshControl,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  ActivityIndicator,
  Text,
  Button,
} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Linking from 'expo-linking';

export default function ViewAdmissionsScreen({ navigation }) {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAdmissions = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Session Expired', 'Please login again.');
        navigation.replace('Login'); // Protect route
        return;
      }

      const res = await fetch('https://school-erp1.onrender.com/api/admission', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setAdmissions(data || []);
      } else {
        Alert.alert('Error', data.message || 'Failed to load admissions');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      Alert.alert('Error', 'Network or server error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [navigation]);

  useEffect(() => {
    fetchAdmissions();
  }, [fetchAdmissions]);

  const downloadExcel = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      Alert.alert('Login required', 'Please login again');
      navigation.replace('Login');
      return;
    }

    const downloadUrl = `https://school-erp1.onrender.com/api/admission/download/excel?token=${token}`;
    Linking.openURL(downloadUrl);
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchAdmissions();
  };

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Title>{item.name}</Title>
        <Paragraph>Email: {item.email}</Paragraph>
        <Paragraph>Phone: {item.phone}</Paragraph>
        <Paragraph>Course: {item.course}</Paragraph>
        <Paragraph>Message: {item.message}</Paragraph>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator animating={true} size="large" style={{ marginTop: 20 }} />
      ) : admissions.length === 0 ? (
        <Text style={styles.emptyText}>No admissions found.</Text>
      ) : (
        <>
          <FlatList
            data={admissions}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            contentContainerStyle={{ paddingBottom: 20 }}
          />

          <Button
            mode="contained"
            onPress={downloadExcel}
            style={styles.downloadButton}
          >
            ⬇️ Download as Excel
          </Button>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f6f7fb',
  },
  card: {
    marginBottom: 12,
    elevation: 3,
    backgroundColor: '#fff',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#888',
  },
  downloadButton: {
    marginTop: 10,
    marginBottom: 20,
    alignSelf: 'center',
    backgroundColor: '#1976D2',
  },
});
