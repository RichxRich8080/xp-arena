/**
 * Armory (Shop) System for XP Arena
 */

const Shop = {
    items: [],

    async init() {
        console.log('Shop: Initializing...');
        await this.loadItems();
        this.render();

        // Listen for stats changes to refres balancing
        window.addEventListener('statsChange', () => this.updateBalanceDisplay());
        this.updateBalanceDisplay();
    },

    async loadItems() {
        try {
            const res = await fetch('/api/shop/items');
            if (res.ok) {
                this.items = await res.json();
            } else {
                console.error('Failed to load shop items');
            }
        } catch (e) {
            console.error('Shop fetch error:', e);
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
            const rarityLabel = (item.rarity || 'common').toUpperCase();
            const typeLabel = (item.type || 'module').toUpperCase();
            const stockLabel = item.stock === -1 ? 'UNLIMITED' : (item.stock ?? 'N/A');
            const imageUrl = item.image_url || item.image || '';
            const visual = imageUrl
                ? `<img src="${imageUrl}" alt="${item.name}" loading="lazy" />`
                : `<i class="${item.icon}"></i>`;

            return `
                <div class="pulse-card shop-item-card" data-id="${item.id}">
                    <div class="rarity-badge rarity-${item.rarity}">${rarityLabel}</div>
                    <div class="module-visual">${visual}</div>
                    <div class="item-meta">
                        <h3 class="clash" style="margin-bottom: 0.5rem;">${item.name}</h3>
                        <p style="font-size: 0.85rem; color: var(--stardust-muted); margin-bottom: 1rem;">${item.description}</p>
                        <div class="spec-tags">
                            <span class="spec-tag">TYP: ${typeLabel}</span>
                            <span class="spec-tag">STK: ${stockLabel}</span>
                        </div>
                    </div>
                    <div class="shop-item-footer">
                        <div class="price-tag">
                            <span class="text-photon">${item.price_axp.toLocaleString()}</span> AXP
                        </div>
                        <button class="btn-rebirth ${this.canAfford(item.price_axp) ? 'btn-photon' : ''}" 
                                style="font-size: 0.75rem; padding: 0.6rem 1rem;"
                                onclick="Shop.buy(${item.id}, '${item.name}', ${item.price_axp})" 
                                ${this.canAfford(item.price_axp) ? '' : 'disabled'}>
                            ${this.canAfford(item.price_axp) ? 'ACQUIRE' : 'INSUFFICIENT'}
                        </button>
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
                if (window.Toast) Toast.show(`Purchased ${itemName}!`, 'success');
                if (window.Celebration) Celebration.fire();

                // Refresh stats and UI
                await User.loadStats();
                this.render();
            } else {
                if (window.Toast) Toast.show(data.error || 'Purchase failed', 'error');
            }
        } catch (e) {
            console.error('Purchase error:', e);
            if (window.Toast) Toast.show('Network error during purchase.', 'error');
        }
    }
};

window.Shop = Shop;

// Auto-init if on shop page
if (window.location.pathname.includes('shop.html')) {
    document.addEventListener('DOMContentLoaded', () => Shop.init());
}
