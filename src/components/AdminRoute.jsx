// src/components/AdminRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import authService from '../services/authService';

// Компонент-обертка для защищенных админских роутов
function AdminRoute({ children }) { // Принимает дочерние компоненты
  const currentUser = authService.getCurrentUser();

  // 1. Проверяем, есть ли пользователь и токен
  if (!currentUser || !currentUser.token) {
    console.log("AdminRoute: No user logged in. Redirecting to login.");
    return <Navigate to="/login" replace />;
  }

  // 2. Проверяем, есть ли у пользователя роль ROLE_ADMIN
  // Убедимся, что поле roles существует и является массивом
  const isAdmin = Array.isArray(currentUser.roles) && currentUser.roles.includes('ROLE_ADMIN');

  if (!isAdmin) {
    // Если пользователь не админ - редирект на главную
    console.log(`AdminRoute: User ${currentUser.username} is not admin. Redirecting to home.`);
    return <Navigate to="/" replace />;
    // Альтернатива: показать страницу "Доступ запрещен"
    // return (
    //   <div>
    //     <h2>Access Denied</h2>
    //     <p>You do not have permission to view this page.</p>
    //   </div>
    // );
  }

  // 3. Если пользователь - админ, рендерим запрошенный дочерний компонент
  // Если используем <Route path="..." element={<AdminRoute><Component /></AdminRoute>} />, то возвращаем children
  return children;
  // Если бы использовали вложенные роуты (<Route element={<AdminRoute />}> <Route path="..." /> </Route>),
  // то возвращали бы <Outlet />
}

export default AdminRoute;