import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true';

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('xp_arena_user');
            window.location.href = '/login?reason=session_expired';
        }
        return Promise.reject(error);
    }
);

const parseApiError = (error, fallbackMessage) => {
    if (error?.response?.data?.message) return error.response.data.message;
    if (error?.response?.data?.error) return error.response.data.error;
    if (error?.message) return error.message;
    return fallbackMessage;
};

export const authService = {
    async login(username, password) {
        if (USE_MOCK_API) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    if (password === 'password') {
                        resolve({
                            data: {
                                success: true,
                                user: { username, axp: 1250, rank: 'Elite' },
                                token: 'mock-jwt'
                            }
                        });
                    } else {
                        reject(new Error('Invalid credentials'));
                    }
                }, 500);
            });
        }

        try {
            return await api.post('/auth/login', { username, password });
        } catch (error) {
            throw new Error(parseApiError(error, 'Login failed'));
        }
    },

    async signup(username, email, password) {
        if (USE_MOCK_API) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve({
                        data: {
                            success: true,
                            user: { username, email, axp: 0, rank: 'Rookie' },
                            token: 'mock-jwt'
                        }
                    });
                }, 500);
            });
        }

        try {
            return await api.post('/auth/register', { username, email, password });
        } catch (error) {
            throw new Error(parseApiError(error, 'Registration failed'));
        }
    },

    async verifySession() {
        try {
            return await api.get('/auth/verify');
        } catch (error) {
            throw new Error(parseApiError(error, 'Session expired'));
        }
    }
};

export const setupService = {
    async submitSetup(setupData) {
        if (USE_MOCK_API) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve({
                        data: {
                            success: true,
                            id: Math.floor(Math.random() * 100000),
                            code: `AXP-${Math.floor(Math.random() * 90000) + 10000}`
                        }
                    });
                }, 800);
            });
        }

        try {
            return await api.post('/setups/submit', setupData);
        } catch (error) {
            throw new Error(parseApiError(error, 'Setup submission failed'));
        }
    }
};



export const userService = {
    async getProfile() {
        try {
            return await api.get('/user/profile');
        } catch (error) {
            throw new Error(parseApiError(error, 'Failed to load profile.'));
        }
    },

    async updateNickname(newUsername) {
        try {
            return await api.post('/user/nickname', { newUsername });
        } catch (error) {
            throw new Error(parseApiError(error, 'Failed to update username.'));
        }
    },

    async updateAvatar(avatar) {
        try {
            return await api.post('/user/avatar', { avatar });
        } catch (error) {
            throw new Error(parseApiError(error, 'Failed to update avatar.'));
        }
    },

    async updateSocials(socials) {
        try {
            return await api.post('/user/socials', { socials });
        } catch (error) {
            throw new Error(parseApiError(error, 'Failed to update socials.'));
        }
    },

    async syncProfile() {
        try {
            const { data } = await api.get('/user/profile');
            return data.user;
        } catch (error) {
            console.warn('Profile sync failed:', error);
            return null;
        }
    }
};

export const mysteryService = {
    async decryptNode() {
        try {
            return await api.post('/mystery/open');
        } catch (error) {
            throw new Error(parseApiError(error, 'Decryption sequence failed.'));
        }
    }
};

export const systemService = {
    async readiness() {
        try {
            return await api.get('/ready');
        } catch (error) {
            throw new Error(parseApiError(error, 'Service is not ready yet.'));
        }
    }
};

export default api;
