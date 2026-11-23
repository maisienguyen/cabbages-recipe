import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Heart, MessageCircle, Bookmark } from 'lucide-react'
import { useAuth } from '../context/authContext'
import handleLike from '../utils/handleLike'
import handleBookmark from '../utils/handleBookmark'
import getCommentCount from '../utils/getCommentCount'

function RecipeCard({ recipe, rank, latest = false }) {
	const { user, loading: authLoading } = useAuth()
  const [isLiked, setIsLiked] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [likeCount, setLikeCount] = useState(recipe.likedBy?.length || 0)
	const [commentCount, setCommentCount] = useState(0)

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

		const fetchCommentCount = async () => {
			const count = await getCommentCount(recipe._id);
			setCommentCount(String(count));
		};

		if (recipe?._id) {
			fetchCommentCount();
		}
  }, [recipe, user, authLoading])

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
      	{rank && <span className="rank">#{rank} most liked</span>}
      </div>

      <div className="recipe-content">
        <div className="recipe-meta">
          <span>{recipe.category}</span>
          <span>{recipe.cookingTime} min</span>
        </div>

        <h3>{recipe.title}</h3>

        <p className="recipe-author">
        	By {recipe.author?.username || 'Unknown'}
        </p>

        {latest && recipe.published && (
          <p className="recipe-published">
            Published: {recipe.published}
          </p>
        )}

  			<div className="recipe-actions">
  				<div className="recipe-engagement">
						<button
							type="button"
							className={`interaction-button like-button ${isLiked ? 'active' : ''}`}
							onClick={() => handleLike({ user, id: recipe._id, setIsLiked, setLikeCount })}
							aria-label={isLiked ? 'Unlike recipe' : 'Like recipe'}
							aria-pressed={isLiked}
						>
							<Heart
								size={19}
								fill={isLiked ? 'currentColor' : 'none'}
								strokeWidth={1.8}
							/>
							<span>{likeCount}</span>
						</button>

						<span className="comment-count">
							<MessageCircle size={18} strokeWidth={1.8} />
							<span>{commentCount}</span>
						</span>
					</div>

					<button
						type="button"
						className={`interaction-button save-button ${isSaved ? 'active' : ''}`}
						onClick={() => handleBookmark({ user, id: recipe._id, setIsSaved })}
						aria-label={isSaved ? 'Remove from saved recipes' : 'Save recipe'}
						aria-pressed={isSaved}
					>
						<Bookmark
							size={19}
							fill={isSaved ? 'currentColor' : 'none'}
							strokeWidth={1.8}
						/>
					</button>
				</div>

       <Link to={`/recipes/${recipe._id}`} className="view-button">
					View recipe <span>→</span>
				</Link>
      </div>
    </article>
  )
}

export default RecipeCard