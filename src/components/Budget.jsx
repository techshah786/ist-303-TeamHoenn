import React, { useState, useEffect } from 'react'
import { saveToStorage, loadFromStorage, STORAGE_KEYS } from '../utils/storage'
import { loadTransactions } from '../utils/transactions'
import ShoppingList from './ShoppingList'
import BudgetSettings from './BudgetSettings'
import CouponFinder from './CouponFinder'
import Dashboard from './Dashboard'
import './Budget.css'

function Budget() {
  const [activeView, setActiveView] = useState('dashboard')
  const [budgetSettings, setBudgetSettings] = useState({
    weekly: 0,
    monthly: 0,
    currentPeriod: 'weekly',
    periodStart: new Date().toISOString()
  })
  const [shoppingList, setShoppingList] = useState([])
  const [couponPreferences, setCouponPreferences] = useState({
    preference: 'cheapest', // 'cheapest' or 'sales'
    storeSpecific: [],
    productSpecific: [],
    general: true
  })

  useEffect(() => {
    // Load budget settings and shopping list from storage
    const savedBudget = loadFromStorage(STORAGE_KEYS.BUDGET_SETTINGS, budgetSettings)
    const savedShoppingList = loadFromStorage(STORAGE_KEYS.SHOPPING_LIST, [])
    const savedPreferences = loadFromStorage(STORAGE_KEYS.COUPON_PREFERENCES, couponPreferences)
    
    setBudgetSettings(savedBudget)
    setShoppingList(savedShoppingList)
    setCouponPreferences(savedPreferences)
  }, [])

  useEffect(() => {
    // Save to storage whenever changes occur
    saveToStorage(STORAGE_KEYS.BUDGET_SETTINGS, budgetSettings)
    saveToStorage(STORAGE_KEYS.SHOPPING_LIST, shoppingList)
    saveToStorage(STORAGE_KEYS.COUPON_PREFERENCES, couponPreferences)
  }, [budgetSettings, shoppingList, couponPreferences])

  const handleBudgetUpdate = (newBudget) => {
    setBudgetSettings(newBudget)
  }

  const handleShoppingListUpdate = (newList) => {
    setShoppingList(newList)
  }

  const handlePreferencesUpdate = (newPreferences) => {
    setCouponPreferences(newPreferences)
  }

  const currentBudget = budgetSettings.currentPeriod === 'weekly' 
    ? budgetSettings.weekly 
    : budgetSettings.monthly

  return (
    <div className="budget">
      <div className="budget-header">
        <div className="budget-summary">
          <h2>Budget & Shopping</h2>
          <div className="budget-display">
            <span className="budget-label">
              {budgetSettings.currentPeriod === 'weekly' ? 'Weekly' : 'Monthly'} Budget:
            </span>
            <span className="budget-amount">${currentBudget.toFixed(2)}</span>
          </div>
        </div>
        <nav className="budget-nav">
          <button
            className={activeView === 'dashboard' ? 'active' : ''}
            onClick={() => setActiveView('dashboard')}
          >
            📊 Dashboard
          </button>
          <button
            className={activeView === 'shopping' ? 'active' : ''}
            onClick={() => setActiveView('shopping')}
          >
            Shopping List
          </button>
          <button
            className={activeView === 'budget' ? 'active' : ''}
            onClick={() => setActiveView('budget')}
          >
            Budget Settings
          </button>
          <button
            className={activeView === 'coupons' ? 'active' : ''}
            onClick={() => setActiveView('coupons')}
          >
            Coupon Finder
          </button>
        </nav>
      </div>

      <main className="budget-main">
        {activeView === 'dashboard' && (
          <Dashboard
            shoppingList={shoppingList}
            budget={currentBudget}
            budgetPeriod={budgetSettings.currentPeriod}
          />
        )}
        {activeView === 'shopping' && (
          <ShoppingList
            items={shoppingList}
            budget={currentBudget}
            onUpdate={handleShoppingListUpdate}
            preferences={couponPreferences}
          />
        )}
        {activeView === 'budget' && (
          <BudgetSettings
            settings={budgetSettings}
            onUpdate={handleBudgetUpdate}
          />
        )}
        {activeView === 'coupons' && (
          <CouponFinder
            shoppingList={shoppingList}
            preferences={couponPreferences}
            onPreferencesUpdate={handlePreferencesUpdate}
          />
        )}
      </main>
    </div>
  )
}

export default Budget

