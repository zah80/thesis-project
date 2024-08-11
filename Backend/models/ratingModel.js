const conn = require('../database/index');
const {getOneUserByID}=require("./users");
const makeComment = async (laborerID, userID, comment) => {
    const sql = 'INSERT INTO `rating` (comment, laborerID, userID) VALUES (?, ?, ?)';
    const [result] = await conn.query(sql, [comment, laborerID, userID]);
 const user=await getOneUserByID(userID);
    return {
      image:user.image,
      fullName:user.fullName,
      ratingID: result.insertId,
      laborerID,
      userID,
      comment,
      sent_at: new Date().toISOString()
  };
};

const deleteComment = async (ratingID) => {
    const sql = 'DELETE FROM `rating` WHERE ratingID = ?';
    const [result] = await conn.query(sql, [ratingID]);
    return result;
};

const updateComment = async (ratingID, comment) => {
    const sql = 'UPDATE `rating` SET comment = ? WHERE ratingID = ?';
    const [result] = await conn.query(sql, [comment, ratingID]);
    return result;
};

const getComments = async (laborerID) => {
    const sql = `
      SELECT 
      r.ratingID,
      r.laborerID,
      r.userID,
        r.comment, 
        r.sent_at,
        u.fullName,
        u.image
      FROM 
        rating r
      JOIN 
        users u 
      ON 
        r.userID = u.userID 
      WHERE 
        r.laborerID = ? AND r.comment IS NOT NULL
    `;
    const [result] = await conn.query(sql, [laborerID]);
    console.log("result in model",result);
    return result;

};

const fetchAllRatings = async () => {
  const sql = `
    SELECT 
      r.ratingID,
      r.comment,
      r.rate,
      r.laborerID,
      l.fullName AS laborerName,
      r.userID,
      u.fullName AS userName
    FROM 
      rating r
    JOIN 
      users u 
    ON 
      r.userID = u.userID
    JOIN 
      laborers l
    ON 
      r.laborerID = l.laborerID
  `;
  const [result] = await conn.query(sql);
  return result;
};
const makeRate = async (laborerID, userID, rate) => {
  const sql = 'INSERT INTO `rating` (rate, laborerID, userID) VALUES (?, ?, ?)';
  const [result] = await conn.query(sql, [rate, laborerID, userID]);
  return result;
};
const updateRate= async (ratingID, rate) => {
  const sql = 'UPDATE `rating` SET rate = ? WHERE ratingID = ?';
  const [result] = await conn.query(sql, [ rate, ratingID]);
  return result;
};
const getRateOfTheUserForTheLaborer = async (userID,laborerID) => {
  const sql = 'SELECT * FROM rating WHERE userID=? AND laborerID=?  AND rate IS NOT NULL';
  const [result] = await conn.query(sql, [userID, laborerID]);
  return result;
};
module.exports = { makeComment, deleteComment, updateComment, getComments, fetchAllRatings,makeRate,
updateRate,getRateOfTheUserForTheLaborer
 };
