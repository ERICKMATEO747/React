import React, { useState } from 'react';
import { useAuth } from './features/auth/hooks/useAuth';
import ModernLoginForm from './features/auth/components/ModernLoginForm';
import RegisterForm from './features/auth/components/RegisterForm';
import OTPVerificationForm from './features/auth/components/OTPVerificationForm';
import RegistrationSuccess from './features/auth/components/RegistrationSuccess';
import ForgotPasswordForm from './features/auth/components/ForgotPasswordForm';
import PasswordOTPForm from './features/auth/components/PasswordOTPForm';
import NewPasswordForm from './features/auth/components/NewPasswordForm';
import PasswordResetSuccess from './features/auth/components/PasswordResetSuccess';
import HelpPage from './pages/HelpPage';
import ModernHome from './pages/ModernHome';
import ProfilePage from './pages/ProfilePage';
import LoadingSpinner from './shared/components/LoadingSpinner';
import ErrorBoundary from './shared/components/ErrorBoundary';

function App() {
  const { user, loading, isAuthenticated, login, logout } = useAuth();
  const [currentView, setCurrentView] = useState('login'); // 'login', 'register', 'otp', 'success', 'forgot', 'passwordOtp', 'newPassword', 'passwordSuccess', 'help', 'profile'
  const [registrationData, setRegistrationData] = useState(null);
  const [passwordResetData, setPasswordResetData] = useState({ email: '', otpCode: '' });

  if (loading) {
    return <LoadingSpinner message="Iniciando sesión..." />;
  }

  return (
    <ErrorBoundary>
      <div className="App">
        {isAuthenticated ? (
          currentView === 'profile' ? (
            <ProfilePage 
              user={user} 
              onBack={() => setCurrentView('home')}
              onShowHelp={() => setCurrentView('help')}
            />
          ) : currentView === 'help' ? (
            <HelpPage 
              onBackToLogin={() => setCurrentView('home')}
            />
          ) : (
            <ModernHome 
              user={user} 
              onLogout={logout}
              onProfile={() => setCurrentView('profile')}
              onShowHelp={() => setCurrentView('help')}
            />
          )
        ) : (
          <>
            {currentView === 'login' && (
              <ModernLoginForm 
                onLogin={login} 
                onShowRegister={() => setCurrentView('register')}
                onShowForgotPassword={() => setCurrentView('forgot')}
                onShowHelp={() => setCurrentView('help')}
              />
            )}
            {currentView === 'register' && (
              <RegisterForm 
                onBackToLogin={() => setCurrentView('login')}
                onShowOTPVerification={(userData) => {
                  setRegistrationData(userData);
                  setCurrentView('otp');
                }}
              />
            )}
            {currentView === 'otp' && (
              <OTPVerificationForm 
                userData={registrationData}
                onBackToRegister={() => setCurrentView('register')}
                onRegistrationComplete={() => setCurrentView('success')}
              />
            )}
            {currentView === 'success' && (
              <RegistrationSuccess 
                onGoToLogin={() => setCurrentView('login')}
              />
            )}
            {currentView === 'forgot' && (
              <ForgotPasswordForm 
                onBackToLogin={() => setCurrentView('login')}
                onShowPasswordOTP={(email) => {
                  setPasswordResetData({ ...passwordResetData, email });
                  setCurrentView('passwordOtp');
                }}
              />
            )}
            {currentView === 'passwordOtp' && (
              <PasswordOTPForm 
                email={passwordResetData.email}
                onBackToForgot={() => setCurrentView('forgot')}
                onShowNewPassword={(email, otpCode) => {
                  setPasswordResetData({ email, otpCode });
                  setCurrentView('newPassword');
                }}
              />
            )}
            {currentView === 'newPassword' && (
              <NewPasswordForm 
                email={passwordResetData.email}
                otpCode={passwordResetData.otpCode}
                onPasswordResetSuccess={() => setCurrentView('passwordSuccess')}
              />
            )}
            {currentView === 'passwordSuccess' && (
              <PasswordResetSuccess 
                onGoToLogin={() => setCurrentView('login')}
              />
            )}
            {currentView === 'help' && (
              <HelpPage 
                onBackToLogin={() => setCurrentView('login')}
              />
            )}
          </>
        )}
      </div>
    </ErrorBoundary>
  );
}

export default App;