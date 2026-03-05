let loaded = false;
export async function initShopFeature() {
    if (loaded) return;
    await import('../../shop.js');
    loaded = true;
}
