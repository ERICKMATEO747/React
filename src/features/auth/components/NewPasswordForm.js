import React, { useState } from 'react';
import { useForm } from '../../../shared/hooks/useForm';
import { validateRequired, validateSimplePassword, createValidator } from '../../../shared/utils/validation';
import { EyeIcon, EyeOffIcon } from '../../../shared/components/EyeIcon';
import { GiftIcon, StarIcon } from '../../../shared/components/LoyaltyIcons';
import { resetPassword } from '../services/authService';

const newPasswordValidator = createValidator({
  password: [
    (value) => !validateRequired(value) && 'La contraseña es obligatoria',
    (value) => value && !validateSimplePassword(value) && 'La contraseña debe tener al menos 8 caracteres'
  ],
  confirmPassword: [
    (value) => !validateRequired(value) && 'Confirma tu contraseña',
    (value, allValues) => value && allValues && value !== allValues.password && 'Las contraseñas no coinciden'
  ]
});

const NewPasswordForm = ({ email, otpCode, onPasswordResetSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const form = useForm({
    password: '',
    confirmPassword: ''
  }, newPasswordValidator);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (form.values.password !== form.values.confirmPassword) {
      setApiError('Las contraseñas no coinciden');
      return;
    }
    
    if (!form.validate()) return;

    setLoading(true);
    setApiError('');

    try {
      const response = await resetPassword(email, otpCode, form.values.password);
      if (response.success) {
        onPasswordResetSuccess();
      }
    } catch (error) {
      setApiError(error.message || 'Error al restablecer contraseña');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    form.setValue(name, value);
    setApiError('');
    
    // Validación en tiempo real para confirmación de contraseña
    if (name === 'confirmPassword' && value && form.values.password) {
      if (value !== form.values.password) {
        form.validateField(name, value);
      } else {
        form.clearError(name);
      }
    }
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
              <span className="text-2xl font-bold text-white font-poppins">🔒</span>
            </div>
            <h1 className="text-xl font-bold text-white mb-1 font-poppins">
              Nueva Contraseña
            </h1>
            <p className="text-flevo-100 text-xs font-medium">
              Crea tu nueva contraseña segura
            </p>
          </div>
        </div>

        {/* New Password Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 animate-slide-up">
          <div className="text-center mb-6">
            <p className="text-slate-600 text-sm leading-relaxed">
              Ingresa tu nueva contraseña. Debe tener al menos 8 caracteres.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Password Input */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 block">
                Nueva contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
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
                  {showPassword ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                </button>
              </div>
              {form.errors.password && (
                <p className="text-red-500 text-sm font-medium">{form.errors.password}</p>
              )}
            </div>

            {/* Confirm Password Input */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 block">
                Confirmar contraseña
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={form.values.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-4 pr-12 bg-slate-50 border-2 rounded-xl text-slate-800 placeholder-slate-400 transition-all duration-200 focus:outline-none focus:bg-white focus:border-flevo-500 focus:ring-4 focus:ring-flevo-100 ${
                    form.errors.confirmPassword ? 'border-red-400 bg-red-50' : 'border-slate-200'
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                </button>
              </div>
              {form.errors.confirmPassword && (
                <p className="text-red-500 text-sm font-medium">{form.errors.confirmPassword}</p>
              )}
            </div>

            {/* API Error */}
            {apiError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-red-600 text-sm font-medium text-center">{apiError}</p>
              </div>
            )}

            {/* Confirm Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-accent-400 to-accent-500 hover:from-accent-500 hover:to-accent-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Actualizando...</span>
                </div>
              ) : (
                'Confirmar Nueva Contraseña'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewPasswordForm;