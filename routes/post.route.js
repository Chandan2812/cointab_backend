const express = require('express');
const postRouter = express.Router();
const axios = require('axios');
const { PostModel } = require('../models/post.model');
const xlsx = require('xlsx');
const fs = require('fs');


// Route to fetch posts for a specific user from the external API
postRouter.get('/:userId', async (req, res) => {
  const userId = req.params.userId;
  try {
    const response = await axios.get(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
    const posts = response.data;
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});



// Route to bulk add user information and posts
postRouter.post('/bulk-add', async (req, res) => {
  const postData = req.body;
  try {
    const newPosts = await PostModel.create(postData);
    res.status(201).json(newPosts);
  } catch (error) {
    console.error('Error bulk adding posts:', error);
    res.status(500).json({ error: 'Failed to bulk add posts' });
  }
});




// Route to download posts in Excel format
postRouter.get('/download-excel/:userId', async (req, res) => {
  const userId = req.params.userId;
  try {
      // Fetch posts for the specified user
      const posts = await PostModel.find({ id: userId });
      
      // Prepare data for Excel file
      const data = posts.map(post => {
          return {
              'Title': post.title,
              'Body': post.body
          };
      });

      // Create a new workbook and add a worksheet
      const wb = xlsx.utils.book_new();
      const ws = xlsx.utils.json_to_sheet(data);

      // Add the worksheet to the workbook
      xlsx.utils.book_append_sheet(wb, ws, 'Posts');

      // Write the workbook to a file
      const excelFileName = `user_${userId}_posts.xlsx`;
      const excelFilePath = `${__dirname}/../../excel_files/user_${userId}_posts.xlsx`;

      xlsx.writeFile(wb, excelFilePath);

      // Stream the file as a response
      const fileStream = fs.createReadStream(excelFilePath);
      fileStream.pipe(res);

      // Once the file is sent, delete it from the server
      fileStream.on('end', () => {
          fs.unlinkSync(excelFilePath);
      });
  } catch (error) {
      console.error('Error downloading posts in Excel:', error);
      res.status(500).json({ error: 'Failed to download posts in Excel' });
  }
});


module.exports = {postRouter};
