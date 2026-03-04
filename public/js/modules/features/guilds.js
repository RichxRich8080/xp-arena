let loaded = false;
export async function initGuildsFeature() {
    if (loaded) return;
    await import('../../guilds.js');
    loaded = true;
}
