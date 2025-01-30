import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import { errorMiddleware } from './middlewares/error.js'
import routes from './routes.js'

dotenv.config({ path: './.env' })

const envMode = process.env.NODE_ENV.trim() || 'PRODUCTION'

const app = express()

app.use(express.json())
app.use(cors({
    origin: [
        'http://localhost:5173',
        'http://localhost:4173',
        'http://127.0.0.1:5173',
        'http://127.0.0.1:4173',
        process.env.CLIENT_URL,
    ]
}))

app.use('/api', routes)

app.use(errorMiddleware)

export { envMode }
export default app