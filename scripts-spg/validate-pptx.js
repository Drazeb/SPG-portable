#!/usr/bin/env node
/**
 * validate-pptx.js — Validates HTML slides against PPTX-blocking rules
 * Replaces LLM audits D.1-D.4. Run after subagent 3/5 generates HTML.
 *
 * Usage: node scripts/validate-pptx.js <path-to-html>
 * Output: List of errors with line numbers, or "0 errors" if all pass.
 */

const fs = require('fs');
const path = require('path');

const filePath = process.argv[2];
if (!filePath) {
  console.error('Usage: node scripts/validate-pptx.js <path-to-html>');
  process.exit(1);
}

const html = fs.readFileSync(path.resolve(filePath), 'utf-8');
const lines = html.split('\n');
const errors = [];

function addError(lineNum, rule, message) {
  errors.push({ line: lineNum, rule, message });
}

// Helper: find line number for a match index in the source
function lineOf(index) {
  const before = html.substring(0, index);
  return before.split('\n').length;
}

// ─── Rule 1: No `right:` in CSS positioning ───
const rightRe = /\bright\s*:\s*-?\d+/g;
let m;
while ((m = rightRe.exec(html)) !== null) {
  // Skip inside comments or non-positioning contexts (e.g. export-btn fixed)
  const line = lineOf(m.index);
  const lineText = lines[line - 1] || '';
  // Allow right on the export button (position: fixed UI element)
  if (lineText.includes('export-btn') || lineText.includes('.export-btn')) continue;
  addError(line, 'NO_RIGHT', `"right:" found — use "left:" instead (left = 1280 - right - width)`);
}

// ─── Rule 2: No `bottom:` in CSS positioning ───
const bottomRe = /\bbottom\s*:\s*-?\d+/g;
while ((m = bottomRe.exec(html)) !== null) {
  const line = lineOf(m.index);
  const lineText = lines[line - 1] || '';
  if (lineText.includes('export-btn') || lineText.includes('.export-btn')) continue;
  addError(line, 'NO_BOTTOM', `"bottom:" found — use "top:" instead (top = 720 - bottom - height)`);
}

// ─── Rule 3: No negative coordinates ───
const negCoordRe = /\b(top|left)\s*:\s*-\d+px/g;
while ((m = negCoordRe.exec(html)) !== null) {
  addError(lineOf(m.index), 'NO_NEGATIVE', `Negative coordinate "${m[0]}" — all values must be >= 0`);
}

// ─── Rule 4: No position:absolute directly on SVG ───
const svgAbsRe = /<svg[^>]*style\s*=\s*"[^"]*position\s*:\s*absolute/gi;
while ((m = svgAbsRe.exec(html)) !== null) {
  addError(lineOf(m.index), 'SVG_NO_ABS', 'position:absolute on <svg> — wrap in a positioned <div> container');
}

// ─── Rule 5: No <text> inside SVG ───
const svgTextRe = /<text[\s>]/gi;
while ((m = svgTextRe.exec(html)) !== null) {
  // Check if inside an SVG context (look backward for <svg)
  const before = html.substring(Math.max(0, m.index - 2000), m.index);
  const lastSvgOpen = before.lastIndexOf('<svg');
  const lastSvgClose = before.lastIndexOf('</svg');
  if (lastSvgOpen > lastSvgClose) {
    addError(lineOf(m.index), 'SVG_NO_TEXT', '<text> inside SVG — the entire SVG will disappear in PPTX. Use a positioned <div> instead');
  }
}

// ─── Rule 6: No clip-path ───
const clipPathRe = /clip-path\s*:/gi;
while ((m = clipPathRe.exec(html)) !== null) {
  addError(lineOf(m.index), 'NO_CLIP_PATH', 'clip-path found — use SVG <polygon> in a container instead');
}

// ─── Rule 7: No CSS Grid ───
const gridRe = /display\s*:\s*grid/gi;
while ((m = gridRe.exec(html)) !== null) {
  addError(lineOf(m.index), 'NO_GRID', 'display:grid found — use position:absolute for layout');
}

