import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import authService from '../services/authService';

// Компонент-обгортка для захищених адмінських роутів
function AdminRoute({ children }) {
  const currentUser = authService.getCurrentUser();

  if (!currentUser || !currentUser.token) {
    console.log("AdminRoute: No user logged in. Redirecting to login.");
    return <Navigate to="/login" replace />;
  }

  const isAdmin = Array.isArray(currentUser.roles) && currentUser.roles.includes('ROLE_ADMIN');

  if (!isAdmin) {
    // Якщо користувач не адмін - редірект на головну
    console.log(`AdminRoute: User ${currentUser.username} is not admin. Redirecting to home.`);
    return <Navigate to="/" replace />;
  }
  return children;
}

export default AdminRoute;