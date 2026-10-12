// Builds the Training Copilot's copy of the app's own guidance.
//
// Reads the pilot-facing pages listed in PAGES, pulls out the text a pilot
// actually sees (headings, paragraphs, checklist items, tips), and writes
// base44/functions/syncKnowledge/entry.ts from
// scripts/syncKnowledge.template.ts with that text embedded.
//
// Run after changing checklist or training content:
//   node scripts/build-copilot-knowledge.mjs
// then run the "Sync Training Copilot knowledge" workflow once.
//
// Left out on purpose: quiz questions and answers (so the copilot can never
// leak them), styling strings, and admin/analytics pages.
//
// Pass --preview to print the extracted text instead of writing the function.

import { parse } from '@babel/parser';
import _traverse from '@babel/traverse';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const traverse = _traverse.default || _traverse;
const root = join(dirname(fileURLToPath(import.meta.url)), '..');

// file (under src/), article title, in-app link
const PAGES = [
  ['pages/StartCapture.jsx', 'Capture checklist (Start Capture)', '/StartCapture'],
  ['pages/StandardCaptureChecklist.jsx', 'Standard capture checklist', '/StandardCaptureChecklist'],
  ['components/PreMissionFocusCheck.jsx', 'Pre-mission focus check', '/StartCapture'],
  ['pages/QuickReference.jsx', 'Quick reference', '/QuickReference'],
  ['pages/Scenarios.jsx', 'Field scenarios', '/Scenarios'],
  ['pages/PanoramaGuide.jsx', 'Panorama guide', '/PanoramaGuide'],
  ['pages/GPSVerifier.jsx', 'GPS Altitude Verifier', '/GPSVerifier'],
  ['pages/GpsTimer.jsx', 'GPS stabilisation timer', '/GpsTimer'],
  ['pages/EnvGuideModules.jsx', 'Environment guide: overview', '/EnvGuideModules'],
  ['pages/EnvGuide1.jsx', 'Environment guide: module 1', '/EnvGuide1'],
  ['pages/EnvGuide2.jsx', 'Environment guide: module 2', '/EnvGuide2'],
  ['pages/EnvGuide3.jsx', 'Environment guide: module 3', '/EnvGuide3'],
  ['pages/EnvGuide4.jsx', 'Environment guide: module 4', '/EnvGuide4'],
  ['pages/EnvGuide5.jsx', 'Environment guide: module 5', '/EnvGuide5'],
  ['pages/RooftopTrainingModules.jsx', 'Rooftop training modules', '/RooftopTrainingModules'],
  ['pages/RooftopModule1.jsx', 'Rooftop training: module 1', '/RooftopModule1'],
  ['pages/RooftopModule2.jsx', 'Rooftop training: module 2', '/RooftopModule2'],
  ['pages/RooftopModule3.jsx', 'Rooftop training: module 3', '/RooftopModule3'],
  ['pages/RooftopModule4.jsx', 'Rooftop training: module 4', '/RooftopModule4'],
  ['pages/RooftopModule5.jsx', 'Rooftop training: module 5', '/RooftopModule5'],
  ['pages/TrainingVideos.jsx', 'Training videos', '/TrainingVideos'],
  ['pages/TrainingHub.jsx', 'Training hub', '/TrainingHub'],
  ['pages/ToolsLinks.jsx', 'Tools and links', '/ToolsLinks'],
];

