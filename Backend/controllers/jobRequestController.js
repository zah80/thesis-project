const {makeJobRequest, getJobRequest, getOneJobRequestById, deleteJobRequest, updateState} = require ('../models/jobRequestModel');


const createJobRequest = async (req, res) => {
    const { address, description } = req.body;
    const laborerID = req.params.id;
    const userID = req.body.userID;
    try {
        const newJobRequest = await makeJobRequest(address, description, userID, laborerID);
        console.log("Job request saved successfully:", newJobRequest);
        res.status(201).json(newJobRequest);
    } catch (error) {
        console.error("Error saving job request:", error.message);
        res.status(409).json({ message: error.message });
    }
};

const getJobRequestController = async (req, res) => {
    try {
        const { id } = req.params; // Assuming id is part of params
        const jobRequests = await getJobRequest(id);
        res.status(200).json(jobRequests);
    } catch (error) {
        console.error("Error fetching job requests:", error.message);
        res.status(404).json({ message: error.message });
    }
};

const getOneJobRequestByIdController = async (req, res) => {
    const { id } = req.params;
    try {
        const jobRequest = await getOneJobRequestById(id);
        if (!jobRequest || jobRequest.length === 0) {
            return res.status(404).json({ message: "Job request not found" });
        }
        res.status(200).json(jobRequest[0]); // Assuming jobRequest is an array with one element
    } catch (error) {
        console.error("Error fetching job request by ID:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


const deleteJobRequestController = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await deleteJobRequest(id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Job request not found" });
        }
        res.status(200).json({ message: "Job request deleted" });
    } catch (error) {
        console.error("Error deleting job request:", error.message);
        res.status(404).json({ message: error.message });
    }
};


const updateStateController = async (req, res) => {
    const { id } = req.params; // Assuming id corresponds to job_requestsID
    try {
        const result = await updateState(id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Job request not found" });
        }
        res.status(200).json({ message: "Job request updated", result });
    } catch (error) {
        console.error("Error updating job request:", error.message);
        res.status(500).json({ message: error.message });
    }
};



module.exports = {createJobRequest, getJobRequestController, getOneJobRequestByIdController, deleteJobRequestController, updateStateController}