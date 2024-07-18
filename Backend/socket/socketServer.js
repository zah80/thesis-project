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
    socket.on("joinUser", (userID) => {
        users[userID]=socket.id;
        socket.to(`${users[userID]}`).emit("getOnlineLaborers", Object.keys(laborers));
      });
    
      socket.on("joinLaborer", (laborerID) => {
        laborers[laborerID]=socket.id;
        socket.to(`${laborers[laborerID]}`).emit("getOnlineUsers", Object.keys(users));
      });
      socket.on("disconnect", () => {
        for (let key in users) {
            if (users[key] === socket.id) {
                delete users[key];
                break;
            }
        }
        for (let key in laborers) {
            if (laborers[key] === socket.id) {
                delete laborers[key];
                break;
            }
        }
      });
      socket.on("markMessagesAsSeen", async ( userID, laborerID,senderType ) => {
		try {
		const messages=	await Message.updateSeenStatusOfMessagesToTrue(laborerID,userID,senderType);
		const conversation=	await Conversation.updateSeenStatusOfConversationToTrue(laborerID,userID,senderType);
		senderType==="user"?socket.to(laborers[laborerID]).emit("messagesSeen", { conversation }):
        socket.to(users[userID]).emit("messagesSeen", { conversation })	
        


        
		} catch (error) {
			console.log(error);
		}
	});
}
module.exports={getLaborerSocketID,getUserSocketID,socketServer};