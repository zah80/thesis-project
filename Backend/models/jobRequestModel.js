const conn = require ('../database/index');


const makeJobRequest = async (address, description, userID, laborerID) => {
    const sql = 'INSERT INTO job_requests (address, description, userID, laborerID) VALUES (?, ?, ?, ?)';
    const [result] = await conn.query(sql, [address, description, userID, laborerID]);
    return result;
};

const getJobRequest = async (laborerID) => {
    const sql = 'SELECT * FROM job_requests WHERE laborerID = ?';
    const [result] = await conn.query(sql, [laborerID]);
    return result;
};



const getOneJobRequestById = async (Id) => {
    const sql = 'SELECT * FROM job_requests WHERE job_requestsID = ?';
    const [result] = await conn.query(sql, [Id]);
    return result;
};



const deleteJobRequest = async (Id) => {
    const sql = 'DELETE FROM job_requests WHERE job_requestsID = ?';
    const [result] = await conn.query(sql, [Id]);
    return result;
};


const updateState = async (jobRequestId) => {
    const sql = 'UPDATE job_requests SET seen = 1 WHERE job_requestsID = ?';
    const [result] = await conn.query(sql, [jobRequestId]);
    return result;
};





module.exports = {makeJobRequest, getJobRequest, getOneJobRequestById, deleteJobRequest, updateState}