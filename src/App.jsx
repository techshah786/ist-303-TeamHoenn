import React, { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { initializeUsers, isAuthenticated } from './utils/auth'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Home from './pages/Home'
import Transactions from './pages/Transactions'
import Coupons from './pages/Coupons'
import TransactionAnalysis from './pages/TransactionAnalysis'
import './App.css'

function App() {
  useEffect(() => {
    // Initialize default users
    try {
      initializeUsers()
      console.log('✅ App initialized successfully')
    } catch (error) {
      console.error('❌ Error initializing app:', error)
    }
  }, [])

  console.log('🔄 App component rendering...')

  return (
    <div className="app">
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <div className="app-main">
                  <Home />
                </div>
              </>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/transactions"
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <div className="app-main">
                  <Transactions />
                </div>
              </>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/analysis"
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <div className="app-main">
                  <TransactionAnalysis />
                </div>
              </>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/coupons"
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <div className="app-main">
                  <Coupons />
                </div>
              </>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/"
          element={
            isAuthenticated() ? (
              <Navigate to="/home" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </div>
  )
}

export default App

