document.addEventListener('DOMContentLoaded', loadSetups);

async function loadSetups() {
  const list = document.getElementById('setupsList');
  if (!list) return;
  list.innerHTML = '<div class="form-card" style="text-align:center; padding: 2rem;">Loading...</div>';
  try {
    const res = await fetch((window.API_URL || '') + '/api/setups/popular');
    const rows = res.ok ? await res.json() : [];
    if (!rows.length) {
      list.innerHTML = '<div class="form-card" style="text-align:center; padding: 2rem;">No setups yet. Be the first to submit!</div>';
      return;
    }
    list.innerHTML = rows.map(r => {
      const owner = r.username || 'Player';
      const modeLabel = r.mode === 'manual' ? 'Manual' : 'Auto';
      return `
        <div class="form-card" style="display:grid; grid-template-columns: 1fr auto; gap: 12px; align-items: start;">
          <div>
            <div style="display:flex; gap: 8px; align-items:center;">
              <div style="font-weight:800;">${owner}</div>
              <span style="font-size: 0.7rem; background: rgba(255,255,255,0.06); border:1px solid var(--border); padding: 2px 6px; border-radius: 6px;">${modeLabel}</span>
            </div>
            <div style="display:grid; grid-template-columns: repeat(5, minmax(70px,1fr)); gap: 8px; margin-top: 8px; font-size: 0.85rem;">
              <div>Gen: <b>${r.general}</b></div>
              <div>Red: <b>${r.reddot}</b></div>
              <div>2x: <b>${r.scope2x}</b></div>
              <div>4x: <b>${r.scope4x}</b></div>
              <div>8x: <b>${r.scope8x}</b></div>
            </div>
            <div style="margin-top:8px; color: var(--text-muted); font-size: 0.85rem;">${escapeHtml(r.comment || '')}</div>
          </div>
          <div style="display:flex; flex-direction:column; gap:8px;">
            <button class="btn-secondary" style="width:auto;" onclick="LikeSetup(${r.id})"><i class="fas fa-heart"></i> ${r.likes}</button>
            <button class="btn-secondary" style="width:auto;" onclick="CopySetup(${r.id})"><i class="fas fa-copy"></i> ${r.copies}</button>
          </div>
        </div>
      `;
    }).join('');
  } catch (e) {
    list.innerHTML = '<div class="form-card" style="text-align:center; padding: 2rem;">Failed to load setups.</div>';
  }
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));
}
