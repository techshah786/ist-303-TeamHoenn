// API client for backend coupon scraping service

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

export async function searchCouponsAPI(itemName, preferences = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}/coupons/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        itemName: itemName.trim(),
        preferences
      })
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error calling coupon API:', error)
    // Fallback to mock data if API fails
    return {
      success: false,
      itemName: itemName.trim(),
      estimatedPrice: 50,
      coupons: [],
      count: 0,
      error: error.message
    }
  }
}

export async function searchMultipleCouponsAPI(items, preferences = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}/coupons/search/multiple`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: items.map(item => item.trim()),
        preferences
      })
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error calling multiple coupons API:', error)
    return {
      success: false,
      results: [],
      totalCount: 0,
      error: error.message
    }
  }
}

// Check if API server is available
export async function checkAPIAvailability() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    return response.ok
  } catch (error) {
    return false
  }
}

