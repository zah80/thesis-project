import React, { useContext,useState,useEffect } from 'react';
import {MyContext} from '../../context/ContextProvider'
import {  View, Text, StyleSheet, FlatList, Alert, TouchableOpacity, Button, Modal, TextInput, Platform  } from 'react-native';
import axios from "axios"
import { Ionicons } from '@expo/vector-icons';

const NotificationsLaborer = ({navigation}) => {
    const {notificationsLaborer,setNotificationsLaborer,
        setCountUnseenNotificationsLaborer,
        countUnseenNotificationsLaborer,url,tokenLaborer}=useContext(MyContext);
      const updateAllSeenToTrue=async()=>{
        const token=tokenLaborer;
        try{
          const response = await axios.post(url+'/api/notificationsLaborer/editSeen',{},{headers:{token}});
          if (response.data.success) {
          console.log("succsees seens true and count",response.data);
          setCountUnseenNotificationsLaborer(0);
          } else {
            console.log('Failed to fetch count');
          }
        } catch (err) {
        console.log(err);
        }
      }
      const deleteNotificationLaborer=async(notificationID)=>{
        try {
            const response = await axios.delete(`${url}/api/notificationsLaborer/delete/${notificationID}`);
            if (response.data.success) {
             console.log("delete success");
             setNotificationsLaborer((prevNotification)=>prevNotification.filter(
             notification=>notification.notification_laborerID!==notificationID));
            } else {
              console.log('Failed to fetch count');
            }
          } catch (err) {
          console.log(err);
          }
      }
      const editClickedRowColor=async(item)=>{
       console.log("notif id",item);
        try {
            const response = await axios.post(`${url}/api/notificationsLaborer/editClicked/${item.notification_laborerID}`);
            if (response.data.success) {
                console.log(" success");
                setNotificationsLaborer(prevNotifications =>
                    prevNotifications.map(notification =>
                        notification.notification_laborerID === item.notification_laborerID
                            ? { ...notification, clicked: 1 }
                            : notification
                    )
                );
                if(item.postID){
                    console.log("ietm navigate post");
                    navigation.navigate("showPost",{postID:item.postID})
                }
                else if(item.jobRequestID){
                    console.log("log item navugate jobreques");
                    navigation.navigate("showJobRequest",{jobRequestID:item.jobRequestID})
                }

            } else {
              console.log('Failed ');
            }
          } catch (err) {
          console.log(err);
          }
      }
      
        useEffect(()=>{
        updateAllSeenToTrue();
        },[countUnseenNotificationsLaborer]);

    const renderNotification = ({ item }) => {
        return (
          <TouchableOpacity
            style={[
              styles.notification,
              { backgroundColor: item.clicked ? '#FFFFFF' : '#E8F5FE' }
            ]}
            onPress={() => editClickedRowColor(item)}
          >
            <View style={styles.notificationContent}>
              <View style={[styles.notificationDot, { opacity: item.clicked ? 0 : 1 }]} />
              <Text style={[styles.notificationText, { color: item.clicked ? '#65676B' : '#050505' }]}>
                {item.text}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deleteNotificationLaborer(item.notification_laborerID)}
            >
              <Ionicons name="close" size={20} color="#65676B" />
            </TouchableOpacity>
          </TouchableOpacity>
        );
      };
      return (
        <View style={styles.container}>
          <FlatList
            data={notificationsLaborer}
            renderItem={renderNotification}
            keyExtractor={item => item.notification_laborerID.toString()}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="notifications-off-outline" size={50} color="#65676B" />
                <Text style={styles.emptyText}>No notifications</Text>
              </View>
            }
          />
        </View>
      );
    };
    
    const styles = StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: '#F0F2F5',
        },
        notification: {
          flexDirection: 'row',
          alignItems: 'center',
          padding: 12,
          borderBottomWidth: 1,
          borderBottomColor: '#E4E6EB',
        },
        notificationContent: {
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
        },
        notificationDot: {
          width: 10,
          height: 10,
          borderRadius: 5,
          backgroundColor: '#1877F2',
          marginRight: 10,
        },
        notificationText: {
          fontSize: 16,
          flex: 1,
        },
        deleteButton: {
          padding: 5,
        },
        emptyContainer: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
        },
        emptyText: {
          fontSize: 18,
          color: '#65676B',
          marginTop: 10,
        },
      });

export default NotificationsLaborer