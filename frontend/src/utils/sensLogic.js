/**
 * Comparison Engine: The "Why" behind the change
 * Analyzes the gap between current and optimal settings to provide coaching.
 */
export const analyzeDifference = (current, optimal) => {
    if (!current) return "Optimizing since no baseline was provided. This setup is built from zero to match your hardware.";

    const diff = optimal - current;
    const absDiff = Math.abs(diff);

    if (absDiff < 2) return "Your current setup is nearly perfect. Fine-tuning will ensure 100% precision.";

    if (diff > 0) {
        if (absDiff > 20) return "Your current sensitivity is extremely low for your hardware. You're likely losing 1v1s because you can't turn fast enough.";
        return "Boosting your sensitivity will allow for more responsive flicks without losing recoil control.";
    } else {
        if (absDiff > 20) return "Your current sensitivity is way too high. This causes unpredictable jitter and missed headshots during long-range fights.";
        return "Lowering your sensitivity slightly will stabilize your crosshair and make your drag-headshots more consistent.";
    }
};

/**
 * Enhanced Sensitivity Calculation with Screen Size (PPI factor)
 */
export const calculateSensitivities = ({ tier, playStyle, handType, screenSize = 6.1 }) => {
    // Base values
    let settings = {
        general: 95,
        redDot: 90,
        scope2x: 85,
        scope4x: 80,
        awmScope: 50,
        freeLook: 70
    };

    // 1. Screen Size Factor (PPI)
    // Larger physical screens (Tablets/Large Phones) need higher sensitivity 
    // to cover the physical distance of the screen with the same thumb travel.
    const screenMult = screenSize > 10 ? 1.4 : (screenSize > 7 ? 1.2 : (screenSize > 6 ? 1.0 : 0.9));

    // 2. Adjust for Device Tier
    const tierMultipliers = {
        "Low-end": 0.85,
        "Mid-range": 1.0,
        "High-end": 1.15,
        "Flagship": 1.25
    };
    const tierMult = tierMultipliers[tier] || 1.0;

    Object.keys(settings).forEach(key => {
        settings[key] *= (tierMult * screenMult);
    });

    // 3. Adjust for Play Style
    if (playStyle === 'Rusher') { settings.general += 15; settings.redDot += 10; }
    if (playStyle === 'Sniper') { settings.general -= 10; settings.scope2x += 5; settings.scope4x += 10; settings.awmScope += 15; }
    if (playStyle === 'Aggressive') { settings.general += 10; settings.freeLook += 10; }

    // 4. Adjust for Hand Type
    const handWeights = { "Two Fingers": 0, "Three Fingers": 5, "Four Fingers": 10, "Five Fingers": 15 };
    settings.general += (handWeights[handType] || 0);

    // 5. Final Polish & Limits
    const finalSettings = {};
    Object.keys(settings).forEach(key => {
        let val = Math.round(settings[key]);
        if (val > 200) val = 200;
        if (val < 0) val = 0;
        finalSettings[key] = val;
    });

    return finalSettings;
};

/**
 * Elite Sensitivity Calculation Engine with Hardware precision
 */
export const calculateEliteSensitivities = ({ dpi, ping, chipset, playStyle, screenSize = 6.1 }) => {
    const dpiFactor = 400 / dpi;
    const screenMult = screenSize > 10 ? 1.4 : (screenSize > 7 ? 1.2 : (screenSize > 6 ? 1.0 : 0.9));

    let settings = {
        general: 95 * dpiFactor * screenMult,
        redDot: 90 * dpiFactor * screenMult,
        scope2x: 85 * dpiFactor * screenMult,
        scope4x: 80 * dpiFactor * screenMult,
        awmScope: 50 * dpiFactor * screenMult,
        freeLook: 70 * dpiFactor * screenMult
    };

    const chipsetMultipliers = { 'S-Tier': 1.1, 'A-Tier': 1.0, 'B-Tier': 0.95, 'C-Tier': 0.85 };
    const chipsetMult = chipsetMultipliers[chipset] || 1.0;
    const pingBonus = ping > 60 ? (ping - 60) * 0.1 : 0;

    Object.keys(settings).forEach(key => {
        settings[key] = (settings[key] * chipsetMult) + pingBonus;
    });

    if (playStyle === 'Rusher') settings.general += 20;
    if (playStyle === 'Sniper') settings.awmScope += 20;

    const finalSettings = {};
    Object.keys(settings).forEach(key => {
        let val = Math.round(settings[key]);
        if (val > 200) val = 200;
        if (val < 0) val = 0;
        finalSettings[key] = val;
    });

    return finalSettings;
};

/**
 * Recoil Mastery Tips Generator
 */
export const getRecoilTips = (playStyle, chipset) => {
    const tips = [
        { title: "Drag Speed", text: "With your chipset, use a medium drag speed for consistent headshots." },
        { title: "DPI Sync", text: "Ensure your system pointer speed is at standard to avoid pixel skipping." }
    ];

    if (chipset === 'C-Tier') {
        tips.push({ title: "Frame Sync", text: "Turn off high-res textures to stabilize recoil patterns during combat." });
    }

    if (playStyle === 'Rusher') {
        tips.push({ title: "Jumpshot", text: "Drag slightly UP-LEFT when jump-shooting for better bullet spread." });
    }

    return tips;
};
