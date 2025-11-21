import React, { useState, useRef } from 'react'
import { getCategory } from '../utils/couponSearch'
import './ReceiptScanner.css'

function ReceiptScanner({ onAddTransactions }) {
  const [isScanning, setIsScanning] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)
  const [extractedItems, setExtractedItems] = useState([])
  const fileInputRef = useRef(null)

  // Simulate OCR extraction - in production, this would call an OCR API
  const simulateOCRExtraction = (imageData) => {
    // Simulate extracted items from receipt
    // In real app, this would call OCR service like Tesseract.js, Google Vision API, etc.
    const mockExtractions = [
      { item: 'Milk', category: 'dairy', price: 4.99, quantity: 1 },
      { item: 'Bread', category: 'bakery', price: 2.49, quantity: 1 },
      { item: 'Chicken', category: 'meat', price: 8.99, quantity: 1 },
      { item: 'Apple', category: 'produce', price: 3.99, quantity: 1 }
    ]
    
    return mockExtractions
  }

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      const imageData = reader.result
      setImagePreview(imageData)
      setIsScanning(true)

      // Simulate OCR processing delay
      setTimeout(() => {
        const extracted = simulateOCRExtraction(imageData)
        
        // Enhance with category detection
        const enhancedItems = extracted.map(item => ({
          ...item,
          category: getCategory(item.item)
        }))
        
        setExtractedItems(enhancedItems)
        setIsScanning(false)
      }, 1500)
    }
    reader.readAsDataURL(file)
  }

  const handleItemEdit = (index, field, value) => {
    const updated = [...extractedItems]
    updated[index] = {
      ...updated[index],
      [field]: field === 'price' ? parseFloat(value) || 0 : value
    }
    
    // Re-categorize if item name changed
    if (field === 'item') {
      updated[index].category = getCategory(value)
    }
    
    setExtractedItems(updated)
  }

  const handleAddToTransactions = () => {
    const transactions = extractedItems.map(item => ({
      id: Date.now() + Math.random(),
      item: item.item,
      category: item.category,
      amount: item.price * item.quantity,
      price: item.price,
      quantity: item.quantity,
      description: `${item.quantity}x ${item.item}`,
      date: new Date().toISOString(),
      type: 'expense'
    }))
    
    onAddTransactions(transactions)
    
    // Reset
    setImagePreview(null)
    setExtractedItems([])
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleRemoveItem = (index) => {
    setExtractedItems(extractedItems.filter((_, i) => i !== index))
  }

  return (
    <div className="receipt-scanner">
      <h3> receipt Scanner</h3>
      
      <div className="scanner-upload">
        {!imagePreview ? (
          <div className="upload-area" onClick={() => fileInputRef.current?.click()}>
            <div className="upload-icon">📷</div>
            <p>Click to upload receipt image</p>
            <p className="upload-hint">JPG, PNG or take a photo</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
          </div>
        ) : (
          <div className="preview-container">
            <img src={imagePreview} alt="Receipt preview" className="receipt-preview" />
            {isScanning && (
              <div className="scanning-overlay">
                <div className="scanning-spinner"></div>
                <p>Scanning receipt...</p>
              </div>
            )}
          </div>
        )}
      </div>

      {extractedItems.length > 0 && (
        <div className="extracted-items">
          <h4>Extracted Items ({extractedItems.length})</h4>
          <div className="items-list">
            {extractedItems.map((item, index) => (
              <div key={index} className="extracted-item">
                <button
                  className="remove-item-btn"
                  onClick={() => handleRemoveItem(index)}
                >
                  ×
                </button>
                <div className="item-details">
                  <input
                    type="text"
                    value={item.item}
                    onChange={(e) => handleItemEdit(index, 'item', e.target.value)}
                    className="item-input"
                    placeholder="Item name"
                  />
                  <select
                    value={item.category}
                    onChange={(e) => handleItemEdit(index, 'category', e.target.value)}
                    className="category-select"
                  >
                    <option value="dairy">Dairy</option>
                    <option value="meat">Meat</option>
                    <option value="produce">Produce</option>
                    <option value="beverages">Beverages</option>
                    <option value="bakery">Bakery</option>
                    <option value="pantry">Pantry</option>
                    <option value="clothing">Clothing</option>
                    <option value="shoes">Shoes</option>
                    <option value="accessories">Accessories</option>
                    <option value="electronics">Electronics</option>
                    <option value="general">General</option>
                  </select>
                  <input
                    type="number"
                    value={item.quantity || 1}
                    onChange={(e) => handleItemEdit(index, 'quantity', parseInt(e.target.value) || 1)}
                    className="quantity-input"
                    min="1"
                  />
                  <div className="price-input-group">
                    <span>$</span>
                    <input
                      type="number"
                      value={item.price || 0}
                      onChange={(e) => handleItemEdit(index, 'price', e.target.value)}
                      className="price-input"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                    />
                  </div>
                  <div className="item-total">
                    ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="scanner-actions">
            <button
              className="reset-btn"
              onClick={() => {
                setImagePreview(null)
                setExtractedItems([])
                if (fileInputRef.current) fileInputRef.current.value = ''
              }}
            >
              Reset
            </button>
            <button
              className="add-transactions-btn"
              onClick={handleAddToTransactions}
            >
              Add to Transactions ({extractedItems.length})
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ReceiptScanner

