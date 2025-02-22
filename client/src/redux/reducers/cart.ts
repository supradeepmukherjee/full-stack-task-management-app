import { createSlice } from "@reduxjs/toolkit"

export interface CartItem {
    id: string
    name: string
    price: number
    quantity: number
    category: string
}

interface CartState { items: CartItem[] }

const initialState: CartState = { items: localStorage.getItem('items') ? JSON.parse(localStorage.getItem('items') as string) : [] }

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        increment: (state, action) => {
            const existingItem = state.items.find(item => item.id === action.payload.id)
            if (existingItem) existingItem.quantity += 1
            else state.items.push({ ...action.payload, quantity: 1 })
            localStorage.setItem("items", JSON.stringify(state.items))
        },
        decrement: (state, action) => {
            const itemIndex = state.items.findIndex((item) => item.id === action.payload.id)
            if (itemIndex !== -1) {
                if (state.items[itemIndex].quantity > 1) state.items[itemIndex].quantity -= 1
                else state.items.splice(itemIndex, 1)
            }
            localStorage.setItem("items", JSON.stringify(state.items));
        },
        remove: (state, action) => {
            const itemIndex = state.items.findIndex((item) => item.id === action.payload.id)
            if (itemIndex !== -1) state.items.splice(itemIndex, 1)
            localStorage.setItem("items", JSON.stringify(state.items));
        },
        clearCart: state => {
            localStorage.removeItem('items')
            state.items = []
        },
    }
}
)

export default cartSlice
export const { decrement, increment, remove, clearCart } = cartSlice.actions