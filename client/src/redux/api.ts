import { server } from '@/constant'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query'

const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: server }),
    endpoints: ({ mutation, query }) => ({
        
    })
})

export default api
// export const { } = api