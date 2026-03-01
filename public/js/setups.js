document.addEventListener('DOMContentLoaded', loadSetups);

async function loadSetups() {
  const list = document.getElementById('setupsList');
  if (!list) return;

  try {
    const res = await fetch((window.API_URL || '') + '/api/setups/popular');
    const rows = res.ok ? await res.json() : [];

    if (!rows.length) {
      list.innerHTML = '<div class="pulse-card" style="grid-column: 1/-1; text-align:center; padding: 4rem; opacity: 0.6;"><p>NO ARCHIVES FOUND. BE THE FIRST TO SYNC.</p></div>';
      return;
    }

    list.innerHTML = rows.map(r => {
      const owner = r.username || 'Areni';
      const modeLabel = r.mode === 'manual' ? 'MANUAL' : 'SENS-SYNC';

      return `
                <div class="pulse-card preset-card">
                    <div class="preset-header">
                        <div class="operative-info">
                            <div class="operative-token">${owner.charAt(0).toUpperCase()}</div>
                            <div>
                                <div style="font-family:'Clash Display', sans-serif; font-weight:700; font-size: 1.1rem;">${owner}</div>
                                <span class="protocol-badge">${modeLabel}</span>
                            </div>
                        </div>
                        <div style="font-size: 0.7rem; color: var(--stardust-muted); font-weight: 800;">${new Date(r.created_at || Date.now()).toLocaleDateString()}</div>
                    </div>

                    <div class="stats-matrix">
                        <div class="stat-node">
                            <span class="node-label">GEN</span>
                            <div class="node-val">${r.general}</div>
                        </div>
                        <div class="stat-node">
                            <span class="node-label">RED</span>
                            <div class="node-val">${r.reddot}</div>
                        </div>
                        <div class="stat-node">
                            <span class="node-label">2X</span>
                            <div class="node-val">${r.scope2x}</div>
                        </div>
                        <div class="stat-node">
                            <span class="node-label">4X</span>
                            <div class="node-val">${r.scope4x}</div>
                        </div>
                        <div class="stat-node">
                            <span class="node-label">8X</span>
                            <div class="node-val">${r.scope8x}</div>
                        </div>
                        <div class="stat-node" style="border-color: var(--photon-glow);">
                            <span class="node-label" style="color:var(--photon);">BST</span>
                            <div class="node-val" style="color:var(--photon);">1.0x</div>
                        </div>
                    </div>

                    <div class="preset-comment">"${escapeHtml(r.comment || 'Operational protocol synchronized with the neural grid.')}"</div>

                    <div class="action-dock">
                        <button class="btn-rebirth" style="justify-content: center; font-size: 0.75rem;" onclick="LikeSetup(${r.id})">
                            <i class="fas fa-heart" style="color: #ff4444;"></i> ${r.likes}
                        </button>
                        <button class="btn-rebirth btn-photon" style="justify-content: center; font-size: 0.75rem;" onclick="CopySetup(${r.id})">
                            <i class="fas fa-copy"></i> SYNC ${r.copies}
                        </button>
                    </div>
                </div>
            `;
    }).join('');
  } catch (e) {
    console.error(e);
    list.innerHTML = '<div class="pulse-card" style="grid-column: 1/-1; text-align:center; padding: 4rem; opacity: 0.6;"><p>COMMUNICATION ERROR: NEURAL GRID UNREACHABLE</p></div>';
  }
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, s => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[s]));
}
