import React, { useContext, useEffect, useState } from 'react'

import {  View, Text, TextInput, StyleSheet, Alert, Button, Image, TouchableOpacity, FlatList, Picker,Platform  } from 'react-native'
import { MyContext } from '../../context/ContextProvider';
import axios from 'axios';
const ShowJobRequest=({route})=>{
    const { url } = useContext(MyContext);
    const jobRequestID = route.params?.jobRequestID ?? null;

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
       return (
        <View style={styles.container}>
            <Text style={styles.title}>Job Request Details</Text>
            <Image
                source={{ uri: `${url}/${jobRequest.image}` }}
                style={styles.image}
            />
            <Text style={styles.label}>User:</Text>
            <Text style={styles.text}>{jobRequest.fullName}</Text>

            <Text style={styles.label}>Address:</Text>
            <Text style={styles.text}>{jobRequest.address}</Text>

            <Text style={styles.label}>Description:</Text>
            <Text style={styles.text}>{jobRequest.description}</Text>

            <Text style={styles.label}>Scheduled Time:</Text>
            <Text style={styles.text}>{new Date(jobRequest.time).toLocaleString()}</Text>

            <Text style={styles.label}>Request Sent At:</Text>
            <Text style={styles.text}>{new Date(jobRequest.timeSend).toLocaleString()}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
    },
    text: {
        fontSize: 16,
        marginBottom: 10,
    },
});
export default ShowJobRequest