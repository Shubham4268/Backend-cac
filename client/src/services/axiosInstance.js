import axios from "axios";
import { store } from "../app/store.js";
import { logout } from "../features/slices/authSlice.js";
import { persistor } from "../app/store.js";

const BASE_URL = import.meta.env.VITE_BACKEND_BASEURL;

const axiosInstance = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
  withCredentials: true, // Always send cookies
});

// --- Token Refresh State ---
// Prevents multiple concurrent refresh calls when several requests 401 simultaneously
let isRefreshing = false;
let failedQueue = []; // Queue of requests waiting for a new token

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
axiosInstance.interceptors.response.use(
  // Success: pass through
  (response) => response,

  // Error: handle 401 Unauthorized
  async (error) => {
    const originalRequest = error.config;

    // Only try to refresh if:
    // 1. The error is 401
    // 2. We haven't already retried this request
    // 3. It's NOT the refresh-token endpoint itself (avoid infinite loop)
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/users/refresh-token")
    ) {
      if (isRefreshing) {
        // Another refresh is already in flight — queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => axiosInstance(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Attempt to get a new access token using the refresh token cookie
        await axiosInstance.post("/users/refresh-token");

        // Refresh succeeded — process the queued requests and retry original
        processQueue(null);
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Refresh failed — session is truly expired
        // Log the user out and redirect to login
        processQueue(refreshError);
        persistor.purge();
        store.dispatch(logout());

        // Only redirect if not already on the login/register page
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

export default axiosInstance;
