// src/services/adminService.js
import apiClient from './apiClient'; // Используем настроенный клиент с токеном

const API_URL = '/admin'; // Базовый путь для админских запросов (относительно baseURL в apiClient)

/**
 * Получает страницу пользователей (требует прав админа).
 * @param {number} page - Номер страницы.
 * @param {number} size - Размер страницы.
 * @returns {Promise}
 */
const getAllUsers = (page = 0, size = 20) => {
    // GET /admin/users?page=0&size=20
    return apiClient.get(`${API_URL}/users`, {
        params: { page, size }
    });
};

/**
 * Удаляет пост по ID (выполняется админом).
 * @param {number | string} postId - ID поста.
 * @returns {Promise}
 */
const deletePost = (postId) => {
    // DELETE /admin/posts/{postId}
    return apiClient.delete(`${API_URL}/posts/${postId}`);
};

/**
 * Удаляет комментарий по ID (выполняется админом).
 * @param {number | string} commentId - ID комментария.
 * @returns {Promise}
 */
const deleteComment = (commentId) => {
     // DELETE /admin/comments/{commentId}
    return apiClient.delete(`${API_URL}/comments/${commentId}`);
};


// TODO: Добавить функции для удаления/бана пользователей, если они будут реализованы на бэкенде
// const deleteUser = (userId) => apiClient.delete(`${API_URL}/users/${userId}`);
// const setUserEnabled = (userId, enabled) => apiClient.put(`${API_URL}/users/${userId}/${enabled ? 'enable' : 'disable'}`);


const adminService = {
    getAllUsers,
    deletePost,
    deleteComment
    // deleteUser,
    // setUserEnabled
};

export default adminService;