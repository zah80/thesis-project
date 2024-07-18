const upload=require("../middleware/multer");
const authMiddleWare=require("../middleware/auth")
const ratingController = require("../controllers/ratingController");
const express=require("express");
const router=express.Router();

router.post("/:id",authMiddleWare("user"),ratingController.comment);
router.get("/one/:id",ratingController.getCommentController);
router.put("/:id",ratingController.updateCommentById);
router.delete("/:id",ratingController.deleteCommentById);

module.exports = router;