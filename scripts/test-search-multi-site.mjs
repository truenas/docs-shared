// Checks the multi-site search client without a browser: index registry, the
// standing hub source, and that a missing index (e.g. /docs/nightly/pagefind/
// before it is published) does not break loading.
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const src = fs.readFileSync(path.join(here, '..', 'static', 'js', 'search-multi-site.js'), 'utf8');

const checked = new Set();
const fakeBox = (id, isChecked) => ({ id, checked: isChecked, dataset: { site: id } });
const ctx = {
  console: { error() {}, log() {}, warn() {} },
  window: {},
  document: {
    readyState: 'loading',
    addEventListener() {},
    getElementById: (id) => (id === 'docs-main-toggle' ? { checked: ctx.docsToggle } : null),
    querySelectorAll: (sel) => {
      if (sel.includes(':not(#docs-main-toggle)')) return [];
      if (sel.includes('.docs-version-option') && sel.includes(':checked')) return [fakeBox('docs-27', true)];
      return [];
    },
  },
  docsToggle: true,
};
vm.createContext(ctx);
const script = new vm.Script(src + '\n;globalThis.__T = { searchConfig, MultiSiteSearch };', {
  importModuleDynamically: async (spec) => { throw new Error('404 ' + spec); },
});
script.runInContext(ctx);
const { searchConfig, MultiSiteSearch } = ctx.__T;

const eq = (a, b, msg) => { if (a !== b) { console.error(`FAIL ${msg}: got ${a}, want ${b}`); process.exit(1); } };
const idx = searchConfig.indexes;

eq(idx['docs-26'], undefined, 'docs-26 is retired');
eq(idx['docs-hub']?.url, 'https://www.truenas.com/docs/pagefind/', 'hub index url');
eq(idx['docs-hub']?.group, 'hub', 'hub is outside the version group');
eq(idx['docs-28']?.url, 'https://www.truenas.com/docs/nightly/pagefind/', 'nightly index url');
eq(idx['docs-28']?.version, '28 Nightly', 'nightly label');
eq(idx['docs-27']?.url, 'https://www.truenas.com/docs/scale/27/pagefind/', '27 snapshot url');
eq(idx['docs-25.10']?.url, 'https://www.truenas.com/docs/scale/25.10/pagefind/', '25.10 unchanged');
eq(idx.security?.url, undefined, 'security index not registered (disabled on master)');

const s = Object.create(MultiSiteSearch.prototype);
s.loadedIndexes = new Map();
eq(await s.loadIndex('docs-hub'), null, 'a missing index loads as null, not an exception');

ctx.docsToggle = true;
s.updateActiveSites();
eq(s.activeSites.includes('docs-hub'), true, 'hub is searched when Docs is on');
eq(s.activeSites.includes('docs-27'), true, 'selected version is still searched');
ctx.docsToggle = false;
s.updateActiveSites();
eq(s.activeSites.includes('docs-hub'), false, 'hub is not searched when Docs is off');
console.log('ok');
