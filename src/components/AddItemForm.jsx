import React, { useState } from 'react'
import './AddItemForm.css'

function AddItemForm({ onAdd, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    photo: '',
    websiteLink: '',
    storeAddress: '',
    maxStock: 100,
    currentStock: 100
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'maxStock' || name === 'currentStock' 
        ? parseInt(value) || 0 
        : value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      alert('Please enter an item name')
      return
    }
    onAdd(formData)
    // Reset form
    setFormData({
      name: '',
      photo: '',
      websiteLink: '',
      storeAddress: '',
      maxStock: 100,
      currentStock: 100
    })
  }

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, photo: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <form className="add-item-form" onSubmit={handleSubmit}>
      <h3>Add New Item</h3>
      
      <div className="form-group">
        <label htmlFor="name">Item Name *</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="e.g., Rice, Milk, Bread"
        />
      </div>

      <div className="form-group">
        <label htmlFor="photo">Photo</label>
        <div className="photo-upload">
          <input
            type="file"
            id="photo"
            accept="image/*"
            onChange={handlePhotoUpload}
          />
          {formData.photo && (
            <img src={formData.photo} alt="Preview" className="photo-preview" />
          )}
        </div>
        <input
          type="url"
          name="photo"
          value={formData.photo}
          onChange={handleChange}
          placeholder="Or enter image URL"
        />
      </div>

      <div className="form-group">
        <label htmlFor="websiteLink">Website Link</label>
        <input
          type="url"
          id="websiteLink"
          name="websiteLink"
          value={formData.websiteLink}
          onChange={handleChange}
          placeholder="https://example.com/product"
        />
      </div>

      <div className="form-group">
        <label htmlFor="storeAddress">Store Address</label>
        <input
          type="text"
          id="storeAddress"
          name="storeAddress"
          value={formData.storeAddress}
          onChange={handleChange}
          placeholder="123 Main St, City, State ZIP"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="maxStock">Max Stock</label>
          <input
            type="number"
            id="maxStock"
            name="maxStock"
            value={formData.maxStock}
            onChange={handleChange}
            min="1"
          />
        </div>

        <div className="form-group">
          <label htmlFor="currentStock">Current Stock</label>
          <input
            type="number"
            id="currentStock"
            name="currentStock"
            value={formData.currentStock}
            onChange={handleChange}
            min="0"
            max={formData.maxStock}
          />
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="btn-cancel" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn-submit">
          Add Item
        </button>
      </div>
    </form>
  )
}

export default AddItemForm

