import { applyGlobalConfig } from './config.js';
import { createEventBus } from './event-bus.js';
import { initLayoutShell } from '../ui/layout-shell.js';

function ensureAsset(tag, attr, value, setup) {
    if (document.querySelector(`${tag}[${attr}="${value}"]`)) return;
    const el = document.createElement(tag);
    setup(el);
    document.head.appendChild(el);
}

export function bootApp({ init = initLayoutShell } = {}) {
    applyGlobalConfig();

    const bus = createEventBus();
    window.XPArena = window.XPArena || {};
    window.XPArena.core = window.XPArena.core || {};
    window.XPArena.core.bus = bus;

    ensureAsset('link', 'href', 'css/rebirth.css', el => { el.rel = 'stylesheet'; el.href = 'css/rebirth.css'; });
    ensureAsset('link', 'href', 'css/animation.css', el => { el.rel = 'stylesheet'; el.href = 'css/animation.css'; });
    ensureAsset('link', 'href', 'css/overdrive.css', el => { el.rel = 'stylesheet'; el.href = 'css/overdrive.css'; });
    ensureAsset('script', 'src', 'js/sounds.js', el => { el.src = 'js/sounds.js'; });
    ensureAsset('script', 'src', 'js/theme.js', el => { el.src = 'js/theme.js'; });

    const run = () => {
        init();
        bus.emit('xp:layout:booted');
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', run, { once: true });
    } else {
        run();
    }
}
