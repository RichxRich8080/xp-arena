/**
 * Shared Layout System for XP Arena REBIRTH
 * This script injects the new Command Dock and Top Bar UI.
 */

// Global API Configuration
window.API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000'
    : '';

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

document.addEventListener('DOMContentLoaded', () => {
    applyCustomAccent();

    if (typeof Auth !== 'undefined') {
        injectRebirthLayout();
        highlightActiveLinks();
        syncGlobalXP();
        trackPageVisit();
        document.body.classList.add('page-rebirth');
        window.addEventListener('statsChange', syncGlobalXP);
        if (typeof User !== 'undefined' && Auth.isLoggedIn()) {
            User.checkDailyLogin();
        }
    } else {
        injectRebirthLayout();
    }
});

function injectRebirthLayout() {
    const user = Auth.getCurrentUser();
    const isLoggedIn = !!user;
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const isIndex = currentPage === 'index.html' || currentPage === '';

    const root = './';

    // Hide legacy elements
    const legacyNav = document.querySelector('nav.navbar');
    if (legacyNav) legacyNav.style.display = 'none';
    const legacyBottomNav = document.querySelector('nav.bottom-nav');
    if (legacyBottomNav) legacyBottomNav.style.display = 'none';

    // Inject Top Bar (v2: Profile Left | Logo Center | Settings Right)
    const topBarHTML = `
        <div class="rebirth-top-bar" style="position: fixed; top: 0; left: 0; right: 0; padding: 1.5rem 2rem; display: flex; justify-content: space-between; align-items: center; z-index: 9998; backdrop-filter: blur(10px); border-bottom: 1px solid var(--glass-border);">
            
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
            </div>
        </div>
    `;

    if (!document.querySelector('.rebirth-top-bar')) {
        document.body.insertAdjacentHTML('afterbegin', topBarHTML);
    }

    // Inject Floating Back Button
    if (!isIndex && !document.querySelector('.back-link-float')) {
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
        { icon: 'fa-shield-alt', label: 'Clan', link: root + 'guilds.html', id: 'nav-guilds' },
        { icon: 'fa-tasks', label: 'Tasks', link: root + 'quests.html', id: 'nav-quests' }
    ];

    const dockHTML = `
        <div class="command-dock" style="grid-template-columns: repeat(6, 1fr);">
            ${navItems.map(item => `
                <a href="${item.link}" class="dock-item ${currentPage === item.link.split('/').pop() ? 'active' : ''}" id="${item.id}">
                    <i class="fas ${item.icon}"></i>
                    <span class="dock-label">${item.label}</span>
                </a>
            `).join('')}
        </div>
    `;

    if (!document.querySelector('.command-dock')) {
        document.body.insertAdjacentHTML('beforeend', dockHTML);
    }

    injectRebirthFooter();
    injectSettingsDrawer();
    injectColorOverlay();
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
                        <a href="${root}premium.html" class="drawer-nav-item" style="color: var(--gold) !important; border-color: rgba(255, 215, 0, 0.3);">
                            <i class="fas fa-crown"></i>
                            <span>Go Elite</span>
                        </a>
                        <!-- Add robust connection to root and identity sector login/signup for flexibility -->
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

function applyCustomAccent() {
    const savedColor = localStorage.getItem('xp_accent_color');
    if (savedColor) {
        document.documentElement.style.setProperty('--photon', savedColor);
        document.documentElement.style.setProperty('--photon-glow', savedColor + '33');
    }
}
