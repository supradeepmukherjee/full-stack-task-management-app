import { tryCatch } from "../middlewares/error.js"
import { Menu } from '../models/Menu.js'
import { Order } from "../models/Order.js"
import { ErrorHandler } from "../util.js"

const checkOrderPending = async (text, id) => {
    const orders = await Order.find({
        'items.itemId': id,
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
    if (!(name || category || price || availability)) return next(new ErrorHandler(400, 'No change in Item Details'))
    const orderPendingMsg = await checkOrderPending('update', req.params.id)
    if (orderPendingMsg !== false) return next(new ErrorHandler(400, orderPendingMsg))
    const item = await Menu.findById(req.params.id)
    if (!item) return next(new ErrorHandler(404, 'Menu Item not Found'))
    if (name !== undefined) item.name = name
    if (category !== undefined) item.category = category
    if (price !== undefined) item.price = price
    if (availability !== undefined) item.availability = availability
    await item.save()
    res.status(200).json({ success: true, item, msg: 'Menu Item updated Successfully' })
})

const deleteItem = tryCatch(async (req, res, next) => {
    const orderPendingMsg = await checkOrderPending('delete', req.params.id)
    if (orderPendingMsg !== false) return next(new ErrorHandler(400, orderPendingMsg))
    const item = await Menu.findByIdAndDelete(req.params.id)
    if (!item) return next(new ErrorHandler(404, 'Menu Item not Found'))
    res.status(200).json({ success: true, item, msg: 'Menu Item Deleted Successfully' })
})

export { getItems, addItem, updateItem, deleteItem }