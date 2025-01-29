import mongoose, { model, Schema } from 'mongoose'
import { Menu } from './Menu.js'

const schema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FoodUser'
    },
    items: [{
        itemId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Menu'
        },
        quantity: {
            type: Number,
            min: [1, 'Quantity of the items has to be atleast 1']
        }
    }],
    totalAmount: {
        type: Number,
        default: 0,
    },
    status: {
        type: String,
        enum: {
            values: ['Pending', 'Completed'],
            message: 'Invalid Status of Order'
        }
    }
},
    {
        timestamps: {
            createdAt: true,
            updatedAt: false
        }
    }
)

schema.pre('save', async function (next) {
    if (!this.isModified('items')) return next()
    let total = 0
    for (const item of this.items) {
        const menuItem = await Menu.findById(item.itemId)
        if (menuItem) total += menuItem.price * item.quantity
    }
    this.totalPrice = total
    next()
});

export const Order = mongoose.models.FoodOrder || model('FoodOrder', schema) // I am naming it FoodOrder because another model named 'Order' is already in use.