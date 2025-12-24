import { e as createComponent, m as maybeRenderHead, o as renderScript, r as renderTemplate, f as createAstro, h as addAttribute, l as renderComponent, k as renderHead, p as renderSlot } from './astro/server_Boq9MD4A.mjs';
import 'piccolore';
/* empty css                         */
import 'clsx';
import { jsxs, Fragment, jsx } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
/* empty css                          */

const $$MobileNav = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div id="mobile-nav" class="fixed bottom-4 right-2 flex-col gap-2 z-50 md:hidden hidden transition-opacity duration-300"> <button onclick="window.scrollTo({ top: 0, behavior: 'smooth' })" class="w-10 h-10 rounded-lg bg-white text-black flex items-center justify-center shadow-md" aria-label="Cuộn lên đầu trang"> <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" class="h-5 w-5"> <path fill="currentColor" d="M15 20H9v-8H4.16L12 4.16L19.84 12H15z"></path> </svg> </button> <a href="/" class="w-10 h-10 rounded-lg bg-white text-black flex items-center justify-center shadow-md" aria-label="Trang chủ"> <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" class="h-5 w-5"> <path fill="currentColor" d="M12.581 2.686a1 1 0 0 0-1.162 0l-9.5 6.786l1.162 1.627L12 4.73l8.919 6.37l1.162-1.627zm7 10l-7-5a1 1 0 0 0-1.162 0l-7 5a1 1 0 0 0-.42.814V20a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-6.5a1 1 0 0 0-.418-.814"></path> </svg> </a> ${renderScript($$result, "E:/tramphim/tramphim-frontend/src/components/MobileNav.astro?astro&type=script&index=0&lang.ts")} </div>`;
}, "E:/tramphim/tramphim-frontend/src/components/MobileNav.astro", void 0);

const ToastProvider = ({ children }) => {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    children,
    /* @__PURE__ */ jsx(
      ToastContainer,
      {
        position: "bottom-right",
        autoClose: 1500,
        theme: "dark"
      }
    )
  ] });
};

const bannerImageLeft = new Proxy({"src":"/_astro/ad.FoxwInQE.png","width":1365,"height":169,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "E:/tramphim/tramphim-frontend/src/assets/ad.png";
							}
							
							return target[name];
						}
					});

const $$Astro = createAstro();
const $$BottomBanner = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$BottomBanner;
  const { linkUrlLeft } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div id="floating-ad-wrapper" class="fixed bottom-0 left-0 right-0 z-[9999] flex justify-center pointer-events-none"> <div class="relative w-full flex justify-center px-4 sm:px-8 2xl:px-0"> <div id="bottom-banner-container" class="w-full max-w-screen-xl flex justify-center items-center pointer-events-auto"> <div class="relative group w-full lg:w-auto"> <a${addAttribute(linkUrlLeft, "href")} class="block relative"> <img${addAttribute(bannerImageLeft.src, "src")}${addAttribute(bannerImageLeft.width, "width")}${addAttribute(bannerImageLeft.height, "height")} alt="Quảng cáo YouTube Premium" class="block w-full h-auto max-h-[70px] object-cover rounded-t-lg cursor-pointer hover:opacity-90 transition-opacity"> </a> <button class="close-banner-btn absolute top-2 right-2 z-10 px-1 py-1 bg-black/70 text-white rounded text-xs hover:scale-105 transition-all duration-300" aria-label="Đóng quảng cáo"> <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z"></path></svg> </button> </div> </div> </div> </div> ${renderScript($$result, "E:/tramphim/tramphim-frontend/src/components/Banner/BottomBanner.astro?astro&type=script&index=0&lang.ts")}`;
}, "E:/tramphim/tramphim-frontend/src/components/Banner/BottomBanner.astro", void 0);

