const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function verifyUpdates() {
    console.log('Starting local verification...');
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    const targetUrl = 'file:///Users/S.A/Desktop/xp-arena/public/leaderboard.html';
    console.log(`Navigating to ${targetUrl}`);
    await page.goto(targetUrl, { waitUntil: 'networkidle0' });

    // 1. Snapshot the Leaderboard
    await page.screenshot({ path: '/Users/S.A/Desktop/xp-arena/public/verify_leaderboard.png', fullPage: true });
    console.log('Leaderboard screenshot saved.');

    // 2. Trigger Overlay
    console.log('Triggering Event Overlay...');
    await page.evaluate(() => {
        if (window.EventOverlay && window.EventOverlay.trigger) {
            window.EventOverlay.trigger('AXP_GAIN', 1500, 'Data uplink established.');
        } else {
            console.error('EventOverlay not found on window.');
        }
    });

    // Wait for animation to settle
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: '/Users/S.A/Desktop/xp-arena/public/verify_overlay.png', fullPage: false });
    console.log('Overlay screenshot saved.');

    // 3. Open Drawer
    console.log('Navigating to index and opening drawer...');
    await page.goto('file:///Users/S.A/Desktop/xp-arena/public/index.html', { waitUntil: 'networkidle0' });

    await page.evaluate(() => {
        if (window.toggleSettings) {
            window.toggleSettings();
        }
    });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: '/Users/S.A/Desktop/xp-arena/public/verify_drawer.png', fullPage: false });
    console.log('Drawer screenshot saved.');

    await browser.close();
    console.log('Verification complete.');
}

verifyUpdates().catch(console.error);
