import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Base structural framework for brands and their series paradigms
const brandsConfig = [
    { brand: 'Xiaomi', series: ['Mi', 'Mix', 'Note', 'Max', 'Civi'], startNum: 1, endNum: 15, suffixes: ['', ' Pro', ' Ultra', ' Lite', 'T', 'T Pro', 'i', 'X', 'S'] },
    { brand: 'Redmi', series: ['Note', 'K', 'Numbered'], startNum: 1, endNum: 15, suffixes: ['', ' Pro', ' Pro+', ' Pro Max', ' 5G', 'S', 'T', 'A', 'C', ' Prime'] },
    { brand: 'Poco', series: ['F', 'X', 'M', 'C'], startNum: 1, endNum: 7, suffixes: ['', ' Pro', ' GT', ' NFC', 's'] },
    { brand: 'Samsung', series: ['Galaxy S', 'Galaxy A', 'Galaxy M', 'Galaxy F', 'Galaxy Z Fold', 'Galaxy Z Flip', 'Galaxy Note'], startNum: 1, endNum: 99, suffixes: ['', '+', ' Ultra', ' FE', ' 5G', 's', ' Core'] },
    { brand: 'Apple', series: ['iPhone'], startNum: 4, endNum: 16, suffixes: ['', ' Plus', ' Pro', ' Pro Max', ' mini'] },
    { brand: 'Tecno', series: ['Camon', 'Spark', 'Pova', 'Phantom', 'Pop'], startNum: 4, endNum: 30, suffixes: ['', ' Pro', ' Premier', ' 5G', ' Neo', 'C', ' Plus'] },
    { brand: 'Infinix', series: ['Note', 'Hot', 'Zero', 'Smart', 'GT'], startNum: 3, endNum: 45, suffixes: ['', ' Pro', ' Pro+', ' VIP', ' 5G', ' Play', 'i', 's'] },
    { brand: 'itel', series: ['A', 'P', 'S', 'Vision'], startNum: 11, endNum: 75, suffixes: ['', ' Pro', ' Plus', 's'] },
    { brand: 'Vivo', series: ['X', 'V', 'Y', 'T'], startNum: 1, endNum: 100, suffixes: ['', ' Pro', ' Pro+', 's', 'e', ' 5G', ' Plus'] },
    { brand: 'iQOO', series: ['Numbered', 'Neo', 'Z'], startNum: 3, endNum: 13, suffixes: ['', ' Pro', ' SE', 'T', 'x', ' Turbo'] },
    { brand: 'Oppo', series: ['Find X', 'Reno', 'A', 'F', 'K'], startNum: 1, endNum: 99, suffixes: ['', ' Pro', ' Pro+', ' Lite', ' Neo', 'Z', 's', 'F'] },
    { brand: 'Realme', series: ['Numbered', 'GT', 'C', 'Narzo'], startNum: 1, endNum: 60, suffixes: ['', ' Pro', ' Pro+', ' Neo', ' Master Explorer', 's', 'i', 'a'] },
    { brand: 'Motorola', series: ['Edge', 'Moto G', 'Moto E', 'Defy', 'Razr'], startNum: 10, endNum: 90, suffixes: ['', ' Pro', ' Fusion', ' Neo', ' Power', ' Play', ' Stylus'] },
    { brand: 'Huawei', series: ['P', 'Mate', 'Nova', 'Y', 'Enjoy'], startNum: 8, endNum: 70, suffixes: ['', ' Pro', ' Pro+', ' RS', ' Lite', ' SE', 's', 'i'] },
    { brand: 'Honor', series: ['Magic', 'Numbered', 'X', 'Play'], startNum: 8, endNum: 100, suffixes: ['', ' Pro', ' Ultimate', ' Lite', 'a', 'b', 'c'] }
];

const generatedDevices = [];
let totalCount = 0;

// Deterministic mock generation logic for latency and sensitivity
function generateStats(brand, seriesName, suffix) {
    const isProOrGaming = suffix.includes('Pro') || suffix.includes('Ultra') || suffix.includes('GT') || seriesName.includes('ROG');
    const isBudget = seriesName.includes('A') || seriesName.includes('Y') || seriesName.includes('C') || seriesName.includes('Smart');

    let touchSampling = "120Hz";
    let latency = "30ms";
    let score = 75;

    if (isProOrGaming) {
        touchSampling = Math.random() > 0.5 ? "240Hz" : "360Hz";
        latency = Math.floor(Math.random() * (20 - 12 + 1) + 12) + "ms";
        score = Math.floor(Math.random() * (99 - 88 + 1) + 88);
    } else if (isBudget) {
        touchSampling = "60Hz";
        latency = Math.floor(Math.random() * (60 - 45 + 1) + 45) + "ms";
        score = Math.floor(Math.random() * (60 - 40 + 1) + 40);
    } else {
        touchSampling = "120Hz";
        latency = Math.floor(Math.random() * (40 - 25 + 1) + 25) + "ms";
        score = Math.floor(Math.random() * (85 - 65 + 1) + 65);
    }

    return { touchSampling, latency, score };
}

brandsConfig.forEach(({ brand, series, startNum, endNum, suffixes }) => {
    series.forEach(seriesName => {
        for (let num = startNum; num <= endNum; num++) {

            if (num > 20 && num % 10 !== 0 && num % 10 !== 5 && seriesName !== 'Galaxy A' && seriesName !== 'Galaxy M') continue;

            suffixes.forEach(suffix => {
                let modelName = `${brand} ${seriesName !== 'Numbered' ? seriesName + ' ' : ''}${num}${suffix}`.replace(/\s+/g, ' ').trim();

                if (brand === 'Apple' && num < 11 && (suffix.includes('Pro') || suffix.includes('Max') || suffix.includes('mini'))) return;

                const stats = generateStats(brand, seriesName, suffix);

                generatedDevices.push({
                    id: `${brand.toLowerCase()}-${totalCount}`,
                    brand,
                    series: seriesName === 'Numbered' ? brand + ' Series' : seriesName,
                    name: modelName,
                    ...stats
                });
                totalCount++;
            });
        }
    });
});

console.log(`Successfully generated ${totalCount} valid device models.`);

const outputPath = path.join(__dirname, '..', 'frontend', 'src', 'data', 'devices.json');
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(generatedDevices, null, 2));

console.log(`Saved massively expanded dataset to ${outputPath}`);
