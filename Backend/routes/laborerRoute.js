const path = require('path');
const upload = require('../middleware/multer'); // Importing correctly
const authMiddleWare = require('../middleware/auth');
const laborerController = require('../controllers/laborerController');
const express = require('express');
const router = express.Router();

router.post('/create',upload.single("images"),laborerController.createLaborerController);
router.post('/login',laborerController.loginLaborer);
router.post("/addImages",upload.fields([{ name: 'images', maxCount: 10 }]),authMiddleWare,
laborerController.AddIamgesToLaborer);
router.delete("/image/:imageID",laborerController.deleteImageController);
router.get("/allLaborers",laborerController.getAllLaborersController)
router.get("/one",authMiddleWare,laborerController.getOneLaborerController);
router.post("/update",upload.single("image"),authMiddleWare,laborerController.updateLaborerController);
router.delete("/remove",authMiddleWare,laborerController.deleteLaborerController);
router.get("/commonJobs", laborerController.getCommonJobNameController);
router.delete("/removeWithoutAuth/:id", laborerController.deleteLaborerWithoutAuthController); 
router.get("/oneByID/:laborerID",laborerController.getOneLaborerControllerByID);
router.get("/job/:jobID", laborerController.getLaborersByJobIDController);


module.exports=router;
