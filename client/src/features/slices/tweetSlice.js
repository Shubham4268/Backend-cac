import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    tweetData : null
}

export const tweetSlice = createSlice({
    name : "tweet",
    initialState,
    reducers : {
        change : (state, action) => {
            state.tweetData = action.payload
        }
    }
})

export default tweetSlice.reducer
export const {change} = tweetSlice.actions;