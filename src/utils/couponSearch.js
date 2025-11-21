// Coupon search utility - searches for coupons by item category
// In production, this would call actual coupon APIs

// Common stores and their websites, with addresses for physical stores
const STORES = {
  'target': { 
    name: 'Target', 
    website: 'https://www.target.com',
    isPhysical: true,
    sampleAddress: 'Multiple locations - Find nearest at target.com/store-locator'
  },
  'walmart': { 
    name: 'Walmart', 
    website: 'https://www.walmart.com',
    isPhysical: true,
    sampleAddress: 'Multiple locations - Find nearest at walmart.com/store/finder'
  },
  'kroger': { 
    name: 'Kroger', 
    website: 'https://www.kroger.com',
    isPhysical: true,
    sampleAddress: 'Multiple locations - Find nearest at kroger.com/store-locator'
  },
  'safeway': { 
    name: 'Safeway', 
    website: 'https://www.safeway.com',
    isPhysical: true,
    sampleAddress: 'Multiple locations - Find nearest at safeway.com/store-locator'
  },
  'whole foods': { 
    name: 'Whole Foods', 
    website: 'https://www.wholefoodsmarket.com',
    isPhysical: true,
    sampleAddress: 'Multiple locations - Find nearest at wholefoodsmarket.com/stores'
  },
  'trader joes': { 
    name: "Trader Joe's", 
    website: 'https://www.traderjoes.com',
    isPhysical: true,
    sampleAddress: 'Multiple locations - Find nearest at traderjoes.com/locations'
  },
  'costco': { 
    name: 'Costco', 
    website: 'https://www.costco.com',
    isPhysical: true,
    sampleAddress: 'Multiple locations - Find nearest at costco.com/warehouse-locations'
  },
  'amazon': { 
    name: 'Amazon', 
    website: 'https://www.amazon.com',
    isPhysical: false,
    sampleAddress: null
  },
  'aldi': { 
    name: 'Aldi', 
    website: 'https://www.aldi.us',
    isPhysical: true,
    sampleAddress: 'Multiple locations - Find nearest at aldi.us/en/find-a-store'
  },
  'publix': { 
    name: 'Publix', 
    website: 'https://www.publix.com',
    isPhysical: true,
    sampleAddress: 'Multiple locations - Find nearest at publix.com/locations'
  },
  'best buy': {
    name: 'Best Buy',
    website: 'https://www.bestbuy.com',
    isPhysical: true,
    sampleAddress: 'Multiple locations - Find nearest at bestbuy.com/site/store-locator'
  },
  'macy\'s': {
    name: 'Macy\'s',
    website: 'https://www.macys.com',
    isPhysical: true,
    sampleAddress: 'Multiple locations - Find nearest at stores.macys.com'
  },
  'nordstrom': {
    name: 'Nordstrom',
    website: 'https://www.nordstrom.com',
    isPhysical: true,
    sampleAddress: 'Multiple locations - Find nearest at nordstrom.com/stores'
  },
  'h&m': {
    name: 'H&M',
    website: 'https://www.hm.com',
    isPhysical: true,
    sampleAddress: 'Multiple locations - Find nearest at stores.hm.com'
  },
  'zara': {
    name: 'Zara',
    website: 'https://www.zara.com',
    isPhysical: true,
    sampleAddress: 'Multiple locations - Find nearest at zara.com/us/en/stores'
  }
}

