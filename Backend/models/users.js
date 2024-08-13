const pool = require("../database/index");

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
  try {
      const [rows] = await pool.query('SELECT * FROM users WHERE userID = ?', [userID]);
      // Assuming that userID is unique, you might want to return the first row if multiple rows are found.
      return rows.length > 0 ? rows[0] : null;
  } catch (error) {
      console.error('Error fetching user data:', error);
      throw new Error('Error fetching user data');
  }
};




const getAllUsers = async () => {
  const [rows] = await pool.query('SELECT * FROM users');
  return rows;
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

const updateUser = async (userID, updatedData) => {
  const [result] = await pool.query('UPDATE users SET ? WHERE userID = ?', [updatedData, userID]);
  return result;
};

const deleteUser = async (userID) => {
  try {
    const [result] = await pool.query('DELETE FROM users WHERE userID = ?', [userID]);
    return result.affectedRows > 0; // Return true if a row was deleted
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error; // Rethrow the error to handle it in the calling function
  }
};

const findCountryByName = async (countryName) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE countryID = ?');
    if (rows.length === 0) {
      return null; // Handle case where country does not exist
    }
    return rows[0];
  } catch (error) {
    console.error('Error finding country by name:', error);
    throw error; // Rethrow the error to handle it in the calling function
  }
};
const searchForUser=async(name)=>{
  const query = `
  SELECT * FROM users
  WHERE fullName LIKE ?
  ORDER BY fullName
`;

const [rows] = await pool.execute(query, [`${name}%`]);
return rows;
}

const removeUser = async (userID) => {
  try {
    // Delete related records from the rating table
    await pool.query('DELETE FROM rating WHERE userID = ?', [userID]);
    // Delete related records from the job_requests table
    await pool.query('DELETE FROM job_requests WHERE userID = ?', [userID]);
    // Delete the user record
    const [result] = await pool.query('DELETE FROM users WHERE userID = ?', [userID]);
    return result.affectedRows > 0; // Return true if a row was deleted
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error; // Rethrow the error to handle it in the calling function
  }
};
module.exports={createUser, findUserByEmail, getAllUsers,getUserIdParams,searchForUser, getOneUserByID, getUserDetailsByName, updateUser, deleteUser, findCountryByName, removeUser,updateUserImage };