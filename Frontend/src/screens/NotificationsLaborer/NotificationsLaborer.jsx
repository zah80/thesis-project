import React, { useContext,useState,useEffect } from 'react';
import {MyContext} from '../../context/ContextProvider'
import {  View, Text, StyleSheet, FlatList, Alert, TouchableOpacity, Button, Modal, TextInput, Platform  } from 'react-native';
import axios from "axios"

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
        const renderNotification = ({ item }) =>{ 
            console.log("item notif is",item);
            return (
            <TouchableOpacity
                style={[
                    styles.notification,
                    { backgroundColor: item.clicked ?'white':'green'}
                ]}
                onPress={() => editClickedRowColor(item)}
            >
                <Text style={styles.notificationText}>{item.text}</Text>
                <Button
                    title="Delete"
                    onPress={() => deleteNotificationLaborer(item.notification_laborerID)}
                />
            </TouchableOpacity>
        );
    }
        return(
            <View style={styles.container}>
                <FlatList
                    data={notificationsLaborer}
                    renderItem={renderNotification}
                    keyExtractor={item=>item.notification_laborerID.toString()}
                    ListEmptyComponent={<Text>No notifications</Text>}
                />
            </View>
        );
    };
    
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            padding: 10,
        },
        notification: {
            padding: 10,
            marginVertical: 5,
            borderRadius: 5,
        },
        notificationText: {
            fontSize: 16,
            color: 'black',
        },
        errorText: {
            color: 'red',
            marginTop: 10,
        },
    });

export default NotificationsLaborer