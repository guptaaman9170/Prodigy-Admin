import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const API_BASE_URL = "https://dummyjson.com";
export const TOKEN_STORAGE_KEY = "prodigy_auth_token";
export const USER_STORAGE_KEY = "prodigy_auth_user";

// Shared Axios client instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request Interceptor: Attach authorization token to every outgoing request
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem(TOKEN_STORAGE_KEY);
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Centralized error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError<{ message?: string }>) => {
    if (typeof window !== "undefined") {
      const status = error.response?.status;

      // Handle 401 Unauthorized session expiration
      if (status === 401) {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        localStorage.removeItem(USER_STORAGE_KEY);

        // Notify app if listener is active
        window.dispatchEvent(new CustomEvent("auth:unauthorized"));

        // Only redirect if not already on the login page
        if (!window.location.pathname.startsWith("/login")) {
          const redirectUrl = `/login?expired=1&returnUrl=${encodeURIComponent(
            window.location.pathname + window.location.search
          )}`;
          // eslint-disable-next-line @next/next/no-location-assign-relative-destination
          window.location.href = redirectUrl;
        }
      }
    }

    // Extract a clear, readable message
    const formattedMessage =
      error.response?.data?.message ||
      error.message ||
      "An unexpected network or server error occurred.";

    const customError = new Error(formattedMessage);
    (customError as unknown as { originalError: AxiosError }).originalError = error;
    (customError as unknown as { status?: number }).status = error.response?.status;

    return Promise.reject(customError);
  }
);

export default apiClient;
