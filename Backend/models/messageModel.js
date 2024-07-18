const conn=require("../database/index");
const addMessage=async(message)=>{
    const sql="INSERT INTO messages SET ?";
    const [result]= await conn.query(sql,[message]);
    return result.insertId
}
const getMessagesOfLaborerAndUser=async(laborerID,userID)=>{
    const sql="SELECT * FROM messages WHERE laborerID=? AND userID=?   ORDER BY sent_at ASC";
    const [result]= await conn.query(sql,[laborerID,userID]);
    return result
}
const updateSeenStatusOfMessagesToTrue=async(laborerID,userID,senderType)=>{
    const sql = `
    UPDATE messages 
    SET seen = true 
    WHERE userID = ? 
    AND laborerID = ? 
    AND seen = false 
    AND senderType != ?;
  `;


    const [result] = await conn.query(sql, [userID, laborerID, senderType]);
    return result;
  
    
  
}
module.exports={addMessage,getMessagesOfLaborerAndUser,updateSeenStatusOfMessagesToTrue};