const fs = require('fs');
const https = require('https');
const path = require('path');

const dir = __dirname;

function download(url, dest) {
    return new Promise((resolve, reject) => {
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        const file = fs.createWriteStream(dest);
        https.get(url, response => {
            if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
                return download(response.headers.location, dest).then(resolve).catch(reject);
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close(resolve);
            });
        }).on('error', err => {
            fs.unlink(dest, () => { });
            reject(err);
        });
    });
}

async function run() {
    console.log("Downloading images...");
    await download('https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop', path.join(dir, 'assets/images/video-guide.jpg'));
    await download('https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=800&auto=format&fit=crop', path.join(dir, 'assets/images/featured-clip.jpg'));
    await download('https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=1200&auto=format&fit=crop', path.join(dir, 'assets/images/og-image.jpg'));

    console.log("Downloading FontAwesome CSS...");
    await download('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css', path.join(dir, 'assets/fontawesome/css/all.min.css'));

    const exts = ['woff2', 'woff', 'ttf'];
    const fonts = ['fa-solid-900', 'fa-regular-400', 'fa-brands-400', 'fa-v4compat'];

    for (let f of fonts) {
        for (let e of exts) {
            console.log(`Downloading ${f}.${e}...`);
            await download(`https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/webfonts/${f}.${e}`, path.join(dir, `assets/fontawesome/webfonts/${f}.${e}`));
        }
    }

    console.log("Updating HTML files...");
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));
    for (let f of files) {
        let content = fs.readFileSync(path.join(dir, f), 'utf-8');
        content = content.replace(/https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/font-awesome\/6\.0\.0\/css\/all\.min\.css/g, 'assets/fontawesome/css/all.min.css');
        fs.writeFileSync(path.join(dir, f), content);
    }
    console.log("Done.");
}

run().catch(console.error);
