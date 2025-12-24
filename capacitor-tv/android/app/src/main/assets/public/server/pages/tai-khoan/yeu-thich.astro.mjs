/* empty css                                    */
import { e as createComponent, l as renderComponent, r as renderTemplate } from '../../chunks/astro/server_Boq9MD4A.mjs';
import 'piccolore';
import { $ as $$Layout } from '../../chunks/Layout_D08VFffu.mjs';
export { renderers } from '../../renderers.mjs';

const $$YeuThich = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Phim Y\xEAu Th\xEDch - Tr\u1EA1m Phim" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Header", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "E:/tramphim/tramphim-frontend/src/components/Header/Header", "client:component-export": "default" })} ${renderComponent($$result2, "FavoriteMoviesPage", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "E:/tramphim/tramphim-frontend/src/components/User/FavoriteMoviesPage", "client:component-export": "default" })} ` })}`;
}, "E:/tramphim/tramphim-frontend/src/pages/tai-khoan/yeu-thich.astro", void 0);

const $$file = "E:/tramphim/tramphim-frontend/src/pages/tai-khoan/yeu-thich.astro";
const $$url = "/tai-khoan/yeu-thich";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$YeuThich,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
