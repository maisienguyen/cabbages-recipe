import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Heart, Bookmark, MessageCircle } from 'lucide-react'
import { useAuth } from '../context/authContext'
import './Recipes.css'

function RecipeListCard({ recipe }) {
  const { user } = useAuth()

  const [isLiked, setIsLiked] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [likeCount, setLikeCount] = useState(
    recipe.likedBy?.length || 0
  )

  useEffect(() => {
    setIsLiked(
      user
        ? recipe.likedBy?.some(id => String(id) === String(user.id))
        : false
    )

    setIsSaved(
      user
        ? recipe.savedBy?.some(id => String(id) === String(user.id))
        : false
    )

    setLikeCount(recipe.likedBy?.length || 0)
  }, [recipe, user])

  const handleLike = async () => {
    if (!user) {
      alert('Please log in to like a recipe.')
      return
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/recipes/${recipe._id}/like`,
        {
          method: 'PATCH',
          credentials: 'include',
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update like')
      }

      setIsLiked(data.liked)
      setLikeCount(data.likeCount)
    } catch (error) {
      console.error('Like error:', error)
      alert(error.message)
    }
  }

  const handleSave = async () => {
    if (!user) {
      alert('Please log in to save a recipe.')
      return
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/recipes/${recipe._id}/save`,
        {
          method: 'PATCH',
          credentials: 'include',
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update saved recipe')
      }

      setIsSaved(data.saved)
    } catch (error) {
      console.error('Save error:', error)
      alert(error.message)
    }
  }

  return (
    <article className="recipe-card">
      <div className="recipe-image">
        <img
          src={
            !recipe.image
              ? '/placeholder-recipe.jpg'
              : recipe.image.startsWith('http')
                ? recipe.image
                : `http://localhost:5000${recipe.image}`
          }
          alt={recipe.title}
          loading="lazy"
        />
      </div>

      <div className="recipe-card-content">
        <div className="recipe-meta">
          <span>{recipe.category}</span>
          <span>{recipe.cookingTime} min</span>
        </div>

        <h3>{recipe.title}</h3>

        <p>By {recipe.author?.username || 'Unknown'}</p>

        <div className="recipe-card-footer">
          <div className="recipe-engagement">
            <button
              type="button"
              className={`interaction-button like-button ${isLiked ? 'active' : ''}`}
              onClick={handleLike}
              aria-pressed={isLiked}
            >
              <Heart
                size={18}
                fill={isLiked ? 'currentColor' : 'none'}
              />
              <span>{likeCount}</span>
            </button>

            <span className="comment-count">
              <MessageCircle size={17} />
              <span>{recipe.comments || 0}</span>
            </span>
          </div>

          <button
            type="button"
            className={`interaction-button save-button ${isSaved ? 'active' : ''}`}
            onClick={handleSave}
            aria-label={isSaved ? 'Unsave recipe' : 'Save recipe'}
          >
            <Bookmark
              size={19}
              fill={isSaved ? 'currentColor' : 'none'}
            />
          </button>
        </div>

        <Link
          to={`/recipes/${recipe._id}`}
          className="view-button"
        >
          View recipe <span>→</span>
        </Link>
      </div>
    </article>
  )
}


