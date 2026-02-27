/**
 * User & AXP System for XP Arena (SQL Backend Sync)
 */

const RANKS = [
    { name: 'Rookie', minAXP: 0, icon: '🆕' },
    { name: 'Grinder', minAXP: 1000, icon: '⚒️' },
    { name: 'Elite', minAXP: 10000, icon: '🔥' },
    { name: 'Champion', minAXP: 50000, icon: '🛡️' },
    { name: 'Legend', minAXP: 100000, icon: '👑', verified: true },
    { name: 'Arena Master', minAXP: 200000, icon: '🏆', verified: true }
];

const ACHIEVEMENTS = [
    { id: 'early_bird', name: 'Early Bird', desc: 'Log in for the first time', icon: '☀️', goal: 1 },
    { id: 'optimizer', name: 'The Optimizer', desc: 'Calculate sensitivity 5 times', icon: '⚙️', goal: 5 },
    { id: 'content_creator', name: 'Content Creator', desc: 'Submit 3 gameplay clips', icon: '🎬', goal: 3 },
    { id: 'supporter', name: 'Community Supporter', desc: 'Visit the support page', icon: '🤝', goal: 1 },
    { id: 'grinder', name: 'Daily Grinder', desc: 'Maintain a 7 day streak', icon: '📅', goal: 7 },
    { id: 'perfect_week', name: 'Perfect Week', desc: 'Claim daily for 7 consecutive days in one week', icon: '✅', goal: 1 },
    { id: 'rising_star', name: 'Rising Star', desc: 'Reach Level 10', icon: '🌟', goal: 10 },
    { id: 'verified_player', name: 'Verified Hero', desc: 'Reach special rank Master or Champion', icon: '✅', goal: 1 },
    { id: 'legendary', name: 'Arena Legend', desc: 'Reach Champion rank', icon: '🏆', goal: 1 }
];

const API_BASE_USER = (typeof window !== 'undefined' && typeof window.API_URL !== 'undefined')
    ? window.API_URL
    : ((location.hostname === 'localhost' || location.hostname === '127.0.0.1') ? 'http://localhost:3000' : '');

