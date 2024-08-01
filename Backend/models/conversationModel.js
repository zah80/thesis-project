const conn=require("../database/index");
const findConversationByUserIdAndLaborerID=async(userID,laborerID)=>{
    const sql="SELECT * FROM messages WHERE userID=? AND laborerID=?";
    const [result]= await conn.query(sql,[userID,laborerID]);
    return result[0];
}
const addNewConversation=async(messages)=>{
    const sql="INSERT INTO messages SET ?";
    const [result]= await conn.query(sql,[messages]);
    return result.insertId
}
const updateLastMessageAndSenderTypeInConversation=async(messageID,senderType,lastMessage,sent_at)=>{
const sql=`
UPDATE messages
SET lastMessage = ?, senderType = ?, sent_at = ?    WHERE messageID = ?`;
const [result]=await conn.query(sql,[lastMessage,senderType,sent_at,messageID]);
return result;
}
const getConversationOfUser=async(userID)=>{
    const sql = `
    SELECT 
      c.messageID, 
      c.userID, 
      c.laborerID, 
   

      
      c.sent_at,
      l.fullName, 
      l.image
    FROM messages c
    JOIN laborers l ON c.laborerID = l.laborerID
    WHERE c.userID = ?
  `;
  const [results] = await conn.query(sql, [userID]);
  console.log("result laborers",results);
  return results;
}
const getConversationOfLaborer=async(laborerID)=>{
    const sql = `
    SELECT 
      c.messageID, 
      c.userID, 
      c.laborerID, 
  
   
       
      c.sent_at,
      u.fullName, 
      u.image
    FROM messages c
    JOIN users u ON c.userID = u.userID
    WHERE laborerID = ?
     ORDER BY c.sent_at ASC
  `;
  const [results] = await conn.query(sql, [laborerID]);
  console.log("result users",results);

  return results;
}
const updateSeenStatusOfConversationToTrue=async(laborerID,userID,senderType)=>{
    const sql = `
    UPDATE messages 
   
    WHERE userID = ? 
    AND laborerID = ? 
    
    AND senderType != ?;
  `;


    const [result] = await conn.query(sql, [userID, laborerID, senderType]);
    return result;
}
module.exports={findConversationByUserIdAndLaborerID,addNewConversation,
    updateLastMessageAndSenderTypeInConversation,getConversationOfLaborer,getConversationOfUser,
    updateSeenStatusOfConversationToTrue};