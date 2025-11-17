/* empty css                                  */
import { e as createComponent, f as createAstro, r as renderTemplate, u as unescapeHTML, h as addAttribute, l as renderComponent, n as Fragment, m as maybeRenderHead } from '../chunks/astro/server_BuMcwEkM.mjs';
import 'kleur/colors';
import { $ as $$Layout, H as Header, F as Footer } from '../chunks/index_eDR0il5k.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import 'clsx';
export { renderers } from '../renderers.mjs';

function MovieCard({ movies = [], title, loading, error }) {
  if (loading) {
    return /* @__PURE__ */ jsxs(
      "section",
      {
        className: "relative h-auto px-4 pt-4",
        "aria-label": `${title.replace(/\s+/g, "-")}-heading`,
        children: [
          /* @__PURE__ */ jsx("div", { className: "mb-6 flex items-center justify-between", children: /* @__PURE__ */ jsx(
            "h2",
            {
              id: `${title.replace(/\s+/g, "-")}-heading`,
              className: "text-xl font-bold text-white lg:text-3xl",
              children: title
            }
          ) }),
          /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center p-12", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-4", children: [
            /* @__PURE__ */ jsx("div", { className: "h-12 w-12 animate-spin rounded-full border-4 border-sky-400 border-t-transparent" }),
            /* @__PURE__ */ jsx("p", { className: "font-medium text-gray-300", children: "Đang tải phim..." })
          ] }) })
        ]
      }
    );
  }
  if (error || !movies || movies.length === 0) {
    return /* @__PURE__ */ jsxs(
      "section",
      {
        className: "relative h-auto py-4",
        "aria-label": `${title.replace(/\s+/g, "-")}-heading`,
        children: [
          /* @__PURE__ */ jsxs("div", { className: "mb-8", children: [
            /* @__PURE__ */ jsxs("div", { className: "mb-2 flex items-center gap-3", children: [
              /* @__PURE__ */ jsx("div", { className: "h-1 w-8 rounded-full bg-gradient-to-r from-sky-400 to-cyan-300" }),
              /* @__PURE__ */ jsx(
                "h2",
                {
                  id: `${title.replace(/\s+/g, "-")}-heading`,
                  className: "bg-gradient-to-r from-white via-sky-100 to-cyan-100 bg-clip-text text-lg font-bold text-transparent lg:text-2xl",
                  children: title
                }
              )
            ] }),
            /* @__PURE__ */ jsx("div", { className: "h-px bg-gradient-to-r from-sky-500/50 via-cyan-500/30 to-transparent" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-gray-700/50 bg-gradient-to-br from-gray-900/50 to-gray-800/50 p-8 text-center backdrop-blur-sm", children: [
            /* @__PURE__ */ jsx("div", { className: "mb-6 rounded-full bg-gradient-to-br from-red-500/20 to-orange-500/20 p-6", children: /* @__PURE__ */ jsx(
              "svg",
              {
                xmlns: "http://www.w3.org/2000/svg",
                className: "h-16 w-16 text-orange-400",
                fill: "none",
                viewBox: "0 0 24 24",
                stroke: "currentColor",
                children: /* @__PURE__ */ jsx(
                  "path",
                  {
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeWidth: 1.5,
                    d: "M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z"
                  }
                )
              }
            ) }),
            /* @__PURE__ */ jsx("h3", { className: "mb-3 text-xl font-bold text-white", children: "Không tìm thấy phim nào" }),
            /* @__PURE__ */ jsx("p", { className: "max-w-md leading-relaxed text-gray-400", children: "Lịch Chiếu Chưa Cập Nhật" })
          ] })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxs(
    "section",
    {
      className: "relative h-auto py-4",
      "aria-label": `${title.replace(/\s+/g, "-")}-heading`,
      children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-8", children: [
          /* @__PURE__ */ jsxs("div", { className: "mb-2 flex items-center gap-3", children: [
            /* @__PURE__ */ jsx("div", { className: "h-1 w-8 rounded-full bg-gradient-to-r from-sky-400 to-cyan-300" }),
            /* @__PURE__ */ jsx(
              "h2",
              {
                id: `${title.replace(/\s+/g, "-")}-heading`,
                className: "bg-gradient-to-r from-white via-sky-100 to-cyan-100 bg-clip-text text-lg font-bold text-transparent lg:text-2xl",
                children: title
              }
            )
          ] }),
          /* @__PURE__ */ jsx("div", { className: "h-px bg-gradient-to-r from-sky-500/50 via-cyan-500/30 to-transparent" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-4 md:grid-cols-2", children: movies.map((movie, index) => {
          const {
            id,
            slug,
            ten_phim,
            poster_url,
            tinh_trang,
            ten_khac,
            lich_chieu
          } = movie;
          const movieKey = id || slug || `movie-${index}`;
          lich_chieu && lich_chieu.length > 0 ? lich_chieu[0].gio_chieu : "";
          return /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs(
            "a",
            {
              href: `/phim/${slug}`,
              className: "flex items-center gap-4 rounded-[4px] bg-gray-800/70 p-4 transition-colors duration-200 hover:border-sky-500 hover:bg-gray-800",
              children: [
                /* @__PURE__ */ jsx("div", { className: "flex-shrink-0", children: /* @__PURE__ */ jsx("div", { className: "h-20 w-20 overflow-hidden rounded-full border border-gray-600", children: /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: poster_url,
                    alt: `Xem ${ten_phim || ten_khac} Vietsub Thuyết Minh Full HD`,
                    className: "h-full w-full object-cover",
                    loading: "lazy"
                  }
                ) }) }),
                /* @__PURE__ */ jsxs("div", { className: "flex min-w-0 flex-grow flex-col justify-center gap-2", children: [
                  /* @__PURE__ */ jsx(
                    "h3",
                    {
                      className: "line-clamp-2 text-base font-semibold leading-snug text-white hover:text-sky-300",
                      title: ten_phim,
                      children: ten_phim
                    }
                  ),
                  /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-1 text-sm", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-gray-400", children: "Tập mới nhất:" }),
                    /* @__PURE__ */ jsx("span", { className: "font-medium text-orange-400", children: tinh_trang || "Đang cập nhật" })
                  ] }) })
                ] })
              ]
            }
          ) }, movieKey);
        }) })
      ]
    }
  );
}

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const $$SeoLichChieu = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$SeoLichChieu;
  const origin = Astro2.url.origin;
  const canonicalUrl = Astro2.url.href;
  const siteName = "HH3D";
  const title = "L\u1ECBch Chi\u1EBFu Phim Ho\u1EA1t H\xECnh Trung Qu\u1ED1c 3D | HH3D";
  const description = "Danh s\xE1ch phim ho\u1EA1t h\xECnh 3D \u0111\u01B0\u1EE3c chi\u1EBFu m\u1ED7i ng\xE0y v\xE0o t\u1EA5t c\u1EA3 c\xE1c tu\u1EA7n, c\u1EADp nh\u1EADt l\u1ECBch chi\u1EBFu HH3D \u0111\u1EC3 kh\xF4ng b\u1ECF l\u1EE1 t\u1EADp n\xE0o.";
  const ogImage = `${origin}/logo.png`;
  const currentCategoryName = "L\u1ECBch Chi\u1EBFu";
  const fullSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${canonicalUrl}#webpage`,
        url: canonicalUrl,
        name: title,
        description,
        isPartOf: { "@id": `${origin}#website` },
        breadcrumb: { "@id": `${canonicalUrl}#breadcrumb` },
        inLanguage: "vi-VN"
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${canonicalUrl}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Trang ch\u1EE7", item: origin },
          { "@type": "ListItem", position: 2, name: currentCategoryName, item: canonicalUrl }
        ]
      },
      {
        "@type": "WebSite",
        "@id": `${origin}#website`,
        url: origin,
        name: siteName,
        description: `Xem Phim Vietsub Thuy\u1EBFt Minh HD t\u1EA1i ${siteName}`,
        inLanguage: "vi-VN",
        publisher: { "@id": `${origin}#organization` },
        potentialAction: {
          "@type": "SearchAction",
          target: `${origin}/tim-kiem?q={search_term_string}`,
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "Organization",
        "@id": `${origin}#organization`,
        name: siteName,
        url: origin,
        logo: {
          "@type": "ImageObject",
          url: `${origin}/logo.png`,
          contentUrl: `${origin}/logo.png`
        }
      }
    ]
  };
  return renderTemplate(_a || (_a = __template(["<title>", '</title><meta name="description"', '><meta name="robots" content="index, follow"><link rel="canonical"', '><meta property="og:type" content="website"><meta property="og:title"', '><meta property="og:description"', '><meta property="og:url"', '><meta property="og:site_name"', '><meta property="og:image"', '><meta property="og:locale" content="vi_VN"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title"', '><meta name="twitter:description"', '><meta name="twitter:image"', '><script type="application/ld+json">', "<\/script>"])), title, addAttribute(description, "content"), addAttribute(canonicalUrl, "href"), addAttribute(title, "content"), addAttribute(description, "content"), addAttribute(canonicalUrl, "content"), addAttribute(siteNTame, "content"), addAttribute(ogImage, "content"), addAttribute(title, "content"), addAttribute(description, "content"), addAttribute(ogImage, "content"), unescapeHTML(JSON.stringify(fullSchema)));
}, "/home/vohaidang/Desktop/tramphim-v2/ui/src/seometas/SeoLichChieu.astro", void 0);

