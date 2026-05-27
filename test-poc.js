/**
 * TEST POC - Slide Presentation Generator
 *
 * Objectif : Valider l'approche "créativité dans les contraintes PPTX + brand identity sacrée"
 *
 * Brand Identity VoltaPilot (SACRÉE - NE CHANGE JAMAIS) :
 * - Couleurs : Oxygen #0F766E, Flash #2DD4BF, Carbon #0F172A, White #FFFFFF, Mist #F8FAFC
 * - Typos : Inter Tight (titres), Inter (corps), Monospace (data)
 *
 * Créativité Niveau 3 (Audacieux) - Leviers utilisés :
 * - Composition : asymétrie forte, tension
 * - Espace négatif : dramatique, épuré
 * - Hiérarchie : extrêmes (géant/minuscule)
 * - Ratio texte/image : visual-first
 * - Densité : un message par slide
 */

const pptxgen = require("pptxgenjs");

// ============================================
// BRAND IDENTITY VOLTAPILOT (SACRÉE)
// ============================================
const BRAND = {
  colors: {
    oxygen: "0F766E",      // Teal 700 - Primary
    flash: "2DD4BF",       // Teal 400 - Accent
    carbon: "0F172A",      // Slate 900 - Titres
    white: "FFFFFF",       // Fond dominant
    mist: "F8FAFC",        // Slate 50 - Fond alternatif
    fog: "E2E8F0",         // Slate 200 - Bordures
    slate400: "94A3B8",    // Textes secondaires
  },
  fonts: {
    display: "Inter",      // Note: Inter Tight not always available in PPTX, using Inter
    body: "Inter",
    mono: "Courier New",   // Fallback monospace
  },
  // Tailles en points (PPTX)
  sizes: {
    hero: 72,              // H1 équivalent
    section: 48,           // H2
    cardTitle: 32,         // H3
    body: 18,
    small: 14,
    overline: 12,
  }
};

// ============================================
// CRÉATION DE LA PRÉSENTATION
// ============================================
const pptx = new pptxgen();

// Configuration de base
pptx.layout = "LAYOUT_16x9";
pptx.title = "VoltaPilot - Pitch Commercial";
pptx.author = "SPG - Slide Presentation Generator";
pptx.company = "VoltaPilot";

// ============================================
// SLIDE 1 : TITLE (Niveau 3 - Audacieux)
// Créativité : Asymétrie forte, espace négatif dramatique, hiérarchie extrême
// ============================================
let slide1 = pptx.addSlide();
slide1.background = { color: BRAND.colors.white };

// Overline - petit, en haut à gauche, très espacé du contenu principal
slide1.addText("ENERGY MANAGEMENT SYSTEM", {
  x: 0.8,
  y: 0.6,
  w: 4,
  h: 0.3,
  fontSize: BRAND.sizes.overline,
  fontFace: BRAND.fonts.body,
  color: BRAND.colors.oxygen,
  bold: true,
  charSpacing: 4,  // Tracking large
});

// Titre principal - GÉANT, position asymétrique basse
slide1.addText("VoltaPilot", {
  x: 0.8,
  y: 3.2,
  w: 10,
  h: 1.5,
  fontSize: 96,  // Extrêmement grand
  fontFace: BRAND.fonts.display,
  color: BRAND.colors.carbon,
  bold: true,
});

// Tagline - contraste taille, aligné différemment
slide1.addText("Le poumon énergétique\nde votre infrastructure", {
  x: 0.8,
  y: 4.7,
  w: 6,
  h: 0.9,
  fontSize: BRAND.sizes.body,
  fontFace: BRAND.fonts.body,
  color: BRAND.colors.slate400,
  lineSpacing: 24,
});

// Élément graphique - cercle Oxygen (représentant le "pulse")
slide1.addShape(pptx.shapes.OVAL, {
  x: 10.5,
  y: 1,
  w: 2,
  h: 2,
  fill: { color: BRAND.colors.oxygen, transparency: 90 },
  line: { color: BRAND.colors.oxygen, width: 2 },
});

// Second cercle plus petit (système orbital)
slide1.addShape(pptx.shapes.OVAL, {
  x: 11.2,
  y: 2.5,
  w: 0.8,
  h: 0.8,
  fill: { color: BRAND.colors.flash },
});

