(function initSiteShell() {
    function setYear() {
        document.querySelectorAll('#year,[data-year]').forEach((node) => {
            node.textContent = String(new Date().getFullYear());
        });
    }

    function enhanceMobileMenu() {
        const toggle = document.querySelector('[data-menu-toggle]') || document.getElementById('menuToggle');
        const menu = document.querySelector('[data-menu]') || document.getElementById('menu');
        if (!toggle || !menu) return;

        const menuId = menu.id || 'site-menu';
        menu.id = menuId;
        toggle.setAttribute('aria-controls', menuId);
        toggle.setAttribute('aria-expanded', 'false');

        const close = () => {
            menu.classList.remove('open');
            toggle.setAttribute('aria-expanded', 'false');
        };

        toggle.addEventListener('click', () => {
            const next = !menu.classList.contains('open');
            menu.classList.toggle('open', next);
            toggle.setAttribute('aria-expanded', String(next));
        });

        menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', close));
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') close();
        });
    }

    function markActiveNav() {
        const path = window.location.pathname.replace(/\/$/, '') || '/';
        document.querySelectorAll('nav a[href]').forEach((link) => {
            const href = link.getAttribute('href');
            if (!href || href.startsWith('#')) return;

            const normalized = href.replace(/\/$/, '');
            if (normalized === path) {
                link.setAttribute('aria-current', 'page');
            }
        });
    }

    function applyImageLoadingDefaults() {
        document.querySelectorAll('img').forEach((img) => {
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
            if (!img.hasAttribute('decoding')) {
                img.setAttribute('decoding', 'async');
            }
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        setYear();
        enhanceMobileMenu();
        markActiveNav();
        applyImageLoadingDefaults();
    });
})();
