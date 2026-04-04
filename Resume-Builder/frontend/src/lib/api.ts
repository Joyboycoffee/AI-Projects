import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  signup: (data: { email: string; password: string; name: string }) =>
    api.post("/api/auth/signup", data),
  login: (data: { email: string; password: string }) =>
    api.post("/api/auth/login", data),
  logout: () => api.post("/api/auth/logout"),
  getMe: () => api.get("/api/auth/me"),
};

// Resume API
export const resumeApi = {
  getAll: () => api.get("/api/resumes/"),
  getById: (id: number) => api.get(`/api/resumes/${id}`),
  create: (data: any) => api.post("/api/resumes/", data),
  update: (id: number, data: any) => api.put(`/api/resumes/${id}`, data),
  delete: (id: number) => api.delete(`/api/resumes/${id}`),
  duplicate: (id: number) => api.post(`/api/resumes/${id}/duplicate`),
  download: (id: number) => api.post(`/api/resumes/${id}/download`),
  optimize: (id: number, data: { section: string; content: string }) =>
    api.post(`/api/resumes/${id}/optimize`, data),
};

// Payment API
export const paymentApi = {
  createCheckoutSession: (data: {
    price_id: string;
    success_url: string;
    cancel_url: string;
  }) => api.post("/api/payments/create-checkout-session", data),
  createPortalSession: (return_url: string) =>
    api.post("/api/payments/create-portal-session", { return_url }),
  getSubscriptionStatus: () => api.get("/api/payments/subscription-status"),
};

// AI API
export const aiApi = {
  optimize: (section: string, content: string) =>
    api.post("/api/ai/optimize", { section, content }),
  suggestKeywords: (jobTitle: string) =>
    api.post("/api/ai/suggest-keywords", { job_title: jobTitle }),
  getStatus: () => api.get("/api/ai/status"),
};

// Download API
export const downloadApi = {
  getAll: () => api.get("/api/downloads/"),
  getStats: () => api.get("/api/downloads/stats"),
};
