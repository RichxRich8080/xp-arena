/**
 * Shared Layout System for XP Arena REBIRTH
 * This script injects the new Command Dock and Top Bar UI.
 */

const SAFE_CONFIG = window.CONFIG || {};
window.API_URL = SAFE_CONFIG.API_BASE || ((location.hostname === 'localhost' || location.hostname === '127.0.0.1') ? 'http://localhost:3000' : '');

// Helper to get root-relative paths
function getRootPath(path) {
    if (window.location.protocol.startsWith('http')) {
        return '/' + path;
    }
    return '/' + path;
}

// Inject Rebirth Foundation
const cssPath = 'css/rebirth.css';
if (!document.querySelector(`link[href="${cssPath}"]`)) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = cssPath;
    document.head.appendChild(link);
}

const sfxPath = 'js/sounds.js';
if (!document.querySelector(`script[src="${sfxPath}"]`)) {
    const script = document.createElement('script');
    script.src = sfxPath;
    document.head.appendChild(script);
}

document.addEventListener('DOMContentLoaded', () => {
    // Failsafe: Ensure content is visible within 2s even if JS errors occur
    setTimeout(() => {
        document.body.classList.add('booted');
        document.querySelectorAll('[data-neural-stagger]').forEach(el => el.classList.add('booted'));
    }, 2000);

    applyCustomAccent();
    initNeuralBridge();

    injectRebirthLayout();
    if (typeof Auth !== 'undefined') {
        highlightActiveLinks();
        syncGlobalXP();
        trackPageVisit();
        document.body.classList.add('page-rebirth');
        window.addEventListener('statsChange', syncGlobalXP);
        if (typeof User !== 'undefined' && Auth.isLoggedIn()) {
            User.checkDailyLogin();
        }
    }

    // Initialize HUD Depth & Haptics
    initHUDDepth();
    initNeuralHaptics();

    // Genesis: Sector Atmosphere & SFX
    initSectorAtmosphere();
    initGlobalSFX();

    // Singularity: Global Transmissions
    initGlobalTransmissions();

    // Final Visual Boot
    initNeuralStagger();
    initSectorMap();
    initAmbientHUD();

    enableGlobalOverlayDismiss();

    // Remove any leftover transition overlay if present
    const leftover = document.querySelector('div[style*="NEURAL_LINK_SYNC"]') || document.querySelector('div[style*="radial-gradient"][style*="backdrop-filter"]');
    if (leftover) {
        leftover.style.opacity = '0';
        setTimeout(() => leftover.remove(), 120);
    }
});

/**
 * Genesis: Atmospheric Sector Shifting
 */
function initSectorAtmosphere() {
    const path = window.location.pathname;
    let sector = 'hub';
    let color = 'var(--sector-hub)';

    if (path.includes('tool') || path.includes('result')) {
        sector = 'engine';
        color = 'var(--sector-engine)';
    } else if (path.includes('shop') || path.includes('premium') || path.includes('vault')) {
        sector = 'armory';
        color = 'var(--sector-armory)';
    } else if (path.includes('leaderboard') || path.includes('ranks')) {
        sector = 'elite';
        color = 'var(--sector-elite)';
    } else if (path.includes('profile') || path.includes('guilds')) {
        sector = 'lab';
        color = 'var(--sector-lab)';
    }

    document.documentElement.style.setProperty('--primary', color);
    document.documentElement.style.setProperty('--primary-glow', `rgba(${hexToRgb(getComputedStyle(document.documentElement).getPropertyValue(color.replace('var(', '').replace(')', '')))}, 0.3)`);

    // Play entry sound
    if (window.Sounds) {
        setTimeout(() => {
            Sounds.play('sector');
            if (sector === 'engine') Sounds.synthProfessorK();
            if (sector === 'armory') Sounds.synthMaxim();
            if (sector === 'lab') Sounds.synthDbee();
        }, 1000);
    }

}

function hexToRgb(hex) {
    hex = hex.trim();
    if (hex.startsWith('#')) hex = hex.slice(1);
    if (hex.length === 3) hex = hex.split('').map(s => s + s).join('');
    const bigint = parseInt(hex, 16);
    return `${(bigint >> 16) & 255}, ${(bigint >> 8) & 255}, ${bigint & 255}`;
}

/**
 * Genesis: Global Neural Audio Wiring
 */
function initGlobalSFX() {
    if (!window.Sounds) return;

    // Global Click
    document.addEventListener('click', (e) => {
        if (e.target.closest('button, a, .clickable, i')) {
            Sounds.play('click');
        }
    });

    // Global Hover (Debounced)
    let hoverTimeout;
    document.addEventListener('mouseover', (e) => {
        const el = e.target.closest('button, a, .clickable, .nav-item');
        if (el) {
            clearTimeout(hoverTimeout);
            hoverTimeout = setTimeout(() => Sounds.play('hover'), 50);
        }
    });
}

/**
 * Singularity: Global Transmissions (Sentient Feed)
 */
