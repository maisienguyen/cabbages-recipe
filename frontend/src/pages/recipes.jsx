import { Link } from "react-router-dom";
import { useState } from "react";

const recipes = [
  {
    id: 1,
    title: 'Calamari with Lemon Butter Sauce',
    category: 'Dinner',
    time: 30,
    author: 'Mai Jasmine',
    likes: 42,
    image: 'https://images.unsplash.com/photo-1682264895449-f75b342cbab6?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
  },
  {
    id: 2,
    title: 'Tonkatsu',
    category: 'Lunch',
    time: 20,
    author: 'Maisie Kim',
    likes: 35,
    image: 'https://images.unsplash.com/photo-1662958501205-8434357b4fc3?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
  },
  {
    id: 3,
    title: 'Roasted Salmon',
    category: 'Dinner',
    time: 45,
    author: 'Sam Taylor',
    likes: 29,
    image: 'https://images.unsplash.com/photo-1676300185165-3f543c1fcb72?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
  },
  {
    id: 4,
    title: 'Avocado Toast',
    category: 'Breakfast',
    time: 15,
    author: 'Alex Rivera',
    likes: 24,
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800',
  },
  
{
  id: 5,
  title: 'Grilled Vegetable Wrap',
  category: 'Lunch',
  time: 25,
  author: 'Ashley Mendez',
  likes: 16,
  image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=800',
},
{
  id: 6,
  title: 'Berry Overnight Oats',
  category: 'Breakfast',
  time: 10,
  author: 'Ella Lopez',
  likes: 18,
  image: 'https://images.unsplash.com/photo-1619854231899-33ee7003dd8d?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
},

]

function Recipes() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortBy, setSortBy] = useState('latest');

  const filteredRecipes = recipes
    .filter((recipe) => {
      const matchesSearch =
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.author.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory =
        selectedCategory === 'all' ||
        recipe.category.toLowerCase() === selectedCategory

      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      if (sortBy === 'popular') {
        return b.likes - a.likes
      }

      return a.id - b.id
    })

    return (
    <main className="recipe-page">
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
    
<section className="recipe-content">
    <div className="recipe-heading">
        <div>
            <h2>All recipes</h2>
            <p>Explore recipes from home cooks, for home cooks.</p>
        </div>
     
    
        </div>
    

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

  <div className="recipes-filters">
    <select
    value={selectedCategory}
    onChange={(e) => setSelectedCategory(e.target.value)}
    aria-label="Filter recipes by category"
    >    
      <option value="all">All categories</option>
      <option value="breakfast">Breakfast</option>
      <option value="lunch">Lunch</option>
      <option value="dinner">Dinner</option>
      <option value="snack">Snack</option>
      <option value="dessert">Dessert</option>
      <option value="drinks">Drinks</option>
    </select>

    <select 
    value={sortBy}
    onChange={(e) => setSortBy(e.target.value)}
    aria-label="Sort recipes"
    >
      <option value="latest">Newest first</option>
      <option value="popular">Most liked</option>
    </select>
  </div>
</div>


{filteredRecipes.length > 0 ? (
  <div className="recipes-grid">
    {filteredRecipes.map((recipe) => (
      <article className="recipe-card" key={recipe.id}>
        <div className="recipe-image">
          <img src={recipe.image} alt={recipe.title} />
        </div>

        <div className="recipe-card-content">
          <div className="recipe-meta">
            <span>{recipe.category}</span>
            <span>{recipe.time} min</span>
          </div>

          <h3>{recipe.title}</h3>

          <p>By {recipe.author}</p>

          <div className="recipe-card-footer">
            <span>♡ {recipe.likes} likes</span>

            <Link to={`/recipes/${recipe.id}`}>
              View recipe →
            </Link>
          </div>
        </div>
      </article>
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
        setSortBy('latest')
      }}
    >
      Clear filters
    </button>
  </div>
)}
</section>
</main>
    )
}
export default Recipes