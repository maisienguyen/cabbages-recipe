import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function userLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Login failed')
      }

      navigate('/create-recipe')
    } catch (error) {
      setError(error.message || 'Unable to connect to the server')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="login-page">
      <h1>Welcome back!</h1>
      <p>Log in to share your favourite recipes.</p>

      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        {error && <p className="login-error">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Log in'}
        </button>
      </form>

      <Link to="/">Back to Home</Link>
    </main>
  )
}

export default userLogin