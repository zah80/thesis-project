const authMiddleWare = require ("../middleware/auth");
const jobRequestController = require("../controllers/jobRequestController");
const express = require("express");
const router = express.Router();

router.post('/:id', authMiddleWare, jobRequestController.createJobRequest);
router.get("/all",authMiddleWare,jobRequestController.getJobRequestController);
router.get("/one/:id", jobRequestController.getOneJobRequestByIdController);
router.put("/editSeen",authMiddleWare, jobRequestController.updateStateController)
router.delete("/:id", jobRequestController.deleteJobRequestController);
router.get("/countNotSeen",authMiddleWare,jobRequestController.countNumbersUnseenController);
module.exports = router;
