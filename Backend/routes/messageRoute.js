const express=require("express");
const router=express.Router();
const authMiddleWare=require("../middleware/auth");
const messageController=require("../controllers/messageController");
router.post("/sendMessage",authMiddleWare,messageController.sendMessageController);
router.get("/get/conversation",authMiddleWare,messageController.getConversationOfUserOrLaborerController);
router.post("/all/messages",authMiddleWare,messageController.getMessagesOfLaborerAndUserController);
module.exports=router;