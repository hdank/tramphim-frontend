import React, { useState, useCallback, useEffect } from "react";
import {
  rutGonTinhTrangPhim,
  rutGonTinhTrangNgonNgu,
} from "../../utils/movieUtils";

export default function CategoryMovies({
  initialData,
  initialSlug,
  baseUrl,
  initialLimit,
  tittle,
}) {
  const [movies, setMovies] = useState(initialData?.data || []);
  const [pagination, setPagination] = useState(
    initialData?.pagination || { current_page: 1, total_pages: 1 },
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [inputValue, setInputValue] = useState(
    pagination.current_page.toString(),
  );
  const [isFilterOpen, setIsFilterOpen] = useState(true);

  const initialFilters = {
    the_loai: initialSlug || initialData?.filters?.the_loai || "",
    ngon_ngu: initialData?.filters?.ngon_ngu || "",
    nam_phat_hanh: initialData?.filters?.nam_phat_hanh || "",
    sort: initialData?.filters?.sort || "ngay-tao",
    chieu_rap: initialData?.filters?.chieu_rap || "",
    loai_phim: initialData?.filters?.loai_phim || "",
  };

  const [filters, setFilters] = useState(initialFilters);

  useEffect(() => {
    const newTheLoai = initialSlug || initialData?.filters?.the_loai || "";

    setFilters((prevFilters) => {
      if (
        prevFilters.the_loai !== newTheLoai ||
        prevFilters.ngon_ngu !== (initialData?.filters?.ngon_ngu || "") ||
        prevFilters.nam_phat_hanh !==
        (initialData?.filters?.nam_phat_hanh || "") ||
        prevFilters.sort !== (initialData?.filters?.sort || "ngay-tao") ||
        prevFilters.chieu_rap !== (initialData?.filters?.chieu_rap || "") ||
        prevFilters.loai_phim !== (initialData?.filters?.loai_phim || "")
      ) {
        return {
          ...prevFilters,
          the_loai: newTheLoai,
          ngon_ngu: initialData?.filters?.ngon_ngu || "",
          nam_phat_hanh: initialData?.filters?.nam_phat_hanh || "",
          sort: initialData?.filters?.sort || "ngay-tao",
          chieu_rap: initialData?.filters?.chieu_rap || "",
          loai_phim: initialData?.filters?.loai_phim || "",
        };
      }
      return prevFilters;
    });
  }, [initialData, initialSlug]);

  const currentPage = pagination.current_page;
  const totalPages = pagination.total_pages;

  const categoryOptions = [
    { label: "Tất cả", value: "" },
    { label: "Hành Động", value: "hanh-dong" },
    { label: "Cổ Trang", value: "co-trang" },
    { label: "Viễn Tưởng", value: "vien-tuong" },
    { label: "Bí Ẩn", value: "bi-an" },
    { label: "Tâm Lý", value: "tam-ly" },
    { label: "Âm Nhạc", value: "am-nhac" },
    { label: "Phiêu Lưu", value: "phieu-luu" },
    { label: "Chính Kịch", value: "chinh-kich" },
    { label: "Khoa Học", value: "khoa-hoc" },
    { label: "Học Đường", value: "hoc-duong" },
    { label: "Võ Thuật", value: "vo-thuat" },
    { label: "Chiến Tranh", value: "chien-tranh" },
    { label: "Hình Sự", value: "hinh-su" },
    { label: "Gia Đình", value: "gia-dinh" },
    { label: "Tình Cảm", value: "tinh-cam" },
    { label: "Thần Thoại", value: "than-thoai" },
    { label: "Thể Thao", value: "the-thao" },
    { label: "Kinh Dị", value: "kinh-di" },
    { label: "Kinh Điển", value: "kinh-dien" }
  ];


  const languageOptions = [
    { label: "Tất cả", value: "" },
    { label: "Phụ Đề", value: "Vietsub" },
    { label: "Thuyết Minh", value: "Thuyết Minh" },
    { label: "P.Đề + T.Minh", value: "Vietsub + Thuyết Minh" },
  ];

  const loaiPhimOptions = [
    { label: "Tất cả", value: "" },
    { label: "Phim Lẻ", value: "phim-le" },
    { label: "Phim Bộ", value: "phim-bo" },
    { label: "Hoạt Hình", value: "hoat-hinh" },
  ];

  const releaseYearOptions = [
    { label: "Tất cả", value: "" },
    ...Array.from({ length: new Date().getFullYear() - 2000 + 1 }, (_, i) => ({
      label: `${new Date().getFullYear() - i}`,
      value: `${new Date().getFullYear() - i}`,
    })).sort((a, b) => parseInt(b.value) - parseInt(a.value)),
  ];

  const sortOptions = [
    { label: "Mới nhất", value: "ngay-tao" },
    { label: "Lượt xem", value: "luot-xem" },
    { label: "Tập mới nhất", value: "moi-cap-nhat" },
  ];

  const chieuRapOptions = [
    { label: "Tất cả", value: "" },
    { label: "Chiếu Rạp", value: "true" },
  ];

  // Hàm này tạo URL API (luôn bao gồm tất cả các filters để fetch data chính xác)
  const buildApiUrl = useCallback(
    (pageToFetch = 1) => {
      const url = new URL(`${baseUrl}/api/filter/`);
      url.searchParams.set("page", pageToFetch.toString());
      url.searchParams.set("limit", initialLimit.toString());

      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          url.searchParams.set(key, value);
        }
      });
      return url.toString();
    },
    [filters, baseUrl, initialLimit],
  );

  const fetchMovies = useCallback(
    async (pageToFetch = 1) => {
      setLoading(true);
      setError(null);
      try {
        const url = buildApiUrl(pageToFetch);
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(`Lỗi khi fetch API: ${url} - Status: ${res.status}`);
        }
        const json = await res.json();
        setMovies(json.data || []);
        setPagination(json.pagination || { current_page: 1, total_pages: 1 });
        setInputValue(json.pagination?.current_page.toString() || "1");

        // Xử lý cập nhật URL trong trình duyệt (History API)
        const newUrl = new URL(
          window.location.pathname.startsWith("/the-loai/")
            ? window.location.pathname
            : window.location.pathname,
          window.location.origin,
        );

        for (const key of Array.from(newUrl.searchParams.keys())) {
          newUrl.searchParams.delete(key);
        }

        // ⭐️ LOGIC XÓA THAM SỐ the_loai KHỎI QUERY STRING CỦA TRÌNH DUYỆT
        Object.entries(filters).forEach(([key, value]) => {
          if (value) {
            if (key === "the_loai") {
              // CHỈ thêm 'the_loai' vào Query nếu giá trị KHÔNG trùng với initialSlug.
              if (value !== initialSlug) {
                newUrl.searchParams.set(key, value);
              }
            } else {
              // Thêm tất cả các filter khác
              newUrl.searchParams.set(key, value);
            }
          }
        });

        if (pageToFetch > 1) {
          newUrl.searchParams.set("page", pageToFetch.toString());
        }

        window.history.pushState(null, "", newUrl.toString());
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Không thể tải phim. Vui lòng thử lại.");
        setMovies([]);
      } finally {
        setLoading(false);
      }
    },
    [buildApiUrl, filters, initialSlug],
  );

  const handleFilterChange = (name, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleApplyFilters = () => {
    fetchMovies(1);
  };

  const handleClearFilters = () => {
    const defaultFilters = {
      the_loai: initialSlug || "", // Giữ lại slug của trang
      ngon_ngu: "",
      nam_phat_hanh: "",
      sort: "ngay-tao",
      chieu_rap: "",
      loai_phim: "",
    };
    setFilters(defaultFilters);
    fetchMovies(1);
  };


  const handlePageChange = (pageNumber) => {
    fetchMovies(pageNumber);
  };

  const handleInputChange = (e) => {
    let value = e.target.value;
    const pageNumber = parseInt(value, 10);

    if (!isNaN(pageNumber) && pageNumber > totalPages) {
      value = totalPages.toString();
    } else if (!value || isNaN(pageNumber)) {
      setInputValue(value);
      return;
    }

    setInputValue(value);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") {
      const pageNumber = parseInt(inputValue, 10);
      let finalPageNumber;

      if (isNaN(pageNumber) || pageNumber < 1) {
        finalPageNumber = 1;
      } else if (pageNumber > totalPages) {
        finalPageNumber = totalPages;
      } else {
        finalPageNumber = pageNumber;
      }

      handlePageChange(finalPageNumber);
    }
  };

  const FilterGroup = ({ title, options, filterKey }) => (
    <div className="flex flex-col gap-2 md:grid md:grid-cols-[100px_1fr] md:gap-4 md:border-b md:border-dotted md:border-gray-800 md:pb-4 md:last:border-b-0">
      <p className="whitespace-nowrap font-semibold text-gray-200 lg:text-sm">
        {title}:
      </p>

      <div className="hide-scrollbar flex flex-row items-center gap-1 overflow-x-auto md:flex-wrap md:overflow-visible lg:gap-4">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => handleFilterChange(filterKey, option.value)}
            className={`whitespace-nowrap rounded-[4px] px-3 py-1.5 transition-colors duration-200 ${filters[filterKey] === option.value
                ? "bg-[#2f2f2f] text-sky-300"
                : "text-gray-200 hover:text-white"
              }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );

  const toggleFilter = () => {
    setIsFilterOpen((prev) => !prev);
  };

  return (
    <div>
      <div className="mb-4 flex justify-start ">
        <button
          onClick={toggleFilter}
          className="flex items-center gap-2 rounded-full bg-sky-500/80 px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:bg-sky-500"
          aria-expanded={isFilterOpen}
          aria-controls="filter-panel"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 3.5H2l8 10.5V20l4 2v-8.5l8-10.5z" />
          </svg>
          <h2>
            Bộ Lọc

          </h2>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-4 w-4 transform transition-transform duration-300 ${isFilterOpen ? "rotate-180" : ""
              }`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      <div
        id="filter-panel"
        className={`flex flex-col gap-4 transition-all duration-500 ease-in-out ${isFilterOpen
            ? "max-h-screen opacity-100"
            : "max-h-0 opacity-0 overflow-hidden"
          }`}
      >
        <div className="flex flex-col gap-4 rounded-lg border border-gray-200/20 p-4 text-xs text-white">
          <FilterGroup
            title="Loại phim"
            options={loaiPhimOptions}
            filterKey="loai_phim"
          />
          <FilterGroup
            title="Thể loại"
            options={categoryOptions}
            filterKey="the_loai"
          />
          <FilterGroup
            title="Hình thức"
            options={chieuRapOptions}
            filterKey="chieu_rap"
          />
          <FilterGroup
            title="Năm sản xuất"
            options={releaseYearOptions}
            filterKey="nam_phat_hanh"
          />
          <FilterGroup
            title="Ngôn ngữ"
            options={languageOptions}
            filterKey="ngon_ngu"
          />
          <FilterGroup title="Sắp xếp" options={sortOptions} filterKey="sort" />
          <div className="mt-4 flex justify-start gap-2">
            <button
              onClick={handleApplyFilters}
              className="rounded-full bg-sky-300 px-4 py-2 text-xs font-semibold text-black transition-all duration-300 hover:scale-105"
            >
              Tìm Kiếm
            </button>
            <button
              onClick={handleClearFilters}
              className="rounded-full bg-gray-600 px-4 py-2 text-xs font-semibold text-white transition-all duration-300 hover:scale-105"
            >
              Xóa Bộ Lọc
            </button>
          </div>
        </div>
      </div>

      {/* Phần hiển thị phim giữ nguyên */}
      <div className="mt-6">
        <div className="mb-8">
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row items-center justify-center gap-2">
              <div className="h-1 w-8 rounded-full bg-gradient-to-r from-sky-400 to-cyan-300"></div>

              <h2 className="bg-gradient-to-r from-white via-sky-100 to-cyan-100 bg-clip-text text-lg font-bold text-transparent lg:text-2xl">
                {tittle}
              </h2>
            </div>
            <div className="flex items-center justify-center">
              {totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400">
                    Trang {currentPage} / {totalPages}
                  </span>

                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="flex h-6 w-6 items-center justify-center rounded-[4px] bg-[#2f3346] text-sm text-gray-300 hover:bg-[#2f3346]/80 disabled:opacity-50"
                    aria-label="Trang trước"
                    disabled={loading || currentPage === 1}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M12.949 16.051a.999.999 0 0 1-1.414 0L5.586 10.586a1 1 0 0 1 0-1.414L11.535 3.949a.999.999 0 0 1 1.414 1.414L7.414 10l5.535 5.535a.999.999 0 0 1 0 1.414z" />
                    </svg>
                  </button>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="flex h-6 w-6 items-center justify-center rounded-[4px] bg-[#2f3346] text-sm text-gray-300 hover:bg-[#2f3346]/80 disabled:opacity-50"
                    aria-label="Trang sau"
                    disabled={loading || currentPage === totalPages}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M7.051 3.949a.999.999 0 0 1 1.414 0L14.414 9.414a1 1 0 0 1 0 1.414l-5.949 5.949a.999.999 0 0 1-1.414-1.414L12.586 10 7.051 4.465a.999.999 0 0 1 0-1.414z" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="mt-2 h-px bg-gradient-to-r from-sky-500/50 via-cyan-500/30 to-transparent"></div>
        </div>
      </div>
      {error && <div className="mt-8 text-center text-red-500">{error}</div>}

      {!loading && !error && movies.length === 0 && (
        <div className="py-20 text-center text-gray-400">
          Không tìm thấy phim nào phù hợp.
        </div>
      )}

     {loading && (
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
      )}

      {!loading && !error && movies.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-x-2 gap-y-6 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-5 lg:gap-x-4 xl:grid-cols-6">
          {movies.map((movie) => (
            <a
              key={movie.id}
              href={`/phim/${movie.slug}`}
              className="group relative flex-shrink-0"
            >
              <div className="relative aspect-[2/3] w-full overflow-hidden rounded-[4px]">
                <img
                  src={movie.poster_url}
                  alt={movie.title || movie.ten_phim}
                  className="h-full w-full rounded-[4px] object-cover"
                />

                <div className="absolute inset-0 rounded-[4px] bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="absolute bottom-2 left-2 flex flex-col gap-2 font-semibold">
                  <span className="w-fit whitespace-nowrap rounded-[4px] bg-sky-300 px-2 py-0.5 text-[10px] text-black lg:py-1 lg:text-xs">
                    {rutGonTinhTrangNgonNgu(movie.ngon_ngu)}
                  </span>
                  <span className="w-fit whitespace-nowrap rounded-[4px] bg-[linear-gradient(90deg,#e5330b_0%,#ff670b_51%,#d9a666_100%)] px-2 py-0.5 text-[10px] text-white lg:py-1 lg:text-xs">
                    {rutGonTinhTrangPhim(movie.tinh_trang)}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center gap-2 py-2">
                <h3
                  className="line-clamp-2 text-center text-xs font-normal text-white hover:text-sky-300 lg:text-sm"
                  title={movie.ten_phim}
                >
                  {movie.ten_phim}
                </h3>
                <p className="line-clamp-2 text-center text-xs font-normal text-gray-400">
                  {movie.ten_khac}
                </p>
              </div>
            </a>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <nav className="mt-8 flex items-center justify-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            className="flex h-10 w-10 items-center justify-center rounded-[4px] bg-[#2f3346] text-sm text-gray-300 hover:bg-[#2f3346]/80 disabled:opacity-70"
            aria-label="Trang trước"
            disabled={loading || currentPage === 1}
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

          <div className="flex h-10 items-center space-x-2 rounded-[4px] bg-[#2f3346] px-4 py-1 text-sm text-gray-300">
            <span>Trang</span>

            <input
              type="number"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyDown}
              className="w-10 appearance-none rounded-md border border-gray-500 bg-transparent py-1 text-center focus:outline-none"
              min="1"
              max={totalPages}
            />
            <span>/ {totalPages}</span>
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            className="flex h-10 w-10 items-center justify-center rounded-[4px] bg-[#2f3346] text-sm text-gray-300 hover:bg-[#2f3346]/80 disabled:opacity-70"
            aria-label="Trang sau"
            disabled={loading || currentPage === totalPages}
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
        </nav>
      )}
    </div>
  );
}