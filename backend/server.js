require('dotenv').config()
const dns = require('dns')
dns.setServers(['8.8.8.8', '8.8.4.4'])
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const morgan = require('morgan')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const errorHandler = require('./middleware/errorHandler')

const app = express()

// ── Security ──────────────────────────────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false, // handled by frontend
}))

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://interiorconcepts-iota.vercel.app',
  'https://interiorconcepts.vercel.app',
  process.env.FRONTEND_URL,
].filter(Boolean)

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true)
    cb(new Error('Not allowed by CORS'))
  },
  credentials: true,
}))

// Global rate limiter
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later.' },
}))

// Strict limiter for auth
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Too many login attempts, please try again in 15 minutes.' },
})

// Strict limiter for public form submissions
const formLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,
  message: { message: 'Too many submissions, please try again later.' },
})

// ── Middleware ─────────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: true, limit: '10kb' }))
if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'))

// ── Routes ─────────────────────────────────────────────────────────────────────
app.use('/api/auth', authLimiter, require('./routes/auth'))
app.use('/api/gallery', require('./routes/gallery'))
app.use('/api/videos', require('./routes/videos'))
app.use('/api/testimonials', require('./routes/testimonials'))
app.use('/api/inquiries', formLimiter, require('./routes/inquiries'))
app.use('/api/stats', require('./routes/stats'))

app.get('/api/health', (req, res) => res.json({ status: 'ok', message: 'Gauri Interiors API running' }))

// 404
app.use((req, res) => res.status(404).json({ message: 'Route not found' }))

app.use(errorHandler)

// ── Database + Start ───────────────────────────────────────────────────────────
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  family: 4,
})
  .then(async () => {
    console.log('✅ MongoDB connected')
    await seedAdmin()
    const PORT = process.env.PORT || 5000
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message)
    process.exit(1)
  })

async function seedAdmin() {
  const Admin = require('./models/Admin')
  const exists = await Admin.findOne({ username: process.env.ADMIN_USERNAME || 'admin' })
  if (!exists) {
    await Admin.create({
      username: process.env.ADMIN_USERNAME || 'admin',
      password: process.env.ADMIN_PASSWORD || 'admin123',
    })
    console.log('✅ Admin seeded — change password after first login!')
  }
}
