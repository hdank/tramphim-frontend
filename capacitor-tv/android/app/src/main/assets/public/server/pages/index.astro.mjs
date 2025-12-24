/* empty css                                 */
import { e as createComponent, f as createAstro, l as renderComponent, n as Fragment$1, r as renderTemplate, u as unescapeHTML, h as addAttribute, o as renderScript, m as maybeRenderHead } from '../chunks/astro/server_Boq9MD4A.mjs';
import 'piccolore';
import { $ as $$Layout } from '../chunks/Layout_D08VFffu.mjs';
import { g as getHomePageData } from '../chunks/getMovieHome_CQGfeJ3H.mjs';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
/* empty css                                 */
import { c as cleanhtml, r as rutGonTinhTrangNgonNgu, a as rutGonTinhTrangPhim } from '../chunks/movieUtils_BzNI1rrt.mjs';
import { H as Header } from '../chunks/Header_CYtzV8Xx.mjs';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
export { renderers } from '../renderers.mjs';

const HeroSkeleton = () => {
  return /* @__PURE__ */ jsxs("div", { className: "hero-featured-container", children: [
    /* @__PURE__ */ jsx("div", { className: "hero-featured-bg", children: /* @__PURE__ */ jsx("div", { className: "skeleton-shimmer absolute inset-0" }) }),
    /* @__PURE__ */ jsxs("div", { className: "hero-featured-content", children: [
      /* @__PURE__ */ jsxs("div", { className: "hero-featured-left", children: [
        /* @__PURE__ */ jsx("div", { className: "skeleton-shimmer mb-4 h-12 w-3/4 rounded-lg lg:h-16" }),
        /* @__PURE__ */ jsx("div", { className: "skeleton-shimmer mb-2 h-4 w-1/2 rounded" }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2 mb-4", children: [
          /* @__PURE__ */ jsx("div", { className: "skeleton-shimmer h-6 w-16 rounded-full" }),
          /* @__PURE__ */ jsx("div", { className: "skeleton-shimmer h-6 w-16 rounded-full" }),
          /* @__PURE__ */ jsx("div", { className: "skeleton-shimmer h-6 w-16 rounded-full" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "skeleton-shimmer mb-4 h-16 w-full rounded" }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "skeleton-shimmer h-12 w-12 rounded-full" }),
          /* @__PURE__ */ jsx("div", { className: "skeleton-shimmer h-12 w-12 rounded-full" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "hero-featured-right", children: /* @__PURE__ */ jsx("div", { className: "flex gap-2", children: Array.from({ length: 6 }).map((_, i) => /* @__PURE__ */ jsx("div", { className: "skeleton-shimmer h-16 w-12 rounded-lg" }, i)) }) })
    ] })
  ] });
};
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};
const staggerChildren = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};
function MovieCard$2({ movies = [], loading }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const heroMovies = movies.slice(0, 8);
  const activeMovie = heroMovies[activeIndex];
  useEffect(() => {
    if (heroMovies.length === 0) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % heroMovies.length);
    }, 8e3);
    return () => clearInterval(interval);
  }, [heroMovies.length]);
  if (loading || !heroMovies || heroMovies.length === 0) {
    return /* @__PURE__ */ jsx(HeroSkeleton, {});
  }
  const {
    id,
    slug,
    ten_phim,
    banner_url,
    poster_url,
    title_image_url,
    tinh_trang,
    ten_khac,
    mo_ta
  } = activeMovie;
  const movieLink = `/phim/${slug}`;
  return /* @__PURE__ */ jsxs("section", { className: "hero-featured-section", children: [
    /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.5 },
        className: "hero-featured-bg",
        children: [
          /* @__PURE__ */ jsx(
            "img",
            {
              src: banner_url || poster_url,
              alt: ten_phim,
              className: "hero-featured-bg-img",
              fetchPriority: "high",
              loading: "eager",
              decoding: "async"
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "hero-featured-gradient" }),
          /* @__PURE__ */ jsx("div", { className: "hero-featured-gradient-left" })
        ]
      },
      activeIndex
    ) }),
    /* @__PURE__ */ jsxs("div", { className: "hero-featured-content", children: [
      /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: "hidden",
          animate: "visible",
          exit: "hidden",
          variants: staggerChildren,
          className: "hero-featured-left",
          children: [
            title_image_url && /* @__PURE__ */ jsx(
              motion.div,
              {
                variants: fadeInUp,
                className: "hero-title-image-wrapper",
                children: /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: title_image_url,
                    alt: ten_phim,
                    className: "hero-title-image"
                  }
                )
              }
            ),
            !title_image_url && /* @__PURE__ */ jsx(
              motion.h1,
              {
                variants: fadeInUp,
                className: "hero-featured-title",
                children: ten_phim
              }
            ),
            /* @__PURE__ */ jsx(
              motion.p,
              {
                variants: fadeInUp,
                className: "hero-featured-alt-name",
                children: cleanhtml(ten_khac)
              }
            ),
            tinh_trang && /* @__PURE__ */ jsx(
              motion.div,
              {
                variants: fadeInUp,
                className: "hero-featured-meta",
                children: /* @__PURE__ */ jsx("span", { className: "hero-meta-badge", children: tinh_trang })
              }
            ),
            /* @__PURE__ */ jsx(
              motion.p,
              {
                variants: fadeInUp,
                className: "hero-featured-desc hidden md:block",
                children: mo_ta ? mo_ta.length > 200 ? mo_ta.substring(0, 200) + "..." : mo_ta : ""
              }
            ),
            /* @__PURE__ */ jsxs(
              motion.div,
              {
                variants: fadeInUp,
                className: "hero-featured-actions",
                children: [
                  /* @__PURE__ */ jsx(
                    "a",
                    {
                      href: movieLink,
                      className: "hero-play-btn",
                      children: /* @__PURE__ */ jsx("svg", { className: "h-5 w-5", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ jsx("path", { d: "M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" }) })
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "a",
                    {
                      href: movieLink,
                      className: "hero-info-btn",
                      title: "Xem chi tiết",
                      children: /* @__PURE__ */ jsx("svg", { className: "h-5 w-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }) })
                    }
                  )
                ]
              }
            )
          ]
        },
        activeIndex
      ) }),
      /* @__PURE__ */ jsx("div", { className: "hero-featured-right", children: /* @__PURE__ */ jsx("div", { className: "hero-thumbnails-container", children: heroMovies.map((movie, index) => /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setActiveIndex(index),
          className: `hero-thumbnail ${index === activeIndex ? "hero-thumbnail-active" : ""}`,
          children: [
            /* @__PURE__ */ jsx(
              "img",
              {
                src: movie.poster_url,
                alt: movie.ten_phim,
                className: "hero-thumbnail-img"
              }
            ),
            index === activeIndex && /* @__PURE__ */ jsx("div", { className: "hero-thumbnail-border" })
          ]
        },
        movie.id || movie.slug
      )) }) })
    ] })
  ] });
}

