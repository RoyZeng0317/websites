// Scan images/<deck>/ and (re)build images/<deck>/manifest.json.
// The English word is taken from the file name: "ice-cream.jpg" -> "ice cream".
// Fields you add by hand to manifest.json (zh, example) are kept on rebuild.
// Usage: node scripts/build-image-vocab.mjs [deck]   (default: ice-food)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'images');
const deck = process.argv[2] || 'ice-food';
const dir = path.join(root, deck);
const manifestPath = path.join(dir, 'manifest.json');
const IMG = /\.(jpe?g|png|webp|gif|avif)$/i;

if (!fs.existsSync(dir)) { console.error(`Folder not found: ${dir}`); process.exit(1); }

const old = new Map();
if (fs.existsSync(manifestPath)) {
  for (const e of JSON.parse(fs.readFileSync(manifestPath, 'utf8'))) old.set(e.image, e);
}

const toWord = (file) => path.basename(file, path.extname(file))
  .replace(/[_-]+/g, ' ').replace(/\s*\(\d+\)$/, '').replace(/\s+\d+$/, '')
  .replace(/\s+/g, ' ').trim().toLowerCase();

const entries = fs.readdirSync(dir).filter(f => IMG.test(f)).sort().map(f => {
  const prev = old.get(f) || {};
  return { word: prev.word || toWord(f), image: f, zh: prev.zh || '', example: prev.example || '' };
});

fs.writeFileSync(manifestPath, JSON.stringify(entries, null, 2) + '\n');
console.log(`${entries.length} image card(s) written to ${path.relative(process.cwd(), manifestPath)}`);
