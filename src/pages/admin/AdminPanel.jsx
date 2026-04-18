import { useState, useEffect } from 'react';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';

export default function AdminPanel() {
  const [token, setToken] = useState(() => localStorage.getItem('admin_token') || null);

  function handleLogin(newToken) {
    setToken(newToken);
  }

  function handleLogout() {
    setToken(null);
  }

  if (!token) return <AdminLogin onLogin={handleLogin} />;
  return <AdminDashboard token={token} onLogout={handleLogout} />;
}
