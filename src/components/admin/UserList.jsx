// src/components/admin/UserList.jsx
import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';

// --- Импорты React Bootstrap ---
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table'; // Для таблицы
import Alert from 'react-bootstrap/Alert';   // Для ошибок/сообщений
import Spinner from 'react-bootstrap/Spinner'; // Для загрузки
import Pagination from 'react-bootstrap/Pagination'; // Для пагинации
// --- Конец импортов ---

function UserList() {
    // Состояния (без изменений)
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0); // Текущая страница (начиная с 0)
    const [totalPages, setTotalPages] = useState(0); // Общее кол-во страниц

    // Функция загрузки пользователей (без изменений)
    const fetchUsers = async (pageNum) => {
        setLoading(true); setError(null);
        try {
            const response = await adminService.getAllUsers(pageNum, 10); // Загружаем по 10
            setUsers(response.data.content);
            setTotalPages(response.data.totalPages);
            setPage(response.data.number);
        } catch (err) {
            console.error("Failed to fetch users:", err);
            setError(err.response?.data?.message || "Failed to load users.");
            setUsers([]);
        } finally { setLoading(false); }
    };

    // useEffect для загрузки (без изменений)
    useEffect(() => {
        fetchUsers(page);
    }, [page]);

    // Обработчик смены страницы для пагинации
    const handlePageChange = (newPage) => {
        // Проверяем границы страниц
        if (newPage >= 0 && newPage < totalPages) {
            setPage(newPage); // Устанавливаем новую страницу (запустит useEffect)
        }
    };


    // --- Логика Рендеринга ---

    // Отображение ошибки
    if (error) {
        return <Container className="mt-3"><Alert variant="danger">Error: {error}</Alert></Container>;
    }

    // Отображение загрузки (только при первой загрузке)
     if (loading && users.length === 0) {
         return (
            <Container className="text-center mt-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </Container>
        );
    }

    // --- Основной рендеринг с таблицей и пагинацией ---
    return (
        <Container className="mt-4">
            <h2 className="mb-4">User Management</h2>

            {/* Сообщение, если нет пользователей */}
            {users.length === 0 && !loading ? (
                <Alert variant="info">No users found.</Alert>
            ) : (
                 <> {/* Используем фрагмент, чтобы вернуть таблицу и пагинацию */}
                    {/* Таблица Bootstrap */}
                    <Table striped bordered hover responsive size="sm">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Roles</th>
                                <th>Enabled</th>
                                <th>Created At</th>
                                {/* <th>Actions</th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.username}</td>
                                    <td>{user.email}</td>
                                    <td>{user.roles?.join(', ')}</td>
                                    <td>{user.enabled ? 'Yes' : 'No'}</td>
                                    <td>{new Date(user.createdAt).toLocaleString('uk-UA')}</td>
                                    {/* <td> TODO: Add buttons </td> */}
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    {/* Компонент Пагинации Bootstrap */}
                    {totalPages > 1 && ( // Показываем пагинацию только если больше 1 страницы
                        <Pagination className="justify-content-center">
                            <Pagination.First onClick={() => handlePageChange(0)} disabled={page === 0 || loading} />
                            <Pagination.Prev onClick={() => handlePageChange(page - 1)} disabled={page === 0 || loading} />

                            {/* Логика отображения номеров страниц (упрощенная) */}
                            {/* Можно сделать сложнее, чтобы показывать не все номера */}
                            {[...Array(totalPages).keys()].map(num => (
                                <Pagination.Item key={num} active={num === page} onClick={() => handlePageChange(num)} disabled={loading}>
                                    {num + 1}
                                </Pagination.Item>
                            ))}

                            <Pagination.Next onClick={() => handlePageChange(page + 1)} disabled={page >= totalPages - 1 || loading} />
                            <Pagination.Last onClick={() => handlePageChange(totalPages - 1)} disabled={page >= totalPages - 1 || loading} />
                        </Pagination>
                    )}
                    {/* Индикатор загрузки при смене страниц */}
                    {loading && users.length > 0 && <div className="text-center"><Spinner animation="border" size="sm"/></div>}
                </>
            )}
        </Container>
    );
}

export default UserList;