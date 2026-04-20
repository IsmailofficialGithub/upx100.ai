import express from 'express'
import 'express-async-errors'
import cors from 'cors'
import dotenv from 'dotenv'
import colors from 'colors'
import helmet from 'helmet'
import morgan from 'morgan'
import { errorHandler } from './middlewares/error.js'
import apiRouter from './routes/index.js'

dotenv.config()

// Create Express app
const app = express()

// Security & Logging Middlewares
app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

// Health Check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Ready Check (Simple for now, will add DB checks later)
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

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`.bgGreen.black)
})