document.addEventListener('DOMContentLoaded', () => {
    let flatDevices = [];
    if (typeof smartphoneDatabase !== 'undefined') {
        smartphoneDatabase.forEach(brandData => {
            brandData.series.forEach(series => {
                series.models.forEach(model => {
                    const isObj = typeof model === 'object';
                    const name = isObj ? model.name : model;
                    flatDevices.push({
                        brand: brandData.brand,
                        series: series.name,
                        model: name,
                        label: `${brandData.brand} ${name}`,
                        stats: isObj ? model : null
                    });
                });
            });
        });
    }

    let devA = null, devB = null;

    function setupSearch(inputId, suggId, isA) {
        const input = document.getElementById(inputId);
        const sugg = document.getElementById(suggId);

        input.addEventListener('input', () => {
            const q = input.value.trim().toLowerCase();
            if (q.length < 2) { sugg.style.display = 'none'; return; }
            const matches = flatDevices.filter(d => `${d.brand} ${d.series} ${d.model}`.toLowerCase().includes(q)).slice(0, 6);
            if (!matches.length) { sugg.style.display = 'none'; return; }

            sugg.innerHTML = matches.map(d => `<div class="sugg-item" onclick="selectDev('${isA ? 'A' : 'B'}', '${d.label.replace(/'/g, "\\'")}')">${d.label}</div>`).join('');
            sugg.style.display = 'block';
        });

        document.addEventListener('click', e => {
            if (!input.contains(e.target) && !sugg.contains(e.target)) {
                sugg.style.display = 'none';
            }
        });
    }

    window.selectDev = function (side, label) {
        const d = flatDevices.find(x => x.label === label);
        if (side === 'A') { devA = d; document.getElementById('searchA').value = label; document.getElementById('suggA').style.display = 'none'; }
        else { devB = d; document.getElementById('searchB').value = label; document.getElementById('suggB').style.display = 'none'; }
        checkReady();
    };

    setupSearch('searchA', 'suggA', true);
    setupSearch('searchB', 'suggB', false);

    function checkReady() {
        if (devA && devB) {
            document.getElementById('compareBtn').disabled = false;
        } else {
            document.getElementById('compareBtn').disabled = true;
        }
    }

    // Reuse factor calculation logic from app.js to create a tangible visual grade
    const getFactorInfo = (d) => {
        // Use explicit stats if available
        if (d.stats) {
            return {
                mult: (1 + (d.stats.score - 50) / 500).toFixed(2),
                adv: `Elite Hardware: ${d.stats.touchSampling} Touch Sampling / ${d.stats.latency} Latency.`,
                score: d.stats.score,
                touchSampling: d.stats.touchSampling,
                latency: d.stats.latency
            };
        }

        const m = d.model.toLowerCase();
        const b = d.brand.toLowerCase();
        let adv = "Standard response curve.";
        let mult = 1.0;
        let score = 50;

        if (b.includes('rog') || b.includes('redmagic') || b.includes('black shark') || m.includes('gaming') || m.includes('legion') || b.includes('iqoo')) { mult = 1.08; adv = "Elite Gaming Display (144Hz+) – Massive natural sensitivity advantage. Near-zero touch latency."; score = 95; }
        else if (m.includes('ultra') || m.includes('pro max') || m.includes('fold') || m.includes('flip') || m.includes('pad pro')) { mult = 1.06; adv = "Flagship Touch Sampling (240Hz+) – Very reactive screen. Great for flick shots."; score = 85; }
        else if (m.includes('pro') || m.includes('plus') || m.includes(' s ') || m.includes('pad')) { mult = 1.04; adv = "Premium Display – Smooth and consistently responsive. Good drag headshots."; score = 75; }
        else if (m.includes('lite') || m.includes(' a') || m.includes(' c') || m.includes('smart') || m.includes('pop')) { mult = 0.95; adv = "Budget Panel – Requires higher in-game settings to compensate for touch delay."; score = 40; }
        else if (m.includes(' 2 ') || m.includes(' 3 ') || m.includes(' 4 ') || m.includes(' 5 ')) { mult = 0.92; adv = "Legacy Hardware – Noticeable touch delay. Harder to execute consistent flick shots."; score = 30; }

        return { mult, adv, score, touchSampling: score > 70 ? '240Hz' : '120Hz', latency: score > 70 ? '20ms' : '45ms' };
    };

    document.getElementById('compareBtn').addEventListener('click', () => {
        if (!devA || !devB) return;

        const fA = getFactorInfo(devA);
        const fB = getFactorInfo(devB);

        const buildCard = (d, f, color) => `
            <div class="device-card" style="border-top: 4px solid ${color}; position: relative; overflow: hidden;">
                <h3 style="margin: 0 0 5px 0; color: #fff;">${d.label}</h3>
                <p style="color: var(--text-muted); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px;">${d.series}</p>
                
                <div style="font-size: 3rem; font-weight: 900; color: ${color}; margin: 20px 0; text-shadow: 0 0 20px ${color}44;">
                    ${f.score} <span style="font-size: 0.9rem; color: var(--text-muted); font-weight: 400;">ARENA SCORE</span>
                </div>

                <div class="stat-row">
                    <div class="stat-label"><span>TOUCH SAMPLING</span> <span>${f.touchSampling}</span></div>
                    <div class="stat-bar-bg"><div class="stat-bar-fill" style="width: ${parseInt(f.touchSampling) / 8}%; background: ${color};"></div></div>
                </div>

                <div class="stat-row">
                    <div class="stat-label"><span>INPUT LATENCY</span> <span>${f.latency}</span></div>
                    <div class="stat-bar-bg"><div class="stat-bar-fill" style="width: ${100 - parseInt(f.latency)}%; background: ${color};"></div></div>
                </div>

                <div class="stat-row">
                    <div class="stat-label"><span>BOOST FACTOR</span> <span>${f.mult}x</span></div>
                    <div class="stat-bar-bg"><div class="stat-bar-fill" style="width: ${f.mult * 60}%; background: ${color};"></div></div>
                </div>

                <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 1.5rem; font-style: italic; line-height: 1.4;">
                    "${f.adv}"
                </div>
            </div>
        `;

        document.getElementById('compareCards').innerHTML = buildCard(devA, fA, '#ff4d4d') + buildCard(devB, fB, '#00e5ff');

        const winnerBox = document.getElementById('winnerBanner');
        if (fA.score > fB.score) winnerBox.innerHTML = `<i class="fas fa-trophy" style="margin-right:10px;"></i> <span style="color:#ff4d4d;">${devA.label}</span> HAS THE ARENA ADVANTAGE`;
        else if (fB.score > fA.score) winnerBox.innerHTML = `<i class="fas fa-trophy" style="margin-right:10px;"></i> <span style="color:#00e5ff;">${devB.label}</span> HAS THE ARENA ADVANTAGE`;
        else winnerBox.innerHTML = `⚖️ TACTICAL PARITY DETECTED`;

        // Render mock comments
        const comments = [
            { user: "Areni_X", text: `I switched to ${fA.score > fB.score ? devA.label : devB.label} last month, the drag-headshots feel way more consistent.`, date: "2 days ago" },
            { user: "SensitivityMaster", text: `The ${fA.latency < fB.latency ? devA.label : devB.label} latency is actually noticeable in top-tier scrims. Don't sleep on it.`, date: "1 week ago" }
        ];

        document.getElementById('comparisonComments').innerHTML = comments.map(c => `
            <div class="comment-item">
                <div style="display:flex; justify-content:space-between; margin-bottom: 5px;">
                    <span style="font-weight: 800; color: var(--accent);">@${c.user}</span>
                    <span style="color: var(--text-muted); font-size: 0.7rem;">${c.date}</span>
                </div>
                <div style="color: #fff;">${c.text}</div>
            </div>
        `).join('');

        document.getElementById('resultSection').classList.remove('hidden');
        document.getElementById('resultSection').scrollIntoView({ behavior: 'smooth' });
    });
});
