# Finance Tracker - Architecture & Technical Details

## Overview

This is a **client-side React application** with an **optional backend API** for coupon scraping. It's designed for **local deployment** and uses **browser localStorage** for data persistence - **NO database connection is required**.

---

## 🏗️ Architecture

### **Architecture Type: Client-Side (SPA) with Optional Backend API**

```
┌─────────────────────────────────────────────────────┐
│           Frontend (React + Vite)                   │
│  ┌─────────────────────────────────────────────┐   │
│  │  Browser LocalStorage (Data Persistence)    │   │
│  │  - Transactions                              │   │
│  │  - Users/Authentication                      │   │
│  │  - Budget Settings                           │   │
│  │  - Coupon Preferences                        │   │
│  │  - Virtual Card Balance                      │   │
│  └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
                        ↕ (Optional)
┌─────────────────────────────────────────────────────┐
│      Backend API Server (Express + Node.js)        │
│  ┌─────────────────────────────────────────────┐   │
│  │  Web Scraping Service                        │   │
│  │  - RetailMeNot                               │   │
│  │  - Honey                                     │   │
│  │  - Google Shopping                           │   │
│  └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

---

## 📦 Key Components

### **1. Frontend (React Application)**

#### **Technology Stack:**
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **Recharts** - Data visualization (charts/graphs)
- **LocalStorage API** - Data persistence (browser storage)

#### **Main Components:**

1. **`App.jsx`** - Main application component
   - Handles routing
   - Manages authentication state
   - Wraps pages in ProtectedRoute

2. **`Home.jsx`** (Dashboard)
   - Displays virtual card
   - Shows spending/income charts
   - Summary cards (income, expenses, savings)
   - Quick action buttons

3. **`Transactions.jsx`** - Transaction management page
   - Lists all transactions
   - Add/edit/delete transactions
   - Filter by type (income/expense)

4. **`Coupons.jsx`** - Coupon finder page
   - Search for coupons by item name
   - Connects to backend API (optional)
   - Falls back to mock data if API unavailable

5. **`TransactionAnalysis.jsx`** - Analytics page
   - Week-over-week comparisons
   - Daily spending trends
   - Category breakdowns
   - Insights and suggestions

6. **`Login.jsx`** - Authentication page
   - User login/signup
   - Default users: admin/admin123, user/user123

#### **Utility Files:**

- **`src/utils/storage.js`** - localStorage wrapper functions
- **`src/utils/transactions.js`** - Transaction CRUD operations
- **`src/utils/auth.js`** - Authentication logic (stores in localStorage)
- **`src/utils/couponSearch.js`** - Mock coupon data (fallback)
- **`src/utils/couponAPI.js`** - Backend API client

---

### **2. Backend API (Optional - Only for Coupon Scraping)**

#### **Technology Stack:**
- **Node.js** - Runtime environment
- **Express.js** - Web server framework
- **Axios** - HTTP client for web scraping
- **Cheerio** - HTML parsing (like jQuery for server)
- **Puppeteer** - Headless browser automation (for dynamic sites)

#### **Structure:**
```
server/
├── server.js              # Express server setup
├── routes/
│   └── coupons.js         # API routes for coupon search
├── services/
│   └── couponScraper.js   # Web scraping logic
└── utils/
    └── priceEstimator.js  # Price estimation utility
