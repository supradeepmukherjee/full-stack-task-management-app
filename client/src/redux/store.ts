import { configureStore } from '@reduxjs/toolkit'
import authSlice from './reducers/auth'
import cartSlice from './reducers/cart'

const store = configureStore({
    reducer: {
        [authSlice.name]: authSlice.reducer,
        [cartSlice.name]: cartSlice.reducer,
    }
})

export default store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;