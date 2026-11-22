const Recipe = require('../models/recipe')
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

    const imagePath = req.file
      ? `/uploads/${req.file.filename}`
      : image || ''

    const recipe = await Recipe.create({
      title,
      description,
      category,
      ingredients,
      instructions,
      cookingTime,
      servings,
      image: imagePath,
      isDraft: isDraft === 'true' || isDraft === true,
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

// Like / Unlike a recipe
const toggleLike = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)

    if (!recipe) {
      return res.status(404).json({
        message: 'Recipe not found',
      })
    }

    const userId = req.user._id

    const alreadyLiked = recipe.likedBy.some(
      id => id.toString() === userId.toString()
    )

    const updatedRecipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      alreadyLiked
        ? { $pull: { likedBy: userId } }
        : { $addToSet: { likedBy: userId } },
      { new: true }
    )

    res.status(200).json({
      liked: !alreadyLiked,
      likeCount: updatedRecipe.likedBy.length,
    })
  } catch (error) {
    console.error('Toggle like error:', error)
    res.status(500).json({
      message: error.message,
    })
  }
}

// Save / Unsave a recipe
const toggleSave = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' })
    }

    const userId = req.user._id
    const alreadySaved = recipe.savedBy.some(
      id => id.toString() === userId.toString()
    )

    if (alreadySaved) {
      recipe.savedBy.pull(userId)
    } else {
      recipe.savedBy.push(userId)
    }

    await recipe.save()

    res.status(200).json({
      saved: !alreadySaved,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  getRecipes,
  getRecipeById,
  createRecipe,
  toggleLike,
  toggleSave,
}
