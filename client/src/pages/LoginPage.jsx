// src/pages/LoginPage.jsx
import { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ADMIN_PATH } from '../config/adminPath';
import NoIndex from '../components/NoIndex';

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionExpiredMsg, setSessionExpiredMsg] = useState('');

  useEffect(() => {
    if (sessionStorage.getItem('sessionExpired')) {
      setSessionExpiredMsg('Tu sesión expiró. Por favor inicia sesión de nuevo.');
      sessionStorage.removeItem('sessionExpired');
    }
  }, []);

  if (isAuthenticated) return <Navigate to={`/${ADMIN_PATH}/panel`} replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(username, password);
    setLoading(false);
    if (result.success) {
      navigate(`/${ADMIN_PATH}/panel`);
    } else {
      setError(result.error);
    }
  };

  return (
    <>
    <NoIndex />
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-surface border border-border rounded-2xl shadow-sm p-8">
        <h1 className="font-display text-2xl font-semibold text-ink mb-2 text-center">
          Acceso de Administrador
        </h1>
        <p className="text-sm text-ink-soft mb-6 text-center">
          Esta sección es exclusiva para el personal de La Casa Amarilla.
        </p>

        {sessionExpiredMsg && (
          <div className="mb-5 px-4 py-3 border-l-4 border-caramel bg-surface-2 text-ink text-sm rounded-lg">
            {sessionExpiredMsg}
          </div>
        )}

        <div onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-ink mb-1">Usuario</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2.5 bg-bg border border-border rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-caramel"
              placeholder="Username"
            />
          </div>

          <div className="mb-5">
            <label className="block text-sm font-medium text-ink mb-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-bg border border-border rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-caramel"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-rust text-sm mb-4 text-center">{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 bg-gold hover:brightness-95 disabled:opacity-60 text-[#2B1B12] rounded-full font-semibold transition-[filter]"
          >
            {loading ? 'Verificando...' : 'Iniciar sesión'}
          </button>
        </div>
      </div>
    </div>
    </>
  );
}