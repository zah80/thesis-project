const conn = require('../database/index');



const makeComment = async (laborerID, userID, comment, rate) => {
    const sql = 'INSERT INTO `rating` (comment, rate, laborerID, userID) VALUES (?, ?, ?, ?)';
    const [result] = await conn.query(sql, [comment, rate, laborerID, userID]);
    return result;
};



const deleteComment = async (ratingID) => {
    const sql = 'DELETE FROM `rating` WHERE ratingID = ?';
    const [result] = await conn.query(sql, [ratingID]);
    return result;
    };


const updateComment = async (ratingID, comment, rate) => {
    const sql = 'UPDATE `rating` SET comment = ?, rate = ? WHERE ratingID = ?';
    const [result] = await conn.query(sql, [comment, rate, ratingID]);
    return result;
};

// Function to get all comments and ratings for a specific laborer, including the fullName from users
const getComments = async (laborerID) => {
    const sql = `
      SELECT 
        r.comment, 
        r.rate, 
        u.fullName 
      FROM 
        rating r
      JOIN 
        users u 
      ON 
        r.userID = u.userID 
      WHERE 
        r.laborerID = ?
    `;
    const [result] = await conn.query(sql, [laborerID]);
    return result;
};


  

module.exports = {makeComment, deleteComment, updateComment, getComments}