const conn = require('../database/index');

const makeJobRequest = async (address, description, userID, laborerID) => {
    const sql = 'INSERT INTO job_requests (address, description, userID, laborerID) VALUES (?, ?, ?,?)';
    const [result] = await conn.query(sql, [address,description,userID,laborerID]);
    return result.insertId;
};

const getJobRequest = async (laborerID) => {
    const sql = `
        SELECT 
            jr.job_requestsID, 
            jr.address, 
            jr.description, 
            jr.time, 
            jr.userID, 
            jr.laborerID, 
            jr.seen, 
            jr.timeSend, 
            u.fullName, 
            u.image
        FROM job_requests jr
        JOIN users u ON jr.userID = u.userID
        WHERE jr.laborerID = ?
    `;
    const [result] = await conn.query(sql, [laborerID]);
    return result;
};

const getOneJobRequestById = async (Id) => {
    const sql = `
    SELECT 
        jr.job_requestsID, 
        jr.address, 
        jr.description, 
        jr.time, 
        jr.userID, 
        jr.laborerID,
        jr.timeSend, 
        u.fullName, 
        u.image
    FROM job_requests jr
    JOIN users u ON jr.userID = u.userID
    WHERE jr.job_requestsID = ?
`;
    const [result] = await conn.query(sql, [Id]);
    return result;
};

const getAllJobRequests = async () => {
    const sql = 'SELECT * FROM job_requests';
    const [result] = await conn.query(sql);
    return result;
};

const deleteJobRequest = async (Id) => {
    const sql = 'DELETE FROM job_requests WHERE job_requestsID = ?';
    const [result] = await conn.query(sql, [Id]);
    return result;
};


const updateState = async (laborerID) => {
    const sql = 'UPDATE job_requests SET seen = true WHERE laborerID = ? AND seen=false';
    const [result] = await conn.query(sql, [laborerID]);
    return result;
};
const countNumbersUnseen=async(laborer)=>{
    const sql = 'SELECT COUNT(*) as unseenCount FROM job_requests WHERE laborerID = ? AND seen = false';
    const [rows] = await conn.query(sql, [laborerID]);
    return rows[0].unseenCount;
}
module.exports = {makeJobRequest, getJobRequest, getOneJobRequestById, deleteJobRequest, updateState
    ,countNumbersUnseen,getAllJobRequests
}
