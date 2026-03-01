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
            const matches = flatDevices.filter(d => `${d.brand} ${d.series} ${d.model}`.toLowerCase().includes(q)).slice(0, 8);
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
        document.getElementById('compareBtn').disabled = !(devA && devB);
    }

    const getFactorInfo = (d) => {
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

        if (b.includes('rog') || b.includes('redmagic') || b.includes('black shark') || m.includes('gaming') || m.includes('legion') || b.includes('iqoo')) { mult = 1.08; adv = "Elite Gaming Display – Massive natural sensitivity advantage."; score = 95; }
        else if (m.includes('ultra') || m.includes('pro max') || m.includes('fold') || m.includes('flip') || m.includes('pad pro')) { mult = 1.06; adv = "Flagship Touch Sampling – Very reactive screen."; score = 85; }
        else if (m.includes('pro') || m.includes('plus') || m.includes(' s ') || m.includes('pad')) { mult = 1.04; adv = "Premium Display – Smooth and consistently responsive."; score = 75; }
        else if (m.includes('lite') || m.includes(' a') || m.includes(' c') || m.includes('smart') || m.includes('pop')) { mult = 0.95; adv = "Budget Panel – Requires higher in-game settings to compensate."; score = 40; }
        else if (m.includes(' 2 ') || m.includes(' 3 ') || m.includes(' 4 ') || m.includes(' 5 ')) { mult = 0.92; adv = "Legacy Hardware – Noticeable touch delay."; score = 30; }

        return { mult, adv, score, touchSampling: score > 70 ? '240Hz' : '120Hz', latency: score > 70 ? '20ms' : '45ms' };
    };

    document.getElementById('compareBtn').addEventListener('click', () => {
        if (!devA || !devB) return;

        const fA = getFactorInfo(devA);
        const fB = getFactorInfo(devB);

        const buildCard = (d, f, color) => `
            <div class="pulse-card device-result" style="border-top: 4px solid ${color};">
                <div style="display:flex; align-items:center; justify-content:space-between; gap:10px;">
                    <h3 class="clash" style="margin: 0; color: #fff;">${d.label}</h3>
                    <span class="chip-rebirth" style="background: ${color}22; color: ${color}; border-color: ${color}44;">ANALYZED</span>
                </div>
                <p style="color: var(--stardust-muted); font-size: 0.7rem; text-transform: uppercase; letter-spacing: 2px; margin-top: 5px;">${d.series}</p>
                
                <div class="score-display" style="color: ${color}; text-shadow: 0 0 20px ${color}44;">
                    ${f.score}<span style="font-size: 0.8rem; color: var(--stardust-muted); font-weight: 400; margin-left: 10px;">ARENA SCORE</span>
                </div>

                <div class="stat-bar-group">
                    <div class="stat-meta"><span>TOUCH SAMPLING</span> <span>${f.touchSampling}</span></div>
                    <div class="bar-bg"><div class="bar-fill" data-width="${parseInt(f.touchSampling) / 8}%" style="background: ${color};"></div></div>
                </div>

                <div class="stat-bar-group">
                    <div class="stat-meta"><span>INPUT LATENCY</span> <span>${f.latency}</span></div>
                    <div class="bar-bg"><div class="bar-fill" data-width="${100 - parseInt(f.latency)}%" style="background: ${color};"></div></div>
                </div>

                <div class="stat-bar-group">
                    <div class="stat-meta"><span>BOOST FACTOR</span> <span>${f.mult}x</span></div>
                    <div class="bar-bg"><div class="bar-fill" data-width="${f.mult * 60}%" style="background: ${color};"></div></div>
                </div>

                <p style="font-size: 0.8rem; color: var(--stardust-muted); margin-top: 2rem; font-style: italic; line-height: 1.6; border-top: 1px solid var(--glass-border); padding-top: 1.5rem;">
                    "${f.adv}"
                </p>
            </div>
        `;

        const container = document.getElementById('compareCards');
        container.innerHTML = buildCard(devA, fA, '#ff4444') + buildCard(devB, fB, '#00f5ff');

        const winnerBox = document.getElementById('winnerBanner');
        if (fA.score > fB.score) winnerBox.innerHTML = `<h3 class="clash"><i class="fas fa-trophy" style="color:#ff4444;"></i> <span style="color:#ff4444;">${devA.label}</span> DOMINATES THE ARENA</h3>`;
        else if (fB.score > fA.score) winnerBox.innerHTML = `<h3 class="clash"><i class="fas fa-trophy" style="color:#00f5ff;"></i> <span style="color:#00f5ff;">${devB.label}</span> DOMINATES THE ARENA</h3>`;
        else winnerBox.innerHTML = `<h3 class="clash">⚖️ TACTICAL PARITY DETECTED</h3>`;

        // Render mock comments
        const comments = [
            { user: "Areni_X", text: `I switched to ${fA.score > fB.score ? devA.label : devB.label} last month, the drag-headshots feel way more consistent.`, date: "2 days ago" },
            { user: "SensitivityMaster", text: `The ${fA.latency < fB.latency ? devA.label : devB.label} latency is actually noticeable in top-tier scrims.`, date: "1 week ago" }
        ];

        document.getElementById('comparisonComments').innerHTML = comments.map(c => `
            <div class="log-entry" style="padding: 1.5rem;">
                <div style="flex: 1;">
                    <div style="display:flex; justify-content:space-between; margin-bottom: 10px;">
                        <span style="font-weight: 800; color: var(--photon);">@${c.user}</span>
                        <span style="color: var(--stardust-muted); font-size: 0.7rem;">${c.date}</span>
                    </div>
                    <div style="color: #fff; font-size: 0.9rem;">${c.text}</div>
                </div>
            </div>
        `).join('');

        const resultSec = document.getElementById('resultSection');
        resultSec.style.display = 'block';
        setTimeout(() => {
            resultSec.style.opacity = '1';
            resultSec.style.transform = 'translateY(0)';
            document.querySelectorAll('.bar-fill').forEach(bar => {
                bar.style.width = bar.getAttribute('data-width');
            });
        }, 100);

        resultSec.scrollIntoView({ behavior: 'smooth' });
    });
});
