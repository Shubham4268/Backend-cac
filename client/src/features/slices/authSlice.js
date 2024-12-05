import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: false,
  userData: null, // This will include the loggedInUser object as part of the backend response
};

export const authSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      state.status = true; // Mark user as logged in
      if (state.userData) {
        state.userData = {
          ...state.userData, // Preserve other fields in userData
          loggedInUser: {
            ...state.userData.loggedInUser, // Merge existing loggedInUser data
            ...action.payload, // Update with new data from the backend
          },
        };
      } else {
        state.userData = action.payload // Initialize if userData is null
    }},
    logout: (state) => {
      state.status = false; // Mark user as logged out
      state.userData = null; // Clear userData
    },
  },
});

export default authSlice.reducer;
export const { login, logout } = authSlice.actions;
