/**
 * Shared Layout System for XP Arena
 * This script injects the Navbar, Sidebar, and Bottom Nav into any page.
 */

// Global API Configuration
window.API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000'
    : ''; // Vercel routes /api directly

document.addEventListener('DOMContentLoaded', () => {
    // Apply saved theme
    const savedTheme = localStorage.getItem('xp_theme');
    if (savedTheme) {
        document.body.classList.add(savedTheme);
    }

    // Apply saved dark/light mode
    if (localStorage.getItem('xp_light_mode') === '1') {
        document.body.classList.add('light-mode');
    }

    // Apply saved custom color
    const savedCustomColor = localStorage.getItem('xp_custom_color');
    if (savedCustomColor && !savedTheme) {
        setCustomColor(savedCustomColor, false);
    }

    if (typeof Auth !== 'undefined') {
        injectLayout();
        highlightActiveLinks();
        syncGlobalXP();
        trackPageVisit();
        window.addEventListener('statsChange', syncGlobalXP);

        // Initial user checks
        if (typeof User !== 'undefined' && Auth.isLoggedIn()) {
            User.checkDailyLogin();

            // Check for signup success popup
            if (localStorage.getItem('xp_signup_success')) {
                setTimeout(() => {
                    if (window.Toast) {
                        Toast.show('Account created successfully! Welcome to XP Arena.', 'success', 5000);
                        localStorage.removeItem('xp_signup_success');
                    }
                }, 1000);
            }
        }
    } else {
        console.error("Auth script missing! Layout might not display correctly.");
    }
});

