/**
 * XP ARENA EXODUS: Secure DOM Utilities
 */
const DOM = {
    /**
     * Set text content safely to prevent XSS.
     */
    setText(id, text) {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    },

    /**
     * Escape HTML special characters for safe-rendering within templates.
     */
    escape(str) {
        if (!str) return "";
        const div = document.createElement("div");
        div.textContent = str;
        return div.innerHTML;
    },

    /**
     * Inject HTML with a basic sanitizer (for premium labels/icons only)
     * USE SPARINGLY.
     */
    /**
     * Show a premium prompt modal.
     */
    async prompt(title, placeholder = "") {
        return new Promise((resolve) => {
            const modal = document.createElement('div');
            modal.style.cssText = `
                position: fixed; inset: 0; z-index: 200001;
                display: flex; align-items: center; justify-content: center;
                background: rgba(5, 5, 8, 0.85); backdrop-filter: blur(20px);
                animation: fadeIn 0.3s var(--transition-premium);
            `;
            modal.innerHTML = `
                <div class="pulse-card" style="width: 400px; max-width: 90vw; text-align: center; border-color: var(--photon);">
                    <h3 class="clash text-photon" style="margin-bottom: 1.5rem; letter-spacing: 2px;">${this.escape(title)}</h3>
                    <input type="text" id="modal-input" placeholder="${this.escape(placeholder)}" 
                        style="width: 100%; padding: 1rem; background: rgba(255,255,255,0.05); border: 1px solid var(--glass-border); border-radius: 12px; color: #fff; margin-bottom: 2rem; outline: none; font-family: inherit;">
                    <div style="display: flex; gap: 1rem; justify-content: center;">
                        <button id="modal-cancel" class="btn-rebirth" style="padding: 0.75rem 1.5rem;">CANCEL</button>
                        <button id="modal-confirm" class="btn-rebirth btn-photon" style="padding: 0.75rem 1.5rem;">CONFIRM</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
            const input = modal.querySelector('#modal-input');
            input.focus();

            const close = (val) => {
                modal.style.opacity = '0';
                setTimeout(() => modal.remove(), 300);
                resolve(val);
            };

            modal.querySelector('#modal-cancel').onclick = () => close(null);
            modal.querySelector('#modal-confirm').onclick = () => close(input.value);
            input.onkeydown = (e) => {
                if (e.key === 'Enter') close(input.value);
                if (e.key === 'Escape') close(null);
            };
        });
    },

    /**
     * Show a premium confirm modal.
     */
    async confirm(title, message) {
        return new Promise((resolve) => {
            const modal = document.createElement('div');
            modal.style.cssText = `
                position: fixed; inset: 0; z-index: 200001;
                display: flex; align-items: center; justify-content: center;
                background: rgba(5, 5, 8, 0.85); backdrop-filter: blur(20px);
                animation: fadeIn 0.3s var(--transition-premium);
            `;
            modal.innerHTML = `
                <div class="pulse-card" style="width: 400px; max-width: 90vw; text-align: center; border-color: var(--photon);">
                    <h3 class="clash text-photon" style="margin-bottom: 1rem; letter-spacing: 2px;">${this.escape(title)}</h3>
                    <p style="color: var(--stardust-muted); font-size: 0.9rem; margin-bottom: 2rem;">${this.escape(message)}</p>
                    <div style="display: flex; gap: 1rem; justify-content: center;">
                        <button id="modal-cancel" class="btn-rebirth" style="padding: 0.75rem 1.5rem;">CANCEL</button>
                        <button id="modal-confirm" class="btn-rebirth btn-photon" style="padding: 0.75rem 1.5rem;">ACCEPT</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);

            const close = (val) => {
                modal.style.opacity = '0';
                setTimeout(() => modal.remove(), 300);
                resolve(val);
            };

            modal.querySelector('#modal-cancel').onclick = () => close(false);
            modal.querySelector('#modal-confirm').onclick = () => close(true);
        });
    }
};

window.DOM = DOM;
