/**
 * Device Database Utility
 * Maps Brand -> Model -> RAM to Performance Tiers: Low, Mid, High, Flagship
 */

export const BRANDS = [
    "Samsung", "Apple", "Xiaomi", "Oppo", "Vivo", "Infinix", "Tecno", "Realme", "Huawei", "Google", "OnePlus", "ASUS", "Others"
];

export const DEVICE_DB = {
    Samsung: [
        { model: "Galaxy S24 Ultra", ram: [12], tier: "Flagship" },
        { model: "Galaxy S23", ram: [8, 12], tier: "Flagship" },
        { model: "Galaxy A54", ram: [6, 8], tier: "Mid-range" },
        { model: "Galaxy A15", ram: [4, 6], tier: "Low-end" },
        { model: "Galaxy M14", ram: [4], tier: "Low-end" },
    ],
    Apple: [
        { model: "iPhone 15 Pro Max", ram: [8], tier: "Flagship" },
        { model: "iPhone 14", ram: [6], tier: "High-end" },
        { model: "iPhone 13", ram: [4], tier: "High-end" },
        { model: "iPhone 11", ram: [4], tier: "Mid-range" },
        { model: "iPhone XR", ram: [3], tier: "Mid-range" },
    ],
    Xiaomi: [
        { model: "Xiaomi 14", ram: [8, 12], tier: "Flagship" },
        { model: "Redmi Note 13 Pro", ram: [8, 12], tier: "High-end" },
        { model: "Redmi 12", ram: [4, 8], tier: "Low-end" },
        { model: "POCO F5", ram: [8, 12], tier: "High-end" },
        { model: "POCO C65", ram: [4, 6], tier: "Low-end" },
    ],
    Realme: [
        { model: "Realme GT 5", ram: [12, 16], tier: "Flagship" },
        { model: "Realme 11 Pro", ram: [8, 12], tier: "High-end" },
        { model: "Realme C55", ram: [4, 6, 8], tier: "Low-end" },
    ],
    Infinix: [
        { model: "Zero 30", ram: [8, 12], tier: "High-end" },
        { model: "Note 30", ram: [8], tier: "Mid-range" },
        { model: "Hot 40", ram: [8], tier: "Mid-range" },
        { model: "Smart 8", ram: [3, 4], tier: "Low-end" },
    ],
    Tecno: [
        { model: "Phantom V Fold", ram: [12], tier: "Flagship" },
        { model: "Camon 20", ram: [8], tier: "Mid-range" },
        { model: "Pova 5", ram: [8], tier: "Mid-range" },
        { model: "Spark 20", ram: [4, 8], tier: "Low-end" },
    ]
};

export const getDeviceTier = (brand, model, ram) => {
    if (!brand || !model) return "Mid-range"; // Fallback

    const brandData = DEVICE_DB[brand];
    if (brandData) {
        const device = brandData.find(d => d.model === model);
        if (device) return device.tier;
    }

    // Logic heuristics for unknown devices
    const ramInt = parseInt(ram);
    if (ramInt >= 12) return "Flagship";
    if (ramInt >= 8) return "High-end";
    if (ramInt >= 6) return "Mid-range";
    return "Low-end";
};
