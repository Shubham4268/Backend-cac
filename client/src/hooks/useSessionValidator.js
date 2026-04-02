import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "../features/slices/authSlice.js";
import { setLoading } from "../features/slices/loaderSlice.js";
import { persistor } from "../app/store.js";
import axiosInstance from "../services/axiosInstance.js";

/**
 * Validates the current session against the backend on every app load.
 *
 * If the persisted Redux state says the user is logged in, this hook
 * hits GET /users/current-user to verify the session is still alive on
 * the server. If it is not (401 / cookie expired), it clears Redux and
 * the persisted localStorage state so the user is sent back to /login.
 *
 * Returns `{ validating }` — true while the check is in flight so that
 * AuthLayout can show a loading state instead of a premature redirect.
 */
export function useSessionValidator() {
  const dispatch = useDispatch();
  const authStatus = useSelector((state) => state.user.status);
  const [validating, setValidating] = useState(authStatus); // only validate when supposedly logged in

  useEffect(() => {
    // No persisted session → nothing to validate
    if (!authStatus) {
      setValidating(false);
      return;
    }

    let cancelled = false;

    const validate = async () => {
      dispatch(setLoading(true));
      try {
        const response = await axiosInstance.post(`/users/current-user`);
        if (!cancelled && response.data?.success) {
          // Refresh Redux with the latest user data from the server
          dispatch(login(response.data.data));
        }
      } catch (error) {
        // Only log out if the backend explicitly rejected our session (401).
        // (Note: the global interceptor also handles retries and logouts, 
        //  but this acts as a final safety net for the hook itself.)
        // We do NOT log out on 500s or Network Errors, so the user doesn't lose state if the API goes down.
        if (!cancelled && error?.response?.status === 401) {
          persistor.purge();
          dispatch(logout());
        }
      } finally {
        if (!cancelled) setValidating(false);
        dispatch(setLoading(false));
      }
    };

    validate();

    return () => {
      cancelled = true;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount only

  return { validating };
}