function injectLayout() {
    const user = Auth.getCurrentUser();
    const isLoggedIn = !!user;
    const isLightMode = document.body.classList.contains('light-mode');

    // Attempt to grab actual user avatar instead of generic icon
    let avatarHtml = '<i class="fas fa-user-circle"></i>';
    if (isLoggedIn && typeof window.User !== 'undefined') {
        const stats = window.User.getStats();
        if (stats && stats.avatar) {
            avatarHtml = `<span style="font-size: 1.25rem;">${stats.avatar}</span>`;
        }
    }

    const navbarHTML = `
        <div class="xp-bar-global" id="globalXPBar" style="width: 0%;"></div>
        <div class="nav-left" style="display: flex; align-items: center; gap: 15px;">
            <a href="${isLoggedIn ? 'profile.html' : 'login.html'}" class="profile-btn" id="navbarProfileBtn" title="Profile" style="display:flex; align-items:center; justify-content:center; width: 36px; height: 36px; background: rgba(0,229,255,0.1); border: 1px solid rgba(0,229,255,0.3); border-radius: 50%;">
                ${avatarHtml}
            </a>
            <button class="menu-btn" id="menuBtn" onclick="toggleSidebar()" title="Menu" style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #fff;">
                <i class="fas fa-bars" style="font-size: 1.2rem;"></i>
            </button>
        </div>
        <div class="nav-center" style="display: flex; justify-content: center; flex: 1;">
            <a href="index.html" class="logo" style="display: flex; align-items: center; gap: 8px;">
                <i class="fas fa-crosshairs" style="color: var(--accent); font-size: 1.2rem;"></i> XP ARENA
            </a>
        </div>
        <div class="nav-right" style="display: flex; align-items: center; gap: 8px;">
            <button class="theme-mode-toggle" onclick="toggleDarkMode()" title="Toggle Dark/Light Mode">
                ${isLightMode ? '🌙 Dark' : '☀️ Light'}
            </button>
            ${isLoggedIn && typeof window.User !== 'undefined' && window.User.getStats() ? `<span class="level-badge-nav" id="globalLevelBadge">Lvl ${window.User.getStats().level}</span>` : ''}
        </div>
    `;
    const nav = document.querySelector('nav.navbar');
    if (nav) nav.innerHTML = navbarHTML;

    // 2. Inject Sidebar
    const sidebarHTML = `
        <div class="sidebar-overlay" onclick="toggleSidebar()"></div>
        <div class="sidebar" id="sidebar">
            <div class="sidebar-header" style="padding: 1.5rem; border-bottom: 1px solid var(--border); margin-bottom: 1rem;">
                <a href="mystery.html" class="logo" style="text-decoration: none; color: inherit; display: block;" title="Secret System Protocol">XP ARENA</a>
            </div>
            <a href="index.html" class="sidebar-link"><i class="fas fa-home"></i> Home</a>
            <a href="tool.html" class="sidebar-link"><i class="fas fa-tools"></i> Sensitivity Tool</a>
            <a href="compare.html" class="sidebar-link"><i class="fas fa-balance-scale"></i> Compare Devices</a>
            <a href="leaderboard.html" class="sidebar-link"><i class="fas fa-trophy"></i> Leaderboard</a>
            <a href="ranks.html" class="sidebar-link"><i class="fas fa-layer-group"></i> Ranks</a>
            <a href="clips.html" class="sidebar-link"><i class="fas fa-film"></i> Top Clips</a>
            <a href="quests.html" class="sidebar-link"><i class="fas fa-star"></i> Daily Quests</a>
            <a href="guilds.html" class="sidebar-link"><i class="fas fa-shield-alt" style="color: #0f0;"></i> Guild Wars <span style="font-size: 0.6rem; background: rgba(255,255,255,0.1); color: var(--text-muted); padding: 2px 5px; border-radius: 4px; margin-left: 5px;">COMING SOON</span></a>
            <a href="submit.html" class="sidebar-link"><i class="fas fa-gamepad"></i> Join Rankings</a>
            <a href="tournaments.html" class="sidebar-link"><i class="fas fa-bullseye"></i> Tournaments</a>
            <a href="sponsors.html" class="sidebar-link"><i class="fas fa-handshake"></i> Sponsors</a>
            <a href="support.html" class="sidebar-link"><i class="fas fa-heart"></i> Support XP Arena</a>
            <hr style="border: 0; border-top: 1px solid var(--border); margin: 1rem 0;">
            ${user ? `
                <a href="profile.html" class="sidebar-link" id="nav-profile"><i class="fas fa-user-circle"></i> Profile (${user.username})</a>
                <a href="#" class="sidebar-link" onclick="Auth.logout(); location.reload();"><i class="fas fa-sign-out-alt"></i> Logout</a>
            ` : `
                <a href="login.html" class="sidebar-link" id="nav-login"><i class="fas fa-key"></i> Login / Signup</a>
            `}
            <hr style="border: 0; border-top: 1px solid var(--border); margin: auto 0 0.5rem 0;">
            <a href="about.html" class="sidebar-link"><i class="fas fa-info-circle"></i> About</a>
            <a href="contact.html" class="sidebar-link"><i class="fas fa-phone"></i> Contact</a>
            <hr style="border: 0; border-top: 1px solid var(--border); margin: 0.5rem 0;">
            <div style="padding: 0 1.5rem 1.5rem; margin-top: auto;">
                <div style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.8rem; text-transform: uppercase; font-weight: 800;">Visual Theme</div>
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 1rem;">
                    <div class="theme-dot" onclick="setTheme('default')" style="background: #00e5ff; width: 24px; height: 24px; border-radius: 50%; cursor: pointer; border: 2px solid #fff;" title="Default Neon"></div>
                    <div class="theme-dot" onclick="setTheme('theme-cyber')" style="background: linear-gradient(135deg, #0f0, #00e5ff); width: 24px; height: 24px; border-radius: 50%; cursor: pointer; border: 1px solid #0f0; box-shadow: 0 0 10px #0f0;" title="$100k Cyber Neon"></div>
                    <div class="theme-dot" onclick="setTheme('theme-ember')" style="background: #ff4d4d; width: 24px; height: 24px; border-radius: 50%; cursor: pointer;" title="Ember Red"></div>
                    <div class="theme-dot" onclick="setTheme('theme-amethyst')" style="background: #bf00ff; width: 24px; height: 24px; border-radius: 50%; cursor: pointer;" title="Amethyst Purple"></div>
                    <div class="theme-dot" onclick="setTheme('theme-gold')" style="background: #ffcc00; width: 24px; height: 24px; border-radius: 50%; cursor: pointer;" title="Gold"></div>
                    <input type="color" id="customColorPicker" onchange="setCustomColor(this.value, true)" value="#00e5ff" style="width: 25px; height: 25px; border: none; outline: none; border-radius: 50%; cursor: pointer; background: transparent; padding: 0;" title="Custom Color">
                </div>
                <button class="theme-mode-toggle" onclick="toggleDarkMode()" style="width: 100%; justify-content: center;">
                    ${document.body.classList.contains('light-mode') ? '🌙 Switch to Dark Mode' : '☀️ Switch to Light Mode'}
                </button>
            </div>
        </div>
    `;

    // Check if sidebar already exists or if we need to insert it
    if (!document.getElementById('sidebar')) {
        const body = document.body;
        const wrapper = document.createElement('div');
        wrapper.innerHTML = sidebarHTML;
        body.insertBefore(wrapper.firstElementChild, body.firstChild); // Overlay
        body.insertBefore(wrapper.lastElementChild, body.firstChild);  // Sidebar
    }

    // 3. Inject Bottom Nav
    const bottomNavHTML = `
        <a href="index.html" class="nav-item" data-page="index.html">
            <span class="nav-icon"><i class="fas fa-home"></i></span>
            <span>Home</span>
        </a>
        <a href="tool.html" class="nav-item" data-page="tool.html">
            <span class="nav-icon"><i class="fas fa-tools"></i></span>
            <span>Tool</span>
        </a>
        <a href="guilds.html" class="nav-item" data-page="guilds.html">
            <span class="nav-icon"><i class="fas fa-shield-alt"></i></span>
            <span>Guilds</span>
        </a>
        <a href="leaderboard.html" class="nav-item" data-page="leaderboard.html">
            <span class="nav-icon"><i class="fas fa-trophy"></i></span>
            <span>Leaders</span>
        </a>
        <a href="profile.html" class="nav-item" data-page="profile.html">
            <span class="nav-icon"><i class="fas fa-user-circle"></i></span>
            <span>Profile</span>
        </a>
    `;
    const bottomNav = document.querySelector('nav.bottom-nav');
    if (bottomNav) bottomNav.innerHTML = bottomNavHTML;
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    if (sidebar && overlay) {
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
    }
}

