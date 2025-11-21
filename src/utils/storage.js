// Utility functions for local storage

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

export const STORAGE_KEYS = {
  PANTRY_ITEMS: 'pantry_items',
  BUDGET_SETTINGS: 'budget_settings',
  SHOPPING_LIST: 'shopping_list',
  COUPON_PREFERENCES: 'coupon_preferences',
  NOTIFICATIONS: 'notifications',
  VIRTUAL_CARD_AMOUNT: 'virtualCardAmount'
}
