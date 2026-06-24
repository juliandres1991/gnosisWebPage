import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { defaultLanguage, salmosFiles, supportedLanguages, translationFiles } from '../assets/js/content.js';
import { escapeHtml, renderMarkdown } from '../assets/js/markdown.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');
const exists = (relativePath) => fs.existsSync(path.join(root, relativePath));
const readJson = (relativePath) => JSON.parse(read(relativePath));
const translations = Object.fromEntries(
  supportedLanguages.map((language) => [language, readJson(translationFiles[language])])
);

const tests = [];
function test(name, fn) {
  tests.push({ name, fn });
}

test('index.html is a shell that loads external CSS and module JS', () => {
  const index = read('index.html');
  assert.match(index, /<link rel="stylesheet" href="assets\/css\/styles\.css" \/>/);
  assert.match(index, /<script type="module" src="assets\/js\/app\.js"><\/script>/);
  assert.doesNotMatch(index, /<style>/);
  assert.doesNotMatch(index, /<script>(?!<\/script>)/);
});

test('required architecture files exist', () => {
  [
    'assets/css/styles.css',
    'assets/js/app.js',
    'assets/js/content.js',
    'assets/js/markdown.js',
    'assets/nature-mist-bg.png',
    'content/README.md',
    'content/i18n/en.json',
    'content/i18n/es.json',
    'content/i18n/fr.json',
    'content/i18n/pt.json',
    'content/i18n/de.json',
    '.kiro/specs/gnosis-web/requirements.md',
    '.kiro/specs/gnosis-web/design.md',
    '.kiro/specs/gnosis-web/tasks.md'
  ].forEach((file) => assert.equal(exists(file), true, `${file} should exist`));
});

test('CSS references assets relative to its own folder', () => {
  const css = read('assets/css/styles.css');
  assert.match(css, /url\("\.\.\/nature-mist-bg\.png"\)/);
  assert.match(css, /\.sidebar\{[\s\S]*position:sticky/);
  assert.match(css, /scrollbar-color:transparent transparent/);
  assert.match(css, /@media \(max-width:900px\)/);
});

test('translations cover all supported languages with the same keys', () => {
  const languages = ['en', 'es', 'fr', 'pt', 'de'];
  assert.equal(defaultLanguage, 'en');
  assert.deepEqual(supportedLanguages.toSorted(), languages.toSorted());
  assert.deepEqual(Object.keys(translations).sort(), languages.sort());

  const expectedKeys = Object.keys(translations.en).sort();
  for (const language of languages) {
    assert.deepEqual(Object.keys(translations[language]).sort(), expectedKeys, `${language} keys differ`);
  }
});

test('all data-i18n keys in index.html exist in translations', () => {
  const index = read('index.html');
  const keys = [...index.matchAll(/data-i18n="([^"]+)"/g)].map((match) => match[1]);
  const missing = [...new Set(keys)].filter((key) => !(key in translations.en));
  assert.deepEqual(missing, []);
});

test('Psalm file map points to existing non-empty files', () => {
  for (const [language, file] of Object.entries(salmosFiles)) {
    assert.ok(language in translations, `${language} should have translations`);
    assert.equal(exists(file), true, `${file} should exist`);
    assert.ok(read(file).trim().length > 100, `${file} should not be empty`);
  }
});

test('Markdown helpers escape HTML and render simple content', () => {
  assert.equal(escapeHtml('<b>"x"</b>'), '&lt;b&gt;&quot;x&quot;&lt;/b&gt;');
  const rendered = renderMarkdown('## Title\n\nHello **world**\n---\n<script>');
  assert.match(rendered, /<h2>Title<\/h2>/);
  assert.match(rendered, /Hello <strong>world<\/strong>/);
  assert.match(rendered, /<hr>/);
  assert.match(rendered, /&lt;script&gt;/);
});

test('runtime modules do not duplicate translation or markdown ownership', () => {
  const app = read('assets/js/app.js');
  const content = read('assets/js/content.js');
  assert.match(app, /from '\.\/content\.js'/);
  assert.match(app, /from '\.\/markdown\.js'/);
  assert.match(content, /loadTranslations/);
  assert.match(content, /content\/i18n/);
  assert.doesNotMatch(app, /const translations =/);
  assert.doesNotMatch(content, /home_desc:/);
  assert.doesNotMatch(app, /function renderMarkdown/);
});

let failed = 0;
for (const { name, fn } of tests) {
  try {
    fn();
    console.log(`ok - ${name}`);
  } catch (error) {
    failed += 1;
    console.error(`not ok - ${name}`);
    console.error(error);
  }
}

if (failed > 0) {
  process.exitCode = 1;
}
