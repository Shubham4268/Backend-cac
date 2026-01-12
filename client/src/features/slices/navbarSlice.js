import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  collapsed: true,
};

const navbarSlice = createSlice({
  name: "navbar",
  initialState,
  reducers: {
    toggleNavbar: (state) => {
      state.collapsed = !state.collapsed;
    },
    setNavbarCollapsed: (state, action) => {
      state.collapsed = action.payload;
    },
  },
});

export const { toggleNavbar, setNavbarCollapsed } = navbarSlice.actions;
export { navbarSlice };