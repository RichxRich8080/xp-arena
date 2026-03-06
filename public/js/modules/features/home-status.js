export async function hydrateHealthStatus() {
    const badge = document.getElementById('apiHealth');
    if (!badge) return;

    try {
        const response = await fetch('/api/health/details', { headers: { Accept: 'application/json' } });
        if (!response.ok) throw new Error('degraded');

        const payload = await response.json();
        const isOk = payload?.status === 'ok';

        badge.classList.toggle('ok', isOk);
        badge.classList.toggle('warn', !isOk);
        badge.textContent = isOk ? 'Operational' : 'Degraded';
        badge.setAttribute('aria-label', `API health is ${badge.textContent}`);
    } catch {
        badge.classList.remove('ok');
        badge.classList.add('warn');
        badge.textContent = 'Unavailable';
        badge.setAttribute('aria-label', 'API health is unavailable');
    }
}
