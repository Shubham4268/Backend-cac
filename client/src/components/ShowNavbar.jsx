import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";

const ShowNavbar = ({ children }) => {
  const location = useLocation();
  const [showNav, setShowNav] = useState(false);

  useEffect(() => {
    console.log(location);
    if (location.pathname === "/login" || location.pathname === "/") {
      setShowNav(false);
    } else {
      setShowNav(true);
    }
  }, [location]);

  return (
    <div>
      {showNav && <Navbar />}
      {children}
    </div>
  );
};
export default ShowNavbar;
