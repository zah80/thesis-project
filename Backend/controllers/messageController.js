const Conversation=require("../models/conversationModel");
const Message=require("../models/messageModel");
const Socket=require("../socket/socketServer");
const sendMessageController=async(req,res)=>{
    const { userID, laborerID, senderType, text } = req.body;
console.log("reqbody id",req.body);
console.log("type is ",senderType);
    try {
      let conversation = await Conversation.findConversationByUserIdAndLaborerID(userID, laborerID);
  
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
        const conversationID = await Conversation.addNewConversation(conversationData);
        conversation = {id: conversationID };
      } else {
        console.log("reach  found",conversation);

        const conversationID = conversation.conversationID;
        await Conversation.updateLastMessageAndSenderTypeInConversation(conversationID, senderType, text, new Date());
      }

      const messageData = {
        userID,
        laborerID,
        text,
        senderType
      };
      const messageID = await Message.addMessage(messageData);
  if(senderType==="user"){
    const laborerSocketID = Socket.getLaborerSocketID(laborerID);
		if (laborerSocketID) {
			Socket.socketServer.to(laborerSocketID).emit("newMessage", text);
		}
  }
  else if(senderType==="laborer"){
    const userSocketID = Socket.getUserSocketID(userID);
		if (userSocketID) {
			Socket.socketServer.to(userSocketID).emit("newMessage", text);
		}
  }
      res.status(201).json({ message: 'Message sent successfully', messageID });
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
result=await Conversation.getConversationOfLaborer(laborerID);
}
else if(userID!==null){
    result=await Conversation.getConversationOfUser(userID);
  

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