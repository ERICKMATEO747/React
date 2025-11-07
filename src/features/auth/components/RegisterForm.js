import React, { useState } from 'react';
import { useForm } from '../../../shared/hooks/useForm';
import { validateEmail, validatePhone10Digits, validateRequired, validateSimplePassword, validateEmailMatch, createValidator } from '../../../shared/utils/validation';
import { EyeIcon, EyeOffIcon } from '../../../shared/components/EyeIcon';
import { GiftIcon, StarIcon } from '../../../shared/components/LoyaltyIcons';
import { sendRegistrationOTP } from '../services/authService';

const registerValidator = createValidator({
  nombre: [
    (value) => !validateRequired(value) && 'El nombre es obligatorio',
    (value) => value && value.length < 2 && 'El nombre debe tener al menos 2 caracteres'
  ],
  email: [
    (value) => !validateRequired(value) && 'El email es obligatorio',
    (value) => value && !validateEmail(value) && 'Ingresa un email válido'
  ],
  confirmEmail: [
    (value) => !validateRequired(value) && 'Confirma tu email',
    (value, allValues) => value && allValues && !validateEmailMatch(allValues.email, value) && 'Los emails no coinciden'
  ],
  telefono: [
    (value) => !validateRequired(value) && 'El teléfono es obligatorio',
    (value) => value && !validatePhone10Digits(value) && 'El teléfono debe tener exactamente 10 dígitos'
  ],
  password: [
    (value) => !validateRequired(value) && 'La contraseña es obligatoria',
    (value) => value && !validateSimplePassword(value) && 'La contraseña debe tener al menos 8 caracteres'
  ]
});

