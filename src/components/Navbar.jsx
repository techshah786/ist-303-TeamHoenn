import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { getCurrentUser, logoutUser } from '../utils/auth'
import './Navbar.css'

function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const currentUser = getCurrentUser()

  const handleLogout = () => {
    logoutUser()
    navigate('/login')
  }

  const isActive = (path) => {
    return location.pathname === path ? 'active' : ''
  }

  if (!currentUser) return null

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand" onClick={() => navigate('/home')}>
          <span className="brand-icon">💰</span>
          <span className="brand-text">Finance Tracker</span>
        </div>
        
        <div className="navbar-menu">
          <button
            className={`nav-item ${isActive('/home')}`}
            onClick={() => navigate('/home')}
          >
            📊 Dashboard
          </button>
          <button
            className={`nav-item ${isActive('/transactions')}`}
            onClick={() => navigate('/transactions')}
          >
            💳 Transactions
          </button>
          <button
            className={`nav-item ${isActive('/coupons')}`}
            onClick={() => navigate('/coupons')}
          >
            🎟️ Coupons
          </button>
          <button
            className={`nav-item ${isActive('/analysis')}`}
            onClick={() => navigate('/analysis')}
          >
            📊 Analysis
          </button>
        </div>

        <div className="navbar-user">
          <span className="user-name">
            👤 {currentUser.username}
            {currentUser.role === 'admin' && <span className="role-badge">Admin</span>}
          </span>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

