// Générateur de la carte d'affaires Patrick Patenaude — portrait, mono noir-sur-noir, spot-UV.
// Source UNIQUE : le symbole héros et le maillage de fond sont définis une seule fois et instanciés
// dans l'artwork ET dans les masques de vernis, ce qui garantit l'alignement (clé de l'effet "glassy").
//
// Sorties (dans ce dossier) :
//   card-front.svg / card-back.svg               -> artwork (aperçu écran + base impression)
//   card-front-spotuv.svg / card-back-spotuv.svg -> masques vernis sélectif (BLANC = verni)
//
// Le QR du verso est laissé en placeholder <g id="qr-modules"> et rempli ensuite par qr-inject.js.
const fs = require('fs');
const path = require('path');

const OUT = __dirname;

// ===== Mesures @300 DPI — carte 2"x3.5" portrait, bleed 0.125" =====
const W = 675, H = 1125;            // fichier total (2.25 x 3.75")
const CX = W / 2;                   // 337.5 — centre horizontal
const FONT = "Inter, 'Helvetica Neue', Arial, sans-serif";

// ===== Palette mono pure (aucun cyan/bleu) =====
const C = {
  bg:       '#0A0A0A',   // noir mat (fond plein cadre)
  ink:      '#EDEDED',   // blanc/argent (texte, QR)
  dim:      '#8A8A8A',   // gris secondaire
  rule:     '#2A2A2A',   // filets / liserés (aperçu écran)
  mesh:     '#101010',   // maillage de fond — très subtil, identique recto/verso
  white:    '#FFFFFF',   // masque spot-UV (zone vernie)
  black:    '#000000',   // masque spot-UV (zone non vernie)
};

// ===== Symbole héros "network-glyph" (recto) =====
// Géométrie autour de l'origine locale (0,0) = centre vide. Hexagone pointe-en-haut (rayon 88) :
// contour + 3 diagonales qui se croisent au centre (maillage = réseau décentralisé), 6 nœuds.
// NB : ce symbole est exactement une "cellule" du maillage triangulaire (cohérence des 2 faces).
const HEX = 'M0 -88 L76 -44 L76 44 L0 88 L-76 44 L-76 -44 Z';
const DIAGS = ['M0 -88 L0 88', 'M-76 -44 L76 44', 'M76 -44 L-76 44'];
const NODES = [[0, -88], [76, -44], [76, 44], [0, 88], [-76, 44], [-76, -44]];

function heroSymbol({ stroke, node, sw = 8, nr = 13 }) {
  const edges = [HEX, ...DIAGS].map(d => `<path d="${d}"/>`).join('');
  const dots = NODES.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${nr}"/>`).join('');
  return `
    <g fill="none" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${edges}</g>
    <g fill="${node}" stroke="none">${dots}</g>`;
}

// ===== Maillage triangulaire régulier (motif de fond) =====
// Réseau de triangles équilatéraux (lignes + petits nœuds aux sommets) = même langage géométrique
// que le symbole du recto. Régulier et structuré : se lit comme un réseau, pas des taches.
// Le masque (mask:true) dégage la zone centrale (QR + texte) ; l'artwork la fond via un voile radial.
function meshField({ mask = false, line, node, sw, nodeR } = {}) {
  const s = 72, rh = s * 0.8660254;                 // côté du triangle + hauteur de rangée (plus aéré)
  const clear = mask ? { x0: 84, x1: 596, y0: 444, y1: 682 } : null;
  const inClear = (x, y) => clear && x >= clear.x0 && x <= clear.x1 && y >= clear.y0 && y <= clear.y1;
  const nr = mask ? 3 : (nodeR ?? 1.4);
  let lines = '', nodes = '';
  let r = 0;
  for (let y = -rh; y <= H + rh; y += rh, r++) {
    const xoff = (r % 2) ? s / 2 : 0;
    for (let x = -s; x <= W + s; x += s) {
      const px = x + xoff;
      // 3 arêtes par sommet (droite, bas-gauche, bas-droite) = toutes les arêtes, sans doublon
      const segs = [
        [px, y, px + s, y],
        [px, y, px - s / 2, y + rh],
        [px, y, px + s / 2, y + rh],
      ];
      for (const [x1, y1, x2, y2] of segs) {
        if (inClear((x1 + x2) / 2, (y1 + y2) / 2)) continue;
        lines += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}"/>`;
      }
      if (!inClear(px, y)) nodes += `<circle cx="${px.toFixed(1)}" cy="${y.toFixed(1)}" r="${nr}"/>`;
    }
  }
  const lineStroke = mask ? C.white : (line ?? C.mesh);
  const nodeFill = mask ? C.white : (node ?? C.mesh);
  const strokeW = mask ? 2.4 : (sw ?? 1.1);
  return `<g fill="none" stroke="${lineStroke}" stroke-width="${strokeW}" stroke-linecap="round">${lines}</g><g fill="${nodeFill}" stroke="none">${nodes}</g>`;
}

