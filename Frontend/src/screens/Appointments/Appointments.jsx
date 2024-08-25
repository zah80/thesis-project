import React, { useContext,useState,useEffect } from 'react';
import {MyContext} from '../../context/ContextProvider'
import axios from "axios"


import {
    View, Text, FlatList, TouchableOpacity, Image, Modal,Alert,
    StyleSheet, TextInput, SafeAreaView, StatusBar,Dimensions
  } from 'react-native';
  import { format } from 'date-fns';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');
const Appointments = ({navigation}) => {
    const {url,tokenLaborer,userAppointment,setUserAppointment,setAddModalVisible,
      addModalVisible,}=useContext(MyContext);
    const [appointments, setAppointments] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [updatedPrice, setUpdatedPrice] = useState('');
    const [updatedTimeFinish, setUpdatedTimeFinish] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
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
        const formattedTimeFinish = updatedTimeFinish.toISOString().slice(0, 19).replace('T',' ');
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
const onDateChange = (event,selectedDate) => {
    const currentDate = selectedDate || updatedTimeFinish;
   
    setUpdatedTimeFinish(currentDate);
};
const renderAppointment = ({ item }) => {
    const timeStart = new Date(item.timeStart);
    const timeFinish = new Date(item.timeFinish);
    
    return (
      <View style={styles.appointmentCard}>
        <View style={styles.appointmentHeader}>
          <Text style={styles.price}>${item.price}</Text>
          {item.image && (
            <Image 
              source={{ uri: `${url}/${item.image}` }} 
              style={styles.userImage}
            />
          )}
        </View>
        <View style={styles.timeInfo}>
        <Icon name="clock-time-four" size={16} color="#4A90E2" />
        <Text style={styles.timeText}>Start: {format(timeStart, 'PPpp')}</Text>
        </View>
        <View style={styles.timeInfo}>
          <Icon name="timer" size={16} color="#4A90E2" />
          <Text style={styles.timeText}>Finish: {format(timeFinish, 'PPpp')}</Text>
        </View>
        <Text style={styles.userName}>{item.fullName}</Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.editButton]}
            onPress={() => {
              setSelectedAppointment(item);
              setUpdatedPrice(item.price.toString());
              setUpdatedTimeFinish(new Date(item.timeFinish));
              setModalVisible(true);
            }}
          >
<Ionicons name="pencil" size={20} color="#FFF" />
</TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, styles.cancelButton]}
            onPress={() => cancelAppointment(item.UserLaborerAppointmentsID)}
          >
            <Icon name="cancel" size={20} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, styles.finishButton]}
            onPress={() => finishTheWorkFromUser(item.UserLaborerAppointmentsID)}
          >
            <Icon name="check-circle" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };
 
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Appointments</Text>
       
      </View>

      <FlatList
        data={appointments}
        renderItem={renderAppointment}
        keyExtractor={(item) => item.UserLaborerAppointmentsID.toString()}
        contentContainerStyle={styles.listContainer}
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
              placeholder="Price"
              value={updatedPrice}
              onChangeText={setUpdatedPrice}
              keyboardType="numeric"
              style={styles.input}
            />
            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePickerButton}>
              <Text>Finish Time: {format(updatedTimeFinish, 'PPpp')}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={updatedTimeFinish}
                mode="datetime"
                display="default"
                onChange={onDateChange}
              />
            )}
            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={updateAppointment} style={[styles.modalButton, styles.saveButton]}>
                <Text style={styles.modalButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View style={styles.addAppointmentContainer}>
      <Text style={styles.modalTitle}>Add Appointment</Text>
      <TextInput
        placeholder="Price"
        value={modalVisible?"":updatedPrice}
        onChangeText={setUpdatedPrice}
        keyboardType="numeric"
        style={styles.input}
      />
      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePickerButton}>
        <Text>Finish Time: {format(modalVisible?Date.now():updatedTimeFinish,'PPpp')}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
        testID="dateTimePicker"
        value={updatedTimeFinish}
        mode="datetime"
        is24Hour={true}
        display="default"
        onChange={onDateChange}
        />
      )}
      <TouchableOpacity 
        onPress={() => navigation.navigate("searchUser")}
        style={styles.chooseUserButton}
      >
        <Text style={styles.chooseUserButtonText}>Choose User</Text>
      </TouchableOpacity>
      {userAppointment && (
        <View style={styles.userInfo}>
          <Image style={styles.userAvatar} source={{ uri: `${url}/${userAppointment.image}` }} />
          <Text style={styles.userName}>{userAppointment.fullName}</Text>
        </View>
      )}
      <View style={styles.modalActions}>
        <TouchableOpacity onPress={addAppointment} style={[styles.modalButton, styles.saveButton]}>
          <Text style={styles.modalButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
    
    </SafeAreaView>
  );

     
}
const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: '#F0F0F0',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: '#4A90E2',
      paddingVertical: 15,
      paddingHorizontal: 20,
    },
    headerTitle: {
      color: '#FFF',
      fontSize: 20,
      fontWeight: 'bold',
    },
    backButton: {
      padding: 5,
    },
    addButton: {
      padding: 5,
    },
    listContainer: {
      padding: 15,
    },
    appointmentCard: {
      backgroundColor: '#FFF',
      borderRadius: 10,
      padding: 15,
      marginBottom: 15,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    appointmentHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },
    price: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#4A90E2',
    },
    userImage: {
      width: 40,
      height: 40,
      borderRadius: 20,
    },
    timeInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 5,
    },
    timeText: {
      marginLeft: 5,
      fontSize: 14,
      color: '#666',
    },
    userName: {
      fontSize: 16,
      fontWeight: '500',
      marginTop: 5,
      marginBottom: 10,
    },
    actionButtons: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    actionButton: {
      padding: 8,
      borderRadius: 5,
      marginLeft: 10,
    },
    editButton: {
      backgroundColor: '#4A90E2',
    },
    cancelButton: {
      backgroundColor: '#E74C3C',
    },
    finishButton: {
      backgroundColor: '#2ECC71',
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      backgroundColor: '#FFF',
      borderRadius: 10,
      padding: 20,
      width: '90%',
      maxHeight: '80%', // Add this to limit the height
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 15,
    },
    addAppointmentContainer: {
      padding: 15,
      backgroundColor: '#FFF',
      borderTopWidth: 1,
      borderTopColor: '#DDD',
    },
    
    input: {
      borderWidth: 1,
      borderColor: '#DDD',
      borderRadius: 5,
      padding: 10,
      marginBottom: 15,
    },
    datePickerButton: {
      backgroundColor: '#F0F0F0',
      padding: 10,
      borderRadius: 5,
      marginBottom: 15,
    },
    modalActions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    modalButton: {
      padding: 10,
      marginLeft: 10,
      borderRadius: 5,
    },
    saveButton: {
      backgroundColor: '#4A90E2',
    },
    modalButtonText: {
      color: '#4A90E2',
      fontWeight: 'bold',
    },
    chooseUserButton: {
      backgroundColor: '#4A90E2',
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
      marginBottom: 15,
    },
    chooseUserButtonText: {
      color: '#FFF',
      fontWeight: 'bold',
    },
    userInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 15,
    },
    userAvatar: {
      width: 50,
      height: 50,
      borderRadius: 25,
      marginRight: 10,
    },
 
  });
export default Appointments