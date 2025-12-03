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
      Tự động bỏ qua intro
      <span
        className={`text-xs ${
          autoSkipIntro
            ? "text-sky-300" // ON: màu xanh
            : "text-white" // OFF: màu trắng
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="h-5 w-5 fill-current"
        >
          <path d="M5.055 7.06C3.805 6.347 2.25 7.25 2.25 8.69v6.62c0 1.44 1.555 2.343 2.805 1.628L12 12.938v3.372c0 1.44 1.555 2.343 2.805 1.628l7.108-4.061c1.26-.72 1.26-2.536 0-3.256l-7.108-4.061C13.555 5.716 12 6.62 12 8.06v3.372L5.055 7.06Z" />
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
