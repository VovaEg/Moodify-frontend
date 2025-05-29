// src/services/authService.js
import axios from 'axios';

const ENV_API_BASE_URL = import.meta.env.VITE_API_URL;

if (!ENV_API_BASE_URL) {
    console.error(
        "VITE_API_URL (for authService) is not defined in your environment variables (.env file or build arguments). " +
        "Falling back to 'http://localhost:8080/api' for development."
    );
}

const AUTH_API_URL = (ENV_API_BASE_URL || 'http://localhost:8080/api') + '/auth/';
console.debug("authService API URL resolved to:", AUTH_API_URL); // Для отладки

const register = (username, email, password) => {
    return axios.post(AUTH_API_URL + 'register', { // Используем AUTH_API_URL
        username,
        email,
        password,
    });
};

const login = async (username, password) => {
    try {
        const response = await axios.post(AUTH_API_URL + 'login', { // Используем AUTH_API_URL
            username,
            password,
        });
        if (response.data && response.data.token) {
            localStorage.setItem('user', JSON.stringify(response.data));
            console.log("AuthService: Login successful, user data stored in localStorage.");
        } else {
            console.warn("AuthService: Login response did not contain a token.", response.data);
        }
        return response.data;
    } catch (error) {
        console.error("AuthService: Login failed:", error.response ? error.response.data : error.message, error); // Добавил error для полного вывода
        // Пробрасываем ошибку дальше, чтобы компонент Login мог ее обработать
        throw error;
    }
};

const logout = () => {
    localStorage.removeItem('user');
    console.log("AuthService: User logged out, data removed from localStorage.");
};

const getCurrentUser = () => {
    try {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            return JSON.parse(userStr);
        } else {
            return null;
        }
    } catch (e) {
        console.error("AuthService: Could not parse user from localStorage", e);
        localStorage.removeItem('user'); // Очищаем некорректные данные
        return null;
    }
};

const authService = {
    register,
    login,
    logout,
    getCurrentUser,
};

export default authService;