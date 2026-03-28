import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: false,
  userData: null,
};

export const authSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      state.status = true;

      // Strip tokens — only keep the loggedInUser object.
      // The backend returns { loggedInUser, accessToken, refreshToken }.
      // Tokens live in httpOnly cookies; they must NOT be persisted to localStorage.
      const loggedInUser =
        action.payload?.loggedInUser ?? action.payload;

      state.userData = { loggedInUser };
    },
    logout: (state) => {
      state.status = false;
      state.userData = null;
    },
  },
});

export default authSlice.reducer;
export const { login, logout } = authSlice.actions;
