import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: (username: string, password: string) =>
    api.post('/api/admin/login', new URLSearchParams({ username, password }), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    }),
  setup: () => api.post('/api/admin/setup'),
};

// Images API
export const imagesApi = {
  getAll: () => api.get('/api/images'),
  upload: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/api/images/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  delete: (id: number) => api.delete(`/api/images/${id}`),
};

// Project Categories API
export const projectCategoriesApi = {
  getAll: () => api.get('/api/project-categories'),
  create: (data: { name: string; description?: string; sort_order?: number }) =>
    api.post('/api/project-categories', data),
  update: (id: number, data: { name: string; description?: string; sort_order?: number }) =>
    api.put(`/api/project-categories/${id}`, data),
  delete: (id: number) => api.delete(`/api/project-categories/${id}`),
};

// Projects API
export const projectsApi = {
  getAll: () => api.get('/api/projects'),
  getById: (id: number) => api.get(`/api/projects/${id}`),
  create: (data: {
    title: string;
    category_id: number;
    description: string;
    full_description?: string;
    image_url?: string;
    technologies: string[];
    role: string;
    duration: string;
    achievements: string[];
    sort_order?: number;
  }) => api.post('/api/projects', data),
  update: (id: number, data: {
    title: string;
    category_id: number;
    description: string;
    full_description?: string;
    image_url?: string;
    technologies: string[];
    role: string;
    duration: string;
    achievements: string[];
    sort_order?: number;
  }) => api.put(`/api/projects/${id}`, data),
  delete: (id: number) => api.delete(`/api/projects/${id}`),
};

// Experiences API
export const experiencesApi = {
  getAll: () => api.get('/api/experiences'),
  create: (data: {
    type: 'education' | 'work';
    title: string;
    organization: string;
    location?: string;
    start_date: string;
    end_date?: string;
    description?: string;
    highlights: string[];
    image_url?: string;
    sort_order?: number;
  }) => api.post('/api/experiences', data),
  update: (id: number, data: {
    type: 'education' | 'work';
    title: string;
    organization: string;
    location?: string;
    start_date: string;
    end_date?: string;
    description?: string;
    highlights: string[];
    image_url?: string;
    sort_order?: number;
  }) => api.put(`/api/experiences/${id}`, data),
  delete: (id: number) => api.delete(`/api/experiences/${id}`),
};

// Skill Categories API
export const skillCategoriesApi = {
  getAll: () => api.get('/api/skill-categories'),
  create: (data: { name: string; sort_order?: number }) =>
    api.post('/api/skill-categories', data),
  delete: (id: number) => api.delete(`/api/skill-categories/${id}`),
};

// Skills API
export const skillsApi = {
  create: (data: { category_id: number; name: string; level?: number; sort_order?: number }) =>
    api.post('/api/skills', data),
  update: (id: number, data: { category_id: number; name: string; level?: number; sort_order?: number }) =>
    api.put(`/api/skills/${id}`, data),
  delete: (id: number) => api.delete(`/api/skills/${id}`),
};

// Social Links API
export const socialLinksApi = {
  getAll: () => api.get('/api/social-links'),
  create: (data: { platform: string; icon_type: string; url: string; label?: string; sort_order?: number }) =>
    api.post('/api/social-links', data),
  update: (id: number, data: { platform: string; icon_type: string; url: string; label?: string; sort_order?: number }) =>
    api.put(`/api/social-links/${id}`, data),
  delete: (id: number) => api.delete(`/api/social-links/${id}`),
};

// Profile API
export const profileApi = {
  get: () => api.get('/api/profile'),
  update: (data: {
    name?: string;
    title?: string;
    subtitle?: string;
    bio?: string;
    email?: string;
    phone?: string;
    location?: string;
  }) => api.put('/api/profile', data),
};

// Public API (no auth required)
export const publicApi = {
  getProfile: () => axios.get(`${API_BASE_URL}/api/profile`),
  getProjects: () => axios.get(`${API_BASE_URL}/api/projects`),
  getProjectCategories: () => axios.get(`${API_BASE_URL}/api/project-categories`),
  getExperiences: () => axios.get(`${API_BASE_URL}/api/experiences`),
  getSkillCategories: () => axios.get(`${API_BASE_URL}/api/skill-categories`),
  getSocialLinks: () => axios.get(`${API_BASE_URL}/api/social-links`),
  getImages: () => axios.get(`${API_BASE_URL}/api/images`),
};

export default api;
