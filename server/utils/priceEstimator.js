// Price estimation utility - provides realistic base prices for items

export function estimatePrice(itemName) {
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
  
  // Categorize item
  const category = categorizeItem(name)
  const categoryRanges = priceRanges[category] || priceRanges['general']
  
  // Find specific item or use default
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

function categorizeItem(itemName) {
  const categories = {
    'bakery': ['bread', 'bagel', 'muffin', 'croissant', 'donut', 'cake', 'cookie'],
    'electronics': ['laptop', 'computer', 'phone', 'tablet', 'tv', 'television', 'headphones', 'speaker', 'camera'],
    'clothing': ['shirt', 'pants', 'jeans', 'dress', 'jacket', 'coat', 'sweater'],
    'groceries': ['milk', 'bread', 'eggs', 'chicken', 'rice', 'bananas', 'tomatoes'],
    'dairy': ['milk', 'cheese', 'yogurt', 'butter'],
    'produce': ['apple', 'banana', 'orange', 'lettuce', 'tomato', 'carrot'],
    'meat': ['chicken', 'beef', 'pork', 'fish', 'salmon'],
    'beverages': ['juice', 'soda', 'water', 'coffee'],
    'pantry': ['rice', 'pasta', 'flour', 'sugar', 'oil'],
    'shoes': ['shoes', 'sneakers', 'boots', 'sandals', 'heels'],
    'accessories': ['bag', 'purse', 'wallet', 'watch', 'jewelry']
  }
  
  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(keyword => itemName.includes(keyword))) {
      return category
    }
  }
  
  return 'general'
}

