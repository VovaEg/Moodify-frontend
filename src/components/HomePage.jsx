// src/components/HomePage.jsx
import React, { useState, useEffect } from 'react';
import postService from '../services/postService';
import PostCard from './PostCard';
import Container from 'react-bootstrap/Container';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import Pagination from 'react-bootstrap/Pagination'; // <-- Добавить импорт Pagination

function HomePage() {
    // Состояния
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // --- Состояния для Пагинации ---
    const [currentPage, setCurrentPage] = useState(0); // Текущая страница (начиная с 0)
    const [totalPages, setTotalPages] = useState(0);   // Общее кол-во страниц
    const [isLastPage, setIsLastPage] = useState(false); // Флаг последней страницы
    // --- Конец состояний ---

    // Загрузка постов
    useEffect(() => {
        const fetchPosts = async (pageToFetch) => { // Принимаем номер страницы
            setLoading(true); // Включаем загрузку при каждой смене страницы
            setError(null);
            console.log(`HomePage: Fetching posts for page ${pageToFetch}...`);
            try {
                const response = await postService.getAllPosts(pageToFetch, 10); // Загружаем нужную страницу
                console.log("HomePage: Posts received:", response.data);

                // --- ОБНОВЛЕНИЕ СОСТОЯНИЙ ---
                setPosts(response.data.content);           // Посты текущей страницы
                setTotalPages(response.data.totalPages); // Общее кол-во страниц
                setIsLastPage(response.data.last);         // Является ли последней
                setCurrentPage(response.data.number);      // Устанавливаем номер текущей стр. из ответа
                // --- КОНЕЦ ОБНОВЛЕНИЯ ---

            } catch (err) {
                console.error("HomePage: Failed to fetch posts:", err);
                const message = (err.response?.data?.message) || "Failed to load posts";
                setError(`Failed to load posts: ${message}`);
                setPosts([]);
            } finally {
                setLoading(false); // Выключаем загрузку
            }
        };
        fetchPosts(currentPage); // Вызываем загрузку для currentPage
    }, [currentPage]); // Зависимость только от currentPage

    // Обработчик удаления (без изменений)
    const handlePostDeleted = (deletedPostId) => {
        console.log(`HomePage: Removing post ${deletedPostId} from state.`);
        setPosts(currentPosts => currentPosts.filter(post => post.id !== deletedPostId));
        // В идеале, после удаления нужно бы перезапросить ТЕКУЩУЮ страницу,
        // чтобы пагинация осталась корректной, особенно если удалили последний элемент на странице.
        // Но пока для простоты оставим так.
    };

     // --- НОВЫЙ ОБРАБОТЧИК СМЕНЫ СТРАНИЦЫ ---
     const handlePageChange = (newPage) => {
        // Проверяем, что новая страница в допустимых границах
        if (newPage >= 0 && newPage < totalPages && newPage !== currentPage) {
            setCurrentPage(newPage); // Обновляем состояние текущей страницы
        }
    };
    // --- КОНЕЦ ОБРАБОТЧИКА ---


    // --- Рендеринг ---
    // ... (код для if (loading && posts.length === 0) и if (error) остается) ...
    if (loading && posts.length === 0) { /* ... спиннер ... */ }
    if (error) { /* ... алерт ... */ }

    return (
        <div>
            {/* <h1>Moodify Feed</h1> */}
            {posts.length === 0 && !loading ? (
                <Alert variant="info" className="mt-3">No posts yet. Create one!</Alert>
            ) : (
                <div className="post-list">
                    {posts.map(post => (
                        <PostCard
                            key={post.id}
                            post={post}
                            onPostDeleted={handlePostDeleted}
                        />
                    ))}
                </div>
            )}

             {/* Индикатор загрузки при смене страниц */}
             {loading && posts.length > 0 && (
                <div className="text-center mt-3">
                    <Spinner animation="border" size="sm" />
                    <span className="ms-2">Loading...</span>
                </div>
             )}

            {/* --- ДОБАВЛЯЕМ ПАГИНАЦИЮ --- */}
            {totalPages > 1 && ( // Показываем только если больше одной страницы
                <div className="d-flex justify-content-center mt-4"> {/* Центрируем */}
                    <Pagination>
                        {/* Кнопка на первую страницу */}
                        <Pagination.First onClick={() => handlePageChange(0)} disabled={currentPage === 0 || loading} />
                        {/* Кнопка на предыдущую страницу */}
                        <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 0 || loading} />

                        {/* TODO: Добавить логику для отображения номеров страниц (..., 2, 3, 4, ...) */}
                        {/* Пока просто показываем текущую */}
                        <Pagination.Item active>{currentPage + 1}</Pagination.Item>

                        {/* Кнопка на следующую страницу */}
                        <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={isLastPage || loading} />
                         {/* Кнопка на последнюю страницу */}
                        <Pagination.Last onClick={() => handlePageChange(totalPages - 1)} disabled={isLastPage || loading} />
                    </Pagination>
                </div>
            )}
            {/* --- КОНЕЦ ПАГИНАЦИИ --- */}
        </div>
    );
}

export default HomePage;