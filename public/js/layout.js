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
        setupPageTransitions();
        window.addEventListener('statsChange', syncGlobalXP);

        // Elite Gating
        applyEliteGating();

        // Mystery Protocol
        checkMysteryProtocol();

        // Initial user checks
        if (typeof User !== 'undefined' && Auth.isLoggedIn()) {
            User.checkDailyLogin();

            // Ask for push notification permission (delayed slightly)
            setTimeout(() => {
                subscribeToPushNotifications();
            }, 3000);

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
            <div id="notifDropdown" class="achievement-panel">
                <div class="achievement-panel-header">
                    <h3>Recent Activity</h3>
                    <button id="clearNotifs" style="background:none; border:none; color:var(--text-muted); font-size:0.8rem; cursor:pointer;"><i class="fas fa-check-double"></i></button>
                </div>
                <ul id="notifList" class="achievement-list"></ul>
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
    const displayName = isLoggedIn ? (Auth.getCurrentUser().username || 'Areni') : 'Guest';
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
            <a href="index" class="sidebar-link"><i class="fas fa-home"></i> Home</a>
            <a href="tool" class="sidebar-link"><i class="fas fa-tools"></i> Sensitivity Tool</a>
            <a href="compare" class="sidebar-link"><i class="fas fa-balance-scale"></i> Compare Devices</a>
            <a href="leaderboard" class="sidebar-link"><i class="fas fa-trophy"></i> Leaderboard</a>
            <a href="setups" class="sidebar-link"><i class="fas fa-sliders-h"></i> Popular Setups</a>
            <a href="ranks" class="sidebar-link"><i class="fas fa-layer-group"></i> Ranks</a>
            <a href="clips" class="sidebar-link"><i class="fas fa-film"></i> Top Clips</a>
            <a href="quests" class="sidebar-link"><i class="fas fa-star"></i> Daily Quests</a>
            <a href="daily-login" class="sidebar-link"><i class="fas fa-gift" style="color:#ffcc00;"></i> Daily Rewards</a>
            <a href="shop" class="sidebar-link"><i class="fas fa-shopping-cart" style="color:#00ff88;"></i> Armory (Shop)</a>
            <a href="guilds" class="sidebar-link"><i class="fas fa-shield-alt" style="color: var(--accent);"></i> Clans</a>
            <a href="guild-wars" class="sidebar-link"><i class="fas fa-crosshairs"></i> Clan Wars</a>
            <a href="submit" class="sidebar-link"><i class="fas fa-gamepad"></i> Join Rankings</a>
            <a href="tournaments" class="sidebar-link"><i class="fas fa-bullseye"></i> Tournaments</a>
            <a href="premium" class="sidebar-link"><i class="fas fa-gem" style="color:#bf00ff;"></i> Premium & Plans</a>
            <a href="premium-dashboard" class="sidebar-link"><i class="fas fa-crown"></i> Premium Hub</a>
            <a href="creators" class="sidebar-link"><i class="fas fa-user-astronaut"></i> Creator</a>
            ${stats && stats.is_admin ? `<a href="admin" class="sidebar-link"><i class="fas fa-shield-virus"></i> Admin</a>` : ``}
            <a href="sponsors" class="sidebar-link"><i class="fas fa-handshake"></i> Sponsors</a>
            <a href="support" class="sidebar-link"><i class="fas fa-heart"></i> Support XP Arena</a>
            <a href="help" class="sidebar-link"><i class="fas fa-question-circle"></i> Help & FAQ</a>
            <a href="mydata" class="sidebar-link"><i class="fas fa-database"></i> My Data</a>
            <a href="profile#settings" class="sidebar-link"><i class="fas fa-cog"></i> Settings</a>
            <hr style="border: 0; border-top: 1px solid var(--border); margin: 1rem 0;">
            ${user ? `
                <a href="profile" class="sidebar-link" id="nav-profile"><i class="fas fa-user-circle"></i> Profile (${user.username})</a>
                <a href="#" class="sidebar-link" onclick="Auth.logout(); location.reload();"><i class="fas fa-sign-out-alt"></i> Logout</a>
            ` : `
                <a href="login" class="sidebar-link" id="nav-login"><i class="fas fa-key"></i> Login / Signup</a>
            `}
            <hr style="border: 0; border-top: 1px solid var(--border); margin: auto 0 0.5rem 0;">
            <a href="about" class="sidebar-link"><i class="fas fa-info-circle"></i> About</a>
            <a href="contact" class="sidebar-link"><i class="fas fa-phone"></i> Contact</a>
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
        <a href="index" class="nav-item ${currentPage === 'index.html' ? 'active' : ''}" data-page="index.html">
            <span class="nav-icon"><i class="fas fa-home"></i></span>
            <span class="nav-label">Home</span>
        </a>
        <a href="tool" class="nav-item ${currentPage === 'tool.html' ? 'active' : ''}" data-page="tool.html">
            <span class="nav-icon"><i class="fas fa-tools"></i></span>
            <span class="nav-label">Tool</span>
        </a>
        <a href="daily-login" class="nav-item ${currentPage === 'daily-login.html' ? 'active' : ''}" data-page="daily-login.html">
            <span class="nav-icon"><i class="fas fa-gift"></i></span>
            <span class="nav-label">Rewards</span>
        </a>
        <a href="shop" class="nav-item ${currentPage === 'shop.html' ? 'active' : ''}" data-page="shop.html">
            <span class="nav-icon"><i class="fas fa-shopping-cart"></i></span>
            <span class="nav-label">Shop</span>
        </a>
        <a href="guilds" class="nav-item ${currentPage === 'guilds.html' ? 'active' : ''}" data-page="guilds.html">
            <span class="nav-icon"><i class="fas fa-shield-alt"></i></span>
            <span class="nav-label">Clans</span>
        </a>
        <a href="leaderboard" class="nav-item ${currentPage === 'leaderboard.html' ? 'active' : ''}" data-page="leaderboard.html">
            <span class="nav-icon"><i class="fas fa-trophy"></i></span>
            <span class="nav-label">Leaders</span>
        </a>
        <a href="profile" class="nav-item ${currentPage === 'profile.html' ? 'active' : ''}" data-page="profile.html">
            <span class="nav-icon"><i class="fas fa-user-circle"></i></span>
            <span class="nav-label">Profile</span>
        </a>
    `;
    const bottomNav = document.querySelector('nav.bottom-nav');
    if (bottomNav) bottomNav.innerHTML = bottomNavHTML;

    // 4. Wrap Content and Inject Footer
    wrapAndInjectFooter();

    // 5. Daily Reward Reminder
    checkDailyRewardReminder();
}

function checkDailyRewardReminder() {
    if (typeof Auth === 'undefined' || !Auth.isLoggedIn()) return;
    if (window.location.pathname.includes('daily-login.html') || window.location.pathname.includes('login.html')) return;

    setTimeout(() => {
        const stats = User.getStats();
        const today = new Date().toDateString();
        const last = stats ? (stats.lastLoginDate || (stats.lastLogin ? new Date(stats.lastLogin).toDateString() : null)) : null;
        if (stats && last !== today) {
            const reminder = document.createElement('div');
            reminder.id = 'daily-reminder-popup';
            reminder.innerHTML = `
                <div class="reminder-card" onclick="window.location.href='daily-login.html'">
                    <div class="reminder-glow"></div>
                    <div class="reminder-content">
                        <div class="reminder-icon">
                            <i class="fas fa-gift"></i>
                        </div>
                        <div class="reminder-text">
                            <div class="reminder-title">DAILY BOUNTY</div>
                            <div class="reminder-sub">Tap to Sync</div>
                        </div>
                        <button onclick="window.location.href='daily-login.html'" class="reminder-btn">CLAIM</button>
                        <button onclick="event.stopPropagation(); this.closest('#daily-reminder-popup').remove()" class="reminder-close">&times;</button>
                    </div>
                </div>
                <style>
                    #daily-reminder-popup {
                        position: fixed;
                        bottom: 110px;
                        right: 20px;
                        z-index: 100000;
                        pointer-events: auto;
                    }
                    .reminder-card {
                        background: rgba(11, 15, 23, 0.9);
                        backdrop-filter: blur(20px);
                        -webkit-backdrop-filter: blur(20px);
                        border: 1px solid var(--accent);
                        border-radius: 16px;
                        padding: 12px;
                        box-shadow: 0 10px 30px rgba(0,0,0,0.5), 0 0 15px var(--accent-glow);
                        animation: reminderSlideIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
                        position: relative;
                        overflow: hidden;
                        min-width: 240px;
                    }
                    .reminder-content {
                        display: flex;
                        align-items: center;
                        gap: 12px;
                        position: relative;
                        z-index: 2;
                    }
                    .reminder-icon {
                        background: var(--accent);
                        color: #000;
                        width: 36px;
                        height: 36px;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 1rem;
                        flex-shrink: 0;
                    }
                    .reminder-title {
                        font-weight: 950;
                        color: #fff;
                        font-size: 0.8rem;
                        letter-spacing: 1px;
                        line-height: 1;
                    }
                    .reminder-sub {
                        font-size: 0.7rem;
                        color: var(--text-muted);
                        margin-top: 2px;
                    }
                    .reminder-btn {
                        background: var(--accent);
                        border: none;
                        color: #000;
                        font-weight: 900;
                        padding: 6px 14px;
                        border-radius: 8px;
                        cursor: pointer;
                        font-size: 0.75rem;
                        margin-left: auto;
                        transition: transform 0.2s;
                    }
                    .reminder-btn:hover { transform: scale(1.05); }
                    .reminder-close {
                        background: none;
                        border: none;
                        color: rgba(255,255,255,0.3);
                        font-size: 1.2rem;
                        cursor: pointer;
                        padding: 0 5px;
                    }
                    .reminder-glow {
                        position: absolute;
                        top: 0; left: 0; width: 100%; height: 100%;
                        background: radial-gradient(circle at center, var(--accent-glow) 0%, transparent 70%);
                        opacity: 0.3;
                    }
                    @keyframes reminderSlideIn {
                        0% { transform: translateX(120%) scale(0.8); opacity: 0; }
                        100% { transform: translateX(0) scale(1); opacity: 1; }
                    }
                    @media (max-width: 600px) {
                        #daily-reminder-popup {
                            right: 10px;
                            left: 10px;
                            bottom: 100px;
                        }
                        .reminder-card { min-width: auto; }
                    }
                </style>
            `;
            document.body.appendChild(reminder);
        }
    }, 2000);
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
            if (child.id === 'xpa-levelup-overlay' || child.className === 'axp-increment-popup' || child.className === 'theme-fab' || child.className === 'theme-selector-overlay') return;

            wrapper.appendChild(child);
        });

        // Inject Wrapper into body
        // If bottomNav exists AND is a direct child of body, insert before it
        if (bottomNav && bottomNav.parentNode === document.body) {
            document.body.insertBefore(wrapper, bottomNav);
        } else {
            document.body.appendChild(wrapper);
        }

        // 2. Inject Theme FAB & Overlay
        injectThemeOverlay();

        // Inject Footer into Wrapper
        const footerHTML = `
            <footer class="site-footer">
                <div class="footer-grid">
                    <div class="footer-col">
                        <div style="display:flex; align-items:center; gap:10px; margin-bottom:1.5rem;">
                            <img src="/assets/images/logo.png" style="height:32px;" alt="Logo">
                            <span style="font-weight:900; color:#fff; font-size:1.2rem; letter-spacing:1px;">XP ARENA</span>
                        </div>
                        <p style="font-size:0.9rem; line-height:1.6;">The ultimate toolkit for Free Fire Arenis. Precision sensitivity, device comparisons, and community rankings.</p>
                    </div>
                    <div class="footer-col">
                        <h4>Quick Links</h4>
                        <ul class="footer-links">
                            <li><a href="index">Home</a></li>
                            <li><a href="shop">Armory (Shop)</a></li>
                            <li><a href="guilds">Clans</a></li>
                            <li><a href="daily-login">Daily Rewards</a></li>
                        </ul>
                    </div>
                    <div class="footer-col">
                        <h4>Resources</h4>
                        <ul class="footer-links">
                            <li><a href="sponsors">Sponsors</a></li>
                            <li><a href="support">Support Us</a></li>
                            <li><a href="help">Help & FAQ</a></li>
                            <li><a href="about">About XP Arena</a></li>
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

