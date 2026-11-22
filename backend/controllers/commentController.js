const Comment = require('../models/comment')

// Get comments for a recipe
const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({
      recipe: req.params.recipeId,
    })
      .populate('author', 'username')
      .sort({ createdAt: -1 })

    res.status(200).json(comments)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Create a comment
const createComment = async (req, res) => {
  try {
    const { content } = req.body

    if (!content || !content.trim()) {
      return res.status(400).json({
        message: 'Comment cannot be empty',
      })
    }

    const comment = await Comment.create({
      recipe: req.params.recipeId,
      author: req.user._id,
      content: content.trim(),
    })

    const populatedComment = await comment.populate(
      'author',
      'username'
    )

    res.status(201).json(populatedComment)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  getComments,
  createComment,
}
