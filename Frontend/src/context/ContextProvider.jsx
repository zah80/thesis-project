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
 const [jobs,setJobs]=useState([]);
 const [countries,setCountries]=useState([]);
 const [imagesExperienceOfLaborer,setImagesExperienceOfLaborer]=useState([]);
 const [userAppointment,setUserAppointment]=useState({});
 const url="https://fda4-197-30-218-93.ngrok-free.app";
 const Socket=io("https://fda4-197-30-218-93.ngrok-free.app");
 const getLaborerDetails=async(token)=>{
const response=await axios.get(url+"/api/laborers/one",{headers:{token}});
return response.data;
 }
 const getUserDetails=async(token)=>{
const response=await axios.get(url+"/api/users/profile",{headers:{token}});
return response.data;
 }
 const getAllJobs = async () => {
  try {
  const response = await axios.get(url+'/api/jobs');
  console.log("alljobscontex",response.data);
  setJobs(response.data);
  } catch (error) {
    console.log(error);
    console.error('Error fetching jobs:', error);
    return [];
  }
};
const getAllCountries = async () => {
  try {
    const response = await axios.get(url+'/api/countries');
    console.log("allscontex",response.data);

    setCountries(response.data);
  } catch (error) {
    console.log(error);
    console.error('Error fetching countries:', error);
    return [];
  }
};
useEffect(()=>{
  const loadData=async()=>{
    const tokLab=await AsyncStorage.getItem("tokenLaborer");
    const tokUser=await AsyncStorage.getItem("tokenUser");
    console.log("conetxt user",tokUser);
    console.log("conetxt laborer",tokLab);
    console.log("context labprer");
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
  console.log("images is ",data.images);
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
  getAllJobs();
  getAllCountries();
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
    jobs,
    countries,
    setImagesExperienceOfLaborer,
    setUserAppointment,
    userAppointment
}
  return(
    <MyContext.Provider value={contextValue}>
    {children}
    </MyContext.Provider>
  );
};
export {MyContext,MyProvider};
