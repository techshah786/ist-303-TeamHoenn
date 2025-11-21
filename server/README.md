# Coupon Scraper API Server

Backend API server for real-time coupon and deal scraping.

## Features

- Real web scraping from coupon sites (RetailMeNot, Honey, Google Shopping)
- RESTful API endpoints
- CORS enabled for frontend integration
- Price estimation based on item categories
- Error handling and fallbacks

## Setup

1. **Install Dependencies**
   ```bash
   cd server
   npm install
   ```

2. **Configure Environment** (optional)
   ```bash
   cp .env.example .env
   # Edit .env with your API keys if needed
   ```

3. **Start Server**
   ```bash
   npm run dev
   ```

   Server will run on `http://localhost:3001`

## API Endpoints

### POST `/api/coupons/search`
Search for coupons by item name.

**Request Body:**
```json
{
  "itemName": "bread",
  "preferences": {
    "preference": "cheapest",
    "storeSpecific": ["target"],
    "general": true
  }
}
```

**Response:**
```json
{
  "success": true,
  "itemName": "bread",
  "estimatedPrice": 3.50,
  "coupons": [
    {
      "type": "website",
      "title": "Bread Deal",
      "code": "BAKE20",
      "discount": 20,
      "store": "Target",
      "storeInfo": {
        "name": "Target",
        "website": "https://www.target.com",
        "isPhysical": true,
        "sampleAddress": "..."
      },
      "productLink": "https://www.target.com/...",
      "validUntil": "2024-12-31",
      "source": "RetailMeNot"
    }
  ],
  "count": 1,
  "timestamp": "2024-11-20T..."
}
```

### POST `/api/coupons/search/multiple`
Search for coupons for multiple items at once.

**Request Body:**
```json
{
  "items": ["bread", "laptop", "shirt"],
  "preferences": {}
}
```

### GET `/api/health`
Health check endpoint.

## Scraping Sources

The server scrapes coupons from:
1. **RetailMeNot** - Popular coupon site
2. **Honey** - Deal finder (requires API key for full access)
3. **Google Shopping** - Price comparisons and deals

## Notes

- Web scraping may be rate-limited or blocked by some sites
- In production, consider using official APIs when available
- Add proper rate limiting and caching for production use
- Some sites may require authentication or API keys