const BASE_URL = "https://api.motchillx.site";
async function getLichChieuPageData() {
  const endpoints = [
    {
      key: "movies_thu2",
      url: `${BASE_URL}/api/phim/lich-chieu/2`
    },
    {
      key: "movies_thu3",
      url: `${BASE_URL}/api/phim/lich-chieu/3`
    },
    {
      key: "movies_thu4",
      url: `${BASE_URL}/api/phim/lich-chieu/4`
    },
    {
      key: "movies_thu5",
      url: `${BASE_URL}/api/phim/lich-chieu/5`
    },
    {
      key: "movies_thu6",
      url: `${BASE_URL}/api/phim/lich-chieu/6`
    },
    {
      key: "movies_thu7",
      url: `${BASE_URL}/api/phim/lich-chieu/7`
    },
    {
      key: "movies_cn",
      url: `${BASE_URL}/api/phim/lich-chieu/8`
    }
  ];
  try {
    const results = await Promise.all(
      endpoints.map(
        ({ url }) => fetch(url).then((res) => res.json()).catch(() => [])
      )
    );
    return results.reduce((acc, res, i) => {
      const key = endpoints[i].key;
      acc[key] = res;
      return acc;
    }, {});
  } catch (err) {
    console.error("Error fetching showtime data:", err);
    return Object.fromEntries(endpoints.map((e) => [e.key, []]));
  }
}

