const handleLike = async ({ user, id, setIsLiked, setLikeCount, setRecipe }) => {
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

		setRecipe && setRecipe(previous => ({
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

export default handleLike;