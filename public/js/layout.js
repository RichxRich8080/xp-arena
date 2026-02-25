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
            <button class="menu-btn" id="menuBtn" onclick="toggleSidebar()" title="Menu" style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #fff;">
                <i class="fas fa-bars" style="font-size: 1.2rem;"></i>
            </button>
        </div>
        <div class="nav-center" style="display: flex; justify-content: center; flex: 1;">
            <a href="index.html" class="logo" style="display: flex; align-items: center; gap: 8px;">
                <img src="/assets/images/logo.png" alt="XP ARENA Logo" style="height: 24px; width: auto; border-radius: 4px;"> XP ARENA
            </a>
        </div>
        <div class="nav-right" style="display: flex; align-items: center; gap: 12px; position: relative;">
            ${isLoggedIn ? `
            <button id="notifBtn" title="Notifications" style="background: rgba(255,255,255,0.08); border:1px solid var(--border); color:#fff; width:36px;height:36px;border-radius:8px; display:flex; align-items:center; justify-content:center;">
              <i class="fas fa-bell"></i>
            </button>
            <div id="notifDropdown" style="display:none; position:absolute; right:56px; top:50px; width:260px; background: var(--card-dark); border:1px solid var(--border); border-radius:12px; box-shadow: 0 8px 20px rgba(0,0,0,0.4);">
              <div style="padding:0.6rem 0.8rem; font-weight:800; border-bottom:1px solid var(--border);">Recent</div>
              <div id="notifList" style="max-height:260px; overflow:auto;"></div>
            </div>` : ``}
            ${isLoggedIn && typeof window.User !== 'undefined' && window.User.getStats() ? `<span class="level-badge-nav" id="globalLevelBadge">Lvl ${window.User.getStats().level}</span>` : ''}
            <a href="${isLoggedIn ? 'profile.html' : 'login.html'}" class="profile-btn" id="navbarProfileBtn" title="Profile" style="display:flex; align-items:center; justify-content:center; width: 36px; height: 36px; background: rgba(0,229,255,0.1); border: 1px solid rgba(0,229,255,0.3); border-radius: 50%;">
                ${avatarHtml}
            </a>
        </div>
    `;
    const nav = document.querySelector('nav.navbar');
    if (nav) nav.innerHTML = navbarHTML;

    // 2. Inject Sidebar
    const stats = isLoggedIn && typeof window.User !== 'undefined' ? window.User.getStats() : null;
    const premiumBadge = stats && stats.is_premium ? '<span style="font-size:0.7rem;background:rgba(255,215,0,0.15);border:1px solid rgba(255,215,0,0.4);color:#ffd700;padding:2px 6px;border-radius:6px;margin-left:6px;">PREMIUM</span>' : '';
    const displayName = isLoggedIn ? (Auth.getCurrentUser().username || 'Player') : 'Guest';
    const sidebarHTML = `
        <div class="sidebar-overlay" onclick="toggleSidebar()"></div>
        <div class="sidebar" id="sidebar">
            <div class="sidebar-header" style="padding: 1.5rem; border-bottom: 1px solid var(--border); margin-bottom: 1rem; display:flex; align-items:center; gap:12px;">
                <a href="profile.html" style="display:flex; align-items:center; gap:12px; text-decoration:none; color:#fff;">
                    <div style="width:40px;height:40px;display:flex;align-items:center;justify-content:center;background:rgba(0,229,255,0.1);border:1px solid rgba(0,229,255,0.3);border-radius:50%;">${avatarHtml}</div>
                    <div style="display:flex;align-items:center;gap:6px;font-weight:800;">
                        <span>${displayName}</span>${premiumBadge}
                    </div>
                </a>
            </div>
            <a href="index.html" class="sidebar-link"><i class="fas fa-home"></i> Home</a>
            <a href="tool.html" class="sidebar-link"><i class="fas fa-tools"></i> Sensitivity Tool</a>
            <a href="compare.html" class="sidebar-link"><i class="fas fa-balance-scale"></i> Compare Devices</a>
            <a href="leaderboard.html" class="sidebar-link"><i class="fas fa-trophy"></i> Leaderboard</a>
            <a href="setups.html" class="sidebar-link"><i class="fas fa-sliders-h"></i> Popular Setups</a>
            <a href="ranks.html" class="sidebar-link"><i class="fas fa-layer-group"></i> Ranks</a>
            <a href="clips.html" class="sidebar-link"><i class="fas fa-film"></i> Top Clips</a>
            <a href="quests.html" class="sidebar-link"><i class="fas fa-star"></i> Daily Quests</a>
            <a href="guilds.html" class="sidebar-link"><i class="fas fa-shield-alt" style="color: #0f0;"></i> Guilds</a>
            <a href="guild-wars.html" class="sidebar-link"><i class="fas fa-crosshairs"></i> Guild Wars</a>
            <a href="submit.html" class="sidebar-link"><i class="fas fa-gamepad"></i> Join Rankings</a>
            <a href="tournaments.html" class="sidebar-link"><i class="fas fa-bullseye"></i> Tournaments</a>
            <a href="premium.html" class="sidebar-link"><i class="fas fa-gem" style="color:#bf00ff;"></i> Premium & Plans</a>
            <a href="premium-dashboard.html" class="sidebar-link"><i class="fas fa-crown"></i> Premium Hub</a>
            <a href="creators.html" class="sidebar-link"><i class="fas fa-user-astronaut"></i> Creator</a>
            ${stats && stats.is_admin ? `<a href="admin.html" class="sidebar-link"><i class="fas fa-shield-virus"></i> Admin</a>` : ``}
            <a href="sponsors.html" class="sidebar-link"><i class="fas fa-handshake"></i> Sponsors</a>
            <a href="support.html" class="sidebar-link"><i class="fas fa-heart"></i> Support XP Arena</a>
            <a href="help.html" class="sidebar-link"><i class="fas fa-question-circle"></i> Help & FAQ</a>
            <a href="mydata.html" class="sidebar-link"><i class="fas fa-database"></i> My Data</a>
            <a href="profile.html#settings" class="sidebar-link"><i class="fas fa-cog"></i> Settings</a>
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
                <div style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.8rem; text-transform: uppercase; font-weight: 800;">Visual Theme Accent</div>
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 1rem;">
                    <div class="theme-dot" onclick="setTheme('default')" style="background: #00e5ff; width: 24px; height: 24px; border-radius: 50%; cursor: pointer; border: 2px solid #fff;" title="Default Neon"></div>
                    <div class="theme-dot" onclick="setTheme('theme-cyber')" style="background: linear-gradient(135deg, #0f0, #00e5ff); width: 24px; height: 24px; border-radius: 50%; cursor: pointer; border: 1px solid #0f0; box-shadow: 0 0 10px #0f0;" title="$100k Cyber Neon"></div>
                    <div class="theme-dot" onclick="setTheme('theme-ember')" style="background: #ff4d4d; width: 24px; height: 24px; border-radius: 50%; cursor: pointer;" title="Ember Red"></div>
                    <div class="theme-dot" onclick="setTheme('theme-amethyst')" style="background: #bf00ff; width: 24px; height: 24px; border-radius: 50%; cursor: pointer;" title="Amethyst Purple"></div>
                    <div class="theme-dot" onclick="setTheme('theme-gold')" style="background: #ffcc00; width: 24px; height: 24px; border-radius: 50%; cursor: pointer;" title="Gold"></div>
                </div>
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
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const bottomNavHTML = `
        <a href="index.html" class="nav-item ${currentPage === 'index.html' ? 'active' : ''}" data-page="index.html">
            <span class="nav-icon"><i class="fas fa-home"></i></span>
            <span class="nav-label">Home</span>
        </a>
        <a href="tool.html" class="nav-item ${currentPage === 'tool.html' ? 'active' : ''}" data-page="tool.html">
            <span class="nav-icon"><i class="fas fa-tools"></i></span>
            <span class="nav-label">Tool</span>
        </a>
        <a href="guilds.html" class="nav-item ${currentPage === 'guilds.html' ? 'active' : ''}" data-page="guilds.html">
            <span class="nav-icon"><i class="fas fa-shield-alt"></i></span>
            <span class="nav-label">Units</span>
        </a>
        <a href="leaderboard.html" class="nav-item ${currentPage === 'leaderboard.html' ? 'active' : ''}" data-page="leaderboard.html">
            <span class="nav-icon"><i class="fas fa-trophy"></i></span>
            <span class="nav-label">Leaders</span>
        </a>
        <a href="profile.html" class="nav-item ${currentPage === 'profile.html' ? 'active' : ''}" data-page="profile.html">
            <span class="nav-icon"><i class="fas fa-user-circle"></i></span>
            <span class="nav-label">Profile</span>
        </a>
    `;
    const bottomNav = document.querySelector('nav.bottom-nav');
    if (bottomNav) bottomNav.innerHTML = bottomNavHTML;

    // 4. Wrap Content and Inject Footer
    wrapAndInjectFooter();
}

