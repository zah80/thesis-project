const pool = require("../database/index");
const bcrypt = require('bcrypt');

const createUser = async (user) => {
  const [result] = await pool.query('INSERT INTO users SET ?', user);
  return result;
};


const findUserByEmail = async (email) => {
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  if (rows.length === 0) {
    return null;
  }
  return rows[0];
};


const getOneUserByID = async (userID) => {
  const [rows] = await pool.query('SELECT * FROM users WHERE userID = ?', [userID]);
  if (rows.length === 0) {
    return null;
  }
  return rows[0];
};

module.exports = { createUser, findUserByEmail, getOneUserByID };
