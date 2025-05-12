// src/services/adminService.js
import apiClient from './apiClient'; // Используем настроенный клиент с токеном

// Базовый путь для всех админских запросов (относительно baseURL, установленного в apiClient)
const API_URL_PREFIX = '/admin';

/**
 * Получает страницу пользователей (требует прав админа).
 * @param {number} page - Номер страницы (начиная с 0).
 * @param {number} size - Количество пользователей на странице.
 * @returns {Promise} - Promise от axios запроса.
 */
const getAllUsers = (page = 0, size = 10) => { // Уменьшил дефолтный size для примера
    // GET /api/admin/users?page=0&size=10
    return apiClient.get(`${API_URL_PREFIX}/users`, {
        params: { page, size }
    });
};

/**
 * Удаляет пост по ID (выполняется админом).
 * @param {number | string} postId - ID поста.
 * @returns {Promise}
 */
const deletePostAsAdmin = (postId) => {
    // DELETE /api/admin/posts/{postId}
    return apiClient.delete(`${API_URL_PREFIX}/posts/${postId}`);
};

/**
 * Удаляет комментарий по ID (выполняется админом).
 * @param {number | string} commentId - ID комментария.
 * @returns {Promise}
 */
const deleteCommentAsAdmin = (commentId) => {
    // DELETE /api/admin/comments/{commentId}
    return apiClient.delete(`${API_URL_PREFIX}/comments/${commentId}`);
};

/**
 * Удаляет пользователя по ID (выполняется админом).
 * @param {number | string} userId - ID пользователя.
 * @returns {Promise}
 */
const deleteUser = (userId) => {
    // DELETE /api/admin/users/{userId}
    return apiClient.delete(`${API_URL_PREFIX}/users/${userId}`);
};

// Собираем все функции в один объект для экспорта
const adminService = {
    getAllUsers,
    deletePostAsAdmin,
    deleteCommentAsAdmin,
    deleteUser
};

export default adminService;