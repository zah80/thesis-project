import React, { useContext,useState,useEffect } from 'react';
import {MyContext} from '../../context/ContextProvider'
import {  View, Text, StyleSheet, FlatList, Alert, TouchableOpacity, Button, Modal, TextInput, Platform,Image  } from 'react-native';
import axios from "axios"
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
const Appointments = ({navigation}) => {
    const {url,tokenLaborer,userAppointment,setUserAppointment}=useContext(MyContext);
    const [appointments, setAppointments] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [updatedPrice, setUpdatedPrice] = useState('');
    const [updatedTimeFinish, setUpdatedTimeFinish] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false)
  const navigate=useNavigation()
    useEffect(()=>{
    fetchAppointments();
},[]);

    const fetchAppointments = async () => {
      const token =tokenLaborer;
        try {
            const response = await axios.get(`${url}/api/userLaborerAppointments/one`,{headers:{token}});
            console.log("response",response.data);
            setAppointments(response.data);
        } catch (error) {
            console.log('Error fetching appointments:', error);
            Alert.alert('Error', 'Failed to fetch appointments');
        }
    };

    const updateAppointment = async () => {
        console.log("id",selectedAppointment.UserLaborerAppointmentsID);
        console.log("price",typeof parseFloat(updatedPrice).toFixed(2));
        console.log("time",updatedTimeFinish);
        const formattedTimeFinish = updatedTimeFinish.toISOString().slice(0, 19).replace('T', ' ');
        try {
            const response = await axios.put(`${url}/api/userLaborerAppointments/${selectedAppointment.UserLaborerAppointmentsID}/details`, {
                price: parseFloat(updatedPrice).toFixed(2),
                timeFinish: formattedTimeFinish
            });
            console.log('response update', response.data);
            Alert.alert('Success', 'Appointment updated successfully');
            setUpdatedPrice("");
            setUpdatedTimeFinish(new Date());
            setModalVisible(false);
            fetchAppointments();
        } catch (error) {
            console.log('Error updating appointment:', error);
            Alert.alert('Error', 'Failed to update appointment');
        }
    };
    const cancelAppointment = async (appointmentID) => {
        try {
            await axios.delete(`${url}/api/userLaborerAppointments/${appointmentID}`);
            setAppointments(prevAppointments => prevAppointments.filter(appointment => appointment.UserLaborerAppointmentsID !== appointmentID));
            Alert.alert('Success', 'Appointment canceled successfully');
        } catch (error) {
            console.log('Error canceling appointment:', error);
            Alert.alert('Error', 'Failed to cancel appointment');
        }
    };
