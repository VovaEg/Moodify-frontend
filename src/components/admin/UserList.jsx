// src/components/admin/UserList.jsx
import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService'; // Наш админский сервис
import authService from '../../services/authService';   // Для получения ID текущего админа

// Импортируем компоненты React Bootstrap
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import Pagination from 'react-bootstrap/Pagination';
import Button from 'react-bootstrap/Button';

function UserList() {
    // Состояния для списка пользователей и пагинации
    const [users, setUsers] = useState([]);
    const [loadingList, setLoadingList] = useState(true); // Загрузка списка пользователей
    const [listError, setListError] = useState(null);    // Ошибка загрузки списка
    const [currentPage, setCurrentPage] = useState(0);      // Текущая страница (начиная с 0)
    const [totalPages, setTotalPages] = useState(0);    // Общее кол-во страниц

    // Состояния для процесса удаления конкретного пользователя
    const [isDeleting, setIsDeleting] = useState(null); // Хранит ID удаляемого юзера или null
    const [actionError, setActionError] = useState(null);   // Ошибка при выполнении действия (удаления)
    const [actionSuccess, setActionSuccess] = useState(null); // Сообщение об успехе действия

    // Получаем информацию о текущем вошедшем админе
    const currentUser = authService.getCurrentUser();

    // Функция для загрузки пользователей
    const fetchUsers = async (pageNum) => {
        setLoadingList(true); // Включаем индикатор загрузки списка
        setListError(null);   // Сбрасываем предыдущие ошибки списка
        setActionError(null); // Сбрасываем ошибки действий
        setActionSuccess(null); // Сбрасываем сообщения об успехе действий

        try {
            const response = await adminService.getAllUsers(pageNum, 10); // Загружаем по 10 пользователей
            setUsers(response.data.content);
            setTotalPages(response.data.totalPages);
            setCurrentPage(response.data.number); // Обновляем текущую страницу из ответа
        } catch (err) {
            console.error("UserList: Failed to fetch users:", err);
            setListError(err.response?.data?.message || err.message || "Failed to load users.");
            setUsers([]); // Очищаем список при ошибке
            setTotalPages(0); // Сбрасываем пагинацию
        } finally {
            setLoadingList(false); // Выключаем индикатор загрузки списка
        }
    };

    // Загружаем пользователей при монтировании компонента и при смене страницы
    useEffect(() => {
        fetchUsers(currentPage);
    }, [currentPage]); // Зависимость от currentPage

    // Обработчик смены страницы
    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages && newPage !== currentPage && !isDeleting) {
            setCurrentPage(newPage);
        }
    };

    // Обработчик удаления пользователя
    const handleDeleteUser = async (userId, username) => {
        // Проверяем, не пытается ли админ удалить сам себя
        if (currentUser && currentUser.id === userId) {
            setActionError("You cannot delete yourself through this interface.");
            return;
        }

        if (!window.confirm(`Are you sure you want to delete user "${username}" (ID: ${userId})? This action is irreversible and will delete all their posts and associated content.`)) {
            return;
        }

        setIsDeleting(userId); // Устанавливаем ID удаляемого юзера для индикации на кнопке
        setActionError(null);
        setActionSuccess(null);

        try {
            const response = await adminService.deleteUser(userId);
            setActionSuccess(response.data.message || `User "${username}" deleted successfully.`);
            // Обновляем список пользователей: перезапрашиваем текущую страницу.
            // Если на текущей странице не осталось элементов после удаления,
            // а это была не первая страница, можно перейти на предыдущую.
            if (users.length === 1 && currentPage > 0) {
                fetchUsers(currentPage - 1);
            } else {
                fetchUsers(currentPage);
            }
        } catch (err) {
            console.error(`UserList: Failed to delete user ${userId}:`, err);
            setActionError(err.response?.data?.message || `Failed to delete user "${username}".`);
        } finally {
            setIsDeleting(null); // Сбрасываем ID удаляемого юзера
        }
    };


    // --- Рендеринг ---
    if (loadingList && users.length === 0 && !isDeleting) {
        return (
            <Container className="text-center mt-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading users...</span>
                </Spinner>
            </Container>
        );
    }

    if (listError) {
        return <Container className="mt-3"><Alert variant="danger">Error loading user list: {listError}</Alert></Container>;
    }

    return (
        <Container className="mt-4">
            <h2 className="mb-4">User Management</h2>

            {/* Сообщения об успехе/ошибке действий */}
            {actionSuccess && <Alert variant="success" onClose={() => setActionSuccess(null)} dismissible>{actionSuccess}</Alert>}
            {actionError && <Alert variant="danger" onClose={() => setActionError(null)} dismissible>{actionError}</Alert>}

            {users.length === 0 && !loadingList ? (
                <Alert variant="info" className="mt-3">No users found.</Alert>
            ) : (
                <>
                    <Table striped bordered hover responsive size="sm" className="mt-3">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Roles</th>
                            <th>Enabled</th>
                            <th>Created At</th>
                            <th>Actions</th>
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
                                <td>{new Date(user.createdAt).toLocaleString('uk-UA', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                                <td>
                                    {/* Не даем админу удалить самого себя через эту кнопку */}
                                    {currentUser && currentUser.id !== user.id ? (
                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            onClick={() => handleDeleteUser(user.id, user.username)}
                                            disabled={isDeleting === user.id} // Блокируем кнопку, если именно этот юзер удаляется
                                        >
                                            {isDeleting === user.id ? <Spinner as="span" animation="border" size="sm" /> : 'Delete'}
                                        </Button>
                                    ) : (
                                        <span className="text-muted small">N/A</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>

                    {/* Пагинация */}
                    {totalPages > 1 && (
                        <Pagination className="justify-content-center">
                            <Pagination.First onClick={() => handlePageChange(0)} disabled={currentPage === 0 || loadingList || isDeleting !== null} />
                            <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 0 || loadingList || isDeleting !== null} />
                            {/* TODO: Более умная пагинация с номерами страниц */}
                            {[...Array(totalPages).keys()].map(num => (
                                <Pagination.Item key={num} active={num === currentPage} onClick={() => handlePageChange(num)} disabled={loadingList || isDeleting !== null}>
                                    {num + 1}
                                </Pagination.Item>
                            ))}
                            <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage >= totalPages - 1 || loadingList || isDeleting !== null} />
                            <Pagination.Last onClick={() => handlePageChange(totalPages - 1)} disabled={currentPage >= totalPages - 1 || loadingList || isDeleting !== null} />
                        </Pagination>
                    )}
                    {/* Индикатор загрузки списка, если он уже был отображен */}
                    {loadingList && users.length > 0 && <div className="text-center mt-2"><Spinner animation="border" size="sm"/></div>}
                </>
            )}
        </Container>
    );
}

export default UserList;