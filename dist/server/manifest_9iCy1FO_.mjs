import 'kleur/colors';
import { q as decodeKey } from './chunks/astro/server_BuMcwEkM.mjs';
import 'clsx';
import 'cookie';
import './chunks/astro-designed-error-pages_CQ5vVits.mjs';
import 'es-module-lexer';
import { N as NOOP_MIDDLEWARE_FN } from './chunks/noop-middleware_UXpAvydn.mjs';

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///home/vohaidang/Desktop/tramphim-v2/ui/","cacheDir":"file:///home/vohaidang/Desktop/tramphim-v2/ui/node_modules/.astro/","outDir":"file:///home/vohaidang/Desktop/tramphim-v2/ui/dist/","srcDir":"file:///home/vohaidang/Desktop/tramphim-v2/ui/src/","publicDir":"file:///home/vohaidang/Desktop/tramphim-v2/ui/public/","buildClientDir":"file:///home/vohaidang/Desktop/tramphim-v2/ui/dist/client/","buildServerDir":"file:///home/vohaidang/Desktop/tramphim-v2/ui/dist/server/","adapterName":"@astrojs/node","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/?$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image\\/?$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/node.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/_slug_.CedhCcWw.css"}],"routeData":{"route":"/404","isIndex":false,"type":"page","pattern":"^\\/404\\/?$","segments":[[{"content":"404","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/404.astro","pathname":"/404","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/_slug_.CedhCcWw.css"},{"type":"external","src":"/_astro/_slug_.g4TgYnFl.css"},{"type":"external","src":"/_astro/_slug_.GNLSjkBZ.css"}],"routeData":{"route":"/chu-de/[slug]","isIndex":false,"type":"page","pattern":"^\\/chu-de\\/([^/]+?)\\/?$","segments":[[{"content":"chu-de","dynamic":false,"spread":false}],[{"content":"slug","dynamic":true,"spread":false}]],"params":["slug"],"component":"src/pages/chu-de/[slug].astro","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/_slug_.CedhCcWw.css"},{"type":"external","src":"/_astro/_slug_.g4TgYnFl.css"},{"type":"external","src":"/_astro/_slug_.GNLSjkBZ.css"}],"routeData":{"route":"/chu-de","isIndex":true,"type":"page","pattern":"^\\/chu-de\\/?$","segments":[[{"content":"chu-de","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/chu-de/index.astro","pathname":"/chu-de","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/_slug_.CedhCcWw.css"},{"type":"external","src":"/_astro/_slug_.g4TgYnFl.css"},{"type":"external","src":"/_astro/_slug_.GNLSjkBZ.css"}],"routeData":{"route":"/lich-chieu","isIndex":false,"type":"page","pattern":"^\\/lich-chieu\\/?$","segments":[[{"content":"lich-chieu","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/lich-chieu.astro","pathname":"/lich-chieu","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/_slug_.CedhCcWw.css"},{"type":"external","src":"/_astro/_slug_.g4TgYnFl.css"},{"type":"external","src":"/_astro/_slug_.GNLSjkBZ.css"}],"routeData":{"route":"/loai-phim/[slug]","isIndex":false,"type":"page","pattern":"^\\/loai-phim\\/([^/]+?)\\/?$","segments":[[{"content":"loai-phim","dynamic":false,"spread":false}],[{"content":"slug","dynamic":true,"spread":false}]],"params":["slug"],"component":"src/pages/loai-phim/[slug].astro","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/_slug_.CedhCcWw.css"},{"type":"external","src":"/_astro/_slug_.g4TgYnFl.css"},{"type":"external","src":"/_astro/_slug_.GNLSjkBZ.css"}],"routeData":{"route":"/phim/[slug]","isIndex":false,"type":"page","pattern":"^\\/phim\\/([^/]+?)\\/?$","segments":[[{"content":"phim","dynamic":false,"spread":false}],[{"content":"slug","dynamic":true,"spread":false}]],"params":["slug"],"component":"src/pages/phim/[slug].astro","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/rss.xml","isIndex":false,"type":"endpoint","pattern":"^\\/rss\\.xml\\/?$","segments":[[{"content":"rss.xml","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/rss.xml.js","pathname":"/rss.xml","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/_slug_.CedhCcWw.css"},{"type":"external","src":"/_astro/_slug_.g4TgYnFl.css"},{"type":"external","src":"/_astro/_slug_.GNLSjkBZ.css"}],"routeData":{"route":"/the-loai/[slug]","isIndex":false,"type":"page","pattern":"^\\/the-loai\\/([^/]+?)\\/?$","segments":[[{"content":"the-loai","dynamic":false,"spread":false}],[{"content":"slug","dynamic":true,"spread":false}]],"params":["slug"],"component":"src/pages/the-loai/[slug].astro","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/_slug_.CedhCcWw.css"},{"type":"external","src":"/_astro/_slug_.g4TgYnFl.css"},{"type":"external","src":"/_astro/_slug_.GNLSjkBZ.css"}],"routeData":{"route":"/tim-kiem","isIndex":true,"type":"page","pattern":"^\\/tim-kiem\\/?$","segments":[[{"content":"tim-kiem","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/tim-kiem/index.astro","pathname":"/tim-kiem","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/_slug_.CedhCcWw.css"},{"type":"external","src":"/_astro/_slug_.g4TgYnFl.css"},{"type":"external","src":"/_astro/_slug_.GNLSjkBZ.css"}],"routeData":{"route":"/xem-phim/[slug]/[tap_slug]/[ngon_ngu]","isIndex":false,"type":"page","pattern":"^\\/xem-phim\\/([^/]+?)\\/([^/]+?)\\/([^/]+?)\\/?$","segments":[[{"content":"xem-phim","dynamic":false,"spread":false}],[{"content":"slug","dynamic":true,"spread":false}],[{"content":"tap_slug","dynamic":true,"spread":false}],[{"content":"ngon_ngu","dynamic":true,"spread":false}]],"params":["slug","tap_slug","ngon_ngu"],"component":"src/pages/xem-phim/[slug]/[tap_slug]/[ngon_ngu].astro","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/_slug_.CedhCcWw.css"},{"type":"external","src":"/_astro/_slug_.g4TgYnFl.css"},{"type":"external","src":"/_astro/index.BcVQFBZl.css"},{"type":"external","src":"/_astro/_slug_.GNLSjkBZ.css"}],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}],"base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["/home/vohaidang/Desktop/tramphim-v2/ui/src/pages/404.astro",{"propagation":"none","containsHead":true}],["/home/vohaidang/Desktop/tramphim-v2/ui/src/pages/chu-de/[slug].astro",{"propagation":"none","containsHead":true}],["/home/vohaidang/Desktop/tramphim-v2/ui/src/pages/chu-de/index.astro",{"propagation":"none","containsHead":true}],["/home/vohaidang/Desktop/tramphim-v2/ui/src/pages/index.astro",{"propagation":"none","containsHead":true}],["/home/vohaidang/Desktop/tramphim-v2/ui/src/pages/lich-chieu.astro",{"propagation":"none","containsHead":true}],["/home/vohaidang/Desktop/tramphim-v2/ui/src/pages/loai-phim/[slug].astro",{"propagation":"none","containsHead":true}],["/home/vohaidang/Desktop/tramphim-v2/ui/src/pages/phim/[slug].astro",{"propagation":"none","containsHead":true}],["/home/vohaidang/Desktop/tramphim-v2/ui/src/pages/the-loai/[slug].astro",{"propagation":"none","containsHead":true}],["/home/vohaidang/Desktop/tramphim-v2/ui/src/pages/tim-kiem/index.astro",{"propagation":"none","containsHead":true}],["/home/vohaidang/Desktop/tramphim-v2/ui/src/pages/xem-phim/[slug]/[tap_slug]/[ngon_ngu].astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000astro-internal:middleware":"_astro-internal_middleware.mjs","\u0000noop-actions":"_noop-actions.mjs","\u0000@astro-page:src/pages/404@_@astro":"pages/404.astro.mjs","\u0000@astro-page:src/pages/chu-de/[slug]@_@astro":"pages/chu-de/_slug_.astro.mjs","\u0000@astro-page:src/pages/chu-de/index@_@astro":"pages/chu-de.astro.mjs","\u0000@astro-page:src/pages/lich-chieu@_@astro":"pages/lich-chieu.astro.mjs","\u0000@astro-page:src/pages/loai-phim/[slug]@_@astro":"pages/loai-phim/_slug_.astro.mjs","\u0000@astro-page:src/pages/phim/[slug]@_@astro":"pages/phim/_slug_.astro.mjs","\u0000@astro-page:src/pages/rss.xml@_@js":"pages/rss.xml.astro.mjs","\u0000@astro-page:src/pages/the-loai/[slug]@_@astro":"pages/the-loai/_slug_.astro.mjs","\u0000@astro-page:src/pages/tim-kiem/index@_@astro":"pages/tim-kiem.astro.mjs","\u0000@astro-page:src/pages/xem-phim/[slug]/[tap_slug]/[ngon_ngu]@_@astro":"pages/xem-phim/_slug_/_tap_slug_/_ngon_ngu_.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astro-page:node_modules/astro/dist/assets/endpoint/node@_@js":"pages/_image.astro.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000@astrojs-manifest":"manifest_9iCy1FO_.mjs","/home/vohaidang/Desktop/tramphim-v2/ui/node_modules/unstorage/drivers/fs-lite.mjs":"chunks/fs-lite_COtHaKzy.mjs","/home/vohaidang/Desktop/tramphim-v2/ui/node_modules/astro/dist/assets/services/sharp.js":"chunks/sharp_BE3F0fTT.mjs","/home/vohaidang/Desktop/tramphim-v2/ui/src/components/CategoryMovies/ChuDe":"_astro/ChuDe.qpI_Mxcp.js","/home/vohaidang/Desktop/tramphim-v2/ui/src/components/ToPics/AllToPics":"_astro/AllToPics.Ku5pVGzN.js","/home/vohaidang/Desktop/tramphim-v2/ui/src/components/CategoryMovies/LoaiPhim":"_astro/LoaiPhim.DwvQbgU9.js","/home/vohaidang/Desktop/tramphim-v2/ui/src/components/FacebookComments":"_astro/FacebookComments.QJUwKj0t.js","/home/vohaidang/Desktop/tramphim-v2/ui/src/components/TopMovies/TopMovies":"_astro/TopMovies.B2hT5izU.js","/home/vohaidang/Desktop/tramphim-v2/ui/src/components/CategoryMovies/TheLoai":"_astro/TheLoai.Cd59SXhq.js","/home/vohaidang/Desktop/tramphim-v2/ui/src/components/SearchMovies/SearchMovies":"_astro/SearchMovies.Dm7PsFnq.js","/home/vohaidang/Desktop/tramphim-v2/ui/src/components/ServerButton/ServerButtons":"_astro/ServerButtons.CjV0bHYQ.js","/home/vohaidang/Desktop/tramphim-v2/ui/src/components/MovieDetail/MovieDetailPlayer":"_astro/MovieDetailPlayer.C-rv1OG1.js","/home/vohaidang/Desktop/tramphim-v2/ui/src/components/Recommended_Movies/RecommendedMovies":"_astro/RecommendedMovies.CeE_rtx6.js","/home/vohaidang/Desktop/tramphim-v2/ui/src/components/ToPics/ToPics.jsx":"_astro/ToPics.DmWaw7Hk.js","/home/vohaidang/Desktop/tramphim-v2/ui/src/components/MovieCardHome/CardColumnTop.jsx":"_astro/CardColumnTop.C8d78I7Q.js","/home/vohaidang/Desktop/tramphim-v2/ui/src/components/MovieCardHome/CardColumn.jsx":"_astro/CardColumn.Dj2gQI09.js","/home/vohaidang/Desktop/tramphim-v2/ui/src/components/Toast/ToastProvider":"_astro/ToastProvider.CMXvHvD5.js","/home/vohaidang/Desktop/tramphim-v2/ui/src/pages/index.astro?astro&type=script&index=0&lang.ts":"_astro/index.astro_astro_type_script_index_0_lang._Nx6_Ix1.js","/home/vohaidang/Desktop/tramphim-v2/ui/src/components/MobileNav.astro?astro&type=script&index=0&lang.ts":"_astro/MobileNav.astro_astro_type_script_index_0_lang.CLPr8F4g.js","/home/vohaidang/Desktop/tramphim-v2/ui/src/components/MovieDetail/MovieDetailStaticInfo":"_astro/MovieDetailStaticInfo.DL1nM3Hi.js","/home/vohaidang/Desktop/tramphim-v2/ui/src/components/VideoPlayer/VideoPlayer":"_astro/VideoPlayer.CLDjRMfN.js","/home/vohaidang/Desktop/tramphim-v2/ui/src/components/Header/Header":"_astro/Header.D_kWJhJt.js","/home/vohaidang/Desktop/tramphim-v2/ui/src/components/MovieDetail/MovieTab":"_astro/MovieTab.mmRElTpb.js","/home/vohaidang/Desktop/tramphim-v2/ui/src/components/Hero/Hero":"_astro/Hero.ZYSnCXYt.js","@astrojs/react/client.js":"_astro/client.BBKXMyYs.js","/home/vohaidang/Desktop/tramphim-v2/ui/src/components/EposideList/EpisodeList":"_astro/EpisodeList.CRqabR6q.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[["/home/vohaidang/Desktop/tramphim-v2/ui/src/pages/index.astro?astro&type=script&index=0&lang.ts","document.addEventListener(\"DOMContentLoaded\",()=>{const s=document.querySelectorAll(\".fade-in-on-visible\"),t={root:null,rootMargin:\"0px\",threshold:.2},n=new IntersectionObserver((e,r)=>{e.forEach(o=>{o.isIntersecting&&(o.target.classList.add(\"is-visible\"),r.unobserve(o.target))})},t);s.forEach(e=>{n.observe(e)})});"],["/home/vohaidang/Desktop/tramphim-v2/ui/src/components/MobileNav.astro?astro&type=script&index=0&lang.ts","document.addEventListener(\"DOMContentLoaded\",function(){const n=document.getElementById(\"mobile-nav\");n&&window.addEventListener(\"scroll\",function(){const e=window.scrollY>100;n.classList.toggle(\"hidden\",!e),n.classList.toggle(\"flex\",e)})});"]],"assets":["/_astro/eposide.CaavVmCT.gif","/_astro/alarm.D274mdJn.gif","/_astro/logo.B8HBszRl.png","/_astro/qrtele.J0DJ4xmr.png","/_astro/_slug_.GNLSjkBZ.css","/_astro/_slug_.g4TgYnFl.css","/_astro/_slug_.CedhCcWw.css","/_astro/index.BcVQFBZl.css","/favicon.ico","/logo.png","/robots.txt","/sitemap-cartoons.xml","/sitemap-categories.xml","/sitemap-episodes.xml","/sitemap-movies.xml","/sitemap-series.xml","/sitemap.xml","/thumb_web.png","/_astro/AllToPics.Ku5pVGzN.js","/_astro/CardColumn.Dj2gQI09.js","/_astro/CardColumnTop.C8d78I7Q.js","/_astro/ChuDe.qpI_Mxcp.js","/_astro/EpisodeList.CRqabR6q.js","/_astro/FacebookComments.QJUwKj0t.js","/_astro/Header.D_kWJhJt.js","/_astro/Hero.ZYSnCXYt.js","/_astro/LoaiPhim.DwvQbgU9.js","/_astro/MovieDetailPlayer.C-rv1OG1.js","/_astro/MovieDetailStaticInfo.DL1nM3Hi.js","/_astro/MovieTab.mmRElTpb.js","/_astro/RecommendedMovies.CeE_rtx6.js","/_astro/SearchMovies.Dm7PsFnq.js","/_astro/ServerButtons.CjV0bHYQ.js","/_astro/TheLoai.Cd59SXhq.js","/_astro/ToPics.DmWaw7Hk.js","/_astro/ToastProvider.CMXvHvD5.js","/_astro/TopMovies.B2hT5izU.js","/_astro/VideoPlayer.CLDjRMfN.js","/_astro/alarm.DxcPw94X.js","/_astro/client.BBKXMyYs.js","/_astro/index.DtoOFyvK.js","/_astro/index.XlGkRt0C.js","/_astro/jsx-runtime.D_zvdyIk.js","/_astro/movieUtils.BPictt7M.js","/_astro/navigation.LXlx0XuN.js"],"buildFormat":"directory","checkOrigin":true,"serverIslandNameMap":[],"key":"frqY1eINx3o72Geph3MAY2wjrG5HZ3zhxRdoH6eLyt8=","sessionConfig":{"driver":"fs-lite","options":{"base":"/home/vohaidang/Desktop/tramphim-v2/ui/node_modules/.astro/sessions"}}});
if (manifest.sessionConfig) manifest.sessionConfig.driverModule = () => import('./chunks/fs-lite_COtHaKzy.mjs');

export { manifest };
