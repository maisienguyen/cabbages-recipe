
const express = require('express')
const router = express.Router()

const {
  getRecipes,
  getRecipeById,
} = require('../controllers/recipeController')

// GET /api/recipes
router.get('/', getRecipes)

// GET /api/recipes/:id
router.get('/:id', getRecipeById)

module.exports = router
