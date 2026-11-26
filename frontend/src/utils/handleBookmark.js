 const handleBookmark = async ({ user, id, setIsSaved, setRecipe }) => {
	if (!user) {
		alert('Please log in to save this recipe.')
		return
	}

	try {
		const response = await fetch(
			`/api/recipes/${id}/save`,
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

		setRecipe && setRecipe(previous => ({
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

export default handleBookmark