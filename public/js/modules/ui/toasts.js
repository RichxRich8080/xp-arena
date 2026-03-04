export function showToast(message, type = 'info', duration = 4000) {
    if (window.Toast?.show) {
        window.Toast.show(message, type, duration);
    }
}
