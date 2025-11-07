import axios from 'axios';
import { API_CONFIG } from '../constants/config.js';

const BASE_URL = API_CONFIG.BASE_URL;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token de autenticación JWT Bearer (REQUERIDO)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('flevo_token');
    if (token) {
      // Remove quotes if token is stored with quotes
      const cleanToken = token.replace(/^"|"$/g, '');
      config.headers.Authorization = `Bearer ${cleanToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('flevo_token');
      localStorage.removeItem('flevo_user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Servicios de API
export const apiService = {
  // Municipios
  getMunicipalities: () => api.get('/municipalities'),

  // Negocios (incluye redes sociales y WhatsApp)
  getBusinesses: (params = {}) => api.get('/businesses', { params }),
  getBusiness: (id) => api.get(`/businesses/${id}`),
  getBusinessMenu: (businessId) => api.get(`/menu/${businessId}`),

  // Visitas del usuario (modelo mensual)
  getUserVisits: (params = {}) => api.get('/user/visits', { params }),
  createVisit: (visitData) => api.post('/user/generate-qr', visitData), // Retorna QR en base64

  // Perfil de usuario
  getUserProfile: () => api.get('/user/profile'),
  updateUserProfile: (profileData) => api.put('/user/profile', profileData),

  // Autenticación (existentes)
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  verifyOTP: (otpData) => api.post('/auth/verify-otp', otpData),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  verifyPasswordOTP: (otpData) => api.post('/auth/verify-password-otp', otpData),
  resetPassword: (resetData) => api.post('/auth/reset-password', resetData),
};

export default api;