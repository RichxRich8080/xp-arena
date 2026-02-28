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
    } else if (!localStorage.getItem('xp_custom_color')) {
        try { setTheme('theme-frost'); } catch {}
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
        <div class="hud-corner hud-tl"></div>
        <div class="hud-corner hud-tr"></div>
        <div class="hud-corner hud-bl"></div>
        <div class="hud-corner hud-br"></div>
        <div class="scan-line"></div>
        <div class="nav-left" style="display: flex; align-items: center; gap: 15px;">
            <button class="menu-btn" id="menuBtn" onclick="toggleSidebar()" title="Menu" aria-label="Open menu" style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #fff;">
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
            <button id="notifBtn" title="Notifications" aria-label="Notifications" style="background: rgba(255,255,255,0.08); border:1px solid var(--border); color:#fff; width:36px;height:36px;border-radius:8px; display:flex; align-items:center; justify-content:center;">
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
            <a href="${isLoggedIn ? 'profile.html' : 'login.html'}" class="profile-btn" id="navbarProfileBtn" title="Profile" aria-label="Profile" style="display:flex; align-items:center; justify-content:center; width: 36px; height: 36px; background: rgba(var(--accent-rgb, 255,85,0), 0.15); border: 1px solid rgba(var(--accent-rgb, 255,85,0), 0.3); border-radius: 50%;">
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
            <div class="sidebar-header" style="padding: 2rem 1.5rem; border-bottom: 1px solid var(--border); margin-bottom: 1.5rem; display:flex; flex-direction:column; align-items:center; gap:15px; position:relative; overflow:hidden;">
                <div class="hud-corner tl" style="position:absolute; top:10px; left:10px; width:15px; height:15px; border-top:2px solid var(--accent); border-left:2px solid var(--accent); opacity:0.3;"></div>
                <div class="hud-corner tr" style="position:absolute; top:10px; right:10px; width:15px; height:15px; border-top:2px solid var(--accent); border-right:2px solid var(--accent); opacity:0.3;"></div>
                <div class="hud-corner bl" style="position:absolute; bottom:10px; left:10px; width:15px; height:15px; border-bottom:2px solid var(--accent); border-left:2px solid var(--accent); opacity:0.3;"></div>
                <div class="hud-corner br" style="position:absolute; bottom:10px; right:10px; width:15px; height:15px; border-bottom:2px solid var(--accent); border-right:2px solid var(--accent); opacity:0.3;"></div>
                <a href="profile.html" style="display:flex; flex-direction:column; align-items:center; gap:12px; text-decoration:none; color:#fff; position:relative; z-index:1;">
                    <div style="width:70px;height:70px;display:flex;align-items:center;justify-content:center;background:rgba(var(--accent-rgb, 139, 92, 246),0.1);border:1px solid rgba(var(--accent-rgb, 139, 92, 246),0.3);border-radius:50%; box-shadow:0 0 20px rgba(var(--accent-rgb), 0.2);">${avatarHtml}</div>
                    <div style="display:flex; flex-direction:column; align-items:center; gap:4px;">
                        <span style="font-family:'Outfit', sans-serif; font-weight:900; font-size:1.1rem; letter-spacing:0.5px;">${displayName}</span>
                        ${premiumBadge ? `<span style="font-family:'Rajdhani', sans-serif; font-size:0.7rem; background:linear-gradient(90deg, #ffd700, #ff8c00); color:#000; padding:2px 8px; border-radius:4px; font-weight:800; letter-spacing:1px;">ELITE STATUS</span>` : ''}
                    </div>
                </a>
            </div>
            <div class="sidebar-scroll" style="padding-bottom: calc(var(--bottom-nav-safe) + 20px);">
                <a href="index.html" class="sidebar-link"><i class="fas fa-home"></i> Home Panel</a>
                <a href="tool.html" class="sidebar-link"><i class="fas fa-microchip"></i> Sensitivity Engine</a>
                <a href="compare.html" class="sidebar-link"><i class="fas fa-chart-line"></i> Precision Lab</a>
                <a href="leaderboard.html" class="sidebar-link"><i class="fas fa-trophy"></i> Global Ranks</a>
                <a href="clips.html" class="sidebar-link"><i class="fas fa-video"></i> Tactical Clips</a>
                <a href="guilds.html" class="sidebar-link"><i class="fas fa-shield-alt"></i> Clan Hub</a>
                <a href="premium.html" class="sidebar-link" style="color:var(--accent); font-weight:800; background:rgba(var(--accent-rgb), 0.05); border-left:3px solid var(--accent);"><i class="fas fa-crown"></i> ELITE ACCESS</a>
                <div style="padding: 1.5rem 1.5rem 0.5rem; font-family:'Rajdhani', sans-serif; font-size:0.75rem; color:var(--text-muted); text-transform:uppercase; letter-spacing:2px; font-weight:700;">Navigation Matrix</div>
                <a href="tournaments.html" class="sidebar-link"><i class="fas fa-crosshairs"></i> Operations</a>
                <a href="quests.html" class="sidebar-link"><i class="fas fa-satellite-dish"></i> Mission Data</a>
                <a href="shop.html" class="sidebar-link"><i class="fas fa-box-open"></i> Armory</a>
                <a href="profile.html" class="sidebar-link"><i class="fas fa-user-cog"></i> Interface Config</a>
                <a href="help.html" class="sidebar-link"><i class="fas fa-life-ring"></i> Support Link</a>
            </div>
            <hr style="border: 0; border-top: 1px solid var(--border); margin: 1rem 0;">
            ${user ? `
                <a href="profile.html" class="sidebar-link" id="nav-profile"><i class="fas fa-terminal"></i> User Profile [${user.username}]</a>
                <a href="#" class="sidebar-link" onclick="Auth.logout(); location.reload();" style="color: #ef4444;"><i class="fas fa-power-off"></i> Terminate Session</a>
            ` : `
                <a href="login.html" class="sidebar-link" id="nav-login"><i class="fas fa-code-branch"></i> Initialize Access</a>
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
        <div class="hud-corner hud-tl"></div>
        <div class="hud-corner hud-tr"></div>
        <div class="hud-corner hud-bl"></div>
        <div class="hud-corner hud-br"></div>
        <div class="scan-line"></div>
        <a href="index.html" class="nav-item ${currentPage === 'index.html' ? 'active' : ''}" data-page="index.html" style="flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:4px; text-decoration:none; color:inherit;">
            <span class="nav-icon" style="font-size:1.2rem;"><i class="fas fa-home"></i></span>
            <span class="nav-label" style="font-family:'Rajdhani', sans-serif; font-size:0.65rem; font-weight:700; text-transform:uppercase; letter-spacing:1px;">Hub</span>
        </a>
        <a href="tool.html" class="nav-item ${currentPage === 'tool.html' ? 'active' : ''}" data-page="tool.html" style="flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:4px; text-decoration:none; color:inherit;">
            <span class="nav-icon" style="font-size:1.2rem;"><i class="fas fa-microchip"></i></span>
            <span class="nav-label" style="font-family:'Rajdhani', sans-serif; font-size:0.65rem; font-weight:700; text-transform:uppercase; letter-spacing:1px;">Engine</span>
        </a>
        <a href="shop.html" class="nav-item ${currentPage === 'shop.html' ? 'active' : ''}" data-page="shop.html" style="flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:4px; text-decoration:none; color:inherit;">
            <span class="nav-icon" style="font-size:1.2rem;"><i class="fas fa-box-open"></i></span>
            <span class="nav-label" style="font-family:'Rajdhani', sans-serif; font-size:0.65rem; font-weight:700; text-transform:uppercase; letter-spacing:1px;">Armory</span>
        </a>
        <a href="guilds.html" class="nav-item ${currentPage === 'guilds.html' ? 'active' : ''}" data-page="guilds.html" style="flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:4px; text-decoration:none; color:inherit;">
            <span class="nav-icon" style="font-size:1.2rem;"><i class="fas fa-shield-alt"></i></span>
            <span class="nav-label" style="font-family:'Rajdhani', sans-serif; font-size:0.65rem; font-weight:700; text-transform:uppercase; letter-spacing:1px;">Clans</span>
        </a>
        <a href="profile.html" class="nav-item ${currentPage === 'profile.html' ? 'active' : ''}" data-page="profile.html" style="flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:4px; text-decoration:none; color:inherit;">
            <span class="nav-icon" style="font-size:1.2rem;">${avatarHtml}</span>
            <span class="nav-label" style="font-family:'Rajdhani', sans-serif; font-size:0.65rem; font-weight:700; text-transform:uppercase; letter-spacing:1px;">User</span>
        </a>
    `;
    const bottomNav = document.querySelector('nav.bottom-nav');
    if (bottomNav) bottomNav.innerHTML = bottomNavHTML;

    // 4. Wrap Content and Inject Footer
    wrapAndInjectFooter();

    // 5. Daily Reward Reminder
    checkDailyRewardReminder();

    // 6. Premium Hint Banner (non-premium users only, skip on premium pages)
    try {
        const page = (window.location.pathname.split('/').pop() || '').toLowerCase();
        const skip = ['premium.html', 'premium-dashboard.html'].includes(page);
        if (!skip && Auth.isLoggedIn()) {
            const stats = window.User && window.User.getStats ? window.User.getStats() : null;
            if (stats && !stats.is_premium && !localStorage.getItem('xp_premium_hint_dismiss')) {
                const banner = document.createElement('div');
                banner.id = 'premium-hint-banner';
                banner.style.cssText = 'position:fixed; bottom:80px; left:50%; transform:translateX(-50%); background:rgba(11,15,23,0.95); border:1px solid var(--accent); color:#fff; padding:10px 14px; border-radius:12px; z-index:30000; display:flex; gap:10px; align-items:center;';
                banner.innerHTML = '<span style=\"font-weight:900; letter-spacing:1px; font-size:0.8rem;\">Go Premium</span><a href=\"premium.html\" class=\"btn-secondary\" style=\"width:auto\">Compare</a><button id=\"phDismiss\" style=\"background:none;border:none;color:var(--text-muted);font-size:1.2rem;\">&times;</button>';
                document.body.appendChild(banner);
                document.getElementById('phDismiss').addEventListener('click', () => { localStorage.setItem('xp_premium_hint_dismiss', '1'); banner.remove(); });
            }
        }
    } catch { }
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
                            <li><a href="index.html">Home</a></li>
                            <li><a href="shop.html">Armory (Shop)</a></li>
                            <li><a href="guilds.html">Clans</a></li>
                            <li><a href="daily-login.html">Daily Rewards</a></li>
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

function injectThemeOverlay() {
    if (document.querySelector('.theme-fab')) return;

    const fabHTML = `
        <button class="theme-fab" id="themeFab" title="Color Palette" aria-label="Change color theme">
            <i class="fas fa-palette"></i>
        </button>
        <div class="theme-panel" id="themePanel">
            <div class="theme-panel-header">
                <div class="theme-panel-title">
                    <i class="fas fa-palette"></i>
                    Color Palette
                </div>
                <button class="theme-panel-close" id="themePanelClose">&times;</button>
            </div>

            <div class="theme-panel-section-label">GAMER THEMES</div>
            <div class="theme-grid">
                <button class="theme-swatch" data-theme="default" onclick="setTheme('default')">
                    <div class="theme-swatch-dot" style="background:#FF5500"></div>
                    <div class="theme-swatch-info">
                        <div class="theme-swatch-name">🔥 Blaze</div>
                        <div class="theme-swatch-hex">#FF5500</div>
                    </div>
                </button>
                <button class="theme-swatch" data-theme="theme-volt" onclick="setTheme('theme-volt')">
                    <div class="theme-swatch-dot" style="background:#AAFF00"></div>
                    <div class="theme-swatch-info">
                        <div class="theme-swatch-name">⚡ Volt</div>
                        <div class="theme-swatch-hex">#AAFF00</div>
                    </div>
                </button>
                <button class="theme-swatch" data-theme="theme-phantom" onclick="setTheme('theme-phantom')">
                    <div class="theme-swatch-dot" style="background:#8B5CF6"></div>
                    <div class="theme-swatch-info">
                        <div class="theme-swatch-name">💜 Phantom</div>
                        <div class="theme-swatch-hex">#8B5CF6</div>
                    </div>
                </button>
                <button class="theme-swatch" data-theme="theme-frost" onclick="setTheme('theme-frost')">
                    <div class="theme-swatch-dot" style="background:#00D4FF"></div>
                    <div class="theme-swatch-info">
                        <div class="theme-swatch-name">🩵 Frost</div>
                        <div class="theme-swatch-hex">#00D4FF</div>
                    </div>
                </button>
                <button class="theme-swatch" data-theme="theme-crimson" onclick="setTheme('theme-crimson')">
                    <div class="theme-swatch-dot" style="background:#FF1744"></div>
                    <div class="theme-swatch-info">
                        <div class="theme-swatch-name">❤️ Crimson</div>
                        <div class="theme-swatch-hex">#FF1744</div>
                    </div>
                </button>
                <button class="theme-swatch" data-theme="theme-champion" onclick="setTheme('theme-champion')">
                    <div class="theme-swatch-dot" style="background:#FFD700"></div>
                    <div class="theme-swatch-info">
                        <div class="theme-swatch-name">🏆 Champion</div>
                        <div class="theme-swatch-hex">#FFD700</div>
                    </div>
                </button>
            </div>

            <div class="theme-panel-section-label" style="margin-top:1rem;">CUSTOM COLOR</div>
            <div style="display:flex;align-items:center;gap:10px;">
                <input type="color" id="customColorPicker" onchange="setCustomColor(this.value)"
                    style="width:44px;height:44px;border:none;background:none;cursor:pointer;border-radius:10px;padding:0;flex-shrink:0;">
                <div style="font-size:0.8rem;color:#5a5a6a;line-height:1.4;">Pick any color to use as your accent across all pages</div>
            </div>

            <div style="margin-top:1.2rem;padding-top:1rem;border-top:1px solid rgba(255,255,255,0.06);">
                <button onclick="toggleDarkMode()" style="width:100%;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.08);color:#f0f0f0;padding:0.65rem;border-radius:10px;cursor:pointer;font-size:0.82rem;font-weight:700;letter-spacing:0.5px;"><i class="fas fa-moon"></i> TOGGLE DARK / LIGHT</button>
            </div>
        </div>

        <style>
        .theme-fab {
            position: fixed;
            bottom: calc(var(--bottom-nav-height, 68px) + 16px);
            right: 16px;
            z-index: 40000;
            width: 48px; height: 48px;
            border-radius: 50%;
            background: var(--accent);
            color: #fff;
            border: none;
            cursor: pointer;
            display: flex; align-items: center; justify-content: center;
            font-size: 1.1rem;
            box-shadow: 0 4px 20px rgba(var(--accent-rgb, 255,85,0), 0.45), 0 2px 8px rgba(0,0,0,0.6);
            transition: all 0.3s cubic-bezier(0.175,0.885,0.32,1.275);
            -webkit-tap-highlight-color: transparent;
        }
        .theme-fab:hover { transform: scale(1.1) rotate(15deg); }
        .theme-fab:active { transform: scale(0.95); }

        .theme-panel {
            position: fixed;
            bottom: calc(var(--bottom-nav-height, 68px) + 72px);
            right: 16px;
            z-index: 39999;
            width: 280px;
            background: rgba(10,10,10,0.97);
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: 18px;
            padding: 1.2rem;
            backdrop-filter: blur(30px);
            -webkit-backdrop-filter: blur(30px);
            box-shadow: 0 20px 60px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.04);
            display: none;
            animation: panelSlideUp 0.35s cubic-bezier(0.165,0.84,0.44,1) forwards;
            transform-origin: bottom right;
        }
        .theme-panel.open { display: block; }

        @keyframes panelSlideUp {
            from { opacity:0; transform: scale(0.88) translateY(12px); }
            to   { opacity:1; transform: scale(1) translateY(0); }
        }

        .theme-panel-header {
            display: flex; align-items: center; justify-content: space-between;
            margin-bottom: 1rem;
        }
        .theme-panel-title {
            font-weight: 900; font-size: 0.9rem; letter-spacing: 0.5px;
            color: #f0f0f0; display: flex; align-items: center; gap: 8px;
        }
        .theme-panel-title i { color: var(--accent); }
        .theme-panel-close {
            background: rgba(255,255,255,0.06); border: none; color: #5a5a6a;
            width: 28px; height: 28px; border-radius: 8px; cursor: pointer;
            font-size: 1.1rem; display: flex; align-items: center; justify-content: center;
            transition: background 0.2s;
        }
        .theme-panel-close:hover { background: rgba(255,255,255,0.12); color: #f0f0f0; }

        .theme-panel-section-label {
            font-size: 0.67rem; font-weight: 800; letter-spacing: 2px;
            color: #5a5a6a; margin-bottom: 0.7rem;
        }

        .theme-grid {
            display: grid; grid-template-columns: 1fr 1fr;
            gap: 6px;
        }

        .theme-swatch {
            display: flex; align-items: center; gap: 10px;
            background: rgba(255,255,255,0.04);
            border: 1px solid rgba(255,255,255,0.07);
            border-radius: 10px;
            padding: 0.6rem 0.75rem;
            cursor: pointer;
            transition: all 0.2s ease;
            text-align: left;
        }
        .theme-swatch:hover {
            background: rgba(255,255,255,0.08);
            border-color: rgba(255,255,255,0.15);
            transform: translateY(-1px);
        }
        .theme-swatch.active {
            border-color: var(--accent);
            background: rgba(var(--accent-rgb,255,85,0), 0.08);
            box-shadow: 0 0 0 1px var(--accent);
        }
        .theme-swatch-dot {
            width: 22px; height: 22px; border-radius: 50%;
            flex-shrink: 0;
            box-shadow: 0 2px 8px rgba(0,0,0,0.5);
        }
        .theme-swatch-info { flex: 1; min-width: 0; }
        .theme-swatch-name { font-size: 0.78rem; font-weight: 800; color: #f0f0f0; line-height: 1.2; }
        .theme-swatch-hex { font-size: 0.65rem; color: #5a5a6a; font-family: monospace; }
        </style>
    `;
    document.body.insertAdjacentHTML('beforeend', fabHTML);

    const fab = document.getElementById('themeFab');
    const panel = document.getElementById('themePanel');
    const closeBtn = document.getElementById('themePanelClose');

    fab.addEventListener('click', (e) => {
        e.stopPropagation();
        panel.classList.toggle('open');
    });

    closeBtn.addEventListener('click', () => panel.classList.remove('open'));

    document.addEventListener('click', (e) => {
        if (panel.classList.contains('open') && !fab.contains(e.target) && !panel.contains(e.target)) {
            panel.classList.remove('open');
        }
    });

    // Mark active swatch
    _updateActiveThemeSwatch();
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
    const ALL_THEMES = ['theme-volt', 'theme-phantom', 'theme-frost', 'theme-crimson', 'theme-champion', 'theme-ember', 'theme-amethyst', 'theme-gold', 'theme-cyber'];
    ALL_THEMES.forEach(t => document.body.classList.remove(t));
    document.documentElement.style.removeProperty('--accent');
    document.documentElement.style.removeProperty('--accent-glow');
    document.documentElement.style.removeProperty('--accent-rgb');
    localStorage.removeItem('xp_custom_color');

    if (theme !== 'default') {
        document.body.classList.add(theme);
        localStorage.setItem('xp_theme', theme);
    } else {
        localStorage.removeItem('xp_theme');
    }

    _updateActiveThemeSwatch();

    if (window.Toast) Toast.show('Theme updated!', 'info', 1500);
}

function _updateActiveThemeSwatch() {
    const saved = localStorage.getItem('xp_theme') || 'default';
    document.querySelectorAll('.theme-swatch').forEach(s => {
        s.classList.toggle('active', (s.dataset.theme || 'default') === saved);
    });
}

window.setTheme = setTheme;

function setCustomColor(color, showToast = true) {
    const ALL_THEMES = ['theme-volt', 'theme-phantom', 'theme-frost', 'theme-crimson', 'theme-champion', 'theme-ember', 'theme-amethyst', 'theme-gold', 'theme-cyber'];
    ALL_THEMES.forEach(t => document.body.classList.remove(t));
    localStorage.removeItem('xp_theme');

    document.documentElement.style.setProperty('--accent', color);

    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16) || 255;
    const g = parseInt(hex.substring(2, 4), 16) || 85;
    const b = parseInt(hex.substring(4, 6), 16) || 0;
    document.documentElement.style.setProperty('--accent-glow', `rgba(${r}, ${g}, ${b}, 0.3)`);
    document.documentElement.style.setProperty('--accent-rgb', `${r}, ${g}, ${b}`);

    localStorage.setItem('xp_custom_color', color);

    document.querySelectorAll('.theme-swatch').forEach(s => s.classList.remove('active'));

    const colorPicker = document.getElementById('customColorPicker');
    if (colorPicker) colorPicker.value = color;

    if (showToast && window.Toast) Toast.show('Custom color applied!', 'success', 1500);
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
        const content = document.querySelector('.main-content-area') || document.body;
        content.classList.add('page-transition-out');

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
