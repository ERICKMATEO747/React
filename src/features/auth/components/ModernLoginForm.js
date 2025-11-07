import React, { useState } from 'react';
import { useForm } from '../../../shared/hooks/useForm';
import { validateEmail, validatePhone, validateRequired, createValidator } from '../../../shared/utils/validation';
import { EyeIcon, EyeOffIcon } from '../../../shared/components/EyeIcon';
import { GiftIcon, StarIcon } from '../../../shared/components/LoyaltyIcons';
import { FacebookIcon, InstagramIcon, TikTokIcon, LinkedInIcon, HelpIcon } from '../../../shared/components/SocialIcons';
import FloatingIcons from '../../../shared/components/FloatingIcons';
import flevoLogo from '../../../assets/images/flvo.jpg';

const loginValidator = createValidator({
  identifier: [
    (value) => !validateRequired(value) && 'Este campo es obligatorio',
    (value) => value && !validateEmail(value) && !validatePhone(value) && 'Ingresa un email o teléfono válido'
  ],
  password: [
    (value) => !validateRequired(value) && 'Este campo es obligatorio',
    (value) => value && value.length < 8 && 'La contraseña debe tener al menos 8 caracteres'
  ]
});

const ModernLoginForm = ({ onLogin, onShowRegister, onShowForgotPassword, onShowHelp }) => {
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const form = useForm({
    identifier: '',
    password: ''
  }, loginValidator);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.validate()) return;

    setLoading(true);
    setApiError('');

    try {
      const sanitizedCredentials = {
        email: form.values.identifier.trim(),
        password: form.values.password
      };
      await onLogin(sanitizedCredentials);
    } catch (error) {
      setApiError(error.message || 'Credenciales incorrectas');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    form.setValue(name, value);
    setApiError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-slate-50 to-yellow-100 animate-gradient-shift flex items-center justify-center p-4 animate-fade-in relative" style={{ backgroundSize: '400% 400%' }}>
      <FloatingIcons />
      <div className="w-full max-w-md relative z-10">
        {/* Header Section with Curved Background */}
        <div className="relative mb-8">
          <div className="bg-gradient-to-br from-flevo-900 to-flevo-950 rounded-t-3xl px-6 py-8 text-center shadow-xl relative overflow-hidden" style={{ borderBottomLeftRadius: '50% 30px', borderBottomRightRadius: '50% 30px' }}>
            {/* Decorative Icons */}
            <div className="absolute top-3 left-3 opacity-80" style={{ color: '#f9bc18' }}>
              <GiftIcon className="w-5 h-5" />
            </div>
            <div className="absolute top-3 right-3 opacity-80" style={{ color: '#f9bc18' }}>
              <StarIcon className="w-5 h-5" />
            </div>
            {/* Logo/Avatar */}
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg overflow-hidden">
              <img src={flevoLogo} alt="Flevo Logo" className="w-full h-full object-cover" />
            </div>
            
            {/* Welcome Text */}
            <h1 className="text-xl font-bold text-white mb-1 font-poppins">
              Bienvenido a FLEVO
            </h1>
            <p className="text-flevo-100 text-xs font-medium">
              Tu programa de lealtad favorito
            </p>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 animate-slide-up">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email/Phone Input */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 block">
                Correo electrónico o teléfono
              </label>
              <input
                type="text"
                name="identifier"
                value={form.values.identifier}
                onChange={handleChange}
                className={`w-full px-4 py-4 bg-slate-50 border-2 rounded-xl text-slate-800 placeholder-slate-400 transition-all duration-200 focus:outline-none focus:bg-white focus:border-flevo-500 focus:ring-4 focus:ring-flevo-100 ${
                  form.errors.identifier ? 'border-red-400 bg-red-50' : 'border-slate-200'
                }`}
                placeholder="ejemplo@correo.com o 1234567890"
              />
              {form.errors.identifier && (
                <p className="text-red-500 text-sm font-medium">{form.errors.identifier}</p>
              )}
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 block">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.values.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-4 pr-12 bg-slate-50 border-2 rounded-xl text-slate-800 placeholder-slate-400 transition-all duration-200 focus:outline-none focus:bg-white focus:border-flevo-500 focus:ring-4 focus:ring-flevo-100 ${
                    form.errors.password ? 'border-red-400 bg-red-50' : 'border-slate-200'
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
              {form.errors.password && (
                <p className="text-red-500 text-sm font-medium">{form.errors.password}</p>
              )}
            </div>

            {/* API Error */}
            {apiError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-red-600 text-sm font-medium text-center">{apiError}</p>
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-accent-400 to-accent-500 hover:from-accent-500 hover:to-accent-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Iniciando sesión...</span>
                </div>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-100">
            <button 
              onClick={onShowRegister}
              className="text-accent-500 hover:text-accent-600 font-semibold text-sm transition-colors"
            >
              Registrarse
            </button>
            <button 
              onClick={onShowForgotPassword}
              className="text-slate-500 hover:text-slate-700 font-medium text-sm transition-colors"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          {/* Social Media & Help Footer */}
          <div className="mt-6 pt-4 border-t border-slate-100">
            <div className="flex justify-center items-center space-x-4 mb-4">
              <a href="#" className="text-slate-400 hover:text-blue-600 transition-colors">
                <FacebookIcon className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-pink-600 transition-colors">
                <InstagramIcon className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-black transition-colors">
                <TikTokIcon className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-blue-700 transition-colors">
                <LinkedInIcon className="w-5 h-5" />
              </a>
            </div>
            <div className="text-center mb-3">
              <button 
                onClick={onShowHelp}
                className="inline-flex items-center space-x-2 text-slate-500 hover:text-accent-500 font-medium text-sm transition-colors bg-slate-50 hover:bg-accent-50 px-4 py-2 rounded-lg"
              >
                <HelpIcon className="w-4 h-4" />
                <span>Ayuda</span>
              </button>
            </div>
            <p className="text-center text-xs text-slate-400">
              Síguenos en redes sociales • © 2025 FLEVO
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernLoginForm;