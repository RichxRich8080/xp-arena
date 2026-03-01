/**
 * Clan (Guild) System for XP Arena REBIRTH
 * This handles clan creation, joining, and management.
 */

const Clan = {
    async init() {
        console.log("Clan System: Synchronizing...");
        await this.loadLeaderboard();
        if (Auth.isLoggedIn()) {
            await this.syncUserClan();
        }
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
        } catch (e) {
            console.error("Clan sync error:", e);
        }
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
            } else {
                if (window.Toast) Toast.show(data.error || 'Activation failed', 'error');
            }
        } catch (e) {
            console.error("Create error:", e);
        }
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
            } else {
                if (window.Toast) Toast.show(data.error || 'Deployment failed', 'error');
            }
        } catch (e) {
            console.error("Join error:", e);
        }
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
        } catch (e) {
            console.error("Leave error:", e);
        }
    },

    async loadLeaderboard() {
        const el = document.getElementById('guildLeaderboard');
        if (!el) return;
        try {
            const res = await fetch((window.API_URL || '') + '/api/guilds/leaderboard');
            if (res.ok) {
                const rows = await res.json();
                el.innerHTML = rows.map((g, i) => `
                    <div class="pulse-card" style="display: grid; grid-template-columns: 40px 1fr auto; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                        <div class="clash" style="font-size: 1.2rem; color: var(--stardust-muted);">#${i + 1}</div>
                        <div>
                            <div class="clash" style="font-size: 1.1rem; color: var(--stardust);">${g.badge ? g.badge + ' ' : ''}${g.name}</div>
                            <div style="font-size: 0.8rem; color: var(--stardust-muted);">Operatives: ${g.members} • Matrix Power: ${g.axp.toLocaleString()}</div>
                        </div>
                        <button class="btn-rebirth" style="font-size: 0.7rem; padding: 0.5rem 1rem;" onclick="document.getElementById('guildIdInput').value='${g.id}'; document.getElementById('inviteCodeInput').value='G${g.id}';">DEPLOY</button>
                    </div>
                `).join('') || '<div style="text-align: center; color: var(--stardust-muted);">Scanning matrix for clans...</div>';
            }
        } catch (e) {
            console.error("Leaderboard load error:", e);
        }
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
                el.innerHTML = members.map(m => `
                    <div class="pulse-card" style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; margin-bottom: 0.5rem;">
                        <div>
                            <div class="clash" style="font-size: 1rem;">${m.username} <span style="font-size: 0.6rem; color: var(--photon); opacity: 0.6;">[${m.role}]</span></div>
                            <div style="font-size: 0.75rem; color: var(--stardust-muted);">${m.axp.toLocaleString()} AXP</div>
                        </div>
                        <button class="btn-rebirth" style="border: 1px solid var(--glass-border); color: var(--stardust-muted); font-size: 0.65rem;" onclick="Clan.removeMember(${gid}, ${m.id})">REMOVE</button>
                    </div>
                `).join('');
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
