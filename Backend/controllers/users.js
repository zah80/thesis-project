const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createUser, findUserByEmail, getOneUserByID, updateUser, deleteUser, getAllUsers
  ,searchForUser, findCountryByName,getUserDetailsByName} = require('../models/users');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const generateToken = (userID, type) => {
  return jwt.sign({ userID, type }, process.env.JWT_SECRET);
};

const register = async (req, res) => {
  try {
    const { fullName, email, password, address, countryID } = req.body;
    const image = req.file ? req.file.path : null; // Get the uploaded image path

    // Check if user already exists
    const userExists = await findUserByEmail(email);
    
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user object
    const newUser = {
      fullName,
      email,
      password: hashedPassword,
      addresse: address, // Ensure correct column name
      countryID,
      image,
    };

    // Save user to database
    const createdUser = await createUser(newUser);

    res.status(201).json({ success: true, message: 'User registered successfully', user: createdUser });
    

  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user.userID, "user");

    res.json({ success: true, token });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
  
  const getAll = async (req, res) => {
    try {
      const users = await getAllUsers();
      res.json({ success: true, users });
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

const getById = async (req, res) => {
    const userID = req.body.userID;
  
    try {
      const user = await getOneUserByID(userID);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.json({ success: true, user });
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  const getByOne = async (req, res) => {
    const { id } = req.params;
  
    try {
      const user = await getUserDetailsByName(id);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.json({ success: true, user });
    } catch (error) {
      console.error('Error fetching user details:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
const update = async (req, res) => {
  const userID = req.body.userID;
  const updatedData = req.body;

  try {
    const user = await getOneUserByID(userID);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await updateUser(userID, updatedData);
    res.json({ success: true, message: 'User updated successfully' });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const remove = async (req, res) => {
  const userID = req.body.userID;
  try {
    const user = await getUserByID(userID);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await deleteUser(userID);
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
const searchForUserController=async(req,res)=>{
  try {
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({ error: 'Name parameter is required' });
    }

    const users = await searchForUser(name);

    res.json(users);
  } catch (error) {
    console.error('Error in searchForUserController:', error);
    res.status(500).json({ error: 'An error occurred while searching for users' });
  }
}
module.exports = { register, login, getAll, getById, getByOne, update, remove,searchForUserController };
