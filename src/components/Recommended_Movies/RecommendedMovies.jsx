import React, { useState, useEffect } from "react";
import lozad from "lozad";
import {
  rutGonTinhTrangPhim,
  rutGonTinhTrangNgonNgu,
} from "../../utils/movieUtils";

export default function MovieCard({ movies = [], title, loading, error }) {
  // Thêm state để theo dõi kích thước màn hình
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Hàm cập nhật trạng thái mobile
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640); // 640px là breakpoint 'sm' của Tailwind
    };

    // Gọi hàm khi component được mount lần đầu
    handleResize();

    // Thêm event listener cho sự kiện thay đổi kích thước màn hình
    window.addEventListener("resize", handleResize);

    // Dọn dẹp event listener khi component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const observer = lozad(".lozad", {
      loaded: function (el) {
        el.classList.add("loaded");
      },
    });
    observer.observe();
  }, [movies]);

  if (!loading && (error || !movies || movies.length === 0)) {
    return (
      <section
        className="relative h-auto pt-2"
        aria-label={`${title.replace(/\s+/g, "-")}-heading`}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2
            id={`${title.replace(/\s+/g, "-")}-heading`}
            className="text-lg font-bold text-white lg:text-2xl"
          >
            {title}
          </h2>
        </div>
        <div className="flex min-h-[200px] flex-col items-center justify-center p-8 text-center text-gray-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mb-4 h-16 w-16 text-gray-600"
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
          <p className="mb-2 text-lg font-semibold text-white">
            Rất tiếc, không tìm thấy phim nào.
          </p>
          <p className="text-sm text-gray-400">
            Vui lòng thử lại sau hoặc kiểm tra kết nối mạng của bạn.
          </p>
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <section
        className="relative h-auto pt-2"
        aria-label={`${title.replace(/\s+/g, "-")}-heading`}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2
            id={`${title.replace(/\s+/g, "-")}-heading`}
            className="py-4 text-lg font-semibold lg:text-xl"
          >
            {title}
          </h2>
        </div>
        <div className="flex items-center justify-center p-8">
          <p className="text-gray-400">Đang tải...</p>
        </div>
      </section>
    );
  }

  // Sử dụng slice() chỉ khi ở trên mobile
  const moviesToDisplay = isMobile ? movies.slice(0, 6) : movies;

  return (
    <>
      <section
        className="relative h-auto"
        aria-label={`${title.replace(/\s+/g, "-")}-heading`}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2
            id={`${title.replace(/\s+/g, "-")}-heading`}
            className="py-4 text-lg font-semibold lg:text-xl"
          >
            {title}
          </h2>
        </div>
        {/* Giữ nguyên cấu trúc grid cũ */}
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-3 md:grid-cols-5 md:gap-4 lg:grid-cols-5">
          {moviesToDisplay.map((movie, index) => {
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
              <div key={movieKey}>
                <a
                  href={`/phim/${slug}`}
                  className="group relative block h-full"
                >
                  <div className="relative h-full">
                    <div className="relative aspect-[2/3] w-full overflow-hidden rounded-md">
                      <img
                        data-src={poster_url}
                        alt={`Poster phim ${ten_phim || ten_khac}`}
                        className="h-full w-full object-cover lozad"
                      />
                      <div
                        className="absolute bottom-0 left-0 h-[40%] w-full rounded-b-[4px]"
                        style={{
                          background:
                            "linear-gradient(to top,rgba(0,0,0,0.7) 10%, transparent 100%)",
                        }}
                        aria-hidden="true"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      <div className="absolute bottom-2 left-2 flex flex-col gap-2 font-semibold">
                        <span className="w-fit whitespace-nowrap rounded-[4px] bg-sky-300 px-2 py-0.5 text-[10px] text-black lg:py-1 lg:text-xs">
                          {rutGonTinhTrangNgonNgu(ngon_ngu)}
                        </span>
                        <span className="w-fit whitespace-nowrap rounded-[4px] bg-[linear-gradient(90deg,#e5330b_0%,#ff670b_51%,#d9a666_100%)] px-2 py-0.5 text-[10px] text-white lg:py-1 lg:text-xs">
                          {rutGonTinhTrangPhim(tinh_trang)}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-start justify-center gap-1 py-4">
                      <h3
                        className="line-clamp-2 text-start text-[13px] font-normal text-white hover:text-sky-300 lg:text-sm"
                        title={ten_phim}
                      >
                        {ten_phim}
                      </h3>
                      <p className="line-clamp-1 text-start text-xs font-normal text-gray-400 lg:text-[13px]">
                        {ten_khac}
                      </p>
                    </div>
                  </div>
                </a>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
