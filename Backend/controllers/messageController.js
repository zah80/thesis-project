const Message=require("../models/conversationModel");
const Socket=require("../socket/socketServer");
const sendMessageController=async(req,res)=>{
    const { userID, laborerID, senderType, text } = req.body;
console.log("reqbody id",req.body);
console.log("type is ",senderType);
    try {
      let conversation = await Message.findConversationByUserIdAndLaborerID(userID, laborerID);
  
     console.log("conversation is ",conversation);
      if (!conversation) {
        console.log("reach not found",conversation);
       const  lastMessage= text;
        const conversationData = {
          userID,
          laborerID,
          lastMessage,
          senderType
        };
        const messageID = await Message.addNewConversation(conversationData);
        conversation = {id: messageID };
      } else {
        console.log("reach  found",conversation);

        const messageID = Message.messageID;
        await Message.updateLastMessageAndSenderTypeInConversation(messageID, senderType, text, new Date());
      }

      const messageData = {
        userID,
        laborerID,
        text,
        senderType
      };
      const message = await Message.addMessage(messageData);
  if(senderType==="user"){
    const laborerSocketID = Socket.getLaborerSocketID(laborerID);
		if (laborerSocketID) {
			Socket.socketServer.to(laborerSocketID).emit("newMessage", message);
		}
  }
  else if(senderType==="laborer"){
  const userSocketID = Socket.getUserSocketID(userID);
	 if (userSocketID) {
		Socket.socketServer.to(userSocketID).emit("newMessage", message);
		}
  }
      res.status(201).json({ message: 'Message sent successfully', message });
    } catch (error) {
      console.error('Error sending message:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
}
const getConversationOfUserOrLaborerController=async(req,res)=>{
const {senderType}=req.body;
const laborerID=senderType==="laborer"?req.body.laborerID:null;
const userID=senderType==="laborer"?null:req.body.userID;
try{
let result;
if(laborerID!==null){
result=await Message.getConversationOfLaborer(laborerID);
}
else if(userID!==null){
    result=await Message.getConversationOfUser(userID);
}
res.status(201).json({ message: 'geted successfully', result });
}
catch(error){
    console.log('Error sending message:', error);
    res.status(500).json({ error: 'Internal Server Error' });
}
}
const getMessagesOfLaborerAndUserController=async(req,res)=>{
   const {userID,laborerID}=req.body;
   try {
    const messages = await Message.getMessagesOfLaborerAndUser(laborerID, userID);
    res.status(200).json(messages);
  } catch (error) {
    console.log('Error fetching messages:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
module.exports={sendMessageController,getConversationOfUserOrLaborerController,
  getMessagesOfLaborerAndUserController
};