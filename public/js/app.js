// --- PHASE 3: SEO & VISUAL EFFECTS ---
document.addEventListener('DOMContentLoaded', () => {
    updateMetaTitle();
    initFloatEffects();
});

function updateMetaTitle() {
    const page = window.location.pathname.split('/').pop().replace('.html', '') || 'index';
    const titleMap = {
        'index': 'Home',
        'tool': 'Precision Tool',
        'leaderboard': 'Elite Rankings',
        'profile': 'Areni Dossier',
        'shop': 'Supply Armory',
        'guilds': 'Clan Command',
        'daily-login': 'Daily Protocol',
        'mystery': 'DECRYPTING...',
        'premium': 'Ascension Plans'
    };

    let friendlyName = titleMap[page] || page.charAt(0).toUpperCase() + page.slice(1);

    // Dynamic user context in title if logged in
    if (page === 'profile' && typeof Auth !== 'undefined' && Auth.isLoggedIn()) {
        const user = Auth.getCurrentUser();
        friendlyName = `@${user.username} • Profile`;
    }

    document.title = `${friendlyName} • XP ARENA`;
}

function initFloatEffects() {
    // Mouse movement/parallax effect disabled per request
    return;
}

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
                .catch(() => { });
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

        // Robust device retrieval helper
        const getEffectiveDevice = () => {
            if (selectedDevice) return selectedDevice;
            // Fallback to hidden inputs or search bar value
            const b = selectedBrandInput.value;
            const m = selectedModelInput.value;
            const s = selectedSeriesInput.value;
            if (b && m) {
                return { brand: b, model: m, series: s, label: `${b} ${m}` };
            }
            if (deviceSearch.value.trim().length > 2) {
                return { brand: "Generic", model: deviceSearch.value.trim(), series: "Auto-detected", label: deviceSearch.value.trim() };
            }
            return null;
        };

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

            calculateBtn.textContent = "LOADING PRO FILE...";
            calculateBtn.disabled = true;

            setTimeout(() => {
                const resultData = {
                    device: p.device,
                    brand: p.brand, series: p.series, model: p.model, ram: p.ram, hand: p.hand, speed: p.speed,
                    general: p.general, reddot: p.reddot, scope2x: p.scope2x, scope4x: p.scope4x, scope8x: p.scope8x,
                    verdict: p.verdict
                };

                localStorage.setItem('xp_calc_params', JSON.stringify({ device: resultData.device }));
                localStorage.setItem('xp_calc_results', JSON.stringify(resultData));

                if (window.Toast) Toast.show(`${proName.toUpperCase()} Pro settings loaded!`, 'success');

                setTimeout(() => {
                    window.location.href = 'result.html';
                }, 400);

            }, 800);
        };

        calculateBtn.addEventListener('click', () => {
            const currentDevice = getEffectiveDevice();

            if (!currentDevice) {
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

            const { brand, series, model } = currentDevice;
            const ram = parseInt(ramSlider ? ramSlider.value : 8);
            const handType = handSelect.value;
            const speedType = speedSelect.value;

            // Show simple loader before redirect
            calculateBtn.textContent = "PREPARING ENGINES...";
            calculateBtn.disabled = true;

            // --- Calculation Logic (moved here to prepare for result page) ---
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

            // --- DPI SCALING ---
            const dpi = parseInt(document.getElementById('dpiInput')?.value || 800);
            const dpiFactor = 800 / dpi;
            adjustedSens *= dpiFactor;

            // --- AI & DIAGNOSTIC ADJUSTMENTS V2 ---
            let aiSyncStatus = "OPTIMIZED";
            let aiVerdict = "Standard calibration active.";

            if (window.aimAccuracyScore !== undefined) {
                const acc = window.aimAccuracyScore;
                const avgRT = window.aimAvgReactionTime || 600;

                // Accuracy Impact (Stronger)
                if (acc < 50) {
                    adjustedSens -= 5;
                    aiSyncStatus = "AUTO-NERFED";
                    aiVerdict = "High error rate detected. Sensitivity reduced for stability.";
                } else if (acc < 75) {
                    adjustedSens -= 2;
                    aiSyncStatus = "FINE-TUNED";
                    aiVerdict = "Minor instability detected. Precision adjusted.";
                } else if (acc > 92) {
                    adjustedSens += 1.5;
                    aiSyncStatus = "ELITE BOOST";
                    aiVerdict = "Flawless tracking. Speed ceiling raised.";
                }

                // Reaction Time Impact
                if (avgRT < 450) {
                    adjustedSens += 1; // Pro reflexes can handle more speed
                } else if (avgRT > 800) {
                    adjustedSens -= 1; // Slower reflexes need more control
                }
            }

            // Touch Sampling Integration (Estimated)
            const samplingRate = window.estimatedTouchSamplingRate || 120;
            if (samplingRate > 240) adjustedSens -= 1.5;
            else if (samplingRate < 90) adjustedSens += 2.5;

            if (adjustedSens > 200) adjustedSens = 200; // Cap higher for DPI variation
            if (adjustedSens < 10) adjustedSens = 10;

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

            const verdict = getProVerdict(speedType, deviceFactor, ram);

            // Store for result page
            const resultData = {
                device: `${brand} ${model}`,
                brand, series, model, ram, hand: handType, speed: speedType,
                general: generalRange,
                reddot: redDotRange,
                scope2x: scope2xRange,
                scope4x: scope4xRange,
                scope8x: scope8xRange,
                verdict: verdict,
                ai_sync: aiSyncStatus,
                ai_verdict: aiVerdict,
                dpi: dpi
            };

            localStorage.setItem('xp_calc_params', JSON.stringify({ device: resultData.device }));
            localStorage.setItem('xp_calc_results', JSON.stringify(resultData));

            // Track Event
            if (window.trackEvent) {
                window.trackEvent('Tool', 'Calculate', resultData.device);
            }

            // Redirection with a slight delay for "weight"
            setTimeout(() => {
                window.location.href = 'result';
            }, 600);
        });

        // --- AI AIM LAB ENGINE ---
        const AimLab = {
            canvas: null,
            ctx: null,
            targets: [],
            hits: 0,
            misses: 0,
            reactionTimes: [],
            startTime: 0,
            isPlaying: false,
            maxTargets: 15,
            lastTargetTime: 0,
            accuracy: 0,

            init() {
                this.canvas = document.getElementById('aimCanvas');
                if (!this.canvas) return;
                this.ctx = this.canvas.getContext('2d');

                const startBtn = document.getElementById('startAimBtn');
                if (startBtn) {
                    startBtn.addEventListener('click', () => this.startSession());
                }

                this.canvas.addEventListener('mousedown', (e) => this.handleClick(e));
                this.canvas.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    this.handleClick(e.touches[0]);
                });

                // Check premium status for lock
                this.checkLock();
            },

            checkLock() {
                const stats = (typeof User !== 'undefined') ? User.getStats() : null;
                const lockEl = document.getElementById('aimLabLocked');
                if (lockEl) {
                    if (stats && stats.is_premium) {
                        lockEl.classList.add('hidden');
                    } else {
                        lockEl.classList.remove('hidden');
                    }
                }
            },

            startSession() {
                if (this.isPlaying) return;

                const trainerArea = document.getElementById('aimTrainerArea');
                const countdown = document.getElementById('aimCountdown');
                const startBtn = document.getElementById('startAimBtn');
                const aimResult = document.getElementById('aimResult');

                trainerArea.classList.remove('hidden');
                aimResult.classList.add('hidden');
                startBtn.textContent = "TRAINING...";
                startBtn.disabled = true;

                this.hits = 0;
                this.misses = 0;
                this.targets = [];
                this.isPlaying = true;
                this.accuracy = 0;
                this.updateHUD();

                // Countdown sequence
                countdown.classList.remove('hidden');
                let count = 3;
                countdown.textContent = count;

                const timer = setInterval(() => {
                    count--;
                    if (count > 0) {
                        countdown.textContent = count;
                    } else {
                        clearInterval(timer);
                        countdown.classList.add('hidden');
                        this.startTime = Date.now();
                        this.loop();
                    }
                }, 1000);
            },

            spawnTarget() {
                const margin = 20;
                const x = margin + Math.random() * (this.canvas.width - margin * 2);
                const y = margin + Math.random() * (this.canvas.height - margin * 2);
                const radius = 10 + Math.random() * 8;

                this.targets.push({ x, y, r: radius, spawned: Date.now(), life: 1200 });
                this.lastTargetTime = Date.now();
            },

            handleClick(e) {
                if (!this.isPlaying) return;

                const rect = this.canvas.getBoundingClientRect();
                const mouseX = (e.clientX || e.pageX) - rect.left;
                const mouseY = (e.clientY || e.pageY) - rect.top;

                // Scale coordinates if canvas is resized by CSS
                const scaleX = this.canvas.width / rect.width;
                const scaleY = this.canvas.height / rect.height;
                const x = mouseX * scaleX;
                const y = mouseY * scaleY;

                let hitAny = false;
                for (let i = this.targets.length - 1; i >= 0; i--) {
                    const t = this.targets[i];
                    const dist = Math.sqrt((x - t.x) ** 2 + (y - t.y) ** 2);
                    if (dist <= t.r) {
                        const rt = Date.now() - t.spawned;
                        this.reactionTimes.push(rt);
                        this.targets.splice(i, 1);
                        this.hits++;
                        hitAny = true;
                        this.createImpact(t.x, t.y);
                        break;
                    }
                }

                if (!hitAny) this.misses++;
                this.updateHUD();
            },

            updateHUD() {
                const acc = (this.hits + this.misses) === 0 ? 0 : Math.round((this.hits / (this.hits + this.misses)) * 100);
                this.accuracy = acc;
                document.getElementById('aimAcc').textContent = acc + '%';
                document.getElementById('aimHits').textContent = this.hits;
            },

            createImpact(x, y) {
                // Visual feedback
                this.ctx.beginPath();
                this.ctx.arc(x, y, 30, 0, Math.PI * 2);
                this.ctx.strokeStyle = 'rgba(0, 229, 255, 0.5)';
                this.ctx.lineWidth = 2;
                this.ctx.stroke();
            },

            loop() {
                if (!this.isPlaying) return;

                this.ctx.fillStyle = '#0a0a0a';
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

                // Spawn targets
                if (this.targets.length < 3 && Date.now() - this.lastTargetTime > 800) {
                    if (this.hits + this.targets.length < this.maxTargets) {
                        this.spawnTarget();
                    }
                }

                // Draw targets
                const now = Date.now();
                for (let i = this.targets.length - 1; i >= 0; i--) {
                    const t = this.targets[i];
                    const age = now - t.spawned;

                    if (age > t.life) {
                        this.targets.splice(i, 1);
                        this.misses++;
                        this.updateHUD();
                        continue;
                    }

                    // Target Pulse
                    const pulse = Math.sin(age * 0.01) * 3;

                    this.ctx.beginPath();
                    this.ctx.arc(t.x, t.y, t.r + pulse, 0, Math.PI * 2);
                    this.ctx.fillStyle = 'rgba(0, 229, 255, 0.2)';
                    this.ctx.fill();
                    this.ctx.strokeStyle = 'var(--accent)';
                    this.ctx.lineWidth = 2;
                    this.ctx.stroke();

                    // Inner eye
                    this.ctx.beginPath();
                    this.ctx.arc(t.x, t.y, 5, 0, Math.PI * 2);
                    this.ctx.fillStyle = '#fff';
                    this.ctx.fill();
                }

                // Check end condition
                if (this.hits >= 10 || (this.hits + this.misses) >= 20) {
                    this.endSession();
                } else {
                    requestAnimationFrame(() => this.loop());
                }
            },

            endSession() {
                this.isPlaying = false;
                const startBtn = document.getElementById('startAimBtn');
                const aimResult = document.getElementById('aimResult');
                const finalScore = document.getElementById('finalAimScore');

                startBtn.textContent = "TEST AGAIN";
                startBtn.disabled = false;
                aimResult.classList.remove('hidden');
                finalScore.textContent = this.accuracy + '%';

                // Calculate Avg Reaction Time
                const avgRT = this.reactionTimes.length > 0
                    ? Math.round(this.reactionTimes.reduce((a, b) => a + b, 0) / this.reactionTimes.length)
                    : 1000;

                // Save to global for calculator
                window.aimAccuracyScore = this.accuracy;
                window.aimAvgReactionTime = avgRT;

                const statusMsg = document.getElementById('aiStatusMsg');
                if (statusMsg) {
                    if (this.accuracy < 60) {
                        statusMsg.textContent = "Sensitivity instability detected. Recalibrating...";
                        statusMsg.style.color = "var(--danger)";
                    } else if (this.accuracy > 90) {
                        statusMsg.textContent = "Elite precision confirmed. Optimization ready.";
                        statusMsg.style.color = "var(--success)";
                    } else {
                        statusMsg.textContent = "Neural data captured. ready for sync.";
                        statusMsg.style.color = "#ffcc00";
                    }
                }

                if (window.Toast) {
                    Toast.show(`Diagnostics: ${this.accuracy}% Acc | ${avgRT}ms RT`, 'info');
                }
            }
        };

        // Initialize on Load
        document.addEventListener('DOMContentLoaded', () => {
            if (document.getElementById('aimCanvas')) {
                AimLab.init();
            }
        });

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
        let messages = [
            "Areni AimBot_Pro just reached Master Rank!",
            "New Sensitivity optimized for Samsung S24 Ultra",
            "Regional Tournament starting in 48 hours!",
        ];

        async function refreshLiveFeed() {
            try {
                const res = await fetch('/api/activity/live');
                if (res.ok) {
                    const data = await res.json();
                    if (data && data.length > 0) {
                        messages = data.map(a => `${a.username}: ${a.text}`);
                    }
                }
            } catch (e) { console.error('Live feed fetch error:', e); }
        }

        refreshLiveFeed();
        setInterval(refreshLiveFeed, 60000); // refresh every minute

        let i = 0;
        setInterval(() => {
            tickerText.style.opacity = 0;
            setTimeout(() => {
                i = (i + 1) % messages.length;
                tickerText.textContent = messages[i];
                tickerText.style.opacity = 1;
            }, 500);
        }, 5000);
    }

    // Home Page Animations
    // (Removed broken countdown timer here that conflicted with leaderboard.js)
});

