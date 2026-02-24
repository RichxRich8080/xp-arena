/**
 * XP Arena — Live Leaderboard
 * Pulls real user data from localStorage, sorted by AXP.
 */

const API_BASE_LB = (typeof window !== 'undefined' && typeof window.API_URL !== 'undefined')
    ? window.API_URL
    : ((location.hostname === 'localhost' || location.hostname === '127.0.0.1') ? 'http://localhost:3000' : '');

document.addEventListener('DOMContentLoaded', () => {
    startCountdown();
    renderLeaderboard();
});

async function renderLeaderboard() {
    const list = document.getElementById('leaderboardList');
    if (!list) return;

    let dbPlayers = [];
    try {
        const res = await fetch(`${API_BASE_LB}/api/leaderboard`);
        if (res.ok) {
            dbPlayers = await res.json();
        }
    } catch (e) {
        console.error('Leaderboard Fetch Error:', e);
    }

    const players = dbPlayers.map(p => {
        const rankName = p.rank || null;
        const rankObj = rankName ? getRankByName(rankName) : getRank(p.axp || 0);
        return {
            id: p.id,
            username: p.username,
            axp: p.axp || 0,
            level: p.level || 1,
            streak: p.streak || 0,
            avatar: p.avatar || '👤',
            rank: rankObj,
            setup_type: p.setup_type || null,
            badges: p.badges || {},
            submissions: 0,
            isMe: (typeof Auth !== 'undefined' && Auth.isLoggedIn() && Auth.getCurrentUser()?.id === p.id)
        };
    });

    // Seed with realistic placeholder players if very few real data
    if (players.length < 5) {
        const seeds = [
            { username: 'PRO_PLAYER_77', axp: 22500, avatar: '👑', streak: 21 },
            { username: 'Shadow_Slayer', axp: 21000, avatar: '🎯', streak: 18 },
            { username: 'Ghost_Aim', axp: 19800, avatar: '👻', streak: 14 },
            { username: 'AimBot_Pro', axp: 17000, avatar: '🤖', streak: 10 },
            { username: 'SnipeKing', axp: 14200, avatar: '⚡️', streak: 8 },
        ];
        for (let i = 0; i < seeds.length && players.length < 5; i++) {
            const s = seeds[i];
            if (!players.find(p => p.username === s.username)) {
                players.push({
                    ...s,
                    level: Math.floor(s.axp / 500) + 1,
                    rank: getRank(s.axp),
                    isMe: false,
                    submissions: Math.floor(s.axp / 200)
                });
            }
        }
    }

    players.sort((a, b) => b.axp - a.axp);

    const top10 = players.slice(0, 10);

    // Find current user's position overall
    let myPosition = -1;
    if (typeof Auth !== 'undefined' && Auth.isLoggedIn()) {
        const myUser = Auth.getCurrentUser();
        if (myUser) {
            myPosition = players.findIndex(p => p.isMe);
        }
    }

    list.innerHTML = top10.map((p, idx) => {
        const pos = idx + 1;
        const isTop3 = pos <= 3;
        const medalColors = ['#FFD700', '#C0C0C0', '#CD7F32'];
        const posColor = isTop3 ? medalColors[idx] : 'var(--text-muted)';
        const posLabel = isTop3 ? ['🥇', '🥈', '🥉'][idx] : `#${pos}`;
        const axpProgress = (p.axp % 500) / 500 * 100;

        const badgeChips = [
            p.badges && p.badges.v_badge ? '<span style="font-size:0.7rem;background:rgba(255,215,0,0.15);border:1px solid rgba(255,215,0,0.4);color:#ffd700;padding:2px 6px;border-radius:6px;">VIP</span>' : '',
            p.badges && p.badges.verified_setup ? '<span style="font-size:0.7rem;background:rgba(0,229,255,0.12);border:1px solid rgba(0,229,255,0.3);color:#00e5ff;padding:2px 6px;border-radius:6px;">Verified Setup</span>' : '',
            p.badges && p.badges.premium ? '<span style="font-size:0.7rem;background:rgba(191,0,255,0.12);border:1px solid rgba(191,0,255,0.4);color:#bf00ff;padding:2px 6px;border-radius:6px;">Premium</span>' : ''
        ].filter(Boolean).join(' ');
        const setupChip = p.setup_type ? `<span style="font-size:0.7rem;background:rgba(255,255,255,0.06);border:1px solid var(--border);padding:2px 6px;border-radius:6px;">${p.setup_type}</span>` : '';
        return `
            <div style="
                display: grid;
                grid-template-columns: 48px 1fr auto;
                align-items: center;
                gap: 1rem;
                padding: 1rem 1.2rem;
                border-radius: 14px;
                margin-bottom: 0.6rem;
                background: ${p.isMe ? 'rgba(0,229,255,0.08)' : isTop3 ? 'rgba(255,255,255,0.03)' : 'transparent'};
                border: 1px solid ${p.isMe ? 'var(--accent)' : isTop3 ? 'rgba(255,255,255,0.1)' : 'var(--border)'};
                transition: all 0.2s;
                cursor: pointer;
            " class="lb-row" onclick="showPlayerCard('${p.username}', ${p.axp}, '${p.avatar}', '${p.rank.name}', ${p.level}, ${p.streak}, ${p.submissions})">
                <div style="font-size: ${isTop3 ? '1.6rem' : '1rem'}; font-weight: 800; color: ${posColor}; text-align: center;">${posLabel}</div>
                <div>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span style="font-size: 1.4rem;">${p.avatar}</span>
                        <div>
                            <div style="font-weight: 800; font-size: 0.95rem; color: ${p.isMe ? 'var(--accent)' : '#fff'};">
                                ${p.username}${p.isMe ? ' <span style="font-size: 0.7rem; background: var(--accent); color: #000; padding: 1px 6px; border-radius: 4px; font-weight: 900;">YOU</span>' : ''}
                            </div>
                            <div style="display: flex; align-items: center; gap: 10px; margin-top: 4px; flex-wrap: wrap;">
                                <span style="font-size: 0.75rem; color: var(--text-muted);">${p.rank.icon} ${p.rank.name}</span>
                                <span style="font-size: 0.75rem; color: var(--text-muted);">Lv.${p.level}</span>
                                ${p.streak >= 3 ? `<span style="font-size: 0.75rem; color: #ff6b35;">🔥 ${p.streak}d</span>` : ''}
                                ${setupChip}
                                ${badgeChips}
                            </div>
                            <div style="margin-top: 6px; height: 3px; background: rgba(255,255,255,0.08); border-radius: 2px; overflow: hidden; width: 120px;">
                                <div style="height: 100%; width: ${axpProgress}%; background: var(--accent); border-radius: 2px;"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div style="text-align: right;">
                    <div style="font-size: 1.1rem; font-weight: 900; color: var(--accent);">${p.axp.toLocaleString()}</div>
                    <div style="font-size: 0.7rem; color: var(--text-muted);">AXP</div>
                </div>
            </div>
        `;
    }).join('');

    // Show "You are #N" footer if user is outside top 10
    if (myPosition >= 10) {
        const me = players[myPosition];
        list.innerHTML += `
            <div style="border-top: 1px solid var(--border); margin-top: 1rem; padding-top: 1rem;">
                <div style="text-align: center; color: var(--text-muted); font-size: 0.85rem; margin-bottom: 0.5rem;">Your position</div>
                <div style="
                    display: grid;
                    grid-template-columns: 48px 1fr auto;
                    align-items: center;
                    gap: 1rem;
                    padding: 1rem 1.2rem;
                    border-radius: 14px;
                    background: rgba(0,229,255,0.08);
                    border: 1px solid var(--accent);
                ">
                    <div style="font-size: 1rem; font-weight: 800; color: var(--accent); text-align: center;">#${myPosition + 1}</div>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span style="font-size: 1.4rem;">${me.avatar}</span>
                        <div>
                            <div style="font-weight: 800; color: var(--accent);">${me.username} <span style="font-size: 0.7rem; background: var(--accent); color: #000; padding: 1px 6px; border-radius: 4px;">YOU</span></div>
                            <div style="font-size: 0.75rem; color: var(--text-muted);">${me.rank.icon} ${me.rank.name} • Lv.${me.level}</div>
                        </div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 1.1rem; font-weight: 900; color: var(--accent);">${me.axp.toLocaleString()}</div>
                        <div style="font-size: 0.7rem; color: var(--text-muted);">AXP</div>
                    </div>
                </div>
            </div>
        `;
    }
}

