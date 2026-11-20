const express = require('express')
const router = express.Router()

const {
  getRecipes,
  getRecipeById,
  createRecipe,
} = require('../controllers/recipeController')

const protect = require('../middleware/authMiddleware')
const upload = require('../middleware/uploadMiddleware')

// Public routes
router.get('/', getRecipes)
router.get('/:id', getRecipeById)

// Login required
router.post('/', protect, upload.single('image'), createRecipe)

module.exports = router