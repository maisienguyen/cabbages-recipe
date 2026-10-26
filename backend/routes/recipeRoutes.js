const express = require('express')
const router = express.Router()

const {
  getRecipes,
  getRecipeById,
  createRecipe,

} = require('../controllers/recipeController')

// GET /api/recipes
router.get('/', getRecipes)
const protect = require('../middleware/authMiddleware')

// GET /api/recipes/:id
// Public routes
router.get('/', getRecipes)
router.get('/:id', getRecipeById)

// Login required
router.post('/', protect, createRecipe)


module.exports = router