// Category mapping for items - expanded to include food, clothing, accessories, electronics, etc.
function getCategory(itemName) {
  const name = itemName.toLowerCase()
  
  const categories = {
    // Food categories
    'dairy': ['milk', 'cheese', 'yogurt', 'butter', 'cream', 'sour cream', 'cottage cheese'],
    'meat': ['meat', 'beef', 'chicken', 'pork', 'turkey', 'bacon', 'sausage', 'ham', 'fish', 'salmon', 'tuna'],
    'produce': ['apple', 'banana', 'orange', 'lettuce', 'tomato', 'carrot', 'onion', 'pepper', 'broccoli', 'spinach', 'vegetable', 'fruit'],
    'beverages': ['juice', 'soda', 'water', 'coffee', 'tea', 'drink', 'beverage'],
    'bakery': ['bread', 'bagel', 'muffin', 'croissant', 'donut', 'cake', 'cookie'],
    'pantry': ['rice', 'pasta', 'flour', 'sugar', 'salt', 'oil', 'vinegar', 'sauce', 'cereal', 'oatmeal'],
    'frozen': ['ice cream', 'frozen', 'pizza'],
    'snacks': ['chips', 'crackers', 'nuts', 'snack'],
    'deli': ['deli', 'sandwich', 'lunch meat'],
    'seafood': ['fish', 'salmon', 'tuna', 'shrimp', 'crab', 'seafood'],
    
    // Clothing categories
    'clothing': ['shirt', 'pants', 'jeans', 'dress', 'top', 'bottom', 'outfit', 'clothing', 'clothes', 'apparel', 'wardrobe'],
    'shoes': ['shoes', 'sneakers', 'boots', 'sandals', 'heels', 'flats', 'footwear'],
    'accessories': ['bag', 'purse', 'wallet', 'belt', 'hat', 'cap', 'scarf', 'gloves', 'sunglasses', 'watch', 'jewelry', 'accessories'],
    'underwear': ['underwear', 'socks', 'bra', 'panties', 'lingerie', 'underwear'],
    'outerwear': ['jacket', 'coat', 'hoodie', 'sweater', 'cardigan', 'blazer', 'outerwear'],
    
    // Electronics
    'electronics': ['phone', 'laptop', 'computer', 'tablet', 'tv', 'television', 'headphones', 'speaker', 'camera', 'electronics', 'tech'],
    'home': ['furniture', 'bed', 'chair', 'table', 'sofa', 'couch', 'lamp', 'home', 'decor', 'decoration'],
    'kitchen': ['appliance', 'microwave', 'oven', 'refrigerator', 'fridge', 'blender', 'coffee maker', 'kitchen'],
    'personal care': ['shampoo', 'soap', 'toothpaste', 'deodorant', 'skincare', 'cosmetics', 'makeup', 'beauty', 'personal care', 'hygiene'],
    'sports': ['sports', 'fitness', 'gym', 'exercise', 'equipment', 'athletic', 'sportswear'],
    'toys': ['toy', 'games', 'puzzle', 'doll', 'action figure', 'toys'],
    'books': ['book', 'novel', 'magazine', 'comic', 'books', 'reading'],
    'automotive': ['car', 'vehicle', 'tire', 'battery', 'automotive', 'auto'],
    'pet': ['pet', 'dog', 'cat', 'food', 'toy', 'pet supplies', 'pet care']
  }
  
  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(keyword => name.includes(keyword))) {
      return category
    }
  }
  
  return 'general'
}

