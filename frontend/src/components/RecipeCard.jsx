import { Link } from 'react-router-dom'
import { useState } from 'react'
import { Heart, MessageCircle, Bookmark } from 'lucide-react'

function RecipeCard({ recipe, rank, latest = false }) {
  const [isLiked, setIsLiked] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [likeCount, setLikeCount] = useState(recipe.likedBy?.length || 0)
  const handleLike = () => {
		const nextLiked = !isLiked

		setIsLiked(nextLiked)
		setLikeCount((count) => count + (nextLiked ? 1 : -1))
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
							onClick={handleLike}
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
							<span>{recipe.comments}</span>
						</span>
					</div>

					<button
						type="button"
						className={`interaction-button save-button ${isSaved ? 'active' : ''}`}
						onClick={() => setIsSaved((previous) => !previous)}
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