export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://192.168.0.98:8000/api',
  TIMEOUT: 10000
};

// Debug: Log the environment variable
console.log('REACT_APP_API_URL:', process.env.REACT_APP_API_URL);
console.log('API_CONFIG.BASE_URL:', API_CONFIG.BASE_URL);

export const ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  SEND_REGISTRATION_OTP: '/auth/send-registration-otp',
  VERIFY_OTP: '/auth/verify-otp',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password'
};

export const STORAGE_KEYS = {
  TOKEN: 'flevo_token',
  USER: 'flevo_user'
};

export const USER_TYPE_HASH = process.env.REACT_APP_USER_TYPE_HASH || 'a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456';