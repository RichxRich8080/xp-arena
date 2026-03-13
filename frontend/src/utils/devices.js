/**
 * Device Database Utility
 * Maps Brand -> Series -> Model -> RAM and Performance Tier
 */

export const BRANDS = [
    "Apple", "Samsung", "Xiaomi", "POCO", "Oppo", "Vivo", "Infinix", "Tecno", "Realme", "OnePlus", "Google", "Others"
];

export const DEVICE_DB = {
    Apple: {
        "iPhone 15 Series": [
            { model: "iPhone 15 Pro Max", ram: [8], tier: "Flagship" },
            { model: "iPhone 15 Pro", ram: [8], tier: "Flagship" },
            { model: "iPhone 15 Plus", ram: [6], tier: "High-end" },
            { model: "iPhone 15", ram: [6], tier: "High-end" }
        ],
        "iPhone 14 Series": [
            { model: "iPhone 14 Pro Max", ram: [6], tier: "Flagship" },
            { model: "iPhone 14 Pro", ram: [6], tier: "Flagship" },
            { model: "iPhone 14 Plus", ram: [6], tier: "High-end" },
            { model: "iPhone 14", ram: [6], tier: "High-end" }
        ],
        "iPhone 13 Series": [
            { model: "iPhone 13 Pro Max", ram: [6], tier: "Flagship" },
            { model: "iPhone 13 Pro", ram: [6], tier: "Flagship" },
            { model: "iPhone 13", ram: [4], tier: "High-end" },
            { model: "iPhone 13 mini", ram: [4], tier: "High-end" }
        ],
        "iPhone 12 Series": [
            { model: "iPhone 12 Pro Max", ram: [6], tier: "High-end" },
            { model: "iPhone 12 Pro", ram: [6], tier: "High-end" },
            { model: "iPhone 12", ram: [4], tier: "Mid-range" },
            { model: "iPhone 12 mini", ram: [4], tier: "Mid-range" }
        ],
        "iPhone 11 & Older": [
            { model: "iPhone 11 Pro Max", ram: [4], tier: "Mid-range" },
            { model: "iPhone 11 Pro", ram: [4], tier: "Mid-range" },
            { model: "iPhone 11", ram: [4], tier: "Mid-range" },
            { model: "iPhone XR", ram: [3], tier: "Low-end" },
            { model: "iPhone X/XS", ram: [3, 4], tier: "Low-end" }
        ]
    },
    Samsung: {
        "Galaxy S Series": [
            { model: "Galaxy S24 Ultra", ram: [12], tier: "Flagship" },
            { model: "Galaxy S24+", ram: [8, 12], tier: "Flagship" },
            { model: "Galaxy S24", ram: [8], tier: "Flagship" },
            { model: "Galaxy S23 Ultra", ram: [8, 12], tier: "Flagship" },
            { model: "Galaxy S23", ram: [8], tier: "Flagship" },
            { model: "Galaxy S22 Ultra", ram: [8, 12], tier: "High-end" },
            { model: "Galaxy S21 Ultra", ram: [12, 16], tier: "High-end" }
        ],
        "Galaxy A Series": [
            { model: "Galaxy A55", ram: [8, 12], tier: "Mid-range" },
            { model: "Galaxy A54", ram: [6, 8], tier: "Mid-range" },
            { model: "Galaxy A34", ram: [6, 8], tier: "Mid-range" },
            { model: "Galaxy A15", ram: [4, 6, 8], tier: "Low-end" },
            { model: "Galaxy A14", ram: [4, 6], tier: "Low-end" },
            { model: "Galaxy A10 / A20", ram: [2, 3], tier: "Low-end" }
        ],
        "Galaxy Z Series (Foldables)": [
            { model: "Galaxy Z Fold 5", ram: [12], tier: "Flagship" },
            { model: "Galaxy Z Flip 5", ram: [8], tier: "Flagship" },
            { model: "Galaxy Z Fold 4", ram: [12], tier: "Flagship" }
        ]
    },
    Xiaomi: {
        "Xiaomi Core Series": [
            { model: "Xiaomi 14 Ultra", ram: [12, 16], tier: "Flagship" },
            { model: "Xiaomi 14 Pro", ram: [12, 16], tier: "Flagship" },
            { model: "Xiaomi 14", ram: [8, 12], tier: "Flagship" },
            { model: "Xiaomi 13 Pro", ram: [8, 12], tier: "High-end" }
        ],
        "Redmi Note Series": [
            { model: "Redmi Note 13 Pro+", ram: [8, 12], tier: "High-end" },
            { model: "Redmi Note 13 Pro", ram: [8, 12], tier: "High-end" },
            { model: "Redmi Note 13", ram: [6, 8], tier: "Mid-range" },
            { model: "Redmi Note 12", ram: [4, 6, 8], tier: "Mid-range" }
        ],
        "Redmi Budget Series": [
            { model: "Redmi 13C", ram: [4, 6, 8], tier: "Low-end" },
            { model: "Redmi 12", ram: [4, 8], tier: "Low-end" },
            { model: "Redmi 10/10C", ram: [3, 4], tier: "Low-end" }
        ]
    },
    POCO: {
        "POCO F Series": [
            { model: "POCO F5 Pro", ram: [8, 12], tier: "Flagship" },
            { model: "POCO F5", ram: [8, 12], tier: "High-end" },
            { model: "POCO F4", ram: [6, 8], tier: "High-end" }
        ],
        "POCO X Series": [
            { model: "POCO X6 Pro", ram: [8, 12], tier: "High-end" },
            { model: "POCO X6", ram: [8, 12], tier: "Mid-range" },
            { model: "POCO X5 Pro", ram: [6, 8], tier: "Mid-range" }
        ],
        "POCO M & C Series": [
            { model: "POCO M6 Pro", ram: [8, 12], tier: "Mid-range" },
            { model: "POCO C65", ram: [4, 6, 8], tier: "Low-end" }
        ]
    },
    Realme: {
        "GT Series": [
            { model: "Realme GT 5 Pro", ram: [12, 16], tier: "Flagship" },
            { model: "Realme GT 5", ram: [12, 16], tier: "Flagship" },
            { model: "Realme GT Neo 5", ram: [8, 12, 16], tier: "High-end" }
        ],
        "Number Series": [
            { model: "Realme 12 Pro+", ram: [8, 12], tier: "High-end" },
            { model: "Realme 12 Pro", ram: [8, 12], tier: "Mid-range" },
            { model: "Realme 11", ram: [8], tier: "Mid-range" }
        ],
        "C Series": [
            { model: "Realme C67", ram: [8], tier: "Low-end" },
            { model: "Realme C55", ram: [4, 6, 8], tier: "Low-end" }
        ]
    },
    Oppo: {
        "Find X Series": [
            { model: "Find X7 Ultra", ram: [12, 16], tier: "Flagship" },
            { model: "Find X6 Pro", ram: [12, 16], tier: "Flagship" }
        ],
        "Reno Series": [
            { model: "Reno 11 Pro", ram: [12], tier: "High-end" },
            { model: "Reno 11", ram: [8, 12], tier: "Mid-range" }
        ],
        "A Series": [
            { model: "Oppo A79", ram: [8], tier: "Low-end" },
            { model: "Oppo A58", ram: [6, 8], tier: "Low-end" }
        ]
    },
    Vivo: {
        "X Series": [
            { model: "Vivo X100 Pro", ram: [12, 16], tier: "Flagship" },
            { model: "Vivo X90 Pro", ram: [8, 12], tier: "Flagship" }
        ],
        "V Series": [
            { model: "Vivo V30 Pro", ram: [8, 12], tier: "High-end" },
            { model: "Vivo V29", ram: [8, 12], tier: "Mid-range" }
        ],
        "Y & T Series": [
            { model: "Vivo Y200", ram: [8], tier: "Low-end" },
            { model: "Vivo T2x", ram: [4, 6, 8], tier: "Low-end" }
        ]
    },
    Infinix: {
        "Zero Series": [
            { model: "Zero 30 5G", ram: [8, 12], tier: "High-end" },
            { model: "Zero Ultra", ram: [8], tier: "High-end" }
        ],
        "Note Series": [
            { model: "Note 30 Pro", ram: [8], tier: "Mid-range" },
            { model: "Note 30 VIP", ram: [12], tier: "Mid-range" }
        ],
        "Hot & Smart Series": [
            { model: "Hot 40 Pro", ram: [8], tier: "Low-end" },
            { model: "Hot 40i", ram: [4, 8], tier: "Low-end" },
            { model: "Smart 8", ram: [3, 4], tier: "Low-end" }
        ]
    },
    Tecno: {
        "Phantom Series": [
            { model: "Phantom V Fold", ram: [12], tier: "Flagship" },
            { model: "Phantom X2 Pro", ram: [12], tier: "High-end" }
        ],
        "Camon Series": [
            { model: "Camon 20 Premier", ram: [8], tier: "Mid-range" },
            { model: "Camon 20 Pro", ram: [8], tier: "Mid-range" }
        ],
        "Pova & Spark Series": [
            { model: "Pova 5 Pro", ram: [8], tier: "Mid-range" },
            { model: "Spark 20 Pro", ram: [8], tier: "Low-end" },
            { model: "Spark 20C", ram: [4, 8], tier: "Low-end" }
        ]
    },
    OnePlus: {
        "Flagship Series": [
            { model: "OnePlus 12", ram: [12, 16, 24], tier: "Flagship" },
            { model: "OnePlus 11", ram: [8, 16], tier: "Flagship" }
        ],
        "Nord Series": [
            { model: "Nord 3", ram: [8, 16], tier: "High-end" },
            { model: "Nord CE 3", ram: [8, 12], tier: "Mid-range" },
            { model: "Nord CE 3 Lite", ram: [8], tier: "Low-end" }
        ]
    },
    Google: {
        "Pixel Series": [
            { model: "Pixel 8 Pro", ram: [12], tier: "Flagship" },
            { model: "Pixel 8", ram: [8], tier: "High-end" },
            { model: "Pixel 7 Pro", ram: [12], tier: "High-end" },
            { model: "Pixel 7a", ram: [8], tier: "Mid-range" }
        ]
    },
    Others: {
        "Generic": [
            { model: "Custom / Unknown", ram: [4, 6, 8, 12], tier: "Mid-range" }
        ]
    }
};

export const getDeviceTier = (brand, series, model, ram) => {
    if (!brand || !series || !model) return "Mid-range"; // Fallback

    const brandData = DEVICE_DB[brand];
    if (brandData && brandData[series]) {
        const device = brandData[series].find(d => d.model === model);
        if (device) return device.tier;
    }

    // Logic heuristics for unknown devices
    const ramInt = parseInt(ram);
    if (ramInt >= 12) return "Flagship";
    if (ramInt >= 8) return "High-end";
    if (ramInt >= 6) return "Mid-range";
    return "Low-end";
};
