import {configureStore} from "@reduxjs/toolkit"
import { authSlice } from "../features/slices/authSlice"

export const store = configureStore({
    reducer : {
        auth : authSlice
    }
})
