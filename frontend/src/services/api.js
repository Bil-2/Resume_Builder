import axios from 'axios';
import toast from 'react-hot-toast';
import { withRetry, formatErrorMessage, isOnline } from '../utils/apiHelpers';

// Use environment variable in production, relative URL in development
const API_URL = import.meta.env.VITE_API_URL || '/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
let isRedirecting = false; // Prevent multiple redirects
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if request was cancelled
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    // Check network status
    if (!isOnline()) {
      toast.error('No internet connection. Please check your network.');
      return Promise.reject(error);
    }

    const message = formatErrorMessage(error);
    
    if (error.response?.status === 401) {
      // Clear auth data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('auth-storage');
      
      // Prevent multiple redirects
      if (!isRedirecting) {
        isRedirecting = true;
        toast.error('Session expired. Please login again.');
        window.location.href = '/login';
      }
    } else if (error.response?.status === 403) {
      toast.error('You do not have permission to perform this action');
    } else if (error.response?.status === 404) {
      toast.error('Resource not found');
    } else if (error.response?.status >= 500) {
      toast.error('Server error. Please try again later.');
    } else if (!axios.isCancel(error)) {
      toast.error(message);
    }
    
    return Promise.reject(error);
  }
);

// Helper to create API calls with retry logic
const createAPICall = (method, url, options = {}) => {
  return withRetry(
    () => api[method](url, options),
    {
      maxRetries: 2,
      onRetry: (attempt, delay) => {
        console.log(`Retrying request (attempt ${attempt}) after ${delay}ms...`);
      },
    }
  );
};

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  googleAuth: (data) => api.post('/auth/google', data),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
};

// Resume API
export const resumeAPI = {
  getAll: () => api.get('/resumes'),
  getById: (id) => api.get(`/resumes/${id}`),
  create: (data) => api.post('/resumes', data),
  update: (id, data) => api.put(`/resumes/${id}`, data),
  delete: (id) => api.delete(`/resumes/${id}`),
  generateSummary: (id) => api.post(`/resumes/${id}/generate-summary`),
  duplicate: (id) => api.post(`/resumes/${id}/duplicate`),
};

// Project API
export const projectAPI = {
  getAll: (params) => api.get('/projects', { params }),
  getById: (id) => api.get(`/projects/${id}`),
  create: (data) => api.post('/projects', data),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`),
};

// Course API
export const courseAPI = {
  getAll: (params) => api.get('/courses', { params }),
  getById: (id) => api.get(`/courses/${id}`),
  create: (data) => api.post('/courses', data),
  update: (id, data) => api.put(`/courses/${id}`, data),
  delete: (id) => api.delete(`/courses/${id}`),
  updateProgress: (id, progress) => api.patch(`/courses/${id}/progress`, { progress }),
};

// Achievement API
export const achievementAPI = {
  getAll: (params) => api.get('/achievements', { params }),
  getById: (id) => api.get(`/achievements/${id}`),
  create: (data) => api.post('/achievements', data),
  update: (id, data) => api.put(`/achievements/${id}`, data),
  delete: (id) => api.delete(`/achievements/${id}`),
};

// Skill API
export const skillAPI = {
  getAll: (params) => api.get('/skills', { params }),
  getById: (id) => api.get(`/skills/${id}`),
  getGrouped: () => api.get('/skills/grouped'),
  create: (data) => api.post('/skills', data),
  update: (id, data) => api.put(`/skills/${id}`, data),
  delete: (id) => api.delete(`/skills/${id}`),
};

export default api;
