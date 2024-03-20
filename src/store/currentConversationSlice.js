import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: null,
}

export const currentConversationSlice = createSlice({
    name: 'currentConversation',
    initialState,
    reducers: {
        setCurrentConversation: (state, action) => {
            state.value = action.payload.id
        }
    }
})

export const { setCurrentConversation } = currentConversationSlice.actions

export default currentConversationSlice.reducer