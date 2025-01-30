import { Router } from 'express'
import { menuItemIDValidator, menuItemValidator, userValidator, validateHandler } from './lib/validators.js'
import { login, register } from './controllers/user.js'
import { addItem, deleteItem, getItems, updateItem } from './controllers/menu.js'

const app = Router()

//user
app.post('/register', userValidator(), validateHandler, register)
app.post('/login', userValidator(), validateHandler, login)

// menu
app.get('/menu', getItems)
app.post('/menu', menuItemValidator(), validateHandler, addItem)
app.put('/menu/:id', menuItemIDValidator(), validateHandler, updateItem)
app.delete('/menu/:id', menuItemIDValidator(), validateHandler, deleteItem)

export default app