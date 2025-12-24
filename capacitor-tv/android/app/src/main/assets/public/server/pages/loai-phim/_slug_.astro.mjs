/* empty css                                    */
import { e as createComponent, f as createAstro, l as renderComponent, r as renderTemplate, n as Fragment, m as maybeRenderHead } from '../../chunks/astro/server_Boq9MD4A.mjs';
import 'piccolore';
import { $ as $$Layout } from '../../chunks/Layout_D08VFffu.mjs';
import { H as Header } from '../../chunks/Header_CYtzV8Xx.mjs';
import { C as CategoryMovies } from '../../chunks/LoaiPhim_CQd2eemT.mjs';
import { F as Footer } from '../../chunks/index_Ce3Y9ZIG.mjs';
import { $ as $$SeoLoaiPhim } from '../../chunks/SeoLoaiPhim_Crq_ORyJ.mjs';
export { renderers } from '../../renderers.mjs';

const BASE_URL = "https://api.tramphim.com";
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
async function getCategoryData(slug, initialPage = 1, limit = 30) {
  let API_URL;
  let currentCategoryName;
  let metaKeywords;
  const keywordsMap = {
    "phim-le": "phim lẻ, phim lẻ mới, phim lẻ vietsub, xem phim lẻ, phim le online",
    "phim-bo": "phim bộ, phim bộ mới, phim bộ vietsub, xem phim bộ, phim bo online",
    "hoat-hinh": "phim hoạt hình, hoạt hình vietsub, phim anime, phim cartoon",
    "phim-chieu-rap": "phim chiếu rạp, phim rạp, phim ra rạp, phim hay"
  };
  if (slug === "phim-chieu-rap") {
    API_URL = `${BASE_URL}/api/filter/?page=${initialPage}&limit=${limit}&sort=ngay-tao&chieu_rap=true`;
  } else {
    API_URL = `${BASE_URL}/api/filter/?page=${initialPage}&limit=${limit}&loai_phim=${slug}&sort=ngay-tao`;
  }
  const categoryData = await fetchJson(API_URL);
  const topResponse = await fetchJson(
    `${BASE_URL}/api/filter/?page=1&limit=10&sort=luot-xem`
  );
  const topmovies = topResponse?.data || [];
  if (!categoryData || !topmovies) {
    return { error: "Không thể lấy dữ liệu. Vui lòng thử lại sau." };
  }
  if (slug === "phim-chieu-rap") {
    currentCategoryName = "Phim Chiếu Rạp";
    metaKeywords = keywordsMap["phim-chieu-rap"];
  } else {
    currentCategoryName = categoryData.filters?.loai_phim || slug;
    metaKeywords = keywordsMap[slug] || "phim online, phim vietsub, phim HD";
  }
  return {
    categoryData,
    topmovies,
    currentCategoryName,
    metaKeywords
  };
}

const $$Astro = createAstro();
const prerender = false;
const $$slug = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$slug;
  const slug = Astro2.params.slug;
  const initialPage = 1;
  const limit = 30;
  const data = await getCategoryData(slug, initialPage, limit);
  if (data.error) {
    return new Response(data.error, {
      status: 500
    });
  }
  const { categoryData, currentCategoryName } = data;
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$Layout, {}, { "default": async ($$result2) => renderTemplate`  ${renderComponent($$result2, "Header", Header, { "client:load": true, "client:component-hydration": "load", "client:component-path": "E:/tramphim/tramphim-frontend/src/components/Header/Header", "client:component-export": "default" })} ${maybeRenderHead()}<main class="main-type-layout"> <div class="type-content-flex"> <section class="type-main-section"> ${renderComponent($$result2, "CategoryMovies", CategoryMovies, { "initialData": categoryData, "initialSlug": slug, "baseUrl": BASE_URL, "initialLimit": limit, "tittle": currentCategoryName, "client:load": true, "client:component-hydration": "load", "client:component-path": "E:/tramphim/tramphim-frontend/src/components/CategoryMovies/LoaiPhim", "client:component-export": "default" })} </section> </div> </main> <footer> ${renderComponent($$result2, "Footer", Footer, {})} </footer> `, "head": async ($$result2) => renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "slot": "head" }, { "default": async ($$result3) => renderTemplate` ${renderComponent($$result3, "Seo", $$SeoLoaiPhim, { "slug": slug, "currentCategoryName": currentCategoryName })} ` })}` })}`;
}, "E:/tramphim/tramphim-frontend/src/pages/loai-phim/[slug].astro", void 0);

const $$file = "E:/tramphim/tramphim-frontend/src/pages/loai-phim/[slug].astro";
const $$url = "/loai-phim/[slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$slug,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
