const authMiddleWare = require ("../middleware/auth");
const jobRequestController = require("../controllers/jobRequestController");
const express = require("express");
const router = express.Router();

router.post('/:id', authMiddleWare("user"), jobRequestController.createJobRequest);
router.get("/:id", jobRequestController.getJobRequestController);
router.get("/one/:id", jobRequestController.getOneJobRequestByIdController);
router.put("/:id", jobRequestController.updateStateController)
router.delete("/:id", jobRequestController.deleteJobRequestController);

module.exports = router;
