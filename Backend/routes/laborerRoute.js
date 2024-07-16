const path=require("path");
const upload=require("../middleware/multer");
const authMiddleWare=require("../middleware/auth")
const laborerController=require("../controllers/laborerController");
const express=require("express");
const router=express.Router();

router.post('/create',upload.single("images"),laborerController.createLaborerController);
router.post('/login',laborerController.loginLaborer);
router.post("/addImages",upload.fields([{ name: 'images', maxCount: 10 }]),authMiddleWare("laborer"),
laborerController.AddIamgesToLaborer);
router.delete("/image/:imageID",laborerController.deleteImageController);
router.get("/allLaborers",laborerController.getAllLaborersController)
router.get("/one",authMiddleWare("laborer"),laborerController.getOneLaborerController);
router.post("/update",upload.single("images"),authMiddleWare("laborer"),laborerController.updateLaborerController);
router.delete("/remove",authMiddleWare("laborer"),laborerController.deleteLaborerController);
module.exports=router;