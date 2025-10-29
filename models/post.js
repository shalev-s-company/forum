// NEW: This entire file is new and replaces subscriber.js
const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    // NEW: Storing author as an email string
    type: String, 
    required: true,
    lowercase: true,
    trim: true
  },
  creationDate: {
    type: Date,
    required: true,
    default: Date.now // NEW: Automatically sets the date when a post is created
  },
  content: {
    type: String,
    required: true
  }
})

// NEW: We export a 'Post' model, not a 'Subscriber'
module.exports = mongoose.model('Post', postSchema)