// Injecte un vrai QR dans card-back.svg, en mode INVERSÉ : modules CLAIRS sur fond noir,
// sans plaque ni boîte blanche (intégré au fond). La couleur vient du parent <g id="qr-modules">.
const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');

const URL = 'https://patenaude.pages.dev';
const file = path.join(__dirname, 'card-back.svg');

let svg = fs.readFileSync(file, 'utf8');

// EC level Q : plus robuste qu'M sur stock noir soft-touch (modules clairs).
const qr = QRCode.create(URL, { errorCorrectionLevel: 'Q' });
const n = qr.modules.size;
const data = qr.modules.data;

const SIZE = 200, QZ = 4;        // boîte 200px, quiet zone 4 modules (= fond noir, crucial en inversé)
const total = n + QZ * 2;
const m = SIZE / total;          // taille d'un module en px

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

// Cible le bloc par id (robuste : indépendant de la couleur), conserve l'attribut fill du <g>.
const re = /(<g id="qr-modules"[^>]*>)[\s\S]*?(<\/g>)/;
const out = svg.replace(re, `$1${rects}$2`);
if (out === svg) { console.error('ERREUR: bloc <g id="qr-modules"> introuvable'); process.exit(1); }
fs.writeFileSync(file, out);
console.log(`QR injecté (inversé): ${n}x${n} modules, module=${m.toFixed(2)}px, EC=Q, url=${URL}`);
