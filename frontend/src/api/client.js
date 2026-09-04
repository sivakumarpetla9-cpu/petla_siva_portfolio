import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to requests if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Intercept 401s for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
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
        } catch (refreshErr) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.dispatchEvent(new Event('auth-logout'));
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

export const logoutApi = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  window.dispatchEvent(new Event('auth-logout'));
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