function injectThemeOverlay() {
    if (document.querySelector('.theme-fab')) return;

    const fabHTML = `
        <button class="theme-fab" id="themeFab" title="Customize Appearance">
            <i class="fas fa-palette"></i>
        </button>
        <div class="theme-selector-overlay" id="themeOverlay">
            <h4 style="margin-bottom:1rem; font-weight:800; color:var(--accent); letter-spacing:1px;">VISUAL OVERLAY</h4>
            <div style="display:grid; grid-template-columns: repeat(5, 1fr); gap:12px; margin-bottom:1.5rem;">
                <div class="theme-dot" onclick="setTheme('default')" style="background: #00e5ff; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; border: 2px solid #fff;" title="Default Neon"></div>
                <div class="theme-dot" onclick="setTheme('theme-cyber')" style="background: linear-gradient(135deg, #0f0, #00e5ff); width: 32px; height: 32px; border-radius: 50%; cursor: pointer; border: 1px solid #0f0;" title="Cyber Neon"></div>
                <div class="theme-dot" onclick="setTheme('theme-ember')" style="background: #ff4d4d; width: 32px; height: 32px; border-radius: 50%; cursor: pointer;" title="Ember Red"></div>
                <div class="theme-dot" onclick="setTheme('theme-amethyst')" style="background: #bf00ff; width: 32px; height: 32px; border-radius: 50%; cursor: pointer;" title="Amethyst Purple"></div>
                <div class="theme-dot" onclick="setTheme('theme-gold')" style="background: #ffcc00; width: 32px; height: 32px; border-radius: 50%; cursor: pointer;" title="Gold"></div>
            </div>
            <div style="margin-bottom: 1rem;">
                <div style="font-size:0.75rem; color:var(--text-muted); margin-bottom:8px; text-transform:uppercase;">Custom Hue</div>
                <input type="color" id="customColorPicker" onchange="setCustomColor(this.value)" style="width:100%; height:40px; border-radius:8px; border:none; background:none; cursor:pointer;">
            </div>
            <button class="btn-secondary" style="width:100%; font-size:0.8rem;" onclick="toggleDarkMode()">TOGGLE DARK/LIGHT</button>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', fabHTML);

    const fab = document.getElementById('themeFab');
    const overlay = document.getElementById('themeOverlay');

    fab.addEventListener('click', () => {
        const isVisible = overlay.style.display === 'block';
        overlay.style.display = isVisible ? 'none' : 'block';
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
        if (!fab.contains(e.target) && !overlay.contains(e.target)) {
            overlay.style.display = 'none';
        }
    });
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

// Inject Sound Engine & Toast / Effects Scripts
if (!document.querySelector('script[src="js/sounds.js"]')) {
    const sEng = document.createElement('script');
    sEng.src = 'js/sounds.js';
    document.head.appendChild(sEng);
}

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

    const badge = document.getElementById('globalLevelBadge');

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
                const items = (stats.activities || []).slice(0, 5).map(a => `
                    <li class="achievement-item">
                        <div class="achievement-icon">
                            <i class="${a.text.includes('reward') || a.text.includes('AXP') ? 'fas fa-star' : 'fas fa-info-circle'}"></i>
                        </div>
                        <div class="achievement-content">
                            <div class="achievement-title">${a.text}</div>
                            <span class="achievement-time">${new Date(a.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                    </li>
                `).join('');
                list.innerHTML = items || '<div style="padding: 1rem; text-align: center; color: var(--text-muted); font-size: 0.9rem;">No recent activity</div>';
            }
        }
    } else if (!dd.contains(e.target) && e.target.id !== 'clearNotifs' && !e.target.closest('#clearNotifs')) {
        dd.style.display = 'none';
    }
});

document.addEventListener('click', (e) => {
    const clearBtn = e.target.closest('#clearNotifs');
    if (clearBtn && typeof User !== 'undefined' && Auth.isLoggedIn()) {
        User.updateStatsLocally(s => s.activities = []);
        const list = document.getElementById('notifList');
        if (list) list.innerHTML = '<div style="padding: 1rem; text-align: center; color: var(--text-muted); font-size: 0.9rem;">No recent activity</div>';
    }
});

function setupPageTransitions() {
    document.body.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (!link) return;

        const target = link.getAttribute('target');
        const href = link.getAttribute('href');

        // Skip for external, new tab, hash links, or javascript
        if (target === '_blank' || !href || href.startsWith('#') || href.startsWith('javascript:')) return;

        // Skip if it's the current page
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        const linkPath = href.split('/').pop() || 'index.html';
        if (currentPath === linkPath) return;

        e.preventDefault();
        if (window.Sounds) Sounds.play('click');
        document.body.classList.add('page-transition-out');

        // Wait for animation then navigate
        setTimeout(() => {
            window.location.href = href;
        }, 300); // matches the 0.3s CSS transition
    });
}

// Push Notifications Setup
async function subscribeToPushNotifications() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        console.warn('Push notifications are not supported by the browser.');
        return;
    }

    // Don't ask again if they recently denied or if already subscribed
    const pushStatus = localStorage.getItem(`xp_push_${Auth.getCurrentUser().id}`);
    if (pushStatus === 'denied' || pushStatus === 'subscribed') {
        return;
    }

    try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            const registration = await navigator.serviceWorker.ready;

            // Fetch public key
            const res = await fetch((window.API_URL || '') + '/api/push/public-key');
            if (!res.ok) throw new Error('Could not fetch VAPID public key');
            const { publicKey } = await res.json();

            // Convert VAPID key
            const convertedVapidKey = urlBase64ToUint8Array(publicKey);

            // Subscribe
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: convertedVapidKey
            });

            // Send to backend
            await fetch((window.API_URL || '') + '/api/push/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + Auth.getToken()
                },
                body: JSON.stringify({ subscription })
            });

            // For now, save the permission state
            localStorage.setItem(`xp_push_${Auth.getCurrentUser().id}`, 'subscribed');
            console.log('Push notification permission granted and registered.');
            if (window.Toast) Toast.show('Push notifications enabled!', 'success', 3000);
        } else {
            localStorage.setItem(`xp_push_${Auth.getCurrentUser().id}`, 'denied');
        }
    } catch (e) {
        console.error('Push subscription failed:', e);
    }
}

// Utility function to convert VAPID key
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

function applyEliteGating() {
    if (typeof User === 'undefined') return;
    const stats = User.getStats();
    const isElite = stats && stats.is_premium;

    // Professional hiding of Pro-only elements
    document.querySelectorAll('.pro-only').forEach(el => {
        if (!isElite) {
            el.style.display = 'none';
        } else {
            el.classList.add('premium-active');
        }
    });

    // Toggle visibility of creator dashboard in sidebar
    const crLink = document.querySelector('a[href="creators.html"]');
    if (crLink && !isElite) {
        crLink.style.opacity = '0.4';
        crLink.style.pointerEvents = 'none';
        crLink.style.cursor = 'not-allowed';
        crLink.innerHTML += ' <i class="fas fa-lock" style="font-size:0.6rem; margin-left:8px; color: var(--accent);"></i>';
    }
}

function checkMysteryProtocol() {
    if (!Auth.isLoggedIn()) return;
    const today = new Date().toISOString().split('T')[0];
    if (localStorage.getItem('xp_mystery_protocol') === today) return;

    // Show Protocol Pop-up
    const popup = document.createElement('div');
    popup.id = 'mysteryProtocolPopup';
    popup.style = `
        position: fixed; bottom: 85px; right: 20px; z-index: 9999;
        background: linear-gradient(135deg, rgba(10,10,10,0.95), rgba(0,20,20,0.95));
        border: 2px solid var(--accent); border-radius: 12px; padding: 1.5rem;
        box-shadow: 0 0 30px var(--accent-glow); color: #fff; width: 280px;
        transform: translateY(100px); opacity: 0; transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    `;
    popup.innerHTML = `
        <div style="font-size: 0.6rem; letter-spacing: 3px; color: var(--accent); margin-bottom: 8px;">UPLINK DETECTED</div>
        <h3 style="margin: 0 0 10px 0; font-weight: 900;">SECRET PROTOCOL</h3>
        <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 15px;">A new tactical encryption has appeared in the Mystery Room. Decrypt for AXP rewards.</p>
        <div style="display:flex; gap:10px;">
            <a href="mystery.html" class="btn-primary" style="padding: 8px 15px; font-size: 0.75rem; text-decoration:none;" onclick="markProtocolSeen()">ENTER ROOM</a>
            <button class="btn-secondary" style="padding: 8px 15px; font-size: 0.75rem;" onclick="markProtocolSeen()">IGNORE</button>
        </div>
    `;

    document.body.appendChild(popup);
    setTimeout(() => {
        popup.style.transform = 'translateY(0)';
        popup.style.opacity = '1';
    }, 2000);

    window.markProtocolSeen = () => {
        localStorage.setItem('xp_mystery_protocol', today);
        popup.style.transform = 'translateY(100px)';
        popup.style.opacity = '0';
        setTimeout(() => popup.remove(), 500);
    };
}
