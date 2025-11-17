/* empty css                                  */
import { e as createComponent, k as renderHead, r as renderTemplate } from '../chunks/astro/server_BuMcwEkM.mjs';
import 'kleur/colors';
import 'clsx';
export { renderers } from '../renderers.mjs';

const $$404 = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`<html lang="vi"> <head><meta charset="UTF-8"><title>Trang không tồn tại | MotChill</title><meta name="description" content="Rất tiếc, trang bạn đang tìm kiếm không tồn tại. Vui lòng kiểm tra lại địa chỉ hoặc quay về trang chủ để khám phá."><meta name="viewport" content="width=device-width, initial-scale=1.0">${renderHead()}</head> <body class="bg-[#191B24] text-white flex items-center justify-center min-h-screen p-4"> <div class="container text-center space-y-8"> <h1 class="text-7xl font-extrabold text-[#ffd785] animate-bounce">404</h1> <h2 class="text-3xl font-bold">Không tìm thấy trang</h2> <p class="text-gray-400 leading-relaxed">
Có vẻ như trang bạn đang cố gắng truy cập đã bị xóa hoặc địa chỉ URL
        không chính xác. Đừng lo lắng, hãy quay về trang chủ để tìm kiếm những
        bộ phim hấp dẫn khác!
</p> <a href="/" class="inline-block px-8 py-4 bg-[#ffd875] text-black font-semibold rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-110">
Về trang chủ
</a> </div> </body></html>`;
}, "/home/vohaidang/Desktop/tramphim-v2/ui/src/pages/404.astro", void 0);

const $$file = "/home/vohaidang/Desktop/tramphim-v2/ui/src/pages/404.astro";
const $$url = "/404";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$404,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
