/* empty css                                  */
import { e as createComponent, l as renderComponent, r as renderTemplate, n as Fragment, m as maybeRenderHead } from '../chunks/astro/server_BuMcwEkM.mjs';
import 'kleur/colors';
import { $ as $$Layout, H as Header, F as Footer } from '../chunks/index_BCmV18BO.mjs';
import { jsx, jsxs } from 'react/jsx-runtime';
export { renderers } from '../renderers.mjs';

const getHref = (slug) => `/chu-de/${slug}`;
const defaultColors = [
  "from-[#6654CC] to-[#8072E2]",
  "from-[#47526D] to-[#596688]",
  "from-[#44A38A] to-[#55C3A5]",
  "from-[#8C60C0] to-[#A277DA]",
  "from-[#9E6445] to-[#B67657]",
  "from-[#7F4E4E] to-[#996363]",
  "from-[#574E7F] to-[#736399]"
];
const AllToPics = ({ themesData }) => {
  if (!Array.isArray(themesData)) {
    themesData = [];
  }
  const fetchedThemes = themesData?.map((theme, index) => ({
    ...theme,
    color: defaultColors[index % defaultColors.length]
  })) || [];
  if (fetchedThemes.length === 0) {
    return /* @__PURE__ */ jsx("div", { className: "py-10 text-center", children: /* @__PURE__ */ jsx("div", { className: "inline-block px-6 py-3 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 shadow-md", children: /* @__PURE__ */ jsx("p", { className: "text-white text-lg font-semibold", children: "Không có chủ đề nào để hiển thị" }) }) });
  }
  return /* @__PURE__ */ jsxs("section", { className: "py-2 lg:px-0 px-2", children: [
    /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-2", children: [
        /* @__PURE__ */ jsx("div", { className: "h-1 w-8 rounded-full bg-gradient-to-r from-sky-400 to-cyan-300" }),
        /* @__PURE__ */ jsx("h2", { className: "bg-gradient-to-r from-white via-sky-100 to-cyan-100 bg-clip-text text-lg font-bold text-transparent lg:text-2xl", children: "Khám Phá Toàn Bộ Chủ Đề" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "h-px w-full bg-gradient-to-r from-sky-500/50 via-cyan-500/30 to-transparent" })
    ] }),
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "grid grid-cols-3 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 pb-6 pt-4 lg:gap-4",
        role: "navigation",
        "aria-label": "Các chủ đề phim",
        children: fetchedThemes.map(({ ten, slug, color }) => /* @__PURE__ */ jsxs(
          "a",
          {
            href: getHref(slug),
            className: `relative h-[70px] overflow-hidden rounded-lg bg-gradient-to-br p-2 lg:p-4 shadow-lg transition-transform duration-500 ease-in-out hover:-translate-y-1 sm:h-[100px] lg:h-[120px] ${color}`,
            children: [
              /* @__PURE__ */ jsxs("div", { className: "relative z-10 flex h-full flex-col gap-2 items-start justify-center lg:justify-end", children: [
                /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold md:text-lg text-white line-clamp-2", children: ten }),
                /* @__PURE__ */ jsx("div", { className: "hidden sm:flex flex-row items-center justify-center gap-2 text-center text-[10px] lg:text-sm font-normal text-white", children: /* @__PURE__ */ jsx("span", { children: "Xem chủ đề" }) })
              ] }),
              /* @__PURE__ */ jsx(
                "svg",
                {
                  className: "theme-svg",
                  xmlns: "http://www.w3.org/2000/svg",
                  preserveAspectRatio: "none",
                  viewBox: "0 0 1440 200",
                  children: Array.from({ length: 25 }, (_, i) => {
                    const y = 20 + i * 12;
                    const amp = 25;
                    return /* @__PURE__ */ jsx(
                      "path",
                      {
                        d: `
                                            M0,${y}
                                            C 360,${y - amp} 720,${y + amp} 1080,${y}
                                            C 1260,${y - amp} 1440,${y + amp} 1440,${y}
                                        `,
                        stroke: "#ccc",
                        fill: "none",
                        strokeWidth: "2",
                        opacity: "0.5"
                      },
                      i
                    );
                  })
                }
              )
            ]
          },
          slug
        ))
      }
    )
  ] });
};

async function fetchTopics() {
    const API_URL = 'http://127.0.0.1:8000/api/phim/chu-de/';
    try {
        const response = await fetch(API_URL);
        if (response.ok) {
            const apiData = await response.json();
            const topics = apiData.map(item => ({
                ten: item.ten,
                slug: item.slug
            }));

            return topics;

        } else {
            return [];
        }
    } catch (error) {
        return [];
    }
}

const prerender = false;
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const themesDataForReact = await fetchTopics();
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$Layout, {}, { "default": async ($$result2) => renderTemplate`  ${maybeRenderHead()}<div class="min-h-screen flex flex-col"> ${renderComponent($$result2, "Header", Header, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/home/vohaidang/Desktop/tramphim-v2/ui/src/components/Header/Header", "client:component-export": "default" })} <main class="flex-1 w-full max-w-screen-xl container mx-auto  py-2 lg:py-8"> <section class="w-full"> ${renderComponent($$result2, "AllToPics", AllToPics, { "themesData": themesDataForReact, "client:load": true, "client:component-hydration": "load", "client:component-path": "/home/vohaidang/Desktop/tramphim-v2/ui/src/components/ToPics/AllToPics", "client:component-export": "default" })} </section> </main> <footer> ${renderComponent($$result2, "Footer", Footer, {})} </footer> </div> `, "head": async ($$result2) => renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "slot": "head" })}` })}`;
}, "/home/vohaidang/Desktop/tramphim-v2/ui/src/pages/chu-de/index.astro", void 0);

const $$file = "/home/vohaidang/Desktop/tramphim-v2/ui/src/pages/chu-de/index.astro";
const $$url = "/chu-de";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Index,
    file: $$file,
    prerender,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
