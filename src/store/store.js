import { configureStore } from '@reduxjs/toolkit'
import themeSlice from './themeSlice'
import chatSlice from './chatSlice'

export const store = configureStore({
    reducer: {
        theme: themeSlice,
        chatOpen: chatSlice,
    },
})