function Recipes() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortBy, setSortBy] = useState('latest');
    const [selectedTime, setSelectedTime] = useState('all');
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
  const fetchRecipes = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/recipes')

      if (!response.ok) {
        throw new Error('Failed to fetch recipes')
      }

      const data = await response.json()
      setRecipes(data)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  fetchRecipes()
}, [])

    const filteredRecipes = recipes
    .filter((recipe) => {
      const authorName = recipe.author?.username || 'Unknown'

      const matchesSearch =
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.author.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory =
        selectedCategory === 'all' ||
        recipe.category.toLowerCase() === selectedCategory
      
      const matchesTime =
        selectedTime === 'all' ||
        selectedTime === "15-30" && recipe.time >= 15 && recipe.time <= 30 ||
        selectedTime === "30-60" && recipe.time > 30 && recipe.time <= 60 ||
        selectedTime === "60+" && recipe.time > 60

      return matchesSearch && matchesCategory && matchesTime
  
    })
    .sort((a, b) => {
      if (sortBy === 'popular') {
        return (b.likedBy?.length || 0) - (a.likedBy?.length || 0)
      }
        return new Date(b.createdAt) - new Date(a.createdAt)
   
    })

    return (
    <main className="recipes-page">
     <section className="recipes-header">
        <div className="recipes-header-content">
            <div>
        <p className="breadcrumb">DISCOVER / RECIPES</p>

        <h1>Explore recipes</h1>

        <p>
          Discover delicious recipes shared by our community.
          Find inspiration for your next meal.
        </p>
        </div>
        <Link to ="/create-recipe" className="publish-button">
          +  Publish your recipe
        </Link>
        </div>
    
      </section>
    
<section className="recipes-content">
    <div className="recipes-heading">
        <div>
            <h2>All recipes</h2>
            <p>Explore recipes from home cooks, for home cooks.</p>
        </div>
        </div>


<div className="recipes-layout">
  <aside className="recipes-sidebar">
    <div className="filter-heading">
      <h3>Filters</h3>
      <button
        type="button"
        onClick={() => {
          setSearchQuery('')
          setSelectedCategory('all')
          setSelectedTime('all')
          setSortBy('latest')
        }}
      >
        Reset all
      </button>
    </div>

    <div className="filter-group">
      <h4>Meal category</h4>

      {[
        ['all', 'All categories'],
        ['breakfast', 'Breakfast'],
        ['snack', 'Snack'],
        ['lunch', 'Lunch'],
        ['dinner', 'Dinner'],
        ['dessert', 'Dessert'],
        ['drinks', 'Drinks'],
      ].map(([value, label]) => (
        <label key={value} className="filter-option">
          <input
            type="radio"
            name="category"
            value={value}
            checked={selectedCategory === value}
            onChange={() => setSelectedCategory(value)}
          />
          {label}
        </label>
      ))}
    </div>

    <div className="filter-group">
      <h4>Cooking time</h4>

      {[
        ['all', 'Any time'],
        ['15-30', '15–30 minutes'],
        ['31-60', '31–60 minutes'],
        ['over-60', 'Over 60 minutes'],
      ].map(([value, label]) => (
        <label key={value} className="filter-option">
          <input
            type="radio"
            name="cookingTime"
            value={value}
            checked={selectedTime === value}
            onChange={() => setSelectedTime(value)}
          />
          {label}
        </label>
      ))}
    </div>

    <button
      type="button"
      className="apply-filters-button"
    >
      Apply filters
    </button>
  </aside>

  <div className="recipes-main">
    <div className="recipes-toolbar">
      <div className="recipes-search">
        <input
          type="search"
          placeholder="Search recipes, ingredients..."
          aria-label="Search recipes"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        aria-label="Sort recipes"
      >
        <option value="latest">Newest first</option>
        <option value="popular">Most liked</option>
      </select>
    </div>

    <div className="recipes-results-heading">
      <h2>All recipes · {filteredRecipes.length} results</h2>
    </div>
    {loading && (
  <p className="recipes-message">Loading recipes...</p>
)}

{error && (
  <p className="recipes-message error">
    {error}
  </p>
)}

    {!loading && !error && (
  filteredRecipes.length > 0 ? (
    <div className="recipes-grid">
      {filteredRecipes.map((recipe) => (
        <RecipeListCard key={recipe._id} recipe={recipe} />
      ))}
    </div>
  ) : (
    <div className="no-recipes">
      <h3>No recipes found</h3>
      <p>Try another search term or category.</p>

      <button
        type="button"
        onClick={() => {
          setSearchQuery('')
          setSelectedCategory('all')
          setSelectedTime('all')
          setSortBy('latest')
        }}
      >
        Clear filters
      </button>
    </div>
  )
)}

  </div>
</div>
</section>
<footer className="footer">
  <p>Cabbages Recipe · Recipes from home cooks, for home cooks.</p>

  <nav>
    <a href="#about">About</a>
    <a href="#guidelines">Community guidelines</a>
    <a href="#help">Help</a>
  </nav>
</footer>
</main>
)
}
export default Recipes