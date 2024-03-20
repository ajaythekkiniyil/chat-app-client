import { configureStore } from '@reduxjs/toolkit'
import themeSlice from './themeSlice'
import chatSlice from './chatSlice'
import currentConversationSlice from './currentConversationSlice'

export const store = configureStore({
    reducer: {
        theme: themeSlice,
        chatOpen: chatSlice,
        currentConversation: currentConversationSlice,
    },
})