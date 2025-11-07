import React from 'react';
import { GiftIcon, StarIcon } from '../../../shared/components/LoyaltyIcons';

const PasswordResetSuccess = ({ onGoToLogin }) => {
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
              <span className="text-2xl font-bold text-white font-poppins">✅</span>
            </div>
            <h1 className="text-xl font-bold text-white mb-1 font-poppins">
              ¡Contraseña Actualizada!
            </h1>
            <p className="text-flevo-100 text-xs font-medium">
              Tu contraseña ha sido restablecida
            </p>
          </div>
        </div>

        {/* Success Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 animate-slide-up">
          <div className="text-center space-y-4">
            <div className="text-6xl mb-4">🎉</div>
            
            <h2 className="text-2xl font-bold text-flevo-900 mb-2">
              ¡Listo!
            </h2>
            
            <p className="text-slate-600 text-sm leading-relaxed mb-6">
              Tu contraseña ha sido restablecida exitosamente.
              <br />
              Ya puedes iniciar sesión con tu nueva contraseña.
            </p>

            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
              <p className="text-green-700 text-sm font-medium">
                🔒 Tu cuenta está segura y lista para usar
              </p>
            </div>

            <button
              onClick={onGoToLogin}
              className="w-full bg-gradient-to-r from-accent-400 to-accent-500 hover:from-accent-500 hover:to-accent-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
            >
              Iniciar Sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetSuccess;