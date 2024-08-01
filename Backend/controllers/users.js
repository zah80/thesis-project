const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createUser, findUserByEmail, getOneUserByID, updateUserImage, deleteUser, getAllUsers, findCountryByName,getUserDetailsByName, updateProfilePic, getUserIdParams, updateUserData} = require('../models/users');
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
    const userID = req.params.id; // Extract userID from the token via auth middleware
    const image = req.file; // Assuming image is uploaded using Multer and accessible via req.file

    try {
        if (!userID) {
            console.error('User ID is missing in the request');
            return res.status(400).json({ message: 'User ID is required' });
        }

        console.log('Updating user with ID:', userID);
        
        const user = await getUserIdParams(userID);
        console.log('Found user:', user);

        if (!user) {
            console.error(`User with ID ${userID} not found`);
            return res.status(404).json({ message: 'User not found' });
        }

        if (!image) {
            console.error('No image provided in the request');
            return res.status(400).json({ message: 'Image is required' });
        }

        const filename = path.basename(image.path); // Extract the filename
        const result = await updateUserImage(userID, filename); // Only update the image
        console.log('Update result:', result);

        res.json({ success: true, message: 'Profile picture updated successfully' });
    } catch (error) {
        console.error('Error updating profile picture:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
  

const remove = async (req, res) => {
  const userID = req.params.id;
  try {
    const user = await getOneUserByID(userID);
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


const updateUserController = async (req, res) => {
  const userID = req.params.id;
  const { fullName, email, password, addresse, countryID } = req.body;

  try {
    if (!userID) {
      console.error('User ID is missing in the request');
      return res.status(400).json({ message: 'User ID is required' });
    }

    console.log('Updating user with ID:', userID);

    // Check if user exists
    const userExists = await findUserById(userID);
    
    if (!userExists) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Hash the password if it's being updated
    let hashedPassword;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // Update user object
    const updatedUser = {
      fullName: fullName || userExists.fullName,
      email: email || userExists.email,
      password: hashedPassword || userExists.password,
      addresse: addresse || userExists.addresse,
    };

    // Update user in database
    const result = await updateUserData(userID, updatedUser);
    console.log('Update result:', result);

    res.json({ success: true, message: 'User updated successfully' });
  } catch (error) {
    console.error('Error updating user data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};




module.exports = { register, login, getAll, getById, getByOne, update, remove, updateUserController  };
