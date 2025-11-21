import React, { useState, useEffect } from 'react'
import { saveToStorage, loadFromStorage, STORAGE_KEYS } from '../utils/storage'
import ItemCard from './ItemCard'
import AddItemForm from './AddItemForm'
import './Pantry.css'

function Pantry() {
  const [items, setItems] = useState([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [lowStockNotifications, setLowStockNotifications] = useState([])

  useEffect(() => {
    // Load items from storage
    const savedItems = loadFromStorage(STORAGE_KEYS.PANTRY_ITEMS, [])
    setItems(savedItems)
    checkLowStock(savedItems)
  }, [])

  useEffect(() => {
    // Save items whenever they change
    saveToStorage(STORAGE_KEYS.PANTRY_ITEMS, items)
    checkLowStock(items)
  }, [items])

  const checkLowStock = (itemsList) => {
    const lowStock = itemsList.filter(item => {
      const percentage = (item.currentStock / item.maxStock) * 100
      return percentage < 20
    })
    setLowStockNotifications(lowStock)

    // Show browser notification if items are low
    if (lowStock.length > 0 && Notification.permission === 'granted') {
      lowStock.forEach(item => {
        const percentage = Math.round((item.currentStock / item.maxStock) * 100)
        new Notification(`Low Stock Alert: ${item.name}`, {
          body: `${item.name} is at ${percentage}%. Time to refill!`,
          icon: item.photo || '/favicon.ico'
        })
      })
    }
  }

  const handleAddItem = (itemData) => {
    const newItem = {
      id: Date.now().toString(),
      ...itemData,
      currentStock: itemData.maxStock || 100,
      maxStock: itemData.maxStock || 100,
      createdAt: new Date().toISOString()
    }
    setItems([...items, newItem])
    setShowAddForm(false)
  }

  const handleUpdateStock = (itemId, newStock) => {
    setItems(items.map(item => 
      item.id === itemId 
        ? { ...item, currentStock: Math.max(0, Math.min(newStock, item.maxStock)) }
        : item
    ))
  }

  const handleDeleteItem = (itemId) => {
    setItems(items.filter(item => item.id !== itemId))
  }

  const requestNotificationPermission = () => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }

  return (
    <div className="pantry">
      <div className="pantry-header">
        <h2>Digital Pantry</h2>
        <div className="pantry-actions">
          <button 
            className="btn-notification"
            onClick={requestNotificationPermission}
            title="Enable notifications for low stock alerts"
          >
            Enable Notifications
          </button>
          <button 
            className="btn-add"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? 'Cancel' : '+ Add Item'}
          </button>
        </div>
      </div>

      {lowStockNotifications.length > 0 && (
        <div className="low-stock-alert">
          <h3>⚠️ Low Stock Items ({lowStockNotifications.length})</h3>
          <div className="low-stock-list">
            {lowStockNotifications.map(item => {
              const percentage = Math.round((item.currentStock / item.maxStock) * 100)
              return (
                <div key={item.id} className="low-stock-item">
                  <span>{item.name}</span>
                  <span className="percentage">{percentage}% remaining</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {showAddForm && (
        <AddItemForm 
          onAdd={handleAddItem}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      <div className="pantry-grid">
        {items.length === 0 ? (
          <div className="empty-pantry">
            <p>Your pantry is empty. Add your first item to get started!</p>
          </div>
        ) : (
          items.map(item => (
            <ItemCard
              key={item.id}
              item={item}
              onUpdateStock={handleUpdateStock}
              onDelete={handleDeleteItem}
            />
          ))
        )}
      </div>
    </div>
  )
}

export default Pantry

