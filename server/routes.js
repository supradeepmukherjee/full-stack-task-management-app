import { Router } from 'express'
import { userValidator, validateHandler } from './lib/validators.js'
import { login, register } from './controllers/user.js'

const app = Router()

app.post('/register', userValidator(), validateHandler, register)
app.post('/login', userValidator(), validateHandler, login)

export default app