const RegisterForm = ({ onBackToLogin, onShowOTPVerification }) => {
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const form = useForm({
    nombre: '',
    email: '',
    confirmEmail: '',
    telefono: '',
    password: ''
  }, registerValidator);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateEmailMatch(form.values.email, form.values.confirmEmail)) {
      setApiError('Los emails no coinciden');
      return;
    }
    
    if (!form.validate()) return;

    setLoading(true);
    setApiError('');

    try {
      const response = await sendRegistrationOTP(form.values.email.trim());
      if (response.success) {
        const userData = {
          nombre: form.values.nombre.trim(),
          email: form.values.email.trim(),
          telefono: form.values.telefono.trim(),
          password: form.values.password
        };
        onShowOTPVerification(userData);
      }
    } catch (error) {
      setApiError(error.message || 'Error al enviar código de verificación');
    } finally {
      setLoading(false);
    }
  };



  const handleChange = (e) => {
    const { name, value } = e.target;
    form.setValue(name, value);
    setApiError('');
    
    // Validación en tiempo real para campos específicos
    if (name === 'confirmEmail') {
      if (value && form.values.email) {
        const emailMatch = validateEmailMatch(form.values.email, value);
        if (!emailMatch) {
          form.validateField(name, value);
        } else {
          // Limpiar error si los emails coinciden
          form.clearError(name);
        }
      } else if (!value) {
        // Solo mostrar error si el campo está vacío y se ha tocado
        form.clearError(name);
      }
    }
    
    if (name === 'telefono') {
      form.validateField(name, value);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    form.setTouched(name);
    
    // Solo validar si el campo tiene contenido o es requerido
    if (value || name === 'nombre' || name === 'email' || name === 'telefono' || name === 'password') {
      form.validateField(name, value);
    }
    
    // Validación especial para confirmEmail
    if (name === 'confirmEmail' && value) {
      const emailMatch = validateEmailMatch(form.values.email, value);
      if (!emailMatch) {
        form.validateField(name, value);
      } else {
        form.clearError(name);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-slate-50 to-yellow-100 animate-gradient-shift flex items-center justify-center p-4 animate-fade-in" style={{ backgroundSize: '400% 400%' }}>
      <div className="w-full max-w-md">
        {/* Header Section */}
        <div className="relative mb-8">
          <div className="bg-gradient-to-br from-flevo-900 to-flevo-950 rounded-t-3xl px-6 py-8 text-center shadow-xl relative overflow-hidden" style={{ borderBottomLeftRadius: '50% 30px', borderBottomRightRadius: '50% 30px' }}>
            <div className="absolute top-3 left-3 opacity-80" style={{ color: '#f9bc18' }}>
              <GiftIcon className="w-5 h-5" />
            </div>
            <div className="absolute top-3 right-3 opacity-80" style={{ color: '#f9bc18' }}>
              <StarIcon className="w-5 h-5" />
            </div>
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
              <span className="text-2xl font-bold text-white font-poppins">F</span>
            </div>
            <h1 className="text-xl font-bold text-white mb-1 font-poppins">
              Únete a FLEVO
            </h1>
            <p className="text-flevo-100 text-xs font-medium">
              Crea tu cuenta y comienza a ganar
            </p>
          </div>
        </div>

        {/* Register Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 animate-slide-up">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nombre */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 block">Nombre completo</label>
              <input
                type="text"
                name="nombre"
                value={form.values.nombre}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-3 bg-slate-50 border-2 rounded-xl text-slate-800 placeholder-slate-400 transition-all duration-200 focus:outline-none focus:bg-white focus:border-flevo-500 focus:ring-4 focus:ring-flevo-100 ${
                  form.errors.nombre ? 'border-red-400 bg-red-50' : 'border-slate-200'
                }`}
                placeholder="Tu nombre completo"
              />
              {form.errors.nombre && (
                <p className="text-red-500 text-xs font-medium">{form.errors.nombre}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 block">Correo electrónico</label>
              <input
                type="email"
                name="email"
                value={form.values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-3 bg-slate-50 border-2 rounded-xl text-slate-800 placeholder-slate-400 transition-all duration-200 focus:outline-none focus:bg-white focus:border-flevo-500 focus:ring-4 focus:ring-flevo-100 ${
                  form.errors.email ? 'border-red-400 bg-red-50' : 'border-slate-200'
                }`}
                placeholder="tu@email.com"
              />
              {form.errors.email && (
                <p className="text-red-500 text-xs font-medium">{form.errors.email}</p>
              )}
            </div>

            {/* Confirmar Email */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 block">Confirmar email</label>
              <input
                type="email"
                name="confirmEmail"
                value={form.values.confirmEmail}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-3 bg-slate-50 border-2 rounded-xl text-slate-800 placeholder-slate-400 transition-all duration-200 focus:outline-none focus:bg-white focus:border-flevo-500 focus:ring-4 focus:ring-flevo-100 ${
                  form.errors.confirmEmail ? 'border-red-400 bg-red-50' : 'border-slate-200'
                }`}
                placeholder="Confirma tu email"
              />
              {form.errors.confirmEmail && (
                <p className="text-red-500 text-xs font-medium">{form.errors.confirmEmail}</p>
              )}
            </div>

            {/* Teléfono */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 block">Teléfono</label>
              <input
                type="tel"
                name="telefono"
                value={form.values.telefono}
                onChange={handleChange}
                onBlur={handleBlur}
                maxLength="10"
                className={`w-full px-4 py-3 bg-slate-50 border-2 rounded-xl text-slate-800 placeholder-slate-400 transition-all duration-200 focus:outline-none focus:bg-white focus:border-flevo-500 focus:ring-4 focus:ring-flevo-100 ${
                  form.errors.telefono ? 'border-red-400 bg-red-50' : 'border-slate-200'
                }`}
                placeholder="1234567890"
              />
              {form.errors.telefono && (
                <p className="text-red-500 text-xs font-medium">{form.errors.telefono}</p>
              )}
            </div>

            {/* Contraseña */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 block">Contraseña</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-3 pr-12 bg-slate-50 border-2 rounded-xl text-slate-800 placeholder-slate-400 transition-all duration-200 focus:outline-none focus:bg-white focus:border-flevo-500 focus:ring-4 focus:ring-flevo-100 ${
                    form.errors.password ? 'border-red-400 bg-red-50' : 'border-slate-200'
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                </button>
              </div>
              {form.errors.password && (
                <p className="text-red-500 text-xs font-medium">{form.errors.password}</p>
              )}
            </div>



            {/* API Error */}
            {apiError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                <p className="text-red-600 text-sm font-medium text-center">{apiError}</p>
              </div>
            )}

            {/* Register Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-accent-400 to-accent-500 hover:from-accent-500 hover:to-accent-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Enviando código...</span>
                </div>
              ) : (
                'Siguiente'
              )}
            </button>
          </form>

          {/* Footer Link */}
          <div className="text-center mt-6 pt-4 border-t border-slate-100">
            <button 
              onClick={onBackToLogin}
              className="text-slate-500 hover:text-slate-700 font-medium text-sm transition-colors"
            >
              ¿Ya tienes cuenta? Inicia sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;