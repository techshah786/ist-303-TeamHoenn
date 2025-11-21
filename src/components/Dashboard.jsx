import React, { useMemo, useEffect, useState } from 'react'
import { getCategory } from '../utils/couponSearch'
import { loadTransactions } from '../utils/transactions'
import './Dashboard.css'

function Dashboard({ shoppingList, budget, budgetPeriod }) {
  const [transactions, setTransactions] = useState([])

  useEffect(() => {
    // Load transactions for more accurate spending tracking
    const loaded = loadTransactions()
    setTransactions(loaded)
  }, [])
  const stats = useMemo(() => {
    // Calculate from both shopping list and transactions
    const shoppingListSpent = shoppingList.reduce((sum, item) => {
      return item.checked ? sum + (item.estimatedPrice || 0) : sum
    }, 0)
    
    // Get expenses from transactions
    const transactionExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + (t.amount || 0), 0)
    
    const totalSpent = shoppingListSpent + transactionExpenses
    
    const remaining = budget - totalSpent
    const spendingPercentage = budget > 0 ? (totalSpent / budget) * 100 : 0
    
    // Category breakdown - include both shopping list and transactions
    const categorySpending = {}
    
    // From shopping list
    shoppingList.forEach(item => {
      if (item.checked) {
        const category = getCategory(item.name)
        categorySpending[category] = (categorySpending[category] || 0) + (item.estimatedPrice || 0)
      }
    })
    
    // From transactions
    transactions.forEach(t => {
      if (t.type === 'expense') {
        const category = t.category || getCategory(t.item) || 'general'
        categorySpending[category] = (categorySpending[category] || 0) + (t.amount || 0)
      }
    })
    
    // Top categories
    const topSpentCategories = Object.entries(categorySpending)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
    
    const checkedCount = shoppingList.filter(item => item.checked).length
    const totalItems = shoppingList.length
    
    return {
      totalSpent,
      remaining,
      spendingPercentage: Math.min(spendingPercentage, 100),
      categorySpending,
      topSpentCategories,
      checkedCount,
      totalItems,
      isOverBudget: remaining < 0
    }
  }, [shoppingList, budget, transactions])
  
  const categoryColors = {
    // Food
    'dairy': '#10b981',
    'meat': '#ef4444',
    'produce': '#22c55e',
    'beverages': '#3b82f6',
    'bakery': '#f59e0b',
    'pantry': '#8b5cf6',
    'frozen': '#06b6d4',
    'snacks': '#ec4899',
    'deli': '#14b8a6',
    'seafood': '#0ea5e9',
    // Clothing
    'clothing': '#ec4899',
    'shoes': '#8b5cf6',
    'accessories': '#f59e0b',
    'underwear': '#a78bfa',
    'outerwear': '#6366f1',
    // Electronics & Home
    'electronics': '#3b82f6',
    'home': '#14b8a6',
    'kitchen': '#f97316',
    'personal care': '#ec4899',
    'sports': '#10b981',
    'toys': '#f59e0b',
    'books': '#8b5cf6',
    'automotive': '#64748b',
    'pet': '#22c55e',
    'general': '#64748b'
  }
  
  const getCategoryColor = (category) => {
    return categoryColors[category] || '#64748b'
  }
  
  const formatCategoryName = (name) => {
    return name.charAt(0).toUpperCase() + name.slice(1)
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h3>Budget Dashboard</h3>
        <span className="period-badge">
          {budgetPeriod === 'weekly' ? '📅 Weekly' : '📅 Monthly'}
        </span>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card">
          <div className="card-icon budget-icon">💰</div>
          <div className="card-content">
            <div className="card-label">Total Budget</div>
            <div className="card-value">${budget.toFixed(2)}</div>
          </div>
        </div>
        
        <div className="summary-card">
          <div className="card-icon spent-icon">💸</div>
          <div className="card-content">
            <div className="card-label">Spent</div>
            <div className={`card-value ${stats.isOverBudget ? 'over-budget' : ''}`}>
              ${stats.totalSpent.toFixed(2)}
            </div>
            <div className="card-subtext">{stats.checkedCount} items purchased</div>
          </div>
        </div>
        
        <div className="summary-card">
          <div className="card-icon remaining-icon">💵</div>
          <div className="card-content">
            <div className="card-label">Remaining</div>
            <div className={`card-value ${stats.isOverBudget ? 'over-budget' : ''}`}>
              ${stats.remaining.toFixed(2)}
            </div>
            <div className="card-subtext">
              {stats.remaining >= 0 ? `${((stats.remaining / budget) * 100).toFixed(1)}% left` : 'Over budget'}
            </div>
          </div>
        </div>
        
        <div className="summary-card">
          <div className="card-icon items-icon">📋</div>
          <div className="card-content">
            <div className="card-label">Items Purchased</div>
            <div className="card-value">{stats.checkedCount}</div>
            <div className="card-subtext">{stats.totalItems} total items in list</div>
          </div>
        </div>
      </div>

      {/* Budget Progress Visualizations */}
      <div className="dashboard-section">
        <h4>Budget Progress</h4>
        <div className="progress-container">
          <div className="progress-item">
            <div className="progress-header">
              <span>Spent</span>
              <span>{stats.spendingPercentage.toFixed(1)}%</span>
            </div>
            <div className="progress-bar">
              <div 
                className={`progress-fill spent ${stats.isOverBudget ? 'over' : ''}`}
                style={{ width: `${Math.min(stats.spendingPercentage, 100)}%` }}
              />
            </div>
            <div className="progress-amounts">
              <span>${stats.totalSpent.toFixed(2)} / ${budget.toFixed(2)}</span>
            </div>
          </div>
          
        </div>
      </div>

      {/* Spending Breakdown by Category */}
      {stats.topSpentCategories.length > 0 && (
        <div className="dashboard-section">
          <h4>Spending by Category</h4>
          <div className="category-breakdown">
            {stats.topSpentCategories.map(([category, amount]) => {
              const percentage = stats.totalSpent > 0 ? (amount / stats.totalSpent) * 100 : 0
              return (
                <div key={category} className="category-item">
                  <div className="category-header">
                    <div className="category-info">
                      <div 
                        className="category-color-dot"
                        style={{ backgroundColor: getCategoryColor(category) }}
                      />
                      <span className="category-name">{formatCategoryName(category)}</span>
                    </div>
                    <div className="category-amount">${amount.toFixed(2)}</div>
                  </div>
                  <div className="category-bar">
                    <div 
                      className="category-bar-fill"
                      style={{ 
                        width: `${percentage}%`,
                        backgroundColor: getCategoryColor(category)
                      }}
                    />
                  </div>
                  <div className="category-percentage">{percentage.toFixed(1)}%</div>
                </div>
              )
            })}
          </div>
        </div>
      )}


      {/* Empty State */}
      {stats.totalItems === 0 && (
        <div className="dashboard-section">
          <div className="empty-dashboard">
            <div className="empty-icon">📊</div>
            <h4>No Spending Data Yet</h4>
            <p>Add items to your shopping list to see detailed budget visualizations</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard

