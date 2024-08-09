import React, { useContext,useState,useEffect } from 'react';
import {MyContext} from '../../context/ContextProvider'
import {  View, Text, StyleSheet, FlatList, Alert, TouchableOpacity, Button, Modal, TextInput, Platform  } from 'react-native';
import axios from "axios"

const AllNotification = () => {
    const {url,tokenLaborer}=useContext(MyContext);
    const [notifications, setNotifications] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedNotification, setSelectedNotification] = useState(null);
const updateAllSeenStatusToTrue=async()=>{
    try{
const response=await axios.put(`${url}/api/job_requests/editSeen`,{
    headers: {
        token
    },

})

console.log("response",response.data.result);
}
    catch(error){
        console.log('Error fetching notifications:', error);
    }
}
    useEffect(() => {
      
         const fetchNotifications = async () => {
            
            const token=tokenLaborer;
            console.log("token from notification",token);
            try {
                const response = await axios.get(`${url}/api/job_requests/all`, {
                    headers: {
                        token
                    },
                });
                console.log("notification is",response.data);
                setNotifications(response.data);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };
        fetchNotifications();
        updateAllSeenStatusToTrue();
    },[url,tokenLaborer]);

    const handleNotificationPress = (notification) => {
        setSelectedNotification(notification);
        setModalVisible(true);
    };

    const renderNotification = ({ item }) => {
        const isUnseen = item.seen === 0;
        const truncatedDescription = item.description.length > 100 ? item.description.substring(0, 100) + '...' : item.description;
        
        return (
            <TouchableOpacity 
                style={[styles.notificationContainer, isUnseen && styles.unseenNotification]} 
                onPress={() => handleNotificationPress(item)}
            >
                <Image 
                    source={{ uri: `${url}/${item.image}` }} 
                    style={styles.userImage} 
                />
                <View style={styles.notificationContent}>
                    <Text style={styles.userName}>{item.fullName}</Text>
                    <Text style={styles.notificationDate}>{new Date(item.timeSend).toLocaleDateString()}</Text>
                    <Text style={styles.notificationDescription}>{truncatedDescription}</Text>
                </View>
            </TouchableOpacity>
        );
    };
    return (
        <View style={styles.container}>
            <FlatList
                data={notifications}
                renderItem={renderNotification}
                keyExtractor={(item) => item.job_requestsID.toString()}
            />
            {selectedNotification && (
                <Modal
                    visible={modalVisible}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>{selectedNotification.fullName}</Text>
                        <Text style={styles.modalDate}>{new Date(selectedNotification.timeSend).toLocaleDateString()}</Text>
                        <Text style={styles.modalDescription}>{selectedNotification.description}</Text>
                        <Text style={styles.modalDescription}>{selectedNotification.address}</Text>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#F5F5F5',
    },
    notificationContainer: {
        flexDirection: 'row',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        alignItems: 'center',
    },
    unseenNotification: {
        backgroundColor: '#e0e0e0',
    },
    userImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    notificationContent: {
        flex: 1,
    },
    userName: {
        fontWeight: 'bold',
    },
    notificationDate: {
        color: '#888',
    },
    notificationDescription: {
        color: '#333',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalDate: {
        color: '#888',
        marginBottom: 10,
    },
    modalDescription: {
        color: '#fff',
    },
    closeButton: {
        marginTop: 20,
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 5,
    },
    closeButtonText: {
        color: '#fff',
    },
});

export default AllNotification