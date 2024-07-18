const {
  createJob,
  getAllJobs,
  getJobById,
  getJobByName,
  updateJob,
  deleteJob
} = require('../models/jobsModel');

const createJobController = async (req, res) => {
  try {
    const jobID = await createJob(req.body);
    res.status(201).json({ jobID });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllJobsController = async (req, res) => {
  try {
    const jobs = await getAllJobs();
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getJobByIdController = async (req, res) => {
  try {
    const job = await getJobById(req.params.jobId);
    if (job) {
      res.status(200).json(job);
    } else {
      res.status(404).json({ message: 'Job not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getJobByNameController = async (req, res) => {
  try {
    const job = await getJobByName(req.params.jobName);
    if (job) {
      res.status(200).json(job);
    } else {
      res.status(404).json({ message: 'Job not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateJobController = async (req, res) => {
  try {
    const result = await updateJob(req.params.jobId, req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteJobController = async (req, res) => {
  try {
    await deleteJob(req.params.jobId);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createJobController,
  getAllJobsController,
  getJobByIdController,
  getJobByNameController,
  updateJobController,
  deleteJobController
};
