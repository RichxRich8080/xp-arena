export function applyOverdriveLayer() {
    document.body.classList.add('xp-overdrive');

    const topHeading = document.querySelector('h1');
    if (topHeading) topHeading.classList.add('overdrive-title-glow');

    if (!document.querySelector('.overdrive-status-strip')) {
        const strip = document.createElement('section');
        strip.className = 'overdrive-status-strip';
        strip.innerHTML = `
            <div class="overdrive-node">Mode<b>Owner Build</b></div>
            <div class="overdrive-node">Theme<b>${document.documentElement.style.getPropertyValue('--primary') || 'Adaptive'}</b></div>
            <div class="overdrive-node">Layout<b>Unified</b></div>
            <div class="overdrive-node">Sync<b>Live</b></div>
        `;

        const firstBlock = document.body.firstElementChild;
        if (firstBlock) firstBlock.insertAdjacentElement('afterend', strip);
    }

    if (!document.querySelector('.overdrive-quick-rail')) {
        const rail = document.createElement('nav');
        rail.className = 'overdrive-quick-rail';
        rail.setAttribute('aria-label', 'Overdrive Quick Navigation');
        const links = [
            ['index.html', 'Hub'],
            ['leaderboard.html', 'Leaderboard'],
            ['tournaments.html', 'Tournaments'],
            ['shop.html', 'Shop'],
            ['guilds.html', 'Guilds'],
            ['profile.html', 'Profile']
        ];
        rail.innerHTML = links.map(([href, label]) => `<a href="${href}"><i class="fas fa-circle-notch"></i> ${label}</a>`).join('');
        document.body.appendChild(rail);
    }
}

export function applyAXPShine() {
    const selectors = [
        '.fa-coins',
        '.fa-coin',
        '#shop-balance',
        '.price-tag',
        '[data-axp-balance]'
    ];
    document.querySelectorAll(selectors.join(',')).forEach(el => el.classList.add('axp-shine'));
}
