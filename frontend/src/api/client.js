import axios from 'axios';

// Render production backend API URL
const RENDER_PROD_API = 'https://petla-siva-portfolio.onrender.com/api';

// Use VITE_API_URL if available; in dev fallback to '/api' for Vite dev proxy; in production fallback to direct Render API
const API_BASE =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? '/api' : RENDER_PROD_API);

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getBackendOrigin = () => {
  if (import.meta.env.VITE_BACKEND_URL) {
    return import.meta.env.VITE_BACKEND_URL.replace(/\/+$/, '');
  }
  if (import.meta.env.VITE_API_URL) {
    try {
      const parsed = new URL(import.meta.env.VITE_API_URL, typeof window !== 'undefined' ? window.location.origin : 'http://localhost');
      return parsed.origin;
    } catch {
      // fallback
    }
  }
  if (import.meta.env.DEV) {
    // In dev mode, Vite proxy forwards /media to backend
    return '';
  }
  return 'https://petla-siva-portfolio.onrender.com';
};

export const getFullImageUrl = (url) => {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (!trimmed) return '';

  // 1. Preserve local object previews and inline data
  if (trimmed.startsWith('data:') || trimmed.startsWith('blob:')) {
    return trimmed;
  }

  // 2. If already an absolute URL
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    // Upgrade insecure Render backend requests to HTTPS to eliminate mixed-content blocking
    if (trimmed.startsWith('http://') && trimmed.includes('onrender.com')) {
      return 'https://' + trimmed.slice(7);
    }
    return trimmed;
  }

  // 3. Normalize relative media path
  let cleanPath = trimmed.replace(/^\/+/, '');
  if (cleanPath.startsWith('media/')) {
    cleanPath = cleanPath.slice(6);
  }
  const mediaPath = `/media/${cleanPath}`;

  const backendOrigin = getBackendOrigin();
  return `${backendOrigin}${mediaPath}`;
};

export const resolveAvatarUrl = (profile, fallback = '/petla_siva_kumar.jpg') => {
  if (!profile) return fallback;
  const rawUrl = profile.avatar_display_url || profile.avatar_url;
  const resolved = getFullImageUrl(rawUrl);
  return resolved || fallback;
};

export const ALLOWED_IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp'];
export const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

export const validateImageFile = (file) => {
  if (!file) {
    return { valid: false, error: 'No file selected.' };
  }
  const ext = file.name ? file.name.slice(file.name.lastIndexOf('.')).toLowerCase() : '';
  const allowedExts = ['.png', '.jpg', '.jpeg', '.webp'];
  const allowedMime = ['image/png', 'image/jpeg', 'image/webp'];

  if (!allowedExts.includes(ext) && !allowedMime.includes(file.type?.toLowerCase())) {
    return {
      valid: false,
      error: `Invalid file format (${ext || file.type || 'unknown'}). Only PNG, JPG, JPEG, and WEBP images are supported.`,
    };
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `File size exceeds the 10MB limit (${sizeMb} MB). Please choose a smaller image.`,
    };
  }

  return { valid: true, error: null };
};

// Attach JWT token and cache-busting parameter to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Force cache-busting for all GET requests so Device A and Device B always get live PostgreSQL data
  if (config.method?.toLowerCase() === 'get') {
    config.params = {
      ...config.params,
      _t: Date.now(),
    };
  }
  return config;
}, (error) => Promise.reject(error));

export const logoutApi = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('auth-logout'));
  }
};

// Intercept 401s for token refresh and session invalidation
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest?._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const res = await axios.post(`${API_BASE}/auth/token/refresh/`, {
            refresh: refreshToken,
          });
          const newAccessToken = res.data.access;
          localStorage.setItem('access_token', newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        } catch {
          logoutApi();
          if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
            window.location.href = '/admin/login';
          }
        }
      } else {
        logoutApi();
        if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
          window.location.href = '/admin/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;

/* Auth API */
export const loginApi = async (username, password) => {
  const res = await api.post('/auth/login/', { username, password });
  if (res.data.access) {
    localStorage.setItem('access_token', res.data.access);
    localStorage.setItem('refresh_token', res.data.refresh);
  }
  return res.data;
};

export const fetchCurrentUser = async () => {
  const res = await api.get('/auth/me/');
  return res.data;
};

const extractArray = (data) => {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.results)) return data.results;
  return [];
};

