import React, { useRef, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import {
  rutGonTinhTrangPhim,
  rutGonTinhTrangNgonNgu,
} from "../../utils/movieUtils";

export default function MovieCard({ movies = [], title, loading, error }) {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const swiperRef = useRef(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const clipPathLeft =
    "polygon(94.239% 100%, 5.761% 100%, 5.761% 100%, 4.826% 99.95%, 3.94% 99.803%, 3.113% 99.569%, 2.358% 99.256%, 1.687% 98.87%, 1.111% 98.421%, .643% 97.915%, .294% 97.362%, .075% 96.768%, 0 96.142%, 0 3.858%, 0 3.858%, .087% 3.185%, .338% 2.552%, .737% 1.968%, 1.269% 1.442%, 1.92% .984%, 2.672% .602%, 3.512% .306%, 4.423% .105%, 5.391% .008%, 6.4% .024%, 94.879% 6.625%, 94.879% 6.625%, 95.731% 6.732%, 96.532% 6.919%, 97.272% 7.178%, 97.942% 7.503%, 98.533% 7.887%, 99.038% 8.323%, 99.445% 8.805%, 99.747% 9.326%, 99.935% 9.88%, 100% 10.459%, 100% 96.142%, 100% 96.142%, 99.925% 96.768%, 99.706% 97.362%, 99.357% 97.915%, 98.889% 98.421%, 98.313% 98.87%, 97.642% 99.256%, 96.887% 99.569%, 96.06% 99.803%, 95.174% 99.95%, 94.239% 100%)";
  const clipPathRight =
    "polygon(5.761% 100%, 94.239% 100%, 94.239% 100%, 95.174% 99.95%, 96.06% 99.803%, 96.887% 99.569%, 97.642% 99.256%, 98.313% 98.87%, 98.889% 98.421%, 99.357% 97.915%, 99.706% 97.362%, 99.925% 96.768%, 100% 96.142%, 100% 3.858%, 100% 3.858%, 99.913% 3.185%, 99.662% 2.552%, 99.263% 1.968%, 98.731% 1.442%, 98.08% .984%, 97.328% .602%, 96.488% .306%, 95.577% .105%, 94.609% .008%, 93.6% .024%, 5.121% 6.625%, 5.121% 6.625%, 4.269% 6.732%, 3.468% 6.919%, 2.728% 7.178%, 2.058% 7.503%, 1.467% 7.887%, .962% 8.323%, .555% 8.805%, .253% 9.326%, .065% 9.88%, 0% 10.459%, 0% 96.142%, 0% 96.142%, .075% 96.768%, .294% 97.362%, .643% 97.915%, 1.111% 98.421%, 1.687% 98.87%, 2.358% 99.256%, 3.113% 99.569%, 3.94% 99.803%, 4.826% 99.95%, 5.761% 100%)";

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
      nextEl: nextRef.current,
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
        <div className="loading-container">
          <p className="text-gray-400">Đang tải...</p>
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
                    className={`slider-nav-btn ${
                      isBeginning
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
                    className={`slider-nav-btn ${
                      isEnd ? "pointer-events-none opacity-50" : "opacity-100"
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
                const clipPath = index % 2 === 0 ? clipPathLeft : clipPathRight;

                return (
                  <SwiperSlide key={movieKey}>
                    <a href={`/phim/${slug}`} className="movie-card-link group">
                      <div className="movie-card-main">
                        <div
                          className="movie-poster-clip"
                          style={{
                            clipPath: clipPath,
                          }}
                        >
                          <img
                            src={poster_url}
                            alt={`Xem ${
                              ten_phim || ten_khac
                            } Vietsub Thuyết Minh Full HD`}
                            className="movie-poster-img"
                            loading="lazy"
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
                        <div className="movie-ranking-row">
                          <span className="movie-ranking-number">
                            {index + 1}
                          </span>
                          <div className="movie-details-text">
                            <h3 className="movie-title-main" title={ten_phim}>
                              {ten_phim}
                            </h3>
                            <p
                              className="movie-subtitle"
                              dangerouslySetInnerHTML={{ __html: ten_khac }}
                            ></p>
                          </div>
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
