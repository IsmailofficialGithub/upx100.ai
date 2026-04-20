import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import colors from 'colors'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`.bgGreen.black)
})