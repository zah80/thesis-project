import React, { useContext, useEffect,useState } from 'react';
import { View, Text, Image, FlatList, StyleSheet,TouchableOpacity } from 'react-native';
import { MyContext } from '../../context/ContextProvider';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format, isToday, isYesterday } from 'date-fns';

const Conversation = ({navigation}) => {
    const { tokenUser, tokenLaborer,url,onlineUsers,onlineLaborers,socket} = useContext(MyContext);
    const [conversations,setConversations] = useState([]);
  
    useEffect(() => {
      const fetchConversations = async () => {
        const token=tokenLaborer?tokenLaborer:tokenUser;

        console.log("token from conversation is ",token);
        try{
          const response = await axios.get(url+"/api/get/conversation",{headers:{token}});
         console.log("response is ",response.data);
          const data =  response.data.result;
          setConversations(data);
        } catch (error) {
          console.log('Error fetching conversations:', error);
        }
        };
        fetchConversations();
    },[]);
    useEffect(()=>{
      socket.on("messagesSeen", (data) => {
        setConversations((prevconv) =>
          prevconv.map((msg) =>
            (msg.userID === data.userID && msg.laborerID === data.laborerID && msg.senderType !== data.senderType && msg.seen===false)
              ? { ...msg, seen: true }
              : msg
            )
        );
      });
      return () => {
        socket.off("messagesSeen");
      };
    },[])
    const whoNavigate=(userID,laborerID)=>{
      if(tokenLaborer){
       navigation.navigate("messages",{userID})}
       else if(tokenUser){
        navigation.navigate("messages",{laborerID})
       }
      }

    const checkOnline=(laborerID,userID)=>{
      if (tokenLaborer&&onlineUsers){
        return onlineUsers.includes(userID);
    } else if (tokenUser&&onlineLaborers){
        return onlineLaborers.includes(laborerID);
    }
    return false;
}
const checkLastMessageSeen = (item) => {
  if ((tokenLaborer && item.senderType === "laborer") || (tokenUser && item.senderType === "user")) {
    return item.seen ? 
      <Icon name="checkmark-done-circle" size={16} color="#4CAF50" /> : 
      <Icon name="checkmark-circle-outline" size={16} color="#9E9E9E" />;
  }
  return null;
};
const alignMessageText = (item) => {
  if (tokenUser) {
      return item.senderType ==='laborer'?styles.messageTextLeft:styles.messageTextRight;
  }
  if (tokenLaborer) {
      return item.senderType === 'laborer' ?   styles.messageTextRight:styles.messageTextLeft;
  }
  return styles.messageTextLeft;
};
const formatMessageTime = (timestamp) => {
  const date = new Date(timestamp);
  if (isToday(date)) {
    return format(date, 'HH:mm');
  } else if (isYesterday(date)) {
    return 'Yesterday';
  } else {
    return format(date, 'dd/MM/yyyy');
  }
};
const renderItem = ({ item }) => {
  const isOnline = checkOnline(item.laborerID, item.userID);

  return (
    <TouchableOpacity 
      style={styles.conversationItem} 
      onPress={() => whoNavigate(item.userID, item.laborerID)}
    >
      <View style={styles.avatarContainer}>
        <Image source={{ uri: tokenLaborer?`${url}/${item.image}`:`${url}${item.image}` }} style={styles.avatar} />
        <View style={[styles.onlineStatusDot, { backgroundColor: isOnline ? "#4CAF50" : "#9E9E9E" }]} />
      </View>
      <View style={styles.conversationDetails}>
        <View style={styles.nameTimeContainer}>
          <Text style={styles.fullName}>{item.fullName}</Text>
          <Text style={styles.time}>{formatMessageTime(item.sent_at)}</Text>
        </View>
        <View style={styles.messageContainer}>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {tokenLaborer&&item.senderType==="laborer"||tokenUser&&item.senderType==="user"?"you: ":"" }
            {item.lastMessage}
          </Text>
          {checkLastMessageSeen(item)}
        </View>
      </View>
    </TouchableOpacity>
  );
};
return (
  <FlatList
    data={conversations}
    renderItem={renderItem}
    keyExtractor={(item) => item.conversationID.toString()}
    style={styles.container}
    contentContainerStyle={styles.listContent}
  />
);
  };  
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  listContent: {
    paddingVertical: 8,
  },
  conversationItem: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 1,
    borderRadius: 8,
    marginHorizontal: 8,
    marginVertical: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.00,
    elevation: 1,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  onlineStatusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  conversationDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  nameTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  fullName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
  },
  time: {
    fontSize: 12,
    color: '#757575',
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: 14,
    color: '#616161',
    flex: 1,
    marginRight: 4,
  },
});
export default Conversation;