function initGlobalTransmissions() {
    if (document.querySelector('.global-transmission-ticker')) return;

    const ticker = document.createElement('div');
    ticker.className = 'global-transmission-ticker';

    const feed = [
        "OPERATIVE_RUOK HAS CAPTURED SECTOR_CORE",
        "NEW ELITE CALIBRATION DETECTED: 99.4% SYNC",
        "WAR PROTOCOL ENGAGED BY CLAN [VANGUARD]",
        "NEURAL MATRIX STABILITY: 98.2% // ALL SYSTEMS NOMINAL",
        "OPERATIVE_TATSUYA ADDED TO GLOBAL_WHITELIST",
        "SECTOR_ELITE REACHED CRITICAL_MASS",
        "NEW BOUNTY: ELITE_SNIPER_PROTOCOL_ACTIVATED"
    ];

    ticker.innerHTML = `
        <div class="ticker-label">GLOBAL_TRANSMISSION</div>
        <div class="ticker-content">
            ${feed.map(f => `<div class="transmission-item"><span>//</span> ${f} <b>ACT_NOW</b></div>`).join('')}
            ${feed.map(f => `<div class="transmission-item"><span>//</span> ${f} <b>ACT_NOW</b></div>`).join('')}
        </div>
    `;

    document.body.prepend(ticker);
    document.body.style.marginTop = 'var(--transmission-h)';
}

/**
 * Genesis: Global Mouse Tracking (Refraction Logic)
 */
document.addEventListener('mousemove', (e) => {
    const cards = document.querySelectorAll('.pulse-card');
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--mouse-x', `${x}%`);
        card.style.setProperty('--mouse-y', `${y}%`);
    });
});

/**
 * Ambient HUD: Drifting Tactical Coordinates
 */
function initAmbientHUD() {
    const container = document.createElement('div');
    container.className = 'hud-ambient-grid';
    document.body.appendChild(container);

    const labels = ['SCAN_MODE: 01', 'COORD_X: ', 'COORD_Y: ', 'NEURAL_STRENGTH: 94%', 'UPLINK_STATUS: OK', 'PROTOCOL: TITAN', 'SECTOR_ID: HUB'];

    for (let i = 0; i < 15; i++) {
        createCoord(container, labels);
    }

    // Add HUD Fragments
    for (let i = 0; i < 5; i++) {
        const frag = document.createElement('div');
        frag.className = 'hud-fragment';
        const size = 50 + Math.random() * 150;
        frag.style.width = `${size}px`;
        frag.style.height = `${size}px`;
        frag.style.left = `${Math.random() * 100}%`;
        frag.style.top = `${Math.random() * 100}%`;
        frag.style.animationDuration = `${5 + Math.random() * 10}s`;
        frag.style.animationDelay = `${Math.random() * 5}s`;
        container.appendChild(frag);
    }
}

function createCoord(container, labels) {
    const el = document.createElement('div');
    el.className = 'hud-coord';
    const label = labels[Math.floor(Math.random() * labels.length)];
    el.textContent = label + (label.includes(': ') && !label.split(': ')[1] ? Math.floor(Math.random() * 1000) : '');

    el.style.left = `${Math.random() * 100}%`;
    el.style.top = `${Math.random() * 100}%`;
    el.style.animationDuration = `${10 + Math.random() * 20}s`;
    el.style.animationDelay = `${Math.random() * 10}s`;

    container.appendChild(el);

    el.addEventListener('animationiteration', () => {
        el.style.left = `${Math.random() * 100}%`;
        el.style.top = `${Math.random() * 100}%`;
    });
}

/**
 * Neural Staggering: Sequential Interface Boot
 */
function initNeuralStagger() {
    const containers = document.querySelectorAll('[data-neural-stagger]');
    containers.forEach(container => {
        const children = container.children;
        Array.from(children).forEach((child, i) => {
            child.style.transitionDelay = `${(i + 1) * 0.1}s`;
        });

        // Boot after a short delay
        setTimeout(() => container.classList.add('booted'), 100);
    });
}

/**
 * Sector Map: The $10T Global Navigation
 */
function initSectorMap() {
    if (document.getElementById('sectorMap')) return;

    const overlay = document.createElement('div');
    overlay.className = 'sector-map-overlay';
    overlay.id = 'sectorMap';

    const sectors = [
        {
            title: 'CORE_SECTOR',
            pages: [
                { name: 'Hub', url: 'index.html' },
                { name: 'Neural Engine', url: 'tool.html' },
                { name: 'Profile Uplink', url: 'profile.html' },
                { name: 'Global Intel', url: 'leaderboard.html' },
                { name: 'Tournaments', url: 'tournaments.html' }
            ]
        },
        {
            title: 'TACTICAL_SECTOR',
            pages: [
                { name: 'Quests', url: 'quests.html' },
                { name: 'Tournaments', url: 'tournaments.html' },
                { name: 'Rank Matrix', url: 'ranks.html' },
                { name: 'Combat Clips', url: 'clips.html' }
            ]
        },
        {
            title: 'ECONOMY_SECTOR',
            pages: [
                { name: 'Resource Shop', url: 'shop.html' },
                { name: 'Premium Protocol', url: 'premium.html' },
                { name: 'The Vault', url: 'vault.html' },
                { name: 'Sponsorships', url: 'sponsors.html' }
            ]
        },
        {
            title: 'SOCIAL_SECTOR',
            pages: [
                { name: 'Clan Command', url: 'guilds.html' },
                { name: 'Creator Hub', url: 'creators.html' },
                { name: 'Pro Databases', url: 'pro-players.html' },
                { name: 'Support Uplink', url: 'support.html' }
            ]
        }
    ];

    overlay.innerHTML = `
        <div style="position: absolute; top: 3.5rem; right: 5vw; z-index: 10;">
            <button onclick="toggleSectorMap()" class="btn-rebirth" style="background: transparent; color: var(--photon); border: 1px solid rgba(0,245,255,0.2);">CLOSE_MAP</button>
        </div>
        <div class="sector-grid">
            ${sectors.map(s => `
                <div class="sector-group">
                    <h4>${s.title}</h4>
                    ${s.pages.map(p => `<a href="${p.url}" class="sector-link">${p.name}</a>`).join('')}
                </div>
            `).join('')}
        </div>
    `;

    document.body.appendChild(overlay);
}

function toggleSectorMap() {
    const map = document.getElementById('sectorMap');
    if (map) map.classList.toggle('active');
}

// Override legacy toggleSettings
window.toggleSettings = toggleSectorMap;

/**
 * HUD Depth: Reactive 3D Parallax
 */
function initHUDDepth() {
    if (window.innerWidth < 768) return; // Disable on mobile for perf

    document.addEventListener('mousemove', (e) => {
        const cards = document.querySelectorAll('.pulse-card, .gamer-card');
        const mouseX = e.clientX;
        const mouseY = e.clientY;

        cards.forEach(card => {
            const rect = card.getBoundingClientRect();
            const cardX = rect.left + rect.width / 2;
            const cardY = rect.top + rect.height / 2;

            const angleX = (mouseY - cardY) / 30;
            const angleY = (cardX - mouseX) / 30;

            card.style.transform = `rotateX(${angleX}deg) rotateY(${angleY}deg) translateY(-8px)`;
        });
    });
}

/**
 * Neural Bridge: Global Cinematic Navigation
 */
function initNeuralBridge() {
    // Intercept clicks for internal links
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (!link || !link.href || link.target === '_blank' || link.href.includes('#') || link.href.startsWith('javascript:')) return;
        if (link.dataset.noTransition === 'true' || document.body?.dataset?.noTransitions === 'true') return;

        // Only internal links
        const url = new URL(link.href);
        if (url.origin !== window.location.origin) return;

        e.preventDefault();

        // Trigger Glitch Overlay
        showNeuralGlitch(() => {
            window.location.href = link.href;
        });
    });
}

function showNeuralGlitch(callback) {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed; inset: 0; z-index: 100000;
        background: radial-gradient(circle at top, rgba(0,245,255,0.12), rgba(5,5,8,0.95) 60%);
        backdrop-filter: blur(16px);
        opacity: 0; transition: opacity 0.25s ease;
        display: flex; align-items: center; justify-content: center;
        pointer-events: none;
    `;

    const label = document.createElement('div');
    label.className = 'clash';
    label.style.cssText = 'font-size: 0.7rem; letter-spacing: 5px; color: var(--photon); opacity: 0.85;';
    label.textContent = 'NEURAL_LINK_SYNC...';
    overlay.appendChild(label);

    document.body.appendChild(overlay);

    requestAnimationFrame(() => {
        overlay.style.opacity = '1';
        const before = window.location.href;
        setTimeout(() => {
            try { callback(); } catch {}
            // Fail-safe: if navigation didn't happen within 1500ms, remove overlay
            setTimeout(() => {
                if (window.location.href === before && overlay.parentNode) {
                    overlay.style.opacity = '0';
                    setTimeout(() => overlay.remove(), 180);
                }
            }, 1500);
        }, 220);
    });
}