// ============================================================
// RECTO — symbole héros + nom discret + écho très subtil du maillage
// ============================================================
function front({ mask = false } = {}) {
  if (mask) {
    // Masque spot-UV recto : seul le symbole héros est verni (l'écho du maillage reste mat).
    return svg(`
  <rect width="${W}" height="${H}" fill="${C.black}"/>
  <g transform="translate(${CX},470) scale(1.85)">${heroSymbol({ stroke: C.white, node: C.white })}</g>`);
  }
  return svg(`
  <defs>
    <linearGradient id="heroSheen" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#44464C"/>
      <stop offset="0.55" stop-color="#222226"/>
      <stop offset="1" stop-color="#151518"/>
    </linearGradient>
    <radialGradient id="vig" cx="0.5" cy="0.42" r="0.75">
      <stop offset="0.5" stop-color="${C.bg}" stop-opacity="0"/>
      <stop offset="1" stop-color="#000000" stop-opacity="0.6"/>
    </radialGradient>
    <radialGradient id="heroClear" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="${C.bg}" stop-opacity="1"/>
      <stop offset="0.6" stop-color="${C.bg}" stop-opacity="0.85"/>
      <stop offset="1" stop-color="${C.bg}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="sheenHalo" cx="0.5" cy="0.4" r="0.5">
      <stop offset="0" stop-color="#FFFFFF" stop-opacity="0.045"/>
      <stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="${C.bg}"/>

  <!-- Écho du maillage (identique au verso ; mat, non verni) -->
  ${meshField()}
  <!-- Dégage le maillage derrière le symbole héros -->
  <ellipse cx="${CX}" cy="470" rx="250" ry="250" fill="url(#heroClear)"/>

  <rect width="${W}" height="${H}" fill="url(#vig)"/>
  <ellipse cx="${CX}" cy="448" rx="260" ry="260" fill="url(#sheenHalo)"/>

  <!-- Symbole héros (noir-sur-noir glassy ; la vraie brillance vient du spot-UV) -->
  <g transform="translate(${CX},470) scale(1.85)">${heroSymbol({ stroke: 'url(#heroSheen)', node: '#3A3A40' })}</g>

  <!-- Filet d'ancrage discret au-dessus du nom -->
  <rect x="${CX - 22}" y="958" width="44" height="1.5" fill="${C.rule}"/>

  <!-- Nom DISCRET (capitales + tracking large = signal premium sobre) -->
  <text x="${CX}" y="1000" text-anchor="middle" font-size="30" font-weight="600" letter-spacing="4" fill="${C.ink}">PATRICK PATENAUDE</text>
  <text x="${CX}" y="1030" text-anchor="middle" font-size="13" font-weight="600" letter-spacing="5" fill="${C.dim}">DÉVELOPPEUR FULLSTACK</text>`);
}

// ============================================================
// VERSO — maillage de fond + bloc d'info compact au centre (QR | nom + contacts)
// ============================================================
function back({ mask = false } = {}) {
  if (mask) {
    // Masque spot-UV : le maillage en blanc = zone vernie. QR + texte dégagés (pas de vernis).
    return svg(`
  <rect width="${W}" height="${H}" fill="${C.black}"/>
  ${meshField({ mask: true })}`);
  }
  return svg(`
  <defs>
    <radialGradient id="backFade" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="${C.bg}" stop-opacity="1"/>
      <stop offset="0.62" stop-color="${C.bg}" stop-opacity="0.9"/>
      <stop offset="1" stop-color="${C.bg}" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="${C.bg}"/>

  <!-- Motif de fond : maillage triangulaire (écho du symbole du recto) -->
  ${meshField()}

  <!-- Voile radial qui fond le maillage derrière le bloc central -->
  <ellipse cx="${CX}" cy="562" rx="300" ry="158" fill="url(#backFade)"/>
  <!-- Zone propre garantie derrière le QR (quiet zone, invisible : même noir que le fond) -->
  <rect x="92" y="454" width="216" height="216" rx="6" fill="${C.bg}"/>

  <!-- ===== Bloc central compact : QR | nom + contacts ===== -->
  <!-- QR inversé (modules clairs sur noir, sans plaque). Rempli par qr-inject.js. -->
  <g transform="translate(100,462)">
    <g id="qr-modules" fill="${C.ink}"></g>
  </g>

  <!-- Séparateur vertical -->
  <rect x="326" y="478" width="1.5" height="168" fill="${C.rule}"/>

  <!-- Nom + contacts (compact, peu de lignes) -->
  <text x="350" y="525" font-size="19" font-weight="700" letter-spacing="0.6" fill="${C.ink}">Patrick Patenaude</text>
  <rect x="351" y="540" width="150" height="1.5" fill="${C.rule}"/>
  <text x="350" y="582" font-size="16" font-weight="500" letter-spacing="0.3" fill="${C.ink}">ppatenaude@hotmail.fr</text>
  <text x="350" y="609" font-size="16" font-weight="500" letter-spacing="0.3" fill="${C.dim}">+1 (450) 808-2321</text>`);
}

// Enveloppe SVG commune
function svg(body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="${FONT}">${body}
</svg>
`;
}

// ===== Écriture =====
const files = {
  'card-front.svg': front(),
  'card-back.svg': back(),
  'card-front-spotuv.svg': front({ mask: true }),
  'card-back-spotuv.svg': back({ mask: true }),
};
for (const [name, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(OUT, name), content);
  console.log('écrit', name);
}
console.log('gen-cards : 4 SVG générés (lancer "npm run qr" puis "npm run render").');
