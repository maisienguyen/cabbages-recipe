import { useState } from 'react'
import { Link } from 'react-router-dom'
import './createRecipe.css'

function createRecipe() {
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    alert('Recipe form is ready!')
    console.log(formData)
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
              Add an image URL for your finished dish.
            </p>

            <label htmlFor="image">Image URL</label>
            <input
              id="image"
              name="image"
              type="url"
              placeholder="https://example.com/recipe-image.jpg"
              value={formData.image}
              onChange={handleChange}
            />
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

export default createRecipe