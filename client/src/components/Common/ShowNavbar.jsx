import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../Navbar"; // Adjust the import as per your setup
import { matchPath } from "react-router-dom"; // To match dynamic routes
import { useSelector } from "react-redux";

const ShowNavbar = ({ children }) => {
  const location = useLocation();
  const [showNav, setShowNav] = useState(false);


  const authStatus = useSelector((state) => state.user.status);

  useEffect(() => {
    let shouldHideNavbar = false;
    if (location.pathname === "/login" || location.pathname === "/register") {
      shouldHideNavbar = true;
    } else if (location.pathname === "/" && !authStatus) {
      shouldHideNavbar = true;
    }

    setShowNav(!shouldHideNavbar);
  }, [location, authStatus]);

  return (
    <div>
      {showNav && <Navbar />}
      {children}
    </div>
  );
};

export default ShowNavbar;