const prerender = false;
const revalidate = 1800;
const $$LichChieu = createComponent(async ($$result, $$props, $$slots) => {
  const data = await getLichChieuPageData();
  const {
    movies_thu2,
    movies_thu3,
    movies_thu4,
    movies_thu5,
    movies_thu6,
    movies_thu7,
    movies_cn
  } = data;
  const loading = false;
  const error = null;
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$Layout, {}, { "default": async ($$result2) => renderTemplate`  ${renderComponent($$result2, "Header", Header, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/home/vohaidang/Desktop/tramphim-v2/ui/src/components/Header/Header", "client:component-export": "default" })} ${maybeRenderHead()}<div class="lich-chieu-main-container"> <div class="lich-chieu-content-wrapper"> <main id="main-content "> <div class="lich-chieu-card-gap"> <section> ${renderComponent($$result2, "MovieLichChieu", MovieCard, { "movies": movies_thu2, "title": "Th\u1EE9 Hai", "loading": loading, "error": error })} ${renderComponent($$result2, "MovieLichChieu", MovieCard, { "movies": movies_thu3, "title": "Th\u1EE9 Ba", "loading": loading, "error": error })} ${renderComponent($$result2, "MovieLichChieu", MovieCard, { "movies": movies_thu4, "title": "Th\u1EE9 T\u01B0", "loading": loading, "error": error })} ${renderComponent($$result2, "MovieLichChieu", MovieCard, { "movies": movies_thu5, "title": "Th\u1EE9 N\u0103m", "loading": loading, "error": error })} ${renderComponent($$result2, "MovieLichChieu", MovieCard, { "movies": movies_thu6, "title": "Th\u1EE9 S\xE1u", "loading": loading, "error": error })} ${renderComponent($$result2, "MovieLichChieu", MovieCard, { "movies": movies_thu7, "title": "Th\u1EE9 B\u1EA3y", "loading": loading, "error": error })} ${renderComponent($$result2, "MovieLichChieu", MovieCard, { "movies": movies_cn, "title": "Ch\u1EE7 Nh\u1EADt", "loading": loading, "error": error })} </section> </div> </main> </div> </div> <footer> ${renderComponent($$result2, "Footer", Footer, {})} </footer> `, "head": async ($$result2) => renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "slot": "head" }, { "default": async ($$result3) => renderTemplate` ${renderComponent($$result3, "Seo", $$SeoLichChieu, {})} ` })}` })}`;
}, "/home/vohaidang/Desktop/tramphim-v2/ui/src/pages/lich-chieu.astro", void 0);

const $$file = "/home/vohaidang/Desktop/tramphim-v2/ui/src/pages/lich-chieu.astro";
const $$url = "/lich-chieu";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$LichChieu,
  file: $$file,
  prerender,
  revalidate,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