const MovieCardSkeleton = ({ index = 0 }) => /* @__PURE__ */ jsxs(
  motion.div,
  {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.3, delay: index * 0.05 },
    className: "flex flex-col",
    children: [
      /* @__PURE__ */ jsx("div", { className: "skeleton-shimmer aspect-[2/3] w-full rounded-xl" }),
      /* @__PURE__ */ jsxs("div", { className: "mt-3 space-y-2", children: [
        /* @__PURE__ */ jsx("div", { className: "skeleton-shimmer h-4 w-3/4 rounded" }),
        /* @__PURE__ */ jsx("div", { className: "skeleton-shimmer h-3 w-1/2 rounded" })
      ] })
    ]
  }
);
const cardVariants$1 = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  })
};
const imageHoverVariants = {
  initial: { scale: 1 },
  hover: {
    scale: 1,
    transition: { duration: 0.3, ease: "easeOut" }
  }
};
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
      768: { slidesPerView: 4, spaceBetween: 12 },
      1024: { slidesPerView: 4, spaceBetween: 16 },
      1280: { slidesPerView: 5, spaceBetween: 18 },
      1536: { slidesPerView: 6, spaceBetween: 20 }
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
          /* @__PURE__ */ jsx("div", { className: "py-4", children: /* @__PURE__ */ jsx("div", { className: "grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-5 lg:gap-4 xl:grid-cols-6", children: Array.from({ length: 6 }).map((_, index) => /* @__PURE__ */ jsx(MovieCardSkeleton, { index }, index)) }) })
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
          return /* @__PURE__ */ jsx(SwiperSlide, { children: /* @__PURE__ */ jsx(
            motion.a,
            {
              href: `/phim/${slug}`,
              className: "movie-card-link group",
              custom: index,
              initial: "hidden",
              animate: "visible",
              variants: cardVariants$1,
              whileHover: "hover",
              children: /* @__PURE__ */ jsxs("div", { className: "movie-card-wrapper", children: [
                /* @__PURE__ */ jsxs("div", { className: "movie-poster-container", children: [
                  /* @__PURE__ */ jsx(
                    motion.div,
                    {
                      className: "movie-poster-inner",
                      variants: imageHoverVariants,
                      children: /* @__PURE__ */ jsx(
                        "img",
                        {
                          src: poster_url,
                          alt: `Xem ${ten_phim || ten_khac} Vietsub Thuyết Minh Full HD`,
                          className: "movie-poster-image",
                          loading: "lazy"
                        }
                      )
                    }
                  ),
                  /* @__PURE__ */ jsx("div", { className: "movie-hover-overlay", children: /* @__PURE__ */ jsx("div", { className: "movie-play-icon", children: /* @__PURE__ */ jsx("svg", { className: "h-8 w-8 lg:h-12 lg:w-12", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z", clipRule: "evenodd" }) }) }) }),
                  /* @__PURE__ */ jsxs("div", { className: "movie-tags-container", children: [
                    /* @__PURE__ */ jsx("span", { className: "movie-lang-badge", children: rutGonTinhTrangNgonNgu(ngon_ngu) }),
                    /* @__PURE__ */ jsx("span", { className: "movie-status-badge", children: rutGonTinhTrangPhim(tinh_trang) })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "movie-info-container", children: [
                  /* @__PURE__ */ jsx("h3", { className: "movie-card-title", title: ten_phim, children: ten_phim }),
                  /* @__PURE__ */ jsx("p", { className: "movie-card-subtitle", children: ten_khac })
                ] })
              ] })
            }
          ) }, movieKey);
        }) }) })
      ]
    }
  ) });
}

