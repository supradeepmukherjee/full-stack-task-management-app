import mongoose, { model, Schema } from 'mongoose'

const schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    category: String,
    price: {
        type: Number,
        required: true,
    },
    availability: {
        type: Boolean,
        required: true,
    },

})

export const Menu = mongoose.models.Menu || model('Menu', schema)