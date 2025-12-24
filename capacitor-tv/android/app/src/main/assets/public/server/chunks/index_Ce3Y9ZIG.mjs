import { jsx, jsxs } from 'react/jsx-runtime';
import 'react';
import { l as logo } from './Header_CYtzV8Xx.mjs';
import { q as qrBank } from './qrbank_Dm67cL-p.mjs';

const Footer = () => {
  const navLinks = [
    { name: "Hỏi - Đáp", href: "/hoi-dap" },
    { name: "Chính sách bảo mật", href: "/chinh-sach-bao-mat" },
    { name: "Điều khoản sử dụng", href: "/dieu-khoan-su-dung" },
    { name: "Giới thiệu", href: "/gioi-thieu" },
    { name: "Liên hệ", href: "/lien-he" }
  ];
  const socialLinks = [
    {
      name: "Facebook",
      href: "https://www.facebook.com/profile.php?id=61581940541481",
      icon: /* @__PURE__ */ jsx("svg", { className: "h-5 w-5", fill: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { d: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" }) })
    },
    {
      name: "TikTok",
      href: "https://www.tiktok.com/@tramphim.com",
      icon: /* @__PURE__ */ jsx("svg", { className: "h-5 w-5", fill: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { d: "M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" }) })
    }
  ];
  const year = (/* @__PURE__ */ new Date()).getFullYear();
  return /* @__PURE__ */ jsx("footer", { className: "mt-12 border-t border-white/10 bg-[#0d0d0f]", children: /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-screen-2xl px-4 py-10 lg:px-6", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-8 lg:flex-row lg:justify-between", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between lg:justify-start lg:gap-8", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
          /* @__PURE__ */ jsx(
            "img",
            {
              src: typeof logo === "string" ? logo : logo.src,
              className: "h-12 w-auto",
              loading: "lazy",
              alt: "Trạm Phim"
            }
          ),
          /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-500", children: "Phim hay tại Trạm" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2", children: socialLinks.map((social) => /* @__PURE__ */ jsx(
          "a",
          {
            href: social.href,
            target: "_blank",
            rel: "noopener noreferrer",
            className: "flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-gray-400 transition-all hover:bg-white/10 hover:text-white",
            "aria-label": social.name,
            children: social.icon
          },
          social.name
        )) })
      ] }),
      /* @__PURE__ */ jsx("nav", { className: "mb-6 flex flex-wrap gap-x-6 gap-y-2 border-t border-white/5 pt-6", children: navLinks.map((link) => /* @__PURE__ */ jsx(
        "a",
        {
          href: link.href,
          className: "text-sm text-gray-400 transition-colors hover:text-white",
          children: link.name
        },
        link.href
      )) }),
      /* @__PURE__ */ jsx("p", { className: "mb-4 max-w-2xl text-sm leading-relaxed text-gray-500", children: "Trạm Phim – Phim hay tại Trạm - Trang xem phim online chất lượng cao không quảng cáo miễn phí Vietsub, thuyết minh, lồng tiếng full HD. Kho phim mới khổng lồ, phim chiếu rạp, phim bộ, phim lẻ từ nhiều quốc gia như Việt Nam, Hàn Quốc, Trung Quốc, Thái Lan, Nhật Bản, Âu Mỹ... đa dạng thể loại." }),
      /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-600", children: [
        "© ",
        year,
        " Trạm Phim"
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex flex-col items-center lg:items-end lg:pl-8", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center ", children: [
      /* @__PURE__ */ jsx("p", { className: "mb-2 text-sm font-medium text-amber-400", children: "☕ Ủng hộ Trạm Phim một cốc cà phê để chúng mình có thêm động lực duy trì và phát triển Trạm Phim nha!" }),
      /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
        "img",
        {
          src: typeof qrBank === "string" ? qrBank : qrBank.src,
          alt: "QR Code ủng hộ",
          className: "h-48 w-48",
          loading: "lazy"
        }
      ) }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 text-xs text-gray-500", children: "Quét mã để ủng hộ" })
    ] }) })
  ] }) }) });
};

export { Footer as F };
