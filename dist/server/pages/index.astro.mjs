/* empty css                                  */
import { e as createComponent, f as createAstro, l as renderComponent, n as Fragment$1, r as renderTemplate, u as unescapeHTML, h as addAttribute, o as renderScript, m as maybeRenderHead } from '../chunks/astro/server_BuMcwEkM.mjs';
import 'kleur/colors';
import { $ as $$Layout, H as Header, F as Footer } from '../chunks/index_BCmV18BO.mjs';
import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { useRef, useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
/* empty css                                 */
import { Navigation, EffectFade, Autoplay, Pagination } from 'swiper/modules';
import { a as rutGonTinhTrangPhim, c as cleanhtml, r as rutGonTinhTrangNgonNgu } from '../chunks/movieUtils_BzNI1rrt.mjs';
export { renderers } from '../renderers.mjs';

const BASE_URL = "https://api.motchillx.site";
async function getHomePageData() {
  const endpoints = [
    { key: "themes", url: `${BASE_URL}/api/phim/chu-de/`, isObject: true },
    { key: "moviehots", url: `${BASE_URL}/api/filter/?page=1&limit=18&sort=luot-xem` },
    { key: "moviechieuraps", url: `${BASE_URL}/api/filter/?page=1&limit=24&loai_phim=phim-le&chieu_rap=true` },
    { key: "movieheros", url: `${BASE_URL}/api/filter/?page=1&limit=18&sort=moi-cap-nhat` },
    { key: "movieupdates", url: `${BASE_URL}/api/filter/?page=1&limit=24&loai_phim=phim-bo&sort=moi-cap-nhat` },
    { key: "moviephimbos", url: `${BASE_URL}/api/filter/?page=1&limit=18&loai_phim=phim-bo&sort=ngay-tao` },
    { key: "moviephimles", url: `${BASE_URL}/api/filter/?page=1&limit=18&loai_phim=phim-le&sort=ngay-tao` }
  ];
  try {
    const results = await Promise.all(
      endpoints.map(async (e) => {
        try {
          const res = await fetch(e.url);
          if (!res.ok) throw new Error();
          return res.json();
        } catch {
          return e.isObject ? {} : { data: [] };
        }
      })
    );
    return results.reduce((acc, res, i) => {
      const { key, isObject } = endpoints[i];
      acc[key] = isObject ? res : res.data || [];
      return acc;
    }, {});
  } catch {
    return Object.fromEntries(
      endpoints.map((e) => [e.key, e.isObject ? {} : []])
    );
  }
}

const MovieCardSkeleton = () => {
  return /* @__PURE__ */ jsx("div", { className: "movie-card-item movie-hero-width group animate-pulse", children: /* @__PURE__ */ jsx("div", { className: "relative aspect-[16/7] w-full overflow-hidden bg-gray-700" }) });
};
function MovieCard$2({ movies = [], loading }) {
  const swiperMovies = movies.slice(0, 6);
  if (loading || !swiperMovies || swiperMovies.length === 0) {
    return /* @__PURE__ */ jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsx(
        Swiper,
        {
          slidesPerView: 1,
          navigation: {
            nextEl: ".swiper-button-next-custom",
            prevEl: ".swiper-button-prev-custom"
          },
          modules: [Navigation, EffectFade, Autoplay, Pagination],
          effect: "fade",
          speed: 300,
          autoplay: {
            delay: 5e3,
            disableOnInteraction: false
          },
          pagination: { clickable: true },
          className: "mySwiper",
          grabCursor: true,
          children: Array.from({ length: 3 }).map((_, index) => /* @__PURE__ */ jsx(SwiperSlide, { children: /* @__PURE__ */ jsx(MovieCardSkeleton, {}) }, index))
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "swiper-button-prev-custom swiper-nav-btn-skeleton", children: /* @__PURE__ */ jsx(
        "svg",
        {
          className: "h-6 w-6",
          fill: "none",
          stroke: "currentColor",
          viewBox: "0 0 24 24",
          children: /* @__PURE__ */ jsx(
            "path",
            {
              strokeLinecap: "round",
              strokeLinejoin: "round",
              strokeWidth: 2,
              d: "M15 19l-7-7 7-7"
            }
          )
        }
      ) }),
      /* @__PURE__ */ jsx("div", { className: "swiper-button-next-custom swiper-nav-btn-skeleton-right", children: /* @__PURE__ */ jsx(
        "svg",
        {
          className: "h-6 w-6",
          fill: "none",
          stroke: "currentColor",
          viewBox: "0 0 24 24",
          children: /* @__PURE__ */ jsx(
            "path",
            {
              strokeLinecap: "round",
              strokeLinejoin: "round",
              strokeWidth: 2,
              d: "M9 5l7 7-7 7"
            }
          )
        }
      ) })
    ] });
  }
  return /* @__PURE__ */ jsxs("section", { className: "z-1 relative h-auto", children: [
    /* @__PURE__ */ jsx(
      Swiper,
      {
        spaceBetween: 8,
        loop: true,
        navigation: {
          nextEl: ".swiper-button-next-custom",
          prevEl: ".swiper-button-prev-custom"
        },
        modules: [Navigation, Autoplay, Pagination],
        autoplay: {
          delay: 5e3,
          disableOnInteraction: false
        },
        pagination: { clickable: true },
        className: "mySwiper",
        grabCursor: true,
        breakpoints: {
          0: {
            slidesPerView: 1,
            spaceBetween: 8
          },
          1028: {
            slidesPerView: 2,
            spaceBetween: 0
          }
        },
        children: swiperMovies.map((movie, index) => {
          const { id, slug, ten_phim, banner_url, tinh_trang, ten_khac } = movie;
          const movieKey = id || slug;
          const name = ten_phim;
          const movieLink = `/phim/${slug}`;
          return /* @__PURE__ */ jsx(SwiperSlide, { children: /* @__PURE__ */ jsxs(
            "a",
            {
              href: movieLink,
              "aria-label": `Xem chi tiết phim ${ten_phim}`,
              title: ten_phim,
              className: "movie-slide-container group block h-full w-full",
              children: [
                /* @__PURE__ */ jsx("div", { className: "movie-poster-wrapper", children: /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: banner_url,
                    alt: `Poster phim ${name}`,
                    className: "movie-poster-img",
                    fetchPriority: "high"
                  }
                ) }),
                /* @__PURE__ */ jsx("div", { className: "movie-info-overlay", children: /* @__PURE__ */ jsxs("div", { className: "w-full", children: [
                  /* @__PURE__ */ jsx("h2", { className: "movie-title", children: ten_phim }),
                  /* @__PURE__ */ jsx("div", { className: "movie-tags-group", children: /* @__PURE__ */ jsxs("div", { className: "movie-tags-row", children: [
                    /* @__PURE__ */ jsx(
                      "span",
                      {
                        className: "movie-status-tag",
                        "aria-label": `Thứ tự: ${index + 1}`,
                        children: rutGonTinhTrangPhim(tinh_trang)
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "p",
                      {
                        className: "movie-alt-name-tag",
                        "aria-label": `Tên khác: ${cleanhtml(ten_khac)}`,
                        children: cleanhtml(ten_khac)
                      }
                    )
                  ] }) })
                ] }) })
              ]
            }
          ) }, movieKey);
        })
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "swiper-button-prev-custom swiper-nav-btn-left", children: /* @__PURE__ */ jsx(
      "svg",
      {
        className: "h-5 w-5",
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24",
        children: /* @__PURE__ */ jsx(
          "path",
          {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: 2,
            d: "M15 19l-7-7 7-7"
          }
        )
      }
    ) }),
    /* @__PURE__ */ jsx("div", { className: "swiper-button-next-custom swiper-nav-btn-right", children: /* @__PURE__ */ jsx(
      "svg",
      {
        className: "h-5 w-5",
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24",
        children: /* @__PURE__ */ jsx(
          "path",
          {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: 2,
            d: "M9 5l7 7-7 7"
          }
        )
      }
    ) })
  ] });
}