function wrapAndInjectFooter() {
    console.log('Layout: Starting wrapAndInjectFooter');
    if (document.querySelector('.main-content-area')) {
        console.log('Layout: Already wrapped');
        return;
    }

    try {
        // Use class selectors for better compatibility
        const navbar = document.querySelector('.navbar');
        const bottomNav = document.querySelector('.bottom-nav');
        const sidebar = document.getElementById('sidebar');
        const overlay = document.querySelector('.sidebar-overlay');

        const user = Auth.getCurrentUser();
        const isLoggedIn = !!user;
        const stats = isLoggedIn && typeof window.User !== 'undefined' ? window.User.getStats() : null;

        console.log('Layout: Wrapping content. isLoggedIn:', isLoggedIn);

        const wrapper = document.createElement('div');
        wrapper.className = 'main-content-area';

        // SAFETY: Only move direct children of body
        const bodyChildren = Array.from(document.body.childNodes);
        bodyChildren.forEach(child => {
            // Skip navbar, bottomNav, sidebar, overlay, and scripts
            if (child === navbar || child === bottomNav || child === sidebar || child === overlay) return;
            if (child.nodeName === 'SCRIPT' || child.nodeName === 'STYLE') return;
            if (child.id === 'xpa-levelup-overlay' || child.className === 'axp-increment-popup') return;

            wrapper.appendChild(child);
        });

        // Inject Welcome Header into Wrapper
        const welcomeHTML = `
            <div class="commander-header">
                <div class="commander-status">
                    <span class="pulse"></span>
                    ACTIVE PROTOCOL: ${stats && stats.rank ? stats.rank.name : 'GUEST'}
                </div>
                <div class="commander-name">
                    Welcome back, ${user ? user.username.toUpperCase() : 'SOLDIER'}
                </div>
            </div>
        `;
        wrapper.insertAdjacentHTML('afterbegin', welcomeHTML);

        // Inject Wrapper into body
        // If bottomNav exists AND is a direct child of body, insert before it
        if (bottomNav && bottomNav.parentNode === document.body) {
            document.body.insertBefore(wrapper, bottomNav);
        } else {
            document.body.appendChild(wrapper);
        }

        // Inject Footer into Wrapper
        const footerHTML = `
            <footer class="site-footer">
                <div class="footer-grid">
                    <div class="footer-col">
                        <div style="display:flex; align-items:center; gap:10px; margin-bottom:1.5rem;">
                            <img src="/assets/images/logo.png" style="height:32px;" alt="Logo">
                            <span style="font-weight:900; color:#fff; font-size:1.2rem; letter-spacing:1px;">XP ARENA</span>
                        </div>
                        <p style="font-size:0.9rem; line-height:1.6;">The ultimate toolkit for Free Fire players. Precision sensitivity, device comparisons, and community rankings.</p>
                    </div>
                    <div class="footer-col">
                        <h4>Quick Links</h4>
                        <ul class="footer-links">
                            <li><a href="index.html">Home</a></li>
                            <li><a href="tool.html">Sensitivity Tool</a></li>
                            <li><a href="leaderboard.html">Leaderboard</a></li>
                            <li><a href="clips.html">Top Clips</a></li>
                        </ul>
                    </div>
                    <div class="footer-col">
                        <h4>Resources</h4>
                        <ul class="footer-links">
                            <li><a href="sponsors.html">Sponsors</a></li>
                            <li><a href="support.html">Support Us</a></li>
                            <li><a href="help.html">Help & FAQ</a></li>
                            <li><a href="about.html">About XP Arena</a></li>
                        </ul>
                    </div>
                    <div class="footer-col">
                        <h4>Community</h4>
                        <div class="social-links">
                            <a href="#" title="Discord"><i class="fab fa-discord"></i></a>
                            <a href="#" title="Instagram"><i class="fab fa-instagram"></i></a>
                            <a href="#" title="YouTube"><i class="fab fa-youtube"></i></a>
                            <a href="#" title="Twitter"><i class="fab fa-twitter"></i></a>
                        </div>
                    </div>
                </div>
                <div class="footer-bottom">
                    <p>&copy; 2026 XP ARENA. All rights reserved.</p>
                    <div style="display:flex; gap:1.5rem;">
                        <a href="#">Privacy Policy</a>
                        <a href="#">Terms of Service</a>
                    </div>
                </div>
            </footer>
        `;
        wrapper.insertAdjacentHTML('beforeend', footerHTML);
        console.log('Layout: Successfully wrapped and injected footer');
    } catch (err) {
        console.error('Layout: Error in wrapAndInjectFooter:', err);
    }
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    if (sidebar && overlay) {
        const isActive = sidebar.classList.toggle('active');
        overlay.classList.toggle('active');

        // Scroll Lock
        if (isActive) {
            document.body.style.overflow = 'hidden';
            document.body.style.height = '100vh';
        } else {
            document.body.style.overflow = '';
            document.body.style.height = '';
        }
    }
}

