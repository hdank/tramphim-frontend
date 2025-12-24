/* empty css                                 */
import { e as createComponent, l as renderComponent, r as renderTemplate, n as Fragment, h as addAttribute, m as maybeRenderHead } from '../chunks/astro/server_Boq9MD4A.mjs';
import 'piccolore';
import { $ as $$Layout } from '../chunks/Layout_D08VFffu.mjs';
import { H as Header } from '../chunks/Header_CYtzV8Xx.mjs';
import { F as Footer } from '../chunks/index_Ce3Y9ZIG.mjs';
import { M as MemoryCardGameIframe } from '../chunks/MemoryCardGameIframe_CjwOBqQZ.mjs';
/* empty css                                            */
export { renderers } from '../renderers.mjs';

const $$MemoryCardGame = createComponent(($$result, $$props, $$slots) => {
  const title = "Memory Card Game - Tr\u1EA1m Phim";
  const description = "Ch\u01A1i game l\u1EADt th\u1EBB, nh\u1EADn \u0111\u1EADu th\u01B0\u1EDFng!";
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$Layout, { "data-astro-cid-tvg3rq4f": true }, { "default": ($$result2) => renderTemplate`  ${renderComponent($$result2, "Header", Header, { "client:load": true, "client:component-hydration": "load", "client:component-path": "E:/tramphim/tramphim-frontend/src/components/Header/Header", "client:component-export": "default", "data-astro-cid-tvg3rq4f": true })} ${maybeRenderHead()}<div class="main-container" data-astro-cid-tvg3rq4f> <div class="main-content-wrapper" data-astro-cid-tvg3rq4f> <main id="main-content" class="game-page" data-astro-cid-tvg3rq4f> ${renderComponent($$result2, "MemoryCardGameIframe", MemoryCardGameIframe, { "client:load": true, "client:component-hydration": "load", "client:component-path": "E:/tramphim/tramphim-frontend/src/components/MiniGame/MemoryCardGameIframe", "client:component-export": "default", "data-astro-cid-tvg3rq4f": true })} </main> </div> </div> <footer data-astro-cid-tvg3rq4f> ${renderComponent($$result2, "Footer", Footer, { "data-astro-cid-tvg3rq4f": true })} </footer> `, "head": ($$result2) => renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "slot": "head" }, { "default": ($$result3) => renderTemplate` <title>${title}</title> <meta name="description"${addAttribute(description, "content")}> ` })}` })} `;
}, "E:/tramphim/tramphim-frontend/src/pages/memory-card-game.astro", void 0);

const $$file = "E:/tramphim/tramphim-frontend/src/pages/memory-card-game.astro";
const $$url = "/memory-card-game";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$MemoryCardGame,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
