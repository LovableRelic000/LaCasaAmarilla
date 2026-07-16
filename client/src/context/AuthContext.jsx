// client/src/context/AuthContext.jsx
import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('adminToken') || null);

  const login = async (username, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (res.ok && data.token) {
        setToken(data.token);
        localStorage.setItem('adminToken', data.token);
        return { success: true };
      }

      return { success: false, error: data.error || 'Usuario o contraseña incorrectos' };
    } catch (err) {
      return { success: false, error: 'No se pudo conectar con el servidor backend.' };
    }
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('adminToken');
  };

  // Envuelve fetch agregando el token automáticamente, y si el servidor responde
  // 401 (token vencido o inválido), cierra la sesión y deja una nota para
  // que la pantalla de login explique por qué volvió ahí.
  const authFetch = async (url, options = {}) => {
    const headers = { ...(options.headers || {}) };
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(url, { ...options, headers });

    if (res.status === 401) {
      sessionStorage.setItem('sessionExpired', '1');
      logout();
    }

    return res;
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!token,
        token,
        login,
        logout,
        authFetch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
}