(() => {
  if (document.getElementById('cursor-glow')) return;
  const glow = document.createElement('div');
  glow.id = 'cursor-glow';
  document.body.appendChild(glow);

  const move = (x, y) => {
    glow.style.background = `radial-gradient(420px circle at ${x}px ${y}px, var(--accent-glow), transparent 65%)`;
    document.querySelectorAll('[data-parallax]').forEach(el => {
      const s = parseFloat(el.getAttribute('data-parallax')) || 10;
      const dx = (x / window.innerWidth - 0.5) * s;
      const dy = (y / window.innerHeight - 0.5) * s;
      el.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
    });
  };

  window.addEventListener('mousemove', e => move(e.clientX, e.clientY), { passive: true });
  window.addEventListener('touchmove', e => {
    const t = e.touches[0];
    if (t) move(t.clientX, t.clientY);
  }, { passive: true });
})();
