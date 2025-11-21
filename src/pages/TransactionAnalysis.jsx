import React, { useState, useEffect, useMemo } from 'react'
import { loadTransactions } from '../utils/transactions'
import { getCategory } from '../utils/couponSearch'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import './TransactionAnalysis.css'

const COLORS = [
  '#6366F1', // Purple/Indigo
  '#10B981', // Mint green
  '#EF4444', // Red
  '#F59E0B', // Amber
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#8B5CF6', // Purple
  '#34D399'  // Light mint
]

function TransactionAnalysis() {
  const [transactions, setTransactions] = useState([])

  useEffect(() => {
    const loaded = loadTransactions()
    setTransactions(loaded || [])
    
    // Listen for transaction updates
    const handleUpdate = () => {
      const updated = loadTransactions()
      setTransactions(updated || [])
    }
    
    window.addEventListener('transactionAdded', handleUpdate)
    return () => window.removeEventListener('transactionAdded', handleUpdate)
  }, [])

  const analysis = useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return {
        currentWeek: { expenses: 0, count: 0, byCategory: {}, byLocation: {} },
        previousWeek: { expenses: 0, count: 0, byCategory: {}, byLocation: {} },
        insights: [],
        suggestions: [],
        topCategories: [],
        topLocations: [],
        weeklyComparison: []
      }
    }

    const now = new Date()
    const currentDay = now.getDay()
    const daysFromMonday = currentDay === 0 ? 6 : currentDay - 1
    
    // Current week (Monday to Sunday)
    const currentWeekStart = new Date(now)
    currentWeekStart.setDate(now.getDate() - daysFromMonday)
    currentWeekStart.setHours(0, 0, 0, 0)
    
    const currentWeekEnd = new Date(currentWeekStart)
    currentWeekEnd.setDate(currentWeekStart.getDate() + 7)
    
    // Previous week
    const previousWeekStart = new Date(currentWeekStart)
    previousWeekStart.setDate(currentWeekStart.getDate() - 7)
    
    const previousWeekEnd = new Date(currentWeekStart)

    // Filter transactions
    const currentWeekTransactions = transactions.filter(t => {
      if (t.type !== 'expense') return false
      const tDate = new Date(t.date || t.createdAt)
      tDate.setHours(0, 0, 0, 0)
      return tDate >= currentWeekStart && tDate < currentWeekEnd
    })

    const previousWeekTransactions = transactions.filter(t => {
      if (t.type !== 'expense') return false
      const tDate = new Date(t.date || t.createdAt)
      tDate.setHours(0, 0, 0, 0)
      return tDate >= previousWeekStart && tDate < previousWeekEnd
    })

    // Analyze current week
    const currentWeekExpenses = currentWeekTransactions.reduce((sum, t) => sum + (t.amount || 0), 0)
    const currentWeekByCategory = {}
    const currentWeekByLocation = {}
    
    currentWeekTransactions.forEach(t => {
      const category = t.category || getCategory(t.item) || 'general'
      currentWeekByCategory[category] = (currentWeekByCategory[category] || 0) + (t.amount || 0)
      
      // Use description or item as "location/store" if available
      const location = t.description || t.item || 'Unknown'
      currentWeekByLocation[location] = (currentWeekByLocation[location] || 0) + (t.amount || 0)
    })

    // Analyze previous week
    const previousWeekExpenses = previousWeekTransactions.reduce((sum, t) => sum + (t.amount || 0), 0)
    const previousWeekByCategory = {}
    
    previousWeekTransactions.forEach(t => {
      const category = t.category || getCategory(t.item) || 'general'
      previousWeekByCategory[category] = (previousWeekByCategory[category] || 0) + (t.amount || 0)
    })

    // Calculate insights
    const insights = []
    const suggestions = []
    
    const spendingDiff = currentWeekExpenses - previousWeekExpenses
    const spendingPercentChange = previousWeekExpenses > 0 
      ? ((spendingDiff / previousWeekExpenses) * 100).toFixed(1)
      : 0

    if (Math.abs(spendingPercentChange) > 10) {
      if (spendingPercentChange > 0) {
        insights.push({
          type: 'warning',
          title: 'Increased Spending',
          message: `Your spending increased by ${spendingPercentChange}% compared to last week.`,
          amount: `+$${Math.abs(spendingDiff).toFixed(2)}`
        })
        suggestions.push({
          type: 'save',
          title: 'Budget Review',
          message: 'Consider reviewing your categories to identify where you can cut back.'
        })
      } else {
        insights.push({
          type: 'success',
          title: 'Reduced Spending',
          message: `Great! You spent ${Math.abs(spendingPercentChange)}% less this week.`,
          amount: `-$${Math.abs(spendingDiff).toFixed(2)}`
        })
      }
    }

    // Identify high spending categories
    Object.keys(currentWeekByCategory).forEach(category => {
      const current = currentWeekByCategory[category]
      const previous = previousWeekByCategory[category] || 0
      
      if (current > previous * 1.5 && previous > 0) {
        insights.push({
          type: 'info',
          title: 'High Category Spending',
          message: `Spending in "${category}" increased significantly.`,
          amount: `$${current.toFixed(2)}`
        })
      }
    })

    // Top categories
    const topCategories = Object.entries(currentWeekByCategory)
      .map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5)

    // Top locations (stores/places)
    const topLocations = Object.entries(currentWeekByLocation)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5)

    // Weekly comparison data for chart
    const weeklyComparison = [
      {
        week: 'Previous',
        spending: previousWeekExpenses,
        transactions: previousWeekTransactions.length
      },
      {
        week: 'Current',
        spending: currentWeekExpenses,
        transactions: currentWeekTransactions.length
      }
    ]

    // Additional suggestions based on patterns
    if (topCategories.length > 0) {
      const topCategory = topCategories[0]
      if (topCategory.value > currentWeekExpenses * 0.4) {
        suggestions.push({
          type: 'suggestion',
          title: 'Diversify Spending',
          message: `${topCategory.name} accounts for ${((topCategory.value / currentWeekExpenses) * 100).toFixed(0)}% of your spending. Consider spreading purchases across categories.`
        })
      }
    }

    if (currentWeekExpenses > previousWeekExpenses && previousWeekExpenses > 0) {
      suggestions.push({
        type: 'save',
        title: 'Find Coupons',
        message: 'Use the Coupon Finder to save money on your most frequent purchases.'
      })
    }

    // Daily spending pattern
    const dailySpending = {}
    currentWeekTransactions.forEach(t => {
      const tDate = new Date(t.date || t.createdAt)
      const dayKey = tDate.toLocaleDateString('en-US', { weekday: 'short' })
      dailySpending[dayKey] = (dailySpending[dayKey] || 0) + (t.amount || 0)
    })

    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    const dailyData = daysOfWeek.map(day => ({
      day,
      spending: dailySpending[day] || 0
    }))

    return {
      currentWeek: {
        expenses: currentWeekExpenses,
        count: currentWeekTransactions.length,
        byCategory: currentWeekByCategory,
        byLocation: currentWeekByLocation
      },
      previousWeek: {
        expenses: previousWeekExpenses,
        count: previousWeekTransactions.length,
        byCategory: previousWeekByCategory
      },
      insights,
      suggestions,
      topCategories,
      topLocations,
      weeklyComparison,
      dailyData,
      spendingDiff,
      spendingPercentChange
    }
  }, [transactions])

  return (
    <div className="transaction-analysis">
      <div className="analysis-header">
        <h1>Transaction Analysis</h1>
        <p>Weekly spending insights and recommendations</p>
      </div>

      {transactions.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📊</div>
          <h3>No transactions yet</h3>
          <p>Add some transactions to see insights and analysis</p>
        </div>
      ) : (
        <>
          {/* Key Metrics */}
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-label">Current Week Spending</div>
              <div className="metric-value">${analysis.currentWeek.expenses.toFixed(2)}</div>
              <div className={`metric-change ${analysis.spendingPercentChange > 0 ? 'increase' : analysis.spendingPercentChange < 0 ? 'decrease' : ''}`}>
                {analysis.spendingPercentChange !== 0 && (
                  <>
                    {analysis.spendingPercentChange > 0 ? '↑' : '↓'} 
                    {Math.abs(analysis.spendingPercentChange)}% vs last week
                  </>
                )}
                {analysis.spendingPercentChange === 0 && 'No change'}
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-label">Previous Week Spending</div>
              <div className="metric-value">${analysis.previousWeek.expenses.toFixed(2)}</div>
              <div className="metric-sub">${analysis.currentWeek.count} transactions this week</div>
            </div>

            <div className="metric-card">
              <div className="metric-label">Difference</div>
              <div className={`metric-value ${analysis.spendingDiff > 0 ? 'increase' : analysis.spendingDiff < 0 ? 'decrease' : ''}`}>
                {analysis.spendingDiff > 0 ? '+' : ''}${analysis.spendingDiff.toFixed(2)}
              </div>
              <div className="metric-sub">
                {analysis.spendingDiff > 0 ? 'More spending' : analysis.spendingDiff < 0 ? 'Less spending' : 'Same'}
              </div>
            </div>
          </div>

          {/* Weekly Comparison Chart */}
          <div className="analysis-section">
            <h2>Week-over-Week Comparison</h2>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analysis.weeklyComparison}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="week" stroke="#64748B" />
                  <YAxis stroke="#64748B" />
                  <Tooltip 
                    formatter={(value) => `$${value.toFixed(2)}`}
                    contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px' }}
                  />
                  <Legend />
                  <Bar dataKey="spending" fill="#6366F1" name="Total Spending" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Daily Spending Pattern */}
          <div className="analysis-section">
            <h2>Daily Spending Pattern (This Week)</h2>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analysis.dailyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="day" stroke="#64748B" />
                  <YAxis stroke="#64748B" />
                  <Tooltip 
                    formatter={(value) => `$${value.toFixed(2)}`}
                    contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="spending" 
                    stroke="#10B981" 
                    strokeWidth={3}
                    dot={{ fill: '#10B981', r: 5 }}
                    name="Daily Spending"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Categories */}
          <div className="analysis-section">
            <h2>Top Spending Categories (This Week)</h2>
            {analysis.topCategories.length > 0 ? (
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={analysis.topCategories}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {analysis.topCategories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="no-data">No category data available</p>
            )}
          </div>

          {/* Top Locations */}
          <div className="analysis-section">
            <h2>Top Spending Locations (This Week)</h2>
            <div className="locations-list">
              {analysis.topLocations.length > 0 ? (
                analysis.topLocations.map((location, index) => (
                  <div key={index} className="location-item">
                    <div className="location-rank">{index + 1}</div>
                    <div className="location-info">
                      <div className="location-name">{location.name}</div>
                      <div className="location-amount">${location.value.toFixed(2)}</div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-data">No location data available</p>
              )}
            </div>
          </div>

          {/* Insights */}
          {analysis.insights.length > 0 && (
            <div className="analysis-section">
              <h2>Key Insights</h2>
              <div className="insights-grid">
                {analysis.insights.map((insight, index) => (
                  <div key={index} className={`insight-card ${insight.type}`}>
                    <div className="insight-header">
                      <span className="insight-icon">
                        {insight.type === 'success' ? '✅' : insight.type === 'warning' ? '⚠️' : 'ℹ️'}
                      </span>
                      <h3>{insight.title}</h3>
                    </div>
                    <p>{insight.message}</p>
                    {insight.amount && (
                      <div className="insight-amount">{insight.amount}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Suggestions */}
          {analysis.suggestions.length > 0 && (
            <div className="analysis-section">
              <h2>Suggestions & Recommendations</h2>
              <div className="suggestions-list">
                {analysis.suggestions.map((suggestion, index) => (
                  <div key={index} className={`suggestion-card ${suggestion.type}`}>
                    <div className="suggestion-icon">
                      {suggestion.type === 'save' ? '💰' : '💡'}
                    </div>
                    <div className="suggestion-content">
                      <h3>{suggestion.title}</h3>
                      <p>{suggestion.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default TransactionAnalysis

