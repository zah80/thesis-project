const upload = require("../middleware/multer");
const authMiddleWare = require("../middleware/auth");
const ratingController = require("../controllers/ratingController");
const express = require("express");
const router = express.Router();

router.post("/addComment/:id", authMiddleWare, ratingController.comment);
router.put("/editComment/:id", ratingController.updateCommentById);
router.delete("/delete/:id", ratingController.deleteCommentById);
router.get("/token", authMiddleWare, ratingController.getRatingsByToken);
router.get("/", ratingController.getAllRatingsController);
router.get("/comments/:laborerID",ratingController.getRatingsByID);
router.post("/rateAdd/:laborerID",authMiddleWare,ratingController.addOrUpdateRate);
router.get("/getRate/:laborerID",authMiddleWare,ratingController.getRateOfTheUserForTheLaborerController);
module.exports = router;
