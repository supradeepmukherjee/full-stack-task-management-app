import { tryCatch } from "../middlewares/error.js"
import { Order } from "../models/Order.js"

const createOrder = tryCatch(async (req, res, next) => {
    const order = await Order.create({
        ...req.body,
        userId: req.user,
        status: 'Pending'
    })
    res.status(201).json({ success: true, order, msg: 'Order Placed Successfully' })
})

const getOrders = tryCatch(async (req, res, next) => {
    const orders = await Order.find({ userId: req.user }).populate('items.itemId', '-availability')
    res.status(200).json({ success: true, orders, msg: 'All Orders of Logged-in User Fetched Successfully' })
})

export { createOrder, getOrders }
