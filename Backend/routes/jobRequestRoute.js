const authMiddleware = require("../middleware/auth");
const jobRequestController = require("../controllers/jobRequestController");
const express = require("express");
const router = express.Router();

router.post('/:id', authMiddleware, jobRequestController.createJobRequest);
router.get("/:id", jobRequestController.getJobRequestController);
router.get("/one/:id", jobRequestController.getOneJobRequestByIdController);
router.get("/", jobRequestController.getAllJobRequestsController); // New route for getting all job requests
router.put("/:id", jobRequestController.updateStateController);
router.delete("/:id", jobRequestController.deleteJobRequestController);

module.exports = router;
