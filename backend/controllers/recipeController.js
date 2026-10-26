// GET /api/recipes/:id
// Get one recipe by ID
const Recipe = require('../models/recipe')

// GET /api/recipes
// Get all published recipes
const getRecipes = async (req, res) => {
  try {
    const filter = { isDraft: false }

    if (req.query.category) {
      filter.category = req.query.category
    }

    if (req.query.search) {
      filter.title = {
        $regex: req.query.search,
        $options: 'i',
      }
    }

    const recipes = await Recipe.find(filter)
      .populate('author', 'username')
      .sort({ createdAt: -1 })

    res.status(200).json(recipes)
  } catch (error) {
    res.status(500).json({
      message: 'Failed to retrieve recipes',
      error: error.message,
    })
  }
}

// GET /api/recipes/:id
// Get one recipe by ID
const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
      .populate('author', 'username')

    if (!recipe || recipe.isDraft) {
      return res.status(404).json({
        message: 'Recipe not found',
      })
    }

    res.status(200).json(recipe)
  } catch (error) {
    res.status(400).json({
      message: 'Invalid recipe ID',
    })
  }
}

const createRecipe = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      ingredients,
      instructions,
      cookingTime,
      servings,
      image,
      isDraft,
    } = req.body

    const recipe = await Recipe.create({
      title,
      description,
      category,
      ingredients,
      instructions,
      cookingTime,
      servings,
      image,
      isDraft: isDraft === true,
      author: req.user._id,
    })

    res.status(201).json(recipe)
  } catch (error) {
    res.status(400).json({
      message: 'Failed to create recipe',
      error: error.message,
    })
  }
}

module.exports = {
  getRecipes,
  getRecipeById,
  createRecipe,
}