// =======================================
// --- GENERATE SHARE IMAGE (Canvas) ---
// =======================================
function generateShareImage(result) {
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1350; // Instagram Portrait size for premium feel
    const ctx = canvas.getContext('2d');

    // --- Background Layer ---
    const bg = ctx.createLinearGradient(0, 0, 0, 1350);
    bg.addColorStop(0, '#06090f');
    bg.addColorStop(0.5, '#0b0f17');
    bg.addColorStop(1, '#06090f');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 1080, 1350);

    // --- Decorative Glows ---
    function drawGlow(x, y, radius, color) {
        const g = ctx.createRadialGradient(x, y, 0, x, y, radius);
        g.addColorStop(0, color);
        g.addColorStop(1, 'transparent');
        ctx.fillStyle = g;
        ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
    }
    drawGlow(1080, 0, 600, 'rgba(0, 229, 255, 0.15)');
    drawGlow(0, 1350, 600, 'rgba(191, 0, 255, 0.1)');

    // --- Main Card Frame ---
    ctx.strokeStyle = 'rgba(0, 229, 255, 0.3)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(60, 60, 960, 1230, 40);
    ctx.stroke();

    // Inner subtle border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(80, 80, 920, 1190, 30);
    ctx.stroke();

    // --- Header ---
    ctx.font = 'bold 46px Inter, sans-serif';
    ctx.fillStyle = '#00e5ff';
    ctx.textAlign = 'center';
    ctx.fillText('XP ARENA', 540, 160);

    ctx.font = '800 24px Inter, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.letterSpacing = '4px';
    ctx.fillText('PRO SENSITIVITY CARD', 540, 200);

    // --- Device Info Box ---
    ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.beginPath();
    ctx.roundRect(140, 260, 800, 180, 20);
    ctx.fill();
    ctx.strokeStyle = 'rgba(0, 229, 255, 0.2)';
    ctx.stroke();

    ctx.font = 'bold 42px Inter, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(result.device || 'Unknown Device', 540, 340);

    ctx.font = '600 22px Inter, sans-serif';
    ctx.fillStyle = 'rgba(0, 229, 255, 0.8)';
    ctx.fillText(`${result.ram || '8'}GB RAM • ${String(result.speed || 'Medium').toUpperCase()} SPEED`, 540, 385);

    // --- Settings Grid ---
    const settings = [
        { label: 'GENERAL', value: result.general },
        { label: 'RED DOT', value: result.reddot },
        { label: '2X SCOPE', value: result.scope2x },
        { label: '4X SCOPE', value: result.scope4x },
        { label: '8X SCOPE', value: result.scope8x || '45-50' },
    ];

    const startY = 520;
    const rowHeight = 130;

    settings.forEach((s, i) => {
        const y = startY + (i * rowHeight);

        // Row Background
        ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
        ctx.beginPath();
        ctx.roundRect(140, y, 800, 100, 15);
        ctx.fill();

        // Label
        ctx.textAlign = 'left';
        ctx.font = '800 22px Inter, sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.fillText(s.label, 180, y + 60);

        // Value
        ctx.textAlign = 'right';
        ctx.font = 'bold 44px Inter, sans-serif';
        ctx.fillStyle = '#00e5ff';
        ctx.shadowBlur = 15;
        ctx.shadowColor = 'rgba(0, 229, 255, 0.5)';
        ctx.fillText(s.value, 900, y + 65);
        ctx.shadowBlur = 0; // reset
    });

    // --- Verdict Area ---
    if (result.verdict) {
        const vY = 1180;
        ctx.textAlign = 'center';
        ctx.font = 'italic 24px Inter, sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';

        // Wrap text
        const maxWidth = 760;
        const words = result.verdict.split(' ');
        let line = '';
        let currY = vY;

        words.forEach(word => {
            const test = line + word + ' ';
            if (ctx.measureText(test).width > maxWidth) {
                ctx.fillText(line, 540, currY);
                line = word + ' ';
                currY += 35;
            } else {
                line = test;
            }
        });
        ctx.fillText(line, 540, currY);
    }

    // --- Footer ---
    ctx.textAlign = 'center';
    ctx.font = '600 20px Inter, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.fillText('GENERATED AT XPARENA.NET', 540, 1260);

    // --- Final Export ---
    canvas.toBlob(blob => {
        const filename = `XP-ARENA-${(result.device || 'Settings').replace(/\s+/g, '-')}.png`;
        const file = new File([blob], filename, { type: 'image/png' });

        if (navigator.share && navigator.canShare({ files: [file] })) {
            navigator.share({
                title: 'My XP Arena Sensitivity',
                text: `Optimized settings for ${result.device}`,
                files: [file]
            }).catch(e => {
                // Fallback to download if share cancelled/failed
                triggerDownload(blob, filename);
            });
        } else {
            triggerDownload(blob, filename);
        }
    }, 'image/png', 1.0);

    function triggerDownload(blob, name) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        if (window.Toast) Toast.show('Premium Card Saved!', 'success');
    }
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
// --- PRO LAB HARDWARE SENSOR ---
const ProLabDiagnostics = {
    touchTimes: [],
    estimatedRate: 120, // Default baseline
    isDetecting: false,

    init() {
        // We listen globally for touch interactions to estimate responsiveness
        window.addEventListener('touchstart', (e) => this.recordTouch(e), { passive: true });
        window.addEventListener('touchmove', (e) => this.recordTouch(e), { passive: true });

        // Initial detection phase
        this.isDetecting = true;
        setTimeout(() => this.calculateRate(), 5000); // Wait for some user interaction
    },

    recordTouch(e) {
        if (!this.isDetecting) return;
        this.touchTimes.push(performance.now());
        if (this.touchTimes.length > 100) this.touchTimes.shift();
    },

    calculateRate() {
        if (this.touchTimes.length < 10) {
            // Not enough data, retry later
            setTimeout(() => this.calculateRate(), 10000);
            return;
        }

        const deltas = [];
        for (let i = 1; i < this.touchTimes.length; i++) {
            const d = this.touchTimes[i] - this.touchTimes[i - 1];
            if (d > 0 && d < 100) deltas.push(d); // Filter out gaps
        }

        if (deltas.length === 0) return;

        const avgDelta = deltas.reduce((a, b) => a + b, 0) / deltas.length;
        this.estimatedRate = Math.round(1000 / avgDelta);

        // Normalise to common rates (60, 90, 120, 180, 240, 300, 360)
        const commonRates = [60, 90, 120, 180, 240, 300, 360, 480];
        this.estimatedRate = commonRates.reduce((prev, curr) =>
            Math.abs(curr - this.estimatedRate) < Math.abs(prev - this.estimatedRate) ? curr : prev
        );

        window.estimatedTouchSamplingRate = this.estimatedRate;
        console.log(`[PRO LAB] Estimated Touch Sampling Rate: ${this.estimatedRate}Hz`);

        // Update UI if on tool page
        const hzDisplay = document.getElementById('hz-display');
        const sensorDot = document.getElementById('sensor-dot');
        if (hzDisplay) {
            hzDisplay.textContent = `${this.estimatedRate}Hz`;
            if (sensorDot) {
                sensorDot.style.background = 'var(--accent)';
                sensorDot.style.animation = 'none';
            }
        }

        // Keep updating occasionally
        this.touchTimes = [];
        setTimeout(() => {
            const dot = document.getElementById('sensor-dot');
            if (dot) {
                dot.style.background = '#ffcc00';
                dot.style.animation = 'pulse 1.5s infinite';
            }
            this.calculateRate();
        }, 30000);
    }
};

// Initialize Diagnostics
document.addEventListener('DOMContentLoaded', () => {
    ProLabDiagnostics.init();
});
