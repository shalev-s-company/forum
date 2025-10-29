
const express = require('express')
const router = express.Router()
const Post = require('../models/post') 

// --- Middleware to get post by ID ---
// NEW: This is a helper function to avoid repeating code in routes that use an ID
async function getPost(req, res, next) {
  let post
  try {
    post = await Post.findById(req.params.id)
    if (post == null) {
      // 404 means 'not found'
      return res.status(404).json({ message: 'Cannot find post' })
    }
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }

  res.post = post // NEW: Attaches the found post to the response object
  next() // NEW: Moves on to the next function (the actual route)
}


// 1. Get all posts sorted by creation date (descending - newest first)
router.get('/', async (req, res) => {
  try {
    // NEW: .sort() is used to sort the results
    const posts = await Post.find().sort({ creationDate: -1 }) 
    res.json(posts)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// 2. Create a post
router.post('/', async (req, res) => {
  const post = new Post({
    // NEW: Using all the fields from your task description
    title: req.body.title,
    author: req.body.author,
    content: req.body.content
    // creationDate is set by default
  })
  try {
    const newPost = await post.save()
    res.status(201).json(newPost) // 201 means 'created'
  } catch (err) {
    res.status(400).json({ message: err.message }) // 400 means 'bad request' (e.g., missing title)
  }
})

// 6. Search post by title (e.g., /posts/search?title=MyFirst)
// NEW: This route must be defined *before* the '/:id' route
router.get('/search', async (req, res) => {
  try {
    const titleQuery = req.query.title
    if (!titleQuery) {
        return res.status(400).json({ message: 'A "title" query parameter is required.'})
    }
    // NEW: Using a Regular Expression ($regex) for a case-insensitive search ('i')
    const posts = await Post.find({ 
        title: { $regex: titleQuery, $options: 'i' } 
    }).sort({ creationDate: -1 })
    
    res.json(posts)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// 5. Get all posts by User (email)
// NEW: This route also must be defined *before* the '/:id' route
router.get('/user/:email', async (req, res) => {
    try {
      const posts = await Post.find({ 
        author: req.params.email 
      }).sort({ creationDate: -1 })
      
      res.json(posts)
    } catch (err) {
      res.status(500).json({ message: err.message })
    }
  })

// 3. Get a post by ID
// NEW: This route uses the 'getPost' middleware we defined above
router.get('/:id', getPost, (req, res) => {
  res.json(res.post)
})

// 4. Delete a post
// NEW: This route also uses the 'getPost' middleware
router.delete('/:id', getPost, async (req, res) => {
  try {
    await res.post.deleteOne()
    res.json({ message: 'Deleted Post' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})


module.exports = router