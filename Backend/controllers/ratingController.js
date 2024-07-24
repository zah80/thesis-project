const jwt = require('jsonwebtoken');
const conn = require('../database/index'); // Assuming this is where the database connection is
const {makeComment, updateComment, getComment, deleteComment, getComments } = require ('../models/ratingModel');


const comment = async (req, res) => {
    try {
        const { rate, comment } = req.body;
        const laborerId = req.params.id;
        const userId = req.body.userID;

        // Check if laborerId is present
        if (!laborerId) {
            return res.status(400).json({ error: "Laborer ID is required" });
        }
        // Check if userId is present
        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }

        // Proceed to make the comment
        const newComment = await makeComment(laborerId, userId, comment, rate);

        res.status(201).json({ newComment });
    } catch (error) {
        console.error("Error creating comment:", error.message);
        res.status(500).json({ error: error.message });
    }
};



const deleteCommentById = async (req, res) => {
    try {
        const ratingId = req.params.id;
        console.log("ratingId:", ratingId);

        // Check if ratingId is present
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
        const { comment, rate } = req.body;
        console.log("ratingId:", ratingId);

        // Check if ratingId, comment, and rate are present
        if (!ratingId) {
            return res.status(400).json({ error: "Rating ID is required" });
        }
        if (comment === undefined || rate === undefined) {
            return res.status(400).json({ error: "Comment and rate are required" });
        }

        const result = await updateComment(ratingId, comment, rate);
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
        console.log('Extracted Laborer ID:', laborerID);
        const comments = await getComments(laborerID);
        console.log('Comments Data:', comments);
        return res.status(200).json(comments);
    } catch (error) {
        console.error('Error fetching ratings by token:', error);
        if (!res.headersSent) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }
};

  


module.exports = {comment, deleteCommentById, updateCommentById, getRatingsByToken};