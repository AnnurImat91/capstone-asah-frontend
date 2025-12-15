import React, { useState, useEffect, useCallback } from 'react';
import DashboardLayout from './layout/DashboardLayout'; 
import { LoginForm, RegisterForm } from './auth/AuthForms'; 

const App = () => {
  const [token, setToken] = useState(null);
  const [currentView, setCurrentView] = useState('login'); 

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      setToken(storedToken);
      setCurrentView('dashboard');
    }
  }, []);

  const handleLoginSuccess = useCallback((jwtToken, user) => {
    setToken(jwtToken);
    localStorage.setItem('authToken', jwtToken);
    setCurrentView('dashboard');
    console.log(`Login berhasil. User: ${user.name}`);
  }, []);

  const handleLogout = useCallback(() => {
    setToken(null);
    localStorage.removeItem('authToken');
    setCurrentView('login');
  }, []);

  if (token && currentView === 'dashboard') {
    return <DashboardLayout onLogout={handleLogout} token={token} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      {currentView === 'login' ? (
        <LoginForm onLoginSuccess={handleLoginSuccess} onViewChange={setCurrentView} />
      ) : (
        <RegisterForm onViewChange={setCurrentView} />
      )}
    </div>
  );
};

export default App;