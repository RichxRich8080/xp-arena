let loaded = false;
export async function initTournamentsFeature() {
    if (loaded) return;
    await import('../../app.js');
    loaded = true;
}
