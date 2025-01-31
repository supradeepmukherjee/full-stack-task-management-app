import { configureStore } from '@reduxjs/toolkit'
import api from './api'
import authSlice from './reducers/auth'

const store = configureStore({
    reducer: {
        [authSlice.name]: authSlice.reducer,
        [api.reducerPath]: api.reducer,
    },
    middleware: d => d().concat(api.middleware)
})

export default store