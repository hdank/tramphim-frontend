/* empty css                                  */
import { e as createComponent, f as createAstro, h as addAttribute, r as renderTemplate, u as unescapeHTML, l as renderComponent, n as Fragment, m as maybeRenderHead } from '../chunks/astro/server_BuMcwEkM.mjs';
import 'kleur/colors';
import { $ as $$Layout, H as Header, F as Footer } from '../chunks/index_BCmV18BO.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useEffect, useCallback } from 'react';
import { T as TopMovies } from '../chunks/TopMovies_Dnd2_qIw.mjs';
import 'clsx';
export { renderers } from '../renderers.mjs';

function SearchResultsWithFilter({
  initialSearchMovies = [],
  searchKeyword = "",
  initialData,
  baseUrl,
  initialLimit,
  tittle
}) {
  const isSearchPage = !!searchKeyword;
  const [movies, setMovies] = useState(
    isSearchPage ? initialSearchMovies : initialData?.data || []
  );
  const [pagination, setPagination] = useState(
    isSearchPage ? { current_page: 1, total_pages: 1 } : initialData?.pagination || { current_page: 1, total_pages: 1 }
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    setMovies(isSearchPage ? initialSearchMovies : initialData?.data || []);
    setPagination(
      isSearchPage ? { current_page: 1, total_pages: 1 } : initialData?.pagination || { current_page: 1, total_pages: 1 }
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
            searchKeyword
          )}&page=${pageToFetch}&limit=${initialLimit}`;
        } else {
          apiUrl = `${baseUrl}/api/phim/?page=${pageToFetch}&limit=${initialLimit}&sort=luot-xem`;
        }
        const res = await fetch(apiUrl);
        if (!res.ok) {
          throw new Error(
            `Lỗi khi fetch API: ${apiUrl} - Status: ${res.status}`
          );
        }
        const json = await res.json();
        setMovies(json.data || []);
        setPagination(json.pagination || { current_page: 1, total_pages: 1 });
        const newUrl = new URL(
          window.location.pathname,
          window.location.origin
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
    [baseUrl, initialLimit, isSearchPage, searchKeyword]
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
  const displayTitle = isSearchPage ? `Kết Quả Với Từ Khóa: "${searchKeyword}"` : tittle || "Tuyển Tập Phim";
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("div", { className: "", children: /* @__PURE__ */ jsx("div", { className: "flex flex-row items-center justify-between gap-8 lg:justify-start", children: /* @__PURE__ */ jsx("h1", { className: "mb-4 text-lg font-semibold lg:text-xl", children: displayTitle }) }) }),
    error && /* @__PURE__ */ jsx("div", { className: "mt-8 text-center text-red-500", children: error }),
    loading && /* @__PURE__ */ jsx("div", { className: "mt-8 text-center text-gray-400", children: "Đang tải phim..." }),
    !loading && !error && movies.length === 0 && /* @__PURE__ */ jsx("div", { className: "mt-8 text-center text-gray-400", children: "Không tìm thấy phim nào phù hợp." }),
    !loading && !error && movies.length > 0 && /* @__PURE__ */ jsx("div", { className: "mt-4 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-1", children: movies.map((movie) => /* @__PURE__ */ jsx(
      "a",
      {
        href: `/phim/${movie.slug}`,
        className: "group flex flex-row gap-2 lg:gap-8",
        children: /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("div", { className: "group flex flex-row gap-2 lg:gap-8", children: [
          /* @__PURE__ */ jsx("div", { className: "relative h-36 w-24 overflow-hidden rounded-[4px] lg:h-56 lg:w-40", children: /* @__PURE__ */ jsx(
            "img",
            {
              src: movie.poster_url,
              alt: movie.title || movie.ten_phim,
              className: "h-full w-full rounded-[4px] object-cover",
              fetchPriority: "high"
            }
          ) }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-1 flex-col justify-between px-2", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(
                "p",
                {
                  className: "line-clamp-2 text-sm font-semibold text-white hover:text-sky-300 lg:text-xl",
                  title: movie.ten_phim,
                  children: movie.ten_phim
                }
              ),
              /* @__PURE__ */ jsx("p", { className: "mt-1 line-clamp-1 text-xs font-medium text-gray-400 lg:text-base", children: movie.ten_khac }),
              /* @__PURE__ */ jsxs("p", { className: "text-gray-20 mt-1 line-clamp-1 text-xs font-medium lg:text-sm", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[#a9a9ac]", children: "Năm: " }),
                movie.nam_phat_hanh
              ] }),
              /* @__PURE__ */ jsxs("p", { className: "text-gray-20 mt-1 line-clamp-1 text-xs font-medium lg:text-sm", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[#a9a9ac]", children: "Tình Trạng: " }),
                movie.tinh_trang
              ] }),
              /* @__PURE__ */ jsxs("p", { className: "text-gray-20 mt-1 line-clamp-1 text-xs font-medium lg:text-sm", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[#a9a9ac]", children: "Chất Lượng: " }),
                movie.chat_luong
              ] }),
              movie.dien_vien && movie.dien_vien.length > 0 && /* @__PURE__ */ jsxs("h2", { className: "my-1 hidden text-[13px] font-medium text-[#a9a9ac] md:block lg:text-sm", children: [
                "Diễn viên:",
                /* @__PURE__ */ jsx("span", { className: "my-1 line-clamp-2 text-white", children: movie.dien_vien.map((actor) => actor.ten).join(", ") })
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "mt-4", children: /* @__PURE__ */ jsx("div", { className: "inline-flex items-center rounded-full bg-sky-400 px-2 py-1 text-xs font-medium text-white transition-colors duration-300 lg:px-3 lg:py-2 lg:text-sm", children: "Xem Ngay" }) })
          ] })
        ] }) })
      },
      movie.id
    )) }),
    totalPages > 1 && /* @__PURE__ */ jsxs("nav", { className: "mt-8 flex flex-wrap items-center justify-center gap-2", children: [
      currentPage > 1 && /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => handlePageChange(currentPage - 1),
          className: "flex h-8 w-8 items-center justify-center rounded-[4px] border border-gray-600 bg-[#23252b] text-sm text-gray-300 hover:bg-gray-600",
          "aria-label": "Trang trước",
          disabled: loading,
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
      paginationItems.map((p) => /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => handlePageChange(p),
          className: `flex h-8 w-8 items-center justify-center rounded-[4px] border text-sm ${currentPage === p ? "border-orange-400 bg-orange-500 text-white" : "border-gray-600 bg-[#23252b] text-gray-300 hover:bg-gray-600"}`,
          disabled: loading,
          children: p
        },
        p
      )),
      currentPage < totalPages && /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => handlePageChange(currentPage + 1),
          className: "flex h-8 w-8 items-center justify-center rounded-[4px] border border-gray-600 bg-[#23252b] text-sm text-gray-300 hover:bg-gray-600",
          "aria-label": "Trang sau",
          disabled: loading,
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

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro$1 = createAstro();
const $$SeoTimKiem = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$SeoTimKiem;
  const siteName = "Tr\u1EA1m Phim";
  const { keyword } = Astro2.props;
  const siteUrl = Astro2.url.origin;
  const getSearchSeoData = (kw) => {
    const currentUrl = Astro2.url.href;
    const titleTag = `${siteName} | Phim Vietsub HD | Phim Hay | Xem Phim Online | Phim M\u1EDBi Full HD`;
    const seoDescription = `${siteName} - Xem phim online Vietsub mi\u1EC5n ph\xED. Th\u01B0\u1EDFng th\u1EE9c phim chi\u1EBFu r\u1EA1p, phim l\u1EBB, phim b\u1ED9 \u0111\u1EB7c s\u1EAFc, bom t\u1EA5n m\u1EDBi nh\u1EA5t. Lu\xF4n c\u1EADp nh\u1EADt phim nhanh ch\xF3ng, bao g\u1ED3m phim b\u1ED9 Trung Qu\u1ED1c v\xE0 H\xE0n Qu\u1ED1c.`;
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Trang ch\u1EE7",
          item: siteUrl
        },
        {
          "@type": "ListItem",
          position: 2,
          name: `T\xECm ki\u1EBFm: ${kw}`,
          item: currentUrl
        }
      ]
    };
    return {
      title: titleTag,
      description: seoDescription,
      url: currentUrl,
      ogImage: `${siteUrl}/thumb_web.png`,
      breadcrumbSchema
    };
  };
  const seoData = getSearchSeoData(keyword);
  const siteLocale = "vi_VN";
  return renderTemplate`<title>${seoData.title}</title><meta name="description"${addAttribute(seoData.description, "content")}><meta name="robots" content="index, follow"><link rel="canonical"${addAttribute(seoData.url, "href")}><meta property="og:title"${addAttribute(seoData.title, "content")}><meta property="og:description"${addAttribute(seoData.description, "content")}><meta property="og:url"${addAttribute(seoData.url, "content")}><meta property="og:type" content="website"><meta property="og:locale"${addAttribute(siteLocale, "content")}><meta property="og:site_name"${addAttribute(siteName, "content")}><meta property="og:image"${addAttribute(seoData.ogImage, "content")}><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title"${addAttribute(seoData.title, "content")}><meta name="twitter:description"${addAttribute(seoData.description, "content")}><meta name="twitter:image"${addAttribute(seoData.ogImage, "content")}><link rel="icon" href="/favicon.ico" type="image/x-icon">${seoData.breadcrumbSchema && renderTemplate(_a || (_a = __template(['<script type="application/ld+json">', "<\/script>"])), unescapeHTML(JSON.stringify(seoData.breadcrumbSchema)))}`;
}, "/home/vohaidang/Desktop/tramphim-v2/ui/src/seometas/SeoTimKiem.astro", void 0);