```

#### **API Endpoints:**
- `POST /api/coupons/search` - Search for coupons by item name
- `POST /api/coupons/search/multiple` - Search multiple items
- `GET /api/health` - Health check

**Note:** The backend is **OPTIONAL**. The app works fully without it, using mock coupon data instead.

---

## 💾 Data Storage

### **Storage Method: Browser LocalStorage**

**NO DATABASE** - All data is stored in the user's browser using the `localStorage` API.

#### **What Data is Stored:**

1. **Transactions** (`localStorage.getItem('transactions')`)
   - Income and expense records
   - Format: JSON array of transaction objects
   - Location: `src/utils/transactions.js`

2. **Users/Authentication** (`localStorage.getItem('users')`, `localStorage.getItem('currentUser')`)
   - User accounts (username, email, password, role)
   - Current session
   - Location: `src/utils/auth.js`

3. **Budget Settings** (`localStorage.getItem('budget_settings')`)
   - Weekly/monthly budget amounts
   - Current period settings
   - Location: `src/utils/storage.js`

4. **Virtual Card Balance** (`localStorage.getItem('virtualCardAmount')`, `localStorage.getItem('virtualCardInitial')`)
   - Current balance
   - Initial balance
   - Location: `src/components/VirtualCard.jsx`

5. **Coupon Preferences** (`localStorage.getItem('coupon_preferences')`)
   - User preferences for coupon search
   - Location: `src/utils/storage.js`

#### **Storage Keys (Constants):**
Defined in `src/utils/storage.js`:
```javascript
STORAGE_KEYS = {
  PANTRY_ITEMS: 'pantry_items',
  BUDGET_SETTINGS: 'budget_settings',
  SHOPPING_LIST: 'shopping_list',
  COUPON_PREFERENCES: 'coupon_preferences',
  NOTIFICATIONS: 'notifications',
  VIRTUAL_CARD_AMOUNT: 'virtualCardAmount'
}
```

#### **How Data Persists:**
- Data is automatically saved to localStorage whenever it changes
- Data persists across browser sessions (survives page refresh/close)
- Data is **device/browser-specific** (not synced across devices)
- Data can be cleared by user (browser settings or `localStorage.clear()`)

#### **Limitations:**
- **5-10MB storage limit** (browser-dependent)
- **No multi-device sync** (data stays on one device/browser)
- **No backup** (if browser data is cleared, data is lost)
- **No server-side validation** (client-side only)

---

## 🚀 Deployment

### **Type: Local Deployment**

This app is designed to run **locally on your machine** or **on any web server** that can serve static files.

#### **Frontend Deployment Options:**

1. **Development Mode** (Local):
   ```bash
   npm run dev
   # Runs on http://localhost:5173
   ```

2. **Production Build** (Static Files):
   ```bash
   npm run build
   # Creates 'dist' folder with static files
   # Can be deployed to:
   # - GitHub Pages
   # - Netlify
   # - Vercel
   # - Any static file hosting
   ```

3. **Backend API** (Optional):
   ```bash
   cd server
   npm run dev
   # Runs on http://localhost:3001
   # Can be deployed to:
   # - Heroku
   # - Railway
   # - DigitalOcean
   # - AWS/Google Cloud
   ```

#### **No Database Required:**
- Frontend doesn't need a database
- All data stored in browser localStorage
- Backend API is stateless (no data storage needed)

---

## 🔐 Authentication

### **Implementation: Client-Side Only**

- **NO server-side authentication**
- Users stored in `localStorage.getItem('users')`
- Passwords stored in **plain text** (NOT encrypted - for demo only)
- Session stored in `localStorage.getItem('currentUser')`
- **Default Users:**
  - Username: `admin`, Password: `admin123`
  - Username: `user`, Password: `user123`

**⚠️ Security Note:** This is for **demo purposes only**. In production, you should:
- Use server-side authentication
- Hash passwords (bcrypt)
- Use JWT tokens or sessions
- Connect to a proper database

---

## 📊 Data Flow

### **Transaction Flow:**
```
User adds transaction
    ↓
TransactionForm.jsx captures data
    ↓
addTransaction() in utils/transactions.js
    ↓
JSON.stringify() and save to localStorage
    ↓
Home.jsx reads from localStorage
    ↓
Displays in charts and summary cards
```

### **Coupon Search Flow:**
```
User searches for coupon
    ↓
Coupons.jsx calls couponAPI.js
    ↓
Check if backend API is available
    ↓
If YES: POST to http://localhost:3001/api/coupons/search
    ↓
Backend scrapes RetailMeNot/Honey/Google Shopping
    ↓
Return real coupons
    ↓
If NO: Use mock data from couponSearch.js
    ↓
Display results in Coupons.jsx
```

---

## 🌐 API Integration

### **Backend API (Optional):**

- **Base URL:** `http://localhost:3001/api` (development)
- **CORS:** Enabled for all origins (development only)
- **Authentication:** None (public endpoints)
- **Rate Limiting:** Not implemented (should add for production)

