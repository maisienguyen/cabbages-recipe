const Comment = require('../models/comment')
const Notification = require('../models/notification')
const Recipe = require('../models/recipe')

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

// Get comment count
const getCommentCount = async (req, res) => {
  try {
    const commentCount = await Comment.countDocuments({
      recipe: req.params.recipeId,
    })

    res.status(200).json({ commentCount })
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

    const recipe = await Recipe.findById(req.params.recipeId)

    if (!recipe) {
      return res.status(404).json({
        message: 'Recipe not found',
      })
    }

    const comment = await Comment.create({
      recipe: req.params.recipeId,
      author: req.user._id,
      content: content.trim(),
    })
 

    // Notify recipe owner when someone else comments
    if (recipe.author.toString() !== req.user._id.toString()) {
      await Notification.create({
        recipient: recipe.author,
        sender: req.user._id,
        recipe: recipe._id,
        type: 'comment',
        message: `${req.user.username} commented on your recipe "${recipe.title}"`,
      })
    }

    const populatedComment = await comment.populate(
      'author',
      'username'
    )

    res.status(201).json(populatedComment)
  } catch (error) {
    console.error('Create comment error:', error)
    res.status(500).json({ message: error.message })
  }
}

 // Update a comment
const updateComment = async (req, res) => {
  try {
    const { content } = req.body

    if (!content || !content.trim()) {
      return res.status(400).json({
        message: 'Comment cannot be empty',
      })
    }

    const comment = await Comment.findById(req.params.commentId)

    if (!comment) {
      return res.status(404).json({
        message: 'Comment not found',
      })
    }

    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: 'You can only edit your own comments',
      })
    }

    comment.content = content.trim()
    await comment.save()

    const updatedComment = await comment.populate(
      'author',
      'username'
    )

    res.status(200).json(updatedComment)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Delete a comment
const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId)

    if (!comment) {
      return res.status(404).json({
        message: 'Comment not found',
      })
    }

    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: 'You can only delete your own comments',
      })
    }

    await comment.deleteOne()

    res.status(200).json({
      message: 'Comment deleted successfully',
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
module.exports = {
  getComments,
  getCommentCount,
  createComment,
  updateComment,
  deleteComment,
}
