/* empty css                                 */
import { e as createComponent, l as renderComponent, r as renderTemplate } from '../chunks/astro/server_Boq9MD4A.mjs';
import 'piccolore';
import { $ as $$Layout } from '../chunks/Layout_D08VFffu.mjs';
export { renderers } from '../renderers.mjs';

const $$DangKy = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "\u0110\u0103ng k\xFD - Tr\u1EA1m Phim" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Header", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "E:/tramphim/tramphim-frontend/src/components/Header/Header", "client:component-export": "default" })} ${renderComponent($$result2, "SignUp", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "E:/tramphim/tramphim-frontend/src/components/Auth/SignUp", "client:component-export": "default" })} ` })}`;
}, "E:/tramphim/tramphim-frontend/src/pages/dang-ky.astro", void 0);

const $$file = "E:/tramphim/tramphim-frontend/src/pages/dang-ky.astro";
const $$url = "/dang-ky";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$DangKy,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