/* Public & Admin API calls */
export const fetchProfile = async () => {
  const res = await api.get('/profile/');
  return res.data;
};

export const updateProfile = async (id, data) => {
  const isFormData = data instanceof FormData;
  const res = await api.put(`/profile/${id}/`, data, {
    headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
  });
  return res.data;
};

export const fetchProjects = async (params = {}) => {
  const res = await api.get('/projects/', { params });
  return extractArray(res.data);
};

export const fetchProjectBySlug = async (slug) => {
  const res = await api.get(`/projects/by-slug/${slug}/`);
  return res.data;
};

export const fetchProjectById = async (id) => {
  const res = await api.get(`/projects/${id}/`);
  return res.data;
};

export const createProject = async (data) => {
  const isFormData = data instanceof FormData;
  const res = await api.post('/projects/', data, {
    headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
  });
  return res.data;
};

export const updateProject = async (id, data) => {
  const isFormData = data instanceof FormData;
  const res = await api.put(`/projects/${id}/`, data, {
    headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
  });
  return res.data;
};

export const deleteProject = async (id) => {
  const res = await api.delete(`/projects/${id}/`);
  return res.data;
};

export const toggleProjectPublish = async (id) => {
  const res = await api.post(`/projects/${id}/toggle_published/`);
  return res.data;
};

export const toggleProjectFeature = async (id) => {
  const res = await api.post(`/projects/${id}/toggle_featured/`);
  return res.data;
};

/* Experience */
export const fetchExperiences = async () => {
  const res = await api.get('/experience/');
  return extractArray(res.data);
};

export const createExperience = async (data) => {
  const isFormData = data instanceof FormData;
  const res = await api.post('/experience/', data, {
    headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
  });
  return res.data;
};

export const updateExperience = async (id, data) => {
  const isFormData = data instanceof FormData;
  const res = await api.put(`/experience/${id}/`, data, {
    headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
  });
  return res.data;
};

export const deleteExperience = async (id) => {
  const res = await api.delete(`/experience/${id}/`);
  return res.data;
};

/* Education */
export const fetchEducation = async () => {
  const res = await api.get('/education/');
  return extractArray(res.data);
};

export const createEducation = async (data) => {
  const res = await api.post('/education/', data);
  return res.data;
};

export const updateEducation = async (id, data) => {
  const res = await api.put(`/education/${id}/`, data);
  return res.data;
};

export const deleteEducation = async (id) => {
  const res = await api.delete(`/education/${id}/`);
  return res.data;
};

/* Skills */
export const fetchSkills = async (category = '') => {
  const params = category ? { category } : {};
  const res = await api.get('/skills/', { params });
  return extractArray(res.data);
};

export const createSkill = async (data) => {
  const res = await api.post('/skills/', data);
  return res.data;
};

export const updateSkill = async (id, data) => {
  const res = await api.put(`/skills/${id}/`, data);
  return res.data;
};

export const deleteSkill = async (id) => {
  const res = await api.delete(`/skills/${id}/`);
  return res.data;
};

/* Certifications */
export const fetchCertifications = async () => {
  const res = await api.get('/certifications/');
  return extractArray(res.data);
};

export const createCertification = async (data) => {
  const isFormData = data instanceof FormData;
  const res = await api.post('/certifications/', data, {
    headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
  });
  return res.data;
};

export const updateCertification = async (id, data) => {
  const isFormData = data instanceof FormData;
  const res = await api.put(`/certifications/${id}/`, data, {
    headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
  });
  return res.data;
};

export const deleteCertification = async (id) => {
  const res = await api.delete(`/certifications/${id}/`);
  return res.data;
};

/* Media */
export const fetchMedia = async () => {
  const res = await api.get('/media/');
  return extractArray(res.data);
};

export const uploadMedia = async (formData) => {
  const res = await api.post('/media/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

export const deleteMedia = async (id) => {
  const res = await api.delete(`/media/${id}/`);
  return res.data;
};

/* Dashboard Stats */
export const fetchDashboardStats = async () => {
  const res = await api.get('/admin/stats/');
  return res.data;
};
