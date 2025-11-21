import React, { useState } from 'react'
import { getCategory } from '../utils/couponSearch'
import './TransactionForm.css'

const CATEGORIES = [
  'dairy', 'meat', 'produce', 'beverages', 'bakery', 'pantry',
  'frozen', 'snacks', 'clothing', 'shoes', 'accessories',
  'electronics', 'home', 'personal care', 'sports', 'books',
  'transportation', 'utilities', 'entertainment', 'dining out',
  'education', 'health', 'general'
]

const TRANSACTION_TYPES = [
  { value: 'expense', label: '💰 Expense' },
  { value: 'income', label: '💵 Income' }
]

function TransactionForm({ onAddTransaction, onCancel }) {
  const [formData, setFormData] = useState({
    item: '',
    category: 'general',
    amount: '',
    price: '',
    quantity: '1',
    description: '',
    type: 'expense',
    date: new Date().toISOString().split('T')[0]
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => {
      const updated = { ...prev, [name]: value }
      
      // Auto-detect category if item name changes
      if (name === 'item' && value) {
        updated.category = getCategory(value)
      }
      
      // Calculate amount if price and quantity change
      if ((name === 'price' || name === 'quantity') && updated.price && updated.quantity) {
        updated.amount = (parseFloat(updated.price) * parseFloat(updated.quantity)).toFixed(2)
      }
      
      return updated
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // For income: only amount is required (no item, category, price, quantity)
    // For expense: item, category, amount, price, quantity are used
    const transaction = {
      id: Date.now().toString(),
      item: formData.type === 'income' ? 'Income' : (formData.item || 'Transaction'),
      category: formData.type === 'income' ? 'income' : formData.category,
      amount: parseFloat(formData.amount) || parseFloat(formData.price) || 0,
      price: formData.type === 'income' ? 0 : (parseFloat(formData.price) || parseFloat(formData.amount) || 0),
      quantity: formData.type === 'income' ? 1 : (parseFloat(formData.quantity) || 1),
      description: formData.description || (formData.type === 'income' ? 'Income' : formData.item),
      type: formData.type,
      date: formData.date || new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    }

    if (transaction.amount <= 0) {
      alert('Please enter a valid amount')
      return
    }

    onAddTransaction(transaction)
    
    // Reset form
    setFormData({
      item: '',
      category: 'general',
      amount: '',
      price: '',
      quantity: '1',
      description: '',
      type: formData.type, // Keep the same type
      date: new Date().toISOString().split('T')[0]
    })
    
    if (onCancel) {
      onCancel()
    }
  }

  return (
    <div className="transaction-form">
      <h3>Add Transaction</h3>
      
      {/* Transaction Type Tabs */}
      <div className="transaction-type-tabs">
        <button
          type="button"
          className={`type-tab ${formData.type === 'expense' ? 'active' : ''} expense-tab`}
          onClick={() => setFormData(prev => ({ ...prev, type: 'expense' }))}
        >
          <span className="tab-icon">💰</span>
          <span className="tab-label">Expense</span>
        </button>
        <button
          type="button"
          className={`type-tab ${formData.type === 'income' ? 'active' : ''} income-tab`}
          onClick={() => setFormData(prev => ({ ...prev, type: 'income' }))}
        >
          <span className="tab-icon">📈</span>
          <span className="tab-label">Income</span>
        </button>
      </div>
      
      <form onSubmit={handleSubmit}>
        {/* Date field - always shown */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="date">Date *</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Income form: Only date, amount, and description */}
        {formData.type === 'income' ? (
          <>
            <div className="form-group">
              <label htmlFor="amount">Amount *</label>
              <div className="input-with-symbol">
                <span className="symbol">$</span>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="e.g., Salary, Freelance work, Gift..."
                rows="3"
              />
            </div>
          </>
        ) : (
          /* Expense form: All fields */
          <>
            <div className="form-group">
              <label htmlFor="item">Item Name *</label>
              <input
                type="text"
                id="item"
                name="item"
                value={formData.item}
                onChange={handleChange}
                required
                placeholder="e.g., Milk, Shirt, Gas"
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1).replace(/([A-Z])/g, ' $1')}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="price">Price (per unit) *</label>
                <div className="input-with-symbol">
                  <span className="symbol">$</span>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="quantity">Quantity</label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  min="1"
                  step="1"
                />
              </div>

              <div className="form-group">
                <label htmlFor="amount">Total Amount *</label>
                <div className="input-with-symbol">
                  <span className="symbol">$</span>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    value={formData.amount || (formData.price && formData.quantity ? (formData.price * formData.quantity).toFixed(2) : '')}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Additional details..."
                rows="3"
              />
            </div>
          </>
        )}

        <div className="form-actions">
          {onCancel && (
            <button type="button" className="cancel-btn" onClick={onCancel}>
              Cancel
            </button>
          )}
          <button type="submit" className="submit-btn">
            Add Transaction
          </button>
        </div>
      </form>
    </div>
  )
}

export default TransactionForm

