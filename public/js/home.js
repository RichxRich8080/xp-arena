(function () {
  const menu = document.getElementById('menu');
  const toggle = document.getElementById('menuToggle');
  const year = document.getElementById('year');
  const healthNode = document.getElementById('apiHealth');

  if (year) year.textContent = String(new Date().getFullYear());

  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      menu.classList.toggle('open');
    });
  }

  async function loadHealth() {
    try {
      const res = await fetch('/api/health/details');
      const data = await res.json();
      if (!healthNode) return;
      const dbOk = data?.checks?.database?.ok;
      const uptime = Math.floor((data.uptimeSeconds || 0) / 60);
      healthNode.textContent = dbOk ? `API + DB healthy · uptime ${uptime}m` : `Partial service · DB unavailable`;
      healthNode.className = `pill ${dbOk ? 'ok' : 'warn'}`;
    } catch (err) {
      if (healthNode) {
        healthNode.textContent = 'Service check unavailable';
        healthNode.className = 'pill warn';
      }
    }
  }

  loadHealth();
})();
