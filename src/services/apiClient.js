// src/services/apiClient.js
import axios from 'axios';
import authService from './authService'; // Используется для получения токена

const ENV_API_BASE_URL = import.meta.env.VITE_API_URL;

if (!ENV_API_BASE_URL) {
    console.error(
        "VITE_API_URL is not defined in your environment variables (.env file or build arguments). " +
        "Falling back to 'http://localhost:8080/api' for development."
    );
}

const resolvedApiBaseUrl = ENV_API_BASE_URL || 'http://localhost:8080/api';
console.debug("apiClient baseURL resolved to:", resolvedApiBaseUrl); // Для отладки

const apiClient = axios.create({
    baseURL: resolvedApiBaseUrl, // Используем разрешенный URL
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor для добавления токена авторизации
apiClient.interceptors.request.use(
    (config) => {
        const user = authService.getCurrentUser(); // Получаем текущего пользователя (с токеном)
        if (user && user.token) {
            config.headers['Authorization'] = 'Bearer ' + user.token;
            // console.debug("ApiClient: Added Auth token to request header for path:", config.url);
        } else {
            // console.debug("ApiClient: No token found, request sent without Auth header for path:", config.url);
        }
        return config;
    },
    (error) => {
        console.error("ApiClient Request Interceptor Error:", error);
        return Promise.reject(error);
    }
);

export default apiClient;