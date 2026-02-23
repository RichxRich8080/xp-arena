/**
 * XP ARENA CONFETTI SYSTEM
 * Simple canvas-based confetti for celebrations.
 */
const Celebration = {
    fire() {
        const canvas = document.createElement('canvas');
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '9999';
        document.body.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth * window.devicePixelRatio;
        canvas.height = window.innerHeight * window.devicePixelRatio;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

        const particles = [];
        const colors = ['#00e5ff', '#ff4d4d', '#bf00ff', '#ffcc00', '#ffffff'];

        for (let i = 0; i < 150; i++) {
            particles.push({
                x: window.innerWidth / 2,
                y: window.innerHeight / 2,
                vx: (Math.random() - 0.5) * 20,
                vy: (Math.random() - 0.5) * 20 - 5,
                color: colors[Math.floor(Math.random() * colors.length)],
                size: Math.random() * 8 + 4,
                rot: Math.random() * 360,
                vrot: Math.random() * 10 - 5,
                opacity: 1
            });
        }

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            let active = false;

            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.5; // Gravity
                p.vx *= 0.98;
                p.rot += p.vrot;
                p.opacity -= 0.01;

                if (p.opacity > 0) {
                    active = true;
                    ctx.save();
                    ctx.translate(p.x, p.y);
                    ctx.rotate(p.rot * Math.PI / 180);
                    ctx.fillStyle = p.color;
                    ctx.globalAlpha = p.opacity;
                    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
                    ctx.restore();
                }
            });

            if (active) {
                requestAnimationFrame(render);
            } else {
                canvas.remove();
            }
        };

        render();
    }
};

window.Celebration = Celebration;
