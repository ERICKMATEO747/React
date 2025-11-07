import React, { useState } from 'react';

const HamburgerMenu = ({ onProfile, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-white hover:text-gold-400 transition-colors"
      >
        <div className="w-6 h-6 flex flex-col justify-center space-y-1">
          <div className={`w-full h-0.5 bg-current transition-transform ${isOpen ? 'rotate-45 translate-y-1.5' : ''}`}></div>
          <div className={`w-full h-0.5 bg-current transition-opacity ${isOpen ? 'opacity-0' : ''}`}></div>
          <div className={`w-full h-0.5 bg-current transition-transform ${isOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 bg-white rounded-lg shadow-xl py-2 w-48 z-50">
          <button
            onClick={() => {
              onProfile();
              setIsOpen(false);
            }}
            className="w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-50 transition-colors"
          >
            👤 Mi Perfil
          </button>
          <button
            onClick={() => {
              onLogout();
              setIsOpen(false);
            }}
            className="w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-50 transition-colors"
          >
            🚪 Cerrar Sesión
          </button>
        </div>
      )}
    </div>
  );
};

export default HamburgerMenu;