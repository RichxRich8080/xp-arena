document.addEventListener('DOMContentLoaded', () => {
    // --- SERVICE WORKER REGISTRATION ---
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(reg => {
                    if (reg.waiting && window.Toast) {
                        Toast.show('New version ready. Reloading...', 'info', 1500);
                        reg.waiting.postMessage({ type: 'SKIP_WAITING' });
                        setTimeout(() => location.reload(), 1800);
                    }
                    reg.addEventListener('updatefound', () => {
                        const sw = reg.installing;
                        if (!sw) return;
                        sw.addEventListener('statechange', () => {
                            if (sw.state === 'installed' && navigator.serviceWorker.controller && window.Toast) {
                                Toast.show('New version installed. Reloading...', 'info', 1500);
                                setTimeout(() => location.reload(), 1800);
                            }
                        });
                    });
                    navigator.serviceWorker.addEventListener('message', (e) => {
                        if (e.data && e.data.type === 'SW_ACTIVE' && window.Toast) {
                            // no-op toast optional
                        }
                    });
                })
                .catch(() => {});
        });
    }

    // --- PWA INSTALL PROMPT ---
    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;

        if (!localStorage.getItem('xp_pwa_dismissed') && !document.getElementById('pwa-install-banner')) {
            const pwaHTML = `
                <div id="pwa-install-banner" class="fade-in-up" style="position: fixed; bottom: 80px; left: 50%; transform: translateX(-50%); width: 90%; max-width: 400px; background: rgba(11, 15, 23, 0.95); backdrop-filter: blur(10px); border: 1px solid var(--accent); border-radius: 12px; padding: 15px; display: flex; align-items: center; justify-content: space-between; z-index: 1000; box-shadow: 0 4px 20px rgba(0,0,0,0.5);">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <i class="fas fa-download" style="font-size: 1.8rem; color: var(--accent);"></i>
                        <div>
                            <h4 style="margin: 0; color: #fff; font-size: 0.95rem; font-weight: 800;">Install XP Arena</h4>
                            <p style="margin: 0; color: var(--text-muted); font-size: 0.75rem;">Play directly from Home Screen</p>
                        </div>
                    </div>
                    <div style="display: flex; gap: 10px;">
                        <button id="pwa-install-btn" class="btn-primary" style="padding: 0.5rem 1rem; width: auto; font-size: 0.8rem;">Install</button>
                        <button id="pwa-close-btn" style="background: none; border: none; color: var(--text-muted); cursor: pointer; font-size: 1.2rem;"><i class="fas fa-times"></i></button>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', pwaHTML);

            document.getElementById('pwa-install-btn').addEventListener('click', () => {
                deferredPrompt.prompt();
                deferredPrompt.userChoice.then((choiceResult) => {
                    if (choiceResult.outcome === 'accepted') {
                        if (typeof User !== 'undefined' && typeof window.Toast !== 'undefined') {
                            User.addAXP(100, 'App Installed (PWA)');
                        }
                    }
                    deferredPrompt = null;
                    document.getElementById('pwa-install-banner').remove();
                });
            });

            document.getElementById('pwa-close-btn').addEventListener('click', () => {
                localStorage.setItem('xp_pwa_dismissed', '1');
                document.getElementById('pwa-install-banner').remove();
            });
        }
    });

    // --- ANALYTICS HOOKS ---
    window.trackEvent = function (category, action, label) {
        console.log(`[Analytics] ${category} | ${action} | ${label}`);
        if (typeof gtag !== 'undefined') {
            gtag('event', action, { 'event_category': category, 'event_label': label });
        }
    };

    // --- GLOBAL NAVIGATION LOGIC ---
    window.toggleSidebar = function () {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.querySelector('.sidebar-overlay');
        if (sidebar && overlay) {
            sidebar.classList.toggle('active');
            overlay.classList.toggle('active');
        }
    }

    // =============================================
    // --- DEVICE SEARCH BAR (replaces dropdowns) --
    // =============================================
    const deviceSearch = document.getElementById('deviceSearch');
    const deviceSuggestions = document.getElementById('deviceSuggestions');
    const selectedBrandInput = document.getElementById('selectedBrand');
    const selectedSeriesInput = document.getElementById('selectedSeries');
    const selectedModelInput = document.getElementById('selectedModel');
    const selectedDeviceDisplay = document.getElementById('selectedDeviceDisplay');

    let flatDevices = [];
    let selectedDevice = null;

    if (deviceSearch && typeof smartphoneDatabase !== 'undefined') {
        // Flatten the database once
        smartphoneDatabase.forEach(brandData => {
            brandData.series.forEach(series => {
                series.models.forEach(model => {
                    flatDevices.push({
                        brand: brandData.brand,
                        series: series.name,
                        model: model,
                        label: `${brandData.brand} ${model}`,
                        sublabel: series.name
                    });
                });
            });
        });

        deviceSearch.addEventListener('input', () => {
            const query = deviceSearch.value.trim().toLowerCase();
            if (!query || query.length < 2) {
                deviceSuggestions.style.display = 'none';
                return;
            }

            // Fuzzy substring match across brand + model + series
            const matches = flatDevices
                .filter(d => `${d.brand} ${d.series} ${d.model}`.toLowerCase().includes(query))
                .slice(0, 8);

            if (matches.length === 0) {
                deviceSuggestions.innerHTML = `
                    <div style="padding: 1rem; text-align: center; color: var(--text-muted); font-size: 0.85rem;">
                        <i class="fas fa-search-minus" style="font-size: 1.5rem; display: block; margin-bottom: 8px; opacity: 0.5;"></i>
                        No matching devices found.<br>
                        <span style="color: var(--accent); cursor: pointer; font-weight: 700;" onclick="deviceSearch.value='Generic'; deviceSearch.dispatchEvent(new Event('input'))">Try Generic Options?</span>
                    </div>
                `;
                deviceSuggestions.style.display = 'block';
                return;
            }

            deviceSuggestions.innerHTML = matches.map((d, i) => `
                <div class="suggestion-item" data-idx="${i}" onclick="selectDevice(${JSON.stringify(d).replace(/"/g, '&quot;')})">
                    ${d.label}
                    <span>${d.sublabel}</span>
                </div>
            `).join('');
            deviceSuggestions.style.display = 'block';
        });

        document.addEventListener('click', e => {
            if (!deviceSearch.contains(e.target) && !deviceSuggestions.contains(e.target)) {
                deviceSuggestions.style.display = 'none';
            }
        });

        window.selectDevice = function (d) {
            selectedDevice = d;
            deviceSearch.value = d.label;
            selectedDeviceDisplay.textContent = `✅ ${d.brand} • ${d.series} • ${d.model}`;
            selectedBrandInput.value = d.brand;
            selectedSeriesInput.value = d.series;
            selectedModelInput.value = d.model;
            deviceSuggestions.style.display = 'none';
        };
    }

    // =============================
    // --- CALCULATE BUTTON LOGIC --
    // =============================
    const calculateBtn = document.getElementById('calculateBtn');

    if (calculateBtn) {
        const ramSlider = document.getElementById('ramSlider');
        const ramValDisplay = document.getElementById('ramVal');
        const handSelect = document.getElementById('handSelect');
        const speedSelect = document.getElementById('speedSelect');

        if (ramSlider && ramValDisplay) {
            ramSlider.addEventListener('input', () => {
                ramValDisplay.textContent = ramSlider.value;
            });
        }

        const loader = document.getElementById('loader');
        const resultSection = document.getElementById('resultSection');

        const resGeneral = document.getElementById('resGeneral');
        const resRedDot = document.getElementById('resRedDot');
        const res2x = document.getElementById('res2x');
        const res4x = document.getElementById('res4x');
        const res8x = document.getElementById('res8x');

        const copyBtn = document.getElementById('copyBtn');
        const saveVaultBtn = document.getElementById('saveVaultBtn');
        const shareImageBtn = document.getElementById('shareImageBtn');
        const savePresetBtn = document.getElementById('savePresetBtn');

        const getProVerdict = (speed, factor, ram) => {
            if (factor >= 1.08) return "ELITE GAMING RESPONSE: Tuned for high-refresh rate displays and low-latency input.";
            if (speed === 'fast') return "STUNT FLICK OPTIMIZED: High sensitivity ranges for 360-degree awareness and quick flicks.";
            if (speed === 'slow') return "PRECISION SNIPER: Calibrated for micro-adjustments and steady long-range headshots.";
            if (ram >= 12) return "FLAGSHIP SMOOTHNESS: Balanced settings leverage your device's high processing power.";
            return "STABLE PERFORMANCE: Reliable sensitivity for consistent mid-to-long range combat.";
        };

        const getFactor = (brand, series, model) => {
            const b = brand.toLowerCase();
            const s = series.toLowerCase();
            const m = model.toLowerCase();

            if (b.includes('rog') || b.includes('redmagic') || b.includes('black shark') || m.includes('gaming') || m.includes('legion') || b.includes('iqoo')) return 1.08;
            if (m.includes('ultra') || m.includes('pro max') || m.includes('fold') || m.includes('flip')) return 1.06;
            if (m.includes('pro') || m.includes('plus') || m.includes(' s ')) return 1.04;
            if (m.includes('lite') || m.includes(' a') || m.includes(' c') || m.includes('smart') || m.includes('pop')) return 0.95;
            if (m.includes(' 2 ') || m.includes(' 3 ') || m.includes(' 4 ') || m.includes(' 5 ')) return 0.92;

            return 1.0;
        };

        // Track last result for share/save
        let lastResult = null;

        window.loadProPreset = function (proName) {
            const presets = {
                'white444': {
                    name: "White444",
                    device: "Apple iPhone 14 Pro Max",
                    brand: "Apple", series: "iPhone Series", model: "iPhone 14 Pro Max",
                    ram: 6, hand: "fast", speed: "fast",
                    general: "98-100", reddot: "96-100", scope2x: "92-96", scope4x: "88-92", scope8x: "50-55",
                    verdict: "PRO FILE LOADED: White444's signature high-speed iOS sensitivity for instant flick headshots."
                },
                'nobru': {
                    name: "Nobru",
                    device: "Asus ROG Phone 8 Pro",
                    brand: "Asus", series: "ROG Phone Series", model: "ROG Phone 8 Pro",
                    ram: 16, hand: "normal", speed: "medium",
                    general: "90-95", reddot: "88-93", scope2x: "85-90", scope4x: "80-85", scope8x: "45-50",
                    verdict: "PRO FILE LOADED: Nobru's stable Android sensitivity perfect for consistent tournament performance."
                },
                'ruok': {
                    name: "Ruok FF",
                    device: "Apple iPad Pro M2",
                    brand: "Apple", series: "iPad", model: "iPad Pro M2",
                    ram: 8, hand: "fast", speed: "fast",
                    general: "100-100", reddot: "100-100", scope2x: "100-100", scope4x: "95-100", scope8x: "60-65",
                    verdict: "PRO FILE LOADED: Ruok FF's extreme max sensitivity. Requires incredibly precise finger control."
                },
                'vincenzo': {
                    name: "Vincenzo",
                    device: "PC Emulator (BlueStacks 5)",
                    brand: "PC", series: "Emulator", model: "BlueStacks",
                    ram: 16, hand: "normal", speed: "fast",
                    general: "0 (Mouse Custom)", reddot: "85-90", scope2x: "80-85", scope4x: "75-80", scope8x: "40-45",
                    verdict: "PRO FILE LOADED: Vincenzo's PC Emulator settings. Relies on gaming mouse DPI tuning."
                }
            };

            const p = presets[proName];
            if (!p) return;

            if (deviceSearch) {
                deviceSearch.value = p.device;
                selectedDevice = { brand: p.brand, series: p.series, model: p.model, label: p.device };
                if (selectedDeviceDisplay) selectedDeviceDisplay.textContent = `⭐ PRO PRESET: ${p.device}`;
            }

            if (ramSlider && ramValDisplay) {
                ramSlider.value = p.ram;
                ramValDisplay.textContent = p.ram;
            }
            if (handSelect) handSelect.value = p.hand;
            if (speedSelect) speedSelect.value = p.speed;

            calculateBtn.classList.add('hidden');
            if (loader) loader.classList.remove('hidden');
            if (resultSection) resultSection.classList.add('hidden');

            setTimeout(() => {
                resGeneral.textContent = p.general;
                resRedDot.textContent = p.reddot;
                res2x.textContent = p.scope2x;
                res4x.textContent = p.scope4x;
                res8x.textContent = p.scope8x;

                const proVerdictLabel = document.getElementById('proVerdict');
                if (proVerdictLabel) proVerdictLabel.textContent = p.verdict;

                lastResult = {
                    device: p.device,
                    brand: p.brand, series: p.series, model: p.model, ram: p.ram, hand: p.hand, speed: p.speed,
                    general: p.general, reddot: p.reddot, scope2x: p.scope2x, scope4x: p.scope4x, scope8x: p.scope8x,
                    verdict: p.verdict
                };

                if (loader) loader.classList.add('hidden');
                if (resultSection) {
                    resultSection.classList.remove('hidden');
                    resultSection.style.display = 'block';
                }
                calculateBtn.classList.remove('hidden');
                calculateBtn.textContent = "Recalculate";

                if (window.Toast) Toast.show(`${p.name} Pro settings loaded!`, 'success');
                resultSection.scrollIntoView({ behavior: 'smooth' });

            }, 800);
        };

        calculateBtn.addEventListener('click', () => {
            if (!selectedDevice) {
                if (deviceSearch) {
                    deviceSearch.style.borderColor = 'var(--danger)';
                    setTimeout(() => deviceSearch.style.borderColor = '', 2000);
                }
                const originalText = calculateBtn.textContent;
                calculateBtn.textContent = "Please select a device!";
                calculateBtn.style.background = 'var(--danger)';
                setTimeout(() => {
                    calculateBtn.textContent = originalText;
                    calculateBtn.style.background = '';
                }, 2000);
                return;
            }

            const { brand, series, model } = selectedDevice;
            const ram = parseInt(ramSlider ? ramSlider.value : 8);
            const handType = handSelect.value;
            const speedType = speedSelect.value;

            calculateBtn.classList.add('hidden');
            if (loader) loader.classList.remove('hidden');
            resultSection.classList.add('hidden');

            setTimeout(() => {
                let baseGeneral = 95;
                if (ram <= 4) baseGeneral = 99;
                else if (ram <= 6) baseGeneral = 97;
                else baseGeneral = 95;

                const deviceFactor = getFactor(brand, series, model);
                let adjustedSens = baseGeneral;

                if (deviceFactor < 1.0) adjustedSens += (1.0 - deviceFactor) * 20;
                else if (deviceFactor > 1.0) adjustedSens -= (deviceFactor - 1.0) * 10;

                const speedMultipliers = { 'slow': 0.95, 'medium': 1.0, 'fast': 1.02 };
                adjustedSens *= (speedMultipliers[speedType] || 1.0);

                const handMultipliers = { 'hard': 0.98, 'normal': 1.00, 'fast': 1.00, 'gloves': 1.02, 'sweaty': 1.01 };
                adjustedSens *= (handMultipliers[handType] || 1.0);

                if (adjustedSens > 100) adjustedSens = 100;
                if (adjustedSens < 85) adjustedSens = 85;

                let genMin = Math.floor(adjustedSens - 2);
                let genMax = Math.ceil(adjustedSens + 2);
                if (genMax > 100) genMax = 100;

                const calcScope = (baseVal, percentage) => {
                    const center = baseVal * percentage;
                    let min = Math.floor(center - 3);
                    let max = Math.ceil(center + 3);
                    if (max > 100) max = 100;
                    if (min > max) min = max - 5;
                    return `${min}-${max}`;
                };

                const generalRange = `${genMin}-${genMax}`;
                const redDotRange = calcScope(adjustedSens, 0.95);
                const scope2xRange = calcScope(adjustedSens, 0.88);
                const scope4xRange = calcScope(adjustedSens, 0.78);
                const scope8xRange = calcScope(adjustedSens, 0.45);

                resGeneral.textContent = generalRange;
                resRedDot.textContent = redDotRange;
                res2x.textContent = scope2xRange;
                res4x.textContent = scope4xRange;
                res8x.textContent = scope8xRange;

                const proVerdictLabel = document.getElementById('proVerdict');
                if (proVerdictLabel) {
                    proVerdictLabel.textContent = getProVerdict(speedType, deviceFactor, ram);
                }

                // Store last result for sharing/saving
                lastResult = {
                    device: `${brand} ${model}`,
                    brand, series, model, ram, hand: handType, speed: speedType,
                    general: generalRange,
                    reddot: redDotRange,
                    scope2x: scope2xRange,
                    scope4x: scope4xRange,
                    scope8x: scope8xRange,
                    verdict: proVerdictLabel ? proVerdictLabel.textContent : ''
                };

                if (loader) loader.classList.add('hidden');

                if (resultSection) {
                    resultSection.classList.remove('hidden');
                    resultSection.style.display = 'block';
                }

                calculateBtn.classList.remove('hidden');
                calculateBtn.textContent = "Recalculate";

                if (window.Toast) {
                    Toast.show('Sensitivity optimized for your device!', 'success');
                }

                resultSection.scrollIntoView({ behavior: 'smooth' });

                // Award AXP + save history if logged in
                if (typeof User !== 'undefined' && typeof Auth !== 'undefined' && Auth.isLoggedIn()) {
                    const stats = User.getStats();
                    const today = new Date().toDateString();
                    if (stats.lastCalcDate !== today) {
                        User.addAXP(10, 'Sensitivity Calculation');
                        User.updateStats(s => s.lastCalcDate = today);
                    }
                    // Save to sensitivity history
                    User.addSensitivityHistory({ device: lastResult.device, general: generalRange, general_mid: adjustedSens });
                }

                if (window.trackEvent) {
                    window.trackEvent('Tool', 'Calculate', `${brand} ${model}`);
                }
            }, 1200);
        });

        // --- COPY ---
        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                if (!lastResult) return;
                const textToCopy = `XP ARENA PRO SETTINGS:\nDevice: ${lastResult.device}\nGen: ${lastResult.general}\nRed Dot: ${lastResult.reddot}\n2x: ${lastResult.scope2x}\n4x: ${lastResult.scope4x}\n8x: ${lastResult.scope8x}`;
                navigator.clipboard.writeText(textToCopy).then(() => {
                    const originalText = copyBtn.textContent;
                    copyBtn.textContent = "Copied! ✅";
                    if (window.Toast) Toast.show('Settings copied to clipboard!', 'success', 3000);
                    setTimeout(() => { copyBtn.textContent = originalText; }, 2000);
                });
            });
        }

        // --- SAVE TO VAULT ---
        if (saveVaultBtn) {
            saveVaultBtn.addEventListener('click', () => {
                if (typeof User === 'undefined' || !Auth.isLoggedIn()) {
                    if (window.Toast) Toast.show('Log in to save to vault!', 'error');
                    return;
                }
                if (!lastResult) return;
                User.saveToVault(lastResult);
                saveVaultBtn.disabled = true;
                saveVaultBtn.innerHTML = '<i class="fas fa-check"></i> Saved';
                saveVaultBtn.style.opacity = '0.7';
            });
        }

        // --- SAVE PRESET ---
        if (savePresetBtn) {
            savePresetBtn.addEventListener('click', () => {
                if (typeof User === 'undefined' || !Auth.isLoggedIn()) {
                    if (window.Toast) Toast.show('Log in to save presets!', 'error');
                    return;
                }
                if (!lastResult) return;
                const name = prompt('Enter a name for this preset (e.g. "Tournament Mode"):');
                if (!name || name.trim().length === 0) return;
                User.savePreset(name.trim(), lastResult);
            });
        }

        // --- COMMUNITY RATING ---
        const rateUpBtn = document.getElementById('rateUpBtn');
        const rateDownBtn = document.getElementById('rateDownBtn');
        const ratingContainer = document.getElementById('communityRating');

        const handleRating = (type) => {
            if (typeof User === 'undefined' || !Auth.isLoggedIn()) {
                if (window.Toast) Toast.show('Log in to rate settings!', 'error');
                return;
            }
            if (!lastResult) return;
            User.addAXP(20, 'Community Rating Feedback');
            if (ratingContainer) {
                // Animate fade out and text replacement
                ratingContainer.innerHTML = '<div class="fade-in-up" style="color: var(--accent); font-weight: 800; padding: 10px 0;"><i class="fas fa-check-circle" style="font-size: 1.5rem; display: block; margin-bottom: 5px;"></i>Feedback recorded! +20 AXP</div>';
            }
        };

        if (rateUpBtn) rateUpBtn.addEventListener('click', () => handleRating('up'));
        if (rateDownBtn) rateDownBtn.addEventListener('click', () => handleRating('down'));

        // --- SHARE AS IMAGE ---
        if (shareImageBtn) {
            shareImageBtn.addEventListener('click', () => {
                if (!lastResult) return;
                generateShareImage(lastResult);
            });
        }
    }

    // =====================
    // --- HOME PAGE ANIMATIONS ---
    const tickerText = document.getElementById('ticker-text');
    if (tickerText) {
        const messages = [
            "Player AimBot_Pro just reached Master Rank!",
            "New Sensitivity optimized for Samsung S24 Ultra",
            "Regional Tournament starting in 48 hours!",
            "Shadow_Slayer earned 200 AXP today!",
            "Welcome 50 new members to the Arena!"
        ];
        let i = 0;
        setInterval(() => {
            tickerText.style.opacity = 0;
            setTimeout(() => {
                i = (i + 1) % messages.length;
                tickerText.textContent = messages[i];
                tickerText.style.opacity = 1;
            }, 500);
        }, 4000);
    }

    // Home Page Animations
    // (Removed broken countdown timer here that conflicted with leaderboard.js)
});

// =======================================
// --- GENERATE SHARE IMAGE (Canvas) ---
// =======================================
function generateShareImage(result) {
    const canvas = document.createElement('canvas');
    canvas.width = 900;
    canvas.height = 520;
    const ctx = canvas.getContext('2d');

    // Background
    const bg = ctx.createLinearGradient(0, 0, 900, 520);
    bg.addColorStop(0, '#0b0f17');
    bg.addColorStop(1, '#111827');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 900, 520);

    // Accent glow (top-right)
    const glow = ctx.createRadialGradient(750, 60, 10, 750, 60, 220);
    glow.addColorStop(0, 'rgba(0,229,255,0.18)');
    glow.addColorStop(1, 'rgba(0,229,255,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, 900, 520);

    // Border
    ctx.strokeStyle = 'rgba(0,229,255,0.35)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(10, 10, 880, 500, 20);
    ctx.stroke();

    // Brand
    ctx.font = 'bold 28px Inter, sans-serif';
    ctx.fillStyle = '#00e5ff';
    ctx.fillText('XP ARENA', 50, 65);

    ctx.font = '16px Inter, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.fillText('PRO SENSITIVITY CARD', 50, 92);

    // Divider
    ctx.strokeStyle = 'rgba(0,229,255,0.25)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(50, 110);
    ctx.lineTo(850, 110);
    ctx.stroke();

    // Device
    ctx.font = 'bold 26px Inter, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`📱 ${result.device}`, 50, 150);

    // Settings grid
    const settings = [
        { label: 'GENERAL', value: result.general },
        { label: 'RED DOT', value: result.reddot },
        { label: '2X SCOPE', value: result.scope2x },
        { label: '4X SCOPE', value: result.scope4x },
        { label: '8X SCOPE', value: result.scope8x },
    ];

    const colW = 160;
    const startX = 50;
    const startY = 220;

    settings.forEach((s, i) => {
        const x = startX + i * colW;
        // Card bg
        ctx.fillStyle = 'rgba(0,229,255,0.07)';
        ctx.beginPath();
        ctx.roundRect(x, startY, colW - 15, 120, 12);
        ctx.fill();
        // Border
        ctx.strokeStyle = 'rgba(0,229,255,0.25)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(x, startY, colW - 15, 120, 12);
        ctx.stroke();
        // Label
        ctx.font = 'bold 13px Inter, sans-serif';
        ctx.fillStyle = 'rgba(0,229,255,0.7)';
        ctx.fillText(s.label, x + 15, startY + 35);
        // Value
        ctx.font = 'bold 30px Inter, sans-serif';
        ctx.fillStyle = '#00e5ff';
        ctx.fillText(s.value, x + 12, startY + 85);
    });

    // Verdict (bottom)
    if (result.verdict) {
        ctx.font = 'italic 15px Inter, sans-serif';
        ctx.fillStyle = 'rgba(0,229,255,0.7)';
        const maxW = 800;
        const words = result.verdict.split(' ');
        let line = '';
        let y = 390;
        words.forEach(word => {
            const test = line + word + ' ';
            if (ctx.measureText(test).width > maxW && line !== '') {
                ctx.fillText(line, 50, y);
                line = word + ' ';
                y += 22;
            } else {
                line = test;
            }
        });
        ctx.fillText(line, 50, y);
    }

    // Footer
    ctx.font = '14px Inter, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.fillText('xparena.net • Free Fire Sensitivity Tool', 50, 488);
    ctx.fillText(new Date().toLocaleDateString(), 720, 488);

    // Download / Share
    canvas.toBlob(blob => {
        if (navigator.share && navigator.canShare && navigator.canShare({ files: [new File([blob], 'xp-settings.png', { type: 'image/png' })] })) {
            navigator.share({
                title: 'My XP Arena Settings',
                files: [new File([blob], 'xp-settings.png', { type: 'image/png' })]
            });
        } else {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `xparena-${(result.device || 'settings').replace(/\s+/g, '-').toLowerCase()}.png`;
            a.click();
            URL.revokeObjectURL(url);
            if (window.Toast) Toast.show('Image downloaded!', 'success');
        }
    }, 'image/png');
}

async function SubmitManualSetup(payload) {
    if (typeof Auth === 'undefined' || !Auth.isLoggedIn()) return { success: false, message: 'Login required' };
    const cap = v => Math.max(0, Math.min(200, parseInt(v, 10) || 0));
    const body = {
        mode: 'manual',
        general: cap(payload.general),
        reddot: cap(payload.reddot),
        scope2x: cap(payload.scope2x),
        scope4x: cap(payload.scope4x),
        scope8x: cap(payload.scope8x),
        comment: String(payload.comment || '').slice(0, 500),
        is_private: !!payload.is_private
    };
    const res = await fetch((window.API_URL || '') + '/api/setups/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${Auth.getToken()}` },
        body: JSON.stringify(body)
    });
    const data = await res.json();
    if (res.ok) {
        if (window.Toast) Toast.show('Setup submitted +50 AXP', 'success');
        return { success: true, id: data.id };
    }
    if (window.Toast) Toast.show(data.error || 'Error', 'error');
    return { success: false, message: data.error || 'Error' };
}

async function LikeSetup(id) {
    if (typeof Auth === 'undefined' || !Auth.isLoggedIn()) return { success: false, message: 'Login required' };
    const res = await fetch((window.API_URL || '') + `/api/setups/like/${id}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${Auth.getToken()}` }
    });
    const data = await res.json();
    if (res.ok) {
        if (window.Toast) Toast.show('Liked', 'success');
        return { success: true };
    }
    if (window.Toast) Toast.show(data.error || 'Error', 'error');
    return { success: false, message: data.error || 'Error' };
}

async function CopySetup(id) {
    if (typeof Auth === 'undefined' || !Auth.isLoggedIn()) return { success: false, message: 'Login required' };
    const res = await fetch((window.API_URL || '') + `/api/setups/copy/${id}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${Auth.getToken()}` }
    });
    const data = await res.json();
    if (res.ok) {
        if (window.Toast) Toast.show('Copied +20 AXP to owner', 'success');
        return { success: true };
    }
    if (window.Toast) Toast.show(data.error || 'Error', 'error');
    return { success: false, message: data.error || 'Error' };
}
