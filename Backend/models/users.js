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


<<<<<<< HEAD
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======

const getOneUserByID = async (userID) => {
  const [rows] = await pool.query('SELECT * FROM users WHERE userID = ?', [userID]);
return rows;
}
>>>>>>> 9d41e97723dedd634fe04a4767773c80dd593a23
>>>>>>> 4abd30c5d00637a4c87842c9fc567c5f26d8d1b5
=======
>>>>>>> 462de194ac184bf58d2ac516abff713f3a9ff2fc
const getAllUsers = async () => {
    const [rows] = await pool.query('SELECT * FROM users');
    return rows;
  };

<<<<<<< HEAD

  const getUserByID = async (userID) => {
=======
  const getOneUserByID = async (userID) => {
>>>>>>> 4abd30c5d00637a4c87842c9fc567c5f26d8d1b5
    const [rows] = await pool.query('SELECT * FROM users WHERE userID = ?', [userID]);
    if (rows.length === 0) {
      return null;
    }
    return rows[0];
  };


  const getUserDetailsByName = async (fullName) => {
    const [rows] = await pool.query(
      `SELECT u.fullName, u.addresse, c.countryName
       FROM users u
       JOIN countries c ON u.countryID = c.countryID
       WHERE u.fullName = ?`,
      [fullName]
    );
    return rows.length ? rows[0] : null;
  };
  
  const updateUser = async (userID, updatedData) => {
    const [result] = await pool.query('UPDATE users SET ? WHERE userID = ?', [updatedData, userID]);
    return result;
  };

const deleteUser = async (userID) => {
  const [result] = await pool.query('DELETE FROM users WHERE userID = ?', [userID]);
  return result;
};

const findCountryByName = async (countryName) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE countryID = ?');
    console.log(countryID);
    if (rows.length === 0) {
      return null; // Handle case where country does not exist
    }
    return rows[0];
  } catch (error) {
    console.error('Error finding country by name:', error);
    throw error; // Rethrow the error to handle it in the calling function
  }
};
<<<<<<< HEAD

=======
>>>>>>> 4abd30c5d00637a4c87842c9fc567c5f26d8d1b5


module.exports = { createUser, findUserByEmail, getAllUsers, getOneUserByID, getUserDetailsByName, updateUser, deleteUser, findCountryByName };
