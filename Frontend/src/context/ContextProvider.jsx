import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react';
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
 const url="http://localhost:3000";
 const Socket=io(url);
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
  setSocket(Socket);
if(localStorage.getItem("tokenUser")){
  const data= await getUserDetails(localStorage.getItem("tokenUser"));
  setUserDetails(data.user);
  console.log("userdata",data.user);
  Socket.emit("joinUser",data.user.userID);
setTokenUser(localStorage.getItem("tokenUser"));
Socket.on("getOnlineLaborers",(laborers) => {
  setOnlineLaborers(laborers);
});
}
else if(localStorage.getItem("tokenLaborer")){
  const data=await getLaborerDetails(localStorage.getItem("tokenLaborer"));
  console.log("data lab",data);
  setLaborerDetails(data.laborer);
  setImagesExperienceOfLaborer(data.images);
  Socket.emit("joinLaborer",data.laborer.laborerID);

    setTokenLaborer(localStorage.getItem("tokenLaborer"));  
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
