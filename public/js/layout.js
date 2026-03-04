/**
 * Backward-compatible adapter for legacy pages.
 * Delegates layout initialization to module-based bootstrapping.
 */

(function layoutAdapter() {
    const run = async () => {
        const [{ bootApp }, layout] = await Promise.all([
            import('./modules/core/boot.js'),
            import('./modules/ui/layout-shell.js')
        ]);

        window.XPArena = window.XPArena || {};
        window.XPArena.ui = window.XPArena.ui || {};
        window.XPArena.ui.layout = {
            ...(window.XPArena.ui.layout || {}),
            initLayoutShell: layout.initLayoutShell
        };

        bootApp({ init: layout.initLayoutShell });
    };

    run().catch((error) => {
        console.error('[layout adapter] Failed to initialize module layout shell', error);
    });
})();
