document.addEventListener('DOMContentLoaded', () => {
    let flatDevices = [];
    if (typeof smartphoneDatabase !== 'undefined') {
        smartphoneDatabase.forEach(brandData => {
            brandData.series.forEach(series => {
                series.models.forEach(model => {
                    flatDevices.push({ brand: brandData.brand, series: series.name, model: model, label: `${brandData.brand} ${model}` });
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

        return { mult, adv, score };
    };

    document.getElementById('compareBtn').addEventListener('click', () => {
        if (!devA || !devB) return;

        const fA = getFactorInfo(devA);
        const fB = getFactorInfo(devB);

        const buildCard = (d, f, color) => `
            <div class="device-card" style="border-top: 4px solid ${color};">
                <h3 style="margin-bottom: 5px; color: #fff;">${d.label}</h3>
                <p style="color: var(--text-muted); font-size: 0.8rem;">${d.series}</p>
                <div style="font-size: 2.5rem; font-weight: 900; color: ${color}; margin: 15px 0;">${f.score} <span style="font-size: 1rem;">/ 100</span></div>
                <div style="font-size: 0.85rem; font-weight: 700; margin-bottom: 5px;">Natural Screen Edge: ${f.mult}x</div>
                <div style="font-size: 0.8rem; color: var(--text-muted);">${f.adv}</div>
            </div>
        `;

        document.getElementById('compareCards').innerHTML = buildCard(devA, fA, '#ff4d4d') + buildCard(devB, fB, '#00e5ff');

        const winnerBox = document.getElementById('winnerBanner');
        if (fA.score > fB.score) winnerBox.innerHTML = `🏆 <span style="color:#ff4d4d;">${devA.label}</span> has a major hardware advantage for Free Fire!`;
        else if (fB.score > fA.score) winnerBox.innerHTML = `🏆 <span style="color:#00e5ff;">${devB.label}</span> has a major hardware advantage for Free Fire!`;
        else winnerBox.innerHTML = `⚖️ Both devices offer a highly identical hardware experience for Free Fire.`;

        document.getElementById('resultSection').classList.remove('hidden');
        document.getElementById('resultSection').scrollIntoView({ behavior: 'smooth' });
    });
});
