import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import couponRoutes from './routes/coupons.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use('/api/coupons', couponRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Coupon API server is running' })
})

app.listen(PORT, () => {
  console.log(`🚀 Coupon API server running on http://localhost:${PORT}`)
  console.log(`📡 API endpoints available at http://localhost:${PORT}/api/coupons`)
})

