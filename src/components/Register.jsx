// src/components/Register.jsx
import React, { useState } from 'react';
import authService from '../services/authService';
import { useNavigate } from 'react-router-dom';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';

function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState(''); // Новое состояние
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setMessage('');
        setLoading(true);

        // Проверка совпадения паролей
        if (password !== confirmPassword) {
            setMessage("Error: Passwords do not match!");
            setLoading(false);
            return;
        }

        try {
            const response = await authService.register(username, email, password);
            setMessage(response.data.message || 'Registration successful! Redirecting to login...');
            setLoading(false);
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (error) {
            const resMessage = (error.response?.data?.message) || error.message || error.toString();
            setMessage(resMessage);
            setLoading(false);
        }
    };

    return (
        <Container className="mt-5">
            <Row className="justify-content-md-center">
                <Col xs={12} md={8} lg={6} xl={5}>
                    <h2 className="mb-4 text-center">Register</h2>
                    <Form onSubmit={handleRegister}>
                        <Form.Group className="mb-3" controlId="formRegisterUsername">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Choose a username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                minLength={3}
                                disabled={loading}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formRegisterEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formRegisterPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Create a password (min 6 chars)"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                                disabled={loading}
                            />
                        </Form.Group>

                        {/* Новое поле для подтверждения пароля */}
                        <Form.Group className="mb-3" controlId="formRegisterConfirmPassword">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Confirm your password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                minLength={6}
                                disabled={loading}
                            />
                        </Form.Group>

                        {message && (
                            <Alert variant={message.toLowerCase().includes('successful') || message.toLowerCase().includes('error: username is already taken!') || message.toLowerCase().includes('error: email is already in use!') ? (message.toLowerCase().includes('successful') ? 'success' : 'danger') : 'danger'} className="mt-3">
                                {/* Усложненная логика для цвета Alert, чтобы ошибки бэкенда тоже были красными */}
                                {message}
                            </Alert>
                        )}

                        <div className="d-grid mt-3">
                            <Button variant="primary" type="submit" disabled={loading} size="lg">
                                {loading ? (
                                    <>
                                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true"/>
                                        <span className="ms-2">Registering...</span>
                                    </>
                                ) : (
                                    'Sign Up'
                                )}
                            </Button>
                        </div>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

export default Register;