// ============================================
// SLIDE 2 : PROBLEM (Le problème de l'ICP)
// Créativité : Un seul message fort, espace négatif dramatique, texte géant
// ============================================
let slide2 = pptx.addSlide();
slide2.background = { color: BRAND.colors.carbon };  // Fond sombre pour impact

// Overline
slide2.addText("LE PROBLÈME", {
  x: 0.8,
  y: 0.6,
  w: 4,
  h: 0.3,
  fontSize: BRAND.sizes.overline,
  fontFace: BRAND.fonts.body,
  color: BRAND.colors.flash,
  bold: true,
  charSpacing: 4,
});

// Message fort - UNE seule phrase impactante, centrée verticalement
slide2.addText("Votre flotte électrique\ncharge à l'aveugle.", {
  x: 0.8,
  y: 2.2,
  w: 11,
  h: 2,
  fontSize: 56,
  fontFace: BRAND.fonts.display,
  color: BRAND.colors.white,
  bold: true,
  lineSpacing: 70,
});

// Sous-texte minimal
slide2.addText("Sans visibilité sur l'origine de l'électron ni l'état du réseau.", {
  x: 0.8,
  y: 4.4,
  w: 8,
  h: 0.5,
  fontSize: BRAND.sizes.body,
  fontFace: BRAND.fonts.body,
  color: BRAND.colors.slate400,
});

// ============================================
// SLIDE 3 : AGITATE (Conséquences)
// Créativité : Chiffres dramatiques, mise en scène forte, asymétrie
// ============================================
let slide3 = pptx.addSlide();
slide3.background = { color: BRAND.colors.white };

// Overline
slide3.addText("LES CONSÉQUENCES", {
  x: 0.8,
  y: 0.6,
  w: 4,
  h: 0.3,
  fontSize: BRAND.sizes.overline,
  fontFace: BRAND.fonts.body,
  color: BRAND.colors.oxygen,
  bold: true,
  charSpacing: 4,
});

// Chiffre dramatique - GÉANT
slide3.addText("73%", {
  x: 0.8,
  y: 1.5,
  w: 5,
  h: 2,
  fontSize: 144,
  fontFace: BRAND.fonts.mono,
  color: BRAND.colors.carbon,
  bold: true,
});

// Explication du chiffre
slide3.addText("de l'énergie consommée\nprovient de sources carbonées", {
  x: 0.8,
  y: 3.6,
  w: 5,
  h: 1,
  fontSize: BRAND.sizes.cardTitle,
  fontFace: BRAND.fonts.body,
  color: BRAND.colors.carbon,
  lineSpacing: 40,
});

// Conséquence business - côté droit, asymétrie
slide3.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 7.5,
  y: 1.5,
  w: 5,
  h: 3.5,
  fill: { color: BRAND.colors.mist },
  line: { color: BRAND.colors.fog, width: 1 },
  rectRadius: 0.2,
});

slide3.addText("Risque de greenwashing", {
  x: 8,
  y: 2,
  w: 4,
  h: 0.5,
  fontSize: BRAND.sizes.body,
  fontFace: BRAND.fonts.display,
  color: BRAND.colors.carbon,
  bold: true,
});

slide3.addText("Vos engagements Net Zero sont menacés par un manque de traçabilité de l'énergie.", {
  x: 8,
  y: 2.6,
  w: 4,
  h: 1.2,
  fontSize: BRAND.sizes.small,
  fontFace: BRAND.fonts.body,
  color: BRAND.colors.slate400,
  lineSpacing: 20,
});

slide3.addText("Rapports ESG incomplets", {
  x: 8,
  y: 3.9,
  w: 4,
  h: 0.5,
  fontSize: BRAND.sizes.body,
  fontFace: BRAND.fonts.display,
  color: BRAND.colors.carbon,
  bold: true,
});

slide3.addText("Données manquantes pour prouver votre impact réel.", {
  x: 8,
  y: 4.4,
  w: 4,
  h: 0.6,
  fontSize: BRAND.sizes.small,
  fontFace: BRAND.fonts.body,
  color: BRAND.colors.slate400,
});

// ============================================
// SLIDE 4 : SOLUTION (Proposition de valeur)
// Créativité : Respiration maximale, un message, contraste fort
// ============================================
let slide4 = pptx.addSlide();
slide4.background = { color: BRAND.colors.oxygen };  // Fond brand pour impact

