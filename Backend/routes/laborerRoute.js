const path=require("path");
const upload=require("../middleware/multer");
const authMiddleWare=require("../middleware/auth")
const laborerController=require("../controllers/laborerController");
const express=require("express");
const router=express.Router();

router.post('/create',upload.single("imagelaborer"),laborerController.createLaborerController);
router.post('/login',laborerController.loginLaborer);
router.post("/addImages",upload.fields([{ name: 'images', maxCount: 10 }]),authMiddleWare("laborer"),
laborerController.AddIamgesToLaborer);
module.exports=router;