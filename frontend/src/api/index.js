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
