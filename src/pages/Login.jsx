import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginUser, registerUser } from '../utils/auth'
import './Login.css'

function Login() {
  const [isLogin, setIsLogin] = useState(true)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    console.log('🔐 Login component mounted')
    // Check if already logged in
    try {
      const currentUser = localStorage.getItem('currentUser')
      if (currentUser) {
        console.log('✅ User already logged in, redirecting...')
        navigate('/home')
      }
    } catch (error) {
      console.error('❌ Error checking login status:', error)
    }
  }, [navigate])

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (isLogin) {
      const result = loginUser(username, password)
      if (result.success) {
        navigate('/home')
      } else {
        setError(result.error)
      }
    } else {
      if (!email) {
        setError('Email is required')
        return
      }
      const result = registerUser(username, email, password)
      if (result.success) {
        // Auto login after registration
        const loginResult = loginUser(username, password)
        if (loginResult.success) {
          navigate('/home')
        }
      } else {
        setError(result.error)
      }
    }
  }

  const handleQuickLogin = (username, password) => {
    setUsername(username)
    setPassword(password)
    const result = loginUser(username, password)
    if (result.success) {
      navigate('/home')
    } else {
      setError(result.error)
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>💰 Finance Tracker</h1>
          <p>Manage your finances with ease</p>
        </div>

        <div className="login-tabs">
          <button
            className={isLogin ? 'active' : ''}
            onClick={() => {
              setIsLogin(true)
              setError('')
            }}
          >
            Login
          </button>
          <button
            className={!isLogin ? 'active' : ''}
            onClick={() => {
              setIsLogin(false)
              setError('')
            }}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Enter username"
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter email"
              />
            </div>
          )}

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter password"
              minLength={6}
            />
          </div>

          <button type="submit" className="submit-btn">
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>

        {isLogin && (
          <div className="quick-login">
            <p>Quick Login (Demo):</p>
            <div className="quick-buttons">
              <button
                className="quick-btn admin"
                onClick={() => handleQuickLogin('admin', 'hope1299')}
              >
                👑 Admin
              </button>
              <button
                className="quick-btn user"
                onClick={() => handleQuickLogin('user', 'user1299')}
              >
                👤 User
              </button>
            </div>
            {/* <p className="demo-note">
              Admin: admin / admin123<br />
              User: user / user123
            </p> */}
          </div>
        )}
      </div>
    </div>
  )
}

export default Login

