import React, { useState, useEffect } from 'react'
import './BudgetSettings.css'

function BudgetSettings({ settings, onUpdate }) {
  const [localSettings, setLocalSettings] = useState(settings)

  useEffect(() => {
    setLocalSettings(settings)
  }, [settings])

  const handleChange = (e) => {
    const { name, value } = e.target
    setLocalSettings(prev => ({
      ...prev,
      [name]: name === 'weekly' || name === 'monthly' 
        ? parseFloat(value) || 0 
        : value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onUpdate({
      ...localSettings,
      periodStart: new Date().toISOString()
    })
    alert('Budget settings saved!')
  }

  return (
    <div className="budget-settings">
      <h3>Budget Settings</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Budget Period</label>
          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                name="currentPeriod"
                value="weekly"
                checked={localSettings.currentPeriod === 'weekly'}
                onChange={handleChange}
              />
              <span>Weekly</span>
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="currentPeriod"
                value="monthly"
                checked={localSettings.currentPeriod === 'monthly'}
                onChange={handleChange}
              />
              <span>Monthly</span>
            </label>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="weekly">Weekly Budget ($)</label>
            <input
              type="number"
              id="weekly"
              name="weekly"
              value={localSettings.weekly}
              onChange={handleChange}
              min="0"
              step="0.01"
              placeholder="0.00"
            />
          </div>

          <div className="form-group">
            <label htmlFor="monthly">Monthly Budget ($)</label>
            <input
              type="number"
              id="monthly"
              name="monthly"
              value={localSettings.monthly}
              onChange={handleChange}
              min="0"
              step="0.01"
              placeholder="0.00"
            />
          </div>
        </div>

        <button type="submit" className="btn-save">
          Save Budget Settings
        </button>
      </form>
    </div>
  )
}

export default BudgetSettings

