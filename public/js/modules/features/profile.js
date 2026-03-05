let loaded = false;
export async function initProfileFeature() {
    if (loaded) return;
    await import('../../user.js');
    loaded = true;
}
