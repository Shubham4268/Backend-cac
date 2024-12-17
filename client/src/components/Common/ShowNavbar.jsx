import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../Navbar"; // Adjust the import as per your setup
import { matchPath } from "react-router-dom"; // To match dynamic routes

const ShowNavbar = ({ children }) => {
  const location = useLocation();
  const [showNav, setShowNav] = useState(false);

  
  useEffect(() => {
    const noNavbar = ["/login", "/", "/video/:id"];
    const shouldHideNavbar = noNavbar.some((route) =>
      matchPath(route, location.pathname)
    );

    setShowNav(!shouldHideNavbar);
  }, [location]);

  return (
    <div>
      {showNav && <Navbar />}
      {children}
    </div>
  );
};

export default ShowNavbar;
