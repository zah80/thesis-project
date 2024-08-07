const { makeComment, updateComment, getComments, deleteComment, fetchAllRatings,makeRate,
    updateRate,getRateOfTheUserForTheLaborer } = require('../models/ratingModel');

const comment = async (req, res) => {
    const {comment } = req.body;
        const laborerId = req.params.id;
        const userId = req.body.userID;
        console.log("check comment add",comment,laborerId,userId);
    try {
        

        if (!laborerId) {
            return res.status(400).json({ error: "Laborer ID is required" });
        }
        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }
if(!comment){
    return res.status(400).json({error:"rate or comment required"})
}

        const newComment = await makeComment(laborerId, userId,comment);

        res.status(201).json(newComment);
    } catch (error) {
        console.error("Error creating comment:", error.message);
        res.status(500).json({ error: error.message });
    }
};

const deleteCommentById = async (req, res) => {
    try {
        const ratingId = req.params.id;

        if (!ratingId) {
            return res.status(400).json({ error: "Rating ID is required" });
        }

        const result = await deleteComment(ratingId);
        res.status(200).json({ message: "Comment deleted successfully", result });
    } catch (error) {
        console.error("Error deleting comment:", error.message);
        res.status(500).json({ error: error.message });
    }
};

const updateCommentById = async (req, res) => {
    try {
        const ratingId = req.params.id;
        const { comment } = req.body;
console.log("updated rate",ratingId,comment);
        if (!ratingId) {
            return res.status(400).json({ error: "Rating ID is required" });
        }
        if (!comment) {
            return res.status(400).json({ error: "Comment or rate are required" });
        }

        const result = await updateComment(ratingId, comment);
        res.status(200).json({ message: "Comment updated successfully", result });
    } catch (error) {
        console.error("Error updating comment:", error.message);
        res.status(500).json({ error: error.message });
    }
};

const getRatingsByToken = async (req, res) => {
    try {
        const laborerID = req.body.laborerID;

        if (!laborerID) {
            return res.status(401).json({ message: 'Laborer ID is required' });
        }
        const comments = await getComments(laborerID);
        return res.status(200).json(comments);
    } catch (error) {
        console.error('Error fetching ratings by token:', error);
        if (!res.headersSent) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }
};

const getAllRatingsController = async (req, res) => {
    try {
        const ratings = await fetchAllRatings();
        res.status(200).json(ratings);
    } catch (error) {
        console.error('Error fetching all ratings:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
const getRatingsByID = async (req, res) => {
    try {
        const laborerID = req.params.laborerID;

        if (!laborerID) {
            return res.status(401).json({ message: 'Laborer ID is required' });
        }
        const comments = await getComments(laborerID);
       
        return res.status(200).json(comments);
    } catch (error) {
        console.error('Error fetching ratings by token:', error);
        if (!res.headersSent) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }
};
const addOrUpdateRate = async (req, res) => {
    try {
        const laborerID = req.params.laborerID;
const {rate,userID}=req.body;
console.log("check all rates",rate,userID,laborerID);
        if (!laborerID||!userID||!rate) {
            return res.status(401).json({ message: ' ID is required' });
        }
        const rateUser = await getRateOfTheUserForTheLaborer(userID,laborerID);
        let result;
        console.log("rateuser",rateUser);
        if(!rateUser||rateUser.length===0){
result=await makeRate(laborerID,userID,rate);
console.log("result add rate",result);        
}
        else{
result=await updateRate(rateUser[0].ratingID,rate);
console.log("result update rate",result);        

        }
        return res.status(200).json(result);
    } catch (error) {
        console.error('Error :', error);
        if (!res.headersSent) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }
};
const getRateOfTheUserForTheLaborerController=async(req,res)=>{
    try {
        const laborerID = req.params.laborerID;
const userID=req.body.userID;
       
        const rateUser = await getRateOfTheUserForTheLaborer(userID,laborerID);
        if(rateUser){
        return res.status(200).json({success:true,rateUser});
        }
        else{
            return res.status(400).json({success:false});
        }
    } catch (error) {
        console.error('Error fetching ratings by token:', error);
        res.status(500).json({ message: 'Server error', success:false});
    }
}
module.exports = { comment, deleteCommentById, updateCommentById, getRatingsByToken, getAllRatingsController
    ,getRatingsByID,addOrUpdateRate,getRateOfTheUserForTheLaborerController };
