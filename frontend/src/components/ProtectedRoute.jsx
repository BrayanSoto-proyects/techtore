// Ruta protegida: evita acceso sin JWT y redirige al login.
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';
export default function ProtectedRoute() { const { isAuthenticated, cargando } = useAuth(); if (cargando) return <LoadingSpinner />; return isAuthenticated() ? <Outlet /> : <Navigate to="/login" replace />; }
