// import React from 'react'

import { Outlet } from "react-router-dom";
import { Footer, Header, Navbar } from "./components/index.js";

function App() {
  return (
    <>
      <div className="flex flex-row ">
        <Navbar />
        <div className = "bg-gray-900 flex flex-col w-full justify-between relative ">
          <Header />
        <Outlet />
        <Footer />
        </div>
        
      </div>
    </>
  );
}

export default App;
