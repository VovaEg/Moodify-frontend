// src/services/apiClient.js
import axios from 'axios';
import authService from './authService'; // Импортируем сервис аутентификации

// Базовый URL для всех запросов к нашему API (кроме /api/auth)
const API_BASE_URL = 'http://localhost:8080/api'; // Обратите внимание, без /auth/

// Создаем экземпляр axios с базовым URL
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Добавляем "перехватчик" (interceptor) запросов
apiClient.interceptors.request.use(
    (config) => {
        // Получаем данные пользователя (включая токен) из localStorage
        const user = authService.getCurrentUser();

        // Если пользователь есть и у него есть токен
        if (user && user.token) {
            // Добавляем заголовок Authorization к КАЖДОМУ запросу,
            // отправленному через этот экземпляр apiClient
            config.headers['Authorization'] = 'Bearer ' + user.token;
            console.debug("ApiClient: Added Auth token to request header for path:", config.url); // Для отладки
        } else {
            console.debug("ApiClient: No token found, request sent without Auth header for path:", config.url);
        }
        return config; // Возвращаем измененную конфигурацию запроса
    },
    (error) => {
        // Обработка ошибки при настройке запроса (маловероятно)
        console.error("ApiClient Request Interceptor Error:", error);
        return Promise.reject(error);
    }
);

// Экспортируем настроенный экземпляр axios
export default apiClient;