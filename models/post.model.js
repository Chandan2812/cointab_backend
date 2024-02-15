const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  userId: mongoose.Types.ObjectId,
  user: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  posts: {
    type: [{ title: String, body: String }],
    required: true
  }
});

const PostModel = mongoose.model('Post', postSchema);

module.exports = { PostModel };
