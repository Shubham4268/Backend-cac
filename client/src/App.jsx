// import React from 'react'

import { Outlet } from "react-router-dom";

function App() {
  return (
    <>
      <div className="bg-gray-900">
        <Outlet />
      </div>
    </>
  );
}

export default App;
