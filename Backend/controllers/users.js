const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createUser, findUserByEmail } = require('../models/users');
const fs = require('fs');
const path = require('path');
const { user } = require('../database/config');
require('dotenv').config();

const generateToken = (userID, type) => {
  return jwt.sign({ userID, type }, process.env.JWT_SECRET, { expiresIn: '1h' });
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

module.exports = { register, login };
