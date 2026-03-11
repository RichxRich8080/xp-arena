/**
 * XP ARENA SFX ENGINE
 * Synthesizes sounds using Web Audio API
 */

export const SFX = {
    ctx: null,

    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
    },

    play(type) {
        try {
            this.init();
            if (this.ctx.state === 'suspended') {
                this.ctx.resume();
            }

            switch (type) {
                case 'click': this.playClick(); break;
                case 'xp': this.playXP(); break;
                case 'level_up': this.playLevelUp(); break;
                case 'achievement': this.playAchievement(); break;
                case 'reveal': this.playReveal(); break;
                default: break;
            }
        } catch (e) {
            console.warn('SFX Error:', e);
        }
    },

    playClick() {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.1);
    },

    playXP() {
        [600, 800].forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime + (i * 0.05));
            gain.gain.setValueAtTime(0.05, this.ctx.currentTime + (i * 0.05));
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + (i * 0.05) + 0.2);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(this.ctx.currentTime + (i * 0.05));
            osc.stop(this.ctx.currentTime + (i * 0.05) + 0.2);
        });
    },

    playLevelUp() {
        const notes = [440, 554, 659, 880];
        notes.forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime + (i * 0.1));
            gain.gain.setValueAtTime(0.1, this.ctx.currentTime + (i * 0.1));
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + (i * 0.1) + 0.5);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(this.ctx.currentTime + (i * 0.1));
            osc.stop(this.ctx.currentTime + (i * 0.1) + 0.5);
        });
    },

    playAchievement() {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523, this.ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(1046, this.ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.4);
    },

    playReveal() {
        // High frequency shimmering reveal sound
        const duration = 0.8;
        const count = 5;
        for (let i = 0; i < count; i++) {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            const freq = 1000 + (Math.random() * 2000);
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime + (i * 0.05));
            gain.gain.setValueAtTime(0.02, this.ctx.currentTime + (i * 0.05));
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + (i * 0.05) + (duration / 2));
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(this.ctx.currentTime + (i * 0.05));
            osc.stop(this.ctx.currentTime + (i * 0.05) + duration);
        }
    }
};
