import React, { useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import './ItemCard.css'

function ItemCard({ item, onUpdateStock, onDelete }) {
  const [showMap, setShowMap] = useState(false)
  const stockPercentage = (item.currentStock / item.maxStock) * 100
  const isLowStock = stockPercentage < 20

  // Try to parse address for map coordinates (simplified - in production, use geocoding API)
  const getCoordinates = () => {
    // This is a placeholder - in production, use a geocoding service
    // For now, return a default location or parse simple addresses
    return [34.0522, -118.2437] // Default to LA coordinates
  }

  const coordinates = item.storeAddress ? getCoordinates() : null

  return (
    <div className={`item-card ${isLowStock ? 'low-stock' : ''}`}>
      <div className="item-card-header">
        {item.photo && (
          <div className="item-photo">
            <img src={item.photo} alt={item.name} />
          </div>
        )}
        <div className="item-info">
          <h3>{item.name}</h3>
          {item.storeAddress && (
            <p className="store-address">📍 {item.storeAddress}</p>
          )}
        </div>
        <button className="btn-delete" onClick={() => onDelete(item.id)}>
          ×
        </button>
      </div>

      <div className="stock-indicator">
        <label>
          Stock Level: {Math.round(stockPercentage)}%
          {isLowStock && <span className="low-stock-badge">⚠️ Low Stock</span>}
        </label>
        <input
          type="range"
          min="0"
          max={item.maxStock}
          value={item.currentStock}
          onChange={(e) => onUpdateStock(item.id, parseInt(e.target.value))}
          className="stock-slider"
          style={{
            background: `linear-gradient(to right, 
              var(--accent-emerald) 0%, 
              var(--accent-emerald) ${stockPercentage}%, 
              var(--background-light) ${stockPercentage}%, 
              var(--background-light) 100%)`
          }}
        />
        <div className="stock-values">
          <span>0</span>
          <span>Current: {item.currentStock}</span>
          <span>Max: {item.maxStock}</span>
        </div>
      </div>

      <div className="item-links">
        {item.websiteLink && (
          <a 
            href={item.websiteLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="item-link"
          >
            🌐 Website
          </a>
        )}
        {item.storeAddress && (
          <button 
            className="item-link"
            onClick={() => setShowMap(!showMap)}
          >
            🗺️ {showMap ? 'Hide Map' : 'Show Map'}
          </button>
        )}
      </div>

      {showMap && coordinates && (
        <div className="item-map">
          <MapContainer
            center={coordinates}
            zoom={13}
            style={{ height: '200px', width: '100%', borderRadius: '8px' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={coordinates}>
              <Popup>{item.storeAddress}</Popup>
            </Marker>
          </MapContainer>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.storeAddress)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="map-link"
          >
            Open in Google Maps →
          </a>
        </div>
      )}
    </div>
  )
}

export default ItemCard

