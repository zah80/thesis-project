const conn=require("../database/index");
const addNotification=async(notification)=>{
    const { typeNotification, postID, jobRequestID, text, userID, laborerID } = notification;
    const sql = `
      INSERT INTO notification_laborer (typeNotification, postID, jobRequestID, text, userID, laborerID)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    try {
      const [result] = await conn.query(sql, [typeNotification, postID, jobRequestID, text, userID, laborerID]);
      return result.insertId;
    } catch (error) {
      throw new Error('Error adding notification: ' + error.message);
    }
}
const getNotificationsOfLaborer=async(laborerID)=>{
    const sql = `
    SELECT *
    FROM notification_laborer
    WHERE laborerID = ? 
    ORDER BY sent_at DESC
  `;
  try {
    const [rows] = await conn.query(sql, [laborerID]);
    return rows;
  } catch (error) {
    throw new Error('Error fetching notifications: ' + error.message);
  }
}
const updateStateClickToTrue=async(notificationID)=>{
    const sql = `
    UPDATE notification_laborer
    SET clicked =  1
    WHERE notification_laborerID = ? AND clicked=0
  `;
  try {
    const [result] = await conn.query(sql, [notificationID]);
    return result.affectedRows;
  } catch (error) {
    throw new Error('Error updating click state: ' + error.message);
  }
}
const updateStatesSeenToTrue=async(laborerID)=>{
    const sql = `
    UPDATE notification_laborer
    SET seen = 1
    WHERE laborerID = ? AND seen=0
  `;
  try {
    const [result] = await conn.query(sql, [laborerID]);
    return result.affectedRows;
  } catch (error) {
    throw new Error('Error updating seen state: ' + error.message);
  }
}
const countNumberUnseenNotifications=async(laborerID)=>{
    const sql = `
    SELECT COUNT(*) AS unseenCount
    FROM notification_laborer
    WHERE laborerID = ?  AND seen = 0
  `;
  try {
    const [rows] = await conn.query(sql, [laborerID]);
    return rows[0].unseenCount;
  } catch (error) {
    throw new Error('Error counting unseen notifications: ' + error.message);
  }
}
const deleteNotification = async (notificationID) => {
    const sql = `
      DELETE FROM notification_laborer
      WHERE notification_laborerID = ?
    `;
    try {
      const [result] = await conn.query(sql, [notificationID]);
      return result.affectedRows;
    } catch (error) {
      throw new Error('Error deleting notification: ' + error.message);
    }
  };
  const deleteNotificationByPostID = async(postID) => {
    
        const query = 'DELETE FROM notification_laborer WHERE postID = ?';
       
        try {
          const [result]=  await   conn.query(query, [postID]);
          return result.affectedRows;
        } catch (error) {
          throw new Error('Error deleting notification: ' + error.message);
        }
  
  
};
  module.exports = {
    addNotification,
    getNotificationsOfLaborer,
    updateStateClickToTrue,
    updateStatesSeenToTrue,
    countNumberUnseenNotifications,
    deleteNotification,deleteNotificationByPostID
  };