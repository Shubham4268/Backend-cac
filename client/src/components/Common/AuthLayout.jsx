/* This file makes sure that the user is authenticated and checks if authentication is required or not.
 */
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";

export default function Protected({ children, authentication = true }) {
  const navigate = useNavigate();
  const authStatus = useSelector((state) => state.user.status);

  useEffect(() => {
    // Check if authentication is required and user is not authenticated
    if (authentication && !authStatus) {
      navigate("/login"); // Redirect to the login page
    }
    // Check if authentication is not required and user is authenticated
    else if (!authentication && authStatus) {
      navigate("/home"); // Redirect to the home page
    }
  }, [authStatus, navigate, authentication]);

  return <>{children}</>;
}
