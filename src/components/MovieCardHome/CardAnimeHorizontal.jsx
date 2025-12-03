import React, { useRef, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { motion } from "framer-motion";
import "swiper/css";
import "swiper/css/navigation";
import {
  rutGonTinhTrangPhim,
  rutGonTinhTrangNgonNgu,
} from "../../utils/movieUtils";

// Skeleton component with shimmer effect
const AnimeCardSkeleton = ({ index = 0 }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3, delay: index * 0.05 }}
    className="relative"
  >
    <div className="skeleton-shimmer aspect-[16/9] w-full rounded-xl" />
    <div className="absolute bottom-4 left-4 right-4 space-y-2">
      <div className="skeleton-shimmer h-5 w-3/4 rounded" />
      <div className="skeleton-shimmer h-4 w-1/2 rounded" />
    </div>
  </motion.div>
);

// Animation variants
const cardVariants = {
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

export default function AnimeCardHorizontal({ movies = [], title, loading, error }) {
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
      0: { slidesPerView: 1.2, spaceBetween: 12 },
      480: { slidesPerView: 1.5, spaceBetween: 14 },
      640: { slidesPerView: 2, spaceBetween: 16 },
      768: { slidesPerView: 2.5, spaceBetween: 16 },
      1024: { slidesPerView: 3, spaceBetween: 18 },
      1280: { slidesPerView: 4, spaceBetween: 20 },
      1536: { slidesPerView: 4, spaceBetween: 20 },
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
        <div className="py-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <AnimeCardSkeleton key={index} index={index} />
            ))}
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
          <Swiper {...commonSwiperProps} className="anime-card-swiper">
              {movies.map((movie, index) => {
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
                  do_tuoi,
                } = movie;
                const movieKey = id || slug || `movie-${index}`;
                // Use thumb_url as main image (landscape), poster_url as small thumbnail
                const mainImage = thumb_url || poster_url;

                return (
                  <SwiperSlide key={movieKey}>
                    <a 
                      href={`/phim/${slug}`} 
                      className="anime-card-link group block"
                    >
                      <div className="anime-card-wrapper">
                        {/* Main landscape image */}
                        <div className="anime-card-image-container">
                          <img
                            src={mainImage}
                            alt={`Xem ${ten_phim || ten_khac} Vietsub Thuyết Minh Full HD`}
                            className="anime-card-main-image"
                            loading="lazy"
                          />
                          
                          {/* Gradient overlay */}
                          <div className="anime-card-gradient"></div>
                          
                          {/* Hover play overlay */}
                          <div className="anime-card-hover-overlay">
                            <div className="anime-play-icon">
                              <svg className="h-12 w-12 lg:h-16 lg:w-16" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </div>
                        </div>
                        
                        {/* Small poster thumbnail + Movie info */}
                        <div className="anime-card-info-row">
                          {/* Small poster thumbnail */}
                          <div className="anime-card-thumbnail">
                            <img
                              src={poster_url}
                              alt={ten_phim}
                              className="anime-card-thumbnail-img"
                              loading="lazy"
                            />
                            {/* Language badge on thumbnail */}
                            <span className="anime-thumb-badge">
                              {rutGonTinhTrangNgonNgu(ngon_ngu)}
                            </span>
                          </div>
                          
                          {/* Movie info */}
                          <div className="anime-card-info">
                            <h3 className="anime-card-title" title={ten_phim}>
                              {ten_phim}
                            </h3>
                            <p className="anime-card-subtitle">{ten_khac}</p>
                            
                            {/* Meta info row */}
                            <div className="anime-card-meta">
                              {do_tuoi && (
                                <span className="anime-meta-badge anime-age-badge">
                                  {do_tuoi}
                                </span>
                              )}
                              {nam_phat_hanh && (
                                <span className="anime-meta-item">{nam_phat_hanh}</span>
                              )}
                              {thoi_luong && (
                                <span className="anime-meta-item">{thoi_luong}</span>
                              )}
                              {tinh_trang && (
                                <span className="anime-meta-item anime-status">
                                  {rutGonTinhTrangPhim(tinh_trang)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                  </SwiperSlide>
                );
              })}
            </Swiper>
        </div>
      </section>
    </>
  );
}
