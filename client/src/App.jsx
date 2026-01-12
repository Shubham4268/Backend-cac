// import React from 'react'
import { Outlet } from "react-router-dom";
import { Footer, Header, Navbar } from "./components/index.js";
import axios from "axios";
import { useSelector } from "react-redux";
import { Loader } from "lucide-react";
axios.defaults.withCredentials = true; // This ensures that cookies are sent with each request

function App() {
  const theme = useSelector((state) => state.theme.theme);

  return (
    <>
      <div
        className={`w-full flex flex-row font-sans min-h-screen ${
          theme === "dark"
            ? "bg-gray-900 text-white"
            : "bg-gradient-to-b from-gray-200 to-white text-gray-900"
        }`}
      >
        <Header />
        <Outlet />
      </div>
      <Footer />
    </>
  );
}

export default App;
