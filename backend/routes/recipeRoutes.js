const express = require('express')
const router = express.Router()

const {
  getRecipes,
  getRecipeById,
  createRecipe,
} = require('../controllers/recipeController')

const protect = require('../middleware/authMiddleware')

// Public routes
router.get('/', getRecipes)
router.get('/:id', getRecipeById)

// Login required
router.post('/', protect, createRecipe)

module.exports = router