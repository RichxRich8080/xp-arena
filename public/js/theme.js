/**
 * XP ARENA REBIRTH: Consolidated Theme Engine
 * Manages premium color palettes and persistence.
 */

const ThemeEngine = {
    themes: [
        { name: 'Cyan', color: '#00f5ff', glow: 'rgba(0, 245, 255, 0.3)' },
        { name: 'Emerald', color: '#00ff88', glow: 'rgba(0, 255, 136, 0.3)' },
        { name: 'Ruby', color: '#ff4444', glow: 'rgba(255, 68, 68, 0.3)' },
        { name: 'Amethyst', color: '#bd00ff', glow: 'rgba(189, 0, 255, 0.3)' },
        { name: 'Amber', color: '#ff9d00', glow: 'rgba(255, 157, 0, 0.3)' },
        { name: 'Gold', color: '#ffcc00', glow: 'rgba(255, 204, 0, 0.3)' }
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
                --primary: ${theme.color} !important;
                --primary-glow: ${theme.glow} !important;
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
                                 style="--color: ${t.color}" 
                                 title="${t.name}"></div>
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
