import axios from 'axios';

// Mock instance setup for MVP Phase 1
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    timeout: 10000,
});

// Interceptor to add auth token in the future
api.interceptors.request.use(
    (config) => {
        // const token = localStorage.getItem('xp_arena_token');
        // if (token) {
        //   config.headers['Authorization'] = `Bearer ${token}`;
        // }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;

export const authService = {
    login: async (username, password) => {
        // return api.post('/auth/login', { username, password });

        // MOCK FOR MVP:
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (password === 'password') {
                    resolve({ data: { user: { username, axp: 1250, rank: 'Elite' }, token: 'mock-jwt' } });
                } else {
                    reject(new Error('Invalid credentials'));
                }
            }, 500);
        });
    },

    signup: async (username, email) => {
        // return api.post('/auth/signup', { username, email, password });

        // MOCK FOR MVP:
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({ data: { user: { username, email, axp: 0, rank: 'Rookie' }, token: 'mock-jwt' } });
            }, 500);
        });
    }
};

export const setupService = {
    submitSetup: async () => {
        // return api.post('/setups', setupData);

        // MOCK FOR MVP:
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({ data: { message: 'Setup submitted', code: `AXP-${Math.floor(Math.random() * 90000) + 10000}` } });
            }, 800);
        });
    }
};