const finishTheWorkFromUser=async(id)=>{
    try {
        await axios.put(`${url}/api/userLaborerAppointments/${id}/isFinish`);
        setAppointments(appointments.filter(appointment => appointment.UserLaborerAppointmentsID !== id));
        Alert.alert('Success', 'Appointment marked as finished');
    } catch (error) {
        console.error('Error finishing appointment:', error);
        Alert.alert('Error', 'Failed to finish appointment');
    }
}
const addAppointment=async()=>{
    const token=tokenLaborer;
    console.log("token from add appointemnt ",token);
    if(userAppointment){
   
        console.log("price", parseFloat(updatedPrice).toFixed(2));
    
        console.log("user is",userAppointment);
        const formattedTimeFinish = updatedTimeFinish.toISOString().slice(0, 19).replace('T', ' ');
        console.log("time",formattedTimeFinish);
        try {
            const response = await axios.post(`${url}/api/userLaborerAppointments/add`,{
                price: parseFloat(updatedPrice).toFixed(2),
                timeFinish: formattedTimeFinish,
                userID:userAppointment.userID
            },{headers:{token}});
            console.log('response added', response.data);
            Alert.alert('Success', 'Appointment added successfully');
            setUpdatedPrice("");
            setUpdatedTimeFinish(new Date());
            setUserAppointment({});
            fetchAppointments();
        } catch (error) {
            console.log('Error added appointment:', error);
            Alert.alert('Error', 'Failed to add appointment');
        }
    }
    else{
        console.log("please set user");
    }
}
    const renderAppointment = ({ item }) => {
      
        const timeStart = new Date(item.timeStart);
        const timeFinish = new Date(item.timeFinish);
        
        console.log("timestart",timeStart);
        console.log("timestart",timeFinish);
            const timestart = timeStart.toISOString().slice(0, 19).replace('T', ' ');
            const timefinish = timeFinish.toISOString().slice(0, 19).replace('T', ' ');
        return (
            <View style={styles.appointmentContainer}>
                <Text style={styles.appointmentText}>Price: {item.price}</Text>
                <Text style={styles.appointmentText}>Start Time: {timestart}</Text>
                <Text style={styles.appointmentText}>Finish Time: {timefinish}</Text>
                <View style={styles.buttonContainer}>
                {item.image && (
              <View>
                <Text>{item.fullName}</Text>
                <Image source={{ uri: `${url}/uploads/${item.image}` }}  />
              </View>
            )}
                    <Button title="Update" onPress={() => {
                        setSelectedAppointment(item);
                        setUpdatedPrice(item.price);
                        setUpdatedTimeFinish(new Date(item.timeFinish));
                        setModalVisible(true);
                    }}
                    />
                    <Button title="Cancel" onPress={() => cancelAppointment(item.UserLaborerAppointmentsID)} color="red" />
                    <Button title="Finish" onPress={() => finishTheWorkFromUser(item.UserLaborerAppointmentsID)} color="green" />
                </View>
            </View>
            
        );
    };
    const onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || updatedTimeFinish;
        setShowDatePicker(true);
        setUpdatedTimeFinish(currentDate);
    };
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Appointments</Text>
            <FlatList
                data={appointments}
                renderItem={renderAppointment}
                keyExtractor={(item) => item.UserLaborerAppointmentsID.toString()}
            />
              <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Update Appointment</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Price"
                            value={updatedPrice}
                            onChangeText={(text) => setUpdatedPrice(text)}
                            keyboardType="numeric"
                        />
                        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                            <Text style={styles.datePickerText}>Finish Time: {updatedTimeFinish.toISOString().slice(0, 19).replace('T', ' ')}</Text>
                        </TouchableOpacity>
                        {showDatePicker && (
                            <DateTimePicker
                                value={updatedTimeFinish}
                                mode="datetime"
                                display="default"
                                onChange={onDateChange}
                            />
                        )}
                            <View style={styles.modalButtonContainer}>
                            <Button title="Save" onPress={updateAppointment}/>
                            <Button title="Cancel" onPress={() => setModalVisible(false)} color="red" />
                        </View>
                    </View>
                </View>
            </Modal>
            <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>add Appointment</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Price"
                            value={updatedPrice}
                            onChangeText={(text) => setUpdatedPrice(text)}
                            keyboardType="numeric"
                        />
                        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                            <Text style={styles.datePickerText}>Finish Time: {updatedTimeFinish.toISOString().slice(0, 19).replace('T', ' ')}</Text>
                        </TouchableOpacity>
                        {showDatePicker && (
                            <DateTimePicker
                                value={updatedTimeFinish}
                                mode="datetime"
                                display="default"
                                onChange={onDateChange}
                            />
                        )}
                          <Button title="choseUser" onPress={()=>navigation.navigate("searchUser")}/>   
                        {userAppointment && (
              <View>
                <Text>{userAppointment.fullName}</Text>
                <Image source={{ uri: `${url}/uploads/${userAppointment.image}` }}  />
              </View>
            )}
                            <View style={styles.modalButtonContainer}>
                            <Button title="Save" onPress={addAppointment}/>   
                        </View>
                    </View>
                
                </View>
                <Button title="back" onPress={()=>navigate.goBack()}/>   
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#F5F5F5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
    },
    appointmentContainer: {
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    appointmentText: {
        fontSize: 16,
        color: '#333',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: 300,
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        marginVertical: 8,
        backgroundColor: '#fff',
    },
    datePickerText: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        marginVertical: 8,
        backgroundColor: '#fff',
        textAlign: 'center',
    },
    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
});

export default Appointments