function MovieCard$1({ movies = [], title, loading, error }) {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const swiperRef = useRef(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  useEffect(() => {
    if (swiperRef.current && prevRef.current && nextRef.current) {
      const swiperInstance = swiperRef.current.swiper;
      swiperInstance.params.navigation.prevEl = prevRef.current;
      swiperInstance.params.navigation.nextEl = nextRef.current;
      swiperInstance.navigation.init();
      swiperInstance.navigation.update();
    }
  }, [isMounted, movies.length]);
  const commonSwiperProps = {
    spaceBetween: 10,
    modules: [Navigation],
    navigation: {
      prevEl: prevRef.current,
      nextEl: nextRef.current
    },
    onSwiper: (swiper) => {
      swiperRef.current = { swiper };
      swiper.on("slideChange", () => {
        setIsBeginning(swiper.isBeginning);
        setIsEnd(swiper.isEnd);
      });
    },
    breakpoints: {
      0: { slidesPerView: 3, spaceBetween: 8 },
      640: { slidesPerView: 4, spaceBetween: 10 },
      768: { slidesPerView: 5, spaceBetween: 12 },
      1024: { slidesPerView: 5, spaceBetween: 15 },
      1280: { slidesPerView: 6, spaceBetween: 16 }
    }
  };
  if (!loading && (error || !movies || movies.length === 0)) {
    return /* @__PURE__ */ jsxs(
      "section",
      {
        className: "section-container",
        "aria-label": `${title.replace(/\s+/g, "-")}-heading`,
        children: [
          /* @__PURE__ */ jsxs("div", { className: "header-wrapper", children: [
            /* @__PURE__ */ jsxs("div", { className: "header-group", children: [
              /* @__PURE__ */ jsx("div", { className: "header-divider-dot" }),
              /* @__PURE__ */ jsx(
                "h2",
                {
                  id: `${title.replace(/\s+/g, "-")}-heading`,
                  className: "header-title",
                  children: title
                }
              )
            ] }),
            /* @__PURE__ */ jsx("div", { className: "header-divider-line" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "error-container", children: [
            /* @__PURE__ */ jsx(
              "svg",
              {
                xmlns: "http://www.w3.org/2000/svg",
                className: "error-icon",
                fill: "none",
                viewBox: "0 0 24 24",
                stroke: "currentColor",
                children: /* @__PURE__ */ jsx(
                  "path",
                  {
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeWidth: 2,
                    d: "M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  }
                )
              }
            ),
            /* @__PURE__ */ jsx("p", { className: "error-message-title", children: "Rất tiếc, không tìm thấy phim nào." }),
            /* @__PURE__ */ jsx("p", { className: "error-message-detail", children: "Vui lòng thử lại sau hoặc kiểm tra kết nối mạng của bạn." })
          ] })
        ]
      }
    );
  }
  if (loading) {
    return /* @__PURE__ */ jsxs(
      "section",
      {
        className: "section-container",
        "aria-label": `${title.replace(/\s+/g, "-")}-heading`,
        children: [
          /* @__PURE__ */ jsxs("div", { className: "header-wrapper", children: [
            /* @__PURE__ */ jsxs("div", { className: "header-group", children: [
              /* @__PURE__ */ jsx("div", { className: "header-divider-dot" }),
              /* @__PURE__ */ jsx(
                "h2",
                {
                  id: `${title.replace(/\s+/g, "-")}-heading`,
                  className: "header-title",
                  children: title
                }
              )
            ] }),
            /* @__PURE__ */ jsx("div", { className: "header-divider-line" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "loading-container", children: /* @__PURE__ */ jsx("p", { className: "text-gray-400", children: "Đang tải..." }) })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsxs(
    "section",
    {
      className: "relative h-auto",
      "aria-label": `${title.replace(/\s+/g, "-")}-heading`,
      children: [
        /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsxs("div", { className: "w-full", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-row items-center justify-between", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex flex-row items-center justify-center gap-2", children: [
              /* @__PURE__ */ jsx("div", { className: "header-divider-dot" }),
              /* @__PURE__ */ jsx(
                "h2",
                {
                  id: `${title.replace(/\s+/g, "-")}-heading`,
                  className: "header-title",
                  children: title
                }
              )
            ] }),
            /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center", children: /* @__PURE__ */ jsxs("div", { className: "slider-controls-group", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  ref: prevRef,
                  className: `slider-nav-btn ${isBeginning ? "pointer-events-none opacity-50" : "opacity-100"}`,
                  "aria-label": "Cuộn trái",
                  children: /* @__PURE__ */ jsx(
                    "svg",
                    {
                      xmlns: "http://www.w3.org/2000/svg",
                      width: "16",
                      height: "16",
                      viewBox: "0 0 16 16",
                      fill: "none",
                      stroke: "currentColor",
                      strokeWidth: "2",
                      strokeLinecap: "round",
                      strokeLinejoin: "round",
                      children: /* @__PURE__ */ jsx("path", { d: "M10.3335 12.6667L5.66683 8.00004L10.3335 3.33337" })
                    }
                  )
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  ref: nextRef,
                  className: `slider-nav-btn ${isEnd ? "pointer-events-none opacity-50" : "opacity-100"}`,
                  "aria-label": "Cuộn phải",
                  children: /* @__PURE__ */ jsx(
                    "svg",
                    {
                      xmlns: "http://www.w3.org/2000/svg",
                      width: "16",
                      height: "16",
                      viewBox: "0 0 16 16",
                      fill: "none",
                      stroke: "currentColor",
                      strokeWidth: "2",
                      strokeLinecap: "round",
                      strokeLinejoin: "round",
                      children: /* @__PURE__ */ jsx("path", { d: "M5.66675 3.33341L10.3334 8.00008L5.66675 12.6667" })
                    }
                  )
                }
              )
            ] }) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "mt-1 h-px flex-1 bg-gradient-to-r from-sky-500/50 via-cyan-500/30 to-transparent" })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "relative py-4", children: isMounted && /* @__PURE__ */ jsx(Swiper, { ...commonSwiperProps, className: "movie-card-swiper", children: movies.map((movie, index) => {
          const {
            id,
            slug,
            ten_phim,
            poster_url,
            tinh_trang,
            ngon_ngu,
            ten_khac
          } = movie;
          const movieKey = id || slug || `movie-${index}`;
          return /* @__PURE__ */ jsx(SwiperSlide, { children: /* @__PURE__ */ jsx("a", { href: `/phim/${slug}`, className: "movie-card-link group", children: /* @__PURE__ */ jsxs("div", { className: "movie-card-main", children: [
            /* @__PURE__ */ jsxs(
              "div",
              {
                className: "movie-poster-clip",
                children: [
                  /* @__PURE__ */ jsx(
                    "img",
                    {
                      src: poster_url,
                      alt: `Xem ${ten_phim || ten_khac} Vietsub Thuyết Minh Full HD`,
                      className: "movie-poster-img",
                      loading: "lazy"
                    }
                  ),
                  /* @__PURE__ */ jsxs("div", { className: "movie-info-bottom", children: [
                    /* @__PURE__ */ jsx("span", { className: "movie-lang-tag", children: rutGonTinhTrangNgonNgu(ngon_ngu) }),
                    /* @__PURE__ */ jsx("span", { className: "movie-status-tag-alt", children: rutGonTinhTrangPhim(tinh_trang) })
                  ] })
                ]
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "movie-details-text-day", children: [
              /* @__PURE__ */ jsx("h3", { className: "movie-title-main-day", title: ten_phim, children: ten_phim }),
              /* @__PURE__ */ jsx("p", { className: "movie-subtitle-day", children: ten_khac })
            ] })
          ] }) }) }, movieKey);
        }) }) })
      ]
    }
  ) });
}

function MovieCard({ movies = [], title, loading, error }) {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const swiperRef = useRef(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const clipPathLeft = "polygon(94.239% 100%, 5.761% 100%, 5.761% 100%, 4.826% 99.95%, 3.94% 99.803%, 3.113% 99.569%, 2.358% 99.256%, 1.687% 98.87%, 1.111% 98.421%, .643% 97.915%, .294% 97.362%, .075% 96.768%, 0 96.142%, 0 3.858%, 0 3.858%, .087% 3.185%, .338% 2.552%, .737% 1.968%, 1.269% 1.442%, 1.92% .984%, 2.672% .602%, 3.512% .306%, 4.423% .105%, 5.391% .008%, 6.4% .024%, 94.879% 6.625%, 94.879% 6.625%, 95.731% 6.732%, 96.532% 6.919%, 97.272% 7.178%, 97.942% 7.503%, 98.533% 7.887%, 99.038% 8.323%, 99.445% 8.805%, 99.747% 9.326%, 99.935% 9.88%, 100% 10.459%, 100% 96.142%, 100% 96.142%, 99.925% 96.768%, 99.706% 97.362%, 99.357% 97.915%, 98.889% 98.421%, 98.313% 98.87%, 97.642% 99.256%, 96.887% 99.569%, 96.06% 99.803%, 95.174% 99.95%, 94.239% 100%)";
  const clipPathRight = "polygon(5.761% 100%, 94.239% 100%, 94.239% 100%, 95.174% 99.95%, 96.06% 99.803%, 96.887% 99.569%, 97.642% 99.256%, 98.313% 98.87%, 98.889% 98.421%, 99.357% 97.915%, 99.706% 97.362%, 99.925% 96.768%, 100% 96.142%, 100% 3.858%, 100% 3.858%, 99.913% 3.185%, 99.662% 2.552%, 99.263% 1.968%, 98.731% 1.442%, 98.08% .984%, 97.328% .602%, 96.488% .306%, 95.577% .105%, 94.609% .008%, 93.6% .024%, 5.121% 6.625%, 5.121% 6.625%, 4.269% 6.732%, 3.468% 6.919%, 2.728% 7.178%, 2.058% 7.503%, 1.467% 7.887%, .962% 8.323%, .555% 8.805%, .253% 9.326%, .065% 9.88%, 0% 10.459%, 0% 96.142%, 0% 96.142%, .075% 96.768%, .294% 97.362%, .643% 97.915%, 1.111% 98.421%, 1.687% 98.87%, 2.358% 99.256%, 3.113% 99.569%, 3.94% 99.803%, 4.826% 99.95%, 5.761% 100%)";
  useEffect(() => {
    setIsMounted(true);
  }, []);
  useEffect(() => {
    if (swiperRef.current && prevRef.current && nextRef.current) {
      const swiperInstance = swiperRef.current.swiper;
      swiperInstance.params.navigation.prevEl = prevRef.current;
      swiperInstance.params.navigation.nextEl = nextRef.current;
      swiperInstance.navigation.init();
      swiperInstance.navigation.update();
    }
  }, [isMounted, movies.length]);
  const commonSwiperProps = {
    spaceBetween: 10,
    modules: [Navigation],
    navigation: {
      prevEl: prevRef.current,
      nextEl: nextRef.current
    },
    onSwiper: (swiper) => {
      swiperRef.current = { swiper };
      swiper.on("slideChange", () => {
        setIsBeginning(swiper.isBeginning);
        setIsEnd(swiper.isEnd);
      });
    },
    breakpoints: {
      0: { slidesPerView: 2, spaceBetween: 8 },
      640: { slidesPerView: 4, spaceBetween: 10 },
      768: { slidesPerView: 5, spaceBetween: 12 },
      1024: { slidesPerView: 5, spaceBetween: 15 },
      1280: { slidesPerView: 6, spaceBetween: 16 }
    }
  };
  if (!loading && (error || !movies || movies.length === 0)) {
    return /* @__PURE__ */ jsxs(
      "section",
      {
        className: "section-container",
        "aria-label": `${title.replace(/\s+/g, "-")}-heading`,
        children: [
          /* @__PURE__ */ jsxs("div", { className: "header-wrapper", children: [
            /* @__PURE__ */ jsxs("div", { className: "header-group", children: [
              /* @__PURE__ */ jsx("div", { className: "header-divider-dot" }),
              /* @__PURE__ */ jsx(
                "h2",
                {
                  id: `${title.replace(/\s+/g, "-")}-heading`,
                  className: "header-title",
                  children: title
                }
              )
            ] }),
            /* @__PURE__ */ jsx("div", { className: "header-divider-line" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "error-container", children: [
            /* @__PURE__ */ jsx(
              "svg",
              {
                xmlns: "http://www.w3.org/2000/svg",
                className: "error-icon",
                fill: "none",
                viewBox: "0 0 24 24",
                stroke: "currentColor",
                children: /* @__PURE__ */ jsx(
                  "path",
                  {
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeWidth: 2,
                    d: "M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  }
                )
              }
            ),
            /* @__PURE__ */ jsx("p", { className: "error-message-title", children: "Rất tiếc, không tìm thấy phim nào." }),
            /* @__PURE__ */ jsx("p", { className: "error-message-detail", children: "Vui lòng thử lại sau hoặc kiểm tra kết nối mạng của bạn." })
          ] })
        ]
      }
    );
  }
  if (loading) {
    return /* @__PURE__ */ jsxs(
      "section",
      {
        className: "section-container",
        "aria-label": `${title.replace(/\s+/g, "-")}-heading`,
        children: [
          /* @__PURE__ */ jsxs("div", { className: "header-wrapper", children: [
            /* @__PURE__ */ jsxs("div", { className: "header-group", children: [
              /* @__PURE__ */ jsx("div", { className: "header-divider-dot" }),
              /* @__PURE__ */ jsx(
                "h2",
                {
                  id: `${title.replace(/\s+/g, "-")}-heading`,
                  className: "header-title",
                  children: title
                }
              )
            ] }),
            /* @__PURE__ */ jsx("div", { className: "header-divider-line" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "loading-container", children: /* @__PURE__ */ jsx("p", { className: "text-gray-400", children: "Đang tải..." }) })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsxs(
    "section",
    {
      className: "relative h-auto",
      "aria-label": `${title.replace(/\s+/g, "-")}-heading`,
      children: [
        /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsxs("div", { className: "w-full", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-row items-center justify-between", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex flex-row items-center justify-center gap-2", children: [
              /* @__PURE__ */ jsx("div", { className: "header-divider-dot" }),
              /* @__PURE__ */ jsx(
                "h2",
                {
                  id: `${title.replace(/\s+/g, "-")}-heading`,
                  className: "header-title",
                  children: title
                }
              )
            ] }),
            /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center", children: /* @__PURE__ */ jsxs("div", { className: "slider-controls-group", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  ref: prevRef,
                  className: `slider-nav-btn ${isBeginning ? "pointer-events-none opacity-50" : "opacity-100"}`,
                  "aria-label": "Cuộn trái",
                  children: /* @__PURE__ */ jsx(
                    "svg",
                    {
                      xmlns: "http://www.w3.org/2000/svg",
                      width: "16",
                      height: "16",
                      viewBox: "0 0 16 16",
                      fill: "none",
                      stroke: "currentColor",
                      strokeWidth: "2",
                      strokeLinecap: "round",
                      strokeLinejoin: "round",
                      children: /* @__PURE__ */ jsx("path", { d: "M10.3335 12.6667L5.66683 8.00004L10.3335 3.33337" })
                    }
                  )
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  ref: nextRef,
                  className: `slider-nav-btn ${isEnd ? "pointer-events-none opacity-50" : "opacity-100"}`,
                  "aria-label": "Cuộn phải",
                  children: /* @__PURE__ */ jsx(
                    "svg",
                    {
                      xmlns: "http://www.w3.org/2000/svg",
                      width: "16",
                      height: "16",
                      viewBox: "0 0 16 16",
                      fill: "none",
                      stroke: "currentColor",
                      strokeWidth: "2",
                      strokeLinecap: "round",
                      strokeLinejoin: "round",
                      children: /* @__PURE__ */ jsx("path", { d: "M5.66675 3.33341L10.3334 8.00008L5.66675 12.6667" })
                    }
                  )
                }
              )
            ] }) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "mt-1 h-px flex-1 bg-gradient-to-r from-sky-500/50 via-cyan-500/30 to-transparent" })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "relative py-4", children: isMounted && /* @__PURE__ */ jsx(Swiper, { ...commonSwiperProps, className: "movie-card-swiper", children: movies.map((movie, index) => {
          const {
            id,
            slug,
            ten_phim,
            poster_url,
            tinh_trang,
            ngon_ngu,
            ten_khac
          } = movie;
          const movieKey = id || slug || `movie-${index}`;
          const clipPath = index % 2 === 0 ? clipPathLeft : clipPathRight;
          return /* @__PURE__ */ jsx(SwiperSlide, { children: /* @__PURE__ */ jsx("a", { href: `/phim/${slug}`, className: "movie-card-link group", children: /* @__PURE__ */ jsxs("div", { className: "movie-card-main", children: [
            /* @__PURE__ */ jsxs(
              "div",
              {
                className: "movie-poster-clip",
                style: {
                  clipPath
                },
                children: [
                  /* @__PURE__ */ jsx(
                    "img",
                    {
                      src: poster_url,
                      alt: `Xem ${ten_phim || ten_khac} Vietsub Thuyết Minh Full HD`,
                      className: "movie-poster-img",
                      loading: "lazy"
                    }
                  ),
                  /* @__PURE__ */ jsxs("div", { className: "movie-info-bottom", children: [
                    /* @__PURE__ */ jsx("span", { className: "movie-lang-tag", children: rutGonTinhTrangNgonNgu(ngon_ngu) }),
                    /* @__PURE__ */ jsx("span", { className: "movie-status-tag-alt", children: rutGonTinhTrangPhim(tinh_trang) })
                  ] })
                ]
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "movie-ranking-row", children: [
              /* @__PURE__ */ jsx("span", { className: "movie-ranking-number", children: index + 1 }),
              /* @__PURE__ */ jsxs("div", { className: "movie-details-text", children: [
                /* @__PURE__ */ jsx("h3", { className: "movie-title-main", title: ten_phim, children: ten_phim }),
                /* @__PURE__ */ jsx(
                  "p",
                  {
                    className: "movie-subtitle",
                    dangerouslySetInnerHTML: { __html: ten_khac }
                  }
                )
              ] })
            ] })
          ] }) }) }, movieKey);
        }) }) })
      ]
    }
  ) });
}

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const $$SeoHome = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$SeoHome;
  const siteUrl = Astro2.url.origin;
  const SEO = {
    siteName: "HH3D",
    pageTitle: "Tr\u1EA1m Phim - Phim M\u1EDBi, Phim Hay Vietsub Thuy\u1EBFt Minh",
    description: "Tr\u1EA1m Phim mang \u0111\u1EBFn phim m\u1EDBi, phim hay Vietsub v\xE0 Thuy\u1EBFt minh ch\u1EA5t l\u01B0\u1EE3ng cao. C\u1EADp nh\u1EADt phim l\u1EBB 2025, phim chi\u1EBFu r\u1EA1p hot c\xF9ng tuy\u1EC3n t\u1EADp phim b\u1ED9 Trung Qu\u1ED1c v\xE0 H\xE0n Qu\u1ED1c h\u1EA5p d\u1EABn nh\u1EA5t.",
    logoUrl: "/logo.png",
    ogImage: "/thumb_web.png"};
  const {
    siteName,
    pageTitle,
    description,
    logoUrl,
    ogImage} = SEO;
  const seoJsonLD = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}#organization`,
        name: siteName,
        url: siteUrl,
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}${logoUrl}`
        }
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}#website`,
        url: siteUrl,
        name: siteName,
        inLanguage: "vi",
        publisher: { "@id": `${siteUrl}#organization` },
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteUrl}/tim-kiem?q={search_term_string}`,
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "WebPage",
        "@id": `${siteUrl}#webpage`,
        url: siteUrl,
        name: pageTitle,
        isPartOf: { "@id": `${siteUrl}#website` },
        about: { "@id": `${siteUrl}#organization` },
        description,
        inLanguage: "vi",
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: `${siteUrl}${ogImage}`
        },
        breadcrumb: { "@id": `${siteUrl}#breadcrumb` }
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${siteUrl}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Trang ch\u1EE7",
            item: siteUrl
          }
        ]
      }
    ]
  };
  return renderTemplate`${renderComponent($$result, "Fragment", Fragment$1, { "slot": "head" }, { "default": ($$result2) => renderTemplate(_a || (_a = __template(["<title>", '</title><meta name="description"', '><meta name="robots"', '><meta name="author"', '><link rel="canonical"', '><meta property="og:type" content="website"><meta property="og:title"', '><meta property="og:description"', '><meta property="og:url"', '><meta property="og:site_name"', '><meta property="og:locale" content="vi_VN"><meta property="og:image"', '><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title"', '><meta name="twitter:description"', '><meta name="twitter:image"', '><script type="application/ld+json">', "<\/script>"])), pageTitle, addAttribute(description, "content"), addAttribute(`${"index" }, ${"follow" }`, "content"), addAttribute(siteName, "content"), addAttribute(siteUrl, "href"), addAttribute(pageTitle, "content"), addAttribute(description, "content"), addAttribute(siteUrl, "content"), addAttribute(siteName, "content"), addAttribute(`${siteUrl}${ogImage}`, "content"), addAttribute(pageTitle, "content"), addAttribute(description, "content"), addAttribute(`${siteUrl}${ogImage}`, "content"), unescapeHTML(JSON.stringify(seoJsonLD))) })}`;
}, "/home/vohaidang/Desktop/tramphim-v2/ui/src/seometas/SeoHome.astro", void 0);