const INLINE_TAGS = new Set(['strong', 'b', 'em', 'i', 'span', 'code', 'a', 'u', 'sub', 'sup', 'br', 'mark', 'small']);
const HEADING_TAGS = new Set(['h1', 'h2', 'h3', 'h4', 'h5']);
// Attributes / object keys whose string value is text a pilot reads.
const TEXT_KEYS = new Set([
  'title', 'subtitle', 'description', 'label', 'text', 'heading', 'question', 'tip', 'note', 'warning', 'content',
  'detail', 'details', 'caption', 'summary', 'instruction', 'instructions', 'body', 'message', 'hint', 'why',
  'what', 'how', 'action', 'fix', 'cause', 'symptom', 'solution', 'problem', 'step', 'name', 'info', 'helper',
  'helperText', 'prompt', 'reason', 'example', 'requirement', 'consequence', 'rule', 'header', 'sublabel', 'value',
  'placeholderText', 'explanation', 'intro', 'outro', 'takeaway', 'scenario', 'response', 'answer', 'do', 'dont',
]);
const SKIP_KEYS = new Set([
  'className', 'class', 'id', 'key', 'type', 'variant', 'size', 'icon', 'color', 'href', 'to', 'src', 'queryKey',
  'style', 'alt', 'path', 'url', 'link', 'page', 'route', 'videoId', 'video', 'image', 'img', 'bg', 'border',
  'gradient', 'accent', 'iconColor', 'bgColor', 'textColor', 'borderColor', 'target', 'rel', 'role', 'htmlFor',
  'placeholder', 'feature_name', 'action_type', 'site_type', 'item_id', 'agent_name', 'event', 'status', 'mode',
]);
// An object with any of these keys is a quiz question: skip it entirely.
const QUIZ_KEYS = /^(correct|correctAnswer|correct_answer|correctIndex|correctOption|isCorrect|answerIndex)$/;
// Calls whose string arguments are never content.
const SKIP_CALLEES = /^(console|cn|clsx|createPageUrl|useQuery|useMutation|navigate|require|trackFeatureUsage|toast|alert|localStorage|sessionStorage|JSON|Intl|parseInt|parseFloat)\b/;

const clean = (s) => String(s).replace(/\s+/g, ' ').trim();

