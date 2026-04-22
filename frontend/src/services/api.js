import axios from 'axios';
import toast from 'react-hot-toast';

const BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach access token from store
api.interceptors.request.use(
  (config) => {
    // Multipart uploads must not use default JSON Content-Type (breaks multer / can confuse proxy)
    if (typeof FormData !== 'undefined' && config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    // Dynamically read token on each request to avoid stale closure
    try {
      const stored = JSON.parse(localStorage.getItem('phygital-auth') || '{}');
      const token = stored?.state?.accessToken;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // ignore
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue = [];

const redirectToLoginExpired = () => {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem('phygital-auth-expired', '1');
  } catch {
    // ignore
  }
  window.location.href = '/login?expired=1';
};

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

/** 401 on these routes means bad credentials or auth exchange — never try token refresh */
const isAuthRouteWithoutRefresh = (config) => {
  const url = config?.url || '';
  return (
    url.includes('/auth/login')
    || url.includes('/auth/register')
    || url.includes('/auth/refresh')
  );
};

// Auto-refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && isAuthRouteWithoutRefresh(originalRequest)) {
      const raw = error.response?.data?.message || error.message || 'Something went wrong';
      return Promise.reject(new Error(raw));
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await api.post('/auth/refresh');
        const newToken = data.data.accessToken;

        // Update stored token
        const stored = JSON.parse(localStorage.getItem('phygital-auth') || '{}');
        if (stored?.state) {
          stored.state.accessToken = newToken;
          localStorage.setItem('phygital-auth', JSON.stringify(stored));
        }

        processQueue(null, newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        // Clear auth state
        localStorage.removeItem('phygital-auth');
        toast.error('Session expired. Please log in again.');
        redirectToLoginExpired();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    const message = error.response?.data?.message || error.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export default api;