### **External APIs:**
- **RetailMeNot** - Web scraping (no API key needed, but may be rate-limited)
- **Honey** - Can use official API with API key (optional)
- **Google Shopping** - Web scraping (public search)

---

## 🗂️ Project Structure

```
Finance1/
├── src/
│   ├── components/          # Reusable React components
│   │   ├── Navbar.jsx
│   │   ├── VirtualCard.jsx
│   │   ├── TransactionForm.jsx
│   │   └── ErrorBoundary.jsx
│   ├── pages/               # Page components
│   │   ├── Home.jsx
│   │   ├── Transactions.jsx
│   │   ├── Coupons.jsx
│   │   ├── TransactionAnalysis.jsx
│   │   └── Login.jsx
│   ├── utils/               # Utility functions
│   │   ├── storage.js       # localStorage wrapper
│   │   ├── transactions.js  # Transaction CRUD
│   │   ├── auth.js          # Authentication
│   │   ├── couponSearch.js  # Mock coupon data
│   │   └── couponAPI.js     # Backend API client
│   ├── App.jsx              # Main app component
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── server/                  # Backend API (optional)
│   ├── server.js
│   ├── routes/
│   ├── services/
│   └── utils/
├── package.json
├── vite.config.js
└── README.md
```

---

## 🔧 Key Features & Implementation

### **1. Transaction Management**
- **Storage:** `localStorage.getItem('transactions')`
- **Format:** JSON array
- **Operations:** Create, Read, Update, Delete (CRUD)
- **Auto-save:** Every change saves to localStorage immediately

### **2. Virtual Card**
- **Balance Calculation:** Initial balance - expenses + income
- **Storage:** `virtualCardInitial`, `virtualCardAmount`
- **Updates:** Real-time when transactions are added/deleted

### **3. Dashboard Charts**
- **Library:** Recharts
- **Data Source:** localStorage transactions
- **Time Ranges:** Weekly, Monthly, Yearly
- **Chart Types:** Line chart (spending/income), Pie chart (categories)

### **4. Coupon Finder**
- **Mode 1:** Backend API (real web scraping)
- **Mode 2:** Mock data (fallback)
- **Auto-detection:** Checks API availability on page load

---

## ⚠️ Important Notes

### **Production Considerations:**

1. **Data Persistence:**
   - LocalStorage is **NOT** suitable for production with real financial data
   - Should migrate to a database (MongoDB, PostgreSQL, Firebase)
   - Should implement proper backup/sync

2. **Authentication:**
   - Current implementation is **insecure** (plain text passwords)
   - Should use server-side auth with JWT tokens
   - Should hash passwords (bcrypt)

3. **Security:**
   - No HTTPS (development only)
   - No input validation/sanitization
   - CORS open to all origins (development only)

4. **Scalability:**
   - LocalStorage has size limits
   - No user isolation (all data in one localStorage)
   - Backend scraping may be rate-limited

---

## 📝 Summary

| Aspect | Implementation |
|--------|----------------|
| **Deployment** | Local (browser-based SPA) |
| **Data Storage** | Browser localStorage (NO database) |
| **Backend** | Optional (only for coupon scraping) |
| **Authentication** | Client-side only (localStorage) |
| **Database** | None (all data in browser) |
| **Persistence** | Browser-specific, survives refresh |
| **Multi-device** | No (data not synced) |
| **Backup** | No (user must export manually) |

---

## 🎯 Quick Start

### **Run Frontend Only (No Backend):**
```bash
npm install
npm run dev
# App works fully with mock coupon data
```

### **Run with Backend API:**
```bash
# Terminal 1: Backend
cd server
npm install
npm run dev

# Terminal 2: Frontend
npm run dev
```

### **View Data in Browser:**
1. Open DevTools (F12)
2. Go to Application tab → Local Storage
3. See all stored data:
   - `transactions` - All transaction records
   - `users` - User accounts
   - `currentUser` - Active session
   - `budget_settings` - Budget configuration
   - etc.

---

This architecture is perfect for **personal use**, **prototyping**, or **demo purposes**. For production with real users, you should migrate to a proper backend database.

