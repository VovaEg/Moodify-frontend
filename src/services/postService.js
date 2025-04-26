// src/services/postService.js
import apiClient from './apiClient'; // <-- Импортируем НАШ настроенный клиент

// --- Функции для Постов ---

/**
 * Получает страницу постов.
 * @param {number} page - Номер страницы (начиная с 0).
 * @param {number} size - Количество постов на странице.
 * @returns {Promise} - Promise от axios запроса.
 */
const getAllPosts = (page = 0, size = 10) => {
    // GET /api/posts?page=0&size=10 (Пример)
    // Этот запрос публичный, токен не обязателен, но apiClient его добавит, если он есть.
    // Бэкенд должен игнорировать токен для этого эндпоинта.
    return apiClient.get('/posts', {
        params: { page, size } // Передаем параметры пагинации
    });
};

/**
 * Получает один пост по ID.
 * @param {number | string} postId - ID поста.
 * @returns {Promise}
 */
const getPostById = (postId) => {
    // GET /api/posts/{postId}
    return apiClient.get(`/posts/${postId}`);
};

/**
 * Создает новый пост. Требует токен (будет добавлен apiClient).
 * @param {object} postData - Данные поста (e.g., { content: '...', songUrl: '...' }).
 * @returns {Promise}
 */
const createPost = (postData) => {
    // POST /api/posts
    return apiClient.post('/posts', postData);
};

/**
 * Обновляет пост. Требует токен.
 * @param {number | string} postId - ID поста.
 * @param {object} postData - Новые данные поста.
 * @returns {Promise}
 */
const updatePost = (postId, postData) => {
    // PUT /api/posts/{postId}
    return apiClient.put(`/posts/${postId}`, postData);
};

/**
 * Удаляет пост. Требует токен.
 * @param {number | string} postId - ID поста.
 * @returns {Promise}
 */
const deletePost = (postId) => {
    // DELETE /api/posts/{postId}
    return apiClient.delete(`/posts/${postId}`);
};

// --- Функции для Лайков ---

/**
 * Ставит лайк посту. Требует токен.
 * @param {number | string} postId - ID поста.
 * @returns {Promise}
 */
const likePost = (postId) => {
    // POST /api/posts/{postId}/likes
    return apiClient.post(`/posts/${postId}/likes`);
};

/**
 * Снимает лайк с поста. Требует токен.
 * @param {number | string} postId - ID поста.
 * @returns {Promise}
 */
const unlikePost = (postId) => {
    // DELETE /api/posts/{postId}/likes
    return apiClient.delete(`/posts/${postId}/likes`);
};

// --- Функции для Комментариев ---

 /**
 * Получает комментарии для поста.
 * @param {number | string} postId - ID поста.
 * @param {number} page - Номер страницы.
 * @param {number} size - Размер страницы.
 * @returns {Promise}
 */
const getComments = (postId, page = 0, size = 10) => {
    // GET /api/posts/{postId}/comments?page=0&size=10
     return apiClient.get(`/posts/${postId}/comments`, {
        params: { page, size }
    });
};

/**
 * Создает комментарий для поста. Требует токен.
 * @param {number | string} postId - ID поста.
 * @param {object} commentData - Данные комментария (e.g., { content: '...' }).
 * @returns {Promise}
 */
const createComment = (postId, commentData) => {
    // POST /api/posts/{postId}/comments
    return apiClient.post(`/posts/${postId}/comments`, commentData);
};

/**
 * Удаляет комментарий. Требует токен.
 * @param {number | string} commentId - ID комментария.
 * @returns {Promise}
 */
const deleteComment = (commentId) => {
    // DELETE /api/comments/{commentId} - Используем эндпоинт из CommentController
    return apiClient.delete(`/comments/${commentId}`);
};


// Собираем все функции в объект
const postService = {
    getAllPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost,
    likePost,
    unlikePost,
    getComments,
    createComment,
    deleteComment
};

// Экспортируем сервис
export default postService;