// Message solution - blanc sur teal, centré
slide4.addText("Synchronisez votre flotte\navec l'énergie verte.", {
  x: 1,
  y: 2,
  w: 11,
  h: 2,
  fontSize: 52,
  fontFace: BRAND.fonts.display,
  color: BRAND.colors.white,
  bold: true,
  lineSpacing: 65,
});

// Sous-texte
slide4.addText("VoltaPilot orchestre la recharge en harmonie avec les cycles\nde production renouvelable et les limites de votre écosystème.", {
  x: 1,
  y: 4.2,
  w: 9,
  h: 0.8,
  fontSize: BRAND.sizes.body,
  fontFace: BRAND.fonts.body,
  color: BRAND.colors.white,
  transparency: 20,
  lineSpacing: 24,
});

// ============================================
// SLIDE 5 : HOW IT WORKS (Fonctionnement)
// Créativité : Schéma épuré, 3 étapes max, visual-first
// ============================================
let slide5 = pptx.addSlide();
slide5.background = { color: BRAND.colors.white };

// Overline
slide5.addText("COMMENT ÇA MARCHE", {
  x: 0.8,
  y: 0.6,
  w: 4,
  h: 0.3,
  fontSize: BRAND.sizes.overline,
  fontFace: BRAND.fonts.body,
  color: BRAND.colors.oxygen,
  bold: true,
  charSpacing: 4,
});

// 3 étapes en colonnes avec cercles numérotés
const steps = [
  { num: "01", title: "Analyse", desc: "Prévisions météo, production solaire, état du réseau" },
  { num: "02", title: "Synchronise", desc: "Algorithme de matching avec les pics d'énergie verte" },
  { num: "03", title: "Optimise", desc: "Recharge au moment du plus bas carbone" },
];

steps.forEach((step, i) => {
  const xPos = 1 + (i * 4);

  // Numéro dans cercle
  slide5.addShape(pptx.shapes.OVAL, {
    x: xPos,
    y: 1.8,
    w: 0.8,
    h: 0.8,
    fill: { color: i === 1 ? BRAND.colors.flash : BRAND.colors.mist },
    line: { color: BRAND.colors.fog, width: 1 },
  });

  slide5.addText(step.num, {
    x: xPos,
    y: 1.85,
    w: 0.8,
    h: 0.7,
    fontSize: BRAND.sizes.small,
    fontFace: BRAND.fonts.mono,
    color: i === 1 ? BRAND.colors.carbon : BRAND.colors.oxygen,
    align: "center",
    bold: true,
  });

  // Titre étape
  slide5.addText(step.title, {
    x: xPos,
    y: 2.8,
    w: 3.5,
    h: 0.5,
    fontSize: BRAND.sizes.cardTitle,
    fontFace: BRAND.fonts.display,
    color: BRAND.colors.carbon,
    bold: true,
  });

  // Description
  slide5.addText(step.desc, {
    x: xPos,
    y: 3.4,
    w: 3.2,
    h: 1,
    fontSize: BRAND.sizes.small,
    fontFace: BRAND.fonts.body,
    color: BRAND.colors.slate400,
    lineSpacing: 20,
  });
});

// Lignes de connexion entre étapes
slide5.addShape(pptx.shapes.LINE, {
  x: 2,
  y: 2.2,
  w: 2.8,
  h: 0,
  line: { color: BRAND.colors.fog, width: 1, dashType: "dash" },
});

slide5.addShape(pptx.shapes.LINE, {
  x: 6,
  y: 2.2,
  w: 2.8,
  h: 0,
  line: { color: BRAND.colors.fog, width: 1, dashType: "dash" },
});

// ============================================
// SLIDE 6 : PROOF (Social Proof)
// Créativité : Chiffres géants, minimal, confiance
// ============================================
let slide6 = pptx.addSlide();
slide6.background = { color: BRAND.colors.mist };

// Overline
slide6.addText("NOS RÉSULTATS", {
  x: 0.8,
  y: 0.6,
  w: 4,
  h: 0.3,
  fontSize: BRAND.sizes.overline,
  fontFace: BRAND.fonts.body,
  color: BRAND.colors.oxygen,
  bold: true,
  charSpacing: 4,
});

