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
                                user: { username, points: 1250, rank: 'Elite' },
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
                            user: { username, email, points: 0, rank: 'Beginner' },
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
    },

    async forgotPassword(email) {
        try {
            return await api.post('/auth/forgot-password', { email });
        } catch (error) {
            throw new Error(parseApiError(error, 'Failed to start password recovery'));
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
                            code: `PTS-${Math.floor(Math.random() * 90000) + 10000}`
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

export const guildService = {
    async getMyGuild() {
        try {
            return await api.get('/guilds/my-guild');
        } catch (error) {
            throw new Error(parseApiError(error, 'Failed to fetch guild details'));
        }
    },

    async getMembers(guildId) {
        try {
            return await api.get(`/guilds/members?guild_id=${guildId}`);
        } catch (error) {
            throw new Error(parseApiError(error, 'Failed to fetch guild members'));
        }
    },

    async getBrowseGuilds() {
        try {
            return await api.get('/guilds/leaderboard');
        } catch (error) {
            throw new Error(parseApiError(error, 'Failed to browse guilds'));
        }
    },

    async createGuild(name) {
        try {
            return await api.post('/guilds/create', { name });
        } catch (error) {
            throw new Error(parseApiError(error, 'Guild creation failed'));
        }
    },

    async joinGuild(guildId) {
        try {
            return await api.post('/guilds/join', { guild_id: guildId });
        } catch (error) {
            throw new Error(parseApiError(error, 'Failed to join guild'));
        }
    },

    async leaveGuild() {
        try {
            return await api.post('/guilds/leave');
        } catch (error) {
            throw new Error(parseApiError(error, 'Failed to leave guild'));
        }
    }
};

export const questService = {
    async getQuests() {
        try {
            return await api.get('/quests');
        } catch (error) {
            throw new Error(parseApiError(error, 'Failed to fetch quests'));
        }
    },

    async claimReward(questId) {
        try {
            return await api.post(`/quests/claim/${questId}`);
        } catch (error) {
            throw new Error(parseApiError(error, 'Failed to claim reward'));
        }
    },

    async claimDailyLogin() {
        try {
            return await api.post('/user/daily-login');
        } catch (error) {
            throw new Error(parseApiError(error, 'Failed to claim daily login'));
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
    },

    async submitClip(payload) {
        try {
            return await api.post('/user/clip', payload);
        } catch (error) {
            throw new Error(parseApiError(error, 'Failed to submit clip'));
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
