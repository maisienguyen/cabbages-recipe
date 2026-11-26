const express = require('express')
const router = express.Router()

const {
  getComments,
  getCommentCount,
  createComment,
  updateComment,
  deleteComment,
} = require('../controllers/commentController')

const protect  = require('../middleware/authMiddleware')

// Get comments for a recipe
router.get('/:recipeId', getComments)

// Get comment count for a recipe
router.get('/:recipeId/count', getCommentCount)

// Create a comment (login required)
router.post('/:recipeId', protect, createComment)

// Update a comment (login required)
router.put('/:commentId', protect, updateComment)

// Delete a comment (login required)
router.delete('/:commentId', protect, deleteComment)

module.exports = router
