# Spécifications d'impression — Carte d'affaires Patrick Patenaude

Carte **premium noir-sur-noir**, portrait, mono, avec **vernis sélectif (spot-UV)** sur le logo et le motif. Pensée pour un imprimeur canadien haut de gamme (ex. **Jukebox Print**).

## Format & gabarit

| | Pouces | mm | px @300 DPI |
|---|---|---|---|
| **Trim** (coupe finie) | 2.0 × 3.5 (portrait) | 50.8 × 88.9 | 600 × 1050 |
| **Bleed** (fond perdu, par bord) | 0.125 | 3.175 | 37.5 |
| **Fichier total** (avec bleed) | 2.25 × 3.75 | 57.15 × 95.25 | **675 × 1125** |
| **Safe zone** (depuis le bord du fichier) | 0.25 | 6.35 | 75 |

- Tout texte/élément critique reste **dans la safe zone** (75 px du bord du fichier).
- Le fond noir **remplit tout le bleed** (déborde le trim).

## Stock & couleur

- **Carton** : noir épais, **soft-touch / suede** (mat velouté), 16–32 pt selon l'offre.
- **Mono uniquement** : fond noir `#0A0A0A`, encre claire `#EDEDED`, gris secondaire `#8A8A8A`.
- **Encre claire = blanc opaque** (white ink) sur stock noir — exiger une **couche opaque** (au besoin double passe) sinon le blanc vire gris. Alternative à valider au devis : **foil argent mat** pour le nom/contacts.

## Finitions (le « glassy »)

- **Spot-UV brillant** appliqué via les masques fournis :
  - **Recto** : le symbole héros (logo).
  - **Verso** : le **motif de fond (maillage triangulaire)** — réseau de lignes/nœuds vernis brillants sur fond mat.
- **NE PAS vernir** : le **QR** ni le **texte/nom** (le masque verso dégage déjà cette zone centrale). Effet recherché = contraste **mat (stock) vs brillant (vernis)**, noir-sur-noir.
- **Finesse du maillage du verso** : lignes ≈ 2.4 px (~0.34 mm), nœuds r≈3 px (~0.43 mm). Confirmer avec l'imprimeur que le **vernis tient sur ces traits fins** ; sinon épaissir/espacer dans `gen-cards.js` (`meshField`, variable `s`). Option : laisser le **verso mat** (vernis uniquement au recto) si les traits sont trop fins.

### Convention des masques spot-UV
- Fichiers : `card-front-spotuv.svg` / `card-back-spotuv.svg` (mêmes dimensions + bleed que l'artwork).
- **BLANC = zone vernie**, **NOIR = pas de vernis**. Pas de gris ni de demi-ton.
- Alignement **1:1** avec l'artwork (géométrie issue de la même source `gen-cards.js`).
- Traits fins : demander à l'imprimeur le **spread/choke** et l'**épaisseur minimale de vernis** (~0.5–1 pt), ainsi que la **tolérance de registration**.

## QR (verso) — points critiques

- **Inversé** : modules **clairs** (`#EDEDED`, white ink) sur fond **noir**, **sans plaque blanche**.
- **EC level Q**, **quiet zone ≥ 4 modules** de fond noir pur (le motif de points est déjà dégagé autour du QR).
- Pas de label sous le QR (URL et « SCAN » retirés) — le QR seul mène à la cible.
- **Tester le scan sur une épreuve imprimée** (pas seulement à l'écran) avant le tirage : le contraste clair-sur-noir sur soft-touch est le risque #1.
- Cible : `https://patenaude.pages.dev`.

## Polices

- **Inter** (texte). **Vectoriser en courbes** (outlines) dans le PDF final, ou fournir le fichier `.ttf` à l'imprimeur pour éviter toute substitution.

## Fichiers à envoyer

| Fichier | Rôle |
|---|---|
| `card-front.svg` / `output/card-front.png` | Artwork recto (vectoriel = source de vérité ; PNG = aperçu) |
| `card-back.svg` / `output/card-back.png` | Artwork verso (QR injecté) |
| `card-front-spotuv.svg` / `output/card-front-spotuv.png` | Masque vernis recto |
| `card-back-spotuv.svg` / `output/card-back-spotuv.png` | Masque vernis verso |

- Fournir de préférence des **PDF vectoriels** (recommandé : **PDF/X-1a**) générés depuis les SVG ; les masques surtout doivent rester **nets** (le PNG lisse les bords).
- Demander à l'imprimeur s'il veut le **white ink / spot-UV sur calques séparés** dans un PDF unique, ou en fichiers distincts.

## Checklist avant commande

- [ ] Stock soft-touch noir + white ink opaque confirmés au devis
- [ ] Masques spot-UV alignés (logo recto, motif verso ; QR et texte exclus)
- [ ] Épreuve physique demandée + **scan QR testé** sur l'épreuve
- [ ] Polices vectorisées (ou .ttf fourni)
- [ ] Bleed 0.125" présent sur les 4 fichiers, fond noir jusqu'aux bords
- [ ] Format final validé (PDF/X-1a, calques white-ink / spot-UV)
