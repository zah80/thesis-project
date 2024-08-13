import React, { useContext, useState } from 'react'
import {  View, Text, TextInput, StyleSheet, Alert, Button, Image, TouchableOpacity, FlatList, Picker,Platform  } from 'react-native'
import { MyContext } from '../../context/ContextProvider'
import DateTimePicker from '@react-native-community/datetimepicker';
import axios  from 'axios';
const SendJobRequest = ({route}) => {
    const { url, tokenUser } = useContext(MyContext);
    const laborerID = route.params?.laborerID ?? null;

    const [address, setAddress] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleDateChange = (event, selectedDate) => {
        if (selectedDate) {
            setDate(selectedDate);
            if (Platform.OS === 'android') {
                setShowDatePicker(false); 
            }
        } else if (Platform.OS === 'android') {
            setShowDatePicker(false); 
        }
    };

    const showDatePickerDialog = () => {
        setShowDatePicker(true);
    };

    const handleSubmit = async () => {
        if (!address || !description) {
            Alert.alert('Error', 'Please fill all fields');
            return;
        }
console.log("address,description",address,"     ",description);
        try {
            const response = await axios.post(
                `${url}/api/job_requests/add/${laborerID}`,
                {
                    address,
                    description,
                    time: date.toISOString(),  
                },
                {
                    headers: {
                        token: tokenUser,
                    },
                }
            );

            if (response.status === 201) {
                Alert.alert('Success', 'Job request sent successfully');
               setAddress(""); 
               setDescription(""); 
            } else {
                Alert.alert('Error', 'Failed to send job request');
            }
        } catch (error) {
            console.error('Error sending job request', error);
            Alert.alert('Error', 'An error occurred while sending the job request');
        }
    };

    return (
        <View>
            <TextInput
                placeholder="Address"
                value={address}
                onChangeText={setAddress}
                style={{ margin: 10, padding: 10, borderWidth: 1, borderColor: '#ccc' }}
            />
            <TextInput
                placeholder="Description"
                value={description}
                onChangeText={setDescription}
                style={{ margin: 10, padding: 10, borderWidth: 1, borderColor: '#ccc' }}
            />
            <Button title="Select Time" onPress={showDatePickerDialog} />
            {showDatePicker && (
                <DateTimePicker
                    value={date}
                    mode="datetime"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={handleDateChange}
                />
            )}
            <Button title="Send Job Request" onPress={handleSubmit} />
        </View>
    );
}

export default SendJobRequest