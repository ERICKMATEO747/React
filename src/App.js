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
import ErrorBoundary from './shared/components/ErrorBoundary';

function App() {
  const { user, loading, isAuthenticated, login, logout } = useAuth();
  const [currentView, setCurrentView] = useState('login'); // 'login', 'register', 'otp', 'success', 'forgot', 'passwordOtp', 'newPassword', 'passwordSuccess', 'help'
  const [registrationData, setRegistrationData] = useState(null);
  const [passwordResetData, setPasswordResetData] = useState({ email: '', otpCode: '' });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-flevo-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-slate-700">Cargando...</h2>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="App">
        {isAuthenticated ? (
          <ModernHome user={user} onLogout={logout} />
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