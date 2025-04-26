// src/services/authService.js
import axios from 'axios';

// URL вашего бэкенда. Убедитесь, что порт (8080) правильный.
const API_URL = 'http://localhost:8080/api/auth/';

const register = (username, email, password) => {
    return axios.post(API_URL + 'register', {
        username,
        email,
        password,
    });
};

const login = async (username, password) => {
    try {
        const response = await axios.post(API_URL + 'login', {
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
        console.error("AuthService: Login failed:", error.response ? error.response.data : error.message);
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
        localStorage.removeItem('user');
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