import { configureStore } from "@reduxjs/toolkit"
import themeSlice from './themeSlice'
import chatSlice from './chatSlice'
import currentConversationSlice from './currentConversationSlice'
import storage from 'redux-persist/lib/storage'
import { persistStore, persistReducer } from 'redux-persist'
import { combineReducers } from 'redux'

const rootReducer = combineReducers({
    theme: themeSlice,
    chatOpen: chatSlice,
    currentConversation: currentConversationSlice,
})

const persistConfig = {
    key: 'root',
    storage,
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore these action types
                ignoredActions: ['persist/PERSIST']
            },
        })
})

export const persistor = persistStore(store)