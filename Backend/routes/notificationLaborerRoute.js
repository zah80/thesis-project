const express = require("express");
const notification=require("../controllers/notificationLaborerController");
const router = express.Router();
const authMiddleWare=require("../middleware/auth");
router.get("/all",authMiddleWare,notification.getNotificationsOfLaborerController);
router.delete("/delete/:notificationID",notification.deleteNotificationController);
router.get("/count",authMiddleWare,notification.countNumberUnseenNotificationsController);
router.post("/editSeen",authMiddleWare,notification.updateStatesSeenToTrueController);
router.post("/editClicked/:notificationID",notification.updateStateClickToTrueController);
router.delete('/post/:postID', notification.deleteNotificationByPostIDController);

module.exports=router;