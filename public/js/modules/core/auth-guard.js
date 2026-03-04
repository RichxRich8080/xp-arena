export function isLoggedIn() {
    return typeof window.Auth !== 'undefined' && typeof window.Auth.isLoggedIn === 'function' && window.Auth.isLoggedIn();
}

export function requireAuth(redirect = 'login.html') {
    if (!isLoggedIn()) {
        window.location.href = redirect;
        return false;
    }
    return true;
}
