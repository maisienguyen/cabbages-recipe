import { useAuth } from '../context/authContext'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import CreateRecipe from './createRecipe'
import './UserProfile.css'

function UserProfile() {
  const { user } = useAuth()

  const [recipes, setRecipes] = useState([])
  const [moreRecipes, setMoreRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)
  const [activeTab, setActiveTab] = useState('My recipes')
  const [selectedRecipeId, setSelectedRecipeId] = useState(null)
  const [commentsByRecipe, setCommentsByRecipe] = useState({})
  const [expandedComments, setExpandedComments] = useState({})

  // Like recipe
  const handleLike = async (recipeId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/recipes/${recipeId}/like`,
        {
          method: 'PATCH',
          credentials: 'include',
        }
      )

      if (!response.ok) {
        throw new Error('Failed to like recipe')
      }

      const result = await response.json()

      setRecipes(prevRecipes =>
        prevRecipes.map(recipe =>
          recipe._id === recipeId
            ? {
                ...recipe,
                likedBy: result.liked
                  ? [...(recipe.likedBy || []), user.id]
                  : (recipe.likedBy || []).filter(
                      id => id.toString() !== user.id.toString()
                    ),
              }
            : recipe
        )
      )
    } catch (error) {
      console.error('Like error:', error)
    }
  }

  // Fetch comments
  const fetchComments = async (recipeId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/comments/${recipeId}`
      )

      if (!response.ok) {
        throw new Error('Failed to load comments')
      }

      const data = await response.json()

      setCommentsByRecipe(prev => ({
        ...prev,
        [recipeId]: data,
      }))
    } catch (error) {
      console.error('Fetch comments error:', error)
    }
  }

  // Show or hide comments
  const toggleComments = (recipeId) => {
    const isExpanded = expandedComments[recipeId]

    setExpandedComments(prev => ({
      ...prev,
      [recipeId]: !isExpanded,
    }))

    if (!isExpanded && !commentsByRecipe[recipeId]) {
      fetchComments(recipeId)
    }
  }

  // Delete recipe
  const handleDelete = async (recipeId) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this recipe?'
    )

    if (!confirmed) return

    try {
      const response = await fetch(
        `http://localhost:5000/api/recipes/${recipeId}`,
        {
          method: 'DELETE',
          credentials: 'include',
        }
      )

      if (!response.ok) {
        throw new Error('Failed to delete recipe')
      }

      setRecipes(prevRecipes =>
        prevRecipes.filter(recipe => recipe._id !== recipeId)
      )
    } catch (error) {
      setError(error.message)
    }
  }

  // Fetch user's recipes
  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    const fetchMyRecipes = async () => {
      try {
        setLoading(true)

        const response = await fetch(
          'http://localhost:5000/api/recipes/my-recipes',
          { credentials: 'include' }
        )

        if (!response.ok) {
          throw new Error('Failed to fetch your recipes')
        }

        const data = await response.json()
        setRecipes(data)
        setError('')
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchMyRecipes()
  }, [user, refreshKey])

  // Fetch other users' recipes
  useEffect(() => {
    const fetchMoreRecipes = async () => {
      try {
        const response = await fetch(
          'http://localhost:5000/api/recipes'
        )

        if (!response.ok) {
          throw new Error('Failed to fetch more recipes')
        }

        const data = await response.json()
        setMoreRecipes(data)
      } catch (error) {
        console.error('Fetch more recipes error:', error)
      }
    }

    fetchMoreRecipes()
  }, [])

  if (!user) {
    return (
      <main className="container">
        Please log in to view your profile.
      </main>
    )
  }

  const publishedRecipes = recipes.filter(recipe => !recipe.isDraft)
  const draftRecipes = recipes.filter(recipe => recipe.isDraft)

  const displayedRecipes =
    activeTab === 'Drafts' ? draftRecipes : publishedRecipes

  const discoverRecipes = moreRecipes
    .filter(recipe => {
      const authorId = recipe.author?._id || recipe.author
      return authorId?.toString() !== user.id?.toString()
    })
    .slice(0, 4)

  const totalLikes = publishedRecipes.reduce(
    (total, recipe) => total + (recipe.likedBy?.length || 0),
    0
  )

  const totalSaves = publishedRecipes.reduce(
    (total, recipe) => total + (recipe.savedBy?.length || 0),
    0
  )

  const mostLikedRecipe = publishedRecipes.length > 0
    ? [...publishedRecipes].sort(
        (a, b) =>
          (b.likedBy?.length || 0) - (a.likedBy?.length || 0)
      )[0]
    : null

  const tabs = [
    `My recipes (${publishedRecipes.length})`,
    `Drafts (${draftRecipes.length})`,
    'Saved recipes',
    'Activity',
  ]

  return (
    <main className="container profile-page">

      {/* Profile heading */}
      <div className="profile-heading">
        <h1>My profile</h1>

        <Link to="/create-recipe" className="publish-button">
          + Publish new recipe
        </Link>
      </div>

      {/* Profile information */}
      <section className="profile-info">
        <div className="profile-avatar">
          {user.username?.charAt(0).toUpperCase()}
        </div>

        <div className="profile-details">
          <h2>{user.username}</h2>
          <p>{user.email}</p>

          <div className="profile-stats">
            <strong>{publishedRecipes.length} published recipes</strong>
            <strong>{draftRecipes.length} drafts</strong>
            <strong>
              {recipes.reduce(
                (total, recipe) =>
                  total + (recipe.savedBy?.length || 0),
                0
              )} saved recipes
            </strong>
          </div>
        </div>
      </section>

      {/* Profile tabs */}
      <nav className="profile-tabs">
        {tabs.map(tab => (
          <button
            key={tab}
            className={
              activeTab === tab.split(' (')[0] ? 'active' : ''
            }
            onClick={() => setActiveTab(tab.split(' (')[0])}
          >
            {tab}
          </button>
        ))}
      </nav>

      {/* Main profile content */}
      <section className="profile-content">

        {/* Two-column workspace */}
        <div className="profile-workspace">

          {/* LEFT COLUMN: Recipe posts */}
          <div className="profile-posts">

            <h2>
              {activeTab === 'Activity'
                ? 'Your cooking activity'
                : activeTab === 'Drafts'
                  ? 'Your draft recipes'
                  : activeTab === 'Saved recipes'
                    ? 'Your saved recipes'
                    : 'Your recipe posts'}
            </h2>

            {loading && <p>Loading recipes...</p>}
            {error && <p>{error}</p>}

            {!loading && !error && (
              <>
                {(activeTab === 'My recipes' ||
                  activeTab === 'Drafts') && (
                  <div className="profile-recipes-list">

                    {displayedRecipes.length > 0 ? (
                      displayedRecipes.map(recipe => {
                        const isLiked = recipe.likedBy?.some(
                          like =>
                            (like._id || like).toString() ===
                            user.id.toString()
                        )

                        return (
                          <article
                            className="profile-recipe-card"
                            key={recipe._id}
                          >
                            {recipe.image && (
                              <img
                                src={recipe.image}
                                alt={recipe.title}
                                className="profile-recipe-image"
                              />
                            )}

                            <div className="profile-recipe-info">
                              <h3>{recipe.title}</h3>
                              <p>{recipe.description}</p>
                              <p>
                                {recipe.category} · {recipe.cookingTime} min
                              </p>

                              <div className="profile-recipe-actions">

                                {!recipe.isDraft && (
                                  <button
                                    type="button"
                                    onClick={() => handleLike(recipe._id)}
                                  >
                                    {isLiked ? '♥ Liked' : '♡ Like'}
                                    {' '}({recipe.likedBy?.length || 0})
                                  </button>
                                )}

                                <button
                                  type="button"
                                  onClick={() =>
                                    setSelectedRecipeId(recipe._id)
                                  }
                                >
                                  Edit
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleDelete(recipe._id)}
                                >
                                  Delete
                                </button>

                                {!recipe.isDraft && (
                                  <button
                                    type="button"
                                    onClick={() => toggleComments(recipe._id)}
                                  >
                                    Comments
                                  </button>
                                )}
                              </div>

                              {expandedComments[recipe._id] && (
                                <div className="profile-recipe-comments">

                                  {commentsByRecipe[recipe._id]?.length > 0 ? (
                                    commentsByRecipe[recipe._id].map(comment => (
                                      <div key={comment._id}>
                                        <strong>
                                          {comment.author?.username || 'User'}
                                        </strong>
                                        <p>{comment.content}</p>
                                      </div>
                                    ))
                                  ) : (
                                    <p>No comments yet.</p>
                                  )}

                                </div>
                              )}
                            </div>
                          </article>
                        )
                      })
                    ) : (
                      <p>
                        {activeTab === 'Drafts'
                          ? 'You have no draft recipes yet.'
                          : 'You have not published any recipes yet.'}
                      </p>
                    )}

                  </div>
                )}

                {/* Activity tab */}
                {activeTab === 'Activity' && (
                  <section className="cooking-highlights">
                    <h3>Your cooking highlights</h3>

                    <div className="highlights-stats">

                      <div className="highlight-stat">
                        <strong>{publishedRecipes.length}</strong>
                        <span>Published recipes</span>
                      </div>

                      <div className="highlight-stat">
                        <strong>{totalLikes}</strong>
                        <span>Total likes</span>
                      </div>

                      <div className="highlight-stat">
                        <strong>{totalSaves}</strong>
                        <span>Total saves</span>
                      </div>

                    </div>

                    {mostLikedRecipe && (
                      <div className="highlight-recipe">
                        <h3>Most liked recipe</h3>

                        <div className="highlight-recipe-content">
                          {mostLikedRecipe.image && (
                            <img
                              src={mostLikedRecipe.image}
                              alt={mostLikedRecipe.title}
                            />
                          )}

                          <div>
                            <Link to={`/recipes/${mostLikedRecipe._id}`}>
                              <strong>{mostLikedRecipe.title}</strong>
                            </Link>

                            <p>
                              {mostLikedRecipe.likedBy?.length || 0} likes
                              {' · '}
                              {mostLikedRecipe.category}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </section>
                )}

                {/* Saved recipes tab */}
                {activeTab === 'Saved recipes' && (
                  <p>Saved recipes will be displayed here.</p>
                )}

              </>
            )}

          </div>
          {/* END LEFT COLUMN */}


          {/* RIGHT COLUMN: Recipe editor */}
          <div className="profile-editor">

            <h2>Recipe editor</h2>

            <div className="profile-editor-actions">

              <button
                type="button"
                className={
                  !selectedRecipeId ? 'editor-tab active' : 'editor-tab'
                }
                onClick={() => setSelectedRecipeId(null)}
              >
                + New recipe
              </button>

              <button
                type="button"
                className={
                  selectedRecipeId ? 'editor-tab active' : 'editor-tab'
                }
                onClick={() => {
                  if (recipes.length > 0 && !selectedRecipeId) {
                    setSelectedRecipeId(recipes[0]._id)
                  }
                }}
              >
                Edit existing
              </button>

            </div>

            {selectedRecipeId && (
              <select
                className="existing-recipe-button"
                value={selectedRecipeId}
                onChange={(e) => setSelectedRecipeId(e.target.value)}
              >
                {recipes.map(recipe => (
                  <option key={recipe._id} value={recipe._id}>
                    {recipe.title}
                  </option>
                ))}
              </select>
            )}

            <CreateRecipe
              embedded
              recipeId={selectedRecipeId}
              onSaved={() => {
                setSelectedRecipeId(null)
                setRefreshKey(prev => prev + 1)
              }}
            />

          </div>
          {/* END RIGHT COLUMN */}

        </div>
        {/* END TWO-COLUMN WORKSPACE */}


        {/* FULL-WIDTH SECTION BELOW BOTH COLUMNS */}
        {activeTab === 'My recipes' && (
          <section className="more-recipes-section">

            <div className="more-recipes-heading">
              <div>
                <h2>More from your kitchen</h2>
                <p>
                  Discover more delicious recipes from our community.
                </p>
              </div>
            </div>

            {discoverRecipes.length > 0 ? (
              <div className="more-recipes-grid">

                {discoverRecipes.map(recipe => (
                  <Link
                    to={`/recipes/${recipe._id}`}
                    className="more-recipe-card"
                    key={recipe._id}
                  >
                    {recipe.image ? (
                      <img src={recipe.image} alt={recipe.title} />
                    ) : (
                      <div className="more-recipe-placeholder">
                        No image
                      </div>
                    )}

                    <div className="more-recipe-info">
                      <h3>{recipe.title}</h3>
                      <p>
                        {recipe.category} · {recipe.cookingTime} min
                      </p>
                    </div>
                  </Link>
                ))}

              </div>
            ) : (
              <p>No more recipes to discover yet.</p>
            )}

          </section>
        )}

      </section>
      {/* END PROFILE CONTENT */}

    </main>
  )
}

export default UserProfile
