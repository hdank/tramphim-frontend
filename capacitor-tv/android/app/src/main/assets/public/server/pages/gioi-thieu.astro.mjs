/* empty css                                 */
import { e as createComponent, l as renderComponent, r as renderTemplate, n as Fragment, h as addAttribute, m as maybeRenderHead } from '../chunks/astro/server_Boq9MD4A.mjs';
import 'piccolore';
import { $ as $$Layout } from '../chunks/Layout_D08VFffu.mjs';
import { H as Header } from '../chunks/Header_CYtzV8Xx.mjs';
import { F as Footer } from '../chunks/index_Ce3Y9ZIG.mjs';
/* empty css                                      */
export { renderers } from '../renderers.mjs';

const $$GioiThieu = createComponent(($$result, $$props, $$slots) => {
  const title = "Gi\u1EDBi thi\u1EC7u - Tr\u1EA1m Phim";
  const description = "T\xECm hi\u1EC3u v\u1EC1 Tr\u1EA1m Phim - N\u1EC1n t\u1EA3ng t\u1ED5ng h\u1EE3p th\xF4ng tin gi\u1EA3i tr\xED v\xE0 \u0111i\u1EC7n \u1EA3nh h\xE0ng \u0111\u1EA7u.";
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$Layout, { "data-astro-cid-ai5xlvuu": true }, { "default": ($$result2) => renderTemplate`  ${renderComponent($$result2, "Header", Header, { "client:load": true, "client:component-hydration": "load", "client:component-path": "E:/tramphim/tramphim-frontend/src/components/Header/Header", "client:component-export": "default", "data-astro-cid-ai5xlvuu": true })} ${maybeRenderHead()}<div class="main-container" data-astro-cid-ai5xlvuu> <div class="main-content-wrapper" data-astro-cid-ai5xlvuu> <main id="main-content" class="about-page" data-astro-cid-ai5xlvuu> <article class="about-content" data-astro-cid-ai5xlvuu> <h1 data-astro-cid-ai5xlvuu>Giới thiệu về Trạm Phim</h1> <p class="introduction" data-astro-cid-ai5xlvuu>
Trạm Phim được thành lập với sứ mệnh trở thành điểm đến tổng hợp tin tức và thông tin giải trí hàng đầu cho những người yêu điện ảnh và truyền hình.
</p> <section class="about-section" data-astro-cid-ai5xlvuu> <h2 data-astro-cid-ai5xlvuu>Mục tiêu của chúng tôi:</h2> <div class="objective" data-astro-cid-ai5xlvuu> <h3 data-astro-cid-ai5xlvuu>Cung cấp Thông tin</h3> <p data-astro-cid-ai5xlvuu>Chúng tôi nỗ lực cung cấp những thông tin mới nhất và đáng tin cậy về các bộ phim, chương trình truyền hình, diễn viên và đạo diễn từ khắp nơi trên thế giới.</p> </div> <div class="objective" data-astro-cid-ai5xlvuu> <h3 data-astro-cid-ai5xlvuu>Nền tảng Chia sẻ</h3> <p data-astro-cid-ai5xlvuu>Trạm Phim hoạt động như một nền tảng tìm kiếm và tổng hợp, cung cấp các liên kết nhúng (embed) và thông tin về các nội dung giải trí công cộng.</p> </div> <div class="objective" data-astro-cid-ai5xlvuu> <h3 data-astro-cid-ai5xlvuu>Trải nghiệm Tốt nhất</h3> <p data-astro-cid-ai5xlvuu>Chúng tôi cam kết xây dựng một giao diện thân thiện, dễ sử dụng, giúp người dùng dễ dàng khám phá và theo dõi các bộ phim yêu thích của mình.</p> </div> </section> <section class="about-section" data-astro-cid-ai5xlvuu> <h2 data-astro-cid-ai5xlvuu>Tầm nhìn:</h2> <p data-astro-cid-ai5xlvuu>Chúng tôi mong muốn xây dựng một cộng đồng điện ảnh tích cực, nơi người hâm mộ có thể tương tác, chia sẻ đánh giá và cập nhật những thông tin mới nhất một cách nhanh chóng và tiện lợi.</p> </section> </article> </main> </div> </div> <footer data-astro-cid-ai5xlvuu> ${renderComponent($$result2, "Footer", Footer, { "data-astro-cid-ai5xlvuu": true })} </footer> `, "head": ($$result2) => renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "slot": "head" }, { "default": ($$result3) => renderTemplate` <title>${title}</title> <meta name="description"${addAttribute(description, "content")}> <meta property="og:title"${addAttribute(title, "content")}> <meta property="og:description"${addAttribute(description, "content")}> ` })}` })} `;
}, "E:/tramphim/tramphim-frontend/src/pages/gioi-thieu.astro", void 0);

const $$file = "E:/tramphim/tramphim-frontend/src/pages/gioi-thieu.astro";
const $$url = "/gioi-thieu";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$GioiThieu,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
