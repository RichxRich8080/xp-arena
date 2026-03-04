import { bootApp } from '../modules/core/boot.js';
import { initLayoutShell } from '../modules/ui/layout-shell.js';
import { initLeaderboardFeature } from '../modules/features/leaderboard.js';

bootApp({ init: initLayoutShell });
initLeaderboardFeature();
