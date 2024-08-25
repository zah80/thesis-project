import React, { useContext, useEffect, useState } from 'react'

import { View, Text, Image, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { MyContext } from '../../context/ContextProvider';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const ShowJobRequest=({route})=>{
    const { url } = useContext(MyContext);
    const jobRequestID = route.params?.jobRequestID ?? null;
const navigation=useNavigation();
    const [jobRequest, setJobRequest] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJobRequestDetails = async () => {
            console.log("id jobrequest",jobRequestID);
            try {
                const response = await axios.get(`${url}/api/job_requests/one/${jobRequestID}`);
                setJobRequest(response.data);
               
            } catch (error) {
                console.error('Error fetching job request details', error);
               
            }
        };
        if(jobRequestID){
            fetchJobRequestDetails();
        }
    }, [jobRequestID]);

   

    if (!jobRequest) {
        return <Text>No job request found.</Text>;
    }
    const InfoItem = ({ icon, label, value }) => (
        <View style={styles.infoItem}>
          <Icon name={icon} size={24} color="#3498db" style={styles.icon} />
          <View style={styles.infoContent}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.value}>{value}</Text>
          </View>
        </View>
      );
    
      return (
        <SafeAreaView style={styles.container}>
          <ScrollView style={styles.scrollView}>
            <View style={styles.header}>
              <Text style={styles.title}>Job Request Details</Text>
            </View>
            <Image
              source={{ uri: `${url}/${jobRequest.image}` }}
              style={styles.image}
            />
            <View style={styles.detailsContainer}>
              <InfoItem 
                icon="person" 
                label="User" 
                value={jobRequest.fullName} 
              />
              <InfoItem 
                icon="location-on" 
                label="Address" 
                value={jobRequest.address} 
              />
              <InfoItem 
                icon="description" 
                label="Description" 
                value={jobRequest.description} 
              />
              <InfoItem 
                icon="schedule" 
                label="Scheduled Time" 
                value={new Date(jobRequest.time).toLocaleString()} 
              />
              <InfoItem 
                icon="send" 
                label="Request Sent At" 
                value={new Date(jobRequest.timeSend).toLocaleString()} 
              />
            </View>
          </ScrollView>
          <TouchableOpacity style={styles.messageButton} onPress={()=>navigation.navigate("messages",{userID:jobRequest.userID})}>
        <Icon name="message" size={24} color="#fff" />
      </TouchableOpacity>
      
        </SafeAreaView>
      );
    };
    
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
      },
      scrollView: {
        flex: 1,
      },
      header: {
        backgroundColor: '#3498db',
        padding: 20,
        alignItems: 'center',
      },
      title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
      },
      image: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
      },
      detailsContainer: {
        padding: 20,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        marginTop: -30,
      },
      infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
      },
      icon: {
        marginRight: 15,
      },
      infoContent: {
        flex: 1,
      },
      label: {
        fontSize: 14,
        color: '#7f8c8d',
        marginBottom: 5,
      },
      value: {
        fontSize: 16,
        color: '#2c3e50',
      },
      messageButton: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        backgroundColor: '#3498db',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
    });
export default ShowJobRequest