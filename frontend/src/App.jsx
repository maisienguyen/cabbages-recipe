import { Link, Routes, Route } from 'react-router-dom'
import CreateRecipe from './pages/createRecipe.jsx'
import UserLogin from './pages/userLogin.jsx'
import UserRegister from './pages/userRegister.jsx'
import './App.css'


const categories = [
  { name: 'Breakfast', count: 8 },
  { name: 'Snack', count: 3 },
  { name: 'Lunch', count: 5 },
  { name: 'Dinner', count: 6 },
  { name: 'Dessert', count: 2 },
  { name: 'Drinks', count: 2 },
]

const popularRecipes = [
  {
    id: 1,
    title: 'One-pan tomato pasta',
    category: 'Dinner',
    time: 30,
    author: 'Jordan Lee',
    likes: 41,
    comments: 12,
    image:
      'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=800&q=85',
  },
  {
    id: 2,
    title: 'Lemon chickpea salad',
    category: 'Lunch',
    time: 20,
    author: 'Maya Chen',
    likes: 32,
    comments: 8,
    image:
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=85',
  },
  {
    id: 3,
    title: 'Roasted salmon & vegetables',
    category: 'Dinner',
    time: 45,
    author: 'Sam Taylor',
    likes: 29,
    comments: 7,
    image:
      'https://images.unsplash.com/photo-1676300185165-3f543c1fcb72?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
  },
  {
    id: 4,
    title: 'Avocado toast with poached egg',
    category: 'Breakfast',
    time: 15,
    author: 'Maya Chen',
    likes: 24,
    comments: 6,
    image:
      'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=85',
  },
]

const latestRecipes = [
  {
    id: 5,
    title: 'Crispy spiced chickpeas',
    category: 'Snack',
    time: 25,
    author: 'Alex Rivera',
    likes: 7,
    comments: 2,
    published: 'Oct 4, 2026 · 08:00 UTC',
    image:
      'https://images.unsplash.com/photo-1515543904379-3d757afe72e4?auto=format&fit=crop&w=800&q=85',
  },
  {
    id: 6,
    title: 'Apple cinnamon crumble',
    category: 'Dessert',
    time: 50,
    author: 'Sam Taylor',
    likes: 12,
    comments: 3,
    published: 'Oct 3, 2026 · 16:45 UTC',
    image:
      'https://plus.unsplash.com/premium_photo-1695865414399-83a1b82d87ef?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
  },
  {
    id: 7,
    title: 'Avocado toast with poached egg',
    category: 'Breakfast',
    time: 15,
    author: 'Maisie Kim',
    likes: 24,
    comments: 6,
    published: 'Oct 2, 2026 · 09:30 UTC',
    image:
      'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=85',
  },
  {
    id: 8,
    title: 'Berry overnight oats',
    category: 'Breakfast',
    time: 10,
    author: 'Mai Nguyen',
    likes: 18,
    comments: 3,
    published: 'Oct 1, 2026 · 07:00 UTC',
    image:
      'https://images.unsplash.com/photo-1619854231899-33ee7003dd8d?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
  },
]

function RecipeCard({ recipe, rank, latest = false }) {
  return (
    <article className="recipe-card">
      <div className="recipe-image">
        <img src={recipe.image} alt={recipe.title} loading="lazy" />

        {rank && <span className="rank">#{rank} most liked</span>}
      </div>

      <div className="recipe-content">
        <div className="recipe-meta">
          <span>{recipe.category}</span>
          <span>{recipe.time} min</span>
        </div>

        <h3>{recipe.title}</h3>

        <p className="recipe-author">By {recipe.author}</p>

        {latest && recipe.published && (
          <p className="recipe-published">
            Published: {recipe.published}
          </p>
        )}

        <div className="recipe-actions">
          <button
            type="button"
            className="like-button"
            aria-label={`Like ${recipe.title}`}
            onClick={() => alert('Like functionality will be added later.')}
          >
            Like · {recipe.likes}
          </button>

          <span className="comment-count">
            {recipe.comments} comments
          </span>

          <button
            type="button"
            className="save-button"
            onClick={() => alert('Save functionality will be added later.')}
          >
            Save
          </button>
        </div>

        <button
          type="button"
          className="view-button"
          onClick={() => alert(`Recipe details: ${recipe.title}`)}
        >
          View recipe →
        </button>
      </div>
    </article>
  )
}

function App() {
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
    <Routes>
      <Route
        path="/"
        element={
          <div className="app">
      <header className="navbar">
        <Link className="brand" to="/">
          Cabbages Recipe
        </Link>

        <nav className="nav-links">
          <Link className="active" to="/">
            Home
          </Link>
          <Link to="/recipes">Recipes</Link>
          <Link to="/user">My profile</Link>
        </nav>

<div className="nav-user">
  <Link to="/login" className="login-button">
    Log in
  </Link>

  <Link to="/register" className="register-button">
    Register
  </Link>
</div>
      </header>

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
            {categories.map((category) => (
              <Link
                to={`/recipes?category=${encodeURIComponent(category.name)}`}
                className="category-card"
                key={category.name}
              >
                <div>
                  <h3>{category.name}</h3>
                  <p>{category.count} recipes</p>
                </div>

                <span>→</span>
              </Link>
            ))}
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

          <div className="recipe-grid">
            {popularRecipes.map((recipe, index) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                rank={index + 1}
              />
            ))}
          </div>
        </section>

        <section className="section latest-section">
          <div className="section-heading">
            <div>
              <h2>Latest recipes</h2>
              <p>Fresh from the community · Newest published first.</p>
            </div>

            <Link to="/recipes?sort=latest">View latest →</Link>
          </div>

          <div className="recipe-grid">
            {latestRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                latest
              />
            ))}
          </div>
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
    </Routes>

  )
}

export default App