const Recipe = require('../models/recipe')
const Notification = require('../models/notification')
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

// Get recipes created by the logged-in user
const getMyRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({
      author: req.user._id,
    })
      .populate('author', 'username')
      .sort({ createdAt: -1 })

    res.status(200).json(recipes)
  } catch (error) {
    res.status(500).json({
      message: 'Failed to retrieve your recipes',
      error: error.message,
    })
  }
}
// Get recipes saved by the logged-in user
const getSavedRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({
      savedBy: req.user._id,
      isDraft: false,
    })
      .populate('author', 'username')
      .sort({ createdAt: -1 })

    res.status(200).json(recipes)
  } catch (error) {
    res.status(500).json({
      message: 'Failed to retrieve saved recipes',
      error: error.message,
    })
  }
}

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
// Update an existing recipe
const updateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)

    if (!recipe) {
      return res.status(404).json({
        message: 'Recipe not found',
      })
    }

    if (recipe.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: 'Not authorized to update this recipe',
      })
    }

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

    recipe.title = title
    recipe.description = description
    recipe.category = category
    recipe.ingredients = ingredients
    recipe.instructions = instructions
    recipe.cookingTime = cookingTime
    recipe.servings = servings

    if (req.file) {
      recipe.image = `/uploads/${req.file.filename}`
    } else if (image !== undefined) {
      recipe.image = image
    }

    if (isDraft !== undefined) {
      recipe.isDraft = isDraft === 'true' || isDraft === true
    }

    await recipe.save()

    res.status(200).json(recipe)
  } catch (error) {
    res.status(400).json({
      message: 'Failed to update recipe',
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

    // Create notification when someone likes another user's recipe
    if (!alreadyLiked && recipe.author.toString() !== userId.toString()) {
      await Notification.create({
        recipient: recipe.author,
        sender: userId,
        recipe: recipe._id,
        type: 'like',
        message: `${req.user.username} liked your recipe "${recipe.title}"`,
      })
    }

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
// Delete an existing recipe
const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)

    if (!recipe) {
      return res.status(404).json({
        message: 'Recipe not found',
      })
    }

    if (recipe.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: 'Not authorized to delete this recipe',
      })
    }

    await recipe.deleteOne()

    res.status(200).json({
      message: 'Recipe deleted successfully',
    })
  } catch (error) {
    res.status(500).json({
      message: 'Failed to delete recipe',
      error: error.message,
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
  getMyRecipes,
  getSavedRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  toggleLike,
  toggleSave,
}
