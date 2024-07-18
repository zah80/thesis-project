const conn = require('../database/index');

const createJob = async (job) => {
  const sql = 'INSERT INTO `jobs` SET ?';
  const [result] = await conn.query(sql, [job]);
  return result.insertId;
};

const getAllJobs = async () => {
  const sql = 'SELECT * FROM `jobs`';
  const [result] = await conn.query(sql);
  return result;
};

const getJobById = async (jobID) => {
  const sql = 'SELECT * FROM `jobs` WHERE jobID = ?';
  const [result] = await conn.query(sql, [jobID]);
  return result.length ? result[0] : null;
};

const getJobByName = async (jobName) => {
  const sql = 'SELECT * FROM `jobs` WHERE jobName = ?';
  const [result] = await conn.query(sql, [jobName]);
  return result.length ? result[0] : null;
};

const updateJob = async (jobID, job) => {
  const sql = 'UPDATE `jobs` SET ? WHERE jobID = ?';
  const [result] = await conn.query(sql, [job, jobID]);
  return result;
};

const deleteJob = async (jobID) => {
  const sql = 'DELETE FROM `jobs` WHERE jobID = ?';
  const [result] = await conn.query(sql, [jobID]);
  return result;
};

module.exports = {
  createJob,
  getAllJobs,
  getJobById,
  getJobByName,
  updateJob,
  deleteJob
};
