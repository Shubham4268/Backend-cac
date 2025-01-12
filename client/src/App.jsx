// import React from 'react'
import '@fontsource/ubuntu-mono';
import { Outlet } from "react-router-dom";
import { Footer, Header, Navbar } from "./components/index.js";
import axios from "axios";
axios.defaults.withCredentials = true; // This ensures that cookies are sent with each request

function App() {
  return (
    <>
      <div className="bg-gray-900 w-full flex flex-row font-mono">
        <Header />
        <Outlet />
      </div>
    </>
  );
}

export default App;