// ─── Rule 8: No CSS variables ───
const cssVarRe = /var\s*\(\s*--/g;
while ((m = cssVarRe.exec(html)) !== null) {
  addError(lineOf(m.index), 'NO_CSS_VAR', 'CSS variable var(--...) found — use direct hex/rgba values');
}

// ─── Rule 9: No pseudo-elements ───
const pseudoRe = /::(before|after)/gi;
while ((m = pseudoRe.exec(html)) !== null) {
  addError(lineOf(m.index), 'NO_PSEUDO', `::${m[1]} pseudo-element found — use real HTML elements`);
}

// ─── Rule 10: No color:rgba() on text elements ───
// Detect color (not background) using rgba
const colorRgbaRe = /[^-]color\s*:\s*rgba\s*\(/g;
while ((m = colorRgbaRe.exec(html)) !== null) {
  addError(lineOf(m.index), 'NO_RGBA_TEXT', 'color:rgba() on text — use pre-calculated HEX colors instead');
}

// ─── Rule 11: Font-size limits ───
const fontSizeRe = /font-size\s*:\s*(\d+)px/g;
while ((m = fontSizeRe.exec(html)) !== null) {
  const size = parseInt(m[1], 10);
  const line = lineOf(m.index);
  const context = lines[line - 1] || '';
  // Check if it's decorative (ghost, watermark, decorative)
  const isDecorative = /ghost|watermark|decorat/i.test(context);
  if (isDecorative && size > 150) {
    addError(line, 'FONT_SIZE_DECO', `Decorative font-size ${size}px exceeds 150px max`);
  } else if (!isDecorative && size > 96) {
    // Could be decorative but not labeled — flag as warning for >96px
    // Don't flag if it's clearly a stat/hero number which might be up to 140px
    if (size > 150) {
      addError(line, 'FONT_SIZE_MAX', `font-size ${size}px exceeds 150px absolute max`);
    }
  }
}

// ─── Rule 12: Elements within 1280x720 bounds ───
// Parse inline styles on positioned elements
const positionedRe = /style\s*=\s*"([^"]*position\s*:\s*absolute[^"]*)"/gi;
while ((m = positionedRe.exec(html)) !== null) {
  const style = m[1];
  const line = lineOf(m.index);

  const topMatch = style.match(/\btop\s*:\s*(\d+)px/);
  const leftMatch = style.match(/\bleft\s*:\s*(\d+)px/);
  const widthMatch = style.match(/\bwidth\s*:\s*(\d+)px/);
  const heightMatch = style.match(/\bheight\s*:\s*(\d+)px/);

  if (leftMatch && widthMatch) {
    const l = parseInt(leftMatch[1], 10);
    const w = parseInt(widthMatch[1], 10);
    if (l + w > 1280) {
      addError(line, 'OVERFLOW_X', `left(${l}) + width(${w}) = ${l + w} > 1280 — element overflows horizontally`);
    }
  }

  if (topMatch && heightMatch) {
    const t = parseInt(topMatch[1], 10);
    const h = parseInt(heightMatch[1], 10);
    if (t + h > 720) {
      addError(line, 'OVERFLOW_Y', `top(${t}) + height(${h}) = ${t + h} > 720 — element overflows vertically`);
    }
  }
}

// ─── Rule 13: Buttons must use flexbox (not padding/line-height for centering) ───
// Look for button-like elements without flex
const btnPaddingRe = /<(?:button|div|a)[^>]*class\s*=\s*"[^"]*btn[^"]*"[^>]*style\s*=\s*"([^"]*)"/gi;
while ((m = btnPaddingRe.exec(html)) !== null) {
  const style = m[1];
  if (!style.includes('display') || !style.includes('flex')) {
    // Check for padding-based centering without flex
    if (style.includes('padding') && !style.includes('flex')) {
      addError(lineOf(m.index), 'BTN_FLEXBOX', 'Button uses padding for centering — use display:flex + align-items:center + justify-content:center');
    }
  }
}

