import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import colors from 'colors'
import helmet from 'helmet'
import morgan from 'morgan'
import { errorHandler } from './middlewares/error.js'
import apiRouter from './routes/index.js'

dotenv.config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' })

// Create Express app
const app = express()

// Security & Logging Middlewares
app.use(helmet())
app.use(cors({ origin: ['http://localhost:3000'], credentials: true }))
app.use(express.json())

// Conditionally use morgan to avoid noise in tests
if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('dev'))
}

// Health Check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Ready Check
app.get('/ready', (req, res) => {
    res.json({ status: 'ready' })
})

// Routes
app.use('/api', apiRouter)

// Root Route
app.get('/', (req, res) => {
    res.send('UP100X AI API is active.')
})

// Global Error Handler
app.use(errorHandler)

export default app
