/**
 * XP ARENA REBIRTH: Consolidated Theme Engine
 * Manages premium color palettes and persistence.
 */

const ThemeEngine = {
    performanceModes: ['high', 'balanced', 'low'],

    getCurrentUserId() {
        try {
            const raw = localStorage.getItem('xp_current_user');
            if (!raw) return null;
            const parsed = JSON.parse(raw);
            return parsed?.id || null;
        } catch (e) {
            return null;
        }
    },

    getScopedKey(baseKey) {
        const userId = this.getCurrentUserId();
        return userId ? `${baseKey}_${userId}` : baseKey;
    },

    getPerformanceMode() {
        const scoped = localStorage.getItem(this.getScopedKey('xp_performance_mode'));
        const fallback = localStorage.getItem('xp_performance_mode');
        const mode = scoped || fallback || 'balanced';
        return this.performanceModes.includes(mode) ? mode : 'balanced';
    },

    setPerformanceMode(mode, options = {}) {
        const safeMode = this.performanceModes.includes(mode) ? mode : 'balanced';
        const shouldPersist = options.persist !== false;
        const scopedKey = this.getScopedKey('xp_performance_mode');

        if (shouldPersist) {
            localStorage.setItem(scopedKey, safeMode);
            localStorage.setItem(this.getScopedKey('xp_visual_mode'), safeMode);
        }

        document.documentElement.dataset.performanceMode = safeMode;
        window.dispatchEvent(new CustomEvent('xp:performance-mode-change', { detail: { mode: safeMode } }));
        return safeMode;
    },
    themes: [
        {
            name: 'Agni Assault',
            category: 'Inferno Ranked',
            primary: '#FF5500',
            primaryGlow: 'rgba(255, 85, 0, 0.34)',
            secondary: '#FFB703',
            secondaryGlow: 'rgba(255, 183, 3, 0.3)',
            void: '#090608',
            nebula: 'rgba(24, 12, 8, 0.72)',
            border: 'rgba(255, 122, 64, 0.26)',
            radius: '18px',
            contrast: '#EAFBFF'
        },
        {
            name: 'Neon Circuit',
            category: 'Cyber Arena',
            primary: '#00F5FF',
            primaryGlow: 'rgba(0, 245, 255, 0.32)',
            secondary: '#9B5DE5',
            secondaryGlow: 'rgba(155, 93, 229, 0.3)',
            void: '#05050C',
            nebula: 'rgba(11, 16, 28, 0.72)',
            border: 'rgba(55, 226, 255, 0.22)',
            radius: '20px',
            contrast: '#EAFBFF'
        },
        {
            name: 'Toxic Grid',
            category: 'Stealth Ops',
            primary: '#39FF14',
            primaryGlow: 'rgba(57, 255, 20, 0.3)',
            secondary: '#00FFCC',
            secondaryGlow: 'rgba(0, 255, 204, 0.28)',
            void: '#040907',
            nebula: 'rgba(9, 22, 16, 0.76)',
            border: 'rgba(120, 255, 120, 0.22)',
            radius: '16px',
            contrast: '#F3FFF3'
        },
        {
            name: 'Royal Pulse',
            category: 'Elite Legacy',
            primary: '#8A5CFF',
            primaryGlow: 'rgba(138, 92, 255, 0.34)',
            secondary: '#FFD166',
            secondaryGlow: 'rgba(255, 209, 102, 0.3)',
            void: '#090714',
            nebula: 'rgba(20, 15, 34, 0.74)',
            border: 'rgba(176, 152, 255, 0.24)',
            radius: '22px',
            contrast: '#F5F0FF'
        },
        {
            name: 'Shadow Ember',
            category: 'Dark Tournament',
            primary: '#FF6B6B',
            primaryGlow: 'rgba(255, 107, 107, 0.32)',
            secondary: '#F77F00',
            secondaryGlow: 'rgba(247, 127, 0, 0.3)',
            void: '#08080A',
            nebula: 'rgba(23, 14, 14, 0.74)',
            border: 'rgba(255, 120, 120, 0.22)',
            radius: '18px',
            contrast: '#FFF4F4'
        }
    ],

    init() {
        const saved = localStorage.getItem(this.getScopedKey('xp_rebirth_theme')) || localStorage.getItem('xp_rebirth_theme');
        let current = this.themes[0];

        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                current = this.themes.find(t => t.name === parsed.name) || this.themes[0];
            } catch (e) {
                current = this.themes[0];
            }
        }

        this.setPerformanceMode(this.getPerformanceMode(), { persist: false });
        this.apply(current);
        this.injectCustomizer(current);
    },

    apply(theme) {
        let style = document.getElementById('rebirth-theme-override');
        if (!style) {
            style = document.createElement('style');
            style.id = 'rebirth-theme-override';
            document.head.appendChild(style);
        }

        style.textContent = `
            :root {
                --primary: ${theme.primary} !important;
                --primary-glow: ${theme.primaryGlow} !important;
                --photon: ${theme.primary} !important;
                --photon-glow: ${theme.primaryGlow} !important;
                --secondary: ${theme.secondary} !important;
                --secondary-glow: ${theme.secondaryGlow} !important;
                --corona: ${theme.secondary} !important;
                --corona-glow: ${theme.secondaryGlow} !important;
                --void: ${theme.void} !important;
                --nebula: ${theme.nebula} !important;
                --glass-border: ${theme.border} !important;
                --radius-lg: ${theme.radius || '20px'} !important;
                --theme-text: ${theme.contrast || '#f8fafc'} !important;
            }
        `;

        document.documentElement.setAttribute('data-theme-name', theme.name.toLowerCase().replace(/\s+/g, '-'));
        localStorage.setItem('xp_rebirth_theme', JSON.stringify(theme));
        localStorage.setItem(this.getScopedKey('xp_rebirth_theme'), JSON.stringify(theme));

        // Update UI state
        document.querySelectorAll('.theme-option').forEach(opt => {
            opt.classList.toggle('active', opt.dataset.theme === theme.name);
        });
    },

    injectCustomizer(current) {
        if (document.querySelector('.theme-customizer')) return;

        const html = `
            <div class="theme-customizer">
                <div class="customizer-panel" id="customizerPanel">
                    <div class="customizer-header">
                        <h3 class="clash">THEME COMMAND</h3>
                        <p>Switch full-site gamer skins instantly.</p>
                    </div>
                    <div class="theme-grid">
                        ${this.themes.map(t => `
                            <div class="theme-option ${t.name === current.name ? 'active' : ''}" 
                                 data-theme="${t.name}"
                                 style="--color: ${t.primary}" 
                                 title="${t.name} (${t.category})"></div>
                        `).join('')}
                    </div>
                    <div style="margin-top: 1rem; display: grid; gap: 0.5rem;">
                        <label for="performanceModeSelect" style="font-size: 0.68rem; letter-spacing: 0.08em; color: var(--stardust-muted); text-transform: uppercase;">Performance Mode</label>
                        <select id="performanceModeSelect" class="input-rebirth" style="padding: 0.65rem 0.8rem; font-size: 0.8rem;">
                            <option value="high">High Effects</option>
                            <option value="balanced">Balanced</option>
                            <option value="low">Low Effects</option>
                        </select>
                    </div>
                </div>
                <div class="customizer-toggle" id="themeToggle">
                    <i class="fas fa-palette"></i>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', html);

        const toggle = document.getElementById('themeToggle');
        const panel = document.getElementById('customizerPanel');

        toggle.onclick = (e) => {
            e.stopPropagation();
            panel.classList.toggle('open');
        };

        document.addEventListener('click', (e) => {
            if (panel.classList.contains('open') && !panel.contains(e.target) && e.target !== toggle) {
                panel.classList.remove('open');
            }
        });

        document.querySelectorAll('.theme-option').forEach(opt => {
            opt.onclick = () => {
                const name = opt.dataset.theme;
                const theme = this.themes.find(t => t.name === name);
                if (theme) this.apply(theme);
            };
        });

        const perfSelect = document.getElementById('performanceModeSelect');
        if (perfSelect) {
            perfSelect.value = this.getPerformanceMode();
            perfSelect.addEventListener('change', (e) => {
                this.setPerformanceMode(e.target.value);
                if (window.Toast) Toast.show(`Performance mode: ${e.target.value.toUpperCase()}`, 'info');
            });
        }

        window.addEventListener('xp:performance-mode-change', (event) => {
            if (perfSelect) perfSelect.value = event.detail?.mode || this.getPerformanceMode();
        });
    }
};

window.PreferenceEngine = ThemeEngine;

// Auto-init
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ThemeEngine.init());
} else {
    ThemeEngine.init();
}
