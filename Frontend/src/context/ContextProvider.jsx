import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
const MyContext = createContext(null);

import io from "socket.io-client";
const MyProvider = ({ children }) => {
const [tokenUser,setTokenUser]=useState("");
 const [tokenLaborer,setTokenLaborer]=useState("");
 const [socket, setSocket] = useState(null);
 const [onlineUsers,setOnlineUsers]=useState(null);
 const [onlineLaborers,setOnlineLaborers]=useState(null);
 const [userDetails,setUserDetails]=useState({});
 const [laborerDetails,setLaborerDetails]=useState({});
 const [imagesExperienceOfLaborer,setImagesExperienceOfLaborer]=useState([]);
 const url="http://192.168.100.25:3000";
 const Socket=io("http://localhost:3000");
 const getLaborerDetails=async(token)=>{
const response=await axios.get(url+"/api/laborers/one",{headers:{token}});
return response.data;
 }
 const getUserDetails=async(token)=>{
  const response=await axios.get(url+"/api/users/profile",{headers:{token}});
return response.data;
 }
useEffect(()=>{
  const loadData=async()=>{
    const tokLab=await AsyncStorage.getItem("tokenLaborer");
    const tokUser=await AsyncStorage.getItem("tokenUser");
  setSocket(Socket);
if(tokUser){
  const data= await getUserDetails(tokUser);
  setUserDetails(data.user);
  console.log("userdata",data.user);
  Socket.emit("joinUser",data.user.userID);
setTokenUser(tokUser);
Socket.on("getOnlineLaborers",(laborers) => {
  setOnlineLaborers(laborers);
});
}
else if(tokLab){
  const data=await getLaborerDetails(tokLab);
  console.log("data lab",data);
  setLaborerDetails(data.laborer);
  setImagesExperienceOfLaborer(data.images);
  Socket.emit("joinLaborer",data.laborer.laborerID);

    setTokenLaborer(tokLab);  
    Socket.on("getOnlineUsers",(users)=>{
      setOnlineUsers(users);
    });  
}
else{
  if (socket) {
    socket.close();
    setSocket(null);
  }
}
  }
  loadData();
},[tokenLaborer,tokenUser])
const contextValue={
    tokenUser,
    setTokenUser,
    tokenLaborer,
    setTokenLaborer,
    onlineUsers,
    socket,
    userDetails,
    laborerDetails,
    imagesExperienceOfLaborer,
    url,
    onlineLaborers,
}
  return(
    <MyContext.Provider value={contextValue}>
    {children}
    </MyContext.Provider>
  );
};
export {MyContext,MyProvider};
