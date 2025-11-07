import React from 'react';

const FloatingIcons = () => {
  const icons = ['⭐', '🏆', '🎁', '💎', '🎯', '🔥', '⚡', '💰', '🎆', '🎉', '🎈', '🎭'];
  
  // Crear múltiples capas de iconos para mayor densidad
  const createIconLayer = (layerIndex) => {
    return icons.map((icon, index) => {
      const uniqueKey = `layer-${layerIndex}-${index}`;
      const animationClass = `animate-float-down${index % 3 === 1 ? '-delayed' : index % 3 === 2 ? '-slow' : ''}`;
      
      return (
        <div
          key={uniqueKey}
          className={`absolute text-2xl ${animationClass}`}
          style={{
            left: `${Math.random() * 100}%`,
            top: '-100px',
            animationDelay: `${Math.random() * 8}s`,
            color: Math.random() > 0.5 ? '#f9bc18' : '#111937'
          }}
        >
          {icon}
        </div>
      );
    });
  };
  
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Crear 6 capas de iconos para mayor densidad */}
      {[0, 1, 2, 3, 4, 5].map(layerIndex => createIconLayer(layerIndex))}
    </div>
  );
};

export default FloatingIcons;