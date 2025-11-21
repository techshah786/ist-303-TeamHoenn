import React, { useState, useEffect } from 'react'
import TransactionForm from '../components/TransactionForm'
import { loadTransactions, deleteTransaction, addTransaction } from '../utils/transactions'
import './Transactions.css'

function Transactions() {
  const [transactions, setTransactions] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState('all') // all, income, expense

  useEffect(() => {
    const loaded = loadTransactions()
    setTransactions(loaded)
  }, [])

  const handleAddTransaction = (transaction) => {
    const updated = addTransaction(transaction)
    setTransactions(updated)
    setShowForm(false)
    // Trigger event for other components to update
    window.dispatchEvent(new Event('transactionAdded'))
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      const updated = deleteTransaction(id)
      setTransactions(updated)
    }
  }

  const filteredTransactions = filter === 'all' 
    ? transactions 
    : transactions.filter(t => t.type === filter)

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="transactions-page">
      <div className="transactions-header">
        <h1>Transactions</h1>
        <div className="header-actions">
          <div className="filter-buttons">
            <button
              className={filter === 'all' ? 'active' : ''}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button
              className={filter === 'income' ? 'active' : ''}
              onClick={() => setFilter('income')}
            >
              💵 Income
            </button>
            <button
              className={filter === 'expense' ? 'active' : ''}
              onClick={() => setFilter('expense')}
            >
              💸 Expense
            </button>
          </div>
          <div className="action-buttons">
            <button
              className="action-btn primary"
              onClick={() => {
                setShowForm(!showForm)
              }}
            >
              + Add Transaction
            </button>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="form-container">
          <TransactionForm
            onAddTransaction={handleAddTransaction}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      <div className="transactions-list">
        {filteredTransactions.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>No transactions yet</h3>
            <p>Add your first transaction to get started!</p>
          </div>
        ) : (
          filteredTransactions.map(transaction => (
            <div
              key={transaction.id}
              className={`transaction-item ${transaction.type}`}
            >
              <div className="transaction-icon">
                {transaction.type === 'income' ? '💵' : '💸'}
              </div>
              <div className="transaction-details">
                <div className="transaction-main">
                  <h4>{transaction.item}</h4>
                  <span className={`transaction-amount ${transaction.type}`}>
                    {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                  </span>
                </div>
                <div className="transaction-meta">
                  <span className="transaction-category">
                    {transaction.category?.charAt(0).toUpperCase() + transaction.category?.slice(1)}
                  </span>
                  <span className="transaction-date">
                    {formatDate(transaction.date || transaction.createdAt)}
                  </span>
                </div>
                {transaction.description && (
                  <p className="transaction-description">{transaction.description}</p>
                )}
              </div>
              <button
                className="delete-btn"
                onClick={() => handleDelete(transaction.id)}
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

export default Transactions

