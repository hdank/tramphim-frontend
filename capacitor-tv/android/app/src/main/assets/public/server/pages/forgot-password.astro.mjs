/* empty css                                 */
import { e as createComponent, k as renderHead, o as renderScript, r as renderTemplate } from '../chunks/astro/server_Boq9MD4A.mjs';
import 'piccolore';
import 'clsx';
/* empty css                                           */
export { renderers } from '../renderers.mjs';

const $$ForgotPassword = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`<html lang="vi" data-astro-cid-sjxci7tl> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Quên mật khẩu - TramPhim</title>${renderHead()}</head> <body data-astro-cid-sjxci7tl> <div class="forgot-password-container" data-astro-cid-sjxci7tl> <div class="header" data-astro-cid-sjxci7tl> <h1 data-astro-cid-sjxci7tl>🔐 Quên mật khẩu</h1> <p data-astro-cid-sjxci7tl>Nhập địa chỉ email của bạn và chúng tôi sẽ gửi mã xác thực để đặt lại mật khẩu</p> </div> <div id="message" class="message" data-astro-cid-sjxci7tl></div> <form id="forgotPasswordForm" data-astro-cid-sjxci7tl> <div class="form-group" data-astro-cid-sjxci7tl> <label for="email" data-astro-cid-sjxci7tl>Địa chỉ Email</label> <input type="email" id="email" name="email" required placeholder="vidu@email.com" autocomplete="email" data-astro-cid-sjxci7tl> </div> <button type="submit" class="submit-btn" id="submitBtn" data-astro-cid-sjxci7tl>
Gửi mã xác thực
</button> </form> <div class="back-link" data-astro-cid-sjxci7tl> <a href="/dang-nhap" data-astro-cid-sjxci7tl>← Quay lại đăng nhập</a> </div> </div> ${renderScript($$result, "E:/tramphim/tramphim-frontend/src/pages/forgot-password.astro?astro&type=script&index=0&lang.ts")} ${renderScript($$result, "E:/tramphim/tramphim-frontend/src/pages/forgot-password.astro?astro&type=script&index=1&lang.ts")} </body> </html>`;
}, "E:/tramphim/tramphim-frontend/src/pages/forgot-password.astro", void 0);

const $$file = "E:/tramphim/tramphim-frontend/src/pages/forgot-password.astro";
const $$url = "/forgot-password";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$ForgotPassword,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
