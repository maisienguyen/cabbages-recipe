const express = require('express')
const router = express.Router()

const {
  getComments,
  getCommentCount,
  createComment,
} = require('../controllers/commentController')

const protect  = require('../middleware/authMiddleware')

// Get comments for a recipe
router.get('/:recipeId', getComments)

// Get comment count for a recipe
router.get('/:recipeId/count', getCommentCount)

// Create a comment (login required)
router.post('/:recipeId', protect, createComment)

module.exports = router