function injectRebirthLayout() {
    const user = (typeof Auth !== 'undefined') ? Auth.getCurrentUser() : null;
    const isLoggedIn = !!user;
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const isIndex = currentPage === 'index.html' || currentPage === '';

    const root = './';

    

    // Inject Top Bar (v2: Profile Left | Logo Center | Settings Right)
    const topBarHTML = `
        <div class="rebirth-top-bar" style="position: fixed; top: 32px; left: 0; right: 0; padding: 1.5rem 2rem; display: flex; justify-content: space-between; align-items: center; z-index: 100001; backdrop-filter: blur(10px); border-bottom: 1px solid var(--glass-border);">
            
            <div class="top-bar-left">
                 <button onclick="toggleSettings()" style="width: 44px; height: 44px; border-radius: 12px; background: rgba(255,255,255,0.05); border: 1px solid var(--glass-border); display: flex; align-items: center; justify-content: center; color: var(--stardust); cursor: pointer; transition: all 0.3s; z-index: 10;">
                    <i class="fas fa-bars" style="font-size: 1.2rem;"></i>
                </button>
            </div>

            <div class="center-brand">
                 <a href="${root}index.html" class="rebirth-logo" style="display: flex; align-items: center; gap: 12px; text-decoration: none;">
                    <div style="width: 32px; height: 32px; background: var(--primary); border-radius: 8px; display: flex; align-items: center; justify-content: center; transform: rotate(45deg); transition: background 0.4s var(--transition);">
                        <div style="color: var(--void); transform: rotate(-45deg); font-weight: 900; font-size: 1.2rem;">X</div>
                    </div>
                    <span style="font-family: 'Clash Display', sans-serif; font-weight: 700; font-size: 1.1rem; letter-spacing: 0.1em; color: var(--stardust);">XP ARENA</span>
                </a>
            </div>
            
            <div class="top-bar-right" style="display: flex; align-items: center; gap: 0.8rem;">
                <a href="${isLoggedIn ? root + 'profile.html' : root + 'login.html'}" id="nav-profile-link" style="width: 44px; height: 44px; border-radius: 12px; background: ${isLoggedIn ? 'var(--glass-highlight)' : 'rgba(255,255,255,0.05)'}; border: 1px solid ${isLoggedIn ? 'var(--photon)' : 'var(--glass-border)'}; display: flex; align-items: center; justify-content: center; text-decoration: none; color: ${isLoggedIn ? 'var(--photon)' : 'var(--stardust)'}; transition: all 0.3s; position: relative; overflow: hidden; z-index: 10;">
                    <i class="fas ${isLoggedIn ? 'fa-user' : 'fa-user-circle'}" style="font-size: 1.4rem; ${isLoggedIn ? 'text-shadow: 0 0 10px var(--photon-glow);' : ''}"></i>
                    ${isLoggedIn ? '<div style="position: absolute; bottom: 0; left: 0; right: 0; height: 3px; background: var(--photon); box-shadow: 0 -2px 10px var(--photon-glow);"></div>' : ''}
                </a>
                <button onclick="toggleQuickActions()" style="width: 44px; height: 44px; border-radius: 12px; background: rgba(255,255,255,0.05); border: 1px solid var(--glass-border); display: flex; align-items: center; justify-content: center; color: var(--stardust); cursor: pointer; transition: all 0.3s;">
                    <i class="fas fa-ellipsis-h"></i>
                </button>
            </div>
        </div>
    `;

    if (!document.querySelector('.rebirth-top-bar')) {
        try {
            document.body.insertAdjacentHTML('afterbegin', topBarHTML);
            document.body.classList.add('has-top-bar');
            const legacyNav = document.querySelector('nav.navbar');
            if (legacyNav) legacyNav.style.display = 'none';
        } catch (e) {
            const legacyNav = document.querySelector('nav.navbar');
            if (legacyNav) legacyNav.style.display = '';
        }
    }

    // Inject Floating Back Button
    const shouldShowBack = document.body?.dataset?.showBack === 'true' || document.body?.classList?.contains('show-back');
    if (shouldShowBack && !document.querySelector('.back-link-float')) {
        const backBtnHTML = `
            <a href="javascript:history.back()" class="back-link-float">
                <i class="fas fa-chevron-left"></i>
            </a>
        `;
        document.body.insertAdjacentHTML('beforeend', backBtnHTML);
    }

    // Inject Command Dock (v2: 6-item expansion)
    const navItems = [
        { icon: 'fa-th-large', label: 'Hub', link: root + 'index.html', id: 'nav-hub' },
        { icon: 'fa-microchip', label: 'Engine', link: root + 'tool.html', id: 'nav-tool' },
        { icon: 'fa-shopping-cart', label: 'Shop', link: root + 'shop.html', id: 'nav-shop' },
        { icon: 'fa-trophy', label: 'Elite', link: root + 'leaderboard.html', id: 'nav-leaderboard' },
        { icon: 'fa-shield-alt', label: 'Clan', link: root + 'guilds.html', id: 'nav-guilds', requiresAuth: true },
        { icon: 'fa-tasks', label: 'Tasks', link: root + 'quests.html', id: 'nav-quests', requiresAuth: true }
    ];

    const dockHTML = `
        <div class="command-dock" style="grid-template-columns: repeat(6, 1fr);">
            ${navItems.map(item => `
                <a href="${item.link}" class="dock-item ${currentPage === item.link.split('/').pop() ? 'active' : ''} ${(!isLoggedIn && item.requiresAuth) ? 'locked' : ''}" id="${item.id}">
                    <i class="fas ${item.icon}"></i>
                    <span class="dock-label">${item.label}</span>
                </a>
            `).join('')}
        </div>
    `;

    if (!document.querySelector('.command-dock')) {
        try {
            document.body.insertAdjacentHTML('beforeend', dockHTML);
            document.body.classList.add('has-command-dock');
            const legacyBottomNav = document.querySelector('nav.bottom-nav');
            if (legacyBottomNav) legacyBottomNav.style.display = 'none';
        } catch (e) {
            const legacyBottomNav = document.querySelector('nav.bottom-nav');
            if (legacyBottomNav) legacyBottomNav.style.display = '';
        }
    }

    injectRebirthFooter();
    injectSettingsDrawer();
    injectColorOverlay();
    injectTacticalToastContainer();
    startNeuralTicker();
    if (window.Toast) {
        try {
            const seen = sessionStorage.getItem('hud_sync_shown');
            if (!seen) {
                Toast.show('Neural HUD Resynchronized', 'info', 2500);
                sessionStorage.setItem('hud_sync_shown', '1');
            }
        } catch {}
    }

    if (currentPage === 'index.html' || currentPage === '') {
        injectIndexInfo();
    }
}