// Simulate coupon database by category - includes product links and addresses
const COUPONS_BY_CATEGORY = {
  // Food categories
  'dairy': [
    { type: 'store-banner', discount: 15, store: 'target', title: 'Dairy Products Sale', validUntil: '2024-12-31', code: 'DAIRY15', productLink: 'https://www.target.com/c/dairy-grocery/-/N-5xsx4' },
    { type: 'website', discount: 20, store: 'kroger', title: 'Milk & Cheese Deal', validUntil: '2024-12-20', code: 'MILK20', productLink: 'https://www.kroger.com/browse/dairy' },
    { type: 'store-banner', discount: 10, store: 'walmart', title: 'Dairy Essentials', validUntil: '2024-12-25', code: null, productLink: 'https://www.walmart.com/browse/food/dairy-eggs/976759' },
    { type: 'website', discount: 25, store: 'whole foods', title: 'Organic Dairy Special', validUntil: '2024-12-18', code: 'ORG25', productLink: 'https://www.wholefoodsmarket.com/departments/dairy' }
  ],
  'meat': [
    { type: 'store-banner', discount: 20, store: 'costco', title: 'Meat & Poultry Sale', validUntil: '2024-12-31', code: null, productLink: 'https://www.costco.com/meat-poultry-seafood.html' },
    { type: 'website', discount: 15, store: 'kroger', title: 'Fresh Meat Deal', validUntil: '2024-12-22', code: 'MEAT15', productLink: 'https://www.kroger.com/browse/meat-seafood' },
    { type: 'store-banner', discount: 30, store: 'aldi', title: 'Meat Special', validUntil: '2024-12-28', code: null, productLink: 'https://www.aldi.us/en/products/fresh-meat-seafood/' },
    { type: 'website', discount: 18, store: 'publix', title: 'Quality Meats', validUntil: '2024-12-20', code: 'QM18', productLink: 'https://www.publix.com/shop/product-list/departments/meat' }
  ],
  'produce': [
    { type: 'website', discount: 25, store: 'whole foods', title: 'Fresh Produce Deal', validUntil: '2024-12-19', code: 'PROD25', productLink: 'https://www.wholefoodsmarket.com/departments/produce' },
    { type: 'store-banner', discount: 15, store: 'trader joes', title: 'Organic Produce', validUntil: '2024-12-30', code: null, productLink: 'https://www.traderjoes.com/home/products/category/produce' },
    { type: 'website', discount: 20, store: 'kroger', title: 'Fresh Fruits & Vegetables', validUntil: '2024-12-21', code: 'FRESH20', productLink: 'https://www.kroger.com/browse/produce' },
    { type: 'store-banner', discount: 10, store: 'walmart', title: 'Produce Essentials', validUntil: '2024-12-26', code: null, productLink: 'https://www.walmart.com/browse/food/fruits-vegetables/976759_976787' }
  ],
  'beverages': [
    { type: 'website', discount: 20, store: 'target', title: 'Beverage Sale', validUntil: '2024-12-23', code: 'BEV20', productLink: 'https://www.target.com/c/beverages-grocery/-/N-5xtg6' },
    { type: 'store-banner', discount: 15, store: 'walmart', title: 'Drinks Special', validUntil: '2024-12-27', code: null, productLink: 'https://www.walmart.com/browse/food/beverages/976759' },
    { type: 'website', discount: 30, store: 'amazon', title: 'Bulk Beverage Deal', validUntil: '2024-12-31', code: 'DRINK30', productLink: 'https://www.amazon.com/s?k=beverages' }
  ],
  'bakery': [
    { type: 'store-banner', discount: 15, store: 'publix', title: 'Fresh Bakery Items', validUntil: '2024-12-24', code: null, productLink: 'https://www.publix.com/shop/product-list/departments/bakery' },
    { type: 'website', discount: 20, store: 'kroger', title: 'Bakery Special', validUntil: '2024-12-20', code: 'BAKE20', productLink: 'https://www.kroger.com/browse/bakery' },
    { type: 'store-banner', discount: 10, store: 'trader joes', title: 'Artisan Breads', validUntil: '2024-12-29', code: null, productLink: 'https://www.traderjoes.com/home/products/category/bakery' }
  ],
  'pantry': [
    { type: 'website', discount: 25, store: 'amazon', title: 'Pantry Essentials', validUntil: '2024-12-31', code: 'PANTRY25', productLink: 'https://www.amazon.com/s?k=pantry+essentials' },
    { type: 'store-banner', discount: 15, store: 'target', title: 'Grocery Staples', validUntil: '2024-12-25', code: null, productLink: 'https://www.target.com/c/grocery/-/N-5xtg6' },
    { type: 'website', discount: 20, store: 'walmart', title: 'Pantry Items Deal', validUntil: '2024-12-22', code: 'STAPLE20', productLink: 'https://www.walmart.com/browse/food/pantry/976759' },
    { type: 'store-banner', discount: 12, store: 'aldi', title: 'Everyday Essentials', validUntil: '2024-12-28', code: null, productLink: 'https://www.aldi.us/en/products/pantry/' }
  ],
  'frozen': [
    { type: 'website', discount: 20, store: 'kroger', title: 'Frozen Foods Deal', validUntil: '2024-12-21', code: 'FROZEN20', productLink: 'https://www.kroger.com/browse/frozen' },
    { type: 'store-banner', discount: 15, store: 'target', title: 'Frozen Special', validUntil: '2024-12-26', code: null, productLink: 'https://www.target.com/c/frozen-food-grocery/-/N-5xtg8' }
  ],
  'snacks': [
    { type: 'store-banner', discount: 20, store: 'costco', title: 'Snack Time Sale', validUntil: '2024-12-31', code: null, productLink: 'https://www.costco.com/snacks.html' },
    { type: 'website', discount: 15, store: 'target', title: 'Snack Attack Deal', validUntil: '2024-12-23', code: 'SNACK15', productLink: 'https://www.target.com/c/snacks-grocery/-/N-5xtg9' }
  ],
  
  // Clothing categories
  'clothing': [
    { type: 'website', discount: 30, store: 'target', title: 'Clothing Sale', validUntil: '2024-12-31', code: 'CLOTH30', productLink: 'https://www.target.com/c/women/-/N-5xtga' },
    { type: 'store-banner', discount: 25, store: 'macy\'s', title: 'Fashion Deal', validUntil: '2024-12-28', code: null, productLink: 'https://www.macys.com/shop/womens-clothing' },
    { type: 'website', discount: 20, store: 'h&m', title: 'Style Essentials', validUntil: '2024-12-22', code: 'HM20', productLink: 'https://www2.hm.com/en_us/women.html' },
    { type: 'store-banner', discount: 35, store: 'nordstrom', title: 'Premium Brands', validUntil: '2024-12-26', code: null, productLink: 'https://www.nordstrom.com/browse/women' }
  ],
  'shoes': [
    { type: 'website', discount: 25, store: 'target', title: 'Footwear Sale', validUntil: '2024-12-30', code: 'SHOE25', productLink: 'https://www.target.com/c/women-shoes/-/N-5xtgc' },
    { type: 'store-banner', discount: 30, store: 'zara', title: 'Shoe Collection', validUntil: '2024-12-24', code: null, productLink: 'https://www.zara.com/us/en/woman/shoes-c358015.html' },
    { type: 'website', discount: 20, store: 'amazon', title: 'Shoe Deals', validUntil: '2024-12-31', code: 'SHOES20', productLink: 'https://www.amazon.com/s?k=shoes' }
  ],
  'accessories': [
    { type: 'website', discount: 20, store: 'target', title: 'Accessories Deal', validUntil: '2024-12-29', code: 'ACC20', productLink: 'https://www.target.com/c/women-accessories/-/N-5xtgd' },
    { type: 'store-banner', discount: 15, store: 'macy\'s', title: 'Jewelry & Accessories', validUntil: '2024-12-27', code: null, productLink: 'https://www.macys.com/shop/jewelry-watches' },
    { type: 'website', discount: 25, store: 'amazon', title: 'Fashion Accessories', validUntil: '2024-12-31', code: 'ACC25', productLink: 'https://www.amazon.com/s?k=accessories' }
  ],
  
  // Electronics
  'electronics': [
    { type: 'website', discount: 15, store: 'best buy', title: 'Electronics Sale', validUntil: '2024-12-31', code: 'TECH15', productLink: 'https://www.bestbuy.com/site/electronics/pcmcat1487698925722.c?id=pcmcat1487698925722' },
    { type: 'store-banner', discount: 10, store: 'target', title: 'Tech Deals', validUntil: '2024-12-28', code: null, productLink: 'https://www.target.com/c/electronics/-/N-5xtg6' },
    { type: 'website', discount: 20, store: 'amazon', title: 'Electronics Special', validUntil: '2024-12-30', code: 'ELEC20', productLink: 'https://www.amazon.com/s?k=electronics' }
  ],
  
  'general': [
    { type: 'website', discount: 10, store: 'amazon', title: 'General Sale', validUntil: '2024-12-31', code: 'GEN10', productLink: 'https://www.amazon.com' },
    { type: 'store-banner', discount: 5, store: 'walmart', title: 'Storewide Special', validUntil: '2024-12-25', code: null, productLink: 'https://www.walmart.com' }
  ]
}

