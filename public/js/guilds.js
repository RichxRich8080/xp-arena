/**
 * Clan (Guild) System for XP Arena REBIRTH
 * This handles clan creation, joining, and management.
 */

const Clan = {
    async init() {
        this.renderSkeletons();
        await this.loadLeaderboard();
        if (Auth.isLoggedIn()) {
            await this.syncUserClan();
        }
    },

    renderSkeletons() {
        const el = document.getElementById('guildLeaderboard');
        if (!el) return;
        el.innerHTML = Array(4).fill(0).map(() => `
            <div class="pulse-card mission-card skeleton-module" style="height: 100px; margin-bottom: 1rem; opacity: 0.4;"></div>
        `).join('');
    },

    async syncUserClan() {
        try {
            const res = await fetch((window.API_URL || '') + '/api/user/profile', {
                headers: { 'Authorization': 'Bearer ' + Auth.getToken() }
            });
            if (res.ok) {
                const data = await res.json();
                const clan = data.guild;
                this.renderUI(clan);
            }
        } catch (e) { }
    },

    renderUI(clan) {
        const createBlock = document.getElementById('createBlock');
        const joinBlock = document.getElementById('joinBlock');
        const manageBlock = document.getElementById('manageBlock');
        const homeBlock = document.getElementById('homeBlock');

        if (clan) {
            if (createBlock) createBlock.style.display = 'none';
            if (joinBlock) joinBlock.style.display = 'none';
            if (manageBlock) {
                manageBlock.style.display = 'block';
                const nameEl = document.getElementById('activeGuildName');
                if (nameEl) nameEl.textContent = (clan.badge ? clan.badge + ' ' : '') + clan.name;
                const idInput = document.getElementById('guildBadgeId');
                if (idInput) idInput.value = clan.id;
                this.loadMembers(clan.id);
            }
            if (homeBlock) {
                homeBlock.style.display = 'block';
                const badgeEl = document.getElementById('homeBadge');
                if (badgeEl) badgeEl.textContent = clan.badge || '🛡️';
                const homeNameEl = document.getElementById('homeName');
                if (homeNameEl) homeNameEl.textContent = clan.name;

                this.updateHomeStats(clan.id);
                const inv = document.getElementById('guildInviteCode');
                if (inv) inv.value = 'G' + clan.id;
            }
        } else {
            if (createBlock) createBlock.style.display = '';
            if (joinBlock) joinBlock.style.display = '';
            if (manageBlock) manageBlock.style.display = 'none';
            if (homeBlock) homeBlock.style.display = 'none';
        }
    },

    async updateHomeStats(clanId) {
        try {
            const res = await fetch((window.API_URL || '') + '/api/guilds/members?guild_id=' + clanId, {
                headers: { 'Authorization': 'Bearer ' + Auth.getToken() }
            });
            if (res.ok) {
                const members = await res.json();
                const totalAXP = members.reduce((sum, m) => sum + (m.axp || 0), 0);
                const statsEl = document.getElementById('homeStats');
                if (statsEl) statsEl.textContent = `Operatives: ${members.length} • Matrix Power: ${totalAXP.toLocaleString()} AXP`;
            }
        } catch { }
    },

    async create(name) {
        if (!name) return;
        try {
            const res = await fetch((window.API_URL || '') + '/api/guilds/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + Auth.getToken()
                },
                body: JSON.stringify({ name })
            });
            const data = await res.json();
            if (res.ok) {
                if (window.Toast) Toast.show('Clan Initialized!', 'success');
                await User.loadStats();
                this.syncUserClan();
                this.loadLeaderboard();
            }
        } catch (e) { }
    },

    async join(guildId, inviteCode) {
        let gid = guildId;
        if (!gid && inviteCode) {
            const m = inviteCode.match(/G(\d+)/i) || inviteCode.match(/(\d+)/);
            if (m) gid = parseInt(m[1], 10);
        }
        if (!gid) return;

        try {
            const res = await fetch((window.API_URL || '') + '/api/guilds/join', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + Auth.getToken()
                },
                body: JSON.stringify({ guild_id: gid })
            });
            const data = await res.json();
            if (res.ok) {
                if (window.Toast) Toast.show('Deployment Successful!', 'success');
                await User.loadStats();
                this.syncUserClan();
                this.loadLeaderboard();
            }
        } catch (e) { }
    },

    async leave() {
        if (!confirm("Confirm abandonment of current operational position?")) return;
        try {
            const res = await fetch((window.API_URL || '') + '/api/guilds/leave', {
                method: 'POST',
                headers: { 'Authorization': 'Bearer ' + Auth.getToken() }
            });
            if (res.ok) {
                if (window.Toast) Toast.show('Position Abandoned.', 'info');
                await User.loadStats();
                this.syncUserClan();
                this.loadLeaderboard();
            }
        } catch (e) { }
    },

    async loadLeaderboard() {
        const el = document.getElementById('guildLeaderboard');
        if (!el) return;
        try {
            const res = await fetch((window.API_URL || '') + '/api/guilds/leaderboard');
            if (res.ok) {
                const rows = await res.json();
                el.innerHTML = rows.map((g, i) => {
                    const safeName = DOM.escape(g.name);
                    const safeBadge = g.badge ? DOM.escape(g.badge) : '';
                    const rank = i + 1;
                    const isTop3 = rank <= 3;

                    return `
                        <div class="pulse-card mission-card clan-tactical-row" style="display: grid; grid-template-columns: 80px 1fr auto; align-items: center; gap: 2rem; margin-bottom: 1.2rem; padding: 1.5rem 2rem; border-left: 4px solid ${isTop3 ? 'var(--photon)' : 'var(--glass-border)'}; background: rgba(255,255,255,0.01); transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1); position: relative; overflow: hidden;">
                            ${isTop3 ? `<div class="top-rank-glow" style="position: absolute; inset: 0; background: linear-gradient(90deg, var(--photon-glow), transparent 30%); opacity: 0.1; pointer-events: none;"></div>` : ''}
                            
                            <div class="clash" style="font-size: 2rem; color: ${isTop3 ? 'var(--photon)' : 'var(--stardust-muted)'}; opacity: ${isTop3 ? '1' : '0.4'}; text-shadow: ${isTop3 ? '0 0 10px var(--photon-glow)' : 'none'};">
                                ${rank.toString().padStart(2, '0')}
                            </div>

                            <div style="position: relative; z-index: 2;">
                                <div style="display: flex; align-items: center; gap: 1rem;">
                                    <div class="clan-badge-mini" style="font-size: 1.5rem; filter: drop-shadow(0 0 5px rgba(255,255,255,0.2));">${safeBadge || '🛡️'}</div>
                                    <div class="clash" style="font-size: 1.4rem; color: var(--stardust); letter-spacing: 2px; text-shadow: 0 0 15px rgba(255,255,255,0.1);">${safeName.toUpperCase()}</div>
                                    ${isTop3 ? `<span class="section-label" style="font-size: 0.5rem; padding: 2px 6px; background: rgba(0,245,255,0.1); color: var(--photon); border: 1px solid var(--photon); border-radius: 4px; letter-spacing: 1px;">ELITE_SQUAD</span>` : ''}
                                </div>
                                <div style="font-size: 0.7rem; color: var(--stardust-muted); text-transform: uppercase; letter-spacing: 1.5px; margin-top: 8px; font-weight: 700;">
                                    <span style="opacity: 0.6;">OPERATIVES:</span> <b style="color: var(--stardust);">${g.members}</b> 
                                    <span style="margin: 0 10px; opacity: 0.3;">|</span>
                                    <span style="opacity: 0.6;">MATRIX_POWER:</span> <b class="text-photon">${(g.axp || 0).toLocaleString()}</b>
                                </div>
                            </div>

                            <div style="position: relative; z-index: 2;">
                                <button class="btn-rebirth" style="border: 1px solid var(--glass-border); font-size: 0.65rem; padding: 0.8rem 1.5rem; border-radius: 12px; transition: all 0.3s;" onclick="document.getElementById('guildIdInput').value='${g.id}'; document.getElementById('guildIdInput').dispatchEvent(new Event('input'));">
                                    INFILTRATE
                                </button>
                            </div>
                        </div>
                    `;
                }).join('') || '<div style="text-align: center; color: var(--stardust-muted); padding: 4rem; letter-spacing: 2px;">SCANNING_MATRIX_FOR_CLANS...</div>';
            }
        } catch (e) { }
    },

    async loadMembers(gid) {
        const el = document.getElementById('guildMembersList');
        if (!el) return;
        try {
            const res = await fetch((window.API_URL || '') + '/api/guilds/members?guild_id=' + gid, {
                headers: { 'Authorization': 'Bearer ' + Auth.getToken() }
            });
            if (res.ok) {
                const members = await res.json();
                el.innerHTML = members.map(m => {
                    const safeUsername = DOM.escape(m.username);
                    const safeRole = DOM.escape(m.role || 'member');
                    return `
                        <div class="pulse-card mission-card" style="display: flex; justify-content: space-between; align-items: center; padding: 1.25rem; margin-bottom: 0.5rem; border-left-color: ${m.role === 'leader' ? 'var(--photon)' : 'var(--glass-border)'}">
                            <div>
                                <div class="clash" style="font-size: 1.1rem; color: #fff;">${safeUsername} <span style="font-size: 0.65rem; color: var(--photon); opacity: 0.8; letter-spacing: 1px;">[${safeRole.toUpperCase()}]</span></div>
                                <div style="font-size: 0.7rem; color: var(--stardust-muted); letter-spacing: 1px;">CAPACITY: ${(m.axp || 0).toLocaleString()} AXP</div>
                            </div>
                            ${m.role !== 'leader' ? `<button class="btn-rebirth" style="border: 1px solid var(--glass-border); color: #ff4444; font-size: 0.65rem; padding: 0.4rem 0.8rem;" onclick="Clan.removeMember(${gid}, ${m.id})">DISCHARGE</button>` : ''}
                        </div>
                    `;
                }).join('');
            }
        } catch (e) { }
    },

    async removeMember(gid, userId) {
        if (!confirm("Confirm discharge of this operative?")) return;
        try {
            const res = await fetch((window.API_URL || '') + '/api/guilds/remove-member', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + Auth.getToken()
                },
                body: JSON.stringify({ guild_id: gid, user_id: userId })
            });
            if (res.ok) {
                if (window.Toast) Toast.show('Operative discharged.', 'info');
                this.loadMembers(gid);
            }
        } catch (e) { }
    }
};

window.Clan = Clan;
if (window.location.pathname.includes('guilds.html')) {
    document.addEventListener('DOMContentLoaded', () => Clan.init());
}
