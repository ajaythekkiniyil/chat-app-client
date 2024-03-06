import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    value: false,
}

export const chatSlice = createSlice({
    name: 'chatOpen',
    initialState,
    reducers: {
        openChat: (state) => {
            state.value = !(state.value)
        }
    }
})

export const { openChat } = chatSlice.actions

export default chatSlice.reducer