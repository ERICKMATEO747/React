const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\d{10,15}$/;
const MIN_PASSWORD_LENGTH = 8;

export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  return EMAIL_REGEX.test(email.trim());
};

export const validatePhone = (phone) => {
  if (!phone || typeof phone !== 'string') return false;
  return PHONE_REGEX.test(phone.replace(/\s/g, ''));
};

export const validatePhone10Digits = (phone) => {
  if (!phone || typeof phone !== 'string') return false;
  const cleanPhone = phone.replace(/\s/g, '');
  return /^\d{10}$/.test(cleanPhone);
};

export const validatePassword = (password) => {
  if (!password || typeof password !== 'string') return false;
  return password.length >= MIN_PASSWORD_LENGTH;
};

export const validateSimplePassword = (password) => {
  if (!password || typeof password !== 'string') return false;
  return password.length >= MIN_PASSWORD_LENGTH;
};

export const validateEmailMatch = (email, confirmEmail) => {
  return email === confirmEmail;
};

export const validateOTP = (otp) => {
  if (!otp || typeof otp !== 'string') return false;
  return /^\d{6}$/.test(otp);
};

export const validateRequired = (value) => {
  if (value === null || value === undefined) return false;
  return Boolean(String(value).trim());
};

export const createValidator = (rules) => (data) => {
  return Object.entries(rules).reduce((errors, [field, validators]) => {
    const value = data[field];
    const fieldErrors = validators
      .map(validator => validator(value, data))
      .filter(Boolean);
    
    if (fieldErrors.length) {
      errors[field] = fieldErrors[0];
    }
    return errors;
  }, {});
};