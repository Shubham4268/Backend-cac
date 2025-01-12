import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false, // Initial state for loader
};

export const loaderSlice = createSlice({
  name: "loader",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload; // Set loading to true/false
    },
  },
});

export const { setLoading } = loaderSlice.actions;
export default loaderSlice.reducer;
