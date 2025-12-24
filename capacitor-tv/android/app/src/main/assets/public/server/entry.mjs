import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_DK_ie1RA.mjs';
import { manifest } from './manifest_Cpf05pMk.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/404.astro.mjs');
const _page2 = () => import('./pages/anime.astro.mjs');
const _page3 = () => import('./pages/chinh-sach-bao-mat.astro.mjs');
const _page4 = () => import('./pages/chu-de/_slug_.astro.mjs');
const _page5 = () => import('./pages/chu-de.astro.mjs');
const _page6 = () => import('./pages/dang-ky.astro.mjs');
const _page7 = () => import('./pages/dang-nhap.astro.mjs');
const _page8 = () => import('./pages/dieu-khoan-su-dung.astro.mjs');
const _page9 = () => import('./pages/doi-qua.astro.mjs');
const _page10 = () => import('./pages/forgot-password.astro.mjs');
const _page11 = () => import('./pages/gioi-thieu.astro.mjs');
const _page12 = () => import('./pages/hoi-dap.astro.mjs');
const _page13 = () => import('./pages/lich-chieu.astro.mjs');
const _page14 = () => import('./pages/loai-phim/_slug_.astro.mjs');
const _page15 = () => import('./pages/memory-card-game.astro.mjs');
const _page16 = () => import('./pages/mini-game.astro.mjs');
const _page17 = () => import('./pages/mua-dau.astro.mjs');
const _page18 = () => import('./pages/mua-premium.astro.mjs');
const _page19 = () => import('./pages/phim/_slug_.astro.mjs');
const _page20 = () => import('./pages/reset-password.astro.mjs');
const _page21 = () => import('./pages/rss.xml.astro.mjs');
const _page22 = () => import('./pages/tai-khoan/lich-su.astro.mjs');
const _page23 = () => import('./pages/tai-khoan/yeu-thich.astro.mjs');
const _page24 = () => import('./pages/tai-khoan.astro.mjs');
const _page25 = () => import('./pages/tai-ung-dung.astro.mjs');
const _page26 = () => import('./pages/the-loai/_slug_.astro.mjs');
const _page27 = () => import('./pages/tim-kiem.astro.mjs');
const _page28 = () => import('./pages/tuyen-bo-mien-tru.astro.mjs');
const _page29 = () => import('./pages/tv.astro.mjs');
const _page30 = () => import('./pages/xem-phim/_slug_/_tap_slug_/_ngon_ngu_.astro.mjs');
const _page31 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/node.js", _page0],
    ["src/pages/404.astro", _page1],
    ["src/pages/anime.astro", _page2],
    ["src/pages/chinh-sach-bao-mat.astro", _page3],
    ["src/pages/chu-de/[slug].astro", _page4],
    ["src/pages/chu-de/index.astro", _page5],
    ["src/pages/dang-ky.astro", _page6],
    ["src/pages/dang-nhap.astro", _page7],
    ["src/pages/dieu-khoan-su-dung.astro", _page8],
    ["src/pages/doi-qua.astro", _page9],
    ["src/pages/forgot-password.astro", _page10],
    ["src/pages/gioi-thieu.astro", _page11],
    ["src/pages/hoi-dap.astro", _page12],
    ["src/pages/lich-chieu.astro", _page13],
    ["src/pages/loai-phim/[slug].astro", _page14],
    ["src/pages/memory-card-game.astro", _page15],
    ["src/pages/mini-game.astro", _page16],
    ["src/pages/mua-dau.astro", _page17],
    ["src/pages/mua-premium.astro", _page18],
    ["src/pages/phim/[slug].astro", _page19],
    ["src/pages/reset-password.astro", _page20],
    ["src/pages/rss.xml.js", _page21],
    ["src/pages/tai-khoan/lich-su.astro", _page22],
    ["src/pages/tai-khoan/yeu-thich.astro", _page23],
    ["src/pages/tai-khoan/index.astro", _page24],
    ["src/pages/tai-ung-dung.astro", _page25],
    ["src/pages/the-loai/[slug].astro", _page26],
    ["src/pages/tim-kiem/index.astro", _page27],
    ["src/pages/tuyen-bo-mien-tru.astro", _page28],
    ["src/pages/tv.astro", _page29],
    ["src/pages/xem-phim/[slug]/[tap_slug]/[ngon_ngu].astro", _page30],
    ["src/pages/index.astro", _page31]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./noop-entrypoint.mjs'),
    middleware: () => import('./_astro-internal_middleware.mjs')
});
const _args = {
    "mode": "standalone",
    "client": "file:///E:/tramphim/tramphim-frontend/dist/client/",
    "server": "file:///E:/tramphim/tramphim-frontend/dist/server/",
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
