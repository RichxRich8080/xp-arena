/**
 * XP ARENA REBIRTH: Consolidated Theme Engine
 * Manages premium color palettes and persistence.
 */

const ThemeEngine = {
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
            border: 'rgba(255, 122, 64, 0.26)'
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
            border: 'rgba(55, 226, 255, 0.22)'
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
            border: 'rgba(120, 255, 120, 0.22)'
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
            border: 'rgba(176, 152, 255, 0.24)'
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
            border: 'rgba(255, 120, 120, 0.22)'
        }
    ],

    init() {
        const saved = localStorage.getItem('xp_rebirth_theme');
        let current = this.themes[0];

        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                current = this.themes.find(t => t.name === parsed.name) || this.themes[0];
            } catch (e) {
                current = this.themes[0];
            }
        }

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
            }
        `;

        localStorage.setItem('xp_rebirth_theme', JSON.stringify(theme));

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
                        <h3 class="clash">PERSONALIZATION</h3>
                        <p>Adjust your neural overlay.</p>
                    </div>
                    <div class="theme-grid">
                        ${this.themes.map(t => `
                            <div class="theme-option ${t.name === current.name ? 'active' : ''}" 
                                 data-theme="${t.name}"
                                 style="--color: ${t.primary}" 
                                 title="${t.name} (${t.category})"></div>
                        `).join('')}
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
    }
};

// Auto-init
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ThemeEngine.init());
} else {
    ThemeEngine.init();
}
