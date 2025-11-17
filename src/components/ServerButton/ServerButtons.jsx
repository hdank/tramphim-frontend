import React, { useState, useEffect, useCallback } from "react";

/**
 * @param {object} props
 * @param {boolean} [props.initialAutoSkip] // <-- nhận từ SSR
 */

function SkipIntroButton({ initialAutoSkip = true }) {
  const [autoSkipIntro, setAutoSkipIntro] = useState(initialAutoSkip);
  const writeCookie = useCallback((val) => {
    const set = () => {
      document.cookie = `autoSkipIntro=${
        val ? 1 : 0
      }; path=/; max-age=31536000; SameSite=Lax`;
    };
    if ("requestIdleCallback" in window) window.requestIdleCallback(set);
    else setTimeout(set, 0);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("autoSkipIntro", String(autoSkipIntro));
    } catch {}
  }, [autoSkipIntro]);

  const toggleSkipIntro = () => {
    const next = !autoSkipIntro;
    setAutoSkipIntro(next);
    writeCookie(next);
  };

  return (
    <button
      onClick={toggleSkipIntro}
      className="S flex flex-row items-center justify-center gap-2 rounded-md px-1.5 py-0.5 text-xs font-normal text-white transition-all duration-300 lg:px-5"
    >
      Tắt QC
      <span
        className={`text-xs ${
          autoSkipIntro
            ? "text-sky-300" // ON: viền cam, chữ xanh
            : "text-white" // OFF: viền xám, chữ trắng
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          className="h-7 w-7 fill-current" // <-- quan trọng: lấy màu từ text color
        >
          <path d="M11.35 8.337c0-.699-.42-1.138-1.001-1.138c-.584 0-.954.444-.954 1.239v.453c0 .8.374 1.248.972 1.248c.588 0 .984-.44.984-1.2zm-5.413.237l-.734-2.426H5.15l-.734 2.426h1.52z" />
          <path d="M2 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zm6.209 6.32c0-1.28.694-2.044 1.753-2.044c.655 0 1.156.294 1.336.769h.053v-2.36h1.16V11h-1.138v-.747h-.057c-.145.474-.69.804-1.367.804c-1.055 0-1.74-.764-1.74-2.043v-.695zm-4.04 1.138L3.7 11H2.5l2.013-5.999H5.9L7.905 11H6.644l-.47-1.542H4.17z" />
        </svg>
      </span>
    </button>
  );
}

export default function ServerButtons({
  slug,
  so_tap,
  ngon_ngu,
  finalServer,
  hasSv1Video,
  hasSv2Video,
  hasSv3Video,
  initialAutoSkip = true, // <-- nhận prop từ trang .astro
}) {
  return (
    <div className="flex flex-row items-center justify-center gap-6 rounded-none bg-[#08080a] px-2 py-4 lg:justify-start lg:px-6 lg:py-4">
      <p className="hidden text-[12px] font-normal text-white sm:block">
        Chọn server khác nếu lỗi video hoặc phụ đề
      </p>
      <div className="flex items-center justify-center gap-3">
        {hasSv1Video && (
          <a
            href={`/xem-phim/${slug}/${so_tap}/${ngon_ngu}?server=sv1`}
            className={`rounded-[4px] px-1.5 py-0.5 text-[12px] font-semibold transition-all duration-300 ${
              finalServer === "sv1"
                ? "bg-sky-300 text-black"
                : "bg-white text-black"
            }`}
          >
            VIP1
          </a>
        )}
        {hasSv2Video && (
          <a
            href={`/xem-phim/${slug}/${so_tap}/${ngon_ngu}?server=sv2`}
            className={`rounded-[4px] px-1.5 py-0.5 text-[12px] font-semibold transition-all duration-300 ${
              finalServer === "sv2"
                ? "bg-sky-300 text-black"
                : "bg-white text-black"
            }`}
          >
            VIP2
          </a>
        )}
        {hasSv3Video && (
          <a
            href={`/xem-phim/${slug}/${so_tap}/${ngon_ngu}?server=sv3`}
            className={`rounded-[4px] px-1.5 py-0.5 text-[12px] font-semibold transition-all duration-300 ${
              finalServer === "sv3"
                ? "bg-sky-300 text-black"
                : "bg-white text-black"
            }`}
          >
            VIP3
          </a>
        )}
        {/* Truyền initialAutoSkip xuống button */}
        <SkipIntroButton initialAutoSkip={initialAutoSkip} />
      </div>
    </div>
  );
}
