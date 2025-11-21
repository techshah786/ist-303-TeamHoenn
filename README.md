# Finance Tracker - Budget & Coupon Finder

A comprehensive budget tracking and coupon finding application that helps you manage your finances, track expenses, and find the best deals online.

## Features

### Budget Management
- Track income and expenses with detailed transactions
- Set weekly or monthly budgets
- Visual dashboard with spending breakdowns by category
- Real-time budget tracking and alerts
- Transaction analysis with week-over-week comparisons

### Coupon Finder
- **Real Web Scraping**: Backend API scrapes real coupons from RetailMeNot, Honey, and Google Shopping
- Search for coupons by item name
- Direct product links and store addresses
- Discount codes and savings calculations
- Category-based pricing estimates
- Store-specific or general coupon preferences

### Virtual Card
- Track virtual card balance
- Automatically updates with transactions
- Editable initial balance

### Transaction Management
- Manual transaction entry (income/expense)
- Category-based organization
- Detailed transaction history
- Delete and filter transactions

### Transaction Analysis
- Weekly spending comparisons
- Daily spending trends
- Top spending categories
- Top purchased items
- Insights and suggestions based on spending habits

## Setup Instructions

### Frontend Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

   Frontend will run on `http://localhost:5173`

### Backend API Setup (For Real Coupon Scraping)

1. **Install Backend Dependencies**
   ```bash
   cd server
   npm install
   ```

2. **Start Backend Server**
   ```bash
   npm run dev:server
   ```

   Or from root directory:
   ```bash
   npm run dev:server
   ```

   Backend API will run on `http://localhost:3001`

3. **Run Both Frontend and Backend Together**
   ```bash
   npm run dev:all
   ```

### Environment Variables (Optional)

Create a `.env` file in the `server` directory:

```env
PORT=3001
NODE_ENV=development
# Optional: API keys for coupon services
# HONEY_API_KEY=your_api_key_here
# RETAILMENOT_API_KEY=your_api_key_here
```

## Technology Stack

### Frontend
- React 18
- Vite
- React Router DOM
- Recharts (data visualization)
- Local Storage (data persistence)

### Backend
- Node.js/Express
- Puppeteer (web scraping)
- Cheerio (HTML parsing)
- Axios (HTTP requests)
- CORS enabled

## Project Structure

```
├── src/
│   ├── components/         # React components
│   │   ├── Navbar.jsx
│   │   ├── VirtualCard.jsx
│   │   ├── TransactionForm.jsx
│   │   └── ErrorBoundary.jsx
│   ├── pages/              # Page components
│   │   ├── Home.jsx        # Dashboard
│   │   ├── Transactions.jsx
│   │   ├── Coupons.jsx
│   │   ├── TransactionAnalysis.jsx
│   │   └── Login.jsx
│   └── utils/              # Utility functions
│       ├── auth.js
│       ├── transactions.js
│       ├── couponSearch.js  # Mock data (fallback)
│       └── couponAPI.js     # API client
├── server/                 # Backend API
│   ├── server.js          # Express server
│   ├── routes/            # API routes
│   │   └── coupons.js
│   ├── services/          # Business logic
│   │   └── couponScraper.js
│   └── utils/             # Utilities
│       └── priceEstimator.js
└── package.json
```
## Team Members
- Cesar
- Shah
- Ucheoma
- Shawn
- Sameer


Private project

