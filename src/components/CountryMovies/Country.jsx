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
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [inputValue, setInputValue] = useState(
    pagination.current_page.toString(),
  );

  const movieTypeOptions = [
    { label: "Tất cả", value: "" },
    { label: "Phim Lẻ", value: "phim-le" },
    { label: "Phim Bộ", value: "phim-bo" },
    { label: "Hoạt Hình", value: "hoat-hinh" },
  ];

  const countryOptions = [
    { label: "Tất cả", value: "" },
    { label: "Việt Nam", value: "viet-nam" },
    { label: "Hàn Quốc", value: "han-quoc" },
    { label: "Mỹ", value: "my" },
    { label: "Trung Quốc", value: "trung-quoc" },
    { label: "Nhật Bản", value: "nhat-ban" },
    { label: "Thái Lan", value: "thai-lan" },
    { label: "Hồng Kông", value: "hong-kong" },
    { label: "Đài Loan", value: "dai-loan" },
    { label: "Ấn Độ", value: "an-do" },
    { label: "Anh", value: "anh" },
    { label: "Pháp", value: "phap" },
    { label: "Canada", value: "canada" },
    { label: "Đức", value: "duc" },
    { label: "Tây Ban Nha", value: "tay-ban-nha" },
    { label: "Úc", value: "uc" },
    { label: "Thổ Nhĩ Kỳ", value: "tho-nhi-ky" },
    { label: "Khác", value: "quoc-gia-khac" },
  ];

  const categoryOptions = [
    { label: "Tất cả", value: "" },
    { label: "Cổ Trang", value: "co-trang" },
    { label: "Hành Động", value: "hanh-dong" },
    { label: "Học Đường", value: "hoc-duong" },
    { label: "Kinh Dị", value: "kinh-di" },
    { label: "Tâm Lý", value: "tam-ly" },
    { label: "Viễn Tưởng", value: "vien-tuong" },
    { label: "Phiêu Lưu", value: "phieu-luu" },
    { label: "Tình Cảm", value: "tinh-cam" },
    { label: "Hình Sự", value: "hinh-su" },
    { label: "Võ Thuật", value: "vo-thuat" },
    { label: "Hoạt Hình", value: "hoat-hinh" },
    { label: "Tài Liệu", value: "tai-lieu" },
    { label: "Khoa Học", value: "khoa-hoc" },
    { label: "Chiến Tranh", value: "chien-tranh" },
    { label: "Thần Thoại", value: "than-thoai" },
    { label: "Âm Nhạc", value: "am-nhac" },
    { label: "Gia Đình", value: "gia-dinh" },
    { label: "Thể Thao", value: "the-thao" },
    { label: "Bí Ẩn", value: "bi-an" },
    { label: "Lịch Sử", value: "lich-su" },
  ];

  const statusOptions = [
    { label: "Tất cả", value: "" },
    { label: "Hoàn Thành", value: "hoan-thanh" },
    { label: "Đang Cập Nhật", value: "dang-cap-nhat" },
  ];

  const languageOptions = [
    { label: "Tất cả", value: "" },
    { label: "Phụ Đề", value: "Vietsub" },
    { label: "Thuyết Minh", value: "Thuyetminh" },
    { label: "P.Đề+ T.Minh", value: "Vietsub + Thuyết Minh" },
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
  ];

  const getSlugFromDisplayName = (displayName, options) => {
    const option = options.find((opt) => opt.label === displayName);
    return option ? option.value : "";
  };

  const [filters, setFilters] = useState(() => {
    const initialQuocGia = initialData?.filters?.quoc_gia
      ? getSlugFromDisplayName(initialData.filters.quoc_gia, countryOptions)
      : initialSlug || "";

    const initialLoaiPhim = initialData?.filters?.loai_phim
      ? getSlugFromDisplayName(initialData.filters.loai_phim, movieTypeOptions)
      : "";

    return {
      quoc_gia: initialQuocGia,
      the_loai: initialData?.filters?.the_loai || "",
      loai_phim: initialLoaiPhim,
      tinh_trang: initialData?.filters?.tinh_trang || "",
      ngon_ngu: initialData?.filters?.ngon_ngu || "",
      nam_phat_hanh: initialData?.filters?.nam_phat_hanh || "",
      sort: initialData?.filters?.sort || "ngay-tao",
      chieu_rap: initialData?.filters?.chieu_rap || "",
    };
  });

  useEffect(() => {
    setFilters((prevFilters) => {
      const newQuocGia = initialData?.filters?.quoc_gia
        ? getSlugFromDisplayName(initialData.filters.quoc_gia, countryOptions)
        : initialSlug || "";
      const newLoaiPhim = initialData?.filters?.loai_phim
        ? getSlugFromDisplayName(
            initialData.filters.loai_phim,
            movieTypeOptions,
          )
        : "";

      if (
        prevFilters.quoc_gia !== newQuocGia ||
        prevFilters.loai_phim !== newLoaiPhim ||
        prevFilters.the_loai !== (initialData?.filters?.the_loai || "") ||
        prevFilters.tinh_trang !== (initialData?.filters?.tinh_trang || "") ||
        prevFilters.ngon_ngu !== (initialData?.filters?.ngon_ngu || "") ||
        prevFilters.nam_phat_hanh !==
          (initialData?.filters?.nam_phat_hanh || "") ||
        prevFilters.sort !== (initialData?.filters?.sort || "ngay-tao")
      ) {
        return {
          ...prevFilters,
          quoc_gia: newQuocGia,
          the_loai: initialData?.filters?.the_loai || "",
          loai_phim: newLoaiPhim,
          tinh_trang: initialData?.filters?.tinh_trang || "",
          ngon_ngu: initialData?.filters?.ngon_ngu || "",
          nam_phat_hanh: initialData?.filters?.nam_phat_hanh || "",
          sort: initialData?.filters?.sort || "ngay-tao",
          chieu_rap: initialData?.filters?.chieu_rap || "",
        };
      }
      return prevFilters;
    });
  }, [initialData, initialSlug]);

  const currentPage = pagination.current_page;
  const totalPages = pagination.total_pages;

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

        const newUrl = new URL(
          window.location.pathname.startsWith("/quoc-gia/")
            ? window.location.pathname
            : window.location.pathname,
          window.location.origin,
        );

        for (const key of Array.from(newUrl.searchParams.keys())) {
          newUrl.searchParams.delete(key);
        }

        Object.entries(filters).forEach(([key, value]) => {
          if (value) {
            newUrl.searchParams.set(key, value);
          }
        });
        newUrl.searchParams.set("page", pageToFetch.toString());

        window.history.pushState(null, "", newUrl.toString());
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Không thể tải phim. Vui lòng thử lại.");
        setMovies([]);
      } finally {
        setLoading(false);
      }
    },
    [buildApiUrl, filters],
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

  const handlePageChange = (pageNumber) => {
    fetchMovies(pageNumber);
  };

  const handleInputChange = (e) => {
    let value = e.target.value;
    const pageNumber = parseInt(value, 10);

    if (!isNaN(pageNumber) && pageNumber > totalPages) {
      value = totalPages.toString();
    } else if (!value || isNaN(pageNumber)) {
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
    <div className="grid grid-cols-[80px_1fr] gap-4 border-b border-dotted border-gray-800 pb-4 last:border-b-0">
      <p className="whitespace-nowrap font-semibold text-gray-200 lg:text-sm">
        {title}:
      </p>

      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => handleFilterChange(filterKey, option.value)}
            className={`rounded-lg px-3 py-1.5 transition-colors duration-200 ${
              filters[filterKey] === option.value
                ? "border border-gray-700 text-[#ffd875]"
                : "text-gray-200 hover:text-white"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div>
      <div className="">
        <div className="flex flex-row items-center justify-between gap-16 lg:justify-start">
          <h1 className="text-lg font-semibold lg:text-2xl">
            Tuyển Tập {tittle}
          </h1>
          <button
            onClick={() => setIsFilterExpanded(!isFilterExpanded)}
            className="flex items-center gap-1 transition-all"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
              className={`leading-none transition-colors duration-300 ${
                isFilterExpanded ? "text-[#ffd875]" : "text-white"
              }`}
            >
              <path d="M19 6H5c-1.1 0-1.4.6-.6 1.4l4.2 4.2c.8.8 1.4 2.3 1.4 3.4v5l4-2v-3.5c0-.8.6-2.1 1.4-2.9l4.2-4.2c.8-.8.5-1.4-.6-1.4" />
            </svg>
            <span className="text-base font-medium leading-none text-white">
              Bộ lọc
            </span>
          </button>
        </div>

        {isFilterExpanded && (
          <div className="mt-4 flex flex-col gap-4 rounded-lg border border-gray-200/20 p-4 text-xs text-white">
            <FilterGroup
              title="Loại phim"
              options={movieTypeOptions}
              filterKey="loai_phim"
            />
            <FilterGroup
              title="Thể loại"
              options={categoryOptions}
              filterKey="the_loai"
            />
            <FilterGroup
              title="Quốc gia"
              options={countryOptions}
              filterKey="quoc_gia"
            />
            <FilterGroup
              title="Tình trạng"
              options={statusOptions}
              filterKey="tinh_trang"
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
            <FilterGroup
              title="Sắp xếp"
              options={sortOptions}
              filterKey="sort"
            />
            <div className="mt-4 flex justify-start gap-2">
              <button
                onClick={handleApplyFilters}
                className="rounded-full bg-[#ffd875] px-4 py-2 text-xs font-semibold text-black"
              >
                Tìm Kiếm
              </button>
              <button
                onClick={() => setIsFilterExpanded(false)}
                className="rounded-full border border-white px-4 py-2 text-xs font-semibold text-white"
              >
                Đóng
              </button>
            </div>
          </div>
        )}
      </div>

      {error && <div className="mt-8 text-center text-red-500">{error}</div>}
      {!loading && !error && movies.length === 0 && (
        <div className="mt-8 text-center text-gray-400">
          Không tìm thấy phim nào phù hợp.
        </div>
      )}
      {loading && (
        <div className="mt-8 text-center text-gray-400">Đang tải phim...</div>
      )}

      {!loading && !error && movies.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
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
                  fetchPriority="high"
                />

                <div className="absolute inset-0 rounded-[4px] bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="absolute bottom-1 left-2 z-20 flex flex-col items-start gap-1 text-[10px] font-medium text-white lg:bottom-0 lg:left-1/2 lg:-translate-x-1/2 lg:flex-row lg:items-center lg:gap-0 lg:text-xs">
                  <span className="whitespace-nowrap rounded-lg bg-[#5e6070] px-2 py-0.5 text-white lg:rounded-none lg:rounded-tl-[4px] lg:py-1">
                    {rutGonTinhTrangPhim(movie.tinh_trang)}
                  </span>
                  <span className="whitespace-nowrap rounded-lg bg-[#2ca35d] px-2 py-0.5 text-white lg:rounded-none lg:rounded-tr-[4px] lg:py-1">
                    {rutGonTinhTrangNgonNgu(movie.ngon_ngu)}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center gap-2 py-2">
                <h3
                  className="line-clamp-2 text-center text-xs font-normal text-white hover:text-[#ffd875] lg:text-sm"
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
          {/* Previous page button */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-[#2f3346] text-sm text-gray-300 hover:bg-[#2f3346]/80 disabled:opacity-70"
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

          <div className="flex items-center space-x-2 rounded-full bg-[#2f3346] px-4 py-3 text-sm text-gray-300">
            <span>Trang</span>
            <input
              type="number"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyDown}
              className="w-14 appearance-none rounded-md border border-gray-500 bg-transparent py-1 text-center focus:outline-none"
              min="1"
              max={totalPages}
            />
            <span>/ {totalPages}</span>
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-[#2f3346] py-4 text-sm text-gray-300 hover:bg-[#2f3346]/80 disabled:opacity-70"
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
