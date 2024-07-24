const path=require("path");
const upload=require("../middleware/multer");
const authMiddleWare=require("../middleware/auth")
const laborerController=require("../controllers/laborerController");
const express=require("express");
const router=express.Router();

router.post('/create',upload.single("images"),laborerController.createLaborerController);
router.post('/login',laborerController.loginLaborer);
router.post("/addImages",upload.fields([{ name: 'images', maxCount: 10 }]),authMiddleWare,
laborerController.AddIamgesToLaborer);
router.delete("/image/:imageID",laborerController.deleteImageController);
router.get("/allLaborers",laborerController.getAllLaborersController)
router.get("/one",authMiddleWare,laborerController.getOneLaborerController);
router.post("/update",upload.single("images"),authMiddleWare,laborerController.updateLaborerController);
router.delete("/remove",authMiddleWare,laborerController.deleteLaborerController);
router.get("/commonJobs", laborerController.getCommonJobNameController);


module.exports=router;