function highlightActiveLinks() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const cleanPath = currentPath.replace('.html', '');

    // Highlight Sidebar
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    sidebarLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (!href) return;

        const linkClean = href.replace('.html', '');
        if (href === currentPath || linkClean === cleanPath ||
            (currentPath === 'profile.html' && href.includes('profile.html'))) {
            link.classList.add('link-active');
            link.style.color = 'var(--accent)';
        }
    });

    // Highlight Bottom Nav
    const bottomLinks = document.querySelectorAll('.nav-item');
    bottomLinks.forEach(link => {
        const page = link.getAttribute('data-page');
        if (!page) return;

        const pageClean = page.replace('.html', '');
        if (page === currentPath || pageClean === cleanPath) {
            link.classList.add('active');
        }
    });
}

// Deep link to profile settings tab via hash
if (window.location.hash === '#settings') {
    window.addEventListener('load', () => {
        const btn = Array.from(document.querySelectorAll('.tab-btn'))
            .find(el => ((el.getAttribute('onclick') || '').includes("switchTab('settings')")));
        if (btn) btn.click();
    });
}

// Inject Toast / Effects Scripts
if (!document.querySelector('script[src="js/toast.js"]')) {
    const toastScript = document.createElement('script');
    toastScript.src = 'js/toast.js';
    document.head.appendChild(toastScript);

    const confettiScript = document.createElement('script');
    confettiScript.src = 'js/confetti.js';
    document.head.appendChild(confettiScript);

    const effectsScript = document.createElement('script');
    effectsScript.src = 'js/effects.js';
    document.head.appendChild(effectsScript);
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

document.addEventListener('click', (e) => {
    const btn = document.getElementById('notifBtn');
    const dd = document.getElementById('notifDropdown');
    if (!btn || !dd) return;
    if (btn.contains(e.target)) {
        dd.style.display = dd.style.display === 'none' ? 'block' : 'none';
        if (dd.style.display === 'block' && typeof Auth !== 'undefined' && Auth.isLoggedIn() && typeof User !== 'undefined') {
            const stats = User.getStats();
            const list = document.getElementById('notifList');
            if (list) {
                const items = (stats.activities || []).slice(0, 5).map(a => `<div style="padding:0.6rem 0.8rem; border-bottom:1px solid var(--border);">${a.text}<br><span style="font-size:0.75rem; color: var(--text-muted);">${new Date(a.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></div>`).join('');
                list.innerHTML = items || '<div style="padding:0.6rem 0.8rem;">No recent activity</div>';
            }
        }
    } else if (!dd.contains(e.target)) {
        dd.style.display = 'none';
    }
});