/**
 * Tactical Notification System (V3)
 */
window.Toast = {
    show(message, type = 'info', duration = 4000) {
        const container = document.getElementById('tactical-toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `tactical-toast toast-${type}`;
        toast.style.pointerEvents = 'auto';

        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-triangle',
            info: 'fa-info-circle',
            xp: 'fa-gem'
        };

        toast.innerHTML = `
            <div class="toast-glow"></div>
            <i class="fas ${icons[type] || icons.info}"></i>
            <div class="toast-content">
                <span class="toast-label">${type.toUpperCase()} SIGNAL</span>
                <p class="toast-msg">${message}</p>
            </div>
            ${duration > 0 ? '<div class="toast-progress"></div>' : '<button aria-label="Dismiss" style="background:none;border:none;color:#94a3b8;font-weight:800;cursor:pointer;">×</button>'}
        `;

        container.appendChild(toast);

        // Animate in
        requestAnimationFrame(() => toast.classList.add('active'));

        // Sticky or timed removal
        if (duration && duration > 0) {
            setTimeout(() => {
                toast.classList.remove('active');
                setTimeout(() => toast.remove(), 500);
            }, duration);
        } else {
            const closeBtn = toast.querySelector('button');
            if (closeBtn) closeBtn.addEventListener('click', () => {
                toast.classList.remove('active');
                setTimeout(() => toast.remove(), 300);
            });
        }
    }
};

function injectTacticalToastContainer() {
    if (document.getElementById('tactical-toast-container')) return;
    const container = document.createElement('div');
    container.id = 'tactical-toast-container';
    container.style.cssText = `
        position: fixed;
        top: 6rem;
        right: 2rem;
        z-index: 999999;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        pointer-events: none;
    `;
    document.body.appendChild(container);
}

function toggleQuickActions() {
    let panel = document.getElementById('quick-actions-panel');
    if (panel) {
        const visible = panel.style.opacity === '1';
        panel.style.opacity = visible ? '0' : '1';
        panel.style.pointerEvents = visible ? 'none' : 'auto';
        return;
    }
    panel = document.createElement('div');
    panel.id = 'quick-actions-panel';
    panel.style.cssText = `
        position: fixed; top: 88px; right: 22px; z-index: 99999;
        background: rgba(10, 10, 20, 0.9); backdrop-filter: blur(18px);
        border: 1px solid var(--glass-border); border-radius: 12px;
        padding: 0.5rem; display: grid; gap: 6px; width: 220px;
        opacity: 0; pointer-events: none; transition: opacity 0.2s;
    `;
    const mkBtn = (icon, label, handler) => {
        const b = document.createElement('button');
        b.style.cssText = 'display:flex;align-items:center;gap:10px;padding:0.6rem;border:1px solid var(--glass-border);border-radius:10px;background:rgba(255,255,255,0.04);color:#fff;cursor:pointer;';
        b.innerHTML = `<i class="fas ${icon}"></i><span style="font-weight:800;letter-spacing:1px;font-size:0.8rem;">${label}</span>`;
        b.onclick = handler;
        return b;
    };
    panel.appendChild(mkBtn('fa-vault', 'Add to Vault', () => { if (typeof addToVaultFromResults === 'function') addToVaultFromResults(); }));
    panel.appendChild(mkBtn('fa-image', 'Download Image', () => {
        const res = JSON.parse(localStorage.getItem('xp_calc_results') || '{}');
        if (res && typeof generateShareImage === 'function') generateShareImage(res);
    }));
    panel.appendChild(mkBtn('fa-palette', 'Theme Pocket', () => {
        const fab = document.querySelector('.theme-fab');
        const overlay = document.querySelector('.theme-selector-overlay');
        if (overlay) overlay.classList.toggle('active'); else if (fab) fab.click();
    }));
    document.body.appendChild(panel);
    requestAnimationFrame(() => { panel.style.opacity = '1'; panel.style.pointerEvents = 'auto'; });
}

