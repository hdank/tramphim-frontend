/* empty css                                     */
import { e as createComponent, f as createAstro, l as renderComponent, r as renderTemplate, n as Fragment, m as maybeRenderHead } from '../../chunks/astro/server_BuMcwEkM.mjs';
import 'kleur/colors';
import { $ as $$Layout, H as Header, F as Footer } from '../../chunks/index_BCmV18BO.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useEffect, useCallback } from 'react';
import { r as rutGonTinhTrangNgonNgu, a as rutGonTinhTrangPhim } from '../../chunks/movieUtils_BzNI1rrt.mjs';
import { $ as $$SeoLoaiPhim } from '../../chunks/SeoLoaiPhim_B7VOEysJ.mjs';
export { renderers } from '../../renderers.mjs';

function CategoryMovies({
  initialData,
  initialSlug,
  baseUrl,
  initialLimit,
  tittle
}) {
  const [movies, setMovies] = useState(initialData?.data || []);
  const [pagination, setPagination] = useState(
    initialData?.pagination || { current_page: 1, total_pages: 1 }
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [inputValue, setInputValue] = useState(
    pagination.current_page.toString()
  );
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const loaiPhimOptions = [
    { label: "Tất cả", value: "" },
    { label: "Phim Lẻ", value: "phim-le" },
    { label: "Phim Bộ", value: "phim-bo" },
    { label: "Hoạt Hình", value: "hoat-hinh" }
  ];
  const chieuRapOptions = [
    { label: "Tất cả", value: "" },
    { label: "Chiếu Rạp", value: "true" }
  ];
  const getInitialLoaiPhim = (slug) => {
    const validLoaiPhimSlugs = ["phim-le", "phim-bo", "hoat-hinh"];
    return validLoaiPhimSlugs.includes(slug) ? slug : "";
  };
  const getInitialChieuRap = (slug) => {
    return slug === "phim-chieu-rap" ? "true" : "";
  };
  const [filters, setFilters] = useState(() => {
    const defaultLoaiPhim = getInitialLoaiPhim(initialSlug);
    const defaultChieuRap = getInitialChieuRap(initialSlug);
    return {
      the_loai: initialData?.filters?.the_loai || "",
      ngon_ngu: initialData?.filters?.ngon_ngu || "",
      nam_phat_hanh: initialData?.filters?.nam_phat_hanh || "",
      sort: initialData?.filters?.sort || "ngay-tao",
      loai_phim: initialData?.filters?.loai_phim || defaultLoaiPhim,
      chieu_rap: initialData?.filters?.chieu_rap || defaultChieuRap
    };
  });
  useEffect(() => {
    const newLoaiPhim = getInitialLoaiPhim(initialSlug);
    const newChieuRap = getInitialChieuRap(initialSlug);
    setFilters((prevFilters) => {
      if (prevFilters.loai_phim !== newLoaiPhim || prevFilters.chieu_rap !== newChieuRap) {
        return {
          ...prevFilters,
          loai_phim: newLoaiPhim,
          chieu_rap: newChieuRap
        };
      }
      return prevFilters;
    });
  }, [initialSlug]);
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
    { label: "P.Đề+ T.Minh", value: "Vietsub + Thuyết Minh" },
    { label: "Lồng Tiếng", value: "Lồng Tiếng" }
  ];
  const releaseYearOptions = [
    { label: "Tất cả", value: "" },
    ...Array.from({ length: (/* @__PURE__ */ new Date()).getFullYear() - 2e3 + 1 }, (_, i) => ({
      label: `${(/* @__PURE__ */ new Date()).getFullYear() - i}`,
      value: `${(/* @__PURE__ */ new Date()).getFullYear() - i}`
    })).sort((a, b) => parseInt(b.value) - parseInt(a.value))
  ];
  const sortOptions = [
    { label: "Mới nhất", value: "ngay-tao" },
    { label: "Lượt xem", value: "luot-xem" },
    { label: "Tập mới nhất", value: "moi-cap-nhat" }
  ];
  const buildApiUrl = useCallback(
    (pageToFetch = 1) => {
      const url = new URL(`${baseUrl}/api/filter/`);
      url.searchParams.set("page", pageToFetch.toString());
      url.searchParams.set("limit", initialLimit.toString());
      Object.entries(filters).forEach(([key, value]) => {
        if (value && key !== "chu_de") {
          url.searchParams.set(key, value);
        }
      });
      url.searchParams.delete("chu_de");
      return url.toString();
    },
    [filters, baseUrl, initialLimit]
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
          window.location.pathname,
          window.location.origin
        );
        Object.entries(filters).forEach(([key, value]) => {
          if (value && key !== "chu_de") {
            newUrl.searchParams.set(key, value);
          } else {
            newUrl.searchParams.delete(key);
          }
        });
        newUrl.searchParams.set("page", pageToFetch.toString());
        newUrl.searchParams.delete("chu_de");
        window.history.pushState(null, "", newUrl.toString());
      } catch (err) {
        setError("Không thể tải phim. Vui lòng thử lại.");
        setMovies([]);
      } finally {
        setLoading(false);
      }
    },
    [buildApiUrl, filters]
  );
  const handleFilterChange = (name, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value
    }));
  };
  const handleApplyFilters = () => {
    fetchMovies(1);
  };
  const handlePageChange = (pageNumber) => {
    fetchMovies(pageNumber);
  };
  const toggleFilter = () => {
    setIsFilterOpen((prev) => !prev);
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
  const FilterGroup = ({ title, options, filterKey }) => /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2 md:grid md:grid-cols-[100px_1fr] md:gap-4 md:border-b md:border-dotted md:border-gray-800 md:pb-4 md:last:border-b-0", children: [
    /* @__PURE__ */ jsxs("p", { className: "whitespace-nowrap font-semibold text-gray-200 lg:text-sm", children: [
      title,
      ":"
    ] }),
    /* @__PURE__ */ jsx("div", { className: "hide-scrollbar flex flex-row items-center gap-1 overflow-x-auto md:flex-wrap md:overflow-visible lg:gap-4", children: options.map((option) => /* @__PURE__ */ jsx(
      "button",
      {
        onClick: () => handleFilterChange(filterKey, option.value),
        className: `whitespace-nowrap rounded-[4px] px-3 py-1.5 transition-colors duration-200 ${filters[filterKey] === option.value ? "bg-[#2f2f2f] text-sky-300" : "text-gray-200 hover:text-white"}`,
        children: option.label
      },
      option.value
    )) })
  ] });
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen", children: [
    /* @__PURE__ */ jsx("div", { className: "mb-4 flex justify-start ", children: /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: toggleFilter,
        className: "flex items-center gap-2 rounded-full bg-blue-400 px-4 py-2 text-sm font-semibold text-white transition-all duration-300 ",
        "aria-expanded": isFilterOpen,
        "aria-controls": "filter-panel",
        children: [
          /* @__PURE__ */ jsx(
            "svg",
            {
              xmlns: "http://www.w3.org/2000/svg",
              width: "20",
              height: "20",
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              strokeWidth: "2",
              strokeLinecap: "round",
              strokeLinejoin: "round",
              children: /* @__PURE__ */ jsx("path", { d: "M22 3.5H2l8 10.5V20l4 2v-8.5l8-10.5z" })
            }
          ),
          /* @__PURE__ */ jsx("h2", { children: "Bộ Lọc" })
        ]
      }
    ) }),
    /* @__PURE__ */ jsx(
      "div",
      {
        id: "filter-panel",
        className: `flex flex-col gap-4 transition-all duration-300 ease-in-out ${isFilterOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`,
        children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 rounded-lg border border-gray-200/20 p-4 text-xs text-white", children: [
          /* @__PURE__ */ jsx(
            FilterGroup,
            {
              title: "Loại phim",
              options: loaiPhimOptions,
              filterKey: "loai_phim"
            }
          ),
          /* @__PURE__ */ jsx(
            FilterGroup,
            {
              title: "Thể loại",
              options: categoryOptions,
              filterKey: "the_loai"
            }
          ),
          /* @__PURE__ */ jsx(
            FilterGroup,
            {
              title: "Hình thức",
              options: chieuRapOptions,
              filterKey: "chieu_rap"
            }
          ),
          /* @__PURE__ */ jsx(
            FilterGroup,
            {
              title: "Năm sản xuất",
              options: releaseYearOptions,
              filterKey: "nam_phat_hanh"
            }
          ),
          /* @__PURE__ */ jsx(
            FilterGroup,
            {
              title: "Ngôn ngữ",
              options: languageOptions,
              filterKey: "ngon_ngu"
            }
          ),
          /* @__PURE__ */ jsx(FilterGroup, { title: "Sắp xếp", options: sortOptions, filterKey: "sort" }),
          /* @__PURE__ */ jsx("div", { className: "mt-4 flex justify-start gap-2", children: /* @__PURE__ */ jsx(
            "button",
            {
              onClick: handleApplyFilters,
              className: "rounded-full bg-sky-300 px-4 py-2 text-xs font-semibold text-black transition-all duration-300 hover:scale-105",
              children: "Tìm Kiếm"
            }
          ) })
        ] })
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "py-4 flex flex-row items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { className: "", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "h-1 w-8 rounded-full bg-gradient-to-r from-sky-400 to-cyan-300" }),
          /* @__PURE__ */ jsxs("h1", { className: "bg-gradient-to-r from-white via-sky-100 to-cyan-100 bg-clip-text text-lg font-bold text-transparent lg:text-2xl", children: [
            "Phim ",
            tittle
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "h-px bg-gradient-to-r from-sky-500/50 via-cyan-500/30 to-transparent" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex flex-row items-center justify-between gap-4", children: totalPages > 1 && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxs("span", { className: "text-xs lg:text-sm text-white", children: [
          "Trang ",
          currentPage,
          " / ",
          totalPages
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => handlePageChange(currentPage - 1),
            className: "flex h-6 w-6 items-center justify-center rounded-[4px] bg-[#2f3346] text-sm text-gray-300 hover:bg-[#2f3346]/80 disabled:opacity-60",
            "aria-label": "Trang trước",
            disabled: loading || currentPage === 1,
            children: /* @__PURE__ */ jsx(
              "svg",
              {
                xmlns: "http://www.w3.org/2000/svg",
                width: "16",
                height: "16",
                viewBox: "0 0 20 20",
                fill: "currentColor",
                children: /* @__PURE__ */ jsx("path", { d: "M12.949 16.051a.999.999 0 0 1-1.414 0L5.586 10.586a1 1 0 0 1 0-1.414L11.535 3.949a.999.999 0 0 1 1.414 1.414L7.414 10l5.535 5.535a.999.999 0 0 1 0 1.414z" })
              }
            )
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => handlePageChange(currentPage + 1),
            className: "flex h-6 w-6 items-center justify-center rounded-[4px] bg-[#2f3346] text-sm text-gray-300 hover:bg-[#2f3346]/80 disabled:opacity-50",
            "aria-label": "Trang sau",
            disabled: loading || currentPage === totalPages,
            children: /* @__PURE__ */ jsx(
              "svg",
              {
                xmlns: "http://www.w3.org/2000/svg",
                width: "16",
                height: "16",
                viewBox: "0 0 20 20",
                fill: "currentColor",
                children: /* @__PURE__ */ jsx("path", { d: "M7.051 3.949a.999.999 0 0 1 1.414 0L14.414 9.414a1 1 0 0 1 0 1.414l-5.949 5.949a.999.999 0 0 1-1.414-1.414L12.586 10 7.051 4.465a.999.999 0 0 1 0-1.414z" })
              }
            )
          }
        )
      ] }) })
    ] }),
    error && /* @__PURE__ */ jsx("div", { className: "mt-8 text-center text-red-500", children: error }),
    !loading && !error && movies.length === 0 && /* @__PURE__ */ jsxs("div", { className: "py-20 flex flex-col items-center justify-center space-y-4 bg-[#242424] rounded-xl shadow-inner border border-gray-700/50 mt-8", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-base lg:text-2xl font-extrabold text-white", children: "Không Tìm Thấy Phim Nào Phù Hợp" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm lg:text-base text-gray-400 max-w-lg text-center", children: "Hãy Dùng Bộ Lọc Để Tìm Kiếm Phim" }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: toggleFilter,
          className: "mt-4 rounded-full bg-blue-400 px-6 py-3 text-sm font-bold text-white ",
          children: "Mở Bộ Lọc"
        }
      )
    ] }),
    loading && /* @__PURE__ */ jsx("div", { className: "relative py-4", children: /* @__PURE__ */ jsx("div", { className: "loading-container flex h-[20rem] w-full items-center justify-center", children: /* @__PURE__ */ jsxs("svg", { width: "60", height: "30", viewBox: "0 0 100 50", children: [
      /* @__PURE__ */ jsxs(
        "line",
        {
          x1: "10",
          y1: "25",
          x2: "10",
          y2: "25",
          stroke: "#60A5FA",
          strokeWidth: "4",
          strokeLinecap: "round",
          children: [
            /* @__PURE__ */ jsx(
              "animate",
              {
                attributeName: "y1",
                values: "25;10;25",
                dur: "1s",
                begin: "0s",
                repeatCount: "indefinite"
              }
            ),
            /* @__PURE__ */ jsx(
              "animate",
              {
                attributeName: "y2",
                values: "25;40;25",
                dur: "1s",
                begin: "0s",
                repeatCount: "indefinite"
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        "line",
        {
          x1: "30",
          y1: "25",
          x2: "30",
          y2: "25",
          stroke: "#60A5FA",
          strokeWidth: "4",
          strokeLinecap: "round",
          children: [
            /* @__PURE__ */ jsx(
              "animate",
              {
                attributeName: "y1",
                values: "25;10;25",
                dur: "1s",
                begin: "0.2s",
                repeatCount: "indefinite"
              }
            ),
            /* @__PURE__ */ jsx(
              "animate",
              {
                attributeName: "y2",
                values: "25;40;25",
                dur: "1s",
                begin: "0.2s",
                repeatCount: "indefinite"
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        "line",
        {
          x1: "50",
          y1: "25",
          x2: "50",
          y2: "25",
          stroke: "#60A5FA",
          strokeWidth: "4",
          strokeLinecap: "round",
          children: [
            /* @__PURE__ */ jsx(
              "animate",
              {
                attributeName: "y1",
                values: "25;10;25",
                dur: "1s",
                begin: "0.4s",
                repeatCount: "indefinite"
              }
            ),
            /* @__PURE__ */ jsx(
              "animate",
              {
                attributeName: "y2",
                values: "25;40;25",
                dur: "1s",
                begin: "0.4s",
                repeatCount: "indefinite"
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        "line",
        {
          x1: "70",
          y1: "25",
          x2: "70",
          y2: "25",
          stroke: "#60A5FA",
          strokeWidth: "4",
          strokeLinecap: "round",
          children: [
            /* @__PURE__ */ jsx(
              "animate",
              {
                attributeName: "y1",
                values: "25;10;25",
                dur: "1s",
                begin: "0.6000000000000001s",
                repeatCount: "indefinite"
              }
            ),
            /* @__PURE__ */ jsx(
              "animate",
              {
                attributeName: "y2",
                values: "25;40;25",
                dur: "1s",
                begin: "0.6000000000000001s",
                repeatCount: "indefinite"
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        "line",
        {
          x1: "90",
          y1: "25",
          x2: "90",
          y2: "25",
          stroke: "#60A5FA",
          strokeWidth: "4",
          strokeLinecap: "round",
          children: [
            /* @__PURE__ */ jsx(
              "animate",
              {
                attributeName: "y1",
                values: "25;10;25",
                dur: "1s",
                begin: "0.8s",
                repeatCount: "indefinite"
              }
            ),
            /* @__PURE__ */ jsx(
              "animate",
              {
                attributeName: "y2",
                values: "25;40;25",
                dur: "1s",
                begin: "0.8s",
                repeatCount: "indefinite"
              }
            )
          ]
        }
      )
    ] }) }) }),
    !loading && !error && movies.length > 0 && /* @__PURE__ */ jsx("div", { className: "mt-4 grid grid-cols-3 gap-x-2 gap-y-6 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-5 lg:gap-x-4 xl:grid-cols-6", children: movies.map((movie) => /* @__PURE__ */ jsxs(
      "a",
      {
        href: `/phim/${movie.slug}`,
        className: "group relative flex-shrink-0",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "relative aspect-[2/3] w-full overflow-hidden rounded-[4px]", children: [
            /* @__PURE__ */ jsx(
              "img",
              {
                src: movie.poster_url,
                alt: movie.title || movie.ten_phim,
                className: "h-full w-full rounded-[4px] object-cover"
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "absolute inset-0 rounded-[4px] bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" }),
            /* @__PURE__ */ jsxs("div", { className: "absolute bottom-2 left-2 flex flex-col gap-2 font-semibold", children: [
              /* @__PURE__ */ jsx("span", { className: "w-fit whitespace-nowrap rounded-[4px] bg-sky-300 px-2 py-0.5 text-[10px] text-black lg:py-1 lg:text-xs", children: rutGonTinhTrangNgonNgu(movie.ngon_ngu) }),
              /* @__PURE__ */ jsx("span", { className: "w-fit whitespace-nowrap rounded-[4px] bg-[linear-gradient(90deg,#e5330b_0%,#ff670b_51%,#d9a666_100%)] px-2 py-0.5 text-[10px] text-white lg:py-1 lg:text-xs", children: rutGonTinhTrangPhim(movie.tinh_trang) })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center gap-2 py-2", children: [
            /* @__PURE__ */ jsx(
              "h3",
              {
                className: "line-clamp-2 text-center text-xs font-normal text-white hover:text-sky-300 lg:text-sm",
                title: movie.ten_phim,
                children: movie.ten_phim
              }
            ),
            /* @__PURE__ */ jsx("p", { className: "line-clamp-2 text-center text-xs font-normal text-gray-400", children: movie.ten_khac })
          ] })
        ]
      },
      movie.id
    )) }),
    totalPages > 1 && /* @__PURE__ */ jsxs("nav", { className: "mt-8 flex items-center justify-center gap-2", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => handlePageChange(currentPage - 1),
          className: "flex h-10 w-10 items-center justify-center rounded-[4px] bg-[#2f3346] text-sm text-gray-300 hover:bg-[#2f3346]/80 disabled:opacity-70",
          "aria-label": "Trang trước",
          disabled: loading || currentPage === 1,
          children: /* @__PURE__ */ jsx(
            "svg",
            {
              xmlns: "http://www.w3.org/2000/svg",
              width: "16",
              height: "16",
              viewBox: "0 0 20 20",
              children: /* @__PURE__ */ jsx(
                "path",
                {
                  fill: "currentColor",
                  d: "m2 10l8 8l1.4-1.4L5.8 11H18V9H5.8l5.6-5.6L10 2z"
                }
              )
            }
          )
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "flex h-10 items-center space-x-2 rounded-[4px] bg-[#2f3346] px-4 py-1 text-sm text-gray-300", children: [
        /* @__PURE__ */ jsx("span", { children: "Trang" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "number",
            value: inputValue,
            onChange: handleInputChange,
            onKeyDown: handleInputKeyDown,
            className: "w-10 appearance-none rounded-md border border-gray-500 bg-transparent py-1 text-center focus:outline-none",
            min: "1",
            max: totalPages
          }
        ),
        /* @__PURE__ */ jsxs("span", { children: [
          "/ ",
          totalPages
        ] })
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => handlePageChange(currentPage + 1),
          className: "flex h-10 w-10 items-center justify-center rounded-[4px] bg-[#2f3346] text-sm text-gray-300 hover:bg-[#2f3346]/80 disabled:opacity-70",
          "aria-label": "Trang sau",
          disabled: loading || currentPage === totalPages,
          children: /* @__PURE__ */ jsx(
            "svg",
            {
              xmlns: "http://www.w3.org/2000/svg",
              width: "16",
              height: "16",
              viewBox: "0 0 20 20",
              children: /* @__PURE__ */ jsx(
                "path",
                {
                  fill: "currentColor",
                  d: "M8.6 3.4L14.2 9H2v2h12.2l-5.6 5.6L10 18l8-8l-8-8z"
                }
              )
            }
          )
        }
      )
    ] })
  ] });
}

const BASE_URL = "https://api.motchillx.site";
const fetchJson = async (url) => {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Lỗi khi fetch API: ${url}`);
    return await res.json();
  } catch (err) {
    console.error(`Fetch error: ${url}`, err);
    return null;
  }
};
async function getCategoryData(slug, initialPage = 1, limit = 30) {
  let API_URL;
  let currentCategoryName;
  let metaKeywords;
  const keywordsMap = {
    marvel: "phim marvel, chủ đề marvel, phim siêu anh hùng",
    dc: "phim dc, chủ đề dc, phim siêu anh hùng",
    default: "phim online, phim vietsub, phim HD"
  };
  API_URL = `${BASE_URL}/api/filter/?page=${initialPage}&limit=${limit}&chu_de=${slug}&sort=ngay-tao`;
  console.log("Fetching category data (Topic) from URL:", API_URL);
  const categoryData = await fetchJson(API_URL);
  const topResponse = await fetchJson(
    `${BASE_URL}/api/filter/?page=1&limit=10&sort=luot-xem`
  );
  const topmovies = topResponse?.data || [];
  if (!categoryData || !topmovies) {
    return { error: "Không thể lấy dữ liệu. Vui lòng thử lại sau." };
  }
  currentCategoryName = categoryData.filters?.chủ_đề || slug;
  metaKeywords = keywordsMap[slug] || keywordsMap["default"];
  return {
    categoryData,
    topmovies,
    currentCategoryName,
    metaKeywords
  };
}

const $$Astro = createAstro();
const prerender = false;
const revalidate = 1800;
const $$slug = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$slug;
  const slug = Astro2.params.slug;
  const initialPage = 1;
  const limit = 30;
  const data = await getCategoryData(slug, initialPage, limit);
  if (data.error) {
    return new Response("L\u1ED7i server", { status: 500 });
  }
  const { categoryData, currentCategoryName } = data;
  if (!categoryData?.data || categoryData.data.length === 0) {
    return Astro2.redirect("/404");
  }
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$Layout, {}, { "default": async ($$result2) => renderTemplate`  ${renderComponent($$result2, "Header", Header, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/home/vohaidang/Desktop/tramphim-v2/ui/src/components/Header/Header", "client:component-export": "default" })} ${maybeRenderHead()}<main class="main-type-layout"> <div class="type-content-flex"> <section class="type-main-section"> ${renderComponent($$result2, "CategoryMovies", CategoryMovies, { "initialData": categoryData, "initialSlug": slug, "baseUrl": BASE_URL, "initialLimit": limit, "tittle": currentCategoryName, "client:load": true, "client:component-hydration": "load", "client:component-path": "/home/vohaidang/Desktop/tramphim-v2/ui/src/components/CategoryMovies/ChuDe", "client:component-export": "default" })} </section> </div> </main> <footer> ${renderComponent($$result2, "Footer", Footer, {})} </footer> `, "head": async ($$result2) => renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "slot": "head" }, { "default": async ($$result3) => renderTemplate` ${renderComponent($$result3, "Seo", $$SeoLoaiPhim, { "slug": slug, "currentCategoryName": currentCategoryName })} ` })}` })}`;
}, "/home/vohaidang/Desktop/tramphim-v2/ui/src/pages/chu-de/[slug].astro", void 0);

const $$file = "/home/vohaidang/Desktop/tramphim-v2/ui/src/pages/chu-de/[slug].astro";
const $$url = "/chu-de/[slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$slug,
  file: $$file,
  prerender,
  revalidate,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
