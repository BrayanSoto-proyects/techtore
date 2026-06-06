// Contexto global de autenticación: guarda token, usuario y funciones de sesión.
import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';
const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);
export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const login = async (token) => { localStorage.setItem('token', token); const { data } = await api.get('/auth/me'); setUsuario(data.usuario); };
  const logout = () => { localStorage.removeItem('token'); setUsuario(null); };
  const isAuthenticated = () => Boolean(localStorage.getItem('token'));
  useEffect(() => { (async () => { try { if (isAuthenticated()) { const { data } = await api.get('/auth/me'); setUsuario(data.usuario); } } catch { logout(); } finally { setCargando(false); } })(); }, []);
  return <AuthContext.Provider value={{ usuario, login, logout, isAuthenticated, cargando }}>{children}</AuthContext.Provider>;
}
