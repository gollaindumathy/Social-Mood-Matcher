import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Navbar.css'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="navbar-brand">
          <span className="brand-emoji">🎭</span>
          <span className="brand-name">MoodMatcher</span>
        </NavLink>

        {user && (
          <div className="navbar-links">
            <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} end>
              Home
            </NavLink>
            <NavLink to="/feed" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Feed
            </NavLink>
            <NavLink to="/matches" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Matches
            </NavLink>
          </div>
        )}

        {user ? (
          <div className="navbar-right">
            <NavLink to="/profile" className="navbar-avatar" title="Profile">
              <div
                className="avatar-circle"
                style={{ backgroundColor: user.avatarColor }}
              >
                {user.displayName[0]?.toUpperCase()}
              </div>
              <span className="navbar-username">{user.displayName}</span>
            </NavLink>
            <button className="btn-ghost" onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <div className="navbar-right">
            <NavLink to="/login" className="btn-ghost">Login</NavLink>
            <NavLink to="/register" className="btn-primary" style={{ padding: '8px 18px', fontSize: 14 }}>Sign Up</NavLink>
          </div>
        )}
      </div>
    </nav>
  )
}
