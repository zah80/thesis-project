import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WorkerHome = () => {
  const [data, setData] = useState([]);
const fetchRatings = async () => {
  try {
    const token = await AsyncStorage.getItem('token'); 

    if (!token) {
      console.error('Token is not available');
      setError('Token is not available');
      return;
    }

    console.log('Retrieved Token:', token);

    const response = await axios.get('http://192.168.100.10:3000/api/rating/token', {headers: {token}});

    console.log('Ratings Response:', response.data);
    setData(response.data);
  } catch (error) {
    console.error('Error fetching ratings:', error.message);
    setError(error.message);
  }
};

  useEffect(() => {
    fetchRatings();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Worker</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity>
            <Icon name="bell" size={24} color="white" style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Icon name="envelope" size={24} color="white" style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.greeting}>Hello, "worker name"</Text>
        <Text style={styles.welcome}>Welcome back!</Text>

        <View style={styles.earningsContainer}>
          <TouchableOpacity style={styles.earningsBox}>
            <Text style={styles.earningsTitle}>Today's Earnings</Text>
            <Text style={styles.earningsAmount}>$39.70</Text>
          </TouchableOpacity>

          <View style={styles.earningsRow}>
            <View style={styles.equalBox}>
              <Text style={styles.earningsTitle}>Monthly Earnings</Text>
              <Text style={styles.earningsAmount}>$332.50</Text>
            </View>
            <View style={styles.equalBox}>
              <Text style={styles.earningsTitle}>Pure Monthly Earnings</Text>
              <Text style={styles.earningsAmount}>$295.20</Text>
            </View>
          </View>

          <View style={styles.earningsRow}>
            <View style={styles.equalBox}>
              <Text style={styles.earningsTitle}>Upcoming Services</Text>
              <Text style={styles.earningsAmount}>12</Text>
            </View>
            <View style={styles.equalBox}>
              <Text style={styles.earningsTitle}>Total Bookings</Text>
              <Text style={styles.earningsAmount}>85</Text>
            </View>
          </View>
        </View>

        <Text style={styles.ratingsTitle}>Ratings</Text>

        {data.length > 0 ? (
            data.map((item, index) => (
              <View key={index} style={styles.ratingBox}>
                <View style={styles.ratingHeader}>
                  <Icon name="user-circle" size={40} color="white" style={styles.reviewerImage} />
                  <View>
                    <Text style={styles.reviewerName}>{item.fullName}</Text>
                    <Text style={styles.ratingDate}>{item.date || 'Unknown Date'}</Text>
                  </View>
                  <Text style={styles.ratingValue}>{item.rate || 'N/A'}</Text>
                </View>
                <Text style={styles.ratingContent}>{item.comment || 'No Comment'}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.noRatings}>No ratings available</Text>
          )}


      </ScrollView>

      <View style={styles.navigation}>
        <TouchableOpacity>
          <Icon name="home" size={30} color="white" style={styles.navIcon} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon name="briefcase" size={30} color="white" style={styles.navIcon} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon name="bell" size={30} color="white" style={styles.navIcon} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon name="user" size={30} color="white" style={styles.navIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3a2d5c',
  },
  header: {
    backgroundColor: '#ff66a3',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 25,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  scrollContent: {
    paddingTop: 70,
    paddingBottom: 70, 
  },
  headerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  icon: {
    marginLeft: 10,
  },
  greeting: {
    color: 'white',
    fontSize: 18,
    margin: 10,
  },
  welcome: {
    color: 'white',
    fontSize: 18,
    marginLeft: 10,
  },
  earningsContainer: {
    margin: 10,
  },
  earningsBox: {
    backgroundColor: '#4b3b7c',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  equalBox: {
    flex: 1,
    backgroundColor: '#4b3b7c',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    marginHorizontal: 5,
  },
  earningsTitle: {
    color: 'white',
    fontSize: 16,
  },
  earningsAmount: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 5,
  },
  earningsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ratingsTitle: {
    color: 'white',
    fontSize: 18,
    margin: 10,
  },
  ratingBox: {
    backgroundColor: '#2c1b3c',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    marginHorizontal: 10,
  },
  ratingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewerImage: {
    marginRight: 10,
  },
  reviewerName: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  ratingDate: {
    color: 'white',
    fontSize: 12,
  },
  ratingValue: {
    color: 'green',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 'auto',
  },
  ratingService: {
    color: 'white',
    marginTop: 5,
  },
  ratingContent: {
    color: 'white',
    marginTop: 5,
  },
  noRatings: {
    color: 'white',
    textAlign: 'center',
    marginTop: 20,
  },
  navigation: {
    backgroundColor: '#ff66a3',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navIcon: {
    marginHorizontal: 10,
  },
});

export default WorkerHome;
