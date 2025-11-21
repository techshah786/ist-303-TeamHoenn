import React, { useState, useEffect } from 'react'
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from '../utils/storage'
import { loadTransactions } from '../utils/transactions'
import './VirtualCard.css'

function VirtualCard() {
  const [cardAmount, setCardAmount] = useState(5000)
  const [isEditing, setIsEditing] = useState(false)
  const [editAmount, setEditAmount] = useState('')
  const [cardStyle, setCardStyle] = useState('dark') // 'dark' or 'light'

  useEffect(() => {
    // Load initial card amount from storage or calculate from transactions
    const savedAmount = loadFromStorage(STORAGE_KEYS.VIRTUAL_CARD_AMOUNT, null)
    const transactions = loadTransactions()
    
    // Calculate balance: start with saved amount or default, then apply transactions
    let balance = savedAmount !== null && savedAmount !== 0 ? savedAmount : 5000
    
    // Apply all transactions to calculate current balance
    transactions.forEach(t => {
      if (t.type === 'expense') {
        balance -= (t.amount || 0)
      } else if (t.type === 'income') {
        balance += (t.amount || 0)
      }
    })
    
    const finalBalance = Math.max(0, balance)
    setCardAmount(finalBalance)
    
    // Save the calculated balance (this represents the balance after all transactions)
    if (savedAmount !== finalBalance) {
      saveToStorage(STORAGE_KEYS.VIRTUAL_CARD_AMOUNT, finalBalance)
    }

    // Load saved card style preference
    const savedStyle = loadFromStorage('virtualCardStyle', 'dark')
    setCardStyle(savedStyle)
  }, [])

  // Update balance when transactions change (called from parent)
  useEffect(() => {
    const updateBalance = () => {
      const transactions = loadTransactions()
      const savedInitial = loadFromStorage('virtualCardInitial', 5000) // Store initial balance
      
      // Calculate: initial balance + income - expenses
      let balance = savedInitial
      
      transactions.forEach(t => {
        if (t.type === 'expense') {
          balance -= (t.amount || 0)
        } else if (t.type === 'income') {
          balance += (t.amount || 0)
        }
      })
      
      const newBalance = Math.max(0, balance)
      
      if (Math.abs(newBalance - cardAmount) > 0.01) {
        setCardAmount(newBalance)
        saveToStorage(STORAGE_KEYS.VIRTUAL_CARD_AMOUNT, newBalance)
      }
    }

    // Check for balance updates periodically
    const interval = setInterval(updateBalance, 500)
    return () => clearInterval(interval)
  }, [cardAmount])

  const calculateBalance = (transactions, initialAmount) => {
    let balance = initialAmount > 0 ? initialAmount : 5000
    
    transactions.forEach(t => {
      if (t.type === 'expense') {
        balance -= (t.amount || 0)
      } else if (t.type === 'income') {
        balance += (t.amount || 0)
      }
    })
    
    return Math.max(0, balance)
  }

  const handleSaveAmount = () => {
    const amount = parseFloat(editAmount) || 0
    if (amount >= 0) {
      // Set this as the initial balance
      saveToStorage('virtualCardInitial', amount)
      
      // Recalculate balance from transactions
      const transactions = loadTransactions()
      let balance = amount
      
      transactions.forEach(t => {
        if (t.type === 'expense') {
          balance -= (t.amount || 0)
        } else if (t.type === 'income') {
          balance += (t.amount || 0)
        }
      })
      
      const newBalance = Math.max(0, balance)
      setCardAmount(newBalance)
      saveToStorage(STORAGE_KEYS.VIRTUAL_CARD_AMOUNT, newBalance)
      setIsEditing(false)
      setEditAmount('')
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditAmount('')
  }

  const toggleCardStyle = () => {
    const newStyle = cardStyle === 'dark' ? 'light' : 'dark'
    setCardStyle(newStyle)
    saveToStorage('virtualCardStyle', newStyle)
  }

  const formatCardNumber = () => {
    return '• • • •   • • • •   • • • •   8853'
  }

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount)
  }

  return (
    <div className="virtual-card-container">
      <div className="virtual-card-header">
        <h3>My Cards</h3>
        <button className="card-style-toggle" onClick={toggleCardStyle}>
          {cardStyle === 'dark' ? '🌞' : '🌙'}
        </button>
      </div>
      
      <div className={`virtual-card ${cardStyle}`}>
        <div className="card-top">
          <div className="virtual-badge">
            <span className="star-icon">⭐</span>
            <span>Virtual</span>
          </div>
        </div>
        
        <div className="card-content">
          <div className="card-number">{formatCardNumber()}</div>
          
          <div className="card-details">
            <div className="card-detail-item">
              <div className="card-label-small">EXP</div>
              <div className="card-value-small">08/24</div>
            </div>
            <div className="card-detail-item">
              <div className="card-label-small">CVV</div>
              <div className="card-value-small">• • •</div>
            </div>
          </div>
          
          <div className="card-holder-name">Jane Doe</div>
          
          <div className="card-balance">
            {isEditing ? (
              <div className="balance-edit">
                <input
                  type="number"
                  value={editAmount}
                  onChange={(e) => setEditAmount(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className="balance-input"
                  autoFocus
                />
                <div className="edit-actions">
                  <button onClick={handleSaveAmount} className="save-btn">✓</button>
                  <button onClick={handleCancel} className="cancel-btn">✕</button>
                </div>
              </div>
            ) : (
              <div className="balance-display" onClick={() => setIsEditing(true)}>
                <div className="balance-label">Your Balance</div>
                <div className="balance-amount">{formatAmount(cardAmount)}</div>
              </div>
            )}
          </div>
        </div>
        
        <div className="card-bottom">
          <div className="visa-logo">VISA</div>
        </div>
      </div>

      <div className="virtual-card-disclaimer">
        <p>⚠️ This card displays virtual money only and is not reflective of actual account details.</p>
      </div>
    </div>
  )
}

export default VirtualCard