const __vite_import_meta_env__ = {"ASSETS_PREFIX": undefined, "BASE_URL": "/", "DEV": false, "MODE": "production", "PROD": true, "PUBLIC_API_BASE_URL": "https://api.tramphim.com", "PUBLIC_DOMAIN": "https://tramphim.com", "PUBLIC_MINIGAME_API_URL": "http://localhost:8000", "PUBLIC_MINIGAME_URL": "http://localhost:3000", "PUBLIC_SITE_URL": "https://tramphim.com", "SITE": undefined, "SSR": true};
const API_BASE_URL = typeof import.meta !== "undefined" && Object.assign(__vite_import_meta_env__, { PUBLIC: process.env.PUBLIC })?.PUBLIC_API_BASE_URL ? Object.assign(__vite_import_meta_env__, { PUBLIC: process.env.PUBLIC }).PUBLIC_API_BASE_URL : "https://api.tramphim.com";
function UpdateChecker() {
  const [updateInfo, setUpdateInfo] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isNativeApp, setIsNativeApp] = useState(false);
  const [isAndroidTV, setIsAndroidTV] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  useEffect(() => {
    initUpdateChecker();
  }, []);
  const initUpdateChecker = async () => {
    try {
      const { Capacitor } = await import('@capacitor/core');
      if (!Capacitor.isNativePlatform()) {
        return;
      }
      setIsNativeApp(true);
      const { App } = await import('@capacitor/app');
      const appInfo = await App.getInfo();
      const currentVersionCode = parseInt(appInfo.build, 10);
      if (!currentVersionCode || isNaN(currentVersionCode)) {
        return;
      }
      const isTV = detectAndroidTV();
      setIsAndroidTV(isTV);
      const platform = isTV ? "android_tv" : "android_mobile";
      const response = await fetch(
        `${API_BASE_URL}/api/app-version/check/${platform}/${currentVersionCode}`
      );
      if (!response.ok) {
        return;
      }
      const data = await response.json();
      if (data.has_update || data.force_update) {
        setUpdateInfo(data);
        setShowModal(true);
      }
    } catch (error) {
    }
  };
  const detectAndroidTV = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isLargeScreen = window.screen.width >= 1280;
    const hasNoTouch = !("ontouchstart" in window) && navigator.maxTouchPoints === 0;
    const tvIndicators = ["android tv", "aftb", "aftt", "afts", "shield"];
    const hasTVIndicator = tvIndicators.some(
      (indicator) => userAgent.includes(indicator)
    );
    return hasTVIndicator || isLargeScreen && hasNoTouch;
  };
  const handleUpdate = () => {
    if (updateInfo?.latest_version?.download_url) {
      window.open(updateInfo.latest_version.download_url, "_system");
    }
  };
  const handleDismiss = () => {
    if (!updateInfo?.force_update) {
      setShowModal(false);
      setDismissed(true);
      try {
        localStorage.setItem(
          `update_dismissed_${updateInfo?.latest_version?.version_code}`,
          Date.now().toString()
        );
      } catch (e) {
      }
    }
  };
  if (!isNativeApp || !showModal || dismissed) {
    return null;
  }
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4", children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-md overflow-hidden rounded-2xl bg-[#1e2030] shadow-2xl", children: [
    /* @__PURE__ */ jsx("div", { className: "bg-gradient-to-r from-sky-500 to-blue-600 px-6 py-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsx("div", { className: "flex h-12 w-12 items-center justify-center rounded-full bg-white/20", children: /* @__PURE__ */ jsx(
        "svg",
        {
          xmlns: "http://www.w3.org/2000/svg",
          className: "h-6 w-6 text-white",
          fill: "none",
          viewBox: "0 0 24 24",
          stroke: "currentColor",
          children: /* @__PURE__ */ jsx(
            "path",
            {
              strokeLinecap: "round",
              strokeLinejoin: "round",
              strokeWidth: 2,
              d: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            }
          )
        }
      ) }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-white", children: updateInfo?.force_update ? "Cập Nhật Bắt Buộc" : "Cập Nhật Mới" }),
        /* @__PURE__ */ jsxs("p", { className: "text-sm text-white/80", children: [
          "Phiên bản ",
          updateInfo?.latest_version?.version_name
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
      /* @__PURE__ */ jsx("p", { className: "mb-4 text-gray-300", children: updateInfo?.message }),
      updateInfo?.latest_version?.release_notes && /* @__PURE__ */ jsxs("div", { className: "mb-4 max-h-40 overflow-y-auto rounded-lg bg-[#161824] p-4", children: [
        /* @__PURE__ */ jsx("h3", { className: "mb-2 text-sm font-semibold text-sky-400", children: "Có gì mới:" }),
        /* @__PURE__ */ jsx("p", { className: "whitespace-pre-line text-sm text-gray-400", children: updateInfo.latest_version.release_notes })
      ] }),
      updateInfo?.latest_version?.file_size && /* @__PURE__ */ jsxs("p", { className: "mb-4 text-sm text-gray-500", children: [
        "📦 Kích thước: ",
        updateInfo.latest_version.file_size
      ] }),
      updateInfo?.force_update && /* @__PURE__ */ jsx("div", { className: "mb-4 rounded-lg bg-red-500/20 p-3", children: /* @__PURE__ */ jsx("p", { className: "text-sm text-red-400", children: "⚠️ Phiên bản hiện tại không còn được hỗ trợ. Vui lòng cập nhật để tiếp tục sử dụng ứng dụng." }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
        !updateInfo?.force_update && /* @__PURE__ */ jsx(
          "button",
          {
            onClick: handleDismiss,
            className: "flex-1 rounded-lg border border-gray-600 px-4 py-3 text-gray-400 transition hover:bg-gray-700",
            children: "Để sau"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: handleUpdate,
            className: `flex-1 rounded-lg bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-3 font-semibold text-white transition hover:from-sky-600 hover:to-blue-700 ${updateInfo?.force_update ? "w-full" : ""}`,
            children: "Cập nhật ngay"
          }
        )
      ] })
    ] })
  ] }) });
}

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate(_a || (_a = __template(['<html lang="vi"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="#191B24"><link rel="icon" href="/favicon.ico"><link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet"><script async defer crossorigin="anonymous" src="https://connect.facebook.net/vi_VN/sdk.js#xfbml=1&version=v21.0"></script><link rel="alternate" type="application/rss+xml" title="Phim Vietsub HD RSS" href="/rss.xml"><!-- Preload slot for critical images like hero -->', '<!-- Google tag (gtag.js) --><script async src="https://www.googletagmanager.com/gtag/js?id=G-31EXX7C9KY"></script>', "", "", '</head> <body class="page-body"> ', " ", " ", " ", ' <div id="fb-root"></div> <!-- TV adaptive runtime detection: if running on Android TV / Capacitor TV, redirect to the TV entry route --> ', " </body> </html>"])), renderSlot($$result, $$slots["preload"]), renderScript($$result, "E:/tramphim/tramphim-frontend/src/layouts/Layout.astro?astro&type=script&index=0&lang.ts"), renderSlot($$result, $$slots["head"]), renderHead(), renderComponent($$result, "UpdateChecker", UpdateChecker, { "client:load": true, "client:component-hydration": "load", "client:component-path": "E:/tramphim/tramphim-frontend/src/components/UpdateChecker", "client:component-export": "default" }), renderComponent($$result, "ToastProvider", ToastProvider, { "client:load": true, "client:component-hydration": "load", "client:component-path": "E:/tramphim/tramphim-frontend/src/components/Toast/ToastProvider", "client:component-export": "default" }, { "default": ($$result2) => renderTemplate` ${renderSlot($$result2, $$slots["default"])} ` }), renderComponent($$result, "MobileNav", $$MobileNav, {}), renderComponent($$result, "BottomBanner", $$BottomBanner, { "linkUrlLeft": "/mua-premium" }), renderScript($$result, "E:/tramphim/tramphim-frontend/src/layouts/Layout.astro?astro&type=script&index=1&lang.ts"));
}, "E:/tramphim/tramphim-frontend/src/layouts/Layout.astro", void 0);

export { $$Layout as $ };
