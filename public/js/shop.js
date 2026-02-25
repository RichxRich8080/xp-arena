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
            container.innerHTML = '<div style="grid-column: 1/-1; text-align:center; padding: 3rem; color: var(--text-muted);">The armory is empty today. Check back later!</div>';
            return;
        }

        container.innerHTML = this.items.map(item => `
            <div class="form-card shop-item-card rarity-${item.rarity}" data-id="${item.id}">
                <div class="shop-item-icon">
                    <i class="${item.icon}"></i>
                </div>
                <div class="shop-item-rarity-badge">${item.rarity.toUpperCase()}</div>
                <h4>${item.name}</h4>
                <p>${item.description}</p>
                <div class="shop-item-footer">
                    <div class="shop-item-price">
                        <i class="fas fa-star" style="color: var(--accent);"></i> ${item.price_axp.toLocaleString()} AXP
                    </div>
                    <button class="btn-primary shop-buy-btn" onclick="Shop.buy(${item.id}, '${item.name}', ${item.price_axp})" ${this.canAfford(item.price_axp) ? '' : 'disabled'}>
                        ${this.canAfford(item.price_axp) ? 'PURCHASE' : 'INSUFFICIENT AXP'}
                    </button>
                </div>
            </div>
        `).join('');
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
