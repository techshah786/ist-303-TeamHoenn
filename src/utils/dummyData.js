// Dummy transaction data for October 2024

const generateDummyTransactions = () => {
  const transactions = []
  const categories = ['food', 'groceries', 'transportation', 'entertainment', 'shopping', 'bills', 'dining', 'health', 'education']
  const types = ['expense', 'income']
  const items = {
    'food': ['Pizza', 'Burger', 'Sushi', 'Tacos', 'Pasta', 'Salad', 'Sandwich'],
    'groceries': ['Milk', 'Bread', 'Eggs', 'Chicken', 'Rice', 'Bananas', 'Tomatoes'],
    'transportation': ['Uber Ride', 'Gas', 'Bus Ticket', 'Parking', 'Train Ticket'],
    'entertainment': ['Movie Ticket', 'Concert', 'Netflix', 'Spotify', 'Video Game'],
    'shopping': ['T-Shirt', 'Jeans', 'Shoes', 'Bag', 'Watch', 'Phone Case'],
    'bills': ['Electric Bill', 'Internet', 'Phone Bill', 'Rent', 'Insurance'],
    'dining': ['Restaurant', 'Coffee', 'Brunch', 'Dinner Out', 'Cafe'],
    'health': ['Gym Membership', 'Pharmacy', 'Doctor Visit', 'Vitamins'],
    'education': ['Textbook', 'Online Course', 'School Supplies', 'Tuition']
  }

  // Generate income transactions
  const incomeDates = ['2024-10-01', '2024-10-15']
  incomeDates.forEach(date => {
    transactions.push({
      id: `income-${date}`,
      type: 'income',
      item: 'Salary',
      amount: 2500,
      category: 'income',
      date: date,
      createdAt: date
    })
  })

  // Generate expense transactions for October with realistic amounts
  // Targeting totals: Bills ~$1137, Education ~$1015, Shopping ~$525, Entertainment ~$384, Transportation ~$334
  const categoryTargets = {
    'bills': 1137.23,
    'education': 1015.33,
    'shopping': 524.99,
    'entertainment': 384.10,
    'transportation': 333.86,
    'groceries': 450.00,
    'food': 320.00,
    'dining': 280.00,
    'health': 250.00
  }

  // Generate expenses across October, distributed over the month
  Object.keys(categoryTargets).forEach((category, catIndex) => {
    const target = categoryTargets[category]
    const categoryItems = items[category] || ['Item']
    const numTransactions = category === 'bills' ? 8 : category === 'education' ? 12 : Math.floor(Math.random() * 8) + 4
    const avgAmount = target / numTransactions
    
    // Distribute transactions throughout October
    for (let t = 0; t < numTransactions; t++) {
      const day = Math.floor((t / numTransactions) * 31) + 1
      const date = `2024-10-${String(day).padStart(2, '0')}`
      const item = categoryItems[t % categoryItems.length]
      
      // Vary amount around average (±30%)
      const variance = (Math.random() - 0.5) * 0.6
      const amount = avgAmount * (1 + variance)
      
      transactions.push({
        id: `expense-${category}-${date}-${t}`,
        type: 'expense',
        item: item,
        amount: Math.round(amount * 100) / 100,
        category: category,
        date: date,
        createdAt: date
      })
    }
  })

  // Add some additional random transactions throughout October
  for (let day = 1; day <= 31; day++) {
    const date = `2024-10-${String(day).padStart(2, '0')}`
    // Add 1-2 random small transactions per day
    const numExtra = Math.random() > 0.7 ? 2 : 1
    
    for (let i = 0; i < numExtra; i++) {
      const category = categories[Math.floor(Math.random() * categories.length)]
      const categoryItems = items[category] || ['Item']
      const item = categoryItems[Math.floor(Math.random() * categoryItems.length)]
      
      let amount
      switch(category) {
        case 'groceries':
          amount = Math.random() * 40 + 10
          break
        case 'food':
        case 'dining':
          amount = Math.random() * 30 + 8
          break
        case 'transportation':
          amount = Math.random() * 25 + 5
          break
        case 'entertainment':
          amount = Math.random() * 20 + 10
          break
        case 'shopping':
          amount = Math.random() * 60 + 15
          break
        case 'health':
          amount = Math.random() * 40 + 10
          break
        default:
          amount = Math.random() * 30 + 8
      }

      transactions.push({
        id: `expense-random-${date}-${i}`,
        type: 'expense',
        item: item,
        amount: Math.round(amount * 100) / 100,
        category: category,
        date: date,
        createdAt: date
      })
    }
  }

  return transactions.sort((a, b) => new Date(a.date) - new Date(b.date))
}

// Dummy shopping list items
const generateDummyShoppingList = () => {
  return [
    { id: '1', name: 'Milk', estimatedPrice: 4.50, checked: false, addedAt: '2024-10-15' },
    { id: '2', name: 'Bread', estimatedPrice: 3.25, checked: true, addedAt: '2024-10-14' },
    { id: '3', name: 'Chicken', estimatedPrice: 12.99, checked: true, addedAt: '2024-10-13' },
    { id: '4', name: 'Bananas', estimatedPrice: 2.50, checked: false, addedAt: '2024-10-16' },
    { id: '5', name: 'Rice', estimatedPrice: 5.99, checked: true, addedAt: '2024-10-12' },
    { id: '6', name: 'Shirt', estimatedPrice: 24.99, checked: false, addedAt: '2024-10-17' },
    { id: '7', name: 'Shoes', estimatedPrice: 59.99, checked: false, addedAt: '2024-10-17' },
    { id: '8', name: 'Phone Case', estimatedPrice: 15.99, checked: true, addedAt: '2024-10-11' }
  ]
}

// Initialize dummy data
export const initializeDummyData = () => {
  // Clear all existing transactions to start fresh
  localStorage.removeItem('transactions')
  console.log('✅ Cleared all transactions. You can now add your own transactions.')
  
  // Initialize shopping list if empty
  const existingShoppingList = localStorage.getItem('shoppingList')
  if (!existingShoppingList || JSON.parse(existingShoppingList).length === 0) {
    const dummyShoppingList = generateDummyShoppingList()
    localStorage.setItem('shoppingList', JSON.stringify(dummyShoppingList))
  }

  // Set budget if not set
  const existingBudget = localStorage.getItem('budgetSettings')
  if (!existingBudget) {
    localStorage.setItem('budgetSettings', JSON.stringify({
      weekly: 500,
      monthly: 2000,
      currentPeriod: 'monthly'
    }))
  }
}

export { generateDummyTransactions, generateDummyShoppingList }

