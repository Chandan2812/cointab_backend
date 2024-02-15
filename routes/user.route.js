const express = require('express');
const userRouter = express.Router();
const axios = require('axios');
const { UserModel } = require('../models/user.model');

// Route to fetch all users from the external API
userRouter.get('/all', async (req, res) => {
  try {
    const response = await axios.get('https://jsonplaceholder.typicode.com/users');
    const users = response.data;
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to add a user to the database
userRouter.post('/add', async (req, res) => {
  const { id, name, email, phone, website, city, company } = req.body;
  try {
    // // Check if user already exists in the database
    // const existingUser = await UserModel.findOne({ id });
    // if (existingUser) {
    //   res.json({ success: false, message: 'User already exists in the database' });
    //   return;
    // }
    
    // If user doesn't exist, add them to the database
    const newUser = await UserModel.create({
      id,
      name,
      email,
      phone,
      website,
      city,
      company
    });
    res.json({ success: true, message: 'User added successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});


// Route to fetch user details by user ID
userRouter.get('/:userId', async (req, res) => {
  const userId = req.params.userId;
  try {
    // Assume UserModel is a Mongoose model for users
    const user = await UserModel.findOne({ id: userId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    // Return the user details
    res.json(user);
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ error: 'Failed to fetch user details' });
  }
});


module.exports = { userRouter };
