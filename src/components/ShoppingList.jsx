import React, { useState } from 'react'
import './ShoppingList.css'

function ShoppingList({ items, budget, onUpdate, preferences }) {
  const [itemName, setItemName] = useState('')
  const [estimatedPrice, setEstimatedPrice] = useState('')

  const handleAdd = () => {
    if (!itemName.trim()) {
      alert('Please enter an item name')
      return
    }
    const newItem = {
      id: Date.now().toString(),
      name: itemName,
      estimatedPrice: parseFloat(estimatedPrice) || 0,
      checked: false,
      addedAt: new Date().toISOString()
    }
    onUpdate([...items, newItem])
    setItemName('')
    setEstimatedPrice('')
  }

  const handleToggle = (id) => {
    onUpdate(items.map(item =>
      item.id === id ? { ...item, checked: !item.checked } : item
    ))
  }

  const handleDelete = (id) => {
    onUpdate(items.filter(item => item.id !== id))
  }

  const handlePriceUpdate = (id, newPrice) => {
    onUpdate(items.map(item =>
      item.id === id ? { ...item, estimatedPrice: parseFloat(newPrice) || 0 } : item
    ))
  }

  const totalSpent = items.filter(item => item.checked).reduce((sum, item) => sum + (item.estimatedPrice || 0), 0)
  const remaining = budget - totalSpent
  const isOverBudget = remaining < 0

  return (
    <div className="shopping-list">
      <div className="shopping-list-header">
        <h3>Shopping List</h3>
        <div className="budget-info">
          <div className="budget-item">
            <span>Budget:</span>
            <span className="budget-value">${budget.toFixed(2)}</span>
          </div>
          <div className="budget-item">
            <span>Spent:</span>
            <span className={`budget-value ${isOverBudget ? 'over-budget' : ''}`}>
              ${totalSpent.toFixed(2)}
            </span>
          </div>
          <div className="budget-item">
            <span>Remaining:</span>
            <span className={`budget-value ${isOverBudget ? 'over-budget' : ''}`}>
              ${remaining.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <div className="add-item-form">
        <input
          type="text"
          placeholder="Item name (e.g., Milk, Shirt, Phone, Bag)"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
          className="item-input"
        />
        <input
          type="number"
          placeholder="Est. Price ($)"
          value={estimatedPrice}
          onChange={(e) => setEstimatedPrice(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
          className="price-input"
          step="0.01"
          min="0"
        />
        <button onClick={handleAdd} className="btn-add-item">
          Add
        </button>
      </div>

      {isOverBudget && (
        <div className="over-budget-alert">
          ⚠️ You're over budget! Consider using coupons or removing some items.
        </div>
      )}

      <div className="items-list">
        {items.length === 0 ? (
          <div className="empty-list">
            <p>Your shopping list is empty. Add items to get started!</p>
          </div>
        ) : (
          items.map(item => (
            <div key={item.id} className={`list-item ${item.checked ? 'checked' : ''}`}>
              <input
                type="checkbox"
                checked={item.checked}
                onChange={() => handleToggle(item.id)}
                className="item-checkbox"
              />
              <div className="item-details">
                <span className="item-name">{item.name}</span>
                <input
                  type="number"
                  value={item.estimatedPrice || ''}
                  onChange={(e) => handlePriceUpdate(item.id, e.target.value)}
                  placeholder="Price"
                  className="item-price-input"
                  step="0.01"
                  min="0"
                />
                <span className="item-price">${(item.estimatedPrice || 0).toFixed(2)}</span>
              </div>
              <button
                onClick={() => handleDelete(item.id)}
                className="btn-delete-item"
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default ShoppingList

