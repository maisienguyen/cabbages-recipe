const getCommentCount = async (id) => {
	try {
		const response = await fetch(
      `http://localhost:5000/api/comments/${id}/count`
    )

		if (!response.ok) {
			throw new Error('Failed to fetch comment count')
		}

		const data = await response.json()
		return data.commentCount;
	} catch (error) {
		console.error("Fetching comment count failed: ", error)
	}
}

export default getCommentCount