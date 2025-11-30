import React, { useState, useCallback, useEffect } from "react";

// Ensure HTTPS in production and provide fallback
const getBaseUrl = (url) => {
  let baseUrl = url || import.meta.env.PUBLIC_API_BASE_URL || 'https://api.tramphim.com';
  // Force HTTPS in production (when not localhost)
  if (baseUrl && !baseUrl.includes('localhost') && baseUrl.startsWith('http://')) {
    baseUrl = baseUrl.replace('http://', 'https://');
  }
  return baseUrl;
};

export default function SearchResultsWithFilter({
  initialSearchMovies = [],
  searchKeyword = "",
  initialData,
  baseUrl: baseUrlProp,
  initialLimit,
  tittle,
}) {
  const baseUrl = getBaseUrl(baseUrlProp);
  const isSearchPage = !!searchKeyword;

  const [movies, setMovies] = useState(
    isSearchPage ? initialSearchMovies : initialData?.data || [],
  );

  const [pagination, setPagination] = useState(
    isSearchPage
      ? { current_page: 1, total_pages: 1 }
      : initialData?.pagination || { current_page: 1, total_pages: 1 },
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setMovies(isSearchPage ? initialSearchMovies : initialData?.data || []);
    setPagination(
      isSearchPage
        ? { current_page: 1, total_pages: 1 }
        : initialData?.pagination || { current_page: 1, total_pages: 1 },
    );
  }, [initialSearchMovies, searchKeyword, initialData, isSearchPage]);

  const currentPage = pagination.current_page;
  const totalPages = pagination.total_pages;

  const fetchMoviesByPage = useCallback(
    async (pageToFetch = 1) => {
      setLoading(true);
      setError(null);
      try {
        let apiUrl;
        if (isSearchPage && searchKeyword) {
          apiUrl = `${baseUrl}/api/search/?q=${encodeURIComponent(
            searchKeyword,
          )}&page=${pageToFetch}&limit=${initialLimit}`;
        } else {
          apiUrl = `${baseUrl}/api/phim/?page=${pageToFetch}&limit=${initialLimit}&sort=luot-xem`;
        }

        const res = await fetch(apiUrl);
        if (!res.ok) {
          throw new Error(
            `Lỗi khi fetch API: ${apiUrl} - Status: ${res.status}`,
          );
        }
        const json = await res.json();
        setMovies(json.data || []);
        setPagination(json.pagination || { current_page: 1, total_pages: 1 });

        const newUrl = new URL(
          window.location.pathname,
          window.location.origin,
        );
        if (isSearchPage && searchKeyword) {
          newUrl.searchParams.set("q", encodeURIComponent(searchKeyword));
        }
        newUrl.searchParams.set("page", pageToFetch.toString());
        window.history.pushState(null, "", newUrl.toString());
      } catch (err) {
        setError("Không thể tải phim. Vui lòng thử lại.");
        setMovies([]);
      } finally {
        setLoading(false);
      }
    },
    [baseUrl, initialLimit, isSearchPage, searchKeyword],
  );

  const handlePageChange = (pageNumber) => {
    fetchMoviesByPage(pageNumber);
  };

  const paginationItems = [];
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, start + 4);
  for (let i = start; i <= end; i++) {
    paginationItems.push(i);
  }

  const displayTitle = isSearchPage
    ? `Kết Quả Với Từ Khóa: "${searchKeyword}"`
    : tittle || "Tuyển Tập Phim";

  return (
    <div>
      <div className="">
        <div className="flex flex-row items-center justify-between gap-8 lg:justify-start">
          <h1 className="mb-4 text-lg font-semibold lg:text-xl">
            {displayTitle}
          </h1>
        </div>
      </div>

      {error && <div className="mt-8 text-center text-red-500">{error}</div>}
      {loading && (
        <div className="mt-8 text-center text-gray-400">Đang tải phim...</div>
      )}
      {!loading && !error && movies.length === 0 && (
        <div className="mt-8 text-center text-gray-400">
          Không tìm thấy phim nào phù hợp.
        </div>
      )}

      {!loading && !error && movies.length > 0 && (
        <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-1">
          {movies.map((movie) => (
            <a
              key={movie.id}
              href={`/phim/${movie.slug}`}
              className="group flex flex-row gap-2 lg:gap-8"
            >
              <div>
                <div className="group flex flex-row gap-2 lg:gap-8">
                  <div className="relative h-36 w-24 overflow-hidden rounded-[4px] lg:h-56 lg:w-40">
                    <img
                      src={movie.poster_url}
                      alt={movie.title || movie.ten_phim}
                      className="h-full w-full rounded-[4px] object-cover"
                      fetchPriority="high"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-between px-2">
                    <div>
                      <p
                        className="line-clamp-2 text-sm font-semibold text-white hover:text-sky-300 lg:text-xl"
                        title={movie.ten_phim}
                      >
                        {movie.ten_phim}
                      </p>
                      <p className="mt-1 line-clamp-1 text-xs font-medium text-gray-400 lg:text-base">
                        {movie.ten_khac}
                      </p>
                      <p className="text-gray-20 mt-1 line-clamp-1 text-xs font-medium lg:text-sm">
                        <span className="text-[#a9a9ac]">Năm: </span>
                        {movie.nam_phat_hanh}
                      </p>
                      <p className="text-gray-20 mt-1 line-clamp-1 text-xs font-medium lg:text-sm">
                        <span className="text-[#a9a9ac]">Tình Trạng: </span>
                        {movie.tinh_trang}
                      </p>
                      <p className="text-gray-20 mt-1 line-clamp-1 text-xs font-medium lg:text-sm">
                        <span className="text-[#a9a9ac]">Chất Lượng: </span>
                        {movie.chat_luong}
                      </p>
                      {movie.dien_vien && movie.dien_vien.length > 0 && (
                        <h2 className="my-1 hidden text-[13px] font-medium text-[#a9a9ac] md:block lg:text-sm">
                          Diễn viên:
                          <span className="my-1 line-clamp-2 text-white">
                            {movie.dien_vien
                              .map((actor) => actor.ten)
                              .join(", ")}
                          </span>
                        </h2>
                      )}
                    </div>
                    <div className="mt-4">
                      <div className="inline-flex items-center rounded-full bg-sky-400 px-2 py-1 text-xs font-medium text-white transition-colors duration-300 lg:px-3 lg:py-2 lg:text-sm">
                        Xem Ngay
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <nav className="mt-8 flex flex-wrap items-center justify-center gap-2">
          {currentPage > 1 && (
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              className="flex h-8 w-8 items-center justify-center rounded-[4px] border border-gray-600 bg-[#23252b] text-sm text-gray-300 hover:bg-gray-600"
              aria-label="Trang trước"
              disabled={loading}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 20 20"
              >
                <path
                  fill="currentColor"
                  d="m2 10l8 8l1.4-1.4L5.8 11H18V9H5.8l5.6-5.6L10 2z"
                />
              </svg>
            </button>
          )}

          {paginationItems.map((p) => (
            <button
              key={p}
              onClick={() => handlePageChange(p)}
              className={`flex h-8 w-8 items-center justify-center rounded-[4px] border text-sm ${
                currentPage === p
                  ? "border-orange-400 bg-orange-500 text-white"
                  : "border-gray-600 bg-[#23252b] text-gray-300 hover:bg-gray-600"
              }`}
              disabled={loading}
            >
              {p}
            </button>
          ))}

          {currentPage < totalPages && (
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              className="flex h-8 w-8 items-center justify-center rounded-[4px] border border-gray-600 bg-[#23252b] text-sm text-gray-300 hover:bg-gray-600"
              aria-label="Trang sau"
              disabled={loading}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 20 20"
              >
                <path
                  fill="currentColor"
                  d="M8.6 3.4L14.2 9H2v2h12.2l-5.6 5.6L10 18l8-8l-8-8z"
                />
              </svg>
            </button>
          )}
        </nav>
      )}
    </div>
  );
}
