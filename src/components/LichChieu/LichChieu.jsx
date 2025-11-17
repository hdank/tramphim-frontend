export default function MovieCard({ movies = [], title, loading, error }) {
  if (loading) {
    return (
      <section
        className="relative h-auto px-4 pt-4"
        aria-label={`${title.replace(/\s+/g, "-")}-heading`}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2
            id={`${title.replace(/\s+/g, "-")}-heading`}
            className="text-xl font-bold text-white lg:text-3xl"
          >
            {title}
          </h2>
        </div>
        <div className="flex items-center justify-center p-12">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-sky-400 border-t-transparent"></div>
            <p className="font-medium text-gray-300">Đang tải phim...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error || !movies || movies.length === 0) {
    return (
      <section
        className="relative h-auto py-4"
        aria-label={`${title.replace(/\s+/g, "-")}-heading`}
      >
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-3">
            <div className="h-1 w-8 rounded-full bg-gradient-to-r from-sky-400 to-cyan-300"></div>
            <h2
              id={`${title.replace(/\s+/g, "-")}-heading`}
              className="bg-gradient-to-r from-white via-sky-100 to-cyan-100 bg-clip-text text-lg font-bold text-transparent lg:text-2xl"
            >
              {title}
            </h2>
          </div>
          <div className="h-px bg-gradient-to-r from-sky-500/50 via-cyan-500/30 to-transparent"></div>
        </div>
        <div className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-gray-700/50 bg-gradient-to-br from-gray-900/50 to-gray-800/50 p-8 text-center backdrop-blur-sm">
          <div className="mb-6 rounded-full bg-gradient-to-br from-red-500/20 to-orange-500/20 p-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-orange-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z"
              />
            </svg>
          </div>
          <h3 className="mb-3 text-xl font-bold text-white">
            Không tìm thấy phim nào
          </h3>
          <p className="max-w-md leading-relaxed text-gray-400">
            Lịch Chiếu Chưa Cập Nhật
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      className="relative h-auto py-4"
      aria-label={`${title.replace(/\s+/g, "-")}-heading`}
    >
      {/* Header với gradient đẹp */}
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-3">
          <div className="h-1 w-8 rounded-full bg-gradient-to-r from-sky-400 to-cyan-300"></div>
          <h2
            id={`${title.replace(/\s+/g, "-")}-heading`}
            className="bg-gradient-to-r from-white via-sky-100 to-cyan-100 bg-clip-text text-lg font-bold text-transparent lg:text-2xl"
          >
            {title}
          </h2>
        </div>
        <div className="h-px bg-gradient-to-r from-sky-500/50 via-cyan-500/30 to-transparent"></div>
      </div>

      {/* Grid phim đơn giản - 2 phim mỗi hàng */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {movies.map((movie, index) => {
          const {
            id,
            slug,
            ten_phim,
            poster_url,
            tinh_trang,
            ten_khac,
            lich_chieu,
          } = movie;
          const movieKey = id || slug || `movie-${index}`;
          const gioChieu =
            lich_chieu && lich_chieu.length > 0 ? lich_chieu[0].gio_chieu : "";

          return (
            <div key={movieKey}>
              <a
                href={`/phim/${slug}`}
                className="flex items-center gap-4 rounded-[4px] bg-gray-800/70 p-4 transition-colors duration-200 hover:border-sky-500 hover:bg-gray-800"
              >
                {/* Poster đơn giản */}
                <div className="flex-shrink-0">
                  <div className="h-20 w-20 overflow-hidden rounded-full border border-gray-600">
                    <img
                      src={poster_url}
                      alt={`Xem ${ten_phim || ten_khac} Vietsub Thuyết Minh Full HD`}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>

                {/* Thông tin phim */}
                <div className="flex min-w-0 flex-grow flex-col justify-center gap-2">
                  {/* Tên phim */}
                  <h3
                    className="line-clamp-2 text-base font-semibold leading-snug text-white hover:text-sky-300"
                    title={ten_phim}
                  >
                    {ten_phim}
                  </h3>

                  <div className="flex flex-col gap-1 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">Tập mới nhất:</span>
                      <span className="font-medium text-orange-400">
                        {tinh_trang || "Đang cập nhật"}
                      </span>
                    </div>
                    {/* {gioChieu && (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">Giờ chiếu:</span>
                        <span className="font-medium text-sky-400">
                          {gioChieu}
                        </span>
                      </div>
                    )} */}
                  </div>
                </div>
              </a>
            </div>
          );
        })}
      </div>
    </section>
  );
}
