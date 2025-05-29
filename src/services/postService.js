// src/services/postService.js
import apiClient from './apiClient'; // <-- Импортируем НАШ настроенный клиент

const getAllPosts = (page = 0, size = 10) => {
    // GET /api/posts?page=0&size=10 (Пример)
    // Этот запрос публичный, токен не обязателен, но apiClient его добавит, если он есть.
    // Бэкенд должен игнорировать токен для этого эндпоинта.
    return apiClient.get('/posts', {
        params: { page, size } // Передаем параметры пагинации
    });
};

const getPostById = (postId) => {
    // GET /api/posts/{postId}
    return apiClient.get(`/posts/${postId}`);
};

const createPost = (postData) => {
    // POST /api/posts
    return apiClient.post('/posts', postData);
};

const updatePost = (postId, postData) => {
    // PUT /api/posts/{postId}
    return apiClient.put(`/posts/${postId}`, postData);
};

const deletePost = (postId) => {
    // DELETE /api/posts/{postId}
    return apiClient.delete(`/posts/${postId}`);
};

const likePost = (postId) => {
    // POST /api/posts/{postId}/likes
    return apiClient.post(`/posts/${postId}/likes`);
};

const unlikePost = (postId) => {
    // DELETE /api/posts/{postId}/likes
    return apiClient.delete(`/posts/${postId}/likes`);
};

const getComments = (postId, page = 0, size = 10) => {
    // GET /api/posts/{postId}/comments?page=0&size=10
     return apiClient.get(`/posts/${postId}/comments`, {
        params: { page, size }
    });
};

const createComment = (postId, commentData) => {
    // POST /api/posts/{postId}/comments
    return apiClient.post(`/posts/${postId}/comments`, commentData);
};

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