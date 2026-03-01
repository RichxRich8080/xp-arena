/**
 * Auth System for XP Arena (JWT + Node.js backend)
 */

const API_BASE_AUTH = (typeof window !== 'undefined' && typeof window.API_URL !== 'undefined')
    ? window.API_URL
    : ((location.hostname === 'localhost' || location.hostname === '127.0.0.1') ? 'http://localhost:3000' : '');

const Auth = {
    async signup(username, email, password, ref = null) {
        try {
            const res = await fetch(`${API_BASE_AUTH}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password, ref })
            });
            const data = await res.json();
            if (res.ok) {
                if (data.requires_verification) {
                    return { success: true, requires_verification: true, username: data.username, debugCode: data.debugCode };
                }
                localStorage.setItem('xp_token', data.token);
                localStorage.setItem('xp_current_user', JSON.stringify(data.user));
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
            const res = await fetch(`${API_BASE_AUTH}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await res.json();

            // Handle HTTP 403 Forbidden with verification requirement
            if (res.status === 403 && data.requires_verification) {
                return { success: false, requires_verification: true, message: data.error, username: data.username, debugCode: data.debugCode };
            }

            if (res.ok) {
                localStorage.setItem('xp_token', data.token);
                localStorage.setItem('xp_current_user', JSON.stringify(data.user));
                localStorage.setItem('xp_login_success', 'true');
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
