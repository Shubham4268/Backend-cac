/* This file makes sure that the user is authenticated and checks if authentication is required or not. */
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useSessionValidator } from "../../hooks/useSessionValidator.js";

export default function Protected({ children, authentication = true }) {
  const navigate = useNavigate();
  const authStatus = useSelector((state) => state.user.status);

  // Wait for the session validation to finish before making any routing decisions.
  // This prevents a flash-redirect to /login on a valid session due to stale Redux state.
  const { validating } = useSessionValidator();

  useEffect(() => {
    if (validating) return; // Don't redirect while validating

    if (authentication && !authStatus) {
      navigate("/login");
    } else if (!authentication && authStatus) {
      navigate("/home");
    }
  }, [authStatus, navigate, authentication, validating]);

  // Render nothing (blank screen) while session check is in flight
  if (validating) return null;

  return <>{children}</>;
}
