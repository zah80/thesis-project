const upload = require("../middleware/multer");
const authMiddleWare = require("../middleware/auth");
const ratingController = require("../controllers/ratingController");
const express = require("express");
const router = express.Router();

router.post("/:id", authMiddleWare, ratingController.comment);
router.put("/:id", authMiddleWare, ratingController.updateCommentById);
router.delete("/:id", authMiddleWare, ratingController.deleteCommentById);
router.get("/token", authMiddleWare, ratingController.getRatingsByToken);

module.exports = router;