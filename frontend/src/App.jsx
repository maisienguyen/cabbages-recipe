import { Link, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import CreateRecipe from './pages/createRecipe.jsx'
import UserLogin from './pages/userLogin.jsx'
import UserRegister from './pages/userRegister.jsx'
import Recipes from './pages/recipes.jsx'
import Navbar from './components/Navbar'
import './App.css'
import RecipeDetail from './pages/recipeDetail.jsx'
import RecipeCard from './components/RecipeCard.jsx'

const categories = [
  'Breakfast',
  'Snack',
  'Lunch',
  'Dinner',
  'Dessert',
  'Drinks',
]

function App() {
const [recipes, setRecipes] = useState([])
const [loadingRecipes, setLoadingRecipes] = useState(true)
const [recipesError, setRecipesError] = useState('')

useEffect(() => {
  console.log('App useEffect is running')
  const fetchRecipes = async () => {
    try {
      console.log('Fetching recipes...')
      const response = await fetch('http://localhost:5000/api/recipes')
      console.log('Response status:', response.status)

      if (!response.ok) {
        throw new Error('Failed to fetch recipes')
      }

      const data = await response.json()
      setRecipes(data)
    } catch (error) {
      setRecipesError(error.message)
    } finally {
      setLoadingRecipes(false)
    }
  }

  fetchRecipes()
}, [])

const popularRecipes = [...recipes]
  .sort((a, b) => (b.likedBy?.length || 0) - (a.likedBy?.length || 0))
  .slice(0, 4)

const latestRecipes = [...recipes]
  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  .slice(0, 4)

  const handleSearch = (event) => {
    event.preventDefault()

    const query = event.currentTarget.elements.search.value.trim()

    if (!query) {
      alert('Please enter a recipe, ingredient, or creator.')
      return
    }

    alert(`Search for: ${query}`)
  }

    return (
      <>
      <Navbar />
    <Routes>
      <Route
        path="/"
        element={
          <div className="app">

      <main className="container">
        <section className="hero-section">
          <p className="breadcrumb">DISCOVER / HOME</p>

          <h1>What would you like to cook today?</h1>

          <p className="subtitle">
            Explore meal categories, discover community favorites,
            and save recipes for later.
          </p>

          <form className="search-form" onSubmit={handleSearch}>
            <input
              name="search"
              type="search"
              placeholder="Search recipes, ingredients, or creators..."
              aria-label="Search recipes"
            />

            <button type="submit">Search recipes</button>
          </form>
        </section>

        <section className="section">
          <div className="section-heading">
            <div>
              <h2>Browse by meal</h2>
              <p>Choose a category to find your next meal.</p>
            </div>

            <Link to="/recipes">All recipes →</Link>
          </div>

          <div className="category-grid">
            {categories.map((category) => {
              const count = recipes.filter(
                (recipe) => recipe.category === category
              ).length

              return (
               <Link
                 to={`/recipes?category=${encodeURIComponent(category)}`}
                 className="category-card"
                 key={category}
               >
               <div>
                <h3>{category}</h3>
                <p>{count} {count === 1 ? 'recipe' : 'recipes'}</p>
                </div>

                <span>→</span>
                 </Link>
              )
            })}
          </div>
        </section>

        <section className="section">
          
          <div className="section-heading">
            <div>
              <h2>Most liked recipes</h2>
              <p>
                Community favorites · Ranked by total likes, highest first.
              </p>
            </div>

            <Link to="/recipes?sort=popular">
              View most liked →
            </Link>
          </div>
          {loadingRecipes && <p>Loading recipes...</p>}

          {recipesError && <p>{recipesError}</p>}

          {!loadingRecipes && !recipesError && (
            <div className="recipe-grid">
              {popularRecipes.map((recipe, index) => (
                <RecipeCard
                  key={"popular-" + recipe._id}
                  recipe={recipe}
                  rank={index + 1}
                />
              ))}
            </div>
          )}
        </section>

        <section className="section latest-section">
          <div className="section-heading">
            <div>
              <h2>Latest recipes</h2>
              <p>Fresh from the community · Newest published first.</p>
            </div>

            <Link to="/recipes?sort=latest">View latest →</Link>
          </div>

          {loadingRecipes && <p>Loading recipes...</p>}
          {recipesError && <p>{recipesError}</p>}

          {!loadingRecipes && !recipesError && (
            <div className="recipe-grid">
              {latestRecipes.map((recipe) => (
                <RecipeCard
                  key={"latest-" + recipe._id}
                  recipe={recipe}
                  latest
                />
              ))}
            </div>
          )}
        </section>
      </main>

           <footer className="footer">
        <p>Cabbages Recipe · Recipes from home cooks, for home cooks.</p>

        <nav>
          <a href="#about">About</a>
          <a href="#guidelines">Community guidelines</a>
          <a href="#help">Help</a>
        </nav>
      </footer>
          </div>
        }
      />

      <Route path="/create-recipe" element={<CreateRecipe />}/>
      <Route path="/login" element={<UserLogin />} />
      <Route path="/register" element={<UserRegister />} />
      <Route path="/recipes" element={<Recipes />} />
      <Route path="/recipes/:id" element={<RecipeDetail />} />
    </Routes>
    </>
  )
}


export default App