import { configureStore } from '@reduxjs/toolkit'
import api from './api'
import authSlice from './reducers/auth'
import cartSlice from './reducers/cart'

const store = configureStore({
    reducer: {
        [authSlice.name]: authSlice.reducer,
        [cartSlice.name]: cartSlice.reducer,
        [api.reducerPath]: api.reducer,
    },
    middleware: d => d().concat(api.middleware)
})

export default store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;