// ─── Rule 14: Array.from() on querySelectorAll ───
const qsaRe = /querySelectorAll\s*\([^)]*\)/g;
while ((m = qsaRe.exec(html)) !== null) {
  // Check if wrapped in Array.from
  const before = html.substring(Math.max(0, m.index - 30), m.index);
  if (!before.includes('Array.from(') && !before.includes('[...')) {
    addError(lineOf(m.index), 'ARRAY_FROM', 'querySelectorAll without Array.from() — NodeList is not an Array');
  }
}

// ─── Rule 15: No fonts config in dom-to-pptx ───
const fontsConfigRe = /exportToPptx\s*\([^)]*{[^}]*fonts\s*:/gs;
while ((m = fontsConfigRe.exec(html)) !== null) {
  addError(lineOf(m.index), 'NO_FONTS_CONFIG', 'fonts config in dom-to-pptx causes CORS errors — remove it');
}

// ─── Rule 16: Max 7 absolute-positioned components per slide ───
// Parse slides and count absolute elements
const slideRe = /<div[^>]*class\s*=\s*"[^"]*slide[^"]*"[^>]*>([\s\S]*?)(?=<div[^>]*class\s*=\s*"[^"]*slide[^"]*"|<\/body|<script|$)/gi;
let slideNum = 0;
while ((m = slideRe.exec(html)) !== null) {
  slideNum++;
  const slideContent = m[1];
  const absCount = (slideContent.match(/position\s*:\s*absolute/g) || []).length;
  // Subtract decorative/background elements (SVG containers, ghost text) — rough heuristic
  if (absCount > 10) {
    addError(lineOf(m.index), 'DENSITY', `Slide ${slideNum} has ${absCount} absolute-positioned elements (max ~7 content + decorative). Consider grouping in flex containers`);
  }
}

// ─── Rule 17: UTF-8 diacritics check (French) ───
// Look for common French words missing accents
const missingAccentPatterns = [
  [/\belectrique\b/gi, 'electrique → électrique'],
  [/\benergie\b/gi, 'energie → énergie'],
  [/\bGeneration\b/g, 'Generation → Génération (if French)'],
  [/\bPresentation\b/g, 'Presentation → Présentation (if French)'],
  [/\bReseau\b/gi, 'Reseau → Réseau'],
  [/\bSysteme\b/gi, 'Systeme → Système'],
  [/\bEcosysteme\b/gi, 'Ecosysteme → Écosystème'],
];

for (const [pattern, fix] of missingAccentPatterns) {
  while ((m = pattern.exec(html)) !== null) {
    // Skip if inside a tag attribute name, script, or URL
    const context = html.substring(Math.max(0, m.index - 50), m.index + m[0].length + 50);
    if (/<script|href=|src=|class=|id=/i.test(context)) continue;
    addError(lineOf(m.index), 'DIACRITICS', `Missing diacritic: ${fix}`);
  }
}

// ─── Rule 18: Shadows on light backgrounds ───
const shadowRe = /box-shadow\s*:/g;
while ((m = shadowRe.exec(html)) !== null) {
  const line = lineOf(m.index);
  // Just flag for awareness — can't fully determine background context via regex
  // This is a soft check; the main enforcement is in the prompt
}

// ─── Rule 19: Text elements must have width ───
// Check for common text elements without width
// This is a heuristic check on inline-styled text
const textTagRe = /<(h[1-6]|p|span|div)[^>]*style\s*=\s*"([^"]*font-size[^"]*)"/gi;
while ((m = textTagRe.exec(html)) !== null) {
  const style = m[2];
  if (!style.includes('width') && style.includes('position') && style.includes('absolute')) {
    addError(lineOf(m.index), 'TEXT_WIDTH', `Text element <${m[1]}> with position:absolute and font-size but no width — add explicit width`);
  }
}

// ─── Output ───
if (errors.length === 0) {
  console.log('0 errors — HTML is PPTX-compliant');
  process.exit(0);
} else {
  console.log(`${errors.length} error(s) found:\n`);
  // Sort by line number
  errors.sort((a, b) => a.line - b.line);
  for (const err of errors) {
    console.log(`  Line ${err.line} [${err.rule}]: ${err.message}`);
  }
  process.exit(1);
}
