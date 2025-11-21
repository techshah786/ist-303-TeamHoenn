// Transaction storage utilities

const STORAGE_KEY = 'transactions'

export const saveTransactions = (transactions) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions))
  } catch (error) {
    console.error('Error saving transactions:', error)
  }
}

export const loadTransactions = () => {
  try {
    const transactions = localStorage.getItem(STORAGE_KEY)
    return transactions ? JSON.parse(transactions) : []
  } catch (error) {
    console.error('Error loading transactions:', error)
    return []
  }
}

export const addTransaction = (transaction) => {
  const transactions = loadTransactions()
  transactions.push(transaction)
  saveTransactions(transactions)
  return transactions
}

export const addMultipleTransactions = (newTransactions) => {
  const transactions = loadTransactions()
  transactions.push(...newTransactions)
  saveTransactions(transactions)
  return transactions
}

export const deleteTransaction = (id) => {
  const transactions = loadTransactions()
  const filtered = transactions.filter(t => t.id !== id)
  saveTransactions(filtered)
  return filtered
}

export const updateTransaction = (id, updates) => {
  const transactions = loadTransactions()
  const updated = transactions.map(t => 
    t.id === id ? { ...t, ...updates } : t
  )
  saveTransactions(updated)
  return updated
}

export const getTransactionsByDateRange = (startDate, endDate) => {
  const transactions = loadTransactions()
  return transactions.filter(t => {
    const tDate = new Date(t.date || t.createdAt)
    return tDate >= new Date(startDate) && tDate <= new Date(endDate)
  })
}

export const getTransactionsByCategory = (category) => {
  const transactions = loadTransactions()
  return transactions.filter(t => t.category === category)
}

export const getTransactionsByType = (type) => {
  const transactions = loadTransactions()
  return transactions.filter(t => t.type === type)
}