const User = {
    async loadStats() {
        if (!Auth.isLoggedIn()) return;
        try {
            const res = await fetch(`${API_BASE_USER}/api/user/profile`, {
                headers: { 'Authorization': `Bearer ${Auth.getToken()}` }
            });
            if (res.ok) {
                const data = await res.json();
                const user = Auth.getCurrentUser();
                if (!user || !data.user) return;

                // Construct the stats object
                const stats = {
                    userId: user.id,
                    axp: data.user.axp || 0,
                    level: Math.floor((data.user.axp || 0) / 500) + 1,
                    avatar: data.user.avatar || '👤',
                    streak: data.user.streak || 0,
                    lastLogin: data.user.last_login,
                    is_premium: !!data.user.is_premium,
                    is_admin: !!data.user.is_admin,
                    last_protocol_date: data.user.last_protocol_date,
                    premium_name_color: data.user.premium_name_color || null,
                    premium_glow: !!data.user.premium_glow,
                    socials: typeof data.user.socials === 'string' ? JSON.parse(data.user.socials) : (data.user.socials || { tiktok: '', instagram: '', youtube: '' }),
                    activities: data.activities || [],
                    vault: data.vault || [],
                    presets: data.presets || [],
                    sensitivityHistory: data.history || [],
                    clips: data.clips || [],
                    achievements: data.achievements || [],
                    badges: [],
                    submissions: (data.clips || []).length,
                    calculations: (data.history || []).length,
                    referralCode: this.generateReferralCode(user.id),
                    referralCount: 0,
                    weeklyQuests: {},
                    axpLog: [],
                    quests: { completed: [], progress: {} }
                };

                localStorage.setItem(`xp_stats_${user.id}`, JSON.stringify(stats));
                this.updateUI();

                // Dispatch event so dependents know stats are fresh
                window.dispatchEvent(new Event('statsLoaded'));
            }
        } catch (e) {
            console.error('Error loading stats from server', e);
            window.dispatchEvent(new Event('statsLoaded')); // Still notify so UI can show "error" or "retry"
        }
    },

    initStats(userId) {
        // Obsolete; initialization handled by backend upon registration
    },

    generateReferralCode(userId) {
        return 'XPA-' + (userId || '').toString().slice(0, 6).toUpperCase();
    },

    getStats() {
        const user = Auth.getCurrentUser();
        if (!user) return null;
        let stats = JSON.parse(localStorage.getItem(`xp_stats_${user.id}`));
        if (stats) {
            stats.rank = this.getCurrentRank(stats.axp);
            if (!stats.clips) stats.clips = [];
            if (!stats.vault) stats.vault = [];
            if (!stats.presets) stats.presets = [];
            if (!stats.sensitivityHistory) stats.sensitivityHistory = [];
            if (!stats.weeklyQuests) stats.weeklyQuests = {};
            if (!stats.axpLog) stats.axpLog = [];
            if (!stats.quests) stats.quests = { completed: [], progress: {} };
            if (!stats.visitedPages) stats.visitedPages = [];
            if (!stats.socials) stats.socials = { tiktok: '', instagram: '', youtube: '' };
        }
        return stats;
    },

    async updateUsername(newUsername) {
        if (newUsername.length < 3) return { success: false, message: 'Username too short' };
        try {
            const res = await fetch(`${API_BASE_USER}/api/user/nickname`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Auth.getToken()}`
                },
                body: JSON.stringify({ newUsername })
            });
            const data = await res.json();
            if (res.ok) {
                // Update local storage token and user object
                localStorage.setItem('xp_token', data.token);
                localStorage.setItem('xp_current_user', JSON.stringify(data.user));

                // Update stats AXP locally if it costed AXP
                if (data.cost > 0) {
                    this.updateStatsLocally(s => s.axp -= data.cost);
                }

                window.dispatchEvent(new Event('authChange'));
                return { success: true };
            } else {
                return { success: false, message: data.error };
            }
        } catch (e) {
            return { success: false, message: 'Network Error' };
        }
    },

    async updatePassword(currentPassword, newPassword) {
        if (newPassword.length < 6) return { success: false, message: 'Password must be at least 6 characters' };
        try {
            const res = await fetch(`${API_BASE_USER}/api/user/password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Auth.getToken()}`
                },
                body: JSON.stringify({ currentPassword, newPassword })
            });
            const data = await res.json();
            if (res.ok) {
                return { success: true };
            } else {
                return { success: false, message: data.error };
            }
        } catch (e) {
            return { success: false, message: 'Network Error' };
        }
    },

    async updateSocials(socials) {
        this.updateStatsLocally(stats => {
            stats.socials = { ...stats.socials, ...socials };
        });
        await fetch(`${API_BASE_USER}/api/user/socials`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Auth.getToken()}`
            },
            body: JSON.stringify({ socials })
        });
        return true;
    },

    async addClip(clipData) {
        this.updateStatsLocally(stats => {
            if (!stats.clips) stats.clips = [];
            stats.clips.unshift({
                id: Date.now(),
                ...clipData,
                timestamp: new Date().toISOString()
            });
            stats.submissions++;
            this.addAXPLocally(50, 'Clip Submission');
            this.logActivityLocally(`Submitted a gameplay clip on ${clipData.device}`);
        });

        await fetchWithRetry(`${API_BASE_USER}/api/user/clip`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Auth.getToken()}`
            },
            body: JSON.stringify(clipData)
        }, () => {});
    },

    async saveToVault(result) {
        this.updateStatsLocally(stats => {
            if (!stats.vault) stats.vault = [];
            stats.vault.unshift({
                id: Date.now(),
                ...result,
                timestamp: new Date().toISOString()
            });
            if (stats.vault.length > 10) stats.vault.pop();
            this.addAXPLocally(20, 'Saved to Vault');
            this.logActivityLocally(`Saved ${result.device} settings to Vault`);
        });

        await fetchWithRetry(`${API_BASE_USER}/api/user/vault`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Auth.getToken()}`
            },
            body: JSON.stringify({ settings: result })
        }, () => {});

        if (window.Toast) Toast.show('Saved to Vault!', 'success');
    },

    async savePreset(name, result) {
        this.updateStatsLocally(stats => {
            if (!stats.presets) stats.presets = [];
            stats.presets = stats.presets.filter(p => p.name !== name);
            stats.presets.unshift({
                id: Date.now(),
                name,
                ...result,
                timestamp: new Date().toISOString()
            });
            if (stats.presets.length > 10) stats.presets.pop();
        });

        await fetchWithRetry(`${API_BASE_USER}/api/user/preset`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Auth.getToken()}`
            },
            body: JSON.stringify({ name, settings: result })
        }, () => {});

        if (window.Toast) Toast.show(`Preset "${name}" saved!`, 'success');
    },

    async addSensitivityHistory(entry) {
        this.updateStatsLocally(stats => {
            if (!stats.sensitivityHistory) stats.sensitivityHistory = [];
            stats.sensitivityHistory.unshift({ ...entry, timestamp: new Date().toISOString() });
            if (stats.sensitivityHistory.length > 20) stats.sensitivityHistory.pop();
            stats.calculations++;
        });

        await fetch(`${API_BASE_USER}/api/user/history`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Auth.getToken()}`
            },
            body: JSON.stringify({ device: entry.device, general_mid: entry.general_mid, general_range: entry.general_range })
        });
    },

    async deleteVault(id) {
        this.updateStatsLocally(stats => {
            stats.vault = (stats.vault || []).filter(v => v.id !== id);
        });
        await fetch(`${API_BASE_USER}/api/user/vault/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${Auth.getToken()}` }
        });
        if (window.Toast) Toast.show('Removed from Vault', 'success');
    },

    async deletePreset(id) {
        this.updateStatsLocally(stats => {
            stats.presets = (stats.presets || []).filter(p => p.id !== id);
        });
        await fetch(`${API_BASE_USER}/api/user/preset/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${Auth.getToken()}` }
        });
        if (window.Toast) Toast.show('Preset deleted', 'success');
    },

    async deleteHistory(id) {
        this.updateStatsLocally(stats => {
            stats.sensitivityHistory = (stats.sensitivityHistory || []).filter(h => h.id !== id);
        });
        await fetch(`${API_BASE_USER}/api/user/history/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${Auth.getToken()}` }
        });
        if (window.Toast) Toast.show('History removed', 'success');
    },

    getCurrentRank(axp) {
        return [...RANKS].reverse().find(r => axp >= r.minAXP) || RANKS[0];
    },

    async updateAvatar(icon) {
        const stats = this.getStats();
        this.addAXPLocally(20, 'First Avatar Selected');
        this.showAXPIncrement(20);
        // NOTE: Server-side AXP for avatar selection is currently not implemented in the backend 
        // for security (preventing spam). Consider adding it to the /avatar endpoint if needed.

        this.updateStatsLocally(s => s.avatar = icon);
        this.updateUI();

        await fetch(`${API_BASE_USER}/api/user/avatar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Auth.getToken()}`
            },
            body: JSON.stringify({ avatar: icon })
        });
    },

    openAvatarModal() {
        const avatars = ['🕹️', '🎮', '🎧', '🎯', '⚔️', '🛡️', '👑', '🔥', '⚡', '💎', '☠️', '👾', '🤖', '🐺', '🐉', '🛰️', '🏆', '🥇', '🎲', '🧠'];
        const icon = prompt(`Select your avatar:\n${avatars.join(' ')}`);
        if (icon && avatars.includes(icon)) {
            this.updateAvatar(icon);
        }
    },

    updateUI() {
        if (!Auth.isLoggedIn()) return;
        const stats = this.getStats();
        const user = Auth.getCurrentUser();
        if (!stats || !user) return;

        const rank = stats.rank;

        const elAvatar = document.getElementById('avatarImage');
        if (elAvatar && stats.avatar) {
            elAvatar.textContent = stats.avatar;
            elAvatar.classList.remove('skeleton', 'skeleton-avatar');
            elAvatar.style.color = 'unset';
            elAvatar.style.background = 'transparent';
        }

        const level = Math.floor(stats.axp / 500) + 1;
        const currentLevelAXP = stats.axp % 500;
        const progressPercent = (currentLevelAXP / 500) * 100;

        const elLevel = document.getElementById('display-level');
        const elAXPLabel = document.getElementById('display-axp-label');
        const elAXPFill = document.getElementById('axp-progress-fill');

        if (elLevel) elLevel.textContent = `Level ${level}`;
        if (elAXPLabel) elAXPLabel.textContent = `${currentLevelAXP} / 500 AXP (Total: ${stats.axp})`;

        if (elAXPFill) {
            setTimeout(() => {
                elAXPFill.style.width = `${progressPercent}%`;
            }, 100);
        }

        const fields = {
            'profile-username': user.username,
            'profile-email': user.email || 'No email provided',
            'profile-axp': stats.axp,
            'profile-rank': rank.name,
            'usernameDisplay': user.username,
            'levelDisplay': `Level ${stats.level}`,
            'axpDisplay': stats.axp,
            'submissionsDisplay': stats.submissions || 0,
            'currentRankName': rank.name
        };

        const animateValue = (obj, start, end, duration) => {
            let startTimestamp = null;
            const step = (timestamp) => {
                if (!startTimestamp) startTimestamp = timestamp;
                const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                // easeOutQuart
                const easeOut = 1 - Math.pow(1 - progress, 4);
                obj.textContent = Math.floor(easeOut * (end - start) + start).toLocaleString();
                if (progress < 1) {
                    window.requestAnimationFrame(step);
                } else {
                    obj.textContent = end.toLocaleString();
                }
            };
            window.requestAnimationFrame(step);
        };

        Object.keys(fields).forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                if (typeof fields[id] === 'number') {
                    const currentVal = parseInt(el.textContent.replace(/,/g, '')) || 0;
                    if (currentVal !== fields[id]) {
                        animateValue(el, currentVal, fields[id], 1500);
                    } else {
                        el.textContent = fields[id].toLocaleString();
                    }
                } else {
                    el.textContent = fields[id];
                }
                el.classList.remove('skeleton', 'skeleton-text', 'short');
            }
        });

        const vBadges = ['v-badge', 'v-badge-top'];
        vBadges.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = rank.verified ? 'inline-block' : 'none';
        });

        this.renderBadges(stats.badges);
    },

    renderBadges(badges) {
        // Simple mock
    },

    showLevelUpCinematic(level, rank) {
        const existing = document.getElementById('xpa-levelup-overlay');
        if (existing) existing.remove();

        const overlay = document.createElement('div');
        overlay.id = 'xpa-levelup-overlay';
        overlay.style.cssText = `
            position: fixed; inset: 0; z-index: 99999;
            display: flex; flex-direction: column;
            align-items: center; justify-content: center;
            background: rgba(0,0,0,0.85);
            backdrop-filter: blur(12px);
            animation: lvlup-in 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards;
        `;
        overlay.innerHTML = `
            <style>
                @keyframes lvlup-in   { from { opacity:0; transform:scale(0.8); } to { opacity:1; transform:scale(1); } }
                @keyframes lvlup-ring { 0%,100% { box-shadow: 0 0 30px 10px var(--accent), 0 0 80px 30px rgba(0,229,255,0.3); } 50% { box-shadow: 0 0 60px 20px #bf00ff, 0 0 120px 60px rgba(191,0,255,0.4); } }
                @keyframes lvlup-badge { 0% { transform:scale(0) rotate(-15deg); opacity:0; } 70% { transform:scale(1.15) rotate(3deg); } 100% { transform:scale(1) rotate(0); opacity:1; } }
            </style>
            <div style="text-align:center; padding: 2.5rem; max-width: 380px; width: 90%;
                background: linear-gradient(135deg, #0b0f17, #111827);
                border: 2px solid var(--accent);
                border-radius: 28px;
                animation: lvlup-ring 2s infinite;">
                <div style="font-size: 0.75rem; letter-spacing: 4px; color: rgba(0,229,255,0.7); text-transform: uppercase; margin-bottom: 0.8rem;">⬆ LEVEL UP</div>
                <div style="font-size: 5rem; line-height:1; animation: lvlup-badge 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.1s both;">${rank.icon}</div>
                <h2 style="font-size: 2.2rem; font-weight: 900; color: #fff; margin: 0.6rem 0 0.2rem; letter-spacing: -0.5px;">LEVEL ${level}</h2>
                <div style="font-size: 1.1rem; color: var(--accent); font-weight: 800; margin-bottom: 1.5rem;">${rank.name}</div>
                <div style="height: 1px; background: rgba(255,255,255,0.1); margin-bottom: 1.5rem;"></div>
                <button onclick="document.getElementById('xpa-levelup-overlay').remove()" style="
                    background: var(--accent); color: #000; border: none;
                    border-radius: 50px; padding: 0.75rem 2.5rem;
                    font-size: 1rem; font-weight: 900; cursor: pointer;
                    letter-spacing: 1px;">KEEP GOING →</button>
            </div>
        `;
        document.body.appendChild(overlay);
        setTimeout(() => { if (overlay.parentNode) overlay.remove(); }, 5000);
    },

    showAXPIncrement(amount) {
        const popup = document.createElement('div');
        popup.className = 'axp-increment-popup';
        popup.textContent = `+${amount} AXP`;
        popup.style.left = `${50 + (Math.random() * 20 - 10)}%`;
        popup.style.top = `${50 + (Math.random() * 20 - 10)}%`;
        document.body.appendChild(popup);
        setTimeout(() => popup.remove(), 1500);
    },

    updateStatsLocally(updater) {
        const user = Auth.getCurrentUser();
        if (!user) return;

        let stats = this.getStats();
        if (!stats) return;

        const oldLevel = Math.floor(stats.axp / 500) + 1;
        updater(stats);

        const newLevel = Math.floor(stats.axp / 500) + 1;
        if (newLevel > oldLevel) {
            stats.level = newLevel;
            const rank = this.getCurrentRank(stats.axp);
            setTimeout(() => this.showLevelUpCinematic(newLevel, rank), 300);
            if (window.Celebration) Celebration.fire();
        }

        localStorage.setItem(`xp_stats_${user.id}`, JSON.stringify(stats));
        this.checkAchievements(stats);
        window.dispatchEvent(new Event('statsChange'));
    },

    logActivityLocally(text) {
        this.updateStatsLocally(stats => {
            if (!stats.activities) stats.activities = [];
            stats.activities.unshift({ text, timestamp: new Date().toISOString() });
            if (stats.activities.length > 20) stats.activities.pop();
        });
    },

    checkAchievements(stats) {
        let unlockedNew = false;
        ACHIEVEMENTS.forEach(ach => {
            if (stats.achievements.includes(ach.id)) return;

            let reached = false;
            if (ach.id === 'early_bird') reached = true;
            if (ach.id === 'optimizer' && stats.calculations >= ach.goal) reached = true;
            if (ach.id === 'content_creator' && stats.submissions >= ach.goal) reached = true;
            if (ach.id === 'grinder' && stats.streak >= ach.goal) reached = true;
            if (ach.id === 'rising_star' && stats.level >= ach.goal) reached = true;
            if (ach.id === 'verified_player' && stats.rank.minAXP >= 90000) reached = true;
            if (ach.id === 'legendary' && stats.rank.minAXP >= 100000) reached = true;
            if (ach.id === 'supporter' && localStorage.getItem('xp_visited_support')) reached = true;

            if (reached) {
                stats.achievements.push(ach.id);
                unlockedNew = true;
                if (window.Toast) {
                    Toast.show(`Achievement Unlocked: ${ach.name}! ${ach.icon}`, 'success', 5000);
                }
                if (window.Celebration) Celebration.fire();
                this.addAXP(100, `Achievement: ${ach.name}`);
            }
        });

        if (unlockedNew) {
            const user = Auth.getCurrentUser();
            localStorage.setItem(`xp_stats_${user.id}`, JSON.stringify(stats));
        }
    },

    addAXPLocally(amount, reason) {
        this.updateStatsLocally(stats => {
            stats.axp += amount;
            if (window.Toast) {
                Toast.show(`+${amount} AXP: ${reason}`, 'xp', 2000);
            }
        });
    },

    async addAXP(amount, reason) {
        // Award locally for immediate UI feedback
        this.addAXPLocally(amount, reason);
        if (reason) this.logActivityLocally(reason);

        // NOTE: Generic /api/user/axp endpoint removed for security.
        // Backend now handles AXP awarding during specific action endpoints.
    },

    async claimDailyLogin() {
        if (!Auth.isLoggedIn()) return { success: false, message: 'Login required' };
        const res = await fetch(`${API_BASE_USER}/api/user/daily-login`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${Auth.getToken()}` }
        });
        const data = await res.json();
        if (res.ok) {
            this.addAXPLocally(data.axp, 'Daily login');
            this.updateStatsLocally(s => { s.streak = data.streak; s.lastLogin = data.date; });
            return { success: true };
        }
        return { success: false, message: data.error || 'Error' };
    },

    async activateXPDoubler(hours = 24) {
        if (!Auth.isLoggedIn()) return { success: false, message: 'Login required' };
        const res = await fetch(`${API_BASE_USER}/api/user/xp-doubler/activate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${Auth.getToken()}` },
            body: JSON.stringify({ hours })
        });
        const data = await res.json();
        if (res.ok) {
            this.logActivityLocally('XP doubler activated');
            return { success: true, until: data.until };
        }
        return { success: false, message: data.error || 'Error' };
    }
};

window.User = User;
window.RANKS = RANKS;

// ==========================
// OFFLINE RETRY QUEUE
// ==========================
function getQueue() {
    try {
        return JSON.parse(localStorage.getItem('xp_offline_queue') || '[]');
    } catch { return []; }
}
function setQueue(arr) {
    localStorage.setItem('xp_offline_queue', JSON.stringify(arr));
}
async function flushOfflineQueue() {
    const q = getQueue();
    if (!q.length) return;
    const remaining = [];
    for (const item of q) {
        try {
            const res = await fetch(item.url, item.options);
            if (!res.ok) throw new Error('HTTP ' + res.status);
        } catch (_) {
            remaining.push(item);
        }
    }
    setQueue(remaining);
}
async function fetchWithRetry(url, options, onSuccess) {
    try {
        const res = await fetch(url, options);
        if (res && res.ok) {
            if (onSuccess) onSuccess(await res.json().catch(() => null));
            return true;
        }
        throw new Error('HTTP ' + (res ? res.status : ''));
    } catch (e) {
        const queued = getQueue();
        queued.push({ url, options });
        setQueue(queued);
        window.addEventListener('online', flushOfflineQueue, { once: true });
        return false;
    }
}
window.flushOfflineQueue = flushOfflineQueue;
if (navigator.onLine) setTimeout(flushOfflineQueue, 2000);
window.addEventListener('online', flushOfflineQueue);

// ==========================
// SEASONAL BATTLE PASS SYSTEM
// ==========================
const SeasonSystem = {
    getSeasonInfo() {
        const seasonStart = new Date('2026-02-01').getTime();
        const duration = 30 * 24 * 60 * 60 * 1000; // 30 days
        const now = Date.now();
        const elapsed = now - seasonStart;
        const daysLeft = Math.max(0, Math.round((duration - elapsed) / (24 * 60 * 60 * 1000)));

        const stats = User.getStats();
        const seasonAXP = stats ? stats.axp % 10000 : 0; // Each season reset baseline mockup
        const level = Math.floor(seasonAXP / 200) + 1;
        const progress = (seasonAXP % 200) / 2; // percentage to next level

        return {
            name: 'Season 1: Neon Dawn',
            daysLeft,
            level,
            progress,
            isPremium: stats ? stats.is_premium : false
        };
    }
};
window.SeasonSystem = SeasonSystem;

// ==========================
// SOCIAL & COMMUNITY SYSTEM
// ==========================
const SocialSystem = {
    async followCreator(creatorId) {
        if (!Auth.isLoggedIn()) return { success: false, message: 'Login required' };

        try {
            const res = await fetch(`${API_BASE_USER}/api/user/follow/${creatorId}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${Auth.getToken()}` }
            });
            if (res.ok) {
                if (window.Toast) Toast.show('Following Areni!', 'success');
                User.logActivityLocally(`Started following creator #${creatorId}`);
                return { success: true };
            }
        } catch (e) { console.error(e); }
        return { success: false };
    },

    async rateSetup(setupId, rating) {
        if (!Auth.isLoggedIn()) return { success: false, message: 'Login required' };
        // Mock rating logic
        if (window.Toast) Toast.show(`Rated setting: ${rating} Stars`, 'success');
        User.addAXP(10, 'Rated a community setup');
        return { success: true };
    }
};
window.SocialSystem = SocialSystem;

// Async Load Data On Initializing
window.addEventListener('authChange', () => {
    if (Auth.isLoggedIn()) {
        User.loadStats();
    }
});

if (Auth.isLoggedIn()) {
    User.loadStats();
}
