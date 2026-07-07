import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

export const resolveImageUrl = (path) => {
  if (!path || typeof path !== 'string') return '';
  if (path.startsWith('blob:') || path.startsWith('data:')) return path;

  const apiURL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
  // Get backend domain (strip /api or /api/ if present)
  const base = apiURL.replace(/\/api\/?$/, '').replace(/\/$/, '');

  // If the path contains localhost or 127.0.0.1, it means the database has a record
  // pointing to the local dev server. We replace the local origin with the production backend base.
  if (path.includes('localhost') || path.includes('127.0.0.1')) {
    const storageIndex = path.indexOf('/storage/');
    if (storageIndex !== -1) {
      return `${base}${path.substring(storageIndex)}`;
    }
  }

  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${cleanPath}`;
};


export const authAPI = {
  register: (data) => api.post('/register', data),
  login: (data) => api.post('/login', data),
  logout: () => api.post('/logout'),
  user: () => api.get('/user'),
};

export const propertyAPI = {
  list: (params) => api.get('/properties', { params }),
  myListings: () => api.get('/my-properties'),
  featured: () => api.get('/properties/featured'),
  showcase: () => api.get('/properties/showcase'),
  get: (id) => api.get(`/properties/${id}`),
  create: (data) => api.post('/properties', data),
  update: (id, data) => api.put(`/properties/${id}`, data),
  delete: (id) => api.delete(`/properties/${id}`),
  uploadImage: (id, formData) =>
    api.post(`/properties/${id}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  deleteImage: (propertyId, imageId) =>
    api.delete(`/properties/${propertyId}/images/${imageId}`),
};

export const inquiryAPI = {
  create: (data) => api.post('/inquiries', data),
  list: () => api.get('/inquiries'),
  update: (id, data) => api.patch(`/inquiries/${id}`, data),
  delete: (id) => api.delete(`/inquiries/${id}`),
};

export const favoriteAPI = {
  list: () => api.get('/favorites'),
  toggle: (propertyId) => api.post(`/favorites/${propertyId}`),
};

export const adminAPI = {
  stats: () => api.get('/admin/stats'),
  users: () => api.get('/admin/users'),
};

export const reportAPI = {
  get: () => api.get('/reports'),
};

export const testimonialAPI = {
  list: () => api.get('/testimonials'),
};
