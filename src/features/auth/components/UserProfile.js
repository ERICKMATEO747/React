import React from 'react';

const UserProfile = ({ user }) => {
  if (!user) return null;

  return (
    <div className="user-info">
      <h3>Información del Usuario</h3>
      <p><strong>Nombre:</strong> {user.nombre}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Teléfono:</strong> {user.telefono}</p>
      <p><strong>ID:</strong> {user.id}</p>
    </div>
  );
};

export default UserProfile;