import { useState } from 'react'
import { Link } from 'react-router-dom'
import './createRecipe.css'
import { useAuth } from '../context/authContext'

function CreateRecipe() {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Breakfast',
    prepTime: '',
    cookingTime: '',
    servings: '2',
    ingredients: '',
    instructions: '',
    image: '',
  })
const [imageFile, setImageFile] = useState(null)
const [imagePreview, setImagePreview] = useState('')

const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    if (name === 'image') {
      setImageFile(null)
      setImagePreview('')
    }
  }

  const handleImageUpload = (e) => {
  const file = e.target.files[0]

  if (!file) return

  if (!file.type.startsWith('image/')) {
    alert('Please select a valid image file.')
    e.target.value = ''
    return
  }

  if (file.size > 5 * 1024 * 1024) {
    alert('Image size should not exceed 5MB.')
    e.target.value = ''
    return
  }

  setImageFile(file)
  setImagePreview(URL.createObjectURL(file))

  setFormData((prev) => ({
    ...prev,
    image: '',
  }))
}

const handleRemoveImage = () => {
  setImageFile(null)
  setImagePreview('')

  setFormData((prev) => ({
    ...prev,
    image: '',
  }))

  const fileInput = document.getElementById('imageFile')

  if (fileInput) {
    fileInput.value = ''
  }
}

  const handleSubmit = async(e) => {
    if (!user) {
  alert('Please log in before publishing a recipe.')
  return
}
    e.preventDefault()
   
    try {
      const data = new FormData()

      data.append('title', formData.title)
      data.append('description', formData.description)
      data.append('category', formData.category)
      data.append('prepTime', formData.prepTime)
      data.append('cookingTime', formData.cookingTime)
      data.append('servings', formData.servings)

      formData.ingredients
        .split('\n')
        .filter((item) => item.trim() !== '')
        .forEach((item) => data.append('ingredients', item.trim()))

      formData.instructions
        .split('\n')
        .filter((item) => item.trim() !== '')
        .forEach((item) => data.append('instructions', item.trim()))

      if (imageFile) {
        data.append('image', imageFile)
      } else if (formData.image) {
        data.append('image', formData.image)
      }

      const response = await fetch('http://localhost:5000/api/recipes', {
        method: 'POST',
        credentials: 'include',
        body: data,
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Failed to create recipe')
      }

      alert('Recipe created successfully!')
      console.log('Recipe created:', result)

    } catch (error) {
      console.error('Error creating recipe:', error)
      alert('Error creating recipe: ' + error.message)
    }
  }

  return (
    <main className="create-recipe-page">
      <div className="create-recipe-container">
        <div className="create-recipe-breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <span>Create recipe</span>
        </div>

        <div className="create-recipe-heading">
          <p className="create-recipe-label">SHARE YOUR CREATION</p>
          <h1>Create a recipe</h1>
          <p>
            Share your favorite homemade dishes with the Cabbages Recipe
            community.
          </p>
        </div>

        <form className="create-recipe-form" onSubmit={handleSubmit}>
          <section className="form-section">
            <h2>Recipe information</h2>
            <p className="form-section-description">
              Start with the basic information about your dish.
            </p>

            <label htmlFor="title">Recipe title *</label>
            <input
              id="title"
              name="title"
              type="text"
              placeholder="e.g. Avocado toast with poached egg"
              value={formData.title}
              onChange={handleChange}
              required
            />

            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              placeholder="Tell us what makes this recipe special..."
              value={formData.description}
              onChange={handleChange}
              rows={3}
              required
            />

            <label htmlFor="category">Category *</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="Breakfast">Breakfast</option>
              <option value="Snack">Snack</option>
              <option value="Lunch">Lunch</option>
              <option value="Dinner">Dinner</option>
              <option value="Dessert">Dessert</option>
              <option value="Drinks">Drinks</option>
            </select>
          </section>

          <section className="form-section">
            <h2>Cooking details</h2>

            <div className="form-row">
              <div>
                <label htmlFor="prepTime">Prep time (minutes) *</label>
                <input
                  id="prepTime"
                  name="prepTime"
                  type="number"
                  min="0"
                  placeholder="5"
                  value={formData.prepTime}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label htmlFor="cookingTime">Cook time (minutes) *</label>
                <input
                  id="cookingTime"
                  name="cookingTime"
                  type="number"
                  min="0"
                  placeholder="10"
                  value={formData.cookingTime}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label htmlFor="servings">Servings *</label>
                <input
                  id="servings"
                  name="servings"
                  type="number"
                  min="1"
                  placeholder="2"
                  value={formData.servings}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </section>

          <section className="form-section">
            <h2>Ingredients</h2>
            <p className="form-section-description">
              Add one ingredient per line, including its quantity.
            </p>

            <label htmlFor="ingredients">Ingredient list *</label>
            <textarea
              id="ingredients"
              name="ingredients"
              placeholder={'2 slices sourdough bread\n1 ripe avocado\n2 large eggs'}
              value={formData.ingredients}
              onChange={handleChange}
              rows={6}
              required
            />
          </section>

          <section className="form-section">
            <h2>Instructions</h2>
            <p className="form-section-description">
              Write each cooking step on a separate line.
            </p>

            <label htmlFor="instructions">Cooking steps *</label>
            <textarea
              id="instructions"
              name="instructions"
              placeholder={
                'Prepare the avocado\nPoach the eggs\nToast the bread\nAssemble and serve'
              }
              value={formData.instructions}
              onChange={handleChange}
              rows={7}
              required
            />
          </section>

          <section className="form-section">
            <h2>Recipe image</h2>
            <p className="form-section-description">
              Upload an image or provide an image URL for your finished dish.
            </p>

            <label htmlFor="imageFile">Upload image</label>
            <input
              id="imageFile"
              name="imageFile"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
            />  
            <label htmlFor = "image">Or provide an image URL</label>
            <input
              id="image"  
              name="image"
              type="url"
              placeholder="https://example.com/recipe-image.jpg"
              value={formData.image}
              onChange={handleChange}
            />  
            {(imagePreview || formData.image) && (
              <div className="image-preview">
                <img
                  src={imagePreview || formData.image}
                  alt="Recipe preview"
                  />
                <button 
                  type="button" 
                  onClick={handleRemoveImage}
                  className="remove-image-button"
                  >
                    Remove Image
                  </button>
              </div>
            )}

          </section>

          <div className="create-recipe-actions">
            <Link to="/" className="cancel-recipe-button">
              Cancel
            </Link>

            <button type="submit" className="publish-recipe-button">
              Publish recipe
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}

export default CreateRecipe