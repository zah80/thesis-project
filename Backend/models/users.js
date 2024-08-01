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
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE userID = ?', [userID]);
    console.log('SQL Query:', 'SELECT * FROM users WHERE userID = ?', [userID]);
    console.log('Query Result:', rows);
    if (rows.length === 0) {
      return null;
    }
    return rows[0];
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};


const getUserIdParams = async (userID) => {
    const sql = await pool.query('SELECT * FROM users WHERE userID = ?', [userID]);
    return sql;
};



const getAllUsers = async () => {
    const [rows] = await pool.query('SELECT * FROM users');
    return rows;
  };




  const updateUserData = async (userID, fullName, email, password, addresse) => {
    try {
        // Construct the update query
        const query = `
            UPDATE users 
            SET 
                fullName = ?, 
                email = ?, 
                password = ?, 
                addresse = ? 
            WHERE userID = ?
        `;

        // Execute the query
        const [result] = await pool.query(query, [fullName, email, password, addresse, userID]);

        return result;
    } catch (error) {
        console.error('Error updating user data:', error);
        throw error;
    }
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
  
  const updateUserImage = async (userID, image) => {
    const query = `
        UPDATE users 
        SET image = ?
        WHERE userID = ?
    `;

    const values = [image, userID];

    const [result] = await pool.query(query, values);
    return result;
};


const deleteUser = async (userID) => {
  const [result] = await pool.query('DELETE FROM users WHERE userID = ?', [userID]);
  return result;
};

const findCountryByName = async (countryName) => {
  try{
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



const updateProfilePic = async (userID, image) => {
  const [result] = await pool.query('UPDATE users SET image = ? WHERE userID = ?', [image, userID]);
  return result;
};


module.exports = { createUser, findUserByEmail, getAllUsers, getOneUserByID, getUserDetailsByName, updateUserImage, deleteUser, findCountryByName, updateProfilePic, getUserIdParams, updateUserData };