// Métriques clés - layout asymétrique avec tailles variées
const metrics = [
  { value: "-42%", label: "Empreinte carbone", x: 0.8, y: 1.5, size: 72 },
  { value: "150+", label: "Flottes équipées", x: 5.5, y: 2, size: 56 },
  { value: "98%", label: "Disponibilité garantie", x: 9, y: 1.5, size: 48 },
];

metrics.forEach(m => {
  slide6.addText(m.value, {
    x: m.x,
    y: m.y,
    w: 4,
    h: 1.2,
    fontSize: m.size,
    fontFace: BRAND.fonts.mono,
    color: BRAND.colors.carbon,
    bold: true,
  });

  slide6.addText(m.label, {
    x: m.x,
    y: m.y + 1.3,
    w: 4,
    h: 0.4,
    fontSize: BRAND.sizes.small,
    fontFace: BRAND.fonts.body,
    color: BRAND.colors.slate400,
  });
});

// Section témoignage
slide6.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 0.8,
  y: 3.8,
  w: 11.8,
  h: 1.5,
  fill: { color: BRAND.colors.white },
  line: { color: BRAND.colors.fog, width: 1 },
  rectRadius: 0.15,
});

slide6.addText("\"VoltaPilot a transformé notre approche de la mobilité durable.\nNous avons enfin des données probantes pour nos rapports ESG.\"", {
  x: 1.2,
  y: 4,
  w: 9,
  h: 0.8,
  fontSize: BRAND.sizes.body,
  fontFace: BRAND.fonts.body,
  color: BRAND.colors.carbon,
  italic: true,
  lineSpacing: 24,
});

slide6.addText("— Marie Dupont, CSO @ Entreprise Exemple", {
  x: 1.2,
  y: 4.9,
  w: 6,
  h: 0.3,
  fontSize: BRAND.sizes.small,
  fontFace: BRAND.fonts.body,
  color: BRAND.colors.slate400,
});

// ============================================
// SLIDE 7 : CTA (Call-to-Action)
// Créativité : Épuré au maximum, focus total sur l'action
// ============================================
let slide7 = pptx.addSlide();
slide7.background = { color: BRAND.colors.carbon };

// Message CTA - géant, centré
slide7.addText("Prêt à synchroniser\nvotre flotte ?", {
  x: 1,
  y: 1.5,
  w: 11,
  h: 2,
  fontSize: 56,
  fontFace: BRAND.fonts.display,
  color: BRAND.colors.white,
  bold: true,
  lineSpacing: 70,
});

// Bouton CTA stylisé
slide7.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 1,
  y: 3.8,
  w: 4,
  h: 0.8,
  fill: { color: BRAND.colors.flash },
  rectRadius: 0.1,
});

slide7.addText("Demander une démo", {
  x: 1,
  y: 3.85,
  w: 4,
  h: 0.7,
  fontSize: BRAND.sizes.body,
  fontFace: BRAND.fonts.display,
  color: BRAND.colors.carbon,
  bold: true,
  align: "center",
});

// Contact info
slide7.addText("contact@voltapilot.io", {
  x: 1,
  y: 4.8,
  w: 4,
  h: 0.4,
  fontSize: BRAND.sizes.small,
  fontFace: BRAND.fonts.mono,
  color: BRAND.colors.slate400,
});

// Logo / branding discret en bas à droite
slide7.addText("VoltaPilot", {
  x: 9.5,
  y: 5,
  w: 3,
  h: 0.4,
  fontSize: BRAND.sizes.body,
  fontFace: BRAND.fonts.display,
  color: BRAND.colors.oxygen,
  align: "right",
});

// ============================================
// EXPORT
// ============================================
const outputPath = "./outputs/test-poc-voltapilot.pptx";

// Créer le dossier outputs s'il n'existe pas
const fs = require("fs");
const path = require("path");
const outputDir = path.dirname(outputPath);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

pptx.writeFile(outputPath)
  .then(fileName => {
    console.log(`\n✅ Présentation générée avec succès !`);
    console.log(`📁 Fichier : ${fileName}`);
    console.log(`\n📊 Contenu :`);
    console.log(`   - 7 slides (framework PAS)`);
    console.log(`   - Brand identity VoltaPilot respectée`);
    console.log(`   - Niveau de créativité : 3 (Audacieux)`);
    console.log(`\n👉 Ouvrez le fichier dans Google Slides ou PowerPoint pour évaluer.`);
  })
  .catch(err => {
    console.error("❌ Erreur lors de la génération :", err);
  });
