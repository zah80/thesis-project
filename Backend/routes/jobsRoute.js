const express = require("express");
const {
  createJobController,
  getAllJobsController,
  getJobByIdController,
  getJobByNameController,
  updateJobController,
  deleteJobController
} = require("../controllers/jobsController");

const router = express.Router();

router.post("/", createJobController);
router.get("/", getAllJobsController);
router.get("/:jobId", getJobByIdController);
router.get("/name/:jobName", getJobByNameController);
router.put("/:jobId", updateJobController);
router.delete("/:jobId", deleteJobController);

module.exports = router;
