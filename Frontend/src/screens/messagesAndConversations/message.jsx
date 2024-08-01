import React, { useContext, useEffect, useState } from 'react'
import { MyContext } from '../../context/ContextProvider';
import axios from "axios"
import { View,Text,Image,FlatList,StyleSheet,TextInput,Button} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
const message = ({ route }) => {
  const [messages,setMessages]=useState([]);
  const [message,setMessage]=useState("");
  const {tokenUser,tokenLaborer,url,socket,laborerDetails,userDetails}=useContext(MyContext);
  const {userID,laborerID}=route.params;
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
  
  const hanndleClickAddMessage=async()=>{
let addMessage=null;
let token="";
try{
    
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
else if(laborerID&&tokenUser){
        addMessage={
            laborerID,
            senderType:'user',
            text:message,
        }
        token=tokenUser
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
  checkMessagesSeen=(item)=>{
    if (tokenLaborer) {
      if( item.senderType === "laborer" && item.seen )
          return  <Icon name="check-circle" size={16} color="blue" />
          else if(item.senderType === "laborer" && !item.seen)
          return  <Icon name="check-circle" size={16} color="black" />;
  }
  else if (tokenUser) {
      if(item.senderType === "user" && item.seen )
        return <Icon name="check-circle" size={16} color="blue" />
        else if(item.senderType === "user" && !item.seen )
          return  <Icon name="check-circle" size={16} color="black" />;
  }
  return null;
  }
  const alignMessage = (item) => {
    if (tokenUser) {
        return item.senderType === 'laborer' ? styles.messageContainerLeft : styles.messageContainerRight;
    }
   else if (tokenLaborer) {
        return item.senderType === 'laborer' ? styles.messageContainerRight : styles.messageContainerLeft;
    }
    return styles.messageContainerLeft;
};
  const renderItem = ({ item })=>{
   
      return(
        <View style={alignMessage(item)}>
        <Text style={styles.messageContent}>{item.text}</Text>
        <View style={styles.seenStatusContainer}>
            {checkMessagesSeen(item)}
        </View>
    </View>
    );
  };
  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        style={styles.messagesList}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setMessage(text)}
          value={message}
          placeholder="Type a message..."
          />
      <Icon name="send" size={24} color="#0084ff" onPress={hanndleClickAddMessage}/>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
      flex: 1,
      padding: 10,
      backgroundColor: '#f0f0f0',
  },
  messagesList: {
      flex: 1,
  },
  messageContainerLeft: {
      flexDirection: 'row',
      alignSelf: 'flex-start',
      backgroundColor: '#e1ffc7',
      padding: 10,
      borderRadius: 10,
      marginBottom: 10,
      maxWidth: '70%',
  },
  messageContainerRight: {
      flexDirection: 'row',
      alignSelf: 'flex-end',
      backgroundColor: '#0084ff',
      padding: 10,
      borderRadius: 10,
      marginBottom: 10,
      maxWidth: '70%',
  },
  messageContent: {
      color: '#000',
  },
  seenStatusContainer: {
      justifyContent: 'center',
      marginLeft: 5,
  },
  inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop: 10,
      borderTopWidth: 1,
      borderColor: '#ccc',
      backgroundColor: '#fff',
  },
  input: {
      flex: 1,
      borderColor: '#ccc',
      borderWidth: 1,
      borderRadius: 5,
      padding: 10,
      marginRight: 10,
  },
});

export default message