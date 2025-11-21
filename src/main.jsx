import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import ErrorBoundary from './components/ErrorBoundary'
import { initializeDummyData } from './utils/dummyData'
import './index.css'

// Initialize dummy data on app load (only if no transactions exist)
try {
  initializeDummyData()
} catch (error) {
  console.error('Error initializing dummy data:', error)
}

// Clear existing dummy transactions if user wants fresh start
// Uncomment the line below to clear all transactions on app load:
// localStorage.removeItem('transactions')

const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
)

