import React from 'react';
import { FacebookIcon, InstagramIcon, TikTokIcon, LinkedInIcon, HelpIcon } from '../shared/components/SocialIcons';
import { GiftIcon, StarIcon } from '../shared/components/LoyaltyIcons';
import flevoLogo from '../assets/images/flvo.jpg';

const ProfilePage = ({ user, onBack, onShowHelp }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-slate-50 to-yellow-100 animate-gradient-shift" style={{ backgroundSize: '400% 400%' }}>
      {/* Header */}
      <div className="bg-gradient-to-br from-flevo-900 to-flevo-950 px-6 py-8 text-center shadow-xl relative overflow-hidden">
        <button
          onClick={onBack}
          className="absolute top-4 left-4 text-white hover:text-gold-400 transition-colors"
        >
          ← Volver
        </button>
        
        <div className="absolute top-3 left-1/2 transform -translate-x-1/2 opacity-80" style={{ color: '#f9bc18' }}>
          <GiftIcon className="w-5 h-5" />
        </div>
        <div className="absolute top-3 right-3 opacity-80" style={{ color: '#f9bc18' }}>
          <StarIcon className="w-5 h-5" />
        </div>
        
        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg overflow-hidden">
          <img src={flevoLogo} alt="Flevo Logo" className="w-full h-full object-cover" />
        </div>
        
        <h1 className="text-xl font-bold text-white mb-1 font-poppins">
          Mi Perfil
        </h1>
        <p className="text-flevo-100 text-xs font-medium">
          {user?.nombre || 'Usuario'}
        </p>
      </div>

      {/* Profile Content */}
      <div className="p-4 max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8 mt-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-slate-100">
              <span className="font-medium text-slate-600">Nombre:</span>
              <span className="font-semibold text-slate-800">{user?.nombre}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-slate-100">
              <span className="font-medium text-slate-600">Email:</span>
              <span className="font-semibold text-slate-800 text-sm">{user?.email}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-slate-100">
              <span className="font-medium text-slate-600">Teléfono:</span>
              <span className="font-semibold text-slate-800">{user?.telefono}</span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="font-medium text-slate-600">ID:</span>
              <span className="font-semibold text-slate-800">{user?.id}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl p-6">
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
          <div className="text-center">
            <button 
              onClick={onShowHelp}
              className="inline-flex items-center space-x-2 text-slate-500 hover:text-accent-500 font-medium text-sm transition-colors bg-slate-50 hover:bg-accent-50 px-4 py-2 rounded-lg"
            >
              <HelpIcon className="w-4 h-4" />
              <span>Ayuda</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;