// Estimate base price based on item name and category
export function estimateItemPrice(itemName, category) {
  const name = itemName.toLowerCase()
  
  // Price ranges by category (in USD)
  const priceRanges = {
    'bakery': {
      'bread': { min: 2.50, max: 6.00 },
      'bagel': { min: 1.00, max: 3.00 },
      'muffin': { min: 1.50, max: 4.00 },
      'croissant': { min: 1.50, max: 3.50 },
      'donut': { min: 0.50, max: 2.00 },
      'cake': { min: 10.00, max: 50.00 },
      'cookie': { min: 0.25, max: 1.50 },
      'default': { min: 3.00, max: 8.00 }
    },
    'electronics': {
      'laptop': { min: 400, max: 2000 },
      'computer': { min: 500, max: 2500 },
      'phone': { min: 200, max: 1500 },
      'tablet': { min: 150, max: 1000 },
      'tv': { min: 200, max: 3000 },
      'television': { min: 200, max: 3000 },
      'headphones': { min: 30, max: 500 },
      'speaker': { min: 50, max: 500 },
      'camera': { min: 200, max: 2000 },
      'default': { min: 100, max: 800 }
    },
    'clothing': {
      'shirt': { min: 15, max: 80 },
      'pants': { min: 25, max: 150 },
      'jeans': { min: 30, max: 200 },
      'dress': { min: 25, max: 200 },
      'jacket': { min: 50, max: 300 },
      'coat': { min: 80, max: 400 },
      'sweater': { min: 30, max: 150 },
      'shoes': { min: 40, max: 300 },
      'sneakers': { min: 50, max: 250 },
      'boots': { min: 60, max: 350 },
      'default': { min: 20, max: 100 }
    },
    'groceries': {
      'milk': { min: 3.50, max: 6.00 },
      'bread': { min: 2.50, max: 5.50 },
      'eggs': { min: 2.50, max: 5.00 },
      'chicken': { min: 5.00, max: 15.00 },
      'rice': { min: 3.00, max: 10.00 },
      'bananas': { min: 0.50, max: 2.00 },
      'tomatoes': { min: 2.00, max: 6.00 },
      'default': { min: 3.00, max: 10.00 }
    },
    'dairy': {
      'milk': { min: 3.50, max: 6.00 },
      'cheese': { min: 3.00, max: 12.00 },
      'yogurt': { min: 1.00, max: 8.00 },
      'butter': { min: 3.00, max: 6.00 },
      'default': { min: 3.00, max: 8.00 }
    },
    'produce': {
      'apple': { min: 0.75, max: 2.50 },
      'banana': { min: 0.50, max: 2.00 },
      'orange': { min: 0.75, max: 2.50 },
      'lettuce': { min: 1.50, max: 4.00 },
      'tomato': { min: 1.00, max: 5.00 },
      'carrot': { min: 1.00, max: 3.00 },
      'default': { min: 1.50, max: 5.00 }
    },
    'meat': {
      'chicken': { min: 5.00, max: 15.00 },
      'beef': { min: 6.00, max: 20.00 },
      'pork': { min: 4.00, max: 12.00 },
      'fish': { min: 8.00, max: 25.00 },
      'salmon': { min: 10.00, max: 30.00 },
      'default': { min: 6.00, max: 18.00 }
    },
    'beverages': {
      'juice': { min: 2.50, max: 8.00 },
      'soda': { min: 1.50, max: 6.00 },
      'water': { min: 1.00, max: 5.00 },
      'coffee': { min: 5.00, max: 20.00 },
      'default': { min: 2.00, max: 8.00 }
    },
    'pantry': {
      'rice': { min: 3.00, max: 10.00 },
      'pasta': { min: 1.50, max: 5.00 },
      'flour': { min: 2.50, max: 8.00 },
      'sugar': { min: 2.00, max: 6.00 },
      'oil': { min: 3.00, max: 12.00 },
      'default': { min: 2.50, max: 8.00 }
    },
    'shoes': {
      'shoes': { min: 40, max: 300 },
      'sneakers': { min: 50, max: 250 },
      'boots': { min: 60, max: 350 },
      'sandals': { min: 20, max: 150 },
      'heels': { min: 40, max: 200 },
      'default': { min: 50, max: 200 }
    },
    'accessories': {
      'bag': { min: 20, max: 300 },
      'purse': { min: 30, max: 400 },
      'wallet': { min: 15, max: 150 },
      'watch': { min: 50, max: 500 },
      'jewelry': { min: 20, max: 500 },
      'default': { min: 25, max: 200 }
    },
    'general': {
      'default': { min: 5.00, max: 50.00 }
    }
  }
  
  // Get price range for category
  const categoryRanges = priceRanges[category] || priceRanges['general']
  
  // Try to find specific item in category
  let priceRange = categoryRanges['default']
  for (const [item, range] of Object.entries(categoryRanges)) {
    if (item !== 'default' && name.includes(item)) {
      priceRange = range
      break
    }
  }
  
  // Generate realistic price within range
  const price = priceRange.min + (Math.random() * (priceRange.max - priceRange.min))
  
  // Round to 2 decimal places
  return Math.round(price * 100) / 100
}

