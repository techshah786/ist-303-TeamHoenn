// Authentication utilities
// Default users for demo purposes

export const DEFAULT_USERS = {
  admin: {
    username: 'admin',
    email: 'admin@budgetapp.com',
    password: 'admin123',
    role: 'admin',
    createdAt: new Date().toISOString()
  },
  user: {
    username: 'user',
    email: 'user@budgetapp.com',
    password: 'user123',
    role: 'user',
    createdAt: new Date().toISOString()
  }
}

export const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.error('Error saving to storage:', error)
  }
}

export const loadFromStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error('Error loading from storage:', error)
    return defaultValue
  }
}

export const initializeUsers = () => {
  const users = loadFromStorage('users', {})
  // Add default users if they don't exist
  if (!users[DEFAULT_USERS.admin.username]) {
    users[DEFAULT_USERS.admin.username] = DEFAULT_USERS.admin
  }
  if (!users[DEFAULT_USERS.user.username]) {
    users[DEFAULT_USERS.user.username] = DEFAULT_USERS.user
  }
  saveToStorage('users', users)
  return users
}

export const registerUser = (username, email, password) => {
  const users = loadFromStorage('users', {})
  
  if (users[username]) {
    return { success: false, error: 'Username already exists' }
  }
  
  const newUser = {
    username,
    email,
    password, // In production, hash this
    role: 'user',
    createdAt: new Date().toISOString()
  }
  
  users[username] = newUser
  saveToStorage('users', users)
  return { success: true, user: newUser }
}

export const loginUser = (username, password) => {
  const users = loadFromStorage('users', {})
  initializeUsers() // Ensure defaults exist
  
  const user = users[username]
  
  if (!user) {
    return { success: false, error: 'User not found' }
  }
  
  if (user.password !== password) {
    return { success: false, error: 'Incorrect password' }
  }
  
  // Create session
  const session = {
    username: user.username,
    email: user.email,
    role: user.role,
    loggedInAt: new Date().toISOString()
  }
  
  saveToStorage('currentUser', session)
  return { success: true, user: session }
}

export const logoutUser = () => {
  localStorage.removeItem('currentUser')
}

export const getCurrentUser = () => {
  return loadFromStorage('currentUser', null)
}

export const isAuthenticated = () => {
  return getCurrentUser() !== null
}

