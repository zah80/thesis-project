const path=require("path");
const upload=require("../middleware/multer");

const laborerController=require("../controllers/laborerController");
const express=require("express");
const router=express.Router();

router.post('/create',upload.single("imagelaborer"),laborerController.createLaborerController);
router.post('/login',laborerController.loginLaborer);
module.exports=router;