import { Router } from 'express'
import { addItem, deleteItem, getItems, updateItem } from './controllers/menu.js'
import { createOrder, getOrders } from './controllers/order.js'
import { getUserDetails, login, register } from './controllers/user.js'
import { menuItemIDValidator, menuItemValidator, orderValidator, userValidator, validateHandler } from './lib/validators.js'
import { isAuthenticated } from './middlewares/auth.js'

const app = Router()

//user
app.post('/register', userValidator(), validateHandler, register)
app.post('/login', userValidator(), validateHandler, login)
app.post('/user', getUserDetails)

// menu
app.get('/menu', getItems)
app.post('/menu', menuItemValidator(), validateHandler, addItem)
app.put('/menu/:id', menuItemIDValidator(), validateHandler, updateItem)
app.delete('/menu/:id', menuItemIDValidator(), validateHandler, deleteItem)

app.use(isAuthenticated)
app.post('/order', orderValidator(), validateHandler, createOrder)
app.get('/orders', getOrders)

export default app