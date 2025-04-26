// src/components/Login.jsx
import React, { useState } from 'react';
import authService from '../services/authService'; // Сервис аутентификации
import { useNavigate } from 'react-router-dom'; // Хук для навигации

// Импортируем компоненты из react-bootstrap
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container'; // Для базового контейнера и отступов
import Row from 'react-bootstrap/Row'; // Для системы сетки
import Col from 'react-bootstrap/Col'; // Для системы сетки
import Alert from 'react-bootstrap/Alert'; // Для сообщений об ошибках
import Spinner from 'react-bootstrap/Spinner'; // Для индикатора загрузки

function Login() {
    // Состояния компонента (без изменений)
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Обработчик логина (логика без изменений)
    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage('');
        setLoading(true);
        try {
            await authService.login(username, password);
            navigate('/');
            window.location.reload();
        } catch (error) {
            const resMessage = (error.response?.data?.message) || error.message || error.toString();
             if (error.response && error.response.status === 401) {
                 setMessage("Login Failed: Invalid username or password.");
             } else {
                setMessage(resMessage);
             }
            setLoading(false);
        }
    };

    // --- Рендеринг с использованием React Bootstrap ---
    return (
        // Контейнер с отступом сверху
        <Container className="mt-5">
             {/* Ряд для центрирования колонки */}
             <Row className="justify-content-md-center">
                 {/* Колонка, занимающая разную ширину на разных экранах */}
                 <Col xs={12} md={8} lg={6} xl={5}> {/* Пример адаптивности */}
                    <h2 className="mb-4 text-center">Login</h2> {/* Заголовок с отступом снизу */}
                    {/* Форма React Bootstrap */}
                    <Form onSubmit={handleLogin}>
                        {/* Группа для Username */}
                        <Form.Group className="mb-3" controlId="formLoginUsername">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </Form.Group>

                        {/* Группа для Password */}
                        <Form.Group className="mb-3" controlId="formLoginPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </Form.Group>

                        {/* Сообщение об ошибке (Alert) */}
                        {message && (
                            <Alert variant="danger" className="mt-3">
                                {message}
                            </Alert>
                        )}

                         {/* Кнопка входа */}
                        <div className="d-grid"> {/* Обертка для кнопки на всю ширину */}
                             <Button variant="primary" type="submit" disabled={loading} size="lg">
                                {loading ? (
                                    <>
                                        <Spinner
                                          as="span"
                                          animation="border"
                                          size="sm"
                                          role="status"
                                          aria-hidden="true"
                                        />
                                        <span className="ms-2">Logging in...</span> {/* Отступ слева */}
                                    </>
                                ) : (
                                    'Login'
                                )}
                            </Button>
                        </div>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

export default Login;