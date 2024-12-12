import {configureStore} from "@reduxjs/toolkit"
import { authSlice } from "../features/slices/authSlice"
import { tweetSlice } from "../features/slices/tweetSlice";
import { searchSlice } from "../features/slices/searchSlice";

const store = configureStore({
    reducer : {
        user : authSlice.reducer,
        tweet : tweetSlice.reducer,
        search : searchSlice.reducer
    }
})

export default store;