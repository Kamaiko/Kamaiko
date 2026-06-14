// Injecte un vrai QR (vers l'URL durable) dans la plaque du verso aurora.
// Remplace le bloc <g fill="#0A0E1A">…</g> (modules placeholder) par les vrais modules.
const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');

const URL = 'https://patenaude.pages.dev';
const file = path.join(__dirname, 'card-back.svg');

let svg = fs.readFileSync(file, 'utf8');
const qr = QRCode.create(URL, { errorCorrectionLevel: 'M' });
const n = qr.modules.size;
const data = qr.modules.data;

const SIZE = 200, QZ = 4;            // plaque 200x200, quiet zone 4 modules
const total = n + QZ * 2;
const m = SIZE / total;

let rects = '';
for (let r = 0; r < n; r++) {
  for (let c = 0; c < n; c++) {
    if (data[r * n + c]) {
      const x = ((c + QZ) * m).toFixed(2);
      const y = ((r + QZ) * m).toFixed(2);
      rects += `<rect x="${x}" y="${y}" width="${(m + 0.3).toFixed(2)}" height="${(m + 0.3).toFixed(2)}"/>`;
    }
  }
}

const out = svg.replace(/<g fill="#0A0E1A">[\s\S]*?<\/g>/, `<g fill="#0A0E1A">${rects}</g>`);
if (out === svg) { console.error('ERREUR: bloc QR introuvable'); process.exit(1); }
fs.writeFileSync(file, out);
console.log(`QR injecté: ${n}x${n} modules, module=${m.toFixed(2)}px, url=${URL}`);
