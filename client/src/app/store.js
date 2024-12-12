import {configureStore} from "@reduxjs/toolkit"
import { authSlice } from "../features/slices/authSlice"
import { tweetSlice } from "../features/slices/tweetSlice";

const store = configureStore({
    reducer : {
        user : authSlice.reducer,
        tweet : tweetSlice.reducer,
    }
})

export default store;