window.showPlayerCard = function (username, axp, avatar, rankName, level, streak, submissions) {
    const existing = document.getElementById('player-card-modal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'player-card-modal';
    modal.style.cssText = `
        position: fixed; inset: 0; z-index: 100000;
        display: flex; align-items: center; justify-content: center;
        background: rgba(0,0,0,0.8); backdrop-filter: blur(8px);
        animation: fadeIn 0.3s ease;
    `;
    modal.innerHTML = `
        <div style="background: var(--card-dark); border: 1px solid var(--border); border-radius: 20px; width: 90%; max-width: 350px; overflow: hidden; position: relative; animation: slideUp 0.3s ease;">
            <button onclick="document.getElementById('player-card-modal').remove()" style="position: absolute; top: 15px; right: 15px; background: none; border: none; color: var(--text-muted); font-size: 1.2rem; cursor: pointer;"><i class="fas fa-times"></i></button>
            <div style="padding: 2rem; text-align: center; background: radial-gradient(circle at top, rgba(0,229,255,0.1), transparent 70%);">
                <div style="font-size: 4rem; margin-bottom: 1rem;">${avatar}</div>
                <h3 style="font-size: 1.5rem; color: #fff; margin-bottom: 0.2rem;">${username}</h3>
                <div style="color: var(--accent); font-weight: 800; font-size: 0.9rem;">${rankName} • Level ${level}</div>
            </div>
            <div style="padding: 1.5rem; display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; border-top: 1px solid var(--border);">
                <div style="text-align: center; padding: 1rem; background: rgba(255,255,255,0.03); border-radius: 12px;">
                    <div style="font-size: 1.2rem; font-weight: 800; color: #fff;">${axp.toLocaleString()}</div>
                    <div style="font-size: 0.75rem; color: var(--text-muted);">Total AXP</div>
                </div>
                <div style="text-align: center; padding: 1rem; background: rgba(255,255,255,0.03); border-radius: 12px;">
                    <div style="font-size: 1.2rem; font-weight: 800; color: #fff;">${streak}</div>
                    <div style="font-size: 0.75rem; color: var(--text-muted);">Day Streak</div>
                </div>
                <div style="text-align: center; padding: 1rem; background: rgba(255,255,255,0.03); border-radius: 12px; grid-column: span 2;">
                    <div style="font-size: 1.2rem; font-weight: 800; color: #fff;">${submissions}</div>
                    <div style="font-size: 0.75rem; color: var(--text-muted);">Clips Submitted</div>
                </div>
            </div>
            <div style="padding: 1.5rem; text-align: center; border-top: 1px solid var(--border);">
                <button class="btn-primary" style="padding: 0.8rem 2rem; width: auto;" onclick="if(window.Toast) Toast.show('Link copied to clipboard!', 'success'); document.getElementById('player-card-modal').remove()"><i class="fas fa-share-alt"></i> Share Card</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function getRank(axp) {
    const RANKS = [
        { name: 'Rookie', minAXP: 0, icon: '🆕' },
        { name: 'Grinder', minAXP: 1000, icon: '⚒️' },
        { name: 'Elite', minAXP: 10000, icon: '🔥' },
        { name: 'Champion', minAXP: 50000, icon: '🛡️' },
        { name: 'Legend', minAXP: 100000, icon: '👑' },
        { name: 'Arena Master', minAXP: 200000, icon: '🏆' }
    ];
    return [...RANKS].reverse().find(r => axp >= r.minAXP) || RANKS[0];
}

function getRankByName(name) {
    const map = {
        'Rookie': { name: 'Rookie', icon: '🆕' },
        'Grinder': { name: 'Grinder', icon: '⚒️' },
        'Elite': { name: 'Elite', icon: '🔥' },
        'Champion': { name: 'Champion', icon: '🛡️' },
        'Legend': { name: 'Legend', icon: '👑' },
        'Arena Master': { name: 'Arena Master', icon: '🏆' }
    };
    return map[name] || { name, icon: '⭐' };
}
function startCountdown() {
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minsEl = document.getElementById('mins');
    const secsEl = document.getElementById('secs');
    if (!daysEl) return;

    // Target: next Monday midnight
    function getTarget() {
        const now = new Date();
        const next = new Date();
        next.setDate(now.getDate() + (7 - now.getDay() + 1) % 7 || 7);
        next.setHours(0, 0, 0, 0);
        return next;
    }

    function tick() {
        const diff = getTarget() - new Date();
        if (diff <= 0) return;
        const d = Math.floor(diff / 86400000);
        const h = Math.floor((diff % 86400000) / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        daysEl.textContent = String(d).padStart(2, '0');
        hoursEl.textContent = String(h).padStart(2, '0');
        minsEl.textContent = String(m).padStart(2, '0');
        secsEl.textContent = String(s).padStart(2, '0');
    }
    tick();
    setInterval(tick, 1000);
}
