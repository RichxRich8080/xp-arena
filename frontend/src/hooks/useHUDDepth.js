import { useEffect, useRef } from 'react';

// Maps to initHUDDepth() specification
export const useHUDDepth = (intensity = 15) => {
    const ref = useRef(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const handleMouseMove = (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -intensity;
            const rotateY = ((x - centerX) / centerX) * intensity;

            el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        };

        const handleMouseLeave = () => {
            el.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
        };

        el.addEventListener('mousemove', handleMouseMove);
        el.addEventListener('mouseleave', handleMouseLeave);

        // Attempt deviceorientation for mobile parallax (Requires HTTPS/Permissions in modern browsers)
        const handleOrientation = (e) => {
            const rotateX = Math.min(Math.max((e.beta - 45) / 2, -15), 15);
            const rotateY = Math.min(Math.max(e.gamma / 2, -15), 15);
            el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        };
        window.addEventListener('deviceorientation', handleOrientation);

        return () => {
            el.removeEventListener('mousemove', handleMouseMove);
            el.removeEventListener('mouseleave', handleMouseLeave);
            window.removeEventListener('deviceorientation', handleOrientation);
        };
    }, [intensity]);

    return ref;
};
