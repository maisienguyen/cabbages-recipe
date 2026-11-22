const express = require('express')
const router = express.Router()

const {
  getRecipes,
  getRecipeById,
  createRecipe,
  toggleLike,
  toggleSave
} = require('../controllers/recipeController')

const protect = require('../middleware/authMiddleware')
const upload = require('../middleware/uploadMiddleware')

// Public routes
router.get('/', getRecipes)
router.get('/:id', getRecipeById)

// Login required
router.post('/', protect, upload.single('image'), createRecipe)

router.patch('/:id/like', protect, toggleLike)
router.patch('/:id/save', protect, toggleSave)

module.exports = router