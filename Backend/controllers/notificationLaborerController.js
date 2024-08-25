const {
    getNotificationsOfLaborer,
    updateStateClickToTrue,
    updateStatesSeenToTrue,
    countNumberUnseenNotifications,
    deleteNotification,deleteNotificationByPostID
  } = require("../models/notificationLaborerModel");
  
  const getNotificationsOfLaborerController = async (req, res) => {
    const { laborerID } = req.body;
    try {
      const notifications = await getNotificationsOfLaborer(laborerID);
      console.log("notif in back",notifications);
      res.status(200).json({ success: true, notifications });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
  const deleteNotificationByPostIDController = async (req, res) => {
    const {  postID } = req.params;

    try {
        const result = await deleteNotificationByPostID(postID);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'No notification found with the given postID.' });
        }
        res.status(200).json({ message: 'Notification deleted successfully.' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting notification.', error: err.message });
    }
};

    const updateStateClickToTrueController = async (req, res) => {
    const { notificationID } = req.params;
    try {
      const updatedRows = await updateStateClickToTrue(notificationID);
      res.status(200).json({ success: true, updatedRows });
    } catch (error) {
      res.status(500).json({ success: false, message: error });
    }
  };
   const updateStatesSeenToTrueController = async (req, res) => {
    const { laborerID } = req.body;
    try {
      const updatedRows = await updateStatesSeenToTrue(laborerID);
      res.status(200).json({ success: true, updatedRows });
    } catch (error) {
      res.status(500).json({ success: false, message: error });
    }
  };
  
 
  const countNumberUnseenNotificationsController = async (req, res) => {
    const { laborerID } = req.body;
    try {
      const unseenCount = await countNumberUnseenNotifications(laborerID);
      console.log("get count in back",unseenCount);
      res.status(200).json({ success: true, unseenCount });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
  
  
  const deleteNotificationController = async (req, res) => {
    const { notificationID } = req.params;
    try {
      const deletedRows = await deleteNotification(notificationID);
      if (deletedRows > 0) {
        res.status(200).json({ success: true, message: "Notification deleted" });
      } else {
        res.status(404).json({ success: false, message: "Notification not found or cannot be deleted" });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
  
  module.exports = {
    getNotificationsOfLaborerController,
    updateStateClickToTrueController,
    updateStatesSeenToTrueController,
    countNumberUnseenNotificationsController,
    deleteNotificationController,
    deleteNotificationByPostIDController,
  };
  