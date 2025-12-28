import React, { useRef, useState, useEffect, useCallback } from "react";
import lozad from "lozad";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import {
  rutGonTinhTrangPhim,
  rutGonTinhTrangNgonNgu,
} from "../../utils/movieUtils";

const BASE_URL = import.meta.env.PUBLIC_API_BASE_URL;

function buildApiUrl(category) {
  return `${BASE_URL}/api/filter/?page=1&limit=18&loai_phim=${category}&sort=luot-xem`;
}

async function fetchPhimData(category) {
  const API_URL = buildApiUrl(category);
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  return data.data || [];
}

export default function MovieCardPhimLe({ title, category = "category" }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const swiperRef = useRef(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    async function loadDataWithDelay() {
      setLoading(true);
      setError(null);

      const fetchPromise = fetchPhimData(category);
      const delayPromise = new Promise((resolve) => setTimeout(resolve, 1000));

      try {
        const [data] = await Promise.all([fetchPromise, delayPromise]);
        setMovies(data);
      } catch (e) {
        console.error("Failed to fetch movie data:", e);
        setError(e);
      } finally {
        setLoading(false);
      }
    }

    if (category) {
      loadDataWithDelay();
    } else {
      setLoading(false);
      setError(new Error("Missing category prop for data fetching."));
    }

  }, [category]);

  useEffect(() => {
    if (movies.length > 0) {
      const observer = lozad(".lozad", {
        loaded: function (el) {
          el.classList.add("loaded");
        },
      });
      observer.observe();
    }
  }, [movies]);

  const commonSwiperProps = {
    spaceBetween: 10,
    modules: [Navigation],

    onBeforeInit: (swiper) => {
      if (prevRef.current && nextRef.current) {
        swiper.params.navigation.prevEl = prevRef.current;
        swiper.params.navigation.nextEl = nextRef.current;
      }
    },
    onSwiper: (swiper) => {
      swiperRef.current = { swiper };
      swiper.navigation.init();
      swiper.navigation.update();
      setIsBeginning(swiper.isBeginning);
      setIsEnd(swiper.isEnd);

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
      1280: { slidesPerView: 6, spaceBetween: 16 },
    },
  };

  if (!loading && (error || !movies || movies.length === 0)) {
    return (
      <section
        className="section-container"
        aria-label={`${title.replace(/\s+/g, "-")}-heading`}
      >
        <div className="header-wrapper">
          <div className="header-group">
            <div className="header-divider-dot"></div>
            <h2
              id={`${title.replace(/\s+/g, "-")}-heading`}
              className="header-title"
            >
              {title}
            </h2>
          </div>
          <div className="header-divider-line"></div>
        </div>
        <div className="error-container">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="error-icon"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="error-message-title">
            Rất tiếc, không tìm thấy phim nào.
          </p>
          <p className="error-message-detail">
            Vui lòng thử lại sau hoặc kiểm tra kết nối mạng của bạn.
          </p>
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <section
        className="section-container"
        aria-label={`${title.replace(/\s+/g, "-")}-heading`}
      >
        <div className="header-wrapper">
          <div className="header-group">
            <div className="header-divider-dot"></div>
            <h2
              id={`${title.replace(/\s+/g, "-")}-heading`}
              className="header-title"
            >
              {title}
            </h2>
          </div>
          <div className="header-divider-line"></div>
        </div>

        <div className="relative py-4">
          <div className="loading-container flex h-[20rem] w-full items-center justify-center">
            <svg width="60" height="30" viewBox="0 0 100 50">
              <line
                x1="10"
                y1="25"
                x2="10"
                y2="25"
                stroke="#60A5FA"
                strokeWidth="4"
                strokeLinecap="round"
              >
                <animate
                  attributeName="y1"
                  values="25;10;25"
                  dur="1s"
                  begin="0s"
                  repeatCount="indefinite"
                ></animate>
                <animate
                  attributeName="y2"
                  values="25;40;25"
                  dur="1s"
                  begin="0s"
                  repeatCount="indefinite"
                ></animate>
              </line>
              <line
                x1="30"
                y1="25"
                x2="30"
                y2="25"
                stroke="#60A5FA"
                strokeWidth="4"
                strokeLinecap="round"
              >
                <animate
                  attributeName="y1"
                  values="25;10;25"
                  dur="1s"
                  begin="0.2s"
                  repeatCount="indefinite"
                ></animate>
                <animate
                  attributeName="y2"
                  values="25;40;25"
                  dur="1s"
                  begin="0.2s"
                  repeatCount="indefinite"
                ></animate>
              </line>
              <line
                x1="50"
                y1="25"
                x2="50"
                y2="25"
                stroke="#60A5FA"
                strokeWidth="4"
                strokeLinecap="round"
              >
                <animate
                  attributeName="y1"
                  values="25;10;25"
                  dur="1s"
                  begin="0.4s"
                  repeatCount="indefinite"
                ></animate>
                <animate
                  attributeName="y2"
                  values="25;40;25"
                  dur="1s"
                  begin="0.4s"
                  repeatCount="indefinite"
                ></animate>
              </line>
              <line
                x1="70"
                y1="25"
                x2="70"
                y2="25"
                stroke="#60A5FA"
                strokeWidth="4"
                strokeLinecap="round"
              >
                <animate
                  attributeName="y1"
                  values="25;10;25"
                  dur="1s"
                  begin="0.6000000000000001s"
                  repeatCount="indefinite"
                ></animate>
                <animate
                  attributeName="y2"
                  values="25;40;25"
                  dur="1s"
                  begin="0.6000000000000001s"
                  repeatCount="indefinite"
                ></animate>
              </line>
              <line
                x1="90"
                y1="25"
                x2="90"
                y2="25"
                stroke="#60A5FA"
                strokeWidth="4"
                strokeLinecap="round"
              >
                <animate
                  attributeName="y1"
                  values="25;10;25"
                  dur="1s"
                  begin="0.8s"
                  repeatCount="indefinite"
                ></animate>
                <animate
                  attributeName="y2"
                  values="25;40;25"
                  dur="1s"
                  begin="0.8s"
                  repeatCount="indefinite"
                ></animate>
              </line>
            </svg>
          </div>
        </div>
      </section>
    );
  }


  return (
    <>
      <section
        className="relative h-auto"
        aria-label={`${title.replace(/\s+/g, "-")}-heading`}
      >
        <div className="flex items-center justify-between">
          <div className="w-full">
            <div className="flex flex-row items-center justify-between">
              <div className="flex flex-row items-center justify-center gap-2">
                <div className="header-divider-dot"></div>
                <h2
                  id={`${title.replace(/\s+/g, "-")}-heading`}
                  className="header-title"
                >
                  {title}
                </h2>
              </div>

              <div className="flex items-center justify-center">
                <div className="slider-controls-group">
                  <button
                    ref={prevRef}
                    className={`slider-nav-btn ${isBeginning
                      ? "pointer-events-none opacity-50"
                      : "opacity-100"
                      }`}
                    aria-label="Cuộn trái"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M10.3335 12.6667L5.66683 8.00004L10.3335 3.33337" />
                    </svg>
                  </button>

                  <button
                    ref={nextRef}
                    className={`slider-nav-btn ${isEnd ? "pointer-events-none opacity-50" : "opacity-100"
                      }`}
                    aria-label="Cuộn phải"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5.66675 3.33341L10.3334 8.00008L5.66675 12.6667" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-1 h-px flex-1 bg-gradient-to-r from-sky-500/50 via-cyan-500/30 to-transparent"></div>
          </div>
        </div>

        <div className="relative py-4">
          {isMounted && (
            <Swiper {...commonSwiperProps} className="movie-card-swiper">
              {movies.map((movie, index) => {
                const {
                  id,
                  slug,
                  ten_phim,
                  poster_url,
                  tinh_trang,
                  ngon_ngu,
                  ten_khac,
                } = movie;
                const movieKey = id || slug || `movie-${index}`;

                return (
                  <SwiperSlide key={movieKey}>
                    <a href={`/phim/${slug}`} className="movie-card-link group">
                      <div className="movie-card-main">
                        <div className="movie-poster-clip">
                          <img
                            data-src={poster_url}
                            alt={`Xem ${ten_phim || ten_khac
                              } Vietsub Thuyết Minh Full HD`}
                            className="movie-poster-img lozad"
                          />
                          <div className="movie-info-bottom">
                            <span className="movie-lang-tag">
                              {rutGonTinhTrangNgonNgu(ngon_ngu)}
                            </span>
                            <span className="movie-status-tag-alt">
                              {rutGonTinhTrangPhim(tinh_trang)}
                            </span>
                          </div>
                        </div>
                        <div className="movie-details-text-day">
                          <h3 className="movie-title-main-day" title={ten_phim}>
                            {ten_phim}
                          </h3>
                          <p className="movie-subtitle-day">{ten_khac}</p>
                        </div>
                      </div>
                    </a>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          )}
        </div>
      </section>
    </>
  );
}