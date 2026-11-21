
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Heart, Bookmark } from 'lucide-react'
import { useAuth } from '../context/authContext'

function RecipeDetail() {
  const { id } = useParams()
  const { user, loading: authLoading } = useAuth()

  const [recipe, setRecipe] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [isLiked, setIsLiked] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [likeCount, setLikeCount] = useState(0)

  const [comments, setComments] = useState([])
  const [commentText, setCommentText] = useState('')
  const [loadingComments, setLoadingComments] = useState(true)
  const [commentError, setCommentError] = useState('')
  const [postingComment, setPostingComment] = useState(false)

  const [checkedIngredients, setCheckedIngredients] = useState([])

  // Fetch recipe
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true)

        const response = await fetch(
          `http://localhost:5000/api/recipes/${id}`
        )

        if (!response.ok) {
          throw new Error('Failed to fetch recipe')
        }

        const data = await response.json()
        setRecipe(data)
        setLikeCount(data.likedBy?.length || 0)
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchRecipe()
  }, [id])

  // Sync Like and Save with logged-in user
  useEffect(() => {
    if (!recipe || authLoading) return

    setIsLiked(
      user
        ? recipe.likedBy?.some(
            item => String(item?._id || item) === String(user.id)
          )
        : false
    )

    setIsSaved(
      user
        ? recipe.savedBy?.some(
            item => String(item?._id || item) === String(user.id)
          )
        : false
    )
  }, [recipe, user, authLoading])

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoadingComments(true)
        setCommentError('')

        const response = await fetch(
          `http://localhost:5000/api/comments/${id}`
        )

        if (!response.ok) {
          throw new Error('Failed to fetch comments')
        }

        const data = await response.json()
        setComments(data)
      } catch (error) {
        setCommentError(error.message)
      } finally {
        setLoadingComments(false)
      }
    }

    fetchComments()
  }, [id])

  // Like / Unlike
  const handleLike = async () => {
    if (!user) {
      alert('Please log in to like this recipe.')
      return
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/recipes/${id}/like`,
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

      setRecipe(previous => ({
        ...previous,
        likedBy: data.liked
          ? [...(previous.likedBy || []), user.id]
          : (previous.likedBy || []).filter(
              item => String(item?._id || item) !== String(user.id)
            ),
      }))
    } catch (error) {
      console.error('Like error:', error)
      alert(error.message)
    }
  }

  // Save / Unsave
  const handleSave = async () => {
    if (!user) {
      alert('Please log in to save this recipe.')
      return
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/recipes/${id}/save`,
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

      setRecipe(previous => ({
        ...previous,
        savedBy: data.saved
          ? [...(previous.savedBy || []), user.id]
          : (previous.savedBy || []).filter(
              item => String(item?._id || item) !== String(user.id)
            ),
      }))
    } catch (error) {
      console.error('Save error:', error)
      alert(error.message)
    }
  }

  // Post comment
  const handlePostComment = async (event) => {
    event.preventDefault()

    if (!user) {
      alert('Please log in to comment.')
      return
    }

    if (!commentText.trim()) return

    try {
      setPostingComment(true)

      const response = await fetch(
        `http://localhost:5000/api/comments/${id}`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: commentText.trim(),
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to post comment')
      }

      setComments(previous => [data, ...previous])
      setCommentText('')
      setCommentError('')
    } catch (error) {
      console.error('Comment error:', error)
      setCommentError(error.message)
    } finally {
      setPostingComment(false)
    }
  }

  if (loading || authLoading) {
    return <p>Loading recipe...</p>
  }

  if (error) {
    return <p className="recipe-error">{error}</p>
  }

  if (!recipe) {
    return <p>Recipe not found</p>
  }

  return (
    <main className="recipe-detail-page">

      {/* Recipe header */}
      <section className="detail-header">
        <p className="breadcrumb">
          Recipes / {recipe.category} / {recipe.title}
        </p>

        <span className="detail-category">
          {recipe.category}
        </span>

        <h1>{recipe.title}</h1>

        <p>{recipe.description}</p>
      </section>

      {/* Main recipe content */}
      <section className="detail-main">

        <div className="detail-left">

          {/* Recipe image */}
          <img
            className="detail-image"
            src={
              !recipe.image
                ? '/placeholder-recipe.jpg'
                : recipe.image.startsWith('http')
                  ? recipe.image
                  : `http://localhost:5000${recipe.image}`
            }
            alt={recipe.title}
          />

          {/* Recipe information */}
          <div className="recipe-info">
            <div>
              <span>Cooking time</span>
              <strong>{recipe.cookingTime} minutes</strong>
            </div>

            <div>
              <span>Servings</span>
              <strong>{recipe.servings} servings</strong>
            </div>
          </div>

          {/* Ingredients and instructions */}
          <div className="recipe-content-grid">

            <section className="ingredients-section">
  <h2>Ingredients</h2>

  <p className="ingredients-subtitle">
    For {recipe.servings} servings
  </p>

  <ul className="ingredients-list">
    {recipe.ingredients?.map((ingredient, index) => (
      <li
        key={index}
        className={
          checkedIngredients.includes(index) ? 'checked' : ''
        }
      >
        <label>
          <input
            type="checkbox"
            checked={checkedIngredients.includes(index)}
            onChange={() => {
              setCheckedIngredients(previous =>
                previous.includes(index)
                  ? previous.filter(item => item !== index)
                  : [...previous, index]
              )
            }}
          />

          <span>{ingredient}</span>
        </label>
      </li>
    ))}
  </ul>

  <p className="ingredients-hint">
    Check off ingredients as you cook.
  </p>
</section>

            <section className="instructions-section">
              <h2>Instructions</h2>

              <ol>
                {recipe.instructions?.map((instruction, index) => (
                  <li key={index}>
                    {String(instruction).replace(
                      /^\s*(\d+[\.\)]\s*)+/,
                      ''
                    )}
                  </li>
                ))}
              </ol>
            </section>

          </div>
        </div>

        {/* Sidebar */}
        <aside className="detail-sidebar">

          {/* Creator */}
          <div className="creator-card">
            <h2>About the creator</h2>

            <p>
              {recipe.author?.username || 'Unknown'}
            </p>
          </div>

          {/* Like and Save */}
          <div className="engagement-card">
            <h3>Enjoyed this recipe?</h3>

            <div className="engagement-buttons">

              <button
                type="button"
                className={`engagement-btn ${isLiked ? 'liked' : ''}`}
                onClick={handleLike}
                aria-pressed={isLiked}
              >
                <Heart
                  size={15}
                  fill={isLiked ? 'currentColor' : 'none'}
                />
                Like · {likeCount}
              </button>

              <button
                type="button"
                className={`engagement-btn ${isSaved ? 'saved' : ''}`}
                onClick={handleSave}
                aria-pressed={isSaved}
              >
                <Bookmark
                  size={15}
                  fill={isSaved ? 'currentColor' : 'none'}
                />
                {isSaved ? 'Saved' : 'Save'}
              </button>

            </div>
          </div>

        </aside>
      </section>

      {/* Comments */}
      <section className="comments-section">

        <h2>Comments · {comments.length}</h2>

        {/* Comment form */}
        <form onSubmit={handlePostComment}>

          <label>
            Add a comment as {user?.username || 'Guest'}
          </label>

          <textarea
            value={commentText}
            onChange={(event) => setCommentText(event.target.value)}
            placeholder="Share a tip or ask a question..."
            rows={3}
            maxLength={1000}
          />

          <button
            type="submit"
            disabled={!commentText.trim() || postingComment}
          >
            {postingComment ? 'Posting...' : 'Post comment'}
          </button>

        </form>

        {commentError && (
          <p className="comment-error">{commentError}</p>
        )}

        {loadingComments && (
          <p>Loading comments...</p>
        )}

        {/* Comment list */}
        {!loadingComments && comments.length > 0 && (
          <div className="comments-list">
            {comments.map(comment => (
              <article
                className="comment-card"
                key={comment._id}
              >
                <div className="comment-meta">
                  <strong>
                    {comment.author?.username || 'Unknown'}
                  </strong>

                  <span>
                    {comment.createdAt
                      ? new Date(comment.createdAt).toLocaleDateString()
                      : ''}
                  </span>
                </div>

                <p>{comment.content}</p>
              </article>
            ))}
          </div>
        )}

        {!loadingComments && comments.length === 0 && (
          <p className="no-comments">
            No comments yet. Be the first to comment!
          </p>
        )}

      </section>

    </main>
  )
}

export default RecipeDetail