function highlightActiveLinks() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';

    // Highlight Sidebar
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    sidebarLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('link-active');
            link.style.color = 'var(--accent)';
        }
    });

    // Highlight Bottom Nav
    const bottomLinks = document.querySelectorAll('.nav-item');
    bottomLinks.forEach(link => {
        if (link.getAttribute('data-page') === currentPath) {
            link.classList.add('active');
        }
    });
}

// Inject Toast Script
if (!document.querySelector('script[src="js/toast.js"]')) {
    const toastScript = document.createElement('script');
    toastScript.src = 'js/toast.js';
    document.head.appendChild(toastScript);

    const confettiScript = document.createElement('script');
    confettiScript.src = 'js/confetti.js';
    document.head.appendChild(confettiScript);
}

function syncGlobalXP() {
    if (typeof User === 'undefined' || !Auth.isLoggedIn()) return;
    const stats = User.getStats();
    if (!stats) return;

    const bar = document.getElementById('globalXPBar');
    const badge = document.getElementById('globalLevelBadge');

    if (bar) {
        const progressPercent = ((stats.axp % 500) / 500) * 100;
        bar.style.width = `${progressPercent}%`;
    }

    if (badge) {
        badge.textContent = `Lvl ${stats.level}`;
        if (stats.level >= 10) {
            badge.style.background = 'var(--accent)';
            badge.style.color = '#000';
        }
    }
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

    // Handle quest alert
    const stats = User.getStats();
    const alert = document.getElementById('questAlert');
    if (alert && stats.quests) {
        const canClaim = stats.visitedPages.length >= 5 && !stats.quests.completed.includes('explorer');
        alert.style.display = canClaim ? 'block' : 'none';
    }
}

function setTheme(theme) {
    document.body.classList.remove('theme-ember', 'theme-amethyst', 'theme-gold', 'theme-cyber');
    document.documentElement.style.removeProperty('--accent');
    document.documentElement.style.removeProperty('--accent-glow');
    localStorage.removeItem('xp_custom_color');

    if (theme !== 'default') {
        document.body.classList.add(theme);
        localStorage.setItem('xp_theme', theme);
    } else {
        localStorage.removeItem('xp_theme');
    }

    // Highlight active dot
    document.querySelectorAll('.theme-dot').forEach(dot => {
        dot.style.border = 'none';
        if (dot.getAttribute('onclick').includes(theme)) {
            dot.style.border = '2px solid #fff';
        }
    });

    const colorPicker = document.getElementById('customColorPicker');
    if (colorPicker) colorPicker.style.border = 'none';

    if (window.Toast) {
        Toast.show(`Theme updated!`, 'info');
    }
}

window.setTheme = setTheme;

function setCustomColor(color, showToast = true) {
    document.body.classList.remove('theme-ember', 'theme-amethyst', 'theme-gold', 'theme-cyber');
    localStorage.removeItem('xp_theme');

    document.documentElement.style.setProperty('--accent', color);

    // Hex to RGB for glow
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16) || 0;
    const g = parseInt(hex.substring(2, 4), 16) || 229;
    const b = parseInt(hex.substring(4, 6), 16) || 255;
    document.documentElement.style.setProperty('--accent-glow', `rgba(${r}, ${g}, ${b}, 0.4)`);

    localStorage.setItem('xp_custom_color', color);

    document.querySelectorAll('.theme-dot').forEach(dot => dot.style.border = 'none');

    const colorPicker = document.getElementById('customColorPicker');
    if (colorPicker) {
        colorPicker.value = color;
        colorPicker.style.border = '2px solid #fff';
        colorPicker.style.borderRadius = '50%';
    }

    if (showToast && window.Toast) {
        Toast.show('Custom color applied!', 'success');
    }
}
window.setCustomColor = setCustomColor;

function toggleDarkMode() {
    const isLight = document.body.classList.toggle('light-mode');
    localStorage.setItem('xp_light_mode', isLight ? '1' : '0');
    // Re-inject layout so toggle button label updates
    injectLayout();
    highlightActiveLinks();
    syncGlobalXP();
    if (window.Toast) Toast.show(isLight ? '☀️ Light mode on' : '🌙 Dark mode on', 'info', 2000);
}

window.toggleDarkMode = toggleDarkMode;
