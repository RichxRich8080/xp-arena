const smartphoneDatabase = [
    {
        brand: "Samsung",
        series: [
            {
                name: "Galaxy S Series", models: [
                    { name: "Galaxy S24 Ultra", touchSampling: "240Hz", latency: "16ms", score: 96 },
                    { name: "Galaxy S24+", touchSampling: "240Hz", latency: "18ms", score: 92 },
                    { name: "Galaxy S24", touchSampling: "240Hz", latency: "20ms", score: 90 },
                    { name: "Galaxy S23 Ultra", touchSampling: "240Hz", latency: "18ms", score: 94 },
                    "Galaxy S23+", "Galaxy S23", "Galaxy S23 FE", "Galaxy S22 Ultra", "Galaxy S22+", "Galaxy S22", "Galaxy S21 Ultra", "Galaxy S21+", "Galaxy S21", "Galaxy S21 FE", "Galaxy S20 Ultra", "Galaxy S20+", "Galaxy S20", "Galaxy S20 FE", "Galaxy S10+", "Galaxy S10", "Galaxy S10e", "Galaxy S10 Lite", "Galaxy S10 5G", "Galaxy S9+", "Galaxy S9", "Galaxy S8+", "Galaxy S8", "Galaxy S7 Edge", "Galaxy S7", "Galaxy S6 Edge+", "Galaxy S6 Edge", "Galaxy S6", "Galaxy S5", "Galaxy S4", "Galaxy S3", "Galaxy S2", "Galaxy S1"
                ]
            },
            { name: "Galaxy Note Series", models: ["Galaxy Note 20 Ultra", "Galaxy Note 20", "Galaxy Note 10+", "Galaxy Note 10", "Galaxy Note 10 Lite", "Galaxy Note 9", "Galaxy Note 8", "Galaxy Note 7", "Galaxy Note FE", "Galaxy Note 5", "Galaxy Note 4", "Galaxy Note Edge", "Galaxy Note 3", "Galaxy Note 3 Neo", "Galaxy Note 2", "Galaxy Note"] },
            { name: "Galaxy Z Series (Fold & Flip)", models: ["Galaxy Z Fold 5", "Galaxy Z Flip 5", "Galaxy Z Fold 4", "Galaxy Z Flip 4", "Galaxy Z Fold 3", "Galaxy Z Flip 3", "Galaxy Z Fold 2", "Galaxy Z Flip", "Galaxy Z Flip 5G", "Galaxy Fold"] },
            { name: "Galaxy A Series", models: ["Galaxy A55", "Galaxy A54", "Galaxy A53", "Galaxy A52s 5G", "Galaxy A52 5G", "Galaxy A52", "Galaxy A51", "Galaxy A50s", "Galaxy A50", "Galaxy A35", "Galaxy A34", "Galaxy A33", "Galaxy A32", "Galaxy A31", "Galaxy A30s", "Galaxy A30", "Galaxy A25", "Galaxy A24", "Galaxy A23", "Galaxy A22", "Galaxy A21s", "Galaxy A21", "Galaxy A20s", "Galaxy A20", "Galaxy A15", "Galaxy A14", "Galaxy A13", "Galaxy A12", "Galaxy A11", "Galaxy A10s", "Galaxy A10", "Galaxy A05s", "Galaxy A05", "Galaxy A04s", "Galaxy A04", "Galaxy A03s", "Galaxy A03", "Galaxy A02s", "Galaxy A02", "Galaxy A01", "Galaxy A90 5G", "Galaxy A80", "Galaxy A73 5G", "Galaxy A72", "Galaxy A71", "Galaxy A70s", "Galaxy A70", "Galaxy A60", "Galaxy A42 5G", "Galaxy A41", "Galaxy A40"] },
            { name: "Galaxy M Series", models: ["Galaxy M55", "Galaxy M54", "Galaxy M53", "Galaxy M52 5G", "Galaxy M51", "Galaxy M35", "Galaxy M34", "Galaxy M33", "Galaxy M32", "Galaxy M31s", "Galaxy M31", "Galaxy M30s", "Galaxy M30", "Galaxy M23", "Galaxy M22", "Galaxy M21", "Galaxy M20", "Galaxy M15", "Galaxy M14", "Galaxy M13", "Galaxy M12", "Galaxy M11", "Galaxy M10s", "Galaxy M10", "Galaxy M04", "Galaxy M02", "Galaxy M01"] },
            { name: "Galaxy J Series", models: ["Galaxy J8", "Galaxy J7 Prime", "Galaxy J7 Pro", "Galaxy J7 Max", "Galaxy J7 Duo", "Galaxy J7 (2018)", "Galaxy J6+", "Galaxy J6", "Galaxy J5 Prime", "Galaxy J5 Pro", "Galaxy J5 (2017)", "Galaxy J4+", "Galaxy J4", "Galaxy J3 Pro", "Galaxy J3 (2017)", "Galaxy J2 Pro", "Galaxy J2 Prime", "Galaxy J2 (2018)"] },
            { name: "Galaxy F Series", models: ["Galaxy F55", "Galaxy F54", "Galaxy F42 5G", "Galaxy F41", "Galaxy F34", "Galaxy F23 5G", "Galaxy F22", "Galaxy F15", "Galaxy F14", "Galaxy F13", "Galaxy F12", "Galaxy F05", "Galaxy F04", "Galaxy F02s"] }
        ]
    },
    {
        brand: "Apple",
        series: [
            {
                name: "iPhone Series", models: [
                    { name: "iPhone 15 Pro Max", touchSampling: "240Hz", latency: "15ms", score: 98 },
                    { name: "iPhone 15 Pro", touchSampling: "240Hz", latency: "16ms", score: 97 },
                    { name: "iPhone 14 Pro Max", touchSampling: "240Hz", latency: "18ms", score: 95 },
                    "iPhone 15 Plus", "iPhone 15", "iPhone 14 Pro", "iPhone 14 Plus", "iPhone 14", "iPhone 13 Pro Max", "iPhone 13 Pro", "iPhone 13 mini", "iPhone 13", "iPhone 12 Pro Max", "iPhone 12 Pro", "iPhone 12 mini", "iPhone 12", "iPhone 11 Pro Max", "iPhone 11 Pro", "iPhone 11", "iPhone XS Max", "iPhone XS", "iPhone XR", "iPhone X", "iPhone 8 Plus", "iPhone 8", "iPhone 7 Plus", "iPhone 7", "iPhone 6s Plus", "iPhone 6s", "iPhone 6 Plus", "iPhone 6", "iPhone SE (3rd gen)", "iPhone SE (2nd gen)", "iPhone SE (1st gen)", "iPhone 5s", "iPhone 5c", "iPhone 5", "iPhone 4s", "iPhone 4", "iPhone 3GS", "iPhone 3G", "iPhone (1st gen)"
                ]
            }
        ]
    },
    {
        brand: "Xiaomi",
        series: [
            { name: "Xiaomi / Mi Series", models: ["Xiaomi 14 Ultra", "Xiaomi 14 Pro", "Xiaomi 14", "Xiaomi 13 Ultra", "Xiaomi 13 Pro", "Xiaomi 13", "Xiaomi 13 Lite", "Xiaomi 12S Ultra", "Xiaomi 12 Pro", "Xiaomi 12", "Xiaomi 12X", "Xiaomi 12 Lite", "Xiaomi 11 Ultra", "Xiaomi 11 Pro", "Xiaomi 11", "Xiaomi 11i", "Xiaomi 11 Lite 5G NE", "Xiaomi 11 Lite", "Mi 10 Ultra", "Mi 10 Pro", "Mi 10", "Mi 10S", "Mi 10 Lite", "Mi 10i", "Mi 9 Pro", "Mi 9", "Mi 9 SE", "Mi 9 Lite", "Mi 9T Pro", "Mi 9T", "Mi 8 Pro", "Mi 8", "Mi 8 SE", "Mi 8 Lite", "Mi 6", "Mi 5", "Mi 4", "Mi 3", "Mi 2", "Mi 1"] },
            { name: "Xiaomi Mix Series", models: ["Xiaomi Mix Fold 3", "Xiaomi Mix Fold 2", "Xiaomi Mix Fold", "Xiaomi Mix 4", "Mi Mix 3 5G", "Mi Mix 3", "Mi Mix 2S", "Mi Mix 2", "Mi Mix"] },
            { name: "Xiaomi Note / Max Series", models: ["Mi Note 10 Pro", "Mi Note 10", "Mi Note 10 Lite", "Mi Note 3", "Mi Note 2", "Mi Note", "Mi Max 3", "Mi Max 2", "Mi Max"] }
        ]
    },
    {
        brand: "Redmi",
        series: [
            { name: "Redmi Note Series", models: ["Redmi Note 13 Pro+ 5G", "Redmi Note 13 Pro 5G", "Redmi Note 13 Pro", "Redmi Note 13 5G", "Redmi Note 13", "Redmi Note 12 Pro+ 5G", "Redmi Note 12 Pro 5G", "Redmi Note 12 Pro", "Redmi Note 12 5G", "Redmi Note 12", "Redmi Note 12S", "Redmi Note 12 Turbo", "Redmi Note 11 Pro+ 5G", "Redmi Note 11 Pro 5G", "Redmi Note 11 Pro", "Redmi Note 11 5G", "Redmi Note 11", "Redmi Note 11S", "Redmi Note 11T", "Redmi Note 11E", "Redmi Note 10 Pro Max", "Redmi Note 10 Pro", "Redmi Note 10 5G", "Redmi Note 10", "Redmi Note 10S", "Redmi Note 10T", "Redmi Note 9 Pro Max", "Redmi Note 9 Pro", "Redmi Note 9 5G", "Redmi Note 9", "Redmi Note 9S", "Redmi Note 9T", "Redmi Note 8 Pro", "Redmi Note 8 (2021)", "Redmi Note 8", "Redmi Note 8T", "Redmi Note 7 Pro", "Redmi Note 7", "Redmi Note 7S", "Redmi Note 6 Pro", "Redmi Note 5 Pro", "Redmi Note 5", "Redmi Note 4", "Redmi Note 3", "Redmi Note 2", "Redmi Note"] },
            { name: "Redmi K / Turbo Series", models: ["Redmi K70 Ultra", "Redmi K70 Pro", "Redmi K70", "Redmi K70E", "Redmi K60 Ultra", "Redmi K60 Pro", "Redmi K60", "Redmi K60E", "Redmi K50 Ultra", "Redmi K50 Pro", "Redmi K50", "Redmi K50i", "Redmi K50 Gaming", "Redmi K40 Pro+", "Redmi K40 Pro", "Redmi K40", "Redmi K40S", "Redmi K40 Gaming", "Redmi K30 Pro Zoom", "Redmi K30 Pro", "Redmi K30 Ultra", "Redmi K30 5G", "Redmi K30", "Redmi K30i", "Redmi K30S", "Redmi K20 Pro", "Redmi K20", "Redmi Turbo 3"] },
            { name: "Redmi Numbered / A / C Series", models: ["Redmi 13", "Redmi 13C", "Redmi 13R", "Redmi 12", "Redmi 12C", "Redmi 10", "Redmi 10 Prime", "Redmi 10C", "Redmi 10A", "Redmi 9", "Redmi 9 Prime", "Redmi 9C", "Redmi 9A", "Redmi 9T", "Redmi 8", "Redmi 8A", "Redmi 7", "Redmi 7A", "Redmi 6", "Redmi 6A", "Redmi 6 Pro", "Redmi 5", "Redmi 5A", "Redmi 5 Plus", "Redmi 4", "Redmi 4X", "Redmi 4A", "Redmi 3", "Redmi 3S", "Redmi 2", "Redmi 1", "Redmi A3", "Redmi A2", "Redmi A1"] }
        ]
    },
    {
        brand: "Poco",
        series: [
            { name: "Poco F Series", models: ["Poco F6 Pro", "Poco F6", "Poco F5 Pro", "Poco F5", "Poco F4 GT", "Poco F4", "Poco F3 GT", "Poco F3", "Poco F2 Pro", "Poco F1"] },
            { name: "Poco X Series", models: ["Poco X6 Pro", "Poco X6 Neo", "Poco X6", "Poco X5 Pro", "Poco X5", "Poco X4 GT", "Poco X4 Pro", "Poco X3 Pro", "Poco X3 NFC", "Poco X3 GT", "Poco X3", "Poco X2"] },
            { name: "Poco M Series", models: ["Poco M6 Pro", "Poco M6", "Poco M5s", "Poco M5", "Poco M4 Pro 5G", "Poco M4 Pro", "Poco M4 5G", "Poco M3 Pro 5G", "Poco M3", "Poco M2 Pro", "Poco M2 Reloaded", "Poco M2"] },
            { name: "Poco C Series", models: ["Poco C65", "Poco C61", "Poco C55", "Poco C51", "Poco C50", "Poco C40", "Poco C31", "Poco C3"] }
        ]
    },
    {
        brand: "Oppo",
        series: [
            { name: "Oppo Find Series", models: ["Oppo Find X7 Ultra", "Oppo Find X7", "Oppo Find X6 Pro", "Oppo Find X6", "Oppo Find X5 Pro", "Oppo Find X5", "Oppo Find X5 Lite", "Oppo Find X3 Pro", "Oppo Find X3 Neo", "Oppo Find X3 Lite", "Oppo Find X2 Pro", "Oppo Find X2", "Oppo Find X", "Oppo Find N3 Flip", "Oppo Find N3", "Oppo Find N2 Flip", "Oppo Find N2", "Oppo Find N"] },
            { name: "Oppo Reno Series", models: ["Oppo Reno 12 Pro", "Oppo Reno 12", "Oppo Reno 11 Pro", "Oppo Reno 11", "Oppo Reno 11F", "Oppo Reno 10 Pro+", "Oppo Reno 10 Pro", "Oppo Reno 10", "Oppo Reno 9 Pro+", "Oppo Reno 9 Pro", "Oppo Reno 9", "Oppo Reno 8 Pro+", "Oppo Reno 8 Pro", "Oppo Reno 8", "Oppo Reno 8T", "Oppo Reno 8 Lite", "Oppo Reno 7 Pro", "Oppo Reno 7", "Oppo Reno 7Z 5G", "Oppo Reno 6 Pro+", "Oppo Reno 6 Pro", "Oppo Reno 6", "Oppo Reno 5 Pro+", "Oppo Reno 5 Pro", "Oppo Reno 5", "Oppo Reno 4 Pro", "Oppo Reno 4", "Oppo Reno 3 Pro", "Oppo Reno 3", "Oppo Reno 2", "Oppo Reno 2F", "Oppo Reno 2Z", "Oppo Reno 10x Zoom", "Oppo Reno Z", "Oppo Reno"] },
            { name: "Oppo A Series", models: ["Oppo A98", "Oppo A97", "Oppo A96", "Oppo A95", "Oppo A94", "Oppo A93", "Oppo A92", "Oppo A91", "Oppo A79", "Oppo A78", "Oppo A77", "Oppo A76", "Oppo A74", "Oppo A73", "Oppo A72", "Oppo A59", "Oppo A58", "Oppo A57", "Oppo A55", "Oppo A54", "Oppo A53", "Oppo A52", "Oppo A38", "Oppo A31", "Oppo A18", "Oppo A17", "Oppo A16", "Oppo A15", "Oppo A12", "Oppo A11k", "Oppo A9", "Oppo A7", "Oppo A5", "Oppo A3s", "Oppo A1k"] },
            { name: "Oppo F / K Series", models: ["Oppo F25 Pro", "Oppo F21 Pro", "Oppo F19 Pro+", "Oppo F19 Pro", "Oppo F19", "Oppo F17 Pro", "Oppo F17", "Oppo F15", "Oppo F11 Pro", "Oppo F11", "Oppo F9 Pro", "Oppo F9", "Oppo F7", "Oppo F5", "Oppo K11", "Oppo K11x", "Oppo K10", "Oppo K9 Pro", "Oppo K9", "Oppo K7", "Oppo K5", "Oppo K3"] }
        ]
    },
    {
        brand: "Vivo",
        series: [
            { name: "Vivo X Series", models: ["Vivo X100 Ultra", "Vivo X100 Pro", "Vivo X100", "Vivo X100s", "Vivo X90 Pro+", "Vivo X90 Pro", "Vivo X90", "Vivo X90s", "Vivo X80 Pro", "Vivo X80", "Vivo X70 Pro+", "Vivo X70 Pro", "Vivo X70", "Vivo X60 Pro+", "Vivo X60 Pro", "Vivo X60", "Vivo X50 Pro", "Vivo X50", "Vivo X30 Pro", "Vivo X30", "Vivo X27", "Vivo X23", "Vivo X21", "Vivo X20", "Vivo X9s", "Vivo Xplay6", "Vivo X Note", "Vivo X Fold 3 Pro", "Vivo X Fold 3", "Vivo X Fold 2", "Vivo X Fold"] },
            { name: "Vivo V Series", models: ["Vivo V30 Pro", "Vivo V30", "Vivo V30e", "Vivo V30 Lite", "Vivo V29 Pro", "Vivo V29", "Vivo V29e", "Vivo V29 Lite", "Vivo V27 Pro", "Vivo V27", "Vivo V27e", "Vivo V25 Pro", "Vivo V25", "Vivo V25e", "Vivo V23 Pro", "Vivo V23", "Vivo V23e", "Vivo V21 5G", "Vivo V21", "Vivo V21e", "Vivo V20 Pro", "Vivo V20", "Vivo V20 SE", "Vivo V19", "Vivo V17 Pro", "Vivo V17", "Vivo V15 Pro", "Vivo V15", "Vivo V11 Pro", "Vivo V11", "Vivo V9", "Vivo V7+", "Vivo V7", "Vivo V5 Plus", "Vivo V5"] },
            { name: "Vivo Y / T Series", models: ["Vivo Y200", "Vivo Y100", "Vivo Y78", "Vivo Y77", "Vivo Y75", "Vivo Y73", "Vivo Y58", "Vivo Y56", "Vivo Y55", "Vivo Y53", "Vivo Y51", "Vivo Y50", "Vivo Y36", "Vivo Y35", "Vivo Y33s", "Vivo Y31", "Vivo Y30", "Vivo Y27", "Vivo Y22", "Vivo Y21", "Vivo Y20", "Vivo Y19", "Vivo Y17", "Vivo Y16", "Vivo Y15", "Vivo Y12", "Vivo Y11", "Vivo Y3", "Vivo Y2", "Vivo Y1", "Vivo T3 Pro", "Vivo T3", "Vivo T2 Pro", "Vivo T2", "Vivo T2x", "Vivo T1 Pro", "Vivo T1", "Vivo T1x"] },
            { name: "iQOO Series (Gaming)", models: ["iQOO 12 Pro", "iQOO 12", "iQOO 11 Pro", "iQOO 11", "iQOO 11S", "iQOO 10 Pro", "iQOO 10", "iQOO 9 Pro", "iQOO 9", "iQOO 9 SE", "iQOO 9T", "iQOO 8 Pro", "iQOO 8", "iQOO 7", "iQOO 5 Pro", "iQOO 3", "iQOO Neo 9 Pro", "iQOO Neo 9", "iQOO Neo 8 Pro", "iQOO Neo 8", "iQOO Neo 7 Pro", "iQOO Neo 7", "iQOO Neo 6", "iQOO Neo 5", "iQOO Z9 Turbo", "iQOO Z9", "iQOO Z8", "iQOO Z7 Pro", "iQOO Z7", "iQOO Z6 Pro", "iQOO Z6"] }
        ]
    },
    {
        brand: "Realme",
        series: [
            { name: "Realme Number Series", models: ["Realme 12 Pro+", "Realme 12 Pro", "Realme 12+", "Realme 12", "Realme 11 Pro+", "Realme 11 Pro", "Realme 11", "Realme 11x", "Realme 10 Pro+", "Realme 10 Pro", "Realme 10", "Realme 9 Pro+", "Realme 9 Pro", "Realme 9", "Realme 9i", "Realme 8 Pro", "Realme 8 5G", "Realme 8", "Realme 8i", "Realme 8s", "Realme 7 Pro", "Realme 7 5G", "Realme 7", "Realme 7i", "Realme 6 Pro", "Realme 6", "Realme 6i", "Realme 6s", "Realme 5 Pro", "Realme 5", "Realme 5s", "Realme 5i", "Realme 3 Pro", "Realme 3", "Realme 3i", "Realme 2 Pro", "Realme 2", "Realme 1"] },
            { name: "Realme GT Series", models: ["Realme GT 6", "Realme GT 6T", "Realme GT 5 Pro", "Realme GT 5", "Realme GT 3", "Realme GT 2 Pro", "Realme GT 2", "Realme GT 2 Explorer Master", "Realme GT Neo 6", "Realme GT Neo 5", "Realme GT Neo 3", "Realme GT Neo 3T", "Realme GT Neo 2", "Realme GT Neo", "Realme GT Master Edition", "Realme GT Explorer Master", "Realme GT 5G"] },
            { name: "Realme C / Narzo Series", models: ["Realme C67", "Realme C65", "Realme C55", "Realme C53", "Realme C51", "Realme C35", "Realme C33", "Realme C31", "Realme C30", "Realme C25s", "Realme C25", "Realme C21", "Realme C20", "Realme C15", "Realme C12", "Realme C11", "Realme C3", "Realme C2", "Realme C1", "Realme Narzo 70 Pro", "Realme Narzo 70", "Realme Narzo 60 Pro", "Realme Narzo 60", "Realme Narzo 50 Pro", "Realme Narzo 50", "Realme Narzo 50A", "Realme Narzo 50i", "Realme Narzo 30 Pro", "Realme Narzo 30", "Realme Narzo 20 Pro", "Realme Narzo 20", "Realme Narzo 10", "Realme Narzo 10A"] }
        ]
    },
    {
        brand: "Tecno",
        series: [
            { name: "Tecno Phantom Series", models: ["Tecno Phantom V Fold 2", "Tecno Phantom V Flip 2", "Tecno Phantom V Fold", "Tecno Phantom V Flip", "Tecno Phantom X2 Pro", "Tecno Phantom X2", "Tecno Phantom X", "Tecno Phantom 9", "Tecno Phantom 8", "Tecno Phantom 6 Plus", "Tecno Phantom 6"] },
            { name: "Tecno Camon Series", models: ["Tecno Camon 30 Premier", "Tecno Camon 30 Pro", "Tecno Camon 30 5G", "Tecno Camon 30", "Tecno Camon 20 Premier", "Tecno Camon 20 Pro 5G", "Tecno Camon 20 Pro", "Tecno Camon 20", "Tecno Camon 19 Pro", "Tecno Camon 19", "Tecno Camon 19 Neo", "Tecno Camon 18 Premier", "Tecno Camon 18 Pro", "Tecno Camon 18", "Tecno Camon 18i", "Tecno Camon 18T", "Tecno Camon 18P", "Tecno Camon 17 Pro", "Tecno Camon 17", "Tecno Camon 17P", "Tecno Camon 16 Premier", "Tecno Camon 16 Pro", "Tecno Camon 16", "Tecno Camon 16S", "Tecno Camon 15 Premier", "Tecno Camon 15 Pro", "Tecno Camon 15", "Tecno Camon 12 Pro", "Tecno Camon 12", "Tecno Camon 12 Air", "Tecno Camon 11 Pro", "Tecno Camon 11"] },
            { name: "Tecno Pova / Spark Series", models: ["Tecno Pova 6 Pro", "Tecno Pova 6", "Tecno Pova 5 Pro", "Tecno Pova 5", "Tecno Pova 4 Pro", "Tecno Pova 4", "Tecno Pova Neo 3", "Tecno Pova Neo 2", "Tecno Pova 3", "Tecno Pova 2", "Tecno Pova", "Tecno Spark 20 Pro+", "Tecno Spark 20 Pro", "Tecno Spark 20", "Tecno Spark 20c", "Tecno Spark 10 Pro", "Tecno Spark 10", "Tecno Spark 10c", "Tecno Spark 9 Pro", "Tecno Spark 9", "Tecno Spark 9T", "Tecno Spark 8 Pro", "Tecno Spark 8", "Tecno Spark 8P", "Tecno Spark 8C", "Tecno Spark 7 Pro", "Tecno Spark 7", "Tecno Spark 6", "Tecno Spark 5 Pro", "Tecno Spark 5", "Tecno Spark Power 2", "Tecno Spark 4", "Tecno Pop 8", "Tecno Pop 7 Pro", "Tecno Pop 7", "Tecno Pop 5", "Tecno Pop 4 Pro"] }
        ]
    },
    {
        brand: "Infinix",
        series: [
            { name: "Infinix Zero Series", models: ["Infinix Zero 30 5G", "Infinix Zero 30", "Infinix Zero Ultra", "Infinix Zero 20", "Infinix Zero 5G 2023", "Infinix Zero 5G", "Infinix Zero X Pro", "Infinix Zero X Neo", "Infinix Zero X", "Infinix Zero 8i", "Infinix Zero 8", "Infinix Zero 6 Pro", "Infinix Zero 6", "Infinix Zero 5", "Infinix Zero 4 Plus", "Infinix Zero 4", "Infinix Zero 3"] },
            { name: "Infinix Note Series", models: ["Infinix Note 40 Pro+ 5G", "Infinix Note 40 Pro 5G", "Infinix Note 40 Pro", "Infinix Note 40", "Infinix Note 30 VIP", "Infinix Note 30 Pro", "Infinix Note 30 5G", "Infinix Note 30", "Infinix Note 30i", "Infinix Note 12 Pro 5G", "Infinix Note 12 Pro", "Infinix Note 12 VIP", "Infinix Note 12 G96", "Infinix Note 12 G88", "Infinix Note 12i", "Infinix Note 11 Pro", "Infinix Note 11", "Infinix Note 11s", "Infinix Note 11i", "Infinix Note 10 Pro", "Infinix Note 10", "Infinix Note 8", "Infinix Note 8i", "Infinix Note 7", "Infinix Note 7 Lite", "Infinix Note 5", "Infinix Note 4 Pro", "Infinix Note 4", "Infinix Note 3 Pro", "Infinix Note 3"] },
            { name: "Infinix Hot / Smart Series", models: ["Infinix Hot 40 Pro", "Infinix Hot 40", "Infinix Hot 40i", "Infinix Hot 30 5G", "Infinix Hot 30", "Infinix Hot 30i", "Infinix Hot 30 Play", "Infinix Hot 20 5G", "Infinix Hot 20 Pro", "Infinix Hot 20", "Infinix Hot 20i", "Infinix Hot 20S", "Infinix Hot 12 Pro", "Infinix Hot 12", "Infinix Hot 12i", "Infinix Hot 12 Play", "Infinix Hot 11S", "Infinix Hot 11", "Infinix Hot 11 Play", "Infinix Hot 10 Pro", "Infinix Hot 10", "Infinix Hot 10i", "Infinix Hot 10S", "Infinix Hot 10 Play", "Infinix Hot 9 Pro", "Infinix Hot 9", "Infinix Hot 9 Play", "Infinix Hot 8", "Infinix Hot 7 Pro", "Infinix Hot 7", "Infinix Hot 6 Pro", "Infinix Hot 6", "Infinix Smart 8 Pro", "Infinix Smart 8", "Infinix Smart 7 Plus", "Infinix Smart 7", "Infinix Smart 6 Plus", "Infinix Smart 6", "Infinix Smart 5 Pro", "Infinix Smart 5", "Infinix Smart 4 Plus", "Infinix Smart 4"] },
            { name: "Infinix GT Series (Gaming)", models: ["Infinix GT 20 Pro", "Infinix GT 10 Pro"] }
        ]
    },
    {
        brand: "Huawei",
        series: [
            { name: "Huawei P / Pura Series", models: ["Huawei Pura 70 Ultra", "Huawei Pura 70 Pro+", "Huawei Pura 70 Pro", "Huawei Pura 70", "Huawei P60 Pro", "Huawei P60 Art", "Huawei P60", "Huawei P50 Pro", "Huawei P50 Pocket", "Huawei P50", "Huawei P50E", "Huawei P40 Pro+", "Huawei P40 Pro", "Huawei P40", "Huawei P40 Lite", "Huawei P40 Lite 5G", "Huawei P30 Pro", "Huawei P30", "Huawei P30 Lite", "Huawei P20 Pro", "Huawei P20", "Huawei P20 Lite", "Huawei P10 Plus", "Huawei P10", "Huawei P10 Lite", "Huawei P9 Plus", "Huawei P9", "Huawei P9 Lite", "Huawei P8", "Huawei P8 Lite"] },
            { name: "Huawei Mate Series", models: ["Huawei Mate 60 Pro+", "Huawei Mate 60 Pro", "Huawei Mate 60", "Huawei Mate X5", "Huawei Mate X3", "Huawei Mate 50 Pro", "Huawei Mate 50", "Huawei Mate 50 RS", "Huawei Mate 50E", "Huawei Mate Xs 2", "Huawei Mate 40 Pro+", "Huawei Mate 40 Pro", "Huawei Mate 40", "Huawei Mate 40 RS", "Huawei Mate 40E", "Huawei Mate 30 Pro", "Huawei Mate 30", "Huawei Mate 30 RS", "Huawei Mate 30E Pro", "Huawei Mate X2", "Huawei Mate 20 Pro", "Huawei Mate 20", "Huawei Mate 20 X", "Huawei Mate 20 RS", "Huawei Mate 10 Pro", "Huawei Mate 10", "Huawei Mate 9 Pro", "Huawei Mate 9", "Huawei Mate 8", "Huawei Mate 7", "Huawei Mate S"] },
            { name: "Huawei Nova Series", models: ["Huawei Nova 12 Ultra", "Huawei Nova 12 Pro", "Huawei Nova 12", "Huawei Nova 12 Lite", "Huawei Nova 12s", "Huawei Nova 11 Ultra", "Huawei Nova 11 Pro", "Huawei Nova 11", "Huawei Nova 11i", "Huawei Nova 10 Pro", "Huawei Nova 10", "Huawei Nova 10 SE", "Huawei Nova 9 Pro", "Huawei Nova 9", "Huawei Nova 9 SE", "Huawei Nova 8 Pro", "Huawei Nova 8", "Huawei Nova 8 SE", "Huawei Nova 7 Pro", "Huawei Nova 7", "Huawei Nova 7 SE", "Huawei Nova 7i", "Huawei Nova 6", "Huawei Nova 6 SE", "Huawei Nova 5 Pro", "Huawei Nova 5", "Huawei Nova 5T", "Huawei Nova 5i", "Huawei Nova 4", "Huawei Nova 3", "Huawei Nova 3i", "Huawei Nova 2 Plus", "Huawei Nova 2", "Huawei Nova Plus", "Huawei Nova"] },
            { name: "Huawei Y / Enjoy Series", models: ["Huawei Y9a", "Huawei Y9s", "Huawei Y9 Prime 2019", "Huawei Y9 (2019)", "Huawei Y8p", "Huawei Y8s", "Huawei Y7p", "Huawei Y7 Prime (2019)", "Huawei Y7 (2019)", "Huawei Y6p", "Huawei Y6s", "Huawei Y6 (2019)", "Huawei Y5p", "Huawei Y5 (2019)", "Huawei Enjoy 70 Pro", "Huawei Enjoy 70", "Huawei Enjoy 60X", "Huawei Enjoy 60", "Huawei Enjoy 50", "Huawei Enjoy 20 Plus", "Huawei Enjoy 20", "Huawei Enjoy 10 Plus", "Huawei Enjoy 10"] }
        ]
    },
    {
        brand: "Honor",
        series: [
            { name: "Honor Magic / Number Series", models: ["Honor Magic 6 Pro", "Honor Magic 6", "Honor Magic 6 Lite", "Honor Magic 5 Pro", "Honor Magic 5", "Honor Magic 5 Ultimate", "Honor Magic 4 Pro", "Honor Magic 4", "Honor Magic 4 Ultimate", "Honor Magic 3 Pro", "Honor Magic 3", "Honor Magic V2", "Honor Magic Vs2", "Honor Magic V", "Honor Magic Vs", "Honor 200 Pro", "Honor 200", "Honor 200 Lite", "Honor 100 Pro", "Honor 100", "Honor 90 Pro", "Honor 90", "Honor 90 Lite", "Honor 80 Pro", "Honor 80", "Honor 80 SE", "Honor 80 GT", "Honor 70 Pro+", "Honor 70 Pro", "Honor 70", "Honor 60 Pro", "Honor 60", "Honor 50 Pro", "Honor 50", "Honor 50 SE", "Honor 50 Lite", "Honor 30 Pro+", "Honor 30 Pro", "Honor 30", "Honor 30S", "Honor 20 Pro", "Honor 20", "Honor 10", "Honor 9", "Honor 8 Pro", "Honor 8X", "Honor 8"] },
            { name: "Honor X / Play Series", models: ["Honor X9b", "Honor X9a", "Honor X8b", "Honor X8a", "Honor X7b", "Honor X7a", "Honor X50 Pro", "Honor X50", "Honor X50 GT", "Honor X50i+", "Honor X40 GT", "Honor X40", "Honor X30 Pro", "Honor X30", "Honor X20", "Honor X10 5G", "Honor X10 Max", "Honor 9X Pro", "Honor 9X", "Honor 8X Max", "Honor Play 60 Plus", "Honor Play 50", "Honor Play 40", "Honor Play 30", "Honor Play 8T", "Honor Play 7T", "Honor Play 40C", "Honor Play 40 Plus", "Honor Play 20", "Honor Play 5T Pro", "Honor Play 5T", "Honor Play 4 Pro", "Honor Play 4", "Honor Play 3", "Honor Play"] }
        ]
    },
    {
        brand: "Nokia",
        series: [
            { name: "Nokia G / X Series", models: ["Nokia G42 5G", "Nokia G310 5G", "Nokia G100", "Nokia G60 5G", "Nokia G50", "Nokia G400 5G", "Nokia G21", "Nokia G20", "Nokia G11 Plus", "Nokia G11", "Nokia G10", "Nokia X30 5G", "Nokia X20", "Nokia X10", "Nokia XR21", "Nokia XR20"] },
            { name: "Nokia C Series", models: ["Nokia C210", "Nokia C300", "Nokia C110", "Nokia C32", "Nokia C22", "Nokia C12 Pro", "Nokia C12", "Nokia C31", "Nokia C21 Plus", "Nokia C21", "Nokia C20 Plus", "Nokia C20", "Nokia C10", "Nokia C3", "Nokia C2 Tennen", "Nokia C2 Tava", "Nokia C2", "Nokia C1 Plus", "Nokia C1"] },
            { name: "Nokia Numbered / Lumia Series", models: ["Nokia 9 PureView", "Nokia 8.3 5G", "Nokia 8.1", "Nokia 8 Sirocco", "Nokia 7 Plus", "Nokia 7.2", "Nokia 7.1", "Nokia 6.2", "Nokia 6.1 Plus", "Nokia 6.1", "Nokia 5.4", "Nokia 5.3", "Nokia 4.2", "Nokia 3.4", "Nokia 3.2", "Nokia 2.4", "Nokia 2.3", "Nokia 1.4", "Nokia 1.3", "Nokia Lumia 1520", "Nokia Lumia 1020", "Nokia Lumia 930", "Nokia Lumia 925", "Nokia Lumia 920", "Nokia Lumia 830", "Nokia Lumia 735", "Nokia Lumia 640 XL", "Nokia Lumia 640", "Nokia Lumia 635", "Nokia Lumia 535", "Nokia Lumia 520"] }
        ]
    },
    {
        brand: "Motorola",
        series: [
            { name: "Moto Edge / Razr Series", models: ["Motorola Edge 50 Ultra", "Motorola Edge 50 Pro", "Motorola Edge 50 Fusion", "Motorola Edge 40 Pro", "Motorola Edge 40", "Motorola Edge 40 Neo", "Motorola Edge 30 Ultra", "Motorola Edge 30 Fusion", "Motorola Edge 30 Pro", "Motorola Edge 30", "Motorola Edge 30 Neo", "Motorola Edge 20 Pro", "Motorola Edge 20", "Motorola Edge 20 Lite", "Motorola Edge (2023)", "Motorola Edge (2022)", "Motorola Edge+", "Motorola Razr 50 Ultra", "Motorola Razr 50", "Motorola Razr 40 Ultra", "Motorola Razr 40", "Motorola Razr 2022", "Motorola Razr 5G", "Motorola Razr (2019)"] },
            { name: "Moto G Series", models: ["Moto G85", "Moto G84", "Moto G75", "Moto G73", "Moto G64", "Moto G62", "Moto G54", "Moto G53", "Moto G52", "Moto G42", "Moto G34", "Moto G32", "Moto G24", "Moto G23", "Moto G22", "Moto G14", "Moto G13", "Moto G100", "Moto G200", "Moto G Pure", "Moto G Stylus (2024)", "Moto G Stylus (2023)", "Moto G Stylus 5G", "Moto G Power (2024)", "Moto G Power (2023)", "Moto G Play (2024)", "Moto G Play (2023)", "Moto G71", "Moto G60s", "Moto G60", "Moto G51", "Moto G50", "Moto G41", "Moto G40 Fusion", "Moto G31", "Moto G30", "Moto G20", "Moto G10", "Moto G9 Plus", "Moto G9 Power", "Moto G9 Play", "Moto G8 Power", "Moto G8 Plus", "Moto G7 Power", "Moto G7 Plus", "Moto G6 Plus"] },
            { name: "Moto E / Z / X Series", models: ["Moto E13", "Moto E40", "Moto E32", "Moto E30", "Moto E22", "Moto E20", "Moto E7 Plus", "Moto E7 Power", "Moto E6s", "Moto E6 Plus", "Moto Z4", "Moto Z3 Play", "Moto Z3", "Moto Z2 Force", "Moto Z2 Play", "Moto Z Play", "Moto Z Force", "Moto Z", "Moto X4", "Moto X Style", "Moto X Pure Edition", "Moto X Play", "Moto X Force", "Moto X (2014)", "Moto X (1st Gen)"] }
        ]
    },
    {
        brand: "OnePlus",
        series: [
            { name: "OnePlus Numbered / T Series", models: ["OnePlus 12", "OnePlus 12R", "OnePlus 11", "OnePlus 11R", "OnePlus 10 Pro", "OnePlus 10T", "OnePlus 10R", "OnePlus 9 Pro", "OnePlus 9", "OnePlus 9RT", "OnePlus 9R", "OnePlus 8 Pro", "OnePlus 8", "OnePlus 8T", "OnePlus 7T Pro", "OnePlus 7T", "OnePlus 7 Pro", "OnePlus 7", "OnePlus 6T", "OnePlus 6", "OnePlus 5T", "OnePlus 5", "OnePlus 3T", "OnePlus 3", "OnePlus 2", "OnePlus One", "OnePlus Open"] },
            { name: "OnePlus Nord Series", models: ["OnePlus Nord 4", "OnePlus Nord 3", "OnePlus Nord 2T", "OnePlus Nord 2", "OnePlus Nord", "OnePlus Nord CE 4", "OnePlus Nord CE 3", "OnePlus Nord CE 3 Lite", "OnePlus Nord CE 2", "OnePlus Nord CE 2 Lite", "OnePlus Nord CE", "OnePlus Nord N30", "OnePlus Nord N20", "OnePlus Nord N20 SE", "OnePlus Nord N10", "OnePlus Nord N100", "OnePlus Nord N200"] }
        ]
    },
    {
        brand: "Google Pixel",
        series: [
            { name: "Pixel Series", models: ["Google Pixel 8 Pro", "Google Pixel 8", "Google Pixel 8a", "Google Pixel 7 Pro", "Google Pixel 7", "Google Pixel 7a", "Google Pixel 6 Pro", "Google Pixel 6", "Google Pixel 6a", "Google Pixel 5a 5G", "Google Pixel 5", "Google Pixel 4a 5G", "Google Pixel 4a", "Google Pixel 4 XL", "Google Pixel 4", "Google Pixel 3a XL", "Google Pixel 3a", "Google Pixel 3 XL", "Google Pixel 3", "Google Pixel 2 XL", "Google Pixel 2", "Google Pixel XL", "Google Pixel", "Google Pixel Fold", "Google Pixel Tablet"] }
        ]
    },
    {
        brand: "Sony",
        series: [
            { name: "Xperia 1 / 5 Series (Flagship)", models: ["Sony Xperia 1 VI", "Sony Xperia 1 V", "Sony Xperia 1 IV", "Sony Xperia 1 III", "Sony Xperia 1 II", "Sony Xperia 1", "Sony Xperia 5 V", "Sony Xperia 5 IV", "Sony Xperia 5 III", "Sony Xperia 5 II", "Sony Xperia 5"] },
            { name: "Xperia 10 / L Series (Mid-range)", models: ["Sony Xperia 10 VI", "Sony Xperia 10 V", "Sony Xperia 10 IV", "Sony Xperia 10 III", "Sony Xperia 10 II", "Sony Xperia 10", "Sony Xperia L4", "Sony Xperia L3", "Sony Xperia L2", "Sony Xperia L1"] },
            { name: "Xperia X / Z Series (Classic)", models: ["Sony Xperia XZ3", "Sony Xperia XZ2 Premium", "Sony Xperia XZ2", "Sony Xperia XZ2 Compact", "Sony Xperia XZ1", "Sony Xperia XZ Premium", "Sony Xperia XZs", "Sony Xperia XZ", "Sony Xperia X Performance", "Sony Xperia X", "Sony Xperia X Compact", "Sony Xperia Z5 Premium", "Sony Xperia Z5", "Sony Xperia Z5 Compact", "Sony Xperia Z3+", "Sony Xperia Z3", "Sony Xperia Z3 Compact", "Sony Xperia Z2", "Sony Xperia Z1", "Sony Xperia Z", "Sony Xperia Z Ultra"] }
        ]
    },
    {
        brand: "LG",
        series: [
            { name: "LG V / G Series (Flagship)", models: ["LG V60 ThinQ 5G", "LG V50 ThinQ 5G", "LG V40 ThinQ", "LG V35 ThinQ", "LG V30", "LG V20", "LG V10", "LG G8 ThinQ", "LG G8s ThinQ", "LG G8x ThinQ", "LG G7 ThinQ", "LG G6", "LG G5", "LG G4", "LG G3", "LG G2"] },
            { name: "LG Velvet / Wing Series", models: ["LG Velvet 5G", "LG Velvet", "LG Wing 5G"] },
            { name: "LG K / Q / Stylo Series", models: ["LG K92 5G", "LG K71", "LG K62", "LG K61", "LG K52", "LG K51s", "LG K50s", "LG K42", "LG K41s", "LG K40s", "LG K31", "LG K30 (2019)", "LG K20 (2019)", "LG K10 (2018)", "LG Q92 5G", "LG Q70", "LG Q60", "LG Q52", "LG Q51", "LG Q31", "LG Q7", "LG Q6", "LG Stylo 6", "LG Stylo 5", "LG Stylo 4", "LG Stylo 3 Plus", "LG Stylo 2"] }
        ]
    },
    {
        brand: "Asus",
        series: [
            {
                name: "ROG Phone Series (Gaming)", models: [
                    { name: "Asus ROG Phone 8 Pro", touchSampling: "720Hz", latency: "12ms", score: 99 },
                    { name: "Asus ROG Phone 8", touchSampling: "720Hz", latency: "14ms", score: 98 },
                    { name: "Asus ROG Phone 7 Ultimate", touchSampling: "720Hz", latency: "15ms", score: 97 },
                    "Asus ROG Phone 7", "Asus ROG Phone 6 Pro", "Asus ROG Phone 6D Ultimate", "Asus ROG Phone 6D", "Asus ROG Phone 6", "Asus ROG Phone 5s Pro", "Asus ROG Phone 5s", "Asus ROG Phone 5 Ultimate", "Asus ROG Phone 5 Pro", "Asus ROG Phone 5", "Asus ROG Phone 3", "Asus ROG Phone II", "Asus ROG Phone"
                ]
            },
            { name: "Zenfone Series", models: ["Asus Zenfone 11 Ultra", "Asus Zenfone 10", "Asus Zenfone 9", "Asus Zenfone 8 Flip", "Asus Zenfone 8", "Asus Zenfone 7 Pro", "Asus Zenfone 7", "Asus Zenfone 6", "Asus Zenfone 5z", "Asus Zenfone 5", "Asus Zenfone 4 Pro", "Asus Zenfone 4", "Asus Zenfone 3 Deluxe", "Asus Zenfone 3", "Asus Zenfone 2"] }
        ]
    },
    {
        brand: "ZTE",
        series: [
            { name: "ZTE Axon Series", models: ["ZTE Axon 60 Ultra", "ZTE Axon 60", "ZTE Axon 50 Ultra", "ZTE Axon 50", "ZTE Axon 40 Ultra", "ZTE Axon 40 Pro", "ZTE Axon 30 Ultra", "ZTE Axon 30 Pro", "ZTE Axon 30", "ZTE Axon 20 5G", "ZTE Axon 11", "ZTE Axon 10 Pro 5G", "ZTE Axon 10 Pro", "ZTE Axon 9 Pro", "ZTE Axon 7", "ZTE Axon 7 Mini"] },
            { name: "Nubia / RedMagic Series", models: ["Nubia Z60 Ultra", "Nubia Z50S Pro", "Nubia Z50 Ultra", "Nubia Z50", "Nubia Z40 Pro", "Nubia Z30 Pro", "Nubia RedMagic 9 Pro+", "Nubia RedMagic 9 Pro", "Nubia RedMagic 8S Pro", "Nubia RedMagic 8 Pro", "Nubia RedMagic 7S Pro", "Nubia RedMagic 7 Pro", "Nubia RedMagic 7Plus", "Nubia RedMagic 6S Pro", "Nubia RedMagic 6 Pro", "Nubia RedMagic 6", "Nubia RedMagic 6R", "Nubia RedMagic 5G", "Nubia RedMagic 5S", "Nubia RedMagic 3S", "Nubia RedMagic 3", "Nubia RedMagic Mars", "Nubia RedMagic"] },
            { name: "ZTE Blade Series", models: ["ZTE Blade V50 Design", "ZTE Blade V50", "ZTE Blade V40 Design", "ZTE Blade V40 Vita", "ZTE Blade V40 Pro", "ZTE Blade V41 Vita", "ZTE Blade V30", "ZTE Blade V2020", "ZTE Blade V10", "ZTE Blade V9", "ZTE Blade V8", "ZTE Blade A73", "ZTE Blade A72", "ZTE Blade A53", "ZTE Blade A52", "ZTE Blade A34", "ZTE Blade A31"] }
        ]
    },
    {
        brand: "itel",
        series: [
            { name: "itel S / P Series", models: ["itel S24", "itel S23+", "itel S23", "itel S18 Pro", "itel S18", "itel S17", "itel S16 Pro", "itel S16", "itel S15 Pro", "itel S15", "itel P55+", "itel P55", "itel P40", "itel P38 Pro", "itel P38", "itel P37 Pro", "itel P37", "itel P36 Pro", "itel P36"] },
            { name: "itel A Series", models: ["itel A70", "itel A60s", "itel A60", "itel A58", "itel A56", "itel A49", "itel A48", "itel A37", "itel A36", "itel A33", "itel A27", "itel A26", "itel A25", "itel A23 Pro"] }
        ]
    },
    {
        brand: "Lenovo",
        series: [
            { name: "Lenovo Legion Series (Gaming)", models: ["Lenovo Legion Y70", "Lenovo Legion Y90", "Lenovo Legion Duel 2", "Lenovo Legion Duel", "Lenovo Legion Phone Duel", "Lenovo Legion Pro"] },
            { name: "Lenovo K / Z / Phab Series", models: ["Lenovo K15", "Lenovo K14 Plus", "Lenovo K13 Pro", "Lenovo K13 Note", "Lenovo K12 Pro", "Lenovo K12", "Lenovo K10 Note", "Lenovo K10 Plus", "Lenovo K9", "Lenovo K8 Note", "Lenovo K8 Plus", "Lenovo K6 Note", "Lenovo K6 Enjoy", "Lenovo K5 Pro", "Lenovo K5 Note", "Lenovo Z6 Pro", "Lenovo Z6", "Lenovo Z6 Lite", "Lenovo Z5 Pro GT", "Lenovo Z5 Pro", "Lenovo Z5s", "Lenovo Z5", "Lenovo S5 Pro", "Lenovo S5", "Lenovo Phab 2 Pro", "Lenovo Phab 2 Plus", "Lenovo Phab 2", "Lenovo Vibe X3", "Lenovo Vibe Shot", "Lenovo Vibe P1"] }
        ]
    },
    {
        brand: "Meizu",
        series: [
            { name: "Meizu Number Series", models: ["Meizu 21 Pro", "Meizu 21", "Meizu 20 Pro", "Meizu 20", "Meizu 20 Infinity", "Meizu 18s Pro", "Meizu 18s", "Meizu 18 Pro", "Meizu 18", "Meizu 18X", "Meizu 17 Pro", "Meizu 17", "Meizu 16s Pro", "Meizu 16s", "Meizu 16th", "Meizu 16th Plus", "Meizu 16xs", "Meizu 16T", "Meizu 15 Plus", "Meizu 15", "Meizu MX6", "Meizu MX5", "Meizu Pro 7 Plus", "Meizu Pro 7", "Meizu Pro 6 Plus", "Meizu Pro 6", "Meizu Pro 5"] },
            { name: "Meizu Note / M Series", models: ["Meizu Note 9", "Meizu Note 8", "Meizu M6 Note", "Meizu M5 Note", "Meizu M3 Note", "Meizu M6s", "Meizu M6", "Meizu M5s", "Meizu M5", "Meizu M3s", "Meizu M3", "Meizu M2 Note", "Meizu M1 Note"] }
        ]
    },
    {
        brand: "Black Shark",
        series: [
            { name: "Black Shark Series (Gaming)", models: ["Black Shark 5 Pro", "Black Shark 5 RS", "Black Shark 5", "Black Shark 4S Pro", "Black Shark 4S", "Black Shark 4 Pro", "Black Shark 4", "Black Shark 3 Pro", "Black Shark 3", "Black Shark 3S", "Black Shark 2 Pro", "Black Shark 2", "Black Shark Helo", "Black Shark"] }
        ]
    },
    {
        brand: "RedMagic",
        series: [
            { name: "RedMagic Series (Gaming)", models: ["RedMagic 9 Pro+", "RedMagic 9 Pro", "RedMagic 8S Pro", "RedMagic 8 Pro", "RedMagic 7S Pro", "RedMagic 7 Pro", "RedMagic 7", "RedMagic 6S Pro", "RedMagic 6 Pro", "RedMagic 6", "RedMagic 6R", "RedMagic 5G", "RedMagic 5S", "RedMagic 3S", "RedMagic 3", "RedMagic Mars", "RedMagic"] }
        ]
    },
    {
        brand: "Generic / Other",
        series: [
            { name: "Generic Android", models: ["Standard Android Phone", "High-End Android Phone", "Budget Android Phone", "Gaming Android Phone"] },
            { name: "Generic iPhone", models: ["Standard iPhone Model", "Pro/Max iPhone Model"] },
            { name: "Tablets", models: ["Android Tablet", "iPad Model"] }
        ]
    }
];
