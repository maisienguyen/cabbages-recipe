
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
  },
  {
    id: 2,
    title: 'Lemon chickpea salad',
    category: 'Lunch',
    time: 20,
    author: 'Maya Chen',
    likes: 32,
    comments: 8,
  },
  {
    id: 3,
    title: 'Roasted salmon & vegetables',
    category: 'Dinner',
    time: 45,
    author: 'Sam Taylor',
    likes: 29,
    comments: 7,
  },
  {
    id: 4,
    title: 'Avocado toast with poached egg',
    category: 'Breakfast',
    time: 15,
    author: 'Maya Chen',
    likes: 24,
    comments: 6,
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
  },
  {
    id: 6,
    title: 'Apple cinnamon crumble',
    category: 'Dessert',
    time: 50,
    author: 'Sam Taylor',
    likes: 12,
    comments: 3,
  },
  {
    id: 7,
    title: 'Avocado toast with poached egg',
    category: 'Breakfast',
    time: 15,
    author: 'Maya Ashley',
    likes: 24,
    comments: 6,
  },
  {
    id: 8,
    title: 'Berry overnight oats',
    category: 'Breakfast',
    time: 10,
    author: 'Maya Chen',
    likes: 18,
    comments: 3,
  },
]

function RecipeCard({ recipe, rank }) {
  return (
    <article className="recipe-card">
      {rank && <span className="rank">#{rank} most liked</span>}

      <div className="recipe-image">
        Recipe image
      </div>

      <div className="recipe-content">
        <div className="recipe-meta">
          <span>{recipe.category}</span>
          <span>{recipe.time} min</span>
        </div>

        <h3>{recipe.title}</h3>
        <p className="recipe-author">By {recipe.author}</p>

        <div className="recipe-actions">
          <button type="button">
            Like · {recipe.likes}
          </button>
          <span>{recipe.comments} comments</span>
          <button type="button" className="save-button">
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
    alert('Search functionality will be added next.')
  }

  return (
    <div className="app">
      <header className="navbar">
        <a className="brand" href="/">
          Cabbages Recipe
        </a>

        <nav className="nav-links">
          <a className="active" href="/">Home</a>
          <a href="/recipes">Recipes</a>
          <a href="/user">My profile</a>
        </nav>

        <div className="nav-user">
          <button
            type="button"
            className="publish-button"
            onClick={() => alert('Publish recipe will be added later.')}
          >
            + Publish recipe
          </button>
          <span className="avatar">MC</span>
          <span className="username">Maya Chen⌄</span>
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
            <a href="/recipes">All recipes →</a>
          </div>

          <div className="category-grid">
            {categories.map((category) => (
              <a
                href={`/recipes?category=${encodeURIComponent(category.name)}`}
                className="category-card"
                key={category.name}
              >
                <div>
                  <h3>{category.name}</h3>
                  <p>{category.count} recipes</p>
                </div>
                <span>→</span>
              </a>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="section-heading">
            <div>
              <h2>Most liked recipes</h2>
              <p>Community favorites · Ranked by total likes, highest first.</p>
            </div>
            <a href="/recipes?sort=popular">View most liked →</a>
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
            <a href="/recipes?sort=latest">View latest →</a>
          </div>

          <div className="recipe-grid">
            {latestRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
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
  )
}

export default App

