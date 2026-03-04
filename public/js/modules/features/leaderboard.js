let loaded = false;

export async function initLeaderboardFeature() {
    if (!loaded) {
        await import('../../leaderboard.js');
        loaded = true;
    }

    if (window.XPArena?.features?.leaderboard?.init) {
        window.XPArena.features.leaderboard.init();
    }
}
