const express = require('express')
const router = express.Router()

const {
  getComments,
  createComment,
} = require('../controllers/commentController')

const protect  = require('../middleware/authMiddleware')

// Get comments for a recipe
router.get('/:recipeId', getComments)

// Create a comment (login required)
router.post('/:recipeId', protect, createComment)

module.exports = router
