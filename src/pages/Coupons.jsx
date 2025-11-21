import React, { useState, useEffect } from 'react'
import { getCategory } from '../utils/couponSearch'
import { searchCouponsAPI, checkAPIAvailability } from '../utils/couponAPI'
import { searchCouponsByCategory, estimateItemPrice } from '../utils/couponSearch' // Fallback
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from '../utils/storage'
import './Coupons.css'

function Coupons() {
  const [searchItem, setSearchItem] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [apiAvailable, setApiAvailable] = useState(false)
  const [preferences, setPreferences] = useState(() => {
    const saved = loadFromStorage(STORAGE_KEYS.COUPON_PREFERENCES, {
      preference: 'cheapest',
      general: true,
      storeSpecific: []
    })
    return saved
  })

  // Check if API is available on mount
  useEffect(() => {
    checkAPIAvailability().then(available => {
      setApiAvailable(available)
      if (available) {
        console.log('✅ Backend API is available - using real web scraping')
      } else {
        console.log('⚠️ Backend API not available - using mock data')
      }
    })
  }, [])

  const handleSearch = async () => {
    if (!searchItem.trim()) {
      alert('Please enter an item to search')
      return
    }

    setLoading(true)
    setSearchResults([])

    try {
      let results

      if (apiAvailable) {
        // Use real API scraping
        console.log('🔍 Using backend API for real coupon scraping...')
        const apiResponse = await searchCouponsAPI(searchItem, preferences)
        
        if (apiResponse.success && apiResponse.coupons && apiResponse.coupons.length > 0) {
          const category = getCategory(searchItem)
          results = {
            itemName: apiResponse.itemName,
            category: category,
            originalPrice: apiResponse.estimatedPrice,
            hasCoupons: true,
            coupons: apiResponse.coupons.map(coupon => ({
              ...coupon,
              discountedPrice: coupon.discountedPrice || (apiResponse.estimatedPrice * (1 - coupon.discount / 100))
            }))
          }
        } else {
          // No coupons found from API, show alternative
          const category = getCategory(searchItem)
          const estimatedPrice = apiResponse.estimatedPrice || estimateItemPrice(searchItem, category)
          const cheapestOption = estimatedPrice * 0.85
          const brandSale = estimatedPrice * 0.92
          
          results = {
            itemName: searchItem,
            category: category,
            originalPrice: estimatedPrice,
            hasCoupons: false,
            alternative: preferences.preference === 'cheapest' ? {
              type: 'cheapest',
              price: cheapestOption,
              discount: 15,
              source: 'Generic Brand (Cheapest)',
              category: category
            } : {
              type: 'sale',
              price: brandSale,
              discount: 8,
              source: 'Brand Sale',
              category: category
            }
          }
        }
      } else {
        // Fallback to mock data
        console.log('📦 Using mock data (backend API not available)')
        const category = getCategory(searchItem)
        const estimatedPrice = estimateItemPrice(searchItem, category)
        const foundCoupons = searchCouponsByCategory(searchItem, preferences || {})
        
        results = {
          itemName: searchItem,
          category: category,
          originalPrice: estimatedPrice,
          hasCoupons: foundCoupons && foundCoupons.length > 0,
          coupons: foundCoupons || []
        }

        if (!foundCoupons || foundCoupons.length === 0) {
          const cheapestOption = estimatedPrice * 0.85
          const brandSale = estimatedPrice * 0.92
          
          results.alternative = preferences.preference === 'cheapest' ? {
            type: 'cheapest',
            price: cheapestOption,
            discount: 15,
            source: 'Generic Brand (Cheapest)',
            category: category
          } : {
            type: 'sale',
            price: brandSale,
            discount: 8,
            source: 'Brand Sale',
            category: category
          }
        } else {
          results.coupons = foundCoupons.map(coupon => ({
            ...coupon,
            discountedPrice: estimatedPrice * (1 - coupon.discount / 100)
          }))
        }
      }

      setSearchResults([results])
    } catch (error) {
      console.error('Error searching coupons:', error)
      alert('Error searching for coupons. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const handlePreferenceChange = (e) => {
    const { name, value, type, checked } = e.target
    const updated = {
      ...preferences,
      [name]: type === 'checkbox' ? checked : value
    }
    setPreferences(updated)
    saveToStorage(STORAGE_KEYS.COUPON_PREFERENCES, updated)
  }

  const handleStoreAdd = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      const updated = {
        ...preferences,
        storeSpecific: [...preferences.storeSpecific, e.target.value.trim()]
      }
      setPreferences(updated)
      saveToStorage(STORAGE_KEYS.COUPON_PREFERENCES, updated)
      e.target.value = ''
    }
  }

  const handleStoreRemove = (store) => {
    const updated = {
      ...preferences,
      storeSpecific: preferences.storeSpecific.filter(s => s !== store)
    }
    setPreferences(updated)
    saveToStorage(STORAGE_KEYS.COUPON_PREFERENCES, updated)
  }

  return (
    <div className="coupons-page">
      <div className="coupons-header">
        <h1>Coupon Finder</h1>
        <p>Search for coupons and deals on any item</p>
        <div className="info-banner" style={{ marginTop: '1rem', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.85rem', 
          background: apiAvailable ? '#D1FAE5' : '#FEF3C7', 
          border: `1px solid ${apiAvailable ? '#10B981' : '#F59E0B'}`, 
          color: apiAvailable ? '#065F46' : '#92400E' }}>
          {apiAvailable ? (
            <>
              <strong>✅ Real Web Scraping Active:</strong> Using backend API to scrape real coupons from RetailMeNot, Honey, and Google Shopping.
            </>
          ) : (
            <>
              {/* <strong>⚠️ Mock Data Mode:</strong> Backend API not available. Start the server with <code>npm run dev:server</code> for real web scraping. */}
            </>
          )}
        </div>
      </div>

      {/* Search Section */}
      <div className="search-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Enter item name (e.g., Milk, Bread, Headphones)..."
            value={searchItem}
            onChange={(e) => setSearchItem(e.target.value)}
            onKeyPress={handleKeyPress}
            className="search-input"
          />
          <button onClick={handleSearch} className="search-btn" disabled={loading}>
            {loading ? '🔍 Searching...' : '🔍 Search Coupons'}
          </button>
        </div>
      </div>

      {/* Preferences Section */}
      <div className="preferences-section">
        <h3>Search Preferences</h3>
        <div className="preferences-grid">
          <div className="preference-group">
            <label>When no coupons available:</label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="preference"
                  value="cheapest"
                  checked={preferences.preference === 'cheapest'}
                  onChange={handlePreferenceChange}
                />
                <span>Show Cheapest Option</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="preference"
                  value="sales"
                  checked={preferences.preference === 'sales'}
                  onChange={handlePreferenceChange}
                />
                <span>Show Brand Sales</span>
              </label>
            </div>
          </div>

          <div className="preference-group">
            <label>
              <input
                type="checkbox"
                name="general"
                checked={preferences.general}
                onChange={handlePreferenceChange}
              />
              <span>Include General Coupons</span>
            </label>
          </div>

          <div className="preference-group">
            <label>Store-Specific (optional)</label>
            <input
              type="text"
              placeholder="Enter store name and press Enter"
              onKeyPress={handleStoreAdd}
              className="store-input"
            />
            {preferences.storeSpecific.length > 0 && (
              <div className="store-tags">
                {preferences.storeSpecific.map((store, index) => (
                  <span key={index} className="store-tag">
                    {store}
                    <button onClick={() => handleStoreRemove(store)}>×</button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Results Section */}
      {loading && (
        <div className="loading-state">
          <div className="loading-spinner">🔍</div>
          <p>Searching for coupons...</p>
        </div>
      )}

      {!loading && searchResults.length > 0 && (
        <div className="results-section">
          <h2>Search Results</h2>
          {searchResults.map((result, index) => (
            <div key={index} className="coupon-result">
              <div className="result-header">
                <div className="result-title">
                  <h3>{result.itemName}</h3>
                  <span className="category-badge">Category: {result.category}</span>
                </div>
              </div>
              
              {result.hasCoupons && result.coupons && result.coupons.length > 0 ? (
                <div className="coupons-list">
                  {result.coupons.map((coupon, couponIndex) => (
                    <div key={couponIndex} className={`coupon-item ${coupon.type}`}>
                      <div className="coupon-header">
                        <span className={`coupon-type-badge ${coupon.type}`}>
                          {coupon.type === 'store-banner' ? '🏪 Store Banner' : '🌐 Website Coupon'}
                        </span>
                        <span className="discount-badge">{coupon.discount}% OFF</span>
                      </div>
                      <div className="coupon-title">{coupon.title}</div>
                      <div className="coupon-store">
                        <strong>{coupon.storeInfo.name}</strong>
                      </div>
                      {coupon.storeInfo.isPhysical && coupon.storeInfo.sampleAddress && (
                        <div className="store-address-info">
                          <span className="address-icon">📍</span>
                          <span className="address-text">{coupon.storeInfo.sampleAddress}</span>
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(coupon.storeInfo.name)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="address-link"
                          >
                            Find Nearest →
                          </a>
                        </div>
                      )}
                      <div className="price-comparison">
                        <span className="original-price">Est. Original: ${result.originalPrice.toFixed(2)}</span>
                        <span className="arrow">→</span>
                        <span className="discounted-price">${(coupon.discountedPrice || (result.originalPrice * (1 - coupon.discount / 100))).toFixed(2)}</span>
                      </div>
                      <div className="savings">
                        Save ${((result.originalPrice - (coupon.discountedPrice || (result.originalPrice * (1 - coupon.discount / 100))))).toFixed(2)} ({coupon.discount}% off)
                      </div>
                      {coupon.code && (
                        <div className="coupon-code">
                          <strong>Code:</strong> <span className="code-text">{coupon.code}</span>
                        </div>
                      )}
                      <div className="coupon-actions">
                        <a 
                          href={coupon.productLink || coupon.storeInfo.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="product-link-btn"
                        >
                          🛒 Shop Product →
                        </a>
                        {coupon.storeInfo.website && coupon.productLink && coupon.productLink !== coupon.storeInfo.website && (
                          <a 
                            href={coupon.storeInfo.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="store-link-btn"
                          >
                            Visit Store Website →
                          </a>
                        )}
                      </div>
                      <div className="coupon-expiry">
                        Valid until: {new Date(coupon.validUntil).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : result.alternative ? (
                <div className="alternative-offer">
                  <div className="coupon-header">
                    <span className={`coupon-type-badge ${result.alternative.type}`}>
                      {result.alternative.type === 'cheapest' ? '💵 Cheapest Option' : '🏷️ Brand Sale'}
                    </span>
                  </div>
                  <div className="price-comparison">
                    <span className="original-price">Est. Original: ${result.originalPrice.toFixed(2)}</span>
                    <span className="arrow">→</span>
                    <span className="discounted-price">${result.alternative.price.toFixed(2)}</span>
                  </div>
                  <div className="savings">
                    Save ${(result.originalPrice - result.alternative.price).toFixed(2)} ({result.alternative.discount}% off)
                  </div>
                  <div className="source">Source: {result.alternative.source}</div>
                </div>
              ) : (
                <div className="no-coupons-found">
                  No coupons found for this item. Try searching with a different name or category.
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {!loading && searchResults.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🎟️</div>
          <h3>Start Searching for Coupons</h3>
          <p>Enter an item name above to find available coupons and deals</p>
          <div className="info-note" style={{ marginTop: '1rem', padding: '1rem', background: '#EFF6FF', border: '1px solid #93C5FD', borderRadius: '8px', fontSize: '0.9rem', color: '#1E40AF' }}>
            <strong>ℹ️ Note:</strong> This demo uses realistic mock data. For real-time coupon scraping, a backend service with coupon/deal APIs (like RetailMeNot, Honey, or Rakuten) would be required. Real web scraping requires server infrastructure and may have rate limits or require API keys.
          </div>
        </div>
      )}
    </div>
  )
}

export default Coupons