const BASE_URL = "https://api.motchillx.site";
const fetchJson = async (url) => {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.error(`Error fetching from URL: ${url}. Status: ${res.status}`);
      return null;
    }
    return await res.json();
  } catch (err) {
    console.error(`Fetch error for URL: ${url}`, err);
    return null;
  }
};
const searchMovies = async (keyword) => {
  if (!keyword) return [];
  try {
    const searchApiUrl = `${BASE_URL}/api/search/?q=${encodeURIComponent(keyword)}`;
    const searchData = await fetchJson(searchApiUrl);
    return searchData || [];
  } catch (err) {
    console.error("Error calling search API:", err);
    return [];
  }
};
const getTopMovies = async (limit = 10) => {
  const TOP_URL = `${BASE_URL}/api/filter/?page=1&limit=${limit}&sort=luot-xem`;
  const topResponse = await fetchJson(TOP_URL);
  return topResponse?.data || [];
};

const $$Astro = createAstro();
const prerender = false;
const revalidate = 1800;
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const keyword = Astro2.url.searchParams.get("q") ?? "";
  const movies = await searchMovies(keyword);
  const topmovies = await getTopMovies();
  if (!topmovies) {
    return new Response(
      "Kh\xF4ng th\u1EC3 l\u1EA5y d\u1EEF li\u1EC7u phim h\xE0ng \u0111\u1EA7u. Vui l\xF2ng th\u1EED l\u1EA1i sau.",
      { status: 500 }
    );
  }
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$Layout, {}, { "default": async ($$result2) => renderTemplate`  ${maybeRenderHead()}<main class="main-search-layout"> <div class="header-wrapper-search"> ${renderComponent($$result2, "Header", Header, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/home/vohaidang/Desktop/tramphim-v2/ui/src/components/Header/Header", "client:component-export": "default" })} </div> <div class="content-columns-flex"> <div class="search-results-column"> ${renderComponent($$result2, "SearchResultsWithFilter", SearchResultsWithFilter, { "initialSearchMovies": movies, "searchKeyword": keyword, "initialLimit": 10, "tittle": "T\xECm ki\u1EBFm", "client:load": true, "client:component-hydration": "load", "client:component-path": "/home/vohaidang/Desktop/tramphim-v2/ui/src/components/SearchMovies/SearchMovies", "client:component-export": "default" })} </div> <div class="top-movies-sidebar-column"> ${renderComponent($$result2, "TopMovies", TopMovies, { "movies": topmovies, "client:load": true, "client:component-hydration": "load", "client:component-path": "/home/vohaidang/Desktop/tramphim-v2/ui/src/components/TopMovies/TopMovies", "client:component-export": "default" })} </div> </div> </main> <footer> ${renderComponent($$result2, "Footer", Footer, {})} </footer> `, "head": async ($$result2) => renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "slot": "head" }, { "default": async ($$result3) => renderTemplate` ${renderComponent($$result3, "SeoComponent", $$SeoTimKiem, { "keyword": keyword })} ` })}` })}`;
}, "/home/vohaidang/Desktop/tramphim-v2/ui/src/pages/tim-kiem/index.astro", void 0);

const $$file = "/home/vohaidang/Desktop/tramphim-v2/ui/src/pages/tim-kiem/index.astro";
const $$url = "/tim-kiem";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  prerender,
  revalidate,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
