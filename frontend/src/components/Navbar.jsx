import { Link, NavLink } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/authContext'
import { UserRound, BookOpen, LogOut } from 'lucide-react'

function Navbar() {
  const { user, logout } = useAuth()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  return (
    <header className="navbar">
      <Link className="brand" to="/">
      <img 
        src="/favicon.svg"
        alt="cabbages recipe"
        className="brand-logo"
        />
        <span>cabbages recipe</span>
      </Link>

      <nav className="nav-links">
         <NavLink to="/" end>
         Home
         </NavLink>

         <NavLink to="/recipes">
         Recipes
         </NavLink>

        <NavLink to="/user">
        My profile
        </NavLink>
       </nav>

      <div className="nav-user">
        {user ? (
          <>
            <button
              type="button"
              className="profile-link"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span className="avatar">
                {user.username.charAt(0).toUpperCase()}
              </span>
              <span className="username">{user.username}</span>
            </button>

            {isDropdownOpen && (
              <div className="dropdown-menu">
                <Link
                  to="/user"
                  className="dropdown-item"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <UserRound size={16} />
                  My Profile
                </Link>

                <Link
                  to="/my-recipes"
                  className="dropdown-item"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <BookOpen size={16} />
                  My Recipes
                </Link>

                <button
                  type="button"
                  className="dropdown-item"
                  onClick={() => {
                    setIsDropdownOpen(false)
                    logout()
                  }}
                >
                  <LogOut size={16} />
                  Log out
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            <Link to="/login" className="login-button">
              Log in
            </Link>

            <Link to="/register" className="register-button">
              Register
            </Link>
          </>
        )}
      </div>
    </header>
  )
}

export default Navbar
