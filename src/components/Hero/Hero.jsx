import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import "swiper/css/thumbs";
import { Pagination, Navigation, EffectFade, Autoplay } from "swiper/modules";

import { rutGonTinhTrangPhim, cleanhtml } from "../../utils/movieUtils";

const MovieCardSkeleton = () => {
  return (
    <div className="movie-card-item movie-hero-width group animate-pulse">
      <div className="relative aspect-[16/7] w-full overflow-hidden bg-gray-700"></div>
    </div>
  );
};

export default function MovieCard({ movies = [], loading }) {
  const swiperMovies = movies.slice(0, 6);

  // --- Logic hiển thị Skeleton khi đang tải hoặc không có phim ---
  if (loading || !swiperMovies || swiperMovies.length === 0) {
    return (
      <div className="relative">
        <Swiper
          slidesPerView={1}
          navigation={{
            nextEl: ".swiper-button-next-custom",
            prevEl: ".swiper-button-prev-custom",
          }}
          modules={[Navigation, EffectFade, Autoplay, Pagination]}
          effect="fade"
          speed={300}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          pagination={{ clickable: true }}
          className="mySwiper"
          grabCursor={true}
        >
          {Array.from({ length: 3 }).map((_, index) => (
            <SwiperSlide key={index}>
              <MovieCardSkeleton />
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="swiper-button-prev-custom swiper-nav-btn-skeleton">
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </div>
        <div className="swiper-button-next-custom swiper-nav-btn-skeleton-right">
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    );
  }

  // --- Logic hiển thị Swiper với dữ liệu phim ---
  return (
    <section className="z-1 relative h-auto">
      <Swiper
        spaceBetween={8}
        loop={true}
        navigation={{
          nextEl: ".swiper-button-next-custom",
          prevEl: ".swiper-button-prev-custom",
        }}
        modules={[Navigation, Autoplay, Pagination]}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        className="mySwiper"
        grabCursor={true}
        breakpoints={{
          0: {
            slidesPerView: 1,
            spaceBetween: 8,
          },
          1028: {
            slidesPerView: 2,
            spaceBetween: 0,
          },
        }}
      >
        {swiperMovies.map((movie, index) => {
          const { id, slug, ten_phim, banner_url, tinh_trang, ten_khac } =
            movie;
          const movieKey = id || slug;
          const name = ten_phim;
          const movieLink = `/phim/${slug}`; // URL chi tiết phim

          return (
            <SwiperSlide key={movieKey}>
              {/* BỌC TOÀN BỘ CARD BẰNG THẺ <a> */}
              <a
                href={movieLink}
                aria-label={`Xem chi tiết phim ${ten_phim}`}
                title={ten_phim}
                className="movie-slide-container group block h-full w-full" // Thêm 'block w-full h-full' để thẻ a chiếm hết không gian
              >
                <div className="movie-poster-wrapper">
                  <img
                    src={banner_url}
                    alt={`Poster phim ${name}`}
                    className="movie-poster-img"
                    fetchPriority="high"
                  />
                </div>

                <div className="movie-info-overlay">
                  <div className="w-full">
                    {/* BỎ THẺ <a> BỌC TIÊU ĐỀ, CHỈ GIỮ THẺ <h2> */}
                    <h2 className="movie-title">{ten_phim}</h2>

                    <div className="movie-tags-group">
                      <div className="movie-tags-row">
                        <span
                          className="movie-status-tag"
                          aria-label={`Thứ tự: ${index + 1}`}
                        >
                          {rutGonTinhTrangPhim(tinh_trang)}
                        </span>

                        <p
                          className="movie-alt-name-tag"
                          aria-label={`Tên khác: ${cleanhtml(ten_khac)}`}
                        >
                          {cleanhtml(ten_khac)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </a>
              {/* KẾT THÚC THẺ <a> */}
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* Các nút điều hướng Swiper */}
      <div className="swiper-button-prev-custom swiper-nav-btn-left">
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </div>
      <div className="swiper-button-next-custom swiper-nav-btn-right">
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </section>
  );
}
