// Rasterise les SVG de la carte en PNG @2x via Playwright (aperçu ; les SVG restent la source
// de vérité pour l'imprimeur). Sort recto/verso + les 2 masques spot-UV dans output/.
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const DIR = __dirname;
const OUT = path.join(DIR, 'output');
const W = 675, H = 1125, SCALE = 2;   // -> PNG 1350x2250 (600 DPI d'aperçu)

const TARGETS = [
  'card-front.svg',
  'card-back.svg',
  'card-front-spotuv.svg',
  'card-back-spotuv.svg',
];

function wrap(svg) {
  return `<!doctype html><html><head><meta charset="utf-8">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>html,body{margin:0;padding:0;background:#000}svg{display:block}</style></head>
  <body>${svg}</body></html>`;
}

(async () => {
  if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ deviceScaleFactor: SCALE, viewport: { width: W, height: H } });
  const page = await ctx.newPage();

  for (const name of TARGETS) {
    const src = path.join(DIR, name);
    if (!fs.existsSync(src)) { console.warn('absent, ignoré:', name); continue; }
    const svg = fs.readFileSync(src, 'utf8');
    await page.setContent(wrap(svg), { waitUntil: 'networkidle' });
    await page.evaluate(async () => { if (document.fonts) await document.fonts.ready; });
    const el = await page.$('svg');
    const outName = name.replace(/\.svg$/, '.png');
    await el.screenshot({ path: path.join(OUT, outName) });
    console.log('rendu', outName, `(${W * SCALE}x${H * SCALE})`);
  }

  await browser.close();
  console.log('render : terminé ->', OUT);
})().catch(e => { console.error(e); process.exit(1); });
