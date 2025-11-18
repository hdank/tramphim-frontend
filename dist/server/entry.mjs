import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_CzMx_1BT.mjs';
import { manifest } from './manifest_C-2BwrM0.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/404.astro.mjs');
const _page2 = () => import('./pages/chu-de/_slug_.astro.mjs');
const _page3 = () => import('./pages/chu-de.astro.mjs');
const _page4 = () => import('./pages/lich-chieu.astro.mjs');
const _page5 = () => import('./pages/loai-phim/_slug_.astro.mjs');
const _page6 = () => import('./pages/phim/_slug_.astro.mjs');
const _page7 = () => import('./pages/rss.xml.astro.mjs');
const _page8 = () => import('./pages/the-loai/_slug_.astro.mjs');
const _page9 = () => import('./pages/tim-kiem.astro.mjs');
const _page10 = () => import('./pages/xem-phim/_slug_/_tap_slug_/_ngon_ngu_.astro.mjs');
const _page11 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/node.js", _page0],
    ["src/pages/404.astro", _page1],
    ["src/pages/chu-de/[slug].astro", _page2],
    ["src/pages/chu-de/index.astro", _page3],
    ["src/pages/lich-chieu.astro", _page4],
    ["src/pages/loai-phim/[slug].astro", _page5],
    ["src/pages/phim/[slug].astro", _page6],
    ["src/pages/rss.xml.js", _page7],
    ["src/pages/the-loai/[slug].astro", _page8],
    ["src/pages/tim-kiem/index.astro", _page9],
    ["src/pages/xem-phim/[slug]/[tap_slug]/[ngon_ngu].astro", _page10],
    ["src/pages/index.astro", _page11]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./_noop-actions.mjs'),
    middleware: () => import('./_astro-internal_middleware.mjs')
});
const _args = {
    "mode": "standalone",
    "client": "file:///home/vohaidang/Desktop/tramphim-v2/ui/dist/client/",
    "server": "file:///home/vohaidang/Desktop/tramphim-v2/ui/dist/server/",
    "host": true,
    "port": 4555,
    "assets": "_astro",
    "experimentalStaticHeaders": false
};
const _exports = createExports(_manifest, _args);
const handler = _exports['handler'];
const startServer = _exports['startServer'];
const options = _exports['options'];
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) {
	serverEntrypointModule[_start](_manifest, _args);
}

export { handler, options, pageMap, startServer };
