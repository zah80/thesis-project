const {makeJobRequest, getJobRequest, getOneJobRequestById, deleteJobRequest,
     updateState,countNumbersUnseen,getAllJobRequests} = require ('../models/jobRequestModel');
const {addNotification}=require("../models/notificationLaborerModel");
const socket=require("../socket/socketServer");
const createJobRequest = async (req, res) => {
    const { address,description} = req.body;
    const laborerID = req.params.id;
    const userID = req.body.userID;
    try{
        const newJobRequestID = await makeJobRequest(address, description, userID, laborerID);
        console.log("Job request saved successfully:", newJobRequestID);
        const notification = {
            typeNotification: 'job_request',
            postID: null,
            jobRequestID: newJobRequestID,
            text: `New job request  created: ${address}`,
            userID: userID,
            laborerID: laborerID, 
          }
        const notificatioID= await addNotification(notification);
        const laborerSocketID=socket.getLaborerSocketID(laborerID);
        if(laborerSocketID){
            socket.socketServer.to(laborerSocketID).emit("notificationJobRequest",{
                notificatioID:notificatioID,
                ...notification
            })
        }
        res.status(201).json(newJobRequestID);
    } catch (error) {
        console.error("Error saving job request:", error.message);
        res.status(409).json({ message: error.message });
    }
};

const getJobRequestController = async (req, res) => {
    try {
       const laborerID=req.body.laborerID
        const jobRequests = await getJobRequest(laborerID);
        res.status(200).json(jobRequests);
    } catch (error) {
        console.error("Error fetching job requests:", error.message);
        res.status(404).json({ message: error.message });
    }
};

const getAllJobRequestsController = async (req, res) => {
    try {
        const jobRequests = await getAllJobRequests();
        res.status(200).json(jobRequests);
    } catch (error) {
        console.error("Error fetching all job requests:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const getOneJobRequestByIdController = async (req, res) => {
    const { id } = req.params;
    try {
        const jobRequest = await getOneJobRequestById(id);
        if (!jobRequest || jobRequest.length === 0) {
            return res.status(404).json({ message: "Job request not found" });
        }
        res.status(200).json(jobRequest[0]);
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
    const laborerID=req.body.laborerID;
    try {
        const result = await updateState(laborerID);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Job request not found" });
        }
        res.status(200).json({ message: "Job request updated", result });
    } catch (error) {
        console.error("Error updating job request:", error.message);
        res.status(500).json({ message: error.message });
    }
};
const countNumbersUnseenController=async(req,res)=>{
    const laborerID=req.body.laborerID;
    try {
        const result = await countNumbersUnseen(laborerID);
        if (!result) {
            return res.status(404).json({ message: "not found count" });
        }
        res.status(200).json({ message: "found count", result });
    } catch (error) {
        console.error("Error :", error);
        res.status(500).json({ message: error });
    }
}


module.exports = {createJobRequest, getJobRequestController, getOneJobRequestByIdController, 
    countNumbersUnseenController,deleteJobRequestController, updateStateController,getAllJobRequestsController}
