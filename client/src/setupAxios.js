import axios from "axios";
import { store, persistor } from "./app/store.js";
import { logout } from "./features/slices/authSlice.js";

// --- Global Axios Configuration ---
axios.defaults.withCredentials = true;

// Prevents multiple concurrent refresh calls when several requests 401 simultaneously
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

// --- Response Interceptor ---
axios.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // Only try to refresh if: 401, haven't retried yet, and not the refresh endpoint itself
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/users/refresh-token") &&
      !originalRequest.url?.includes("/users/login")
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => axios(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await axios.post(
          `${import.meta.env.VITE_BACKEND_BASEURL}/api/v1/users/refresh-token`,
          {},
          { withCredentials: true }
        );

        processQueue(null);
        return axios(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        
        // Clear session and state
        persistor.purge();
        store.dispatch(logout());

        if (
          !window.location.pathname.includes("/login") &&
          !window.location.pathname.includes("/register")
        ) {
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axios;
