import axios from 'axios';
import { API_CONFIG, ENDPOINTS, STORAGE_KEYS, USER_TYPE_HASH } from '../../../shared/constants/config';
import { setItem, getItem, removeItem } from '../../../shared/utils/storage';

const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const login = async (credentials) => {
  try {
    const response = await apiClient.post(ENDPOINTS.LOGIN, credentials);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.detail || error.response?.data?.message || 'Error de conexión';
    throw new Error(errorMessage);
  }
};

export const saveAuthData = (token, user) => {
  setItem(STORAGE_KEYS.TOKEN, token);
  setItem(STORAGE_KEYS.USER, user);
};

export const getAuthData = () => ({
  token: getItem(STORAGE_KEYS.TOKEN),
  user: getItem(STORAGE_KEYS.USER)
});

export const clearAuthData = () => {
  removeItem(STORAGE_KEYS.TOKEN);
  removeItem(STORAGE_KEYS.USER);
};

export const register = async (userData) => {
  try {
    const registrationData = {
      ...userData,
      user_type_hash: USER_TYPE_HASH
    };
    const response = await apiClient.post(ENDPOINTS.REGISTER, registrationData);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.detail || error.response?.data?.message || 'Error en el registro';
    throw new Error(errorMessage);
  }
};

export const sendRegistrationOTP = async (email) => {
  try {
    const response = await apiClient.post(ENDPOINTS.SEND_REGISTRATION_OTP, { email });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.detail || error.response?.data?.message || 'Error al enviar OTP';
    throw new Error(errorMessage);
  }
};

export const verifyOTP = async (email, otp_code) => {
  try {
    const response = await apiClient.post(ENDPOINTS.VERIFY_OTP, { email, otp_code });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.detail || error.response?.data?.message || 'Código OTP inválido';
    throw new Error(errorMessage);
  }
};

export const forgotPassword = async (email) => {
  try {
    const response = await apiClient.post(ENDPOINTS.FORGOT_PASSWORD, { email });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.detail || error.response?.data?.message || 'Error al enviar código de recuperación';
    throw new Error(errorMessage);
  }
};

export const resetPassword = async (email, otp_code, new_password) => {
  try {
    const response = await apiClient.post(ENDPOINTS.RESET_PASSWORD, { email, otp_code, new_password });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.detail || error.response?.data?.message || 'Error al restablecer contraseña';
    throw new Error(errorMessage);
  }
};