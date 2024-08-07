import React, { useContext, useEffect,useState } from 'react';
import { View, Text, Image, FlatList, StyleSheet } from 'react-native';
import { MyContext } from '../../context/ContextProvider';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from "axios";
import { TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Conversation = ({navigation}) => {
    const { tokenUser, tokenLaborer,url,onlineUsers,onlineLaborers,socket} = useContext(MyContext);
    const [conversations,setConversations] = useState([]);
  
    useEffect(() => {
      const fetchConversations = async () => {
        
        const token = await AsyncStorage.getItem("tokenLaborer")
        console.log("token",token);
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
      if (tokenLaborer) {
        return onlineUsers.includes(userID);
    } else if (tokenUser) {
        return onlineLaborers.includes(laborerID);
    }
    return false;
}
checkLastMessageSeen=(item)=>{
  if (tokenLaborer) {
    if (item.senderType === "laborer") {
        return item.seen ? <Icon name="check-circle" size={16} color="blue" /> : <Icon name="check-circle" size={16} color="black" />;
    }
} else if (tokenUser) {
    if (item.senderType === "user") {
        return item.seen ? <Icon name="check-circle" size={16} color="blue" /> : <Icon name="check-circle" size={16} color="black" />;
    }
}
return null;
    }
const alignMessageText = (item) => {
  if (tokenUser) {
      return item.senderType ==='laborer'?styles.messageTextLeft:styles.messageTextRight;
  }
  if (tokenLaborer) {
      return item.senderType === 'laborer' ?   styles.messageTextRight:styles.messageTextLeft;
  }
  return styles.messageTextLeft;
};

    const renderItem=({item})=>{
      const isOnline = checkOnline(item.laborerID, item.userID);
        const textAlignmentStyle = alignMessageText(item);
      
        return (
          <View style={styles.conversation}>
            <TouchableOpacity onPress={()=>whoNavigate(item.userID,item.laborerID)}>
          <View style={styles.imageContainer}>
              <Image source={{ uri: url + "/uploads/" + item.image }} style={styles.image} />
              <Icon name="circle" size={12} color={isOnline ? "green" : "grey"} style={styles.onlineStatusIcon} />
          </View>
          <View style={styles.textContainer}>
              <Text style={styles.fullName}>{item.fullName}</Text>
              <Text style={[styles.lastMessage, textAlignmentStyle]}>
                  {item.lastMessage} {checkLastMessageSeen(item)}
              </Text>
              <Text style={styles.time}>{new Date(item.sent_at).toLocaleString()}</Text>
          </View>
          </TouchableOpacity>
      </View>
        );
    };
    return(
      <View style={styles.container} >
            <FlatList
                data={conversations}
                renderItem={renderItem}
                keyExtractor={(item) => item.conversationID.toString()}
            />
        </View>
    );
  };  
  const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f0f0f0',
    },
    conversation: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    imageContainer: {
        position: 'relative',
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    onlineStatusIcon: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#fff',
        borderRadius: 6,
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
        marginLeft: 16,
    },
    fullName: {
        fontWeight: 'bold',
        marginBottom: 4,
        fontSize: 16,
    },
    lastMessage: {
        fontSize: 14,
    },
    time: {
        color: 'gray',
        marginTop: 4,
        fontSize: 12,
    },
    seenStatusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    messageTextLeft: {
        textAlign: 'left',
        alignSelf: 'flex-start',
    },
    messageTextRight: {
        textAlign: 'right',
        alignSelf: 'flex-end',
    },
});

export default Conversation;
