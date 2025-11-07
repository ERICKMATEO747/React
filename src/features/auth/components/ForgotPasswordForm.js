import React, { useState } from 'react';
import { useForm } from '../../../shared/hooks/useForm';
import { validateEmail, validateRequired, createValidator } from '../../../shared/utils/validation';
import { GiftIcon, StarIcon } from '../../../shared/components/LoyaltyIcons';
import { forgotPassword } from '../services/authService';

const forgotPasswordValidator = createValidator({
  email: [
    (value) => !validateRequired(value) && 'El email es obligatorio',
    (value) => value && !validateEmail(value) && 'Ingresa un email válido'
  ]
});

const ForgotPasswordForm = ({ onBackToLogin, onShowPasswordOTP }) => {
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  
  const form = useForm({
    email: ''
  }, forgotPasswordValidator);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.validate()) return;

    setLoading(true);
    setApiError('');

    try {
      const response = await forgotPassword(form.values.email.trim());
      if (response.success) {
        onShowPasswordOTP(form.values.email.trim());
      }
    } catch (error) {
      setApiError(error.message || 'Error al enviar código de recuperación');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    form.setValue(name, value);
    setApiError('');
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    form.setTouched(name);
    if (value) {
      form.validateField(name, value);
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
              <span className="text-2xl font-bold text-white font-poppins">🔑</span>
            </div>
            <h1 className="text-xl font-bold text-white mb-1 font-poppins">
              Recuperar Contraseña
            </h1>
            <p className="text-flevo-100 text-xs font-medium">
              Ingresa tu email para continuar
            </p>
          </div>
        </div>

        {/* Forgot Password Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 animate-slide-up">
          <div className="text-center mb-6">
            <p className="text-slate-600 text-sm leading-relaxed">
              Ingresa tu correo electrónico registrado y te enviaremos un código para restablecer tu contraseña.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 block">
                Correo electrónico
              </label>
              <input
                type="email"
                name="email"
                value={form.values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-4 bg-slate-50 border-2 rounded-xl text-slate-800 placeholder-slate-400 transition-all duration-200 focus:outline-none focus:bg-white focus:border-flevo-500 focus:ring-4 focus:ring-flevo-100 ${
                  form.errors.email ? 'border-red-400 bg-red-50' : 'border-slate-200'
                }`}
                placeholder="tu@email.com"
              />
              {form.errors.email && (
                <p className="text-red-500 text-sm font-medium">{form.errors.email}</p>
              )}
            </div>

            {/* API Error */}
            {apiError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-red-600 text-sm font-medium text-center">{apiError}</p>
              </div>
            )}

            {/* Recovery Button */}
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
                'Recuperar Contraseña'
              )}
            </button>
          </form>

          {/* Footer Link */}
          <div className="text-center mt-6 pt-4 border-t border-slate-100">
            <button 
              onClick={onBackToLogin}
              className="text-slate-500 hover:text-slate-700 font-medium text-sm transition-colors"
            >
              ← Volver al login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;