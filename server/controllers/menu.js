import { tryCatch } from "../middlewares/error.js"
import { Menu } from '../models/Menu.js'
import { Order } from "../models/Order.js"
import { ErrorHandler } from "../util.js"

const checkOrderPending = async text => {
    const orders = await Order.find({
        'items.itemId': req.params.id,
        status: 'Pending'
    })
    if (orders.length !== 0) return `Sorry, a Menu Item can't be ${text}d before ${orders.length > 1 ? 'the orders' : 'an order'} containing the item ${orders.length > 1 ? 'are' : 'is'} completed`
    return false
}

const getItems = tryCatch(async (req, res, next) => {
    const items = await Menu.find()
    res.status(200).json({ success: true, items, msg: 'All Menu Items Fetched Successfully' })
})

const addItem = tryCatch(async (req, res, next) => {
    if (!req.body.category) req.body.category = 'Miscellaneous' // even though the category is not mandatory in the Model, I am adding a Miscellaneous category in the request body
    const item = await Menu.create(req.body)
    res.status(201).json({ success: true, item, msg: 'Menu Item added Successfully' })
})

const updateItem = tryCatch(async (req, res, next) => {
    const { name, category, price, availability } = req.body
    if (!name || !category || !price || !availability) return next(new ErrorHandler(400, 'No change in Item Details'))
    const orderPendingMsg = await checkOrderPending('update')
    if (orderPendingMsg !== false) return next(new ErrorHandler(400, orderPendingMsg))
    const item = await Menu.findById(req.params.id)
    if (!item) return next(new ErrorHandler(404, 'Menu Item not Found'))
    if (name) item.name = name
    if (category) item.category = category
    if (price) item.price = price
    if (availability) item.availability = availability
    await item.save()
    res.status(200).json({ success: true, item, msg: 'Menu Item updated Successfully' })
})

const deleteItem = tryCatch(async (req, res, next) => {
    const orderPendingMsg = await checkOrderPending('delete')
    if (orderPendingMsg !== false) return next(new ErrorHandler(400, orderPendingMsg))
    const item = await Menu.findByIdAndDelete(req.params.id)
    if (!item) return next(new ErrorHandler(404, 'Menu Item not Found'))
    res.status(200).json({ success: true, item, msg: 'Menu Item Deleted Successfully' })
})

export { getItems, addItem, updateItem, deleteItem }