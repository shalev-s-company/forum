//require('dotenv').config()

const express = require('express')
const app = express()
const mongoose = require('mongoose')

// NEW: Updated the connection string to use a 'forum' database
mongoose.connect(process.env.DATABASE_URL, { dbName: 'forum' }) 
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database')) // Removed 'error' param, was unused

app.use(express.json())

// NEW: Changed from 'subscribers' to 'posts' to match your task
const postsRouter = require('./routes/posts') 
app.use('/posts', postsRouter) // NEW: All post routes will be prefixed with /posts


app.listen(3000, () => console.log('Server Started'))