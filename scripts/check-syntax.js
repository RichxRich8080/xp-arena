const { execFileSync } = require('node:child_process');
const { readdirSync, statSync } = require('node:fs');
const path = require('node:path');

const ROOT = process.cwd();
const SKIP_DIRS = new Set(['node_modules', '.git', '.vercel']);
const TARGET_EXTENSIONS = new Set(['.js', '.mjs', '.cjs']);

function walk(dir, files = []) {
    for (const entry of readdirSync(dir)) {
        const fullPath = path.join(dir, entry);
        const relPath = path.relative(ROOT, fullPath);
        const stats = statSync(fullPath);
        if (stats.isDirectory()) {
            if (!SKIP_DIRS.has(entry)) walk(fullPath, files);
            continue;
        }
        if (TARGET_EXTENSIONS.has(path.extname(entry))) {
            files.push(relPath);
        }
    }
    return files;
}

const files = walk(ROOT);
let failed = false;

for (const file of files) {
    try {
        execFileSync(process.execPath, ['--check', file], { stdio: 'pipe' });
    } catch (error) {
        failed = true;
        process.stderr.write(`Syntax check failed: ${file}\n`);
        process.stderr.write(error.stderr?.toString() || error.message);
    }
}

if (failed) {
    process.exit(1);
}

console.log(`Syntax check passed for ${files.length} files.`);
