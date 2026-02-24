/**
 * Toast Notification System for XP Arena
 */

const Toast = {
    init() {
        if (!document.getElementById('toast-container')) {
            const container = document.createElement('div');
            container.id = 'toast-container';
            container.style.cssText = `
                position: fixed;
                top: 80px; /* Below fixed navbar */
                right: 20px;
                z-index: 20000; /* Above navbar */
                display: flex;
                flex-direction: column;
                gap: 10px;
                pointer-events: none;
            `;
            document.body.appendChild(container);
        }
    },

    show(message, type = 'info', duration = 3000) {
        this.init();
        const container = document.getElementById('toast-container');

        const toast = document.createElement('div');
        toast.className = `toast toast-${type} fade-in`;

        let icon = 'info-circle';
        if (type === 'success') icon = 'check-circle';
        if (type === 'error') icon = 'exclamation-circle';
        if (type === 'xp') icon = 'star';

        toast.innerHTML = `
            <i class="fas fa-${icon}"></i>
            <span>${message}</span>
        `;

        toast.style.cssText = `
            background: var(--card-dark);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            border-left: 4px solid ${this.getColor(type)};
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            gap: 12px;
            min-width: 250px;
            pointer-events: auto;
            border: 1px solid var(--border);
            border-left: 4px solid ${this.getColor(type)};
            animation: toast-in 0.4s cubic-bezier(0.1, 0, 0.2, 1) forwards;
        `;

        container.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'toast-out 0.4s cubic-bezier(0.1, 0, 0.2, 1) forwards';
            setTimeout(() => toast.remove(), 400);
        }, duration);
    },

    getColor(type) {
        switch (type) {
            case 'success': return 'var(--success)';
            case 'error': return 'var(--danger)';
            case 'xp': return 'var(--accent)';
            default: return 'var(--text-muted)';
        }
    }
};

// Add toast animations to head if not exists
if (!document.getElementById('toast-styles')) {
    const style = document.createElement('style');
    style.id = 'toast-styles';
    style.innerHTML = `
        @keyframes toast-in {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes toast-out {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        .toast { pointer-events: auto; }
    `;
    document.head.appendChild(style);
}

window.Toast = Toast;
