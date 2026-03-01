/**
 * AreniNotify: High-Fidelity Notification System for XP Arena REBIRTH
 */

const Toast = {
    init() {
        if (!document.getElementById('toast-container')) {
            const container = document.createElement('div');
            container.id = 'toast-container';
            container.style.cssText = `
                position: fixed;
                top: 2rem;
                right: 2rem;
                z-index: 20000;
                display: flex;
                flex-direction: column;
                gap: 0.75rem;
                pointer-events: none;
                max-width: 380px;
                width: calc(100% - 4rem);
            `;
            document.body.appendChild(container);

            if (!document.getElementById('toast-styles')) {
                const style = document.createElement('style');
                style.id = 'toast-styles';
                style.innerHTML = `
                    @keyframes arenit-in {
                        0% { transform: translateX(30px) scale(0.95); opacity: 0; filter: blur(10px); }
                        10% { transform: translateX(-5px) scale(1.02); opacity: 1; filter: blur(0); }
                        100% { transform: translateX(0) scale(1); }
                    }
                    @keyframes arenit-out {
                        to { transform: translateX(50px); opacity: 0; filter: blur(8px); }
                    }
                    .arenit-toast {
                        background: rgba(10, 11, 14, 0.85);
                        backdrop-filter: blur(20px);
                        -webkit-backdrop-filter: blur(20px);
                        border: 1px solid var(--glass-border);
                        border-left: 3px solid var(--photon);
                        border-radius: 12px;
                        padding: 1.2rem 1.5rem;
                        display: flex;
                        align-items: center;
                        gap: 1rem;
                        color: #fff;
                        box-shadow: 0 10px 40px rgba(0,0,0,0.6);
                        pointer-events: auto;
                        animation: arenit-in 0.6s cubic-bezier(0.23, 1, 0.32, 1) forwards;
                        font-family: 'Urbanist', sans-serif;
                    }
                    .arenit-toast.xp-glitch {
                        border-left-color: #ffcc00;
                        background: linear-gradient(90deg, rgba(255,204,0,0.1), transparent);
                    }
                    .arenit-toast i {
                        font-size: 1.2rem;
                        color: var(--photon);
                    }
                    .arenit-toast.error i { color: #ff4444; }
                    .arenit-toast.success i { color: #00C851; }
                `;
                document.head.appendChild(style);
            }
        }
    },

    show(message, type = 'info', duration = 4000) {
        this.init();

        // Sound integration
        if (window.Sounds && typeof Sounds.play === 'function') {
            if (type === 'success') Sounds.play('success');
            else if (type === 'error') Sounds.play('error');
            else Sounds.play('click');
        }

        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `arenit-toast ${type}`;

        let icon = 'info-circle';
        if (type === 'success') icon = 'check-circle';
        if (type === 'error') icon = 'exclamation-triangle';
        if (type === 'xp') {
            icon = 'star';
            toast.classList.add('xp-glitch');
        }

        toast.innerHTML = `
            <i class="fas fa-${icon}"></i>
            <div style="flex: 1;">
                <p style="margin: 0; font-weight: 800; letter-spacing: 0.5px; font-size: 0.9rem;">${message}</p>
            </div>
        `;

        // Apply custom accent if it exists
        const accent = localStorage.getItem('xp_accent_color');
        if (accent && type === 'info') {
            toast.style.borderLeftColor = accent;
            toast.querySelector('i').style.color = accent;
        }

        container.prepend(toast);

        setTimeout(() => {
            toast.style.animation = 'arenit-out 0.5s cubic-bezier(0.23, 1, 0.32, 1) forwards';
            setTimeout(() => toast.remove(), 500);
        }, duration);
    }
};

window.Toast = Toast;
window.AreniNotify = Toast;
