/**
 * VoltaPilot - V3 PPTX Generator
 * Conversion de la preview HTML/CSS créative vers PPTX
 * Icônes en SVG encodées en base64
 */

const pptxgen = require("pptxgenjs");
const fs = require("fs");
const path = require("path");

// ============================================
// BRAND IDENTITY VOLTAPILOT (SACRÉE)
// ============================================
const BRAND = {
  colors: {
    oxygen: "0F766E",
    oxygenLight: "E6F3F2",
    flash: "2DD4BF",
    flashLight: "D4F5F0",
    carbon: "0F172A",
    white: "FFFFFF",
    mist: "F8FAFC",
    fog: "E2E8F0",
    slate400: "94A3B8",
    slate600: "475569",
    red: "EF4444",
    redLight: "FEE2E2",
  },
  fonts: {
    display: "Inter",
    body: "Inter",
    mono: "Courier New",
  },
};

// ============================================
// ICÔNES SVG (encodées pour utilisation directe)
// Style: Outline 1.2px, round caps, round joins
// ============================================
const ICONS = {
  pulse: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,

  pulseOxygen: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#0F766E" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,

  clock: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0F766E" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>`,

  eyeOff: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><path d="M1 1l22 22"/><circle cx="12" cy="12" r="3"/></svg>`,

  alertTriangle: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,

  shieldAlert: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2DD4BF" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,

  fileText: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2DD4BF" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`,

  trendingUp: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2DD4BF" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>`,

  checkCircle: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,

  sun: `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`,

  zap: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0F172A" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,

  battery: `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="6" width="18" height="12" rx="2" ry="2"/><line x1="23" y1="10" x2="23" y2="14"/><line x1="6" y1="10" x2="6" y2="14"/><line x1="10" y1="10" x2="10" y2="14"/></svg>`,

  activity: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0F766E" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,

  refreshCw: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0F172A" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10"/><path d="M20.49 15a9 9 0 0 1-14.85 3.36L1 14"/></svg>`,

  target: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0F766E" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`,

  leaf: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2DD4BF" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 22c1.25-1.25 2.5-2 4-2 3 0 4 3 8 3 2.5 0 4.75-1.5 6-4 1.25-2.5 1.5-6 0-10-1-2.5-3.5-5-7-6.5C9.5 1 6 2 4 4.5 2 7 1.5 10 2 13c.5 3 2 5.5 4 7"/><path d="M12 22V11"/><path d="M9 15l3-3 3 3"/></svg>`,

  truck: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0F766E" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>`,

  shieldCheck: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0F766E" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>`,

  quote: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3z"/></svg>`,

  calendar: `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#2DD4BF" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/></svg>`,

  arrowRight: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0F172A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`,
};

// Fonction pour convertir SVG en data URI
function svgToDataUri(svg) {
  const encoded = Buffer.from(svg).toString('base64');
  return `data:image/svg+xml;base64,${encoded}`;
}

// ============================================
// CRÉATION DE LA PRÉSENTATION
// ============================================
const pptx = new pptxgen();

pptx.layout = "LAYOUT_16x9";
pptx.title = "VoltaPilot - Pitch Commercial";
pptx.author = "SPG - Slide Presentation Generator";
pptx.company = "VoltaPilot";

// ============================================
// SLIDE 1 : TITLE
// ============================================
let slide1 = pptx.addSlide();
slide1.background = { color: BRAND.colors.white };

// Zone gauche - contenu
slide1.addText("ENERGY MANAGEMENT SYSTEM", {
  x: 0.6,
  y: 0.5,
  w: 4,
  h: 0.3,
  fontSize: 10,
  fontFace: BRAND.fonts.body,
  color: BRAND.colors.oxygen,
  bold: true,
  charSpacing: 3,
});

// Titre principal avec retour à la ligne
slide1.addText([
  { text: "Charge", options: { breakLine: true } },
  { text: "Pilot" }
], {
  x: 0.6,
  y: 1.8,
  w: 5,
  h: 2.2,
  fontSize: 72,
  fontFace: BRAND.fonts.display,
  color: BRAND.colors.carbon,
  bold: true,
  lineSpacing: 65,
});

// Tagline
slide1.addText("Le poumon énergétique de votre infrastructure. Synchronisez votre flotte avec l'énergie verte.", {
  x: 0.6,
  y: 4.1,
  w: 4.2,
  h: 0.9,
  fontSize: 16,
  fontFace: BRAND.fonts.body,
  color: BRAND.colors.slate400,
  lineSpacing: 24,
});

// Zone droite - fond
slide1.addShape(pptx.shapes.RECTANGLE, {
  x: 5.5,
  y: 0,
  w: 7.83,
  h: 5.63,
  fill: { color: BRAND.colors.mist },
});

// Cercle principal (Living Pulse)
slide1.addShape(pptx.shapes.OVAL, {
  x: 7.5,
  y: 1.5,
  w: 2.5,
  h: 2.5,
  fill: { color: BRAND.colors.oxygen },
});

// Halo autour du cercle
slide1.addShape(pptx.shapes.OVAL, {
  x: 7,
  y: 1,
  w: 3.5,
  h: 3.5,
  fill: { color: BRAND.colors.oxygen, transparency: 90 },
  line: { color: BRAND.colors.oxygen, width: 0 },
});

// Icône Pulse dans le cercle central
slide1.addImage({
  data: svgToDataUri(ICONS.pulse),
  x: 8.25,
  y: 2.25,
  w: 1,
  h: 1,
});

// Cercles satellites
slide1.addShape(pptx.shapes.OVAL, {
  x: 6.5,
  y: 1.2,
  w: 0.4,
  h: 0.4,
  fill: { color: BRAND.colors.flash },
});

slide1.addShape(pptx.shapes.OVAL, {
  x: 10.2,
  y: 2.2,
  w: 0.25,
  h: 0.25,
  fill: { color: BRAND.colors.flash },
});

slide1.addShape(pptx.shapes.OVAL, {
  x: 6.8,
  y: 3.8,
  w: 0.5,
  h: 0.5,
  fill: { color: BRAND.colors.flash },
});

// Lignes de flux (pointillées)
slide1.addShape(pptx.shapes.LINE, {
  x: 6.9,
  y: 1.4,
  w: 1.5,
  h: 0.8,
  line: { color: BRAND.colors.fog, width: 1, dashType: "dash" },
});

// ============================================
// SLIDE 2 : PROBLEM
// ============================================
let slide2 = pptx.addSlide();
slide2.background = { color: BRAND.colors.carbon };

// Halo rouge subtil (simulé avec un cercle très transparent)
slide2.addShape(pptx.shapes.OVAL, {
  x: 8,
  y: -1,
  w: 6,
  h: 6,
  fill: { color: BRAND.colors.red, transparency: 95 },
});

// Illustration "signal déconnecté" - cercles concentriques
slide2.addShape(pptx.shapes.OVAL, {
  x: 9,
  y: 0.8,
  w: 3,
  h: 3,
  fill: { transparency: 100 },
  line: { color: BRAND.colors.white, width: 0.5, transparency: 90 },
});

slide2.addShape(pptx.shapes.OVAL, {
  x: 9.5,
  y: 1.3,
  w: 2,
  h: 2,
  fill: { transparency: 100 },
  line: { color: BRAND.colors.white, width: 0.5, transparency: 85, dashType: "dash" },
});

slide2.addShape(pptx.shapes.OVAL, {
  x: 10,
  y: 1.8,
  w: 1,
  h: 1,
  fill: { color: BRAND.colors.red, transparency: 85 },
});

// Icône Eye Off au centre
slide2.addImage({
  data: svgToDataUri(ICONS.eyeOff),
  x: 10.05,
  y: 1.85,
  w: 0.9,
  h: 0.9,
});

// Overline avec icône alerte
slide2.addImage({
  data: svgToDataUri(ICONS.alertTriangle),
  x: 0.6,
  y: 3.6,
  w: 0.3,
  h: 0.3,
});

slide2.addText("LE PROBLÈME", {
  x: 1,
  y: 3.6,
  w: 3,
  h: 0.3,
  fontSize: 10,
  fontFace: BRAND.fonts.body,
  color: BRAND.colors.red,
  bold: true,
  charSpacing: 3,
});

// Message principal
slide2.addText([
  { text: "Votre flotte électrique", options: { breakLine: true } },
  { text: "charge ", options: { color: BRAND.colors.white } },
  { text: "à l'aveugle.", options: { color: BRAND.colors.slate400 } }
], {
  x: 0.6,
  y: 4,
  w: 8,
  h: 1.4,
  fontSize: 48,
  fontFace: BRAND.fonts.display,
  color: BRAND.colors.white,
  bold: true,
  lineSpacing: 55,
});

// ============================================
// SLIDE 3 : AGITATE
// ============================================
let slide3 = pptx.addSlide();
slide3.background = { color: BRAND.colors.white };

// Zone gauche - chiffre monumental
slide3.addText("73", {
  x: 0.3,
  y: 0.8,
  w: 5,
  h: 3,
  fontSize: 180,
  fontFace: BRAND.fonts.display,
  color: BRAND.colors.carbon,
  bold: true,
});

slide3.addText("%", {
  x: 4.2,
  y: 1.4,
  w: 1.5,
  h: 1.5,
  fontSize: 100,
  fontFace: BRAND.fonts.display,
  color: BRAND.colors.slate400,
  bold: true,
});

slide3.addText("de l'énergie consommée par les flottes provient de sources carbonées.", {
  x: 0.6,
  y: 3.6,
  w: 4.5,
  h: 1,
  fontSize: 20,
  fontFace: BRAND.fonts.body,
  color: BRAND.colors.carbon,
  lineSpacing: 28,
});

// Zone droite - conséquences (fond sombre)
slide3.addShape(pptx.shapes.RECTANGLE, {
  x: 5.8,
  y: 0,
  w: 7.53,
  h: 5.63,
  fill: { color: BRAND.colors.carbon },
});

// Conséquence 1
slide3.addShape(pptx.shapes.RECTANGLE, {
  x: 6.2,
  y: 0.6,
  w: 6.5,
  h: 1.3,
  fill: { color: BRAND.colors.white, transparency: 97 },
});

slide3.addShape(pptx.shapes.RECTANGLE, {
  x: 6.2,
  y: 0.6,
  w: 0.05,
  h: 1.3,
  fill: { color: BRAND.colors.flash },
});

slide3.addImage({
  data: svgToDataUri(ICONS.shieldAlert),
  x: 6.5,
  y: 0.85,
  w: 0.5,
  h: 0.5,
});

slide3.addText("Risque de greenwashing", {
  x: 7.2,
  y: 0.8,
  w: 5,
  h: 0.4,
  fontSize: 14,
  fontFace: BRAND.fonts.display,
  color: BRAND.colors.white,
  bold: true,
});

slide3.addText("Vos engagements Net Zero sont menacés par un manque de traçabilité.", {
  x: 7.2,
  y: 1.2,
  w: 5,
  h: 0.5,
  fontSize: 12,
  fontFace: BRAND.fonts.body,
  color: BRAND.colors.slate400,
});

// Conséquence 2
slide3.addShape(pptx.shapes.RECTANGLE, {
  x: 6.2,
  y: 2.1,
  w: 6.5,
  h: 1.3,
  fill: { color: BRAND.colors.white, transparency: 97 },
});

slide3.addShape(pptx.shapes.RECTANGLE, {
  x: 6.2,
  y: 2.1,
  w: 0.05,
  h: 1.3,
  fill: { color: BRAND.colors.flash },
});

slide3.addImage({
  data: svgToDataUri(ICONS.fileText),
  x: 6.5,
  y: 2.35,
  w: 0.5,
  h: 0.5,
});

slide3.addText("Rapports ESG incomplets", {
  x: 7.2,
  y: 2.3,
  w: 5,
  h: 0.4,
  fontSize: 14,
  fontFace: BRAND.fonts.display,
  color: BRAND.colors.white,
  bold: true,
});

slide3.addText("Données manquantes pour prouver votre impact réel.", {
  x: 7.2,
  y: 2.7,
  w: 5,
  h: 0.5,
  fontSize: 12,
  fontFace: BRAND.fonts.body,
  color: BRAND.colors.slate400,
});

// Conséquence 3
slide3.addShape(pptx.shapes.RECTANGLE, {
  x: 6.2,
  y: 3.6,
  w: 6.5,
  h: 1.3,
  fill: { color: BRAND.colors.white, transparency: 97 },
});

slide3.addShape(pptx.shapes.RECTANGLE, {
  x: 6.2,
  y: 3.6,
  w: 0.05,
  h: 1.3,
  fill: { color: BRAND.colors.flash },
});

slide3.addImage({
  data: svgToDataUri(ICONS.trendingUp),
  x: 6.5,
  y: 3.85,
  w: 0.5,
  h: 0.5,
});

slide3.addText("Surcoûts cachés", {
  x: 7.2,
  y: 3.8,
  w: 5,
  h: 0.4,
  fontSize: 14,
  fontFace: BRAND.fonts.display,
  color: BRAND.colors.white,
  bold: true,
});

slide3.addText("Charge aux heures de pointe = facture gonflée.", {
  x: 7.2,
  y: 4.2,
  w: 5,
  h: 0.5,
  fontSize: 12,
  fontFace: BRAND.fonts.body,
  color: BRAND.colors.slate400,
});

// ============================================
// SLIDE 4 : SOLUTION
// ============================================
let slide4 = pptx.addSlide();
slide4.background = { color: BRAND.colors.oxygen };

// Halo lumineux (cercle très transparent)
slide4.addShape(pptx.shapes.OVAL, {
  x: -2,
  y: 2,
  w: 8,
  h: 8,
  fill: { color: BRAND.colors.flash, transparency: 85 },
});

// Badge "LA SOLUTION"
slide4.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 0.8,
  y: 1,
  w: 2,
  h: 0.5,
  fill: { color: BRAND.colors.white, transparency: 85 },
  rectRadius: 0.25,
});

slide4.addImage({
  data: svgToDataUri(ICONS.checkCircle),
  x: 0.95,
  y: 1.1,
  w: 0.3,
  h: 0.3,
});

slide4.addText("LA SOLUTION", {
  x: 1.3,
  y: 1.1,
  w: 1.4,
  h: 0.3,
  fontSize: 10,
  fontFace: BRAND.fonts.body,
  color: BRAND.colors.white,
  bold: true,
  charSpacing: 2,
});

// Message principal
slide4.addText("Synchronisez votre flotte avec l'énergie verte.", {
  x: 0.8,
  y: 1.8,
  w: 7.5,
  h: 1.8,
  fontSize: 52,
  fontFace: BRAND.fonts.display,
  color: BRAND.colors.white,
  bold: true,
  lineSpacing: 58,
});

// Sous-texte
slide4.addText("VoltaPilot orchestre la recharge en harmonie avec les cycles de production renouvelable et les limites de votre écosystème.", {
  x: 0.8,
  y: 3.8,
  w: 6,
  h: 0.8,
  fontSize: 16,
  fontFace: BRAND.fonts.body,
  color: BRAND.colors.white,
  transparency: 25,
  lineSpacing: 24,
});

// Illustration flux énergétique - cercles
slide4.addShape(pptx.shapes.OVAL, {
  x: 10,
  y: 0.8,
  w: 1.5,
  h: 1.5,
  fill: { color: BRAND.colors.white, transparency: 85 },
  line: { color: BRAND.colors.white, width: 1, transparency: 70 },
});

slide4.addImage({
  data: svgToDataUri(ICONS.sun),
  x: 10.3,
  y: 1.1,
  w: 0.9,
  h: 0.9,
});

slide4.addShape(pptx.shapes.OVAL, {
  x: 11.2,
  y: 2.2,
  w: 1,
  h: 1,
  fill: { color: BRAND.colors.flash },
});

slide4.addImage({
  data: svgToDataUri(ICONS.zap),
  x: 11.4,
  y: 2.4,
  w: 0.6,
  h: 0.6,
});

slide4.addShape(pptx.shapes.OVAL, {
  x: 10.2,
  y: 3.3,
  w: 1.2,
  h: 1.2,
  fill: { color: BRAND.colors.white, transparency: 85 },
  line: { color: BRAND.colors.white, width: 1, transparency: 70 },
});

slide4.addImage({
  data: svgToDataUri(ICONS.battery),
  x: 10.45,
  y: 3.55,
  w: 0.7,
  h: 0.7,
});

// Lignes de flux
slide4.addShape(pptx.shapes.LINE, {
  x: 10.8,
  y: 2.2,
  w: 0.5,
  h: 0.3,
  line: { color: BRAND.colors.white, width: 1, transparency: 70, dashType: "dash" },
});

// ============================================
// SLIDE 5 : HOW IT WORKS
// ============================================
let slide5 = pptx.addSlide();
slide5.background = { color: BRAND.colors.mist };

// Header
slide5.addText("COMMENT ÇA MARCHE", {
  x: 0.6,
  y: 0.5,
  w: 4,
  h: 0.3,
  fontSize: 10,
  fontFace: BRAND.fonts.body,
  color: BRAND.colors.oxygen,
  bold: true,
  charSpacing: 3,
});

slide5.addText("3 étapes. Zéro friction.", {
  x: 0.6,
  y: 0.85,
  w: 6,
  h: 0.6,
  fontSize: 36,
  fontFace: BRAND.fonts.display,
  color: BRAND.colors.carbon,
  bold: true,
});

// Étape 1
slide5.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 0.6,
  y: 1.8,
  w: 3.8,
  h: 3.5,
  fill: { color: BRAND.colors.white },
  line: { color: BRAND.colors.fog, width: 1 },
  rectRadius: 0.2,
});

slide5.addShape(pptx.shapes.OVAL, {
  x: 1,
  y: 2.2,
  w: 0.8,
  h: 0.8,
  fill: { color: BRAND.colors.oxygenLight },
});

slide5.addImage({
  data: svgToDataUri(ICONS.activity),
  x: 1.1,
  y: 2.3,
  w: 0.6,
  h: 0.6,
});

slide5.addText("ÉTAPE 01", {
  x: 1,
  y: 3.2,
  w: 3,
  h: 0.3,
  fontSize: 10,
  fontFace: BRAND.fonts.body,
  color: BRAND.colors.slate400,
  bold: true,
  charSpacing: 2,
});

slide5.addText("Analyse", {
  x: 1,
  y: 3.5,
  w: 3,
  h: 0.5,
  fontSize: 22,
  fontFace: BRAND.fonts.display,
  color: BRAND.colors.carbon,
  bold: true,
});

slide5.addText("Prévisions météo, production solaire, état du réseau national en temps réel.", {
  x: 1,
  y: 4.1,
  w: 3,
  h: 0.9,
  fontSize: 12,
  fontFace: BRAND.fonts.body,
  color: BRAND.colors.slate600,
  lineSpacing: 18,
});

// Connecteur 1
slide5.addShape(pptx.shapes.LINE, {
  x: 4.4,
  y: 3.5,
  w: 0.5,
  h: 0,
  line: { color: BRAND.colors.fog, width: 1 },
});

slide5.addShape(pptx.shapes.OVAL, {
  x: 4.8,
  y: 3.4,
  w: 0.2,
  h: 0.2,
  fill: { color: BRAND.colors.flash },
});

// Étape 2 (inversée - fond sombre)
slide5.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 4.9,
  y: 1.8,
  w: 3.8,
  h: 3.5,
  fill: { color: BRAND.colors.carbon },
  rectRadius: 0.2,
});

slide5.addShape(pptx.shapes.OVAL, {
  x: 5.3,
  y: 2.2,
  w: 0.8,
  h: 0.8,
  fill: { color: BRAND.colors.flash },
});

slide5.addImage({
  data: svgToDataUri(ICONS.refreshCw),
  x: 5.4,
  y: 2.3,
  w: 0.6,
  h: 0.6,
});

slide5.addText("ÉTAPE 02", {
  x: 5.3,
  y: 3.2,
  w: 3,
  h: 0.3,
  fontSize: 10,
  fontFace: BRAND.fonts.body,
  color: BRAND.colors.slate400,
  bold: true,
  charSpacing: 2,
});

slide5.addText("Synchronise", {
  x: 5.3,
  y: 3.5,
  w: 3,
  h: 0.5,
  fontSize: 22,
  fontFace: BRAND.fonts.display,
  color: BRAND.colors.white,
  bold: true,
});

slide5.addText("Algorithme de matching avec les pics de production d'énergie verte.", {
  x: 5.3,
  y: 4.1,
  w: 3,
  h: 0.9,
  fontSize: 12,
  fontFace: BRAND.fonts.body,
  color: BRAND.colors.slate400,
  lineSpacing: 18,
});

// Connecteur 2
slide5.addShape(pptx.shapes.LINE, {
  x: 8.7,
  y: 3.5,
  w: 0.5,
  h: 0,
  line: { color: BRAND.colors.fog, width: 1 },
});

slide5.addShape(pptx.shapes.OVAL, {
  x: 9.1,
  y: 3.4,
  w: 0.2,
  h: 0.2,
  fill: { color: BRAND.colors.flash },
});

// Étape 3
slide5.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 9.2,
  y: 1.8,
  w: 3.8,
  h: 3.5,
  fill: { color: BRAND.colors.white },
  line: { color: BRAND.colors.fog, width: 1 },
  rectRadius: 0.2,
});

slide5.addShape(pptx.shapes.OVAL, {
  x: 9.6,
  y: 2.2,
  w: 0.8,
  h: 0.8,
  fill: { color: BRAND.colors.oxygenLight },
});

slide5.addImage({
  data: svgToDataUri(ICONS.target),
  x: 9.7,
  y: 2.3,
  w: 0.6,
  h: 0.6,
});

slide5.addText("ÉTAPE 03", {
  x: 9.6,
  y: 3.2,
  w: 3,
  h: 0.3,
  fontSize: 10,
  fontFace: BRAND.fonts.body,
  color: BRAND.colors.slate400,
  bold: true,
  charSpacing: 2,
});

slide5.addText("Optimise", {
  x: 9.6,
  y: 3.5,
  w: 3,
  h: 0.5,
  fontSize: 22,
  fontFace: BRAND.fonts.display,
  color: BRAND.colors.carbon,
  bold: true,
});

slide5.addText("Recharge automatique au moment du plus bas carbone.", {
  x: 9.6,
  y: 4.1,
  w: 3,
  h: 0.9,
  fontSize: 12,
  fontFace: BRAND.fonts.body,
  color: BRAND.colors.slate600,
  lineSpacing: 18,
});

// ============================================
// SLIDE 6 : PROOF
// ============================================
let slide6 = pptx.addSlide();
slide6.background = { color: BRAND.colors.white };

// Metric 1 (fond sombre)
slide6.addShape(pptx.shapes.RECTANGLE, {
  x: 0,
  y: 0,
  w: 4.44,
  h: 4,
  fill: { color: BRAND.colors.carbon },
});

slide6.addShape(pptx.shapes.OVAL, {
  x: 1.7,
  y: 0.6,
  w: 0.7,
  h: 0.7,
  fill: { color: BRAND.colors.flash, transparency: 85 },
});

slide6.addImage({
  data: svgToDataUri(ICONS.leaf),
  x: 1.82,
  y: 0.72,
  w: 0.5,
  h: 0.5,
});

slide6.addText("-42%", {
  x: 0.5,
  y: 1.5,
  w: 3.5,
  h: 1,
  fontSize: 56,
  fontFace: BRAND.fonts.display,
  color: BRAND.colors.flash,
  bold: true,
  align: "center",
});

slide6.addText("Empreinte carbone", {
  x: 0.5,
  y: 2.6,
  w: 3.5,
  h: 0.4,
  fontSize: 13,
  fontFace: BRAND.fonts.body,
  color: BRAND.colors.slate400,
  align: "center",
});

// Metric 2
slide6.addShape(pptx.shapes.RECTANGLE, {
  x: 4.44,
  y: 0,
  w: 4.44,
  h: 4,
  fill: { color: BRAND.colors.white },
  line: { color: BRAND.colors.fog, width: 1 },
});

slide6.addShape(pptx.shapes.OVAL, {
  x: 6.3,
  y: 0.6,
  w: 0.7,
  h: 0.7,
  fill: { color: BRAND.colors.oxygenLight },
});

slide6.addImage({
  data: svgToDataUri(ICONS.truck),
  x: 6.42,
  y: 0.72,
  w: 0.5,
  h: 0.5,
});

slide6.addText("150+", {
  x: 5,
  y: 1.5,
  w: 3.5,
  h: 1,
  fontSize: 56,
  fontFace: BRAND.fonts.display,
  color: BRAND.colors.carbon,
  bold: true,
  align: "center",
});

slide6.addText("Flottes équipées", {
  x: 5,
  y: 2.6,
  w: 3.5,
  h: 0.4,
  fontSize: 13,
  fontFace: BRAND.fonts.body,
  color: BRAND.colors.slate600,
  align: "center",
});

// Metric 3
slide6.addShape(pptx.shapes.RECTANGLE, {
  x: 8.88,
  y: 0,
  w: 4.45,
  h: 4,
  fill: { color: BRAND.colors.white },
});

slide6.addShape(pptx.shapes.OVAL, {
  x: 10.7,
  y: 0.6,
  w: 0.7,
  h: 0.7,
  fill: { color: BRAND.colors.oxygenLight },
});

slide6.addImage({
  data: svgToDataUri(ICONS.shieldCheck),
  x: 10.82,
  y: 0.72,
  w: 0.5,
  h: 0.5,
});

slide6.addText("98%", {
  x: 9.5,
  y: 1.5,
  w: 3.5,
  h: 1,
  fontSize: 56,
  fontFace: BRAND.fonts.display,
  color: BRAND.colors.carbon,
  bold: true,
  align: "center",
});

slide6.addText("Disponibilité garantie", {
  x: 9.5,
  y: 2.6,
  w: 3.5,
  h: 0.4,
  fontSize: 13,
  fontFace: BRAND.fonts.body,
  color: BRAND.colors.slate600,
  align: "center",
});

// Testimonial
slide6.addShape(pptx.shapes.RECTANGLE, {
  x: 0,
  y: 4,
  w: 13.33,
  h: 1.63,
  fill: { color: BRAND.colors.mist },
});

slide6.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 0.5,
  y: 4.3,
  w: 0.7,
  h: 0.7,
  fill: { color: BRAND.colors.oxygen },
  rectRadius: 0.15,
});

slide6.addImage({
  data: svgToDataUri(ICONS.quote),
  x: 0.6,
  y: 4.4,
  w: 0.5,
  h: 0.5,
});

slide6.addText("VoltaPilot a transformé notre approche de la mobilité durable. Nous avons enfin des données probantes pour nos rapports ESG.", {
  x: 1.5,
  y: 4.25,
  w: 10,
  h: 0.6,
  fontSize: 16,
  fontFace: BRAND.fonts.body,
  color: BRAND.colors.carbon,
  italic: true,
});

slide6.addText("Marie Dupont, CSO @ Entreprise Exemple", {
  x: 1.5,
  y: 4.9,
  w: 6,
  h: 0.3,
  fontSize: 12,
  fontFace: BRAND.fonts.body,
  color: BRAND.colors.slate400,
});

// ============================================
// SLIDE 7 : CTA
// ============================================
let slide7 = pptx.addSlide();
slide7.background = { color: BRAND.colors.carbon };

// Halo central
slide7.addShape(pptx.shapes.OVAL, {
  x: 3,
  y: 0,
  w: 8,
  h: 8,
  fill: { color: BRAND.colors.oxygen, transparency: 90 },
});

// Icône calendrier
slide7.addShape(pptx.shapes.OVAL, {
  x: 6,
  y: 0.8,
  w: 1,
  h: 1,
  fill: { color: BRAND.colors.flash, transparency: 85 },
});

slide7.addImage({
  data: svgToDataUri(ICONS.calendar),
  x: 6.15,
  y: 0.95,
  w: 0.7,
  h: 0.7,
});

// Message CTA
slide7.addText([
  { text: "Prêt à synchroniser", options: { breakLine: true } },
  { text: "votre flotte ?" }
], {
  x: 1,
  y: 1.9,
  w: 11.33,
  h: 1.6,
  fontSize: 52,
  fontFace: BRAND.fonts.display,
  color: BRAND.colors.white,
  bold: true,
  align: "center",
  lineSpacing: 60,
});

// Bouton CTA
slide7.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 4.5,
  y: 3.8,
  w: 4.33,
  h: 0.8,
  fill: { color: BRAND.colors.flash },
  rectRadius: 0.1,
});

slide7.addText("Demander une démo", {
  x: 4.5,
  y: 3.85,
  w: 3.6,
  h: 0.7,
  fontSize: 17,
  fontFace: BRAND.fonts.display,
  color: BRAND.colors.carbon,
  bold: true,
  align: "center",
});

slide7.addImage({
  data: svgToDataUri(ICONS.arrowRight),
  x: 8.1,
  y: 4,
  w: 0.4,
  h: 0.4,
});

// Contact
slide7.addText("contact@voltapilot.io", {
  x: 4.5,
  y: 4.8,
  w: 4.33,
  h: 0.3,
  fontSize: 13,
  fontFace: BRAND.fonts.mono,
  color: BRAND.colors.slate400,
  align: "center",
});

// Brand
slide7.addText("VoltaPilot", {
  x: 10,
  y: 5.1,
  w: 2.5,
  h: 0.3,
  fontSize: 14,
  fontFace: BRAND.fonts.display,
  color: BRAND.colors.oxygen,
  align: "right",
});

// ============================================
// EXPORT
// ============================================
const outputPath = "./outputs/voltapilot-v3-creative.pptx";

const outputDir = path.dirname(outputPath);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

pptx.writeFile({ fileName: outputPath })
  .then(fileName => {
    console.log(`\n✅ Présentation PPTX générée avec succès !`);
    console.log(`📁 Fichier : ${fileName}`);
    console.log(`\n📊 Contenu :`);
    console.log(`   - 7 slides (framework PAS)`);
    console.log(`   - Brand identity VoltaPilot respectée`);
    console.log(`   - Niveau de créativité : 3 (Audacieux)`);
    console.log(`   - Icônes en SVG base64`);
    console.log(`\n👉 Ouvrez le fichier dans Google Slides ou PowerPoint pour évaluer.`);
  })
  .catch(err => {
    console.error("❌ Erreur lors de la génération :", err);
  });
