/**
 * Auth System for XP Arena (JWT + Node.js backend)
 */

const Auth = {
    async signup(username, email, password) {
        try {
            const res = await fetch(`${window.API_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password })
            });
            const data = await res.json();
            if (res.ok) {
                localStorage.setItem('xp_token', data.token);
                localStorage.setItem('xp_current_user', JSON.stringify(data.user));
                // We don't initialize stats locally anymore; backend handles initial AXP
                localStorage.setItem('xp_signup_success', 'true');
                window.dispatchEvent(new Event('authChange'));
                return { success: true };
            }
            return { success: false, message: data.error };
        } catch (e) {
            console.error(e);
            return { success: false, message: 'Server connection error. Is the Node server running?' };
        }
    },

    async login(username, password) {
        try {
            const res = await fetch(`${window.API_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await res.json();
            if (res.ok) {
                localStorage.setItem('xp_token', data.token);
                localStorage.setItem('xp_current_user', JSON.stringify(data.user));
                window.dispatchEvent(new Event('authChange'));
                return { success: true };
            }
            return { success: false, message: data.error };
        } catch (e) {
            console.error(e);
            return { success: false, message: 'Server connection error. Is the Node server running?' };
        }
    },

    logout() {
        localStorage.removeItem('xp_token');
        localStorage.removeItem('xp_current_user');
        window.dispatchEvent(new Event('authChange'));
    },

    getCurrentUser() {
        const u = localStorage.getItem('xp_current_user');
        return u ? JSON.parse(u) : null;
    },

    isLoggedIn() {
        return !!localStorage.getItem('xp_token');
    },

    getToken() {
        return localStorage.getItem('xp_token');
    }
};

window.Auth = Auth;