const getHref = (slug) => `chu-de/${slug}`;
const viewAllTheme = {
  name: "Xem tất cả",
  slug: "/",
  color: "from-[#4a4e69] to-[#606480]"
};
const defaultColors = [
  "from-[#6654CC] to-[#8072E2]",
  "from-[#47526D] to-[#596688]",
  "from-[#44A38A] to-[#55C3A5]",
  "from-[#8C60C0] to-[#A277DA]",
  "from-[#9E6445] to-[#B67657]",
  "from-[#7F4E4E] to-[#996363]",
  "from-[#574E7F] to-[#736399]"
];
const ThemeSection = ({ themesData }) => {
  if (!Array.isArray(themesData)) {
    themesData = [];
  }
  const fetchedThemes = themesData.map((theme, index) => ({
    ...theme,
    color: defaultColors[index % defaultColors.length]
  }));
  if (!fetchedThemes || fetchedThemes.length === 0) return null;
  const maxDisplayedThemes = 5;
  const displayedThemes = fetchedThemes.slice(0, maxDisplayedThemes);
  const shouldShowViewAll = fetchedThemes.length > maxDisplayedThemes;
  let themesToMap = [...displayedThemes];
  if (shouldShowViewAll) {
    themesToMap.push(viewAllTheme);
  } else {
    themesToMap = fetchedThemes;
  }
  return /* @__PURE__ */ jsxs("section", { className: "theme-section", children: [
    /* @__PURE__ */ jsxs("div", { className: "theme-header-wrapper", children: [
      /* @__PURE__ */ jsxs("div", { className: "theme-header-group", children: [
        /* @__PURE__ */ jsx("div", { className: "theme-header-divider-dot" }),
        /* @__PURE__ */ jsx("h2", { className: "theme-header-title", children: "Chủ Đề Hôm Nay" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "theme-header-divider-line" })
    ] }),
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "themes-container",
        role: "navigation",
        "aria-label": "Các chủ đề phim",
        children: themesToMap.map(({ ten, slug, color }) => (
          // ten là tên từ API
          /* @__PURE__ */ jsxs(
            "a",
            {
              href: getHref(slug),
              className: `theme-card ${color}`,
              children: [
                /* @__PURE__ */ jsxs("div", { className: "theme-content", children: [
                  /* @__PURE__ */ jsx("h3", { className: "theme-title", children: ten || viewAllTheme.name }),
                  (ten || viewAllTheme.name) !== viewAllTheme.name && /* @__PURE__ */ jsx("div", { className: "theme-link", children: /* @__PURE__ */ jsx("span", { className: "mt-2", children: "Xem chủ đề" }) }),
                  (ten || viewAllTheme.name) === viewAllTheme.name && /* @__PURE__ */ jsx("div", { className: "theme-link", children: /* @__PURE__ */ jsxs("span", { className: "mt-2", children: [
                    "Xem tất cả (",
                    fetchedThemes.length,
                    " chủ đề)"
                  ] }) })
                ] }),
                /* @__PURE__ */ jsx(
                  "svg",
                  {
                    className: "theme-svg",
                    xmlns: "http://www.w3.org/2000/svg",
                    preserveAspectRatio: "none",
                    viewBox: "0 0 1440 200",
                    children: Array.from({ length: 40 }, (_, i) => {
                      const y = 50 + i * 12;
                      const amp = 40;
                      return /* @__PURE__ */ jsx(
                        "path",
                        {
                          d: `
          M0,${y}
          C 360,${y - amp} 720,${y + amp} 1080,${y}
          C 1260,${y - amp} 1440,${y + amp} 1440,${y}
        `,
                          stroke: "#ccc",
                          fill: "none",
                          strokeWidth: "2",
                          opacity: "0.5"
                        },
                        i
                      );
                    })
                  }
                )
              ]
            },
            slug || ten
          )
        ))
      }
    )
  ] });
};

const prerender = false;
const revalidate = 1800;
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const homePageData = await getHomePageData();
  const {
    movieheros,
    moviehots,
    movieupdates,
    themes,
    moviechieuraps,
    moviephimbos,
    moviephimles
  } = homePageData;
  const loading = false;
  const error = null;
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$Layout, {}, { "default": async ($$result2) => renderTemplate`  ${maybeRenderHead()}<div id="splash-screen"></div> ${renderComponent($$result2, "Header", Header, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/home/vohaidang/Desktop/tramphim-v2/ui/src/components/Header/Header", "client:component-export": "default" })} <div class="main-container"> <h1 class="sr-only">
Trạm Phim - Phim hay tại Trạm
</h1> <div class="main-content-wrapper"> <main id="main-content"> ${renderComponent($$result2, "Hero", MovieCard$2, { "client:load": true, "movies": moviehots, "loading": loading, "client:component-hydration": "load", "client:component-path": "/home/vohaidang/Desktop/tramphim-v2/ui/src/components/Hero/Hero", "client:component-export": "default" })} ${renderComponent($$result2, "ChuDe", ThemeSection, { "client:idle": true, "themesData": themes, "client:component-hydration": "idle", "client:component-path": "/home/vohaidang/Desktop/tramphim-v2/ui/src/components/ToPics/ToPics.jsx", "client:component-export": "default" })} <div class="card-column-gap"> <section> ${renderComponent($$result2, "MovieCardTop", MovieCard, { "client:idle": true, "movies": moviehots, "title": "TOP 10 H\xF4m Nay", "loading": loading, "error": error, "client:component-hydration": "idle", "client:component-path": "/home/vohaidang/Desktop/tramphim-v2/ui/src/components/MovieCardHome/CardColumnTop.jsx", "client:component-export": "default" })} </section> <section> ${renderComponent($$result2, "MovieCardColumn", MovieCard$1, { "client:idle": true, "title": "Phim C\xF3 T\u1EADp M\u1EDBi", "movies": movieupdates, "loading": loading, "error": error, "client:component-hydration": "idle", "client:component-path": "/home/vohaidang/Desktop/tramphim-v2/ui/src/components/MovieCardHome/CardColumn.jsx", "client:component-export": "default" })} </section> <section class="fade-in-on-visible"> ${renderComponent($$result2, "MovieCardColumn", MovieCard$1, { "client:idle": true, "title": "Phim Chi\u1EBFu R\u1EA1p Hot Nh\u1EA5t 2025", "movies": moviechieuraps, "loading": loading, "error": error, "client:component-hydration": "idle", "client:component-path": "/home/vohaidang/Desktop/tramphim-v2/ui/src/components/MovieCardHome/CardColumn.jsx", "client:component-export": "default" })} </section> <section class="fade-in-on-visible"> ${renderComponent($$result2, "MovieCardColumn", MovieCard$1, { "client:visible": true, "title": "Phim L\u1EBB", "movies": moviephimles, "loading": loading, "error": error, "client:component-hydration": "visible", "client:component-path": "/home/vohaidang/Desktop/tramphim-v2/ui/src/components/MovieCardHome/CardColumn.jsx", "client:component-export": "default" })} </section> <section class="fade-in-on-visible"> ${renderComponent($$result2, "MovieCardColumn", MovieCard$1, { "client:visible": true, "title": "Phim B\u1ED9", "movies": moviephimbos, "loading": loading, "error": error, "client:component-hydration": "visible", "client:component-path": "/home/vohaidang/Desktop/tramphim-v2/ui/src/components/MovieCardHome/CardColumn.jsx", "client:component-export": "default" })} </section> <!-- <section class="fade-in-on-visible">
            <MovieCardCategory
              client:visible
              title="Phim Lẻ "
              category="phim-le"
            />
          </section>
          <section class="fade-in-on-visible">
            <MovieCardCategory
              client:visible
              title="Phim Bộ"
              category="phim-bo"
            />
          </section> --> </div> </main> </div> </div> <footer> ${renderComponent($$result2, "Footer", Footer, {})} </footer> `, "head": async ($$result2) => renderTemplate`${renderComponent($$result2, "Fragment", Fragment$1, { "slot": "head" }, { "default": async ($$result3) => renderTemplate` ${renderComponent($$result3, "SeoHome", $$SeoHome, {})} ` })}` })} ${renderScript($$result, "/home/vohaidang/Desktop/tramphim-v2/ui/src/pages/index.astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/vohaidang/Desktop/tramphim-v2/ui/src/pages/index.astro", void 0);

const $$file = "/home/vohaidang/Desktop/tramphim-v2/ui/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  prerender,
  revalidate,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