function looksLikeStyling(s) {
  const tokens = s.split(/\s+/).filter(Boolean);
  if (!tokens.length) return true;
  const techy = tokens.filter((t) => /^[!a-z0-9:\[\]\/.\-%#()]+$/.test(t) && (/[-:\[\/]/.test(t) || /^(flex|grid|block|hidden|relative|absolute|fixed|inline|truncate|italic|uppercase|group|peer|border|rounded|shadow|underline|transition|container|sr-only)$/.test(t)));
  return techy.length / tokens.length > 0.6;
}

function isProse(s) {
  if (!s || s.length < 2) return false;
  if (/^https?:\/\//.test(s) || /^[#./@]/.test(s)) return false;
  if (looksLikeStyling(s)) return false;
  if (!/[A-Za-z]/.test(s)) return /\d/.test(s) && s.length <= 20; // bare values like "1/1000"
  return true;
}

function jsxName(node) {
  const n = node.openingElement?.name;
  if (!n) return '';
  if (n.type === 'JSXIdentifier') return n.name;
  if (n.type === 'JSXMemberExpression') return `${n.object.name}.${n.property.name}`;
  return '';
}

function calleeName(node) {
  if (!node) return '';
  if (node.type === 'Identifier') return node.name;
  if (node.type === 'MemberExpression') return `${calleeName(node.object)}.${node.property?.name || ''}`;
  return '';
}

function extract(source) {
  const ast = parse(source, { sourceType: 'module', plugins: ['jsx'] });
  const out = []; // { pos, text, heading }
  const push = (pos, text, heading = false) => {
    const t = clean(text);
    if (isProse(t)) out.push({ pos, text: t, heading });
  };

  // Flattened text of an element made of text + inline tags; null if it has block children.
  function flatten(el) {
    let s = '';
    for (const c of el.children || []) {
      if (c.type === 'JSXText') s += c.value;
      else if (c.type === 'JSXExpressionContainer') {
        const e = c.expression;
        if (e.type === 'StringLiteral') s += e.value;
        else if (e.type === 'TemplateLiteral' && e.expressions.length === 0) s += e.quasis[0].value.cooked;
        else if (e.type === 'JSXEmptyExpression') s += '';
        else s += ' ';
      } else if (c.type === 'JSXElement') {
        if (!INLINE_TAGS.has(jsxName(c))) return null;
        const inner = flatten(c);
        if (inner === null) return null;
        s += jsxName(c) === 'br' ? ' ' : inner;
      } else if (c.type === 'JSXFragment') {
        return null;
      }
    }
    return s;
  }

  traverse(ast, {
    ImportDeclaration(p) { p.skip(); },
    CallExpression(p) {
      if (SKIP_CALLEES.test(calleeName(p.node.callee))) p.skip();
    },
    ObjectExpression(p) {
      const isQuiz = p.node.properties.some((pr) => pr.type === 'ObjectProperty' && QUIZ_KEYS.test(pr.key?.name || pr.key?.value || ''));
      if (isQuiz) p.skip();
    },
    JSXAttribute(p) {
      const name = p.node.name?.name;
      if (SKIP_KEYS.has(name)) { p.skip(); return; }
      const v = p.node.value;
      if (v?.type === 'StringLiteral' && TEXT_KEYS.has(name)) push(v.start, v.value);
    },
    JSXElement(p) {
      const hasText = p.node.children.some((c) => c.type === 'JSXText' && c.value.trim());
      if (!hasText) return;
      const flat = flatten(p.node);
      if (flat === null) {
        // Mixed block content: take the loose text pieces, keep walking into children.
        for (const c of p.node.children) if (c.type === 'JSXText') push(c.start, c.value);
        return;
      }
      push(p.node.start, flat, HEADING_TAGS.has(jsxName(p.node)));
      p.skip();
    },
    ObjectProperty(p) {
      const key = p.node.key?.name || p.node.key?.value;
      if (SKIP_KEYS.has(key)) { p.skip(); return; }
      const v = p.node.value;
      if (v.type === 'StringLiteral' && (TEXT_KEYS.has(key) || v.value.trim().split(/\s+/).length >= 3)) {
        push(v.start, v.value, key === 'title' || key === 'heading' || key === 'header');
      } else if (v.type === 'TemplateLiteral' && v.expressions.length === 0) {
        push(v.start, v.quasis[0].value.cooked, false);
      }
    },
    ArrayExpression(p) {
      for (const el of p.node.elements) {
        if (el?.type === 'StringLiteral' && el.value.trim().split(/\s+/).length >= 2) push(el.start, el.value);
      }
    },
  });

  out.sort((a, b) => a.pos - b.pos);
  const lines = [];
  let prev = '';
  for (const item of out) {
    if (item.text === prev) continue; // immediate repeats (label reused as aria text, etc.)
    prev = item.text;
    lines.push(item.heading ? `\n## ${item.text}\n` : `- ${item.text}`);
  }
  return lines.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

const articles = [];
const missing = [];
for (const [file, title, url] of PAGES) {
  const full = join(root, 'src', file);
  if (!existsSync(full)) { missing.push(file); continue; }
  const content = extract(readFileSync(full, 'utf8'));
  if (content.length < 80) { missing.push(`${file} (no text)`); continue; }
  articles.push({ page_id: `app:${file.replace(/^.*\//, '').replace(/\.jsx$/, '')}`, title, url, content });
}

if (process.argv.includes('--preview')) {
  const only = process.argv[process.argv.indexOf('--preview') + 1];
  for (const a of articles) {
    if (only && !a.page_id.includes(only)) continue;
    console.log(`\n===== ${a.title} (${a.page_id}, ${a.content.length} chars) =====\n${a.content}`);
  }
} else {
  const template = readFileSync(join(root, 'scripts/syncKnowledge.template.ts'), 'utf8');
  if (!template.includes('/*__APP_ARTICLES__*/[]')) throw new Error('Template marker /*__APP_ARTICLES__*/[] not found');
  const target = join(root, 'base44/functions/syncKnowledge/entry.ts');
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, template.replace('/*__APP_ARTICLES__*/[]', () => JSON.stringify(articles, null, 1)));
}

console.error(JSON.stringify({
  articles: articles.length,
  chars: articles.reduce((n, a) => n + a.content.length, 0),
  missing,
  list: articles.map((a) => `${a.page_id} | ${a.content.length}`),
}, null, 1));
