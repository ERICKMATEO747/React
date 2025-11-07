import React from 'react';
import flevoLogo from '../../assets/images/flvo.jpg';

const LoadingSpinner = ({ message = 'Cargando...', size = 'large' }) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-slate-50 to-yellow-100 animate-gradient-shift flex items-center justify-center p-4" style={{ backgroundSize: '400% 400%' }}>
      <div className="text-center animate-fade-in">
        {/* Logo with spinning border */}
        <div className="relative mb-6">
          <div className={`${sizeClasses[size]} mx-auto relative`}>
            {/* Spinning border */}
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-accent-400 border-r-gold-400 animate-spin"></div>
            <div className="absolute inset-1 rounded-full border-2 border-transparent border-b-flevo-900 border-l-accent-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            
            {/* Logo */}
            <div className="absolute inset-2 rounded-full overflow-hidden bg-white shadow-lg">
              <img src={flevoLogo} alt="Flevo" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        {/* Brand name with animation */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-flevo-900 font-poppins mb-1 animate-pulse">
            FLEVO
          </h1>
          <p className="text-sm text-slate-600 font-medium">
            Programa de Lealtad
          </p>
        </div>

        {/* Loading message */}
        <div className="flex items-center justify-center space-x-2 text-slate-700">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-accent-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-gold-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-flevo-900 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
          <span className="text-sm font-medium ml-2">{message}</span>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-1/4 left-1/4 text-accent-400 opacity-20 animate-pulse">
          <div className="text-4xl">🏆</div>
        </div>
        <div className="absolute top-1/3 right-1/4 text-gold-400 opacity-20 animate-pulse" style={{ animationDelay: '1s' }}>
          <div className="text-3xl">⭐</div>
        </div>
        <div className="absolute bottom-1/3 left-1/3 text-flevo-900 opacity-20 animate-pulse" style={{ animationDelay: '2s' }}>
          <div className="text-2xl">🎁</div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;