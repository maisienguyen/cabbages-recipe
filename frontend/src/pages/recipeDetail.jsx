import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Heart, Bookmark, Pencil, Trash2, X, Check } from 'lucide-react'
import { useAuth } from '../context/authContext'
import handleLike from '../utils/handleLike'
import handleBookmark from '../utils/handleBookmark'
import './recipeDetail.css'

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
  const [editingCommentId, setEditingCommentId] = useState(null)
  const [editingCommentText, setEditingCommentText] = useState('')

  const [checkedIngredients, setCheckedIngredients] = useState([])

  // Fetch recipe
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true)

        const response = await fetch(
          `/api/recipes/${id}`
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
          `/api/comments/${id}`
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
        `/api/comments/${id}`,
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

  // Edit comment
const handleEditComment = async (commentId) => {
  if (!editingCommentText.trim()) return

  try {
    const response = await fetch(
      `/api/comments/${commentId}`,
      {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: editingCommentText.trim(),
        }),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update comment')
    }

    setComments(previous =>
      previous.map(comment =>
        comment._id === commentId ? data : comment
      )
    )

    setEditingCommentId(null)
    setEditingCommentText('')
  } catch (error) {
    setCommentError(error.message)
  }
}

// Delete comment
const handleDeleteComment = async (commentId) => {
  const confirmed = window.confirm(
    'Are you sure you want to delete this comment?'
  )

  if (!confirmed) return

  try {
    const response = await fetch(
      `/api/comments/${commentId}`,
      {
        method: 'DELETE',
        credentials: 'include',
      }
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete comment')
    }

    setComments(previous =>
      previous.filter(comment => comment._id !== commentId)
    )
  } catch (error) {
    setCommentError(error.message)
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
                  : recipe.image
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

    <div className="creator-info">
    <div className="creator-avatar">
      {recipe.author?.avatar ? (
        <img src={recipe.author.avatar} alt="Creator avatar" />
      ) : (
        <span>
          {(recipe.author?.displayName || recipe.author?.username || 'U')
            .charAt(0)
            .toUpperCase()}
        </span>
      )}
    </div>

    <div className="creator-details">
      <h3>
        {recipe.author?.displayName || recipe.author?.username || 'Unknown'}
      </h3>
      <p>@{recipe.author?.username || 'unknown'}</p>
      <p>User ID: {recipe.author?._id}</p>
    </div>
  </div>

  {recipe.author?.bio && (
    <p className="creator-bio">{recipe.author.bio}</p>
  )}

  <div className="creator-dates">
    <p>
      Published: {new Date(recipe.createdAt).toLocaleDateString()}
    </p>
    <p>
      Updated: {new Date(recipe.updatedAt).toLocaleDateString()}
    </p>
  </div>
</div>

          {/* Like and Save */}
          <div className="engagement-card">
            <h3>Enjoyed this recipe?</h3>

            <div className="engagement-buttons">

              <button
                type="button"
                className={`engagement-btn ${isLiked ? 'liked' : ''}`}
                onClick={() => handleLike({ user, id, setIsLiked, setLikeCount, setRecipe })}
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
                onClick={() => handleBookmark({ user, id, setIsSaved, setRecipe })}
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
            {comments.map(comment => {
  const isOwner =
    user &&
    String(comment.author?._id || comment.author) === String(user.id)

  const isEditing = editingCommentId === comment._id

  return (
    <article className="comment-card" key={comment._id}>
      <div className="comment-meta">
        <strong>{comment.author?.username || 'Unknown'}</strong>

        <div className="comment-meta-right">
          <span>
            {comment.createdAt
              ? new Date(comment.createdAt).toLocaleDateString()
              : ''}
          </span>

          {isOwner && !isEditing && (
            <div className="comment-actions">
              <button
                type="button"
                className="comment-icon-button"
                title="Edit comment"
                aria-label="Edit comment"
                onClick={() => {
                  setEditingCommentId(comment._id)
                  setEditingCommentText(comment.content)
                }}
              >
                <Pencil size={15} />
              </button>

              <button
                type="button"
                className="comment-icon-button"
                title="Delete comment"
                aria-label="Delete comment"
                onClick={() => handleDeleteComment(comment._id)}
              >
                <Trash2 size={15} />
              </button>
            </div>
          )}
        </div>
      </div>

      {isEditing ? (
        <div className="comment-edit-form">
          <textarea
            value={editingCommentText}
            onChange={e => setEditingCommentText(e.target.value)}
          />

          <div className="comment-actions">
            <button
              type="button"
              className="comment-icon-button"
              title="Save changes"
              aria-label="Save changes"
              onClick={() => handleEditComment(comment._id)}
            >
              <Check size={16} />
            </button>

            <button
              type="button"
              className="comment-icon-button"
              title="Cancel editing"
              aria-label="Cancel editing"
              onClick={() => {
                setEditingCommentId(null)
                setEditingCommentText('')
              }}
            >
              <X size={16} />
            </button>
          </div>
        </div>
      ) : (
        <p>{comment.content}</p>
      )}
    </article>
  )
})}
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
