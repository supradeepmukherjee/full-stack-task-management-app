import { hash } from 'bcrypt'
import mongoose, { model, Schema } from 'mongoose'

const schema = new Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
        minLength: 8
    },
})

schema.pre('save', async function (next) {
    if (!this.isModified('password')) return next()
    this.password = await hash(this.password, 10)
})

export const User = mongoose.models.FoodUser || model('FoodUser', schema) //  I am naming it FoodUser because another model named 'User' is already in use.