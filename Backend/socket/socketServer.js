let users={};
let laborers={};
const Conversation=require("../models/conversationModel");
const Message=require("../models/messageModel");
 const getLaborerSocketID=(laborerID)=>{
return laborers[laborerID];
}
const getUserSocketID=(userID)=>{
return users[userID];
}
const socketServer=(socket)=>{
    socket.on("joinUser", (userID)=>{
        users[userID]=socket.id;
        socket.emit("getOnlineLaborers", Object.keys(laborers));
      });
        socket.on("joinLaborer", (laborerID) => {
        laborers[laborerID]=socket.id;
        socket.emit("getOnlineUsers", Object.keys(users));
      });
      socket.on("disconnect", () => {
        for (let key in users) {
            if (users[key] === socket.id) {
                delete users[key];
                socket.emit("getOnlineLaborers",Object.keys(laborers));
                break;
            }
        }
        for (let key in laborers) {
            if (laborers[key]===socket.id) {
                delete laborers[key];
                socket.emit("getOnlineUsers",Object.keys(users));
                break;
            }
        }
      });
        socket.on("markMessagesAsSeen",async(userID,laborerID,senderType ) => {
          try {
            const messages = await Message.updateSeenStatusOfMessagesToTrue(laborerID, userID, senderType);
            const conversation = await Conversation.updateSeenStatusOfConversationToTrue(laborerID, userID, senderType);
            
            if (senderType === "user") {
              const laborerSocketID = laborers[laborerID];
              if (laborerSocketID) {
                socket.to(laborerSocketID).emit("messagesSeen", { userID, laborerID, senderType });
              }
            } else {
              const userSocketID = users[userID];
              if (userSocketID) {
                socket.to(userSocketID).emit("messagesSeen", { userID, laborerID, senderType });
              }
            }
          } catch (error) {
            console.log(error);
          }
	});
}
module.exports={getLaborerSocketID,getUserSocketID,socketServer,laborers};