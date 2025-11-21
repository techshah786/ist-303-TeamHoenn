import React, { useState, useEffect } from 'react'
import { searchCouponsByCategory, getCategory } from '../utils/couponSearch'
import './CouponFinder.css'

function CouponFinder({ shoppingList, preferences, onPreferencesUpdate }) {
  const [coupons, setCoupons] = useState([])
  const [searchResults, setSearchResults] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Search for coupons based on shopping list categories
    if (shoppingList.length > 0) {
      findCoupons()
    } else {
      setSearchResults([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shoppingList, preferences])

  const findCoupons = () => {
    setLoading(true)
    
    // Simulate API delay
    setTimeout(() => {
      const results = shoppingList.map(item => {
        const basePrice = item.estimatedPrice || 10
        const category = getCategory(item.name)
        
        // Search for coupons in this category
        const foundCoupons = searchCouponsByCategory(item.name, preferences)
        
        // If coupons found, use them
        if (foundCoupons && foundCoupons.length > 0) {
          return {
            itemName: item.name,
            category: category,
            originalPrice: basePrice,
            coupons: foundCoupons.map(coupon => ({
              ...coupon,
              discountedPrice: basePrice * (1 - coupon.discount / 100)
            })),
            hasCoupons: true
          }
        }
        
        // If no coupons found, show alternative based on preference
        const cheapestOption = basePrice * 0.85
        const brandSale = basePrice * 0.92
        
        let alternative = null
        if (preferences.preference === 'cheapest') {
          alternative = {
            type: 'cheapest',
            price: cheapestOption,
            discount: 15,
            source: 'Generic Brand (Cheapest)',
            category: category
          }
        } else {
          alternative = {
            type: 'sale',
            price: brandSale,
            discount: 8,
            source: 'Brand Sale',
            category: category
          }
        }
        
        return {
          itemName: item.name,
          category: category,
          originalPrice: basePrice,
          alternative: alternative,
          hasCoupons: false
        }
      })
      
      setSearchResults(results)
      setLoading(false)
    }, 300) // Simulate network delay
  }

  const handlePreferenceChange = (e) => {
    const { name, value, type, checked } = e.target
    onPreferencesUpdate({
      ...preferences,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const handleStoreAdd = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      onPreferencesUpdate({
        ...preferences,
        storeSpecific: [...preferences.storeSpecific, e.target.value.trim()]
      })
      e.target.value = ''
    }
  }

  const handleStoreRemove = (store) => {
    onPreferencesUpdate({
      ...preferences,
      storeSpecific: preferences.storeSpecific.filter(s => s !== store)
    })
  }

  return (
    <div className="coupon-finder">
      <div className="coupon-finder-content">
        <div className="coupon-preferences">
          <h3>Coupon Preferences</h3>
          
          <div className="preference-section">
            <label>Search Preference (when no coupons available)</label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="preference"
                  value="cheapest"
                  checked={preferences.preference === 'cheapest'}
                  onChange={handlePreferenceChange}
                />
                <span>Cheapest Option</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="preference"
                  value="sales"
                  checked={preferences.preference === 'sales'}
                  onChange={handlePreferenceChange}
                />
                <span>Brand Sales</span>
              </label>
            </div>
          </div>

          <div className="preference-section">
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

          <div className="preference-section">
            <label>Store-Specific Coupons (optional)</label>
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

        <div className="coupon-results">
          <h3>Coupon & Deal Results</h3>
          {loading && (
            <div className="loading-state">
              <p>🔍 Searching for coupons...</p>
            </div>
          )}
          {shoppingList.length === 0 ? (
            <div className="no-items">
              <p>Add items to your shopping list to find coupons!</p>
            </div>
          ) : !loading && (
            <div className="results-list">
              {searchResults.map((result, index) => (
                <div key={index} className="coupon-result">
                  <div className="result-header">
                    <div className="result-title">
                      <h4>{result.itemName}</h4>
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
                            <span className="original-price">Original: ${result.originalPrice.toFixed(2)}</span>
                            <span className="arrow">→</span>
                            <span className="discounted-price">${coupon.discountedPrice.toFixed(2)}</span>
                          </div>
                          <div className="savings">
                            Save ${(result.originalPrice - coupon.discountedPrice).toFixed(2)} ({coupon.discount}% off)
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
                        <span className="original-price">Original: ${result.originalPrice.toFixed(2)}</span>
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
                      No coupons found for this item.
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CouponFinder