const MovieCardTopSkeleton = ({ index = 0 }) => /* @__PURE__ */ jsxs(
  motion.div,
  {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.3, delay: index * 0.05 },
    className: "flex flex-col",
    children: [
      /* @__PURE__ */ jsx("div", { className: "skeleton-shimmer aspect-[2/3] w-full rounded-xl" }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-x-4 py-4", children: [
        /* @__PURE__ */ jsx("div", { className: "skeleton-shimmer h-12 w-12 rounded" }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1 space-y-2", children: [
          /* @__PURE__ */ jsx("div", { className: "skeleton-shimmer h-4 w-3/4 rounded" }),
          /* @__PURE__ */ jsx("div", { className: "skeleton-shimmer h-3 w-1/2 rounded" })
        ] })
      ] })
    ]
  }
);
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
      640: { slidesPerView: 3, spaceBetween: 10 },
      768: { slidesPerView: 4, spaceBetween: 12 },
      1024: { slidesPerView: 4, spaceBetween: 16 },
      1280: { slidesPerView: 5, spaceBetween: 18 },
      1536: { slidesPerView: 6, spaceBetween: 20 }
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
          /* @__PURE__ */ jsx("div", { className: "py-4", children: /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-5 lg:gap-4 xl:grid-cols-6", children: Array.from({ length: 6 }).map((_, index) => /* @__PURE__ */ jsx(MovieCardTopSkeleton, { index }, index)) }) })
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
        /* @__PURE__ */ jsx("div", { className: "relative py-4", children: /* @__PURE__ */ jsx(Swiper, { ...commonSwiperProps, className: "movie-card-swiper", children: movies.map((movie, index) => {
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
          return /* @__PURE__ */ jsx(SwiperSlide, { children: /* @__PURE__ */ jsx(
            "a",
            {
              href: `/phim/${slug}`,
              className: "top10-card-link group",
              children: /* @__PURE__ */ jsxs("div", { className: "top10-card-wrapper", children: [
                /* @__PURE__ */ jsxs("div", { className: "top10-poster-container", style: { clipPath }, children: [
                  /* @__PURE__ */ jsx(
                    "div",
                    {
                      className: "top10-poster-inner",
                      children: /* @__PURE__ */ jsx(
                        "img",
                        {
                          src: poster_url,
                          alt: `Xem ${ten_phim || ten_khac} Vietsub Thuyết Minh Full HD`,
                          className: "top10-poster-image",
                          loading: index < 6 ? "eager" : "lazy",
                          fetchPriority: index < 3 ? "high" : "auto",
                          decoding: "async"
                        }
                      )
                    }
                  ),
                  /* @__PURE__ */ jsx("div", { className: "top10-hover-overlay", children: /* @__PURE__ */ jsx("div", { className: "movie-play-icon", children: /* @__PURE__ */ jsx("svg", { className: "h-8 w-8 lg:h-12 lg:w-12", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z", clipRule: "evenodd" }) }) }) }),
                  /* @__PURE__ */ jsxs("div", { className: "movie-tags-container", children: [
                    /* @__PURE__ */ jsx("span", { className: "movie-lang-badge", children: rutGonTinhTrangNgonNgu(ngon_ngu) }),
                    /* @__PURE__ */ jsx("span", { className: "movie-status-badge", children: rutGonTinhTrangPhim(tinh_trang) })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "movie-ranking-row", children: [
                  /* @__PURE__ */ jsx(
                    "span",
                    {
                      className: "movie-ranking-number",
                      children: index + 1
                    }
                  ),
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
              ] })
            }
          ) }, movieKey);
        }) }) })
      ]
    }
  ) });
}

const AnimeCardSkeleton = ({ index = 0 }) => /* @__PURE__ */ jsxs(
  motion.div,
  {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.3, delay: index * 0.05 },
    className: "relative",
    children: [
      /* @__PURE__ */ jsx("div", { className: "skeleton-shimmer aspect-[16/9] w-full rounded-xl" }),
      /* @__PURE__ */ jsxs("div", { className: "absolute bottom-4 left-4 right-4 space-y-2", children: [
        /* @__PURE__ */ jsx("div", { className: "skeleton-shimmer h-5 w-3/4 rounded" }),
        /* @__PURE__ */ jsx("div", { className: "skeleton-shimmer h-4 w-1/2 rounded" })
      ] })
    ]
  }
);
function AnimeCardHorizontal({ movies = [], title, loading, error }) {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const swiperRef = useRef(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  useEffect(() => {
    if (swiperRef.current && prevRef.current && nextRef.current) {
      const swiperInstance = swiperRef.current.swiper;
      swiperInstance.params.navigation.prevEl = prevRef.current;
      swiperInstance.params.navigation.nextEl = nextRef.current;
      swiperInstance.navigation.init();
      swiperInstance.navigation.update();
    }
  }, [movies.length]);
  const commonSwiperProps = {
    spaceBetween: 16,
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
      0: { slidesPerView: 1.2, spaceBetween: 12 },
      480: { slidesPerView: 1.5, spaceBetween: 14 },
      640: { slidesPerView: 2, spaceBetween: 16 },
      768: { slidesPerView: 2.5, spaceBetween: 16 },
      1024: { slidesPerView: 3, spaceBetween: 18 },
      1280: { slidesPerView: 4, spaceBetween: 20 },
      1536: { slidesPerView: 4, spaceBetween: 20 }
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
          /* @__PURE__ */ jsx("div", { className: "py-4", children: /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4", children: Array.from({ length: 4 }).map((_, index) => /* @__PURE__ */ jsx(AnimeCardSkeleton, { index }, index)) }) })
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
        /* @__PURE__ */ jsx("div", { className: "relative py-4", children: /* @__PURE__ */ jsx(Swiper, { ...commonSwiperProps, className: "anime-card-swiper", children: movies.map((movie, index) => {
          const {
            id,
            slug,
            ten_phim,
            poster_url,
            thumb_url,
            tinh_trang,
            ngon_ngu,
            ten_khac,
            nam_phat_hanh,
            thoi_luong,
            do_tuoi
          } = movie;
          const movieKey = id || slug || `movie-${index}`;
          const mainImage = thumb_url || poster_url;
          return /* @__PURE__ */ jsx(SwiperSlide, { children: /* @__PURE__ */ jsx(
            "a",
            {
              href: `/phim/${slug}`,
              className: "anime-card-link group block",
              children: /* @__PURE__ */ jsxs("div", { className: "anime-card-wrapper", children: [
                /* @__PURE__ */ jsxs("div", { className: "anime-card-image-container", children: [
                  /* @__PURE__ */ jsx(
                    "img",
                    {
                      src: mainImage,
                      alt: `Xem ${ten_phim || ten_khac} Vietsub Thuyết Minh Full HD`,
                      className: "anime-card-main-image",
                      loading: "lazy"
                    }
                  ),
                  /* @__PURE__ */ jsx("div", { className: "anime-card-gradient" }),
                  /* @__PURE__ */ jsx("div", { className: "anime-card-hover-overlay", children: /* @__PURE__ */ jsx("div", { className: "anime-play-icon", children: /* @__PURE__ */ jsx("svg", { className: "h-12 w-12 lg:h-16 lg:w-16", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z", clipRule: "evenodd" }) }) }) })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "anime-card-info-row", children: [
                  /* @__PURE__ */ jsxs("div", { className: "anime-card-thumbnail", children: [
                    /* @__PURE__ */ jsx(
                      "img",
                      {
                        src: poster_url,
                        alt: ten_phim,
                        className: "anime-card-thumbnail-img",
                        loading: "lazy"
                      }
                    ),
                    /* @__PURE__ */ jsx("span", { className: "anime-thumb-badge", children: rutGonTinhTrangNgonNgu(ngon_ngu) })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "anime-card-info", children: [
                    /* @__PURE__ */ jsx("h3", { className: "anime-card-title", title: ten_phim, children: ten_phim }),
                    /* @__PURE__ */ jsx("p", { className: "anime-card-subtitle", children: ten_khac }),
                    /* @__PURE__ */ jsxs("div", { className: "anime-card-meta", children: [
                      do_tuoi && /* @__PURE__ */ jsx("span", { className: "anime-meta-badge anime-age-badge", children: do_tuoi }),
                      nam_phat_hanh && /* @__PURE__ */ jsx("span", { className: "anime-meta-item", children: nam_phat_hanh }),
                      thoi_luong && /* @__PURE__ */ jsx("span", { className: "anime-meta-item", children: thoi_luong }),
                      tinh_trang && /* @__PURE__ */ jsx("span", { className: "anime-meta-item anime-status", children: rutGonTinhTrangPhim(tinh_trang) })
                    ] })
                  ] })
                ] })
              ] })
            }
          ) }, movieKey);
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
}, "E:/tramphim/tramphim-frontend/src/seometas/SeoHome.astro", void 0);

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
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};
const cardVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};
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
      motion.div,
      {
        className: "themes-container",
        role: "navigation",
        "aria-label": "Các chủ đề phim",
        variants: containerVariants,
        initial: "hidden",
        animate: "visible",
        children: themesToMap.map(({ ten, slug, color }, index) => /* @__PURE__ */ jsxs(
          motion.a,
          {
            href: getHref(slug),
            className: `theme-card-new ${color}`,
            variants: cardVariants,
            whileHover: {
              y: -6,
              transition: { duration: 0.3 }
            },
            whileTap: { scale: 0.98 },
            children: [
              /* @__PURE__ */ jsx("div", { className: "theme-card-overlay" }),
              /* @__PURE__ */ jsxs("div", { className: "theme-content-new", children: [
                /* @__PURE__ */ jsx("h3", { className: "theme-title-new", children: ten || viewAllTheme.name }),
                /* @__PURE__ */ jsx("div", { className: "theme-link-new", children: (ten || viewAllTheme.name) !== viewAllTheme.name ? /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
                  "Xem chủ đề",
                  /* @__PURE__ */ jsx("svg", { className: "w-3 h-3", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5l7 7-7 7" }) })
                ] }) : /* @__PURE__ */ jsxs("span", { children: [
                  "Xem tất cả (",
                  fetchedThemes.length,
                  " chủ đề)"
                ] }) })
              ] }),
              /* @__PURE__ */ jsx(
                "svg",
                {
                  className: "theme-svg-new",
                  xmlns: "http://www.w3.org/2000/svg",
                  preserveAspectRatio: "none",
                  viewBox: "0 0 1440 200",
                  children: Array.from({ length: 8 }, (_, i) => {
                    const y = 80 + i * 15;
                    const amp = 30;
                    return /* @__PURE__ */ jsx(
                      "path",
                      {
                        d: `
                      M0,${y}
                      C 360,${y - amp} 720,${y + amp} 1080,${y}
                      C 1260,${y - amp} 1440,${y + amp} 1440,${y}
                    `,
                        stroke: "rgba(255,255,255,0.15)",
                        fill: "none",
                        strokeWidth: "1.5"
                      },
                      i
                    );
                  })
                }
              )
            ]
          },
          slug || ten
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
    moviephimles,
    movieanimes
  } = homePageData;
  const loading = false;
  const error = null;
  const heroImageUrl = moviehots?.[0]?.banner_url || moviehots?.[0]?.poster_url;
  const top10PosterUrl = moviehots?.[0]?.poster_url;
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$Layout, { "data-astro-cid-j7pv25f6": true }, { "default": async ($$result2) => renderTemplate`  ${maybeRenderHead()}<div id="splash-screen" data-astro-cid-j7pv25f6></div> ${renderComponent($$result2, "Header", Header, { "client:load": true, "client:component-hydration": "load", "client:component-path": "E:/tramphim/tramphim-frontend/src/components/Header/Header", "client:component-export": "default", "data-astro-cid-j7pv25f6": true })} <div class="main-container" data-astro-cid-j7pv25f6> <h1 class="sr-only" data-astro-cid-j7pv25f6>
Trạm Phim - Phim hay tại Trạm
</h1> <div class="main-content-wrapper" data-astro-cid-j7pv25f6> <main id="main-content" class="home-main" data-astro-cid-j7pv25f6> <!-- Hero Section --> <section class="hero-wrapper" data-astro-cid-j7pv25f6> ${renderComponent($$result2, "Hero", MovieCard$2, { "client:load": true, "movies": moviehots, "loading": loading, "client:component-hydration": "load", "client:component-path": "E:/tramphim/tramphim-frontend/src/components/Hero/Hero", "client:component-export": "default", "data-astro-cid-j7pv25f6": true })} </section> <!-- Topics Section --> <section class="section-wrapper animate-section" data-astro-cid-j7pv25f6> ${renderComponent($$result2, "ChuDe", ThemeSection, { "client:idle": true, "themesData": themes, "client:component-hydration": "idle", "client:component-path": "E:/tramphim/tramphim-frontend/src/components/ToPics/ToPics.jsx", "client:component-export": "default", "data-astro-cid-j7pv25f6": true })} </section> <!-- Movie Sections --> <div class="card-column-gap" data-astro-cid-j7pv25f6> <!-- Top 10 Section with special styling --> <section class="section-wrapper animate-section top-section" data-astro-cid-j7pv25f6> ${renderComponent($$result2, "MovieCardTop", MovieCard, { "client:idle": true, "movies": moviehots, "title": "TOP 10 H\xF4m Nay", "loading": loading, "error": error, "client:component-hydration": "idle", "client:component-path": "E:/tramphim/tramphim-frontend/src/components/MovieCardHome/CardColumnTop.jsx", "client:component-export": "default", "data-astro-cid-j7pv25f6": true })} </section> <!-- Anime Section - Japanese Animation --> <section class="section-wrapper animate-section anime-section" data-astro-cid-j7pv25f6> ${renderComponent($$result2, "AnimeCardHorizontal", AnimeCardHorizontal, { "client:idle": true, "title": "Anime", "movies": movieanimes, "loading": loading, "error": error, "client:component-hydration": "idle", "client:component-path": "E:/tramphim/tramphim-frontend/src/components/MovieCardHome/CardAnimeHorizontal.jsx", "client:component-export": "default", "data-astro-cid-j7pv25f6": true })} </section> <!-- New Episodes --> <section class="section-wrapper animate-section" data-astro-cid-j7pv25f6> ${renderComponent($$result2, "MovieCardColumn", MovieCard$1, { "client:idle": true, "title": "Phim C\xF3 T\u1EADp M\u1EDBi", "movies": movieupdates, "loading": loading, "error": error, "client:component-hydration": "idle", "client:component-path": "E:/tramphim/tramphim-frontend/src/components/MovieCardHome/CardColumn.jsx", "client:component-export": "default", "data-astro-cid-j7pv25f6": true })} </section> <!-- Cinema Movies --> <section class="section-wrapper animate-section" data-astro-cid-j7pv25f6> ${renderComponent($$result2, "MovieCardColumn", MovieCard$1, { "client:idle": true, "title": "Phim Chi\u1EBFu R\u1EA1p Hot Nh\u1EA5t 2025", "movies": moviechieuraps, "loading": loading, "error": error, "client:component-hydration": "idle", "client:component-path": "E:/tramphim/tramphim-frontend/src/components/MovieCardHome/CardColumn.jsx", "client:component-export": "default", "data-astro-cid-j7pv25f6": true })} </section> <!-- Single Movies --> <section class="section-wrapper animate-section" data-astro-cid-j7pv25f6> ${renderComponent($$result2, "MovieCardColumn", MovieCard$1, { "client:visible": true, "title": "Phim L\u1EBB", "movies": moviephimles, "loading": loading, "error": error, "client:component-hydration": "visible", "client:component-path": "E:/tramphim/tramphim-frontend/src/components/MovieCardHome/CardColumn.jsx", "client:component-export": "default", "data-astro-cid-j7pv25f6": true })} </section> <!-- Series --> <section class="section-wrapper animate-section" data-astro-cid-j7pv25f6> ${renderComponent($$result2, "MovieCardColumn", MovieCard$1, { "client:visible": true, "title": "Phim B\u1ED9", "movies": moviephimbos, "loading": loading, "error": error, "client:component-hydration": "visible", "client:component-path": "E:/tramphim/tramphim-frontend/src/components/MovieCardHome/CardColumn.jsx", "client:component-export": "default", "data-astro-cid-j7pv25f6": true })} </section> </div> </main> </div> </div> <footer data-astro-cid-j7pv25f6> ${renderComponent($$result2, "Footer", null, { "client:only": "react", "client:component-hydration": "only", "data-astro-cid-j7pv25f6": true, "client:component-path": "E:/tramphim/tramphim-frontend/src/components/Footer/index", "client:component-export": "default" })} </footer> `, "head": async ($$result2) => renderTemplate`${renderComponent($$result2, "Fragment", Fragment$1, { "slot": "head" }, { "default": async ($$result3) => renderTemplate` ${renderComponent($$result3, "SeoHome", $$SeoHome, { "data-astro-cid-j7pv25f6": true })} ` })}`, "preload": async ($$result2) => renderTemplate`${renderComponent($$result2, "Fragment", Fragment$1, { "slot": "preload" }, { "default": async ($$result3) => renderTemplate`${heroImageUrl && renderTemplate`<link rel="preload" as="image"${addAttribute(heroImageUrl, "href")} fetchpriority="high">`}${top10PosterUrl && top10PosterUrl !== heroImageUrl && renderTemplate`<link rel="preload" as="image"${addAttribute(top10PosterUrl, "href")}>`}` })}` })}  ${renderScript($$result, "E:/tramphim/tramphim-frontend/src/pages/index.astro?astro&type=script&index=0&lang.ts")}`;
}, "E:/tramphim/tramphim-frontend/src/pages/index.astro", void 0);

const $$file = "E:/tramphim/tramphim-frontend/src/pages/index.astro";
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
