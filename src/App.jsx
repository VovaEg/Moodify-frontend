// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Login from './components/Login';
import Register from './components/Register';
import HomePage from './components/HomePage';
import CreatePost from './components/CreatePost';
import EditPost from './components/EditPost';
import AdminRoute from './components/AdminRoute';
import UserList from './components/admin/UserList';

import authService from './services/authService';

function ProtectedRoute({ children }) {
  const currentUser = authService.getCurrentUser();
  if (!currentUser || !currentUser.token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
    const currentUser = authService.getCurrentUser();
    const navigate = useNavigate(); // Хук для навигации

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    return (
        <div>
            <Navbar expand="lg" bg="light" variant="light" className="mb-3 shadow-sm" sticky="top">
                <Container>
                    <Navbar.Brand as={Link} to="/">Moodify</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                             {currentUser && (
                                <Nav.Link as={Link} to="/create-post">Create Post</Nav.Link>
                             )}
                             {currentUser?.roles?.includes('ROLE_ADMIN') && (
                                <Nav.Link as={Link} to="/admin/users">Admin Users</Nav.Link>
                             )}
                        </Nav>
                        <Nav className="ms-auto">
                            {currentUser ? (
                                <>
                                    <Navbar.Text className="me-2">
                                         Signed in as: <span style={{fontWeight: 'bold'}}>{currentUser.username}</span>
                                    </Navbar.Text>
                                    <Button variant="outline-secondary" size="sm" onClick={handleLogout}>
                                        Logout
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Nav.Link as={Link} to="/login">Login</Nav.Link>
                                    <Nav.Link as={Link} to="/register">Register</Nav.Link>
                                </>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Container>
                <Routes>
                    <Route path="/" element={ <ProtectedRoute> <HomePage /> </ProtectedRoute> } />
                    <Route path="/create-post" element={ <ProtectedRoute> <CreatePost /> </ProtectedRoute> } />
                    <Route path="/posts/:postId/edit" element={ <ProtectedRoute> <EditPost /> </ProtectedRoute> } />
                    <Route path="/admin/users" element={ <AdminRoute> <UserList /> </AdminRoute> } />

                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    <Route path="*" element={<h2 style={{textAlign: 'center', marginTop: '2em'}}>404: Page Not Found</h2>} />
                </Routes>
            </Container>
        </div>
    );
}

export default App;