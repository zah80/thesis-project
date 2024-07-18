const conn=require("../database/index");
const findConversationByUserIdAndLaborerID=async(userID,laborerID)=>{
    const sql="SELECT * FROM conversations WHERE userID=? AND laborerID=?";
    const [result]= await conn.query(sql,[userID,laborerID]);
    return result[0];
}
const addNewConversation=async(conversation)=>{
    const sql="INSERT INTO conversations SET ?";
    const [result]= await conn.query(sql,[conversation]);
    return result.insertId
}
const updateLastMessageAndSenderTypeInConversation=async(conversationID,senderType,lastMessage,sent_at)=>{
const sql=`
UPDATE conversations
SET lastMessage = ?, senderType = ?, sent_at = ?   WHERE conversationID = ?`;
const [result]=await conn.query(sql,[lastMessage,senderType,sent_at,conversationID]);
return result;
}
const getConversationOfUser=async(userID)=>{
    const sql = `
    SELECT 
      c.conversationID, 
      c.userID, 
      c.laborerID, 
      c.senderType, 
      c.lastMessage, 
      c.seen, 
      c.sent_at,
      l.fullName, 
      l.image
    FROM conversations c
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
      c.conversationID, 
      c.userID, 
      c.laborerID, 
      c.senderType, 
      c.lastMessage, 
      c.seen, 
      c.sent_at,
      u.fullName, 
      u.image
    FROM conversations c
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
    UPDATE conversations 
    SET seen = true 
    WHERE userID = ? 
    AND laborerID = ? 
    AND seen = false 
    AND senderType != ?;
  `;


    const [result] = await conn.query(sql, [userID, laborerID, senderType]);
    return result;
}
module.exports={findConversationByUserIdAndLaborerID,addNewConversation,
    updateLastMessageAndSenderTypeInConversation,getConversationOfLaborer,getConversationOfUser,
    updateSeenStatusOfConversationToTrue};