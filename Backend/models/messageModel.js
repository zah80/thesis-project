const conn=require("../database/index");
const addMessage=async(message)=>{
    const sql="INSERT INTO messages SET ?";
    const [result]= await conn.query(sql,[message]);
    const insertedMessageId = result.insertId;

    const [rows] = await conn.query("SELECT * FROM messages WHERE messageID = ?",[insertedMessageId]);
    
    return rows[0];
}
const getMessagesOfLaborerAndUser=async(laborerID,userID)=>{
    const sql="SELECT * FROM messages WHERE laborerID=? AND userID=?   ORDER BY sent_at ASC";
    const [result]= await conn.query(sql,[laborerID,userID]);
    return result
}
const updateSeenStatusOfMessagesToTrue=async(laborerID,userID,senderType)=>{
    console.log("laborerID:", laborerID);
    console.log("userID:", userID);
    console.log("senderType:", senderType);
    const sql =`
    UPDATE messages 
    SET seen = true 
    WHERE userID = ? 
    AND laborerID = ? 
    AND seen = false 
    AND senderType != ?;
  `;


    const [result] = await conn.query(sql, [userID, laborerID,senderType]);
    return result;
  
    
  
}
module.exports={addMessage,getMessagesOfLaborerAndUser,updateSeenStatusOfMessagesToTrue};