function enableGlobalOverlayDismiss() {
    const removeIfPresent = (sel) => {
        const el = document.querySelector(sel);
        if (el) {
            el.classList?.remove('active');
            el.style.opacity = '0';
            setTimeout(() => el.remove(), 200);
        }
    };
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            [
                '#player-card-modal',
                '#theater-overlay',
                '.success-overlay.active',
                '.success-overlay-rebirth.active',
                '.cinematic-overlay.active',
                '#verifyOverlay',
                '#rewardOverlay'
            ].forEach(removeIfPresent);
        }
    });
    document.addEventListener('click', (e) => {
        const dismissTargets = ['#player-card-modal', '#theater-overlay', '.success-overlay', '.success-overlay-rebirth', '.cinematic-overlay', '#verifyOverlay', '#rewardOverlay'];
        for (const sel of dismissTargets) {
            const el = document.querySelector(sel);
            if (el && el.contains(e.target)) {
                // If clicked directly on overlay (not on an inner card/button), close
                const inner = el.querySelector('.pulse-card');
                if (!inner || !inner.contains(e.target)) {
                    removeIfPresent(sel);
                }
            }
        }
    }, true);
}

function injectIndexInfo() {
    if (document.getElementById('index-info-banner')) return;
    const banner = document.createElement('div');
    banner.id = 'index-info-banner';
    banner.style.cssText = `
        position: fixed; top: 110px; left: 50%; transform: translateX(-50%);
        width: min(95vw, 980px); z-index: 100000;
        display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;
        background: rgba(10, 10, 20, 0.85); border: 1px solid var(--glass-border);
        border-radius: 16px; padding: 1rem; align-items: center;
        backdrop-filter: blur(16px);
    `;
    banner.innerHTML = `
        <div style="display:flex;align-items:center;gap:10px;">
            <i class="fas fa-bolt" style="color: var(--photon);"></i>
            <div style="font-weight:800;">Tips</div>
        </div>
        <div style="display:flex; gap: 10px; justify-content:flex-end;">
            <button class="btn-rebirth btn-glass" onclick="window.location.href='daily-login.html'">Daily Rewards</button>
            <button class="btn-rebirth btn-glass" onclick="window.location.href='shop.html'">Armory</button>
            <button class="btn-rebirth btn-glass" onclick="window.location.href='leaderboard.html'">Elite Rankings</button>
        </div>
    `;
    document.body.appendChild(banner);
}

/**
 * Neural Ticker: Global Real-time Updates
 */
