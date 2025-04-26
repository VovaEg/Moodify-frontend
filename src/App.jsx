// src/App.jsx
import React from 'react';
// Импорты react-router-dom
import { BrowserRouter as Router, Route, Routes, Link, Navigate, useNavigate } from 'react-router-dom';

// Импорты React Bootstrap для Navbar
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';

// Импорты компонентов страниц/компоненты
import Login from './components/Login';
import Register from './components/Register';
import HomePage from './components/HomePage';
import CreatePost from './components/CreatePost';
import EditPost from './components/EditPost';
import AdminRoute from './components/AdminRoute';
import UserList from './components/admin/UserList';

// Импорт сервиса аутентификации
import authService from './services/authService';

// --- Вспомогательные Компоненты ---

// Компонент защиты обычных роутов
function ProtectedRoute({ children }) {
  const currentUser = authService.getCurrentUser();
  if (!currentUser || !currentUser.token) {
    // console.log("ProtectedRoute: No user found, redirecting to /login");
    return <Navigate to="/login" replace />;
  }
  return children;
}

// --- Основной Компонент Приложения ---
function App() {
    const currentUser = authService.getCurrentUser();
    const navigate = useNavigate(); // Хук для навигации

    // Функция выхода из системы
    const handleLogout = () => {
        authService.logout(); // Очищаем данные пользователя
        navigate('/login'); // Перенаправляем на страницу входа
    };

    return (
        // Обертка div (Router предполагается снаружи в AppWrapper или main.jsx)
        <div>
            {/* --- Навигационная Панель Bootstrap --- */}
            <Navbar expand="lg" bg="light" variant="light" className="mb-3 shadow-sm" sticky="top">
                <Container> {/* Используем контейнер для центрирования и отступов */}
                    {/* Бренд/Название приложения (ссылка на главную) */}
                    <Navbar.Brand as={Link} to="/">Moodify</Navbar.Brand>
                    {/* Кнопка "бургера" для мобильных устройств */}
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    {/* Сворачиваемая часть навбара */}
                    <Navbar.Collapse id="basic-navbar-nav">
                        {/* Навигационные ссылки слева */}
                        <Nav className="me-auto">
                             {/* Показываем "Create Post" только если пользователь вошел */}
                             {currentUser && (
                                <Nav.Link as={Link} to="/create-post">Create Post</Nav.Link>
                             )}
                             {/* Показываем "Admin Users" только если пользователь - админ */}
                             {currentUser?.roles?.includes('ROLE_ADMIN') && (
                                <Nav.Link as={Link} to="/admin/users">Admin Users</Nav.Link>
                             )}
                        </Nav>
                        {/* Навигационные ссылки/элементы справа */}
                        <Nav className="ms-auto">
                            {currentUser ? (
                                // Если пользователь вошел
                                <>
                                    <Navbar.Text className="me-2">
                                         Signed in as: <span style={{fontWeight: 'bold'}}>{currentUser.username}</span>
                                    </Navbar.Text>
                                    {/* Кнопка выхода */}
                                    <Button variant="outline-secondary" size="sm" onClick={handleLogout}>
                                        Logout
                                    </Button>
                                </>
                            ) : (
                                // Если пользователь не вошел
                                <>
                                    <Nav.Link as={Link} to="/login">Login</Nav.Link>
                                    <Nav.Link as={Link} to="/register">Register</Nav.Link>
                                </>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            {/* --- КОНЕЦ Навигационной Панели --- */}

            {/* --- Основная область для контента страниц --- */}
            {/* Используем Container из Bootstrap для отступов по бокам */}
            <Container>
                <Routes> {/* Здесь определяются все маршруты */}
                    {/* Главная страница ('/') - Защищено */}
                    <Route path="/" element={ <ProtectedRoute> <HomePage /> </ProtectedRoute> } />
                    {/* Создание Поста ('/create-post') - Защищено */}
                    <Route path="/create-post" element={ <ProtectedRoute> <CreatePost /> </ProtectedRoute> } />
                    {/* Редактирование Поста ('/posts/:postId/edit') - Защищено */}
                    <Route path="/posts/:postId/edit" element={ <ProtectedRoute> <EditPost /> </ProtectedRoute> } />
                    {/* Админский Маршрут ('/admin/users') - Защищено AdminRoute */}
                    <Route path="/admin/users" element={ <AdminRoute> <UserList /> </AdminRoute> } />

                    {/* Вход и Регистрация (Публичные) */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Страница не найдена */}
                    <Route path="*" element={<h2 style={{textAlign: 'center', marginTop: '2em'}}>404: Page Not Found</h2>} />
                </Routes>
            </Container>
             {/* --- КОНЕЦ Основной области --- */}
        </div>
    );
}

// Экспортируем обертку или сам App
export default App; // Или export default App;