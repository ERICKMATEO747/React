import { useState } from 'react';

export const useForm = (initialValues, validator) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const setValue = (name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const clearError = (name) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
  };

  const setFieldTouched = (name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const validate = () => {
    const validationErrors = validator ? validator(values) : {};
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const validateField = (name, value) => {
    if (validator) {
      const fieldValidationErrors = validator({ ...values, [name]: value });
      setErrors(prev => ({ ...prev, [name]: fieldValidationErrors[name] || '' }));
    }
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };

  return {
    values,
    errors,
    touched,
    setValue,
    setTouched: setFieldTouched,
    validate,
    validateField,
    clearError,
    reset
  };
};