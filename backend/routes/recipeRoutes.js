const express = require('express')
const router = express.Router()

const {
  getRecipes,
  getMyRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
<<<<<<< HEAD
  deleteRecipe,
=======
>>>>>>> user-profile-feature
  toggleLike,
  toggleSave
} = require('../controllers/recipeController')

const protect = require('../middleware/authMiddleware')
const upload = require('../middleware/uploadMiddleware')

// Public routes
router.get('/', getRecipes)
router.get('/my-recipes', protect, getMyRecipes)
router.get('/:id', getRecipeById)

// Login required
router.post('/', protect, upload.single('image'), createRecipe)
<<<<<<< HEAD
router.post('/', protect, upload.single('image'), createRecipe)
router.put('/:id', protect, upload.single('image'), updateRecipe)
router.delete('/:id', protect, deleteRecipe)

=======
router.put('/:id', protect, upload.single('image'), updateRecipe)
>>>>>>> user-profile-feature
router.patch('/:id/like', protect, toggleLike)
router.patch('/:id/save', protect, toggleSave)

module.exports = router