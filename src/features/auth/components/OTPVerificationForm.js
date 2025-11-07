import React, { useState, useEffect } from 'react';
import { useForm } from '../../../shared/hooks/useForm';
import { validateOTP, validateRequired, createValidator } from '../../../shared/utils/validation';
import { GiftIcon, StarIcon } from '../../../shared/components/LoyaltyIcons';
import { verifyOTP, register, sendRegistrationOTP } from '../services/authService';

const otpValidator = createValidator({
  otp: [
    (value) => !validateRequired(value) && 'El código OTP es obligatorio',
    (value) => value && !validateOTP(value) && 'El código debe tener 6 dígitos'
  ]
});

const OTPVerificationForm = ({ userData, onBackToRegister, onRegistrationComplete }) => {
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [countdown, setCountdown] = useState(20);
  const [canResend, setCanResend] = useState(false);
  
  const form = useForm({
    otp: ''
  }, otpValidator);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.validate()) return;

    setLoading(true);
    setApiError('');

    try {
      // Verificar OTP
      await verifyOTP(userData.email, form.values.otp);
      
      // Si OTP es válido, registrar usuario
      const response = await register(userData);
      
      if (response.success) {
        onRegistrationComplete(response);
      }
    } catch (error) {
      setApiError(error.message || 'Código OTP inválido');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Solo permitir números y máximo 6 caracteres
    if (value.length <= 6 && /^\d*$/.test(value)) {
      form.setValue(name, value);
      setApiError('');
    }
  };

  const handleResendOTP = async () => {
    setResendLoading(true);
    setApiError('');

    try {
      await sendRegistrationOTP(userData.email);
      setCountdown(20);
      setCanResend(false);
      setApiError('');
    } catch (error) {
      setApiError(error.message || 'Error al reenviar código');
    } finally {
      setResendLoading(false);
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
              <span className="text-2xl font-bold text-white font-poppins">📧</span>
            </div>
            <h1 className="text-xl font-bold text-white mb-1 font-poppins">
              Verificar Email
            </h1>
            <p className="text-flevo-100 text-xs font-medium">
              Ingresa el código enviado a tu correo
            </p>
          </div>
        </div>

        {/* OTP Verification Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 animate-slide-up">
          <div className="text-center mb-6">
            <p className="text-slate-600 text-sm mb-2">
              Hemos enviado un código de 6 dígitos a:
            </p>
            <p className="text-flevo-900 font-semibold text-sm">
              {userData.email}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* OTP Input */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 block text-center">
                Código de Verificación
              </label>
              <input
                type="text"
                name="otp"
                value={form.values.otp}
                onChange={handleChange}
                maxLength="6"
                className={`w-full px-4 py-4 bg-slate-50 border-2 rounded-xl text-slate-800 placeholder-slate-400 transition-all duration-200 focus:outline-none focus:bg-white focus:border-flevo-500 focus:ring-4 focus:ring-flevo-100 text-center text-2xl font-mono tracking-widest ${
                  form.errors.otp ? 'border-red-400 bg-red-50' : 'border-slate-200'
                }`}
                placeholder="123456"
              />
              {form.errors.otp && (
                <p className="text-red-500 text-sm font-medium text-center">{form.errors.otp}</p>
              )}
            </div>

            {/* API Error */}
            {apiError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-red-600 text-sm font-medium text-center">{apiError}</p>
              </div>
            )}

            {/* Verify Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-accent-400 to-accent-500 hover:from-accent-500 hover:to-accent-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Verificando...</span>
                </div>
              ) : (
                'Verificar y Crear Cuenta'
              )}
            </button>

            {/* Resend OTP Button */}
            <div className="text-center mt-4">
              {canResend ? (
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={resendLoading}
                  className="text-accent-500 hover:text-accent-600 font-semibold text-sm transition-colors disabled:opacity-50"
                >
                  {resendLoading ? 'Reenviando...' : '⟳ Reenviar código'}
                </button>
              ) : (
                <p className="text-slate-500 text-sm">
                  🕰️ Podrás reenviar el código en {countdown} segundos
                </p>
              )}
            </div>
          </form>

          {/* Footer Link */}
          <div className="text-center mt-6 pt-4 border-t border-slate-100">
            <button 
              onClick={onBackToRegister}
              className="text-slate-500 hover:text-slate-700 font-medium text-sm transition-colors"
            >
              ← Volver al registro
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerificationForm;