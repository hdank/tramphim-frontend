/* empty css                                 */
import { e as createComponent, k as renderHead, o as renderScript, r as renderTemplate } from '../chunks/astro/server_Boq9MD4A.mjs';
import 'piccolore';
import 'clsx';
/* empty css                                          */
export { renderers } from '../renderers.mjs';

const $$ResetPassword = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`<html lang="vi" data-astro-cid-oiuorpsm> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Đặt lại mật khẩu - TramPhim</title>${renderHead()}</head> <body data-astro-cid-oiuorpsm> <div class="reset-password-container" data-astro-cid-oiuorpsm> <div class="header" data-astro-cid-oiuorpsm> <h1 data-astro-cid-oiuorpsm>🔑 Đặt lại mật khẩu</h1> <p data-astro-cid-oiuorpsm>Nhập mã xác thực đã được gửi đến email của bạn</p> </div> <div class="timer" id="timer" data-astro-cid-oiuorpsm>
⏱️ Mã có hiệu lực trong <span id="countdown" data-astro-cid-oiuorpsm>10:00</span> </div> <div id="message" class="message" data-astro-cid-oiuorpsm></div> <form id="resetPasswordForm" data-astro-cid-oiuorpsm> <div class="code-section" data-astro-cid-oiuorpsm> <label data-astro-cid-oiuorpsm>MÃ XÁC THỰC</label> <div class="code-input-container" id="codeInputContainer" data-astro-cid-oiuorpsm></div> </div> <div class="form-group" data-astro-cid-oiuorpsm> <label for="newPassword" data-astro-cid-oiuorpsm>Mật khẩu mới</label> <input type="password" id="newPassword" name="newPassword" required placeholder="Nhập mật khẩu mới" minlength="6" data-astro-cid-oiuorpsm> <div class="password-strength" data-astro-cid-oiuorpsm> <div class="password-strength-bar" id="strengthBar" data-astro-cid-oiuorpsm></div> </div> </div> <div class="form-group" data-astro-cid-oiuorpsm> <label for="confirmPassword" data-astro-cid-oiuorpsm>Xác nhận mật khẩu</label> <input type="password" id="confirmPassword" name="confirmPassword" required placeholder="Nhập lại mật khẩu mới" data-astro-cid-oiuorpsm> </div> <button type="submit" class="submit-btn" id="submitBtn" data-astro-cid-oiuorpsm>
Đặt lại mật khẩu
</button> </form> <div class="resend-link" data-astro-cid-oiuorpsm> <a href="/forgot-password" data-astro-cid-oiuorpsm>← Gửi lại mã xác thực</a> </div> <div class="back-link" data-astro-cid-oiuorpsm> <a href="/dang-nhap" data-astro-cid-oiuorpsm>Quay lại đăng nhập</a> </div> </div> ${renderScript($$result, "E:/tramphim/tramphim-frontend/src/pages/reset-password.astro?astro&type=script&index=0&lang.ts")} ${renderScript($$result, "E:/tramphim/tramphim-frontend/src/pages/reset-password.astro?astro&type=script&index=1&lang.ts")} </body> </html>`;
}, "E:/tramphim/tramphim-frontend/src/pages/reset-password.astro", void 0);

const $$file = "E:/tramphim/tramphim-frontend/src/pages/reset-password.astro";
const $$url = "/reset-password";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$ResetPassword,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
