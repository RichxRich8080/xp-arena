(async function bootstrapHome() {
    if ('requestIdleCallback' in window) {
        window.requestIdleCallback(() => {
            import('/js/modules/features/home-status.js')
                .then(({ hydrateHealthStatus }) => hydrateHealthStatus())
                .catch(() => null);
        });
    } else {
        try {
            const { hydrateHealthStatus } = await import('/js/modules/features/home-status.js');
            await hydrateHealthStatus();
        } catch {
            // non-critical enhancement
        }
    }
})();