function startNeuralTicker() {
    if (document.querySelector('.neural-ticker')) return;

    const tickerHTML = `
        <div class="neural-ticker" style="position: fixed; top: 0; left: 0; right: 0; height: 32px; background: rgba(0,0,0,0.4); backdrop-filter: blur(10px); z-index: 10002; display: flex; align-items: center; border-bottom: 1px solid var(--glass-border); overflow: hidden;">
            <div class="ticker-label" style="background: var(--photon); color: var(--void); font-size: 0.6rem; font-weight: 900; height: 100%; display: flex; align-items: center; padding: 0 1rem; letter-spacing: 2px; z-index: 2;">LIVE_INTEL</div>
            <div class="ticker-track" id="neural-ticker-track" style="display: flex; white-space: nowrap; animation: ticker-scroll 60s linear infinite; gap: 4rem; padding-left: 2rem;">
                <!-- Injected Updates -->
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('afterbegin', tickerHTML);

    // If topBar exists, we might want it below the ticker or integrate it. 
    // Let's refine the top bar injection to accommodate the ticker.
    updateTickerData();
    setInterval(updateTickerData, 10000);
}

function updateTickerData() {
    const track = document.getElementById('neural-ticker-track');
    if (!track) return;

    const updates = [
        `OPERATIVE_${Math.floor(Math.random() * 9000) + 1000} JUST ACQUIRED RENAME CARD`,
        `GLOBAL AXP SURGE DETECTED IN SECTOR ${Math.floor(Math.random() * 9) + 1}`,
        `NEW CLAN "${['NEON', 'VOID', 'CYBER', 'ZENITH'][Math.floor(Math.random() * 4)]}_VANGUARD" ESTABLISHED`,
        `TOURNAMENT "CYBER_STORM" COMMENCING IN ${Math.floor(Math.random() * 5) + 1}H ${Math.floor(Math.random() * 59)}M`,
        `OPERATIVE_${Math.floor(Math.random() * 9000) + 1000} REACHED RANK: ${['LEGEND', 'ELITE', 'CHAMPION'][Math.floor(Math.random() * 3)]}`,
        `XP_DOUBLE_PROTOCOL ACTIVE FOR ALL PREMIUM OPERATIVES`,
        `CLAN_${['ALPHA', 'BRAVO', 'OMEGA'][Math.floor(Math.random() * 3)]} JUST SEIZED THE SECTOR LEAD`,
        `NEURAL_LINK_STABILITY: 99.9%`
    ];

    track.innerHTML = updates.map(text => `
        <div class="ticker-item" style="display: flex; align-items: center; gap: 0.5rem;">
            <i class="fas fa-circle" style="font-size: 0.3rem; color: var(--photon); opacity: 0.6;"></i>
            <span>${text}</span>
        </div>
    `).join('') + track.innerHTML; // Keep it looping
}

function injectRebirthFooter() {
    if (document.querySelector('.rebirth-footer')) return;
    const root = './';
    const footerHTML = `
        <footer class="rebirth-footer">
            <div class="footer-grid">
                <div class="footer-brand footer-col">
                    <span class="logo-text clash">XP ARENA</span>
                    <p style="color: var(--stardust-muted); font-size: 0.95rem; margin-bottom: 2.5rem; line-height: 1.6;">The ultimate diagnostic ecosystem for the next generation of Arenis.</p>
                </div>
                
                <div class="footer-col">
                    <h4 class="clash" style="letter-spacing: 2px; font-size: 0.8rem; text-transform: uppercase; color: var(--primary);">Network</h4>
                    <ul class="footer-links">
                        <li><a href="${root}index.html">The Hub</a></li>
                        <li><a href="${root}tool.html">Sensitivity Lab</a></li>
                        <li><a href="${root}shop.html">Armory</a></li>
                    </ul>
                </div>

                <div class="footer-col">
                    <h4 class="clash" style="letter-spacing: 2px; font-size: 0.8rem; text-transform: uppercase;">Community</h4>
                    <ul class="footer-links">
                        <li><a href="${root}guilds.html">Clans & Guilds</a></li>
                        <li><a href="${root}leaderboard.html">Rankings</a></li>
                        <li><a href="${root}quests.html">Neural Quests</a></li>
                    </ul>
                </div>
            </div>

            <div class="footer-bottom">
                <p>&copy; 2026 XP ARENA SECTOR 7.</p>
                <div style="display: flex; gap: 2rem;">
                    <a href="${root}about.html" style="color: inherit; text-decoration: none; font-weight: 700;">MANIFESTO</a>
                    <a href="${root}help.html" style="color: inherit; text-decoration: none; font-weight: 700;">SUPPORT</a>
                </div>
            </div>
        </footer>
        `;

    document.body.insertAdjacentHTML('beforeend', footerHTML);
}

function injectSettingsDrawer() {
    if (document.getElementById('settings-drawer')) return;
    const user = Auth.getCurrentUser();
    const isLoggedIn = !!user;
    const root = './';

    const drawerHTML = `
        <div id="settings-drawer" class="settings-drawer">
            <div class="drawer-header" style="display: flex; justify-content: space-between; align-items: center; padding: 2rem; border-bottom: 1px solid var(--glass-border);">
                <h3 class="clash" style="margin: 0; font-size: 1.2rem; letter-spacing: 0.1em; color: var(--stardust);">SYSTEM NAV</h3>
                <button onclick="toggleSettings()" style="background: none; border: none; color: var(--stardust-muted); font-size: 1.4rem; cursor: pointer; transition: color 0.3s;"><i class="fas fa-times"></i></button>
            </div>
            
            <div class="drawer-content" style="padding: 2rem; display: flex; flex-direction: column; gap: 2.5rem;">
                <div class="settings-group">
                    <span style="display: block; font-size: 0.7rem; color: var(--stardust-muted); margin-bottom: 1.2rem; letter-spacing: 0.15em; text-transform: uppercase;">Primary Navigation</span>
                    <div class="drawer-nav-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem;">
                        <a href="${root}index.html" class="drawer-nav-item">
                            <i class="fas fa-th-large"></i>
                            <span>Hub</span>
                        </a>
                        <a href="${root}tool.html" class="drawer-nav-item">
                            <i class="fas fa-microchip"></i>
                            <span>Engine</span>
                        </a>
                        <a href="${root}shop.html" class="drawer-nav-item">
                            <i class="fas fa-shopping-cart"></i>
                            <span>Shop</span>
                        </a>
                        <a href="${root}leaderboard.html" class="drawer-nav-item">
                            <i class="fas fa-trophy"></i>
                            <span>Elite</span>
                        </a>
                        <a href="${root}guilds.html" class="drawer-nav-item">
                            <i class="fas fa-shield-alt"></i>
                            <span>Clan</span>
                        </a>
                        <a href="${root}quests.html" class="drawer-nav-item">
                            <i class="fas fa-tasks"></i>
                            <span>Tasks</span>
                        </a>
                        <a href="${root}tournaments.html" class="drawer-nav-item">
                            <i class="fas fa-trophy"></i>
                            <span>Tourney</span>
                        </a>
                        <a href="${root}creators.html" class="drawer-nav-item">
                            <i class="fas fa-video"></i>
                            <span>Creators</span>
                        </a>
                        <a href="${root}vault.html" class="drawer-nav-item">
                            <i class="fas fa-vault"></i>
                            <span>Vault</span>
                        </a>
                        <a href="${root}premium.html" class="drawer-nav-item" style="color: var(--gold) !important; border-color: rgba(255, 215, 0, 0.3);">
                            <i class="fas fa-crown"></i>
                            <span>Go Elite</span>
                        </a>
                        <a href="${root}help.html" class="drawer-nav-item">
                            <i class="fas fa-question-circle"></i>
                            <span>Help</span>
                        </a>
                        <a href="${root}login.html" class="drawer-nav-item" style="opacity: 0.8;">
                            <i class="fas fa-sign-in-alt"></i>
                            <span>Login</span>
                        </a>
                        <a href="${root}signup.html" class="drawer-nav-item" style="opacity: 0.8;">
                            <i class="fas fa-user-plus"></i>
                            <span>Enroll</span>
                        </a>
                    </div>
                </div>

                <div class="settings-group">
                    <span style="display: block; font-size: 0.7rem; color: var(--stardust-muted); margin-bottom: 1.2rem; letter-spacing: 0.15em; text-transform: uppercase;">Neural Personalization</span>
                    <button class="menu-action" onclick="toggleColorOverlay(); toggleSettings();" style="display: flex; align-items: center; gap: 15px; width: 100%; padding: 1rem; background: rgba(255,255,255,0.03); border: 1px solid var(--glass-border); border-radius: 12px; color: var(--stardust); cursor: pointer; text-align: left; transition: all 0.3s;">
                        <i class="fas fa-palette" style="color: var(--photon);"></i>
                        <span>Customize Neural Accent</span>
                    </button>
                </div>

                <div class="settings-group">
                   <span style="display: block; font-size: 0.7rem; color: var(--stardust-muted); margin-bottom: 1.2rem; letter-spacing: 0.15em; text-transform: uppercase;">Neural Synchronization</span>
                    <div class="setting-item" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                        <div class="setting-info">
                            <div style="font-weight: 700; color: var(--stardust); font-size: 0.95rem;">Cloud Sync</div>
                            <div style="font-size: 0.75rem; color: var(--stardust-muted);">Persist diagnostics across nodes</div>
                        </div>
                        <label class="switch">
                            <input type="checkbox" id="syncToggle" checked>
                            <span class="slider"></span>
                        </label>
                    </div>
                </div>

                <div class="settings-group">
                    <span style="display: block; font-size: 0.7rem; color: var(--stardust-muted); margin-bottom: 1.2rem; letter-spacing: 0.15em; text-transform: uppercase;">Tactical Access</span>
                    <div style="display: flex; flex-direction: column; gap: 0.8rem;">
                        <button class="menu-action" onclick="window.location.href='${root}manifest.json'" style="display: flex; align-items: center; gap: 15px; width: 100%; padding: 1rem; background: rgba(255,255,255,0.03); border: 1px solid var(--glass-border); border-radius: 12px; color: var(--stardust); cursor: pointer; text-align: left; transition: all 0.3s;">
                            <i class="fas fa-download" style="color: var(--photon);"></i>
                            <span>Install as App (PWA)</span>
                        </button>
                    </div>
                </div>

                <div class="settings-group">
                    <span style="display: block; font-size: 0.7rem; color: var(--stardust-muted); margin-bottom: 1.2rem; letter-spacing: 0.15em; text-transform: uppercase;">Operational Status</span>
                    ${isLoggedIn ? `
                        <button class="menu-action danger" onclick="handleDeleteAccount()" style="display: flex; align-items: center; gap: 15px; width: 100%; padding: 1rem; background: rgba(255, 68, 68, 0.05); border: 1px solid rgba(255, 68, 68, 0.2); border-radius: 12px; color: #ff4444; cursor: pointer; text-align: left; transition: all 0.3s; margin-bottom: 1rem;">
                            <i class="fas fa-user-slash"></i>
                            <span>Destroy Account Data</span>
                        </button>
                        <div style="padding: 1rem; background: rgba(255,255,255,0.02); border: 1px solid var(--glass-border); border-radius: 12px; display: flex; justify-content: space-between; align-items: center;">
                            <span style="font-size: 0.8rem; font-weight: 700;">USER_SESSION</span>
                            <button onclick="Auth.logout()" style="background: none; border: none; color: #ff4444; font-weight: 800; cursor: pointer; font-size: 0.7rem; letter-spacing: 1px;">LOGOUT</button>
                        </div>
                    ` : `
                        <button class="btn-rebirth" onclick="window.location.href='${root}login.html'" style="width: 100%; justify-content: center; padding: 1.2rem;">
                            <i class="fas fa-sign-in-alt"></i> INITIALIZE UPLINK
                        </button>
                    `}
                </div>
            </div>
        </div>
        <div id="drawer-overlay" onclick="toggleSettings()" style="position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(5px); z-index: 9999; opacity: 0; pointer-events: none; transition: opacity 0.4s;"></div>
    `;
    document.body.insertAdjacentHTML('beforeend', drawerHTML);

    const syncToggle = document.getElementById('syncToggle');
    if (syncToggle) {
        syncToggle.checked = localStorage.getItem('xp_cloud_sync') !== 'false';
        syncToggle.addEventListener('change', (e) => {
            localStorage.setItem('xp_cloud_sync', e.target.checked);
            if (window.Toast) Toast.show(`CLOUD SYNC ${e.target.checked ? 'ACTIVE' : 'OFFLINE'} `, 'info');
        });
    }
}

function injectColorOverlay() {
    if (document.getElementById('color-overlay')) return;

    const colors = [
        { name: 'Photon Blue', hex: '#00f5ff' },
        { name: 'Solar Flare', hex: '#ffcc00' },
        { name: 'Nova Pink', hex: '#ff2d55' },
        { name: 'Pulse Green', hex: '#32d74b' },
        { name: 'Void Violet', hex: '#bf5af2' },
        { name: 'Plasma Orange', hex: '#ff9d00' },
        { name: 'Ice White', hex: '#f8fafc' },
        { name: 'Deep Sea', hex: '#5e5ce6' }
    ];

    const currentAccent = localStorage.getItem('xp_accent_color') || '#00f5ff';

    const overlayHTML = `
        <div id="color-overlay" class="color-overlay">
            <div class="color-modal">
                <h2 class="clash" style="font-size: 1.8rem; margin-bottom: 0.5rem;">NEURAL PERSONALIZATION</h2>
                <p style="color: var(--stardust-muted); font-size: 0.9rem;">Select your operational accent frequency.</p>

                <div class="color-grid">
                    ${colors.map(c => `
                        <div class="color-token ${c.hex.toLowerCase() === currentAccent.toLowerCase() ? 'active' : ''}" 
                             style="background: ${c.hex}; --token-glow: ${c.hex}66;" 
                             onclick="updateGlobalAccent('${c.hex}', this)" 
                             title="${c.name}">
                        </div>
                    `).join('')}
                </div>

                <div style="display: flex; gap: 1rem; justify-content: center; align-items: center;">
                    <div style="font-family: 'Clash Display', sans-serif; font-weight: 700; color: var(--primary);" id="overlayHexDisplay">${currentAccent.toUpperCase()}</div>
                </div>

                <button class="btn-rebirth btn-photon" onclick="toggleColorOverlay()" style="margin-top: 3rem; width: 100%;">
                    SYNCHRONIZE HUD
                </button>
            </div>
        </div>
        `;

    document.body.insertAdjacentHTML('beforeend', overlayHTML);
}

window.updateGlobalAccent = function (color, el) {
    document.documentElement.style.setProperty('--photon', color);
    document.documentElement.style.setProperty('--photon-glow', color + '33');
    localStorage.setItem('xp_accent_color', color);

    const hexDisplay = document.getElementById('overlayHexDisplay');
    if (hexDisplay) hexDisplay.textContent = color.toUpperCase();

    document.querySelectorAll('.color-token').forEach(t => t.classList.remove('active'));
    if (el) el.classList.add('active');

    if (window.Toast) Toast.show('Neural HUD Resynchronized', 'info');
};

window.toggleColorOverlay = function () {
    const overlay = document.getElementById('color-overlay');
    if (overlay) overlay.classList.toggle('open');
};

window.toggleSettings = function () {
    const drawer = document.getElementById('settings-drawer');
    const overlay = document.getElementById('drawer-overlay');
    if (drawer && overlay) {
        drawer.classList.toggle('open');
        const isOpen = drawer.classList.contains('open');
        overlay.style.opacity = isOpen ? '1' : '0';
        overlay.style.pointerEvents = isOpen ? 'auto' : 'none';
    }
};

function highlightActiveLinks() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const cleanPath = currentPath.replace('.html', '');
    document.querySelectorAll('.dock-item').forEach(link => {
        const href = link.getAttribute('href');
        if (!href) return;
        const linkClean = href.split('/').pop().replace('.html', '');
        if (href.endsWith(currentPath) || linkClean === cleanPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

function syncGlobalXP() {
    if (typeof User === 'undefined' || !Auth.isLoggedIn()) return;
}

function trackPageVisit() {
    if (typeof User === 'undefined' || !Auth.isLoggedIn()) return;
    const page = window.location.pathname.split('/').pop() || 'index.html';
    User.updateStats(stats => {
        if (!stats.visitedPages) stats.visitedPages = [];
        if (!stats.visitedPages.includes(page)) {
            stats.visitedPages.push(page);
        }
    });
}

window.Celebration = {
    fire() {
        const canvas = document.createElement('canvas');
        canvas.style.position = 'fixed';
        canvas.style.inset = '0';
        canvas.style.zIndex = '100001';
        canvas.style.pointerEvents = 'none';
        document.body.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles = [];
        const colors = ['#00f5ff', '#ffcc00', '#bf00ff', '#ffffff'];

        for (let i = 0; i < 150; i++) {
            particles.push({
                x: canvas.width / 2,
                y: canvas.height / 2,
                vx: (Math.random() - 0.5) * 30,
                vy: (Math.random() - 0.5) * 30,
                size: Math.random() * 6 + 2,
                color: colors[Math.floor(Math.random() * colors.length)],
                life: 1
            });
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            let active = false;

            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.5; // Gravity
                p.life -= 0.015;

                if (p.life > 0) {
                    active = true;
                    ctx.fillStyle = p.color;
                    ctx.globalAlpha = p.life;
                    ctx.fillRect(p.x, p.y, p.size, p.size);
                }
            });

            if (active) {
                requestAnimationFrame(animate);
            } else {
                canvas.remove();
            }
        }

        animate();
    }
};

function applyCustomAccent() {
    const savedColor = localStorage.getItem('xp_accent_color');
    if (savedColor) {
        document.documentElement.style.setProperty('--photon', savedColor);
        document.documentElement.style.setProperty('--photon-glow', savedColor + '33');
    }

    /**
     * ThemeManager V2: Universal HUD Sync
     */
    window.ThemeManager = {
        init() {
            this.applyTheme();
            window.addEventListener('storage', (e) => {
                if (e.key === 'xp_accent_color') this.applyTheme();
            });
        },
        applyTheme() {
            const color = localStorage.getItem('xp_accent_color') || '#00f5ff';
            document.documentElement.style.setProperty('--primary', color);
            document.documentElement.style.setProperty('--primary-glow', color + '33');

            // Extract RGB for the --theme-accent-raw variable
            const rgb = this.hexToRgb(color);
            if (rgb) {
                document.documentElement.style.setProperty('--theme-accent-raw', `${rgb.r}, ${rgb.g}, ${rgb.b}`);
            }

            // Sync color overlay if it exists
            const hexDisplay = document.getElementById('overlayHexDisplay');
            if (hexDisplay) hexDisplay.textContent = color.toUpperCase();
        },
        hexToRgb(hex) {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        }
    };

    ThemeManager.init();

    /**
     * Navigational Auditor: Neutralize Dead-ends
     */
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (link && (link.getAttribute('href') === '#' || link.getAttribute('href') === '')) {
            e.preventDefault();
            if (window.Toast) {
                Toast.show('SECTOR ACCESS RESTRICTED: Dead-end neutralized.', 'info');
            }
            console.warn('[NavAudit] Neutralized dead-end link:', link);
        }
    });

    /**
     * Neural Haptics: Tactile HUD Feedback
     */
    function initNeuralHaptics() {
        document.addEventListener('mousedown', (e) => {
            const ripple = document.createElement('div');
            ripple.style.cssText = `
            position: fixed; width: 40px; height: 40px;
            border: 2px solid var(--photon); border-radius: 50%;
            pointer-events: none; z-index: 100001;
            left: ${e.clientX - 20}px; top: ${e.clientY - 20}px;
            opacity: 0.5; transform: scale(0.5);
            transition: all 0.4s var(--transition-premium);
        `;
            document.body.appendChild(ripple);

            requestAnimationFrame(() => {
                ripple.style.opacity = '0';
                ripple.style.transform = 'scale(2.5)';
                setTimeout(() => ripple.remove(), 400);
            });
        });
    }
}
