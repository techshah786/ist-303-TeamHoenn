import express from 'express'
import { searchCoupons } from '../services/couponScraper.js'
import { estimatePrice } from '../utils/priceEstimator.js'

const router = express.Router()

// Search for coupons by item name
router.post('/search', async (req, res) => {
  try {
    const { itemName, preferences = {} } = req.body

    if (!itemName || !itemName.trim()) {
      return res.status(400).json({ 
        error: 'Item name is required',
        message: 'Please provide an item name to search for coupons'
      })
    }

    console.log(`🔍 Searching for coupons: ${itemName}`)

    // Estimate base price
    const estimatedPrice = estimatePrice(itemName)

    // Search for real coupons
    const coupons = await searchCoupons(itemName, preferences, estimatedPrice)

    res.json({
      success: true,
      itemName: itemName.trim(),
      estimatedPrice,
      coupons: coupons || [],
      count: coupons?.length || 0,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('❌ Error searching coupons:', error)
    res.status(500).json({ 
      error: 'Failed to search coupons',
      message: error.message || 'An error occurred while searching for coupons'
    })
  }
})

// Search multiple items
router.post('/search/multiple', async (req, res) => {
  try {
    const { items, preferences = {} } = req.body

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ 
        error: 'Items array is required',
        message: 'Please provide an array of item names'
      })
    }

    console.log(`🔍 Searching for coupons for ${items.length} items`)

    const results = await Promise.all(
      items.map(async (itemName) => {
        try {
          const estimatedPrice = estimatePrice(itemName)
          const coupons = await searchCoupons(itemName, preferences, estimatedPrice)
          return {
            itemName: itemName.trim(),
            estimatedPrice,
            coupons: coupons || [],
            count: coupons?.length || 0
          }
        } catch (error) {
          console.error(`Error searching for ${itemName}:`, error)
          return {
            itemName: itemName.trim(),
            estimatedPrice: estimatePrice(itemName),
            coupons: [],
            count: 0,
            error: error.message
          }
        }
      })
    )

    res.json({
      success: true,
      results,
      totalCount: results.reduce((sum, r) => sum + r.count, 0),
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('❌ Error searching multiple coupons:', error)
    res.status(500).json({ 
      error: 'Failed to search coupons',
      message: error.message || 'An error occurred while searching for coupons'
    })
  }
})

export default router