export function searchCouponsByCategory(itemName, preferences) {
  const category = getCategory(itemName)
  const availableCoupons = COUPONS_BY_CATEGORY[category] || COUPONS_BY_CATEGORY['general']
  
  // Filter by store preferences if specified
  let filteredCoupons = availableCoupons
  if (preferences && preferences.storeSpecific && preferences.storeSpecific.length > 0) {
    filteredCoupons = availableCoupons.filter(coupon => 
      preferences.storeSpecific.some(store => 
        coupon.store.includes(store.toLowerCase())
      )
    )
    // If no matches, fall back to all coupons
    if (filteredCoupons.length === 0) {
      filteredCoupons = availableCoupons
    }
  }
  
  // Select coupon based on preferences
  if (filteredCoupons.length === 0) {
    return null
  }
  
  // Filter by type preference if needed
  const storeBanners = filteredCoupons.filter(c => c.type === 'store-banner')
  const websiteCoupons = filteredCoupons.filter(c => c.type === 'website')
  
  let selectedCoupons = []
  
  // Include both types, but prioritize based on availability
  if (storeBanners.length > 0 && websiteCoupons.length > 0) {
    // Show both types
    selectedCoupons = [storeBanners[0], websiteCoupons[0]]
  } else if (storeBanners.length > 0) {
    selectedCoupons = [storeBanners[0]]
  } else if (websiteCoupons.length > 0) {
    selectedCoupons = [websiteCoupons[0]]
  }
  
  return selectedCoupons.map(coupon => ({
    ...coupon,
    category,
    storeInfo: STORES[coupon.store] || { 
      name: coupon.store, 
      website: '#',
      isPhysical: false,
      sampleAddress: null
    },
    // Use product link from coupon if available, otherwise use store website
    productLink: coupon.productLink || (STORES[coupon.store]?.website || '#')
  }))
}

export { getCategory, STORES, COUPONS_BY_CATEGORY }

