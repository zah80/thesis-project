import React, { useContext, useEffect, useState,useRef } from 'react'
import { MyContext } from '../../context/ContextProvider';
import axios from "axios"
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Keyboard, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format, isToday, isYesterday, isSameYear } from 'date-fns';

const Message = ({ route }) => {
  const [messages,setMessages]=useState([]);
  const [message,setMessage]=useState("");
  const {tokenUser,tokenLaborer,url,socket,laborerDetails,userDetails}=useContext(MyContext);
  const {userID,laborerID}=route.params;
  const flatListRef = useRef(null);
  useEffect(()=>{
    console.log("userID",userID);
    console.log("laborerid",laborerID);


    const fetchMessages = async () => {
      try {
        console.log("laborertoken",tokenLaborer);
        console.log("usertoken",tokenUser);
            if(userID&&tokenLaborer){
                const token=tokenLaborer;
          const response = await axios.post(url+"/api/all/messages",{userID},{headers:{token}});
          setMessages(response.data);
        console.log("reach tokenlab",response.data);    
        }
            else if(laborerID&&tokenUser){
                const token=tokenUser;
                const response = await axios.post(url+"/api/all/messages",{laborerID},{headers:{token}});
                setMessages(response.data);
        console.log("reach tokenuser",response.data);    

            }
        } catch (error) {
          console.log(error);
        }
      };
 fetchMessages();
  socket.on("newMessage",(message)=>{
    setMessages([...messages,message]);
  })
  return () => {
    socket.off("newMessage");
  };


  },[]);
  useEffect(()=>{
   
if(userID&&tokenLaborer){
    socket.emit("markMessagesAsSeen",userID,laborerDetails.laborerID,"laborer");
}
else if(laborerID&&tokenUser){
  

    socket.emit("markMessagesAsSeen",userDetails.userID,laborerID,"user");
}
socket.on("messagesSeen", (data) => {
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        (msg.userID === data.userID && msg.laborerID === data.laborerID && msg.senderType !== data.senderType && msg.seen===false)
          ? { ...msg, seen: true }
          : msg
        )
    );
  });
  return () => {
    socket.off("messagesSeen");
  };
  },[userID,laborerID,tokenLaborer,tokenUser]);
  useEffect(()=>{
    flatListRef.current?.scrollToEnd({ animated: true });

  },[messages])
  const hanndleClickAddMessage=async()=>{
    console.log("reach here");
    const id = await AsyncStorage.getItem("tokenUser")
    console.log("is",id);
let addMessage=null;
let token="";
try{
    console.log("user id :", userID);
    console.log("laborer id :", laborerID);
    console.log("user token", tokenUser );
if(userID&&tokenLaborer){
addMessage={
   userID,
    senderType:'laborer',
    text:message,
}
token=tokenLaborer
console.log("token lab",token);
console.log("messagelavb",addMessage);
const response=await axios.post(url+"/api/sendMessage",addMessage,{headers:{token}})
console.log("response laborer add",response.data);
setMessages((prev)=>[...prev,response.data.message])
setMessage("");
}

else if(laborerID&&id){
        addMessage={
            laborerID,
            senderType:'user',
            text:message,
        }
        token=id
console.log("messageUser",addMessage);
const response=await axios.post(url+"/api/sendMessage",addMessage,{headers:{token}})
console.log("response user add",response.data);
setMessages((prev)=>[...prev,response.data.message])
setMessage("");
        
}
}
catch(error){
  console.log(error);
}
  }
  const keyExtractor = (item) => {
    return item.messageID?item.messageID.toString() : Math.random().toString();
  };
  const checkMessagesSeen = (item) => {
    const seenColor = "#4FC3F7";
    const unseenColor = "#9E9E9E";
    
    if ((tokenLaborer && item.senderType === "laborer") || (tokenUser && item.senderType === "user")) {
      return item.seen ? 
        <Icon name="checkmark-done" size={16} color={seenColor} /> : 
        <Icon name="checkmark" size={16} color={unseenColor} />;
    }
    return null;
  };
  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    if (isToday(date)) {
      return format(date, 'HH:mm');
    } else if (isYesterday(date)) {
      return `Yesterday ${format(date, 'HH:mm')}`;
    } else if (isSameYear(date, new Date())) {
      return format(date, 'MMM d, HH:mm');
    } else {
      return format(date, 'MMM d, yyyy HH:mm');
    }
  };
  const alignMessage = (item) => {
    if ((tokenUser && item.senderType === 'user') || (tokenLaborer && item.senderType === 'laborer')) {
      return styles.messageContainerRight;
    }
    return styles.messageContainerLeft;
  };
  const renderItem = ({ item }) => {
    const messageTime = formatMessageTime(item.sent_at);
    
    return (
      <View style={alignMessage(item)}>
        <View style={styles.messageBubble}>
          <Text style={styles.messageContent}>{item.text}</Text>
          <View style={styles.messageFooter}>
            <Text style={styles.messageTime}>{messageTime}</Text>
            <View style={styles.seenStatusContainer}>
              {checkMessagesSeen(item)}
            </View>
          </View>
        </View>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.messageID.toString()}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesListContent}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setMessage(text)}
          value={message}
          placeholder="Type a message..."
          placeholderTextColor="#9E9E9E"
          multiline
        />
        <TouchableOpacity 
          style={styles.sendButton} 
          onPress={() => {
            hanndleClickAddMessage(message);
            setMessage('');
            Keyboard.dismiss();
          }}
        >
          <Icon name="send" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  messagesList: {
    flex: 1,
  },
  messagesListContent: {
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  messageContainerLeft: {
    alignSelf: 'flex-start',
    marginBottom: 12,
    maxWidth: '80%',
  },
  messageContainerRight: {
    alignSelf: 'flex-end',
    marginBottom: 12,
    maxWidth: '80%',
  },
  messageBubble: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.00,
    elevation: 1,
  },
  messageContent: {
    fontSize: 16,
    color: '#212121',
  },
  messageFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 4,
  },
  messageTime: {
    fontSize: 12,
    color: '#9E9E9E',
    marginRight: 4,
  },
  seenStatusContainer: {
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  input: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#0084ff',
    borderRadius: 50,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Message