# Prompts higgsfield — à lancer mardi (crédits)

Marque : fond sombre `#0A0E1A`, accent cyan `#22D3EE`, secondaire bleu `#3B82F6`, clair `#E8EEF5`.
Identité : dev fullstack, parcours **psycho → informatique**, produits centrés utilisateur. Citation : « Humans are harder to debug ».
> Le travail vectoriel ne dépend pas des crédits. higgsfield sert à **explorer** (logo) et à **générer le fond**. ⚠️ **Le logo final sera revectorisé en SVG** (favicon 16 px + impression + couleur unique éditable) — l'IA donne la direction, pas le fichier final.

---

## Prompt 1 — Fond / texture premium pour la carte

**But** : atmosphère abstraite passant **sous le texte vectoriel** (texte/logo restent nets, ajoutés par-dessus). Pas de texte, pas de sujet central, centre/gauche dégagés (zone du nom).

**Modèle** : GPT Image 2 (`gpt_image_2`). **Ratio** : 16:9 (recadrable 3.75×2.25). **Variations** : 3–4.

**Prompt (EN) :**
```
Ultra-premium abstract dark background for a tech business card. Deep near-black navy (#0A0E1A) base with a subtle particle constellation / connected-node field, faint cyan (#22D3EE) glow blooming softly from the lower-left and upper-right, gentle volumetric depth, very fine grain. Minimal, elegant, lots of negative space in the center, cinematic, high-end editorial. Soft radial light, no harsh shapes. Monochromatic dark + cyan only.
```
**Négatifs** : `text, letters, words, logo, watermark, face, person, busy patterns, rainbow colors, oversaturation, clutter, central focal subject`.
**Note** : doit rester lisible une fois assombri ~60 % (texte par-dessus).

---

## Prompt 2 — Logo : génération de concepts (puis revectorisation)

**But** : générer des **pistes de marque** riches, ensuite **redessinées en SVG vectoriel** propre. Fournir en **références** les rendus de nos 6 concepts vectoriels (voir plus bas) via image-to-image / reference pour rester on-brand.

**Modèle** : GPT Image 2 (`gpt_image_2`) pour l'idéation ; **Nano Banana Pro** si on passe des images de référence. **Ratio** : 1:1. **Sortie** : grille de 6–9 symboles, fond sombre.

**Directions à explorer** (issues du fan-out — priorité à *k-geo*, *network-glyph*, *bracket-mind*, mais explorer librement) :
- **k-geo** — monogramme « K » (Kamaiko) géométrique, nœud cyan à la jonction.
- **network-glyph** — graphe/réseau hexagonal symétrique, 1 nœud accent.
- **bracket-mind** — chevrons `< >` encadrant une petite constellation/esprit.
- **synapse** — neurone/synapse = nœud de graphe, une branche en caret `>`.
- **constellation-k** — « K » tracé par une constellation d'étoiles.
- **mind-circuit** — profil/tête minimal + nœuds de circuit (humain + machine).

**Prompt (EN) :**
```
A clean grid of 9 minimalist monochrome logo symbol concepts for a software developer with a psychology background (brand handle "Kamaiko"). Each mark fuses a human/brain/synapse idea with code/network/constellation geometry. Explore: a geometric "K" monogram with a single cyan network node; a symmetric hexagonal node-graph glyph; code brackets < > enclosing a tiny constellation; a synapse that doubles as a graph node with a small ">" caret; a constellation tracing a "K"; a minimal head profile filled with circuit nodes. Single accent color cyan (#22D3EE) on near-black, flat vector style, geometric, premium, high contrast, must read at 16px. No gradients, no 3D, no text, no letters except a stylized K where noted.
```
**Négatifs** : `dumbbell, barbell, gym, fitness, realistic brain, photo, 3D render, gradient mesh, drop shadow, mascot, wordmark, paragraph text`.
**⚠️ Jamais l'haltère** (= marque de l'app **Halterofit**, pas la marque perso).

**Références à fournir mardi** (à exporter en PNG depuis les SVG — je peux le faire avant) :
`business-card/logo/candidates/logo-*.svg` (les 6 concepts). On peut aussi passer la planche-contact comme moodboard.

---

### Après génération (mardi)
1. **Logo** : choisir la meilleure piste IA → **revectoriser en SVG** propre (tracé + nettoyage), décliner sur fond clair/sombre + favicon → `business-card/logo/logo.svg`.
2. **Fond** (Prompt 1) : choisir 1 variante → l'intégrer en fond d'une **variante texturée** de la carte (texte vectoriel par-dessus) → comparer au 100 % vectoriel.
