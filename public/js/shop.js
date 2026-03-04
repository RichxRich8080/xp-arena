/**
 * Armory (Shop) System for XP Arena
 */

const Shop = {
    items: [],

    async init() {
        this.renderSkeletons();
        await this.loadItems();
        this.render();

        // Listen for stats changes to refres balancing
        window.addEventListener('statsChange', () => this.updateBalanceDisplay());
        this.updateBalanceDisplay();
    },

    renderSkeletons() {
        const container = document.getElementById('shop-items-grid');
        if (!container) return;
        container.innerHTML = Array(6).fill(0).map(() => `
            <div class="pulse-card skeleton-module" style="height: 480px; border-radius: var(--radius-lg);"></div>
        `).join('');
    },

    async loadItems() {
        try {
            const res = await fetch('/api/shop/items');
            if (res.ok) {
                this.items = await res.json();
                if (this.items.length === 0) {
                    // Seed defaults once if empty (first deploy convenience)
                    const seed = await fetch('/api/shop/seed-defaults', { method: 'POST' });
                    if (seed.ok) {
                        const res2 = await fetch('/api/shop/items');
                        if (res2.ok) this.items = await res2.json();
                    }
                }
            } else {
                // Silent failure handled by UI
            }
        } catch (e) {
            // Network failure handled by UI
        }
    },

    updateBalanceDisplay() {
        const stats = User.getStats();
        const el = document.getElementById('shop-balance');
        if (el && stats) {
            el.textContent = stats.axp.toLocaleString();
        }
    },

    render() {
        const container = document.getElementById('shop-items-grid');
        if (!container) return;

        if (this.items.length === 0) {
            container.innerHTML = '<div style="grid-column: 1/-1; text-align:center; padding: 4rem; color: var(--stardust-muted); border: 1px solid var(--glass-border); border-radius: 20px; background: var(--nebula);">The armory is currently offline. Restocking in progress...</div>';
            return;
        }

        container.innerHTML = this.items.map(item => {
            const safeName = DOM.escape(item.name);
            const safeDesc = DOM.escape(item.description);
            const rarityLabel = (item.rarity || 'common').toUpperCase();
            const typeLabel = (item.type || 'module').toUpperCase();
            const stockLabel = item.stock === -1 ? 'UNLIMITED' : (item.stock ?? 'N/A');
            const imageUrl = item.image_url || item.image || '';
            const visual = imageUrl
                ? `<img src="${imageUrl}" alt="${safeName}" loading="lazy" />`
                : `<i class="${DOM.escape(item.icon)}"></i>`;

            const isRenameCard = item.name === 'Rename Card';
            const inventory = (typeof User !== 'undefined' && User.getStats()) ? (User.getStats().inventory || []) : [];
            const isOwned = inventory.includes(item.id);

            return `
                <div class="pulse-card mission-card shop-item-card" data-id="${item.id}" 
                    style="border-left: 4px solid ${item.rarity === 'legendary' ? '#ffd700' : (item.rarity === 'epic' ? '#bf00ff' : 'var(--photon)')};
                           background: rgba(255, 255, 255, 0.01); backdrop-filter: blur(10px); transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);">
                    <div class="rarity-badge rarity-${DOM.escape(item.rarity)}">${rarityLabel}</div>
                    
                    <div class="module-visual" style="border-radius: 24px; position: relative; overflow: hidden; height: 200px; background: rgba(0,0,0,0.2);">
                        <div class="glint-overlay" style="position: absolute; inset: 0; background: linear-gradient(135deg, transparent 45%, rgba(255,255,255,0.1) 50%, transparent 55%); background-size: 250% 250%; animation: glint 4s infinite;"></div>
                        ${visual}
                    </div>

                    <div class="item-meta" style="padding: 0.5rem 0.2rem;">
                        <div style="font-size: 0.55rem; color: var(--stardust-muted); letter-spacing: 3px; font-weight: 800; margin-bottom: 0.8rem; opacity: 0.7;">
                            NODE_IDENTIFIER // BATCH_${item.id}
                        </div>
                        <h3 class="clash" style="margin-bottom: 0.6rem; font-size: 1.5rem; color: var(--stardust); line-height: 1.1;">
                            ${safeName.toUpperCase()}
                        </h3>
                        <p style="font-size: 0.75rem; color: var(--stardust-muted); line-height: 1.6; margin-bottom: 1.5rem; font-weight: 500;">
                            ${safeDesc.toUpperCase()}
                        </p>
                        <div class="spec-tags" style="gap: 0.6rem;">
                            <span class="spec-tag" style="background: rgba(0,245,255,0.08); color: var(--photon); border-color: rgba(0,245,255,0.1); padding: 5px 12px; border-radius: 8px;">
                                <i class="fas fa-microchip" style="font-size:0.6rem; margin-right:4px;"></i> ${typeLabel}
                            </span>
                            <span class="spec-tag" style="padding: 5px 12px; border-radius: 8px;">
                                <i class="fas fa-layer-group" style="font-size:0.6rem; margin-right:4px;"></i> ${stockLabel}
                            </span>
                        </div>
                    </div>

                    <div class="shop-item-footer" style="padding-top: 2rem; border-top: 1px dashed var(--glass-border); display: flex; align-items: center; justify-content: space-between;">
                        <div class="price-tag">
                            <span style="font-size: 1.4rem; color: var(--stardust); font-weight: 900;">${item.price_axp.toLocaleString()}</span>
                            <span style="font-size: 0.65rem; color: var(--photon); font-weight: 800; margin-left: 4px;">AXP</span>
                        </div>
                        ${isRenameCard && isOwned ? `
                            <button class="btn-rebirth btn-photon" style="font-size: 0.65rem; padding: 0.8rem 1.8rem; border-radius: 12px;" onclick="User.useRenameCard(${item.id})">
                                SYNC_IDENTITY
                            </button>
                        ` : `
                            <button class="btn-rebirth ${this.canAfford(item.price_axp) ? 'btn-photon' : ''}" 
                                    style="font-size: 0.65rem; padding: 0.8rem 1.8rem; border-radius: 12px; ${!this.canAfford(item.price_axp) ? 'opacity: 0.4;' : ''}"
                                    onclick="Shop.buy(${item.id}, '${safeName}', ${item.price_axp})" 
                                    ${this.canAfford(item.price_axp) ? '' : 'disabled'}>
                                ${this.canAfford(item.price_axp) ? 'DEPLOY_MODULE' : 'LOCKED'}
                            </button>
                        `}
                    </div>
                </div>
            `;
        }).join('');
    },

    canAfford(price) {
        const stats = User.getStats();
        return stats && stats.axp >= price;
    },

    async buy(itemId, itemName, price) {
        if (!Auth.isLoggedIn()) {
            if (window.Toast) Toast.show('Please login to make purchases.', 'error');
            return;
        }

        if (!confirm(`Confirm purchase of "${itemName}" for ${price} AXP?`)) return;

        try {
            const res = await fetch('/api/shop/buy', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Auth.getToken()}`
                },
                body: JSON.stringify({ itemId })
            });

            const data = await res.json();
            if (res.ok) {
                if (window.Toast) Toast.show(`ACQUISITION COMPLETE: ${itemName}`, 'success', 0);
                if (window.Celebration) Celebration.fire();
                if (window.Sounds) Sounds.play('success');

                this.triggerGlow();
                this.updateMaximDialogue('success');

                // Refresh stats and UI
                await User.loadStats();
                this.render();
            } else {
                this.updateMaximDialogue('fail');
                if (window.Toast) Toast.show(data.error || 'ACQUISITION FAILED', 'error');
            }
        } catch (e) {
            console.error('Purchase error:', e);
            this.updateMaximDialogue('fail');
            if (window.Toast) Toast.show('Network error during purchase.', 'error');
        }
    },

    triggerGlow() {
        const glow = document.getElementById('shopGlow');
        if (glow) {
            glow.classList.remove('active');
            void glow.offsetWidth; // Force reflow
            glow.classList.add('active');
        }
    },

    updateMaximDialogue(status) {
        const dialogue = document.getElementById('maximDialogue');
        if (!dialogue) return;

        const lines = {
            'success': '"Good choice, operative. This hardware will serve you well in the sector."',
            'fail': '"Insufficient credits. Go earn some AXP and come back later."',
            'idle': '"Hardware check complete. The armory is open for extraction."'
        };

        dialogue.style.opacity = '0';
        setTimeout(() => {
            dialogue.textContent = lines[status] || lines['idle'];
            dialogue.style.opacity = '1';
        }, 300);
    }
};

window.Shop = Shop;

// Auto-init if on shop page
if (window.location.pathname.includes('shop.html')) {
    document.addEventListener('DOMContentLoaded', () => Shop.init());
}
