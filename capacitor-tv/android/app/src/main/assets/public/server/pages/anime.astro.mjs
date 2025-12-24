/* empty css                                 */
import { e as createComponent, l as renderComponent, r as renderTemplate, n as Fragment, m as maybeRenderHead } from '../chunks/astro/server_Boq9MD4A.mjs';
import 'piccolore';
import { $ as $$Layout } from '../chunks/Layout_D08VFffu.mjs';
import { H as Header } from '../chunks/Header_CYtzV8Xx.mjs';
import { C as CategoryMovies } from '../chunks/LoaiPhim_CQd2eemT.mjs';
import { F as Footer } from '../chunks/index_Ce3Y9ZIG.mjs';
import { $ as $$SeoLoaiPhim } from '../chunks/SeoLoaiPhim_Crq_ORyJ.mjs';
export { renderers } from '../renderers.mjs';

const prerender = false;
const $$Anime = createComponent(async ($$result, $$props, $$slots) => {
  const BASE_URL = "https://api.tramphim.com";
  const initialPage = 1;
  const limit = 30;
  const fetchJson = async (url) => {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Lỗi khi fetch API: ${url}`);
      return await res.json();
    } catch (err) {
      console.error(`Fetch error: ${url}`, err);
      return null;
    }
  };
  const animeData = await fetchJson(
    `${BASE_URL}/api/filter/?page=${initialPage}&limit=${limit}&loai_phim=hoat-hinh&quoc_gia=nhat-ban&sort=ngay-tao`
  );
  const topResponse = await fetchJson(
    `${BASE_URL}/api/filter/?page=1&limit=10&sort=luot-xem`
  );
  const topmovies = topResponse?.data || [];
  if (!animeData || !topmovies) {
    return new Response("Không thể lấy dữ liệu. Vui lòng thử lại sau.", {
      status: 500
    });
  }
  const currentCategoryName = "Anime";
  const slug = "anime";
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$Layout, {}, { "default": async ($$result2) => renderTemplate`  ${renderComponent($$result2, "Header", Header, { "client:load": true, "client:component-hydration": "load", "client:component-path": "E:/tramphim/tramphim-frontend/src/components/Header/Header", "client:component-export": "default" })} ${maybeRenderHead()}<main class="main-type-layout"> <div class="type-content-flex"> <section class="type-main-section"> ${renderComponent($$result2, "CategoryMovies", CategoryMovies, { "initialData": animeData, "initialSlug": slug, "baseUrl": BASE_URL, "initialLimit": limit, "tittle": currentCategoryName, "client:load": true, "client:component-hydration": "load", "client:component-path": "E:/tramphim/tramphim-frontend/src/components/CategoryMovies/LoaiPhim", "client:component-export": "default" })} </section> </div> </main> <footer> ${renderComponent($$result2, "Footer", Footer, {})} </footer> `, "head": async ($$result2) => renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "slot": "head" }, { "default": async ($$result3) => renderTemplate` ${renderComponent($$result3, "Seo", $$SeoLoaiPhim, { "slug": slug, "currentCategoryName": currentCategoryName })} ` })}` })}`;
}, "E:/tramphim/tramphim-frontend/src/pages/anime.astro", void 0);
const $$file = "E:/tramphim/tramphim-frontend/src/pages/anime.astro";
const $$url = "/anime";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Anime,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
