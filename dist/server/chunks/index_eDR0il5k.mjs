import { e as createComponent, m as maybeRenderHead, o as renderScript, r as renderTemplate, l as renderComponent, k as renderHead, p as renderSlot } from './astro/server_BuMcwEkM.mjs';
import 'kleur/colors';
/* empty css                          */
import 'clsx';
import { jsxs, Fragment, jsx } from 'react/jsx-runtime';
import { useState, useRef, useCallback, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
/* empty css                          */

const $$MobileNav = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div id="mobile-nav" class="fixed bottom-4 right-2 flex-col gap-2 z-50 md:hidden hidden transition-opacity duration-300"> <button onclick="window.scrollTo({ top: 0, behavior: 'smooth' })" class="w-10 h-10 rounded-lg bg-white text-black flex items-center justify-center shadow-md" aria-label="Cuộn lên đầu trang"> <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" class="h-5 w-5"> <path fill="currentColor" d="M15 20H9v-8H4.16L12 4.16L19.84 12H15z"></path> </svg> </button> <a href="/" class="w-10 h-10 rounded-lg bg-white text-black flex items-center justify-center shadow-md" aria-label="Trang chủ"> <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" class="h-5 w-5"> <path fill="currentColor" d="M12.581 2.686a1 1 0 0 0-1.162 0l-9.5 6.786l1.162 1.627L12 4.73l8.919 6.37l1.162-1.627zm7 10l-7-5a1 1 0 0 0-1.162 0l-7 5a1 1 0 0 0-.42.814V20a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-6.5a1 1 0 0 0-.418-.814"></path> </svg> </a> ${renderScript($$result, "/home/vohaidang/Desktop/tramphim-v2/ui/src/components/MobileNav.astro?astro&type=script&index=0&lang.ts")} </div>`;
}, "/home/vohaidang/Desktop/tramphim-v2/ui/src/components/MobileNav.astro", void 0);

const ToastProvider = ({ children }) => {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    children,
    /* @__PURE__ */ jsx(
      ToastContainer,
      {
        position: "bottom-right",
        autoClose: 1500,
        theme: "dark"
      }
    )
  ] });
};

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate(_a || (_a = __template(['<html lang="vi"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="#191B24"><link rel="icon" href="/favicon.ico"><link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet"><script async defer crossorigin="anonymous" src="https://connect.facebook.net/vi_VN/sdk.js#xfbml=1&version=v21.0"><\/script><link rel="alternate" type="application/rss+xml" title="Phim Vietsub HD RSS" href="/rss.xml">', "", '</head> <body class="page-body"> ', " ", ' <div id="fb-root"></div> </body></html>'])), renderSlot($$result, $$slots["head"]), renderHead(), renderComponent($$result, "ToastProvider", ToastProvider, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/home/vohaidang/Desktop/tramphim-v2/ui/src/components/Toast/ToastProvider", "client:component-export": "default" }, { "default": ($$result2) => renderTemplate` ${renderSlot($$result2, $$slots["default"])} ` }), renderComponent($$result, "MobileNav", $$MobileNav, {}));
}, "/home/vohaidang/Desktop/tramphim-v2/ui/src/layouts/Layout.astro", void 0);

const logo = new Proxy({"src":"/_astro/logo.B8HBszRl.png","width":1051,"height":237,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/home/vohaidang/Desktop/tramphim-v2/ui/src/assets/logo.png";
							}
							
							return target[name];
						}
					});

const PROGRESS_DB_NAME = "VideoProgressDB";
const PROGRESS_DB_VERSION = 1;
const PROGRESS_STORE_NAME = "videoProgress";
const initProgressDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(PROGRESS_DB_NAME, PROGRESS_DB_VERSION);
    request.onerror = (event) => reject(event.target.error);
    request.onsuccess = (event) => resolve(event.target.result);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(PROGRESS_STORE_NAME)) {
        const store = db.createObjectStore(PROGRESS_STORE_NAME, {
          keyPath: "id"
        });
        store.createIndex("lastUpdated", "lastUpdated", { unique: false });
      }
    };
  });
};
const getAllProgressFromDB = async () => {
  let db;
  try {
    db = await initProgressDB();
    const transaction = db.transaction([PROGRESS_STORE_NAME], "readonly");
    const store = transaction.objectStore(PROGRESS_STORE_NAME);
    const result = await new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = (event) => reject(event.target.error);
    });
    return result || [];
  } catch (error) {
    console.error("Error getting all progress from IndexedDB:", error);
    return [];
  } finally {
    if (db) db.close();
  }
};
const getProgressPercentage = (progress, duration) => {
  if (!duration || duration <= 0) return 0;
  return Math.min(Math.max(progress / duration * 100, 0), 100);
};
const HistoryIcon = () => /* @__PURE__ */ jsx(
  "svg",
  {
    xmlns: "http://www.w3.org/2000/svg",
    width: "24",
    height: "24",
    viewBox: "0 0 48 48",
    className: "h-6 w-6 text-white",
    children: /* @__PURE__ */ jsxs("g", { fill: "none", stroke: "#fff", strokeLinejoin: "round", strokeWidth: "4", children: [
      /* @__PURE__ */ jsx("path", { d: "M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4S4 12.954 4 24s8.954 20 20 20Z" }),
      /* @__PURE__ */ jsx("path", { strokeLinecap: "round", d: "M24.008 12v12.01l8.479 8.48" })
    ] })
  }
);
const WatchedMoviesDropdown = ({ movies, onClose }) => {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: "custom-scrollbar absolute -right-2 top-full max-h-[40vh] w-80 overflow-hidden overflow-y-auto rounded-md bg-[#23252b] shadow-2xl backdrop-blur-xl",
      role: "menu",
      "aria-label": "watched-movies-button",
      children: [
        /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between border-b border-white/10 p-3", children: /* @__PURE__ */ jsx("h4", { className: "text-sm font-medium text-white", children: "Lịch sử xem" }) }),
        /* @__PURE__ */ jsx("div", { className: "p-2", children: movies.length > 0 ? movies.map((movie) => {
          const progressPercentage = getProgressPercentage(
            movie.progress,
            movie.duration
          );
          const movieLanguage = movie.ngonngu || "vi";
          return /* @__PURE__ */ jsxs(
            "a",
            {
              href: `/xem-phim/${movie.slug}/tap-${movie.sotap}/${movieLanguage}`,
              onClick: onClose,
              className: "flex cursor-pointer items-center space-x-3 rounded-md px-3 py-3 transition-all duration-200 hover:bg-white/10 focus:bg-white/10 focus:outline-none",
              role: "option",
              tabIndex: 0,
              "aria-selected": false,
              "aria-label": `Tiếp tục xem phim ${movie.ten_phim} tập ${movie.sotap}`,
              children: [
                /* @__PURE__ */ jsxs("div", { className: "relative flex-shrink-0", children: [
                  /* @__PURE__ */ jsx(
                    "img",
                    {
                      src: movie.banner,
                      alt: movie.ten_phim || "Ảnh bìa phim",
                      className: "h-14 w-24 rounded-[4px] object-fill",
                      "aria-hidden": "true"
                    }
                  ),
                  /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 right-0 h-0.5 bg-gray-600/70", children: /* @__PURE__ */ jsx(
                    "div",
                    {
                      className: "h-full bg-sky-300",
                      style: { width: `${progressPercentage}%` }
                    }
                  ) })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
                  /* @__PURE__ */ jsx("h4", { className: "truncate text-[13px] font-medium text-white hover:text-sky-300", children: movie.ten_phim }),
                  /* @__PURE__ */ jsxs("p", { className: "truncate text-xs text-white/60", children: [
                    "Đang xem tập ",
                    movie.sotap
                  ] })
                ] })
              ]
            },
            movie.id
          );
        }) : /* @__PURE__ */ jsx(
          "div",
          {
            className: "p-4 text-center text-white/60",
            role: "status",
            "aria-live": "polite",
            children: "Không có phim nào đang xem."
          }
        ) })
      ]
    }
  );
};

const FAVORITE_DB_NAME = "FavoriteDB";
const FAVORITE_DB_VERSION = 2;
const FAVORITE_STORE_NAME = "FavoriteDB";
const initFavoriteDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(FAVORITE_DB_NAME, FAVORITE_DB_VERSION);
    request.onerror = (event) => reject(event.target.error);
    request.onsuccess = (event) => resolve(event.target.result);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(FAVORITE_STORE_NAME)) {
        db.createObjectStore(FAVORITE_STORE_NAME, { keyPath: "slug" });
      }
    };
  });
};
const getAllFavoriteMovies = async () => {
  let db;
  try {
    db = await initFavoriteDB();
    const transaction = db.transaction([FAVORITE_STORE_NAME], "readonly");
    const store = transaction.objectStore(FAVORITE_STORE_NAME);
    const result = await new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = (event) => reject(event.target.error);
    });
    return result || [];
  } catch (error) {
    console.error("Error fetching favorite movies:", error);
    return [];
  } finally {
    if (db) db.close();
  }
};
const clearFavoriteMovies = async () => {
  let db;
  try {
    db = await initFavoriteDB();
    const transaction = db.transaction([FAVORITE_STORE_NAME], "readwrite");
    const store = transaction.objectStore(FAVORITE_STORE_NAME);
    const request = store.clear();
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve();
      request.onerror = (event) => reject(event.target.error);
    });
  } catch (error) {
    console.error("Error clearing favorite movies:", error);
    throw error;
  } finally {
    if (db) db.close();
  }
};
const BookmarkIcon = () => /* @__PURE__ */ jsx(
  "svg",
  {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    strokeWidth: 1.5,
    stroke: "currentColor",
    className: "h-6 w-6 text-white",
    fill: "none",
    children: /* @__PURE__ */ jsx(
      "path",
      {
        strokeLinecap: "round",
        strokeLinejoin: "round",
        d: "M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
      }
    )
  }
);
const FavoriteMoviesDropdown = ({ movies, onClose, onClear }) => {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: "custom-scrollbar absolute right-0 top-full z-[51] max-h-[40vh] w-80 overflow-hidden overflow-y-auto rounded-md bg-[#23252b] shadow-2xl backdrop-blur-xl",
      role: "menu",
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-b border-white/10 p-3", children: [
          /* @__PURE__ */ jsx("h4", { className: "text-sm font-medium text-white", children: "Phim Yêu Thích" }),
          movies.length > 0 && /* @__PURE__ */ jsx(
            "button",
            {
              onClick: onClear,
              className: "text-xs text-red-400 transition-colors hover:text-red-500",
              children: "Xóa tất cả"
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "p-2", children: movies.length > 0 ? movies.map((movie) => /* @__PURE__ */ jsxs(
          "a",
          {
            href: `/phim/${movie.slug}`,
            onClick: onClose,
            className: "flex cursor-pointer items-center space-x-3 rounded-md px-3 py-3 transition-all duration-200 hover:bg-white/10 focus:bg-white/10 focus:outline-none",
            role: "menuitem",
            children: [
              /* @__PURE__ */ jsx(
                "img",
                {
                  src: movie.poster_url,
                  alt: movie.ten_phim,
                  className: "h-14 w-10 flex-shrink-0 rounded-[4px] object-fill",
                  "aria-hidden": "true"
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
                /* @__PURE__ */ jsx("h4", { className: "truncate text-[13px] font-medium text-white hover:text-sky-300", children: movie.ten_phim }),
                /* @__PURE__ */ jsx("p", { className: "truncate text-xs text-white/60", children: movie.ten_khac })
              ] })
            ]
          },
          movie.slug
        )) : /* @__PURE__ */ jsx(
          "div",
          {
            className: "p-4 text-center text-xs text-white/60",
            role: "status",
            "aria-live": "polite",
            children: "Chưa có phim yêu thích."
          }
        ) })
      ]
    }
  );
};

const BASE_URL = "https://api.motchillx.site";
const SearchIcon = () => /* @__PURE__ */ jsx(
  "svg",
  {
    className: "h-4 w-4",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    "aria-hidden": "true",
    children: /* @__PURE__ */ jsx(
      "path",
      {
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeWidth: 2,
        d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      }
    )
  }
);
const CloseIcon = () => /* @__PURE__ */ jsx(
  "svg",
  {
    className: "h-5 w-5",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    "aria-hidden": "true",
    children: /* @__PURE__ */ jsx(
      "path",
      {
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeWidth: 2,
        d: "M6 18L18 6M6 6l12 12"
      }
    )
  }
);
const DropdownArrowIcon = ({ open }) => /* @__PURE__ */ jsx(
  "svg",
  {
    className: `h-4 w-4 transform transition-transform duration-300 ${open ? "" : "-rotate-90"}`,
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    "aria-hidden": "true",
    children: /* @__PURE__ */ jsx(
      "path",
      {
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeWidth: 2,
        d: "M19 9l-7 7-7-7"
      }
    )
  }
);
const MobileMenuIcon = ({ open }) => /* @__PURE__ */ jsxs("div", { className: "relative h-6 w-6", children: [
  /* @__PURE__ */ jsx(
    "svg",
    {
      className: `absolute left-0 top-0 h-6 w-6 transition-all duration-300 ease-in-out ${open ? "scale-75 opacity-0" : "scale-100 opacity-100"} `,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      "aria-hidden": "true",
      children: /* @__PURE__ */ jsx(
        "path",
        {
          fill: "none",
          stroke: "#fff",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: "2",
          d: "M4 6h16M4 12h8m-8 6h16"
        }
      )
    }
  ),
  /* @__PURE__ */ jsx(
    "svg",
    {
      className: `absolute left-0 top-0 h-6 w-6 transition-all duration-300 ease-in-out ${open ? "scale-100 opacity-100" : "scale-75 opacity-0"} `,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      "aria-hidden": "true",
      children: /* @__PURE__ */ jsx(
        "path",
        {
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: 1.5,
          d: "M6 18L18 6M6 6l12 12",
          className: "text-red-300"
        }
      )
    }
  )
] });
function Header() {
  const [theLoaiList, setTheLoaiList] = useState([]);
  const [showTheLoai, setShowTheLoai] = useState(false);
  const [showQuocGia, setShowQuocGia] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showMobileTheLoai, setShowMobileTheLoai] = useState(false);
  const [showMobileQuocGia, setShowMobileQuocGia] = useState(false);
  const [currentPath, setCurrentPath] = useState("");
  const [desktopSearchQuery, setDesktopSearchQuery] = useState("");
  const [desktopSearchResults, setDesktopSearchResults] = useState([]);
  const [showDesktopSearchResults, setShowDesktopSearchResults] = useState(false);
  const [isDesktopSearching, setIsDesktopSearching] = useState(false);
  const [mobileSearchQuery, setMobileSearchQuery] = useState("");
  const [mobileSearchResults, setMobileSearchResults] = useState([]);
  const [showMobileSearchResults, setShowMobileSearchResults] = useState(false);
  const [isMobileSearching, setIsMobileSearching] = useState(false);
  const [showWatchedMovies, setShowWatchedMovies] = useState(false);
  const [watchedMovies, setWatchedMovies] = useState([]);
  const watchedMoviesRef = useRef(null);
  const [showFavoriteMovies, setShowFavoriteMovies] = useState(false);
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const favoriteMoviesRef = useRef(null);
  const theLoaiRef = useRef(null);
  const quocGiaRef = useRef(null);
  const desktopSearchRef = useRef(null);
  const mobileMenuPanelRef = useRef(null);
  const mobileSearchInputRef = useRef(null);
  const desktopSearchInputRef = useRef(null);
  const headerRef = useRef(null);
  const mobileTheLoaiRef = useRef(null);
  const mobileQuocGiaRef = useRef(null);
  const fetchTheLoaiList = useCallback(async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/theloai/`);
      if (!response.ok) {
        throw new Error("Lỗi khi fetch danh sách thể loại");
      }
      const data = await response.json();
      setTheLoaiList(data);
    } catch (error) {
      console.error("Fetch TheLoai List Error:", error);
      setTheLoaiList([]);
    }
  }, []);
  const loadWatchedMovies = useCallback(async () => {
    try {
      const movies = await getAllProgressFromDB();
      const movieMap = /* @__PURE__ */ new Map();
      movies.forEach((item) => {
        const progressPercentage = item.progress / item.duration * 100;
        if (progressPercentage < 90) {
          const movieKey = item.slug;
          if (!movieMap.has(movieKey) || new Date(item.lastUpdated) > new Date(movieMap.get(movieKey).lastUpdated)) {
            movieMap.set(movieKey, item);
          }
        }
      });
      const sortedMovies = Array.from(movieMap.values()).sort((a, b) => {
        return new Date(b.lastUpdated) - new Date(a.lastUpdated);
      });
      setWatchedMovies(sortedMovies);
    } catch (error) {
      console.error("Error loading watched movies:", error);
    }
  }, []);
  const loadFavoriteMovies = useCallback(async () => {
    try {
      const movies = await getAllFavoriteMovies();
      setFavoriteMovies(movies);
    } catch (error) {
      console.error("Error loading favorite movies:", error);
      setFavoriteMovies([]);
    }
  }, []);
  const handleClearFavorites = async () => {
    try {
      await clearFavoriteMovies();
      setFavoriteMovies([]);
    } catch (error) {
      console.error("Error clearing favorite movies:", error);
    }
  };
  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleScroll = () => setScrolled(window.scrollY > 50);
      window.addEventListener("scroll", handleScroll);
      setCurrentPath(window.location.pathname);
      loadWatchedMovies();
      loadFavoriteMovies();
      fetchTheLoaiList();
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [loadWatchedMovies, loadFavoriteMovies, fetchTheLoaiList]);
  useEffect(() => {
    if (typeof document !== "undefined") {
      const handleKeyDown = (event) => {
        if (event.key === "Escape") {
          closeAllPopups();
        }
      };
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, []);
  useEffect(() => {
    if (typeof document !== "undefined") {
      const handleClickOutside = (event) => {
        if (theLoaiRef.current && !theLoaiRef.current.contains(event.target))
          setShowTheLoai(false);
        if (quocGiaRef.current && !quocGiaRef.current.contains(event.target))
          setShowQuocGia(false);
        if (desktopSearchRef.current && !desktopSearchRef.current.contains(event.target))
          setShowDesktopSearchResults(false);
        if (watchedMoviesRef.current && !watchedMoviesRef.current.contains(event.target))
          setShowWatchedMovies(false);
        if (favoriteMoviesRef.current && !favoriteMoviesRef.current.contains(event.target))
          setShowFavoriteMovies(false);
        if (mobileMenuOpen && mobileMenuPanelRef.current && !mobileMenuPanelRef.current.contains(event.target) && headerRef.current && !headerRef.current.contains(event.target)) {
          setMobileMenuOpen(false);
        }
        if (mobileTheLoaiRef.current && !mobileTheLoaiRef.current.contains(event.target)) {
          setShowMobileTheLoai(false);
        }
        if (mobileQuocGiaRef.current && !mobileQuocGiaRef.current.contains(event.target)) {
          setShowMobileQuocGia(false);
        }
        if (mobileSearchInputRef.current && !mobileSearchInputRef.current.contains(event.target) && !event.target.closest(".mobile-search-results-dropdown")) {
          setShowMobileSearchResults(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [mobileMenuOpen]);
  useEffect(() => {
    if (desktopSearchQuery.trim().length < 2) {
      setDesktopSearchResults([]);
      setShowDesktopSearchResults(false);
      return;
    }
    setIsDesktopSearching(true);
    const handler = setTimeout(async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/api/search?q=${encodeURIComponent(desktopSearchQuery)}`
        );
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        const resultsArray = data && data.data && data.data.items ? data.data.items : data;
        const hasResults = resultsArray.length > 0;
        setDesktopSearchResults(resultsArray);
        setShowDesktopSearchResults(
          hasResults && desktopSearchQuery.trim().length >= 2
        );
      } catch (error) {
        setDesktopSearchResults([]);
        setShowDesktopSearchResults(false);
      } finally {
        setIsDesktopSearching(false);
      }
    }, 200);
    return () => {
      clearTimeout(handler);
      setIsDesktopSearching(false);
    };
  }, [desktopSearchQuery]);
  useEffect(() => {
    if (mobileSearchQuery.trim().length < 2) {
      setMobileSearchResults([]);
      setShowMobileSearchResults(false);
      return;
    }
    setIsMobileSearching(true);
    const handler = setTimeout(async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/api/search?q=${encodeURIComponent(mobileSearchQuery)}`
        );
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        const resultsArray = data && data.data && data.data.items ? data.data.items : data;
        const hasResults = resultsArray.length > 0;
        setMobileSearchResults(resultsArray);
        setShowMobileSearchResults(
          hasResults && mobileSearchQuery.trim().length >= 2
        );
      } catch (error) {
        console.error("Lỗi khi tìm kiếm trên mobile:", error);
        setMobileSearchResults([]);
        setShowMobileSearchResults(false);
      } finally {
        setIsMobileSearching(false);
      }
    }, 200);
    return () => {
      clearTimeout(handler);
      setIsMobileSearching(false);
    };
  }, [mobileSearchQuery]);
  const closeAllPopups = () => {
    setShowTheLoai(false);
    setShowQuocGia(false);
    setShowDesktopSearchResults(false);
    setShowMobileSearchResults(false);
    setMobileMenuOpen(false);
    setDesktopSearchQuery("");
    setMobileSearchQuery("");
    setShowWatchedMovies(false);
    setShowFavoriteMovies(false);
    setShowMobileTheLoai(false);
    setShowMobileQuocGia(false);
  };
  const handleInternalNavLinkClick = (e, href) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      window.location.href = href;
    }
    closeAllPopups();
  };
  const handleDesktopSearchSubmit = (e) => {
    e.preventDefault();
    if (desktopSearchQuery.trim()) {
      if (typeof window !== "undefined") {
        window.location.href = `/tim-kiem?q=${encodeURIComponent(
          desktopSearchQuery
        )}`;
      }
      setShowDesktopSearchResults(false);
    }
  };
  const handleMobileSearchSubmit = (e) => {
    e.preventDefault();
    if (mobileSearchQuery.trim()) {
      if (typeof window !== "undefined") {
        window.location.href = `/tim-kiem?q=${encodeURIComponent(
          mobileSearchQuery
        )}`;
      }
      setShowMobileSearchResults(false);
      setMobileSearchQuery("");
      setMobileMenuOpen(false);
    }
  };
  const handleDesktopSearchResultClick = (movie) => {
    setDesktopSearchQuery("");
    setShowDesktopSearchResults(false);
    if (typeof window !== "undefined") {
      window.location.href = `/phim/${movie.slug}`;
    }
  };
  const handleMobileSearchResultClick = (movie) => {
    setMobileSearchQuery("");
    setShowMobileSearchResults(false);
    if (typeof window !== "undefined") {
      window.location.href = `/phim/${movie.slug}`;
    }
  };
  const toggleDropdown = (dropdown) => {
    setShowTheLoai(dropdown === "theloai" ? !showTheLoai : false);
    setShowQuocGia(dropdown === "quocgia" ? !showQuocGia : false);
    setShowWatchedMovies(dropdown === "watched" ? !showWatchedMovies : false);
    setShowFavoriteMovies(
      dropdown === "favorite" ? !showFavoriteMovies : false
    );
  };
  const toggleMobileDropdown = (dropdown) => {
    setShowMobileTheLoai(!showMobileTheLoai );
    setShowMobileQuocGia(false);
  };
  const handleDropdownKeyDown = (event, dropdown) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleDropdown(dropdown);
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      toggleDropdown(dropdown);
    }
  };
  const SearchResultsDropdown = ({
    results,
    isSearching,
    searchQueryLength,
    onResultClick,
    searchType
  }) => /* @__PURE__ */ jsx("div", { className: "z-[9999] p-2", role: "listbox", "aria-label": "Kết quả tìm kiếm", children: isSearching ? /* @__PURE__ */ jsx(
    "div",
    {
      className: "p-4 text-center text-xs text-white/60",
      role: "status",
      "aria-live": "polite",
      children: "Đang tìm kiếm phim"
    }
  ) : results.length > 0 ? /* @__PURE__ */ jsxs(Fragment, { children: [
    results.slice(0, 5).map((movie) => /* @__PURE__ */ jsxs(
      "div",
      {
        onClick: (e) => {
          e.preventDefault();
          e.stopPropagation();
          onResultClick(movie);
        },
        onKeyDown: (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onResultClick(movie);
          }
        },
        className: "flex cursor-pointer items-center space-x-3 rounded-md px-3 py-3 transition-all duration-200 focus:bg-white/10 focus:outline-none",
        role: "option",
        tabIndex: 0,
        "aria-selected": false,
        "aria-label": `Phim ${movie.ten_phim}, ${movie.tinh_trang}, ${movie.ngon_ngu}`,
        children: [
          /* @__PURE__ */ jsx(
            "img",
            {
              src: movie.poster_url,
              alt: "",
              className: "h-16 w-12 flex-shrink-0 rounded-[4px] object-fill",
              onError: (e) => {
                e.target.src = "/placeholder-image.jpg";
              },
              "aria-hidden": "true"
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsx("h4", { className: "truncate text-[13px] font-medium text-white hover:text-sky-300", children: movie.ten_phim }),
            /* @__PURE__ */ jsxs("p", { className: "truncate text-xs text-white/60", children: [
              movie.tinh_trang,
              " • ",
              movie.ngon_ngu
            ] })
          ] })
        ]
      },
      movie.id
    )),
    results.length > 5 && /* @__PURE__ */ jsxs(
      "a",
      {
        href: `/tim-kiem?q=${encodeURIComponent(
          (searchType === "desktop" ? desktopSearchQuery : mobileSearchQuery) || ""
        ).trim()}`,
        className: "block border-t border-white/10 px-3 py-2 text-center text-[13px] text-white hover:text-sky-300",
        onClick: (e) => handleInternalNavLinkClick(
          e,
          `/tim-kiem?q=${encodeURIComponent(
            (searchType === "desktop" ? desktopSearchQuery : mobileSearchQuery) || ""
          ).trim()}`
        ),
        "aria-label": `Xem tất cả ${results.length} kết quả tìm kiếm`,
        children: [
          "Xem tất cả (",
          results.length,
          " kết quả)"
        ]
      }
    )
  ] }) : /* @__PURE__ */ jsx(
    "div",
    {
      className: "p-4 text-center text-white/60",
      role: "status",
      "aria-live": "polite",
      children: searchQueryLength < 2 ? "Nhập ít nhất 2 ký tự để tìm kiếm." : "Không tìm thấy kết quả."
    }
  ) });
  const navLinksDesktop = [
    { href: "/loai-phim/phim-chieu-rap", label: "Phim Chiếu Rạp" },
    { href: "/loai-phim/phim-le", label: "Phim Lẻ" },
    { href: "/loai-phim/phim-bo", label: "Phim Bộ" },
    { href: "/loai-phim/hoat-hinh", label: "Hoạt Hình" }
  ];
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    showMobileSearchResults && mobileSearchQuery.length >= 2 || mobileMenuOpen || showWatchedMovies || showFavoriteMovies ? /* @__PURE__ */ jsx(
      "div",
      {
        onClick: closeAllPopups,
        onKeyDown: (e) => {
          if (e.key === "Escape") {
            closeAllPopups();
          }
        },
        className: "fixed inset-0 z-40 lg:hidden",
        role: "button",
        tabIndex: 0,
        "aria-label": "Đóng overlay"
      }
    ) : null,
    /* @__PURE__ */ jsx(
      "header",
      {
        ref: headerRef,
        className: "z-50 mx-auto max-w-screen-xl px-4 py-0 transition-colors duration-700 ease-in-out lg:px-10 lg:py-2 2xl:px-0",
        role: "banner",
        children: /* @__PURE__ */ jsxs("div", { className: "md:h-18 relative flex h-16 w-full items-center justify-between", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-grow items-center gap-4 sm:gap-16", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex flex-row items-center gap-2 lg:gap-4", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => setMobileMenuOpen((p) => !p),
                  className: "flex text-white/80 hover:text-white focus:text-white xl:hidden",
                  "aria-label": mobileMenuOpen ? "Đóng menu" : "Mở menu",
                  "aria-expanded": mobileMenuOpen,
                  "aria-controls": "mobile-menu",
                  children: /* @__PURE__ */ jsx(MobileMenuIcon, { open: mobileMenuOpen })
                }
              ),
              /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
                "a",
                {
                  href: "/",
                  className: "flex-shrink-0 ",
                  "aria-label": "Trang chủ",
                  onClick: (e) => handleInternalNavLinkClick(e, "/"),
                  children: /* @__PURE__ */ jsx(
                    "img",
                    {
                      src: typeof logo === "string" ? logo : logo.src,
                      alt: "Logo trang web phim",
                      className: " h-8 w-auto lg:h-10  "
                    }
                  )
                }
              ) }),
              /* @__PURE__ */ jsx(
                "nav",
                {
                  className: "hidden items-center text-xs lg:space-x-2 lg:text-sm xl:flex 2xl:space-x-6",
                  role: "navigation",
                  "aria-label": "Menu chính",
                  children: /* @__PURE__ */ jsxs(
                    "nav",
                    {
                      className: "ml-8 hidden items-center text-xs lg:space-x-6 lg:text-sm xl:flex 2xl:space-x-6",
                      role: "navigation",
                      "aria-label": "Menu chính",
                      children: [
                        navLinksDesktop.map((link) => /* @__PURE__ */ jsxs(
                          "a",
                          {
                            href: link.href,
                            className: `font-mediumm relative py-2 text-[13px] transition-all duration-300 ${currentPath === link.href ? "text-white" : "text-white"} hover:text-sky-300`,
                            onClick: (e) => handleInternalNavLinkClick(e, link.href),
                            children: [
                              link.label,
                              /* @__PURE__ */ jsx(
                                "span",
                                {
                                  className: `absolute bottom-0 left-0 h-0.5 w-full transform rounded-full bg-sky-300 transition-transform duration-300 ${currentPath === link.href ? "scale-x-100" : "scale-x-0"}`,
                                  "aria-hidden": "true"
                                }
                              )
                            ]
                          },
                          link.href
                        )),
                        /* @__PURE__ */ jsxs(
                          "div",
                          {
                            className: "relative hidden text-[13px] lg:block",
                            ref: theLoaiRef,
                            children: [
                              /* @__PURE__ */ jsxs(
                                "button",
                                {
                                  onClick: () => toggleDropdown("theloai"),
                                  onKeyDown: (e) => handleDropdownKeyDown(e, "theloai"),
                                  className: "flex items-center space-x-2 py-2 font-medium text-white",
                                  "aria-expanded": showTheLoai,
                                  "aria-haspopup": "true",
                                  "aria-controls": "theloai-dropdown",
                                  id: "theloai-button",
                                  children: [
                                    /* @__PURE__ */ jsx("span", { children: "Thể Loại" }),
                                    /* @__PURE__ */ jsx(DropdownArrowIcon, { open: showTheLoai })
                                  ]
                                }
                              ),
                              showTheLoai && theLoaiList.length > 0 && /* @__PURE__ */ jsx(
                                "div",
                                {
                                  className: "absolute left-2 top-full z-[51] mt-5 w-[30rem] overflow-hidden rounded-lg bg-[#23252b] shadow-2xl backdrop-blur-xl",
                                  role: "menu",
                                  "aria-labelledby": "theloai-button",
                                  id: "theloai-dropdown",
                                  children: /* @__PURE__ */ jsx("div", { className: "px-2 py-4", children: /* @__PURE__ */ jsx("div", { className: "grid grid-cols-3 gap-1", children: theLoaiList.map((item) => /* @__PURE__ */ jsx(
                                    "a",
                                    {
                                      href: `/the-loai/${item.slug}`,
                                      className: "block px-3 py-2 text-xs text-white hover:text-sky-300",
                                      onClick: (e) => handleInternalNavLinkClick(
                                        e,
                                        `/the-loai/${item.slug}`
                                      ),
                                      role: "menuitem",
                                      children: item.ten
                                    },
                                    item.id
                                  )) }) })
                                }
                              )
                            ]
                          }
                        )
                      ]
                    }
                  )
                }
              )
            ] }),
            /* @__PURE__ */ jsx("div", { className: "relative flex-grow lg:hidden", children: /* @__PURE__ */ jsxs(
              "form",
              {
                onSubmit: handleMobileSearchSubmit,
                className: "relative flex-grow",
                role: "search",
                children: [
                  /* @__PURE__ */ jsx("label", { htmlFor: "mobile-search", className: "sr-only", children: "Tìm kiếm phim" }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      ref: mobileSearchInputRef,
                      id: "mobile-search",
                      type: "text",
                      value: mobileSearchQuery,
                      onChange: (e) => setMobileSearchQuery(e.target.value),
                      onFocus: () => {
                        if (mobileSearchQuery.trim().length >= 2 || mobileSearchResults.length > 0) {
                          setShowMobileSearchResults(true);
                        }
                      },
                      placeholder: "Tìm kiếm phim...",
                      className: "h-8 w-full rounded-[4px] bg-white/10 px-4 pr-10 text-xs text-white placeholder-white/60 focus:outline-none",
                      autoComplete: "off",
                      "aria-describedby": showMobileSearchResults ? "mobile-search-results" : void 0,
                      "aria-expanded": showMobileSearchResults,
                      "aria-autocomplete": "list",
                      role: "combobox"
                    }
                  ),
                  mobileSearchQuery.length > 0 ? /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => {
                        setMobileSearchQuery("");
                        setShowMobileSearchResults(false);
                      },
                      className: "absolute right-0 top-0 h-full rounded-[4px] px-3 text-white/70 hover:text-white focus:outline-none",
                      "aria-label": "Xóa tìm kiếm",
                      children: /* @__PURE__ */ jsx(CloseIcon, {})
                    }
                  ) : /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "submit",
                      className: "absolute right-2 top-0 h-full rounded-[4px] text-white/70 hover:text-white focus:outline-none",
                      "aria-label": "Tìm kiếm",
                      children: /* @__PURE__ */ jsx(SearchIcon, {})
                    }
                  )
                ]
              }
            ) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center px-0 md:gap-3 md:pl-4 lg:gap-6", children: [
            /* @__PURE__ */ jsxs("div", { ref: desktopSearchRef, className: "relative hidden lg:block", children: [
              /* @__PURE__ */ jsxs(
                "form",
                {
                  onSubmit: handleDesktopSearchSubmit,
                  className: "relative",
                  role: "search",
                  children: [
                    /* @__PURE__ */ jsx("label", { htmlFor: "desktop-search", className: "sr-only", children: "Tìm kiếm phim" }),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        ref: desktopSearchInputRef,
                        id: "desktop-search",
                        type: "text",
                        value: desktopSearchQuery,
                        onChange: (e) => setDesktopSearchQuery(e.target.value),
                        onFocus: () => {
                          if (desktopSearchQuery.trim().length >= 2 || desktopSearchResults.length > 0) {
                            setShowDesktopSearchResults(true);
                          }
                        },
                        placeholder: "Tìm kiếm phim...",
                        className: "w-[20rem] rounded-md bg-[#ffffff20] px-3 py-2.5 pr-12 text-sm text-white placeholder-white/60 focus:outline focus:outline-2 focus:outline-offset-[1px] focus:outline-[white]",
                        autoComplete: "off",
                        "aria-describedby": showDesktopSearchResults ? "search-results" : void 0,
                        "aria-expanded": showDesktopSearchResults,
                        "aria-autocomplete": "list",
                        role: "combobox"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "submit",
                        className: "absolute right-3 top-1/2 flex h-6 -translate-y-1/2 items-center gap-2 border-l border-white/30 pl-3 text-white/70 transition-colors hover:text-white",
                        "aria-label": "Tìm kiếm",
                        children: /* @__PURE__ */ jsx(SearchIcon, {})
                      }
                    )
                  ]
                }
              ),
              showDesktopSearchResults && desktopSearchQuery.length > 1 && /* @__PURE__ */ jsx(
                "div",
                {
                  className: "absolute right-0 top-full z-50 mt-2 max-h-[60vh] w-full overflow-y-auto rounded-md bg-[#1a1c22] shadow-2xl backdrop-blur-xl",
                  id: "search-results",
                  children: /* @__PURE__ */ jsx(
                    SearchResultsDropdown,
                    {
                      results: desktopSearchResults,
                      isSearching: isDesktopSearching,
                      searchQueryLength: desktopSearchQuery.length,
                      onResultClick: handleDesktopSearchResultClick,
                      searchType: "desktop"
                    }
                  )
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "relative hidden md:flex", ref: favoriteMoviesRef, children: [
              /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: () => {
                    toggleDropdown("favorite");
                  },
                  onKeyDown: (e) => handleDropdownKeyDown(e, "favorite"),
                  className: "e flex flex-col items-center justify-center gap-1 text-white",
                  "aria-expanded": showFavoriteMovies,
                  "aria-haspopup": "true",
                  "aria-controls": "favorite-movies-dropdown",
                  id: "favorite-movies-button",
                  children: [
                    /* @__PURE__ */ jsx(BookmarkIcon, {}),
                    /* @__PURE__ */ jsx("span", { className: "text-xs", children: "Yêu thích" })
                  ]
                }
              ),
              showFavoriteMovies && /* @__PURE__ */ jsx(
                "div",
                {
                  className: "absolute right-0 top-full z-[51] mt-4",
                  role: "menu",
                  "aria-labelledby": "favorite-movies-button",
                  children: /* @__PURE__ */ jsx(
                    FavoriteMoviesDropdown,
                    {
                      movies: favoriteMovies,
                      onClose: () => setShowFavoriteMovies(false),
                      onClear: handleClearFavorites
                    }
                  )
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "relative hidden md:flex", ref: watchedMoviesRef, children: [
              /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: () => toggleDropdown("watched"),
                  onKeyDown: (e) => handleDropdownKeyDown(e, "watched"),
                  className: "flex flex-col items-center justify-center gap-1 text-white",
                  "aria-expanded": showWatchedMovies,
                  "aria-haspopup": "true",
                  "aria-controls": "watched-movies-dropdown",
                  id: "watched-movies-button",
                  children: [
                    /* @__PURE__ */ jsx(HistoryIcon, {}),
                    /* @__PURE__ */ jsx("span", { className: "text-xs", children: "Lịch sử xem" })
                  ]
                }
              ),
              showWatchedMovies && /* @__PURE__ */ jsx(
                "div",
                {
                  className: "absolute right-0 top-full z-[51] mt-4",
                  role: "menu",
                  "aria-labelledby": "watched-movies-button",
                  children: /* @__PURE__ */ jsx(
                    WatchedMoviesDropdown,
                    {
                      movies: watchedMovies,
                      onClose: () => setShowWatchedMovies(false)
                    }
                  )
                }
              )
            ] })
          ] })
        ] })
      }
    ),
    showMobileSearchResults && mobileSearchQuery.length > 1 && /* @__PURE__ */ jsx(
      "div",
      {
        className: "mobile-search-results-dropdown absolute left-0 right-0 top-16 z-[51] max-h-[100vh] overflow-y-auto rounded-md bg-[#0F111AF2] shadow-2xl lg:hidden",
        onClick: (e) => e.stopPropagation(),
        onTouchEnd: (e) => e.stopPropagation(),
        id: "mobile-search-results",
        children: /* @__PURE__ */ jsx(
          SearchResultsDropdown,
          {
            results: mobileSearchResults,
            isSearching: isMobileSearching,
            searchQueryLength: mobileSearchQuery.length,
            onResultClick: handleMobileSearchResultClick,
            searchType: "mobile"
          }
        )
      }
    ),
    mobileMenuOpen && /* @__PURE__ */ jsx(
      "div",
      {
        ref: mobileMenuPanelRef,
        className: "absolute left-0 right-0 top-16 z-[51] w-full border-t border-white/10 bg-[#2d2d2d] text-sm font-medium shadow-lg lg:m-8 lg:w-[30%] xl:hidden",
        id: "mobile-menu",
        role: "navigation",
        "aria-label": "Menu di động",
        children: /* @__PURE__ */ jsxs("div", { className: "px-2 py-2", children: [
          /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-2", children: [
            { href: "/", label: "Trang Chủ" },
            { href: "/loai-phim/phim-chieu-rap", label: "Phim Chiếu Rạp" },
            { href: "/lich-chieu", label: "Lịch Chiếu" },
            { href: "/loai-phim/hoat-hinh", label: "Phim Hoạt Hình" },
            { href: "/loai-phim/phim-le", label: "Phim Lẻ" },
            { href: "/loai-phim/phim-bo", label: "Phim Bộ" }
          ].map((link) => /* @__PURE__ */ jsx(
            "a",
            {
              href: link.href,
              className: `block rounded-md px-3 py-2 text-left text-xs transition-all hover:bg-white/10 hover:text-white focus:bg-none focus:text-white ${currentPath === link.href ? "text-sky-300" : "text-white/90"}`,
              onClick: (e) => handleInternalNavLinkClick(e, link.href),
              children: link.label
            },
            link.href
          )) }),
          /* @__PURE__ */ jsxs("div", { className: "relative my-2", ref: mobileTheLoaiRef, children: [
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => toggleMobileDropdown(),
                className: `flex w-full items-center justify-between rounded-md px-3 py-2 text-xs text-left transition-all focus:bg-none hover:text-white  ${showMobileTheLoai ? "text-sky-300" : "text-white/90"}`,
                "aria-expanded": showMobileTheLoai,
                "aria-haspopup": "true",
                children: [
                  "Thể Loại",
                  /* @__PURE__ */ jsx(DropdownArrowIcon, { open: showMobileTheLoai })
                ]
              }
            ),
            showMobileTheLoai && theLoaiList.length > 0 && /* @__PURE__ */ jsx("div", { className: "mt-1 grid grid-cols-3 gap-3 rounded-lg bg-white/5 px-3 py-2 text-white", children: theLoaiList.map((item) => {
              return /* @__PURE__ */ jsx(
                "a",
                {
                  href: `/the-loai/${item.slug}`,
                  className: `block py-1 text-xs font-normal text-white transition-all hover:text-sky-300`,
                  onClick: (e) => handleInternalNavLinkClick(
                    e,
                    `/the-loai/${item.slug}`
                  ),
                  children: item.ten
                },
                item.id
              );
            }) })
          ] })
        ] })
      }
    )
  ] });
}

const Footer = () => {
  const navLinks = [
    { name: "Hỏi - Đáp", href: "/" },
    { name: "Chính sách bảo mật", href: "/" },
    { name: "Điều khoản sử dụng", href: "/" },
    { name: "Giới thiệu", href: "/" }
  ];
  const year = (/* @__PURE__ */ new Date()).getFullYear();
  return /* @__PURE__ */ jsx("div", { className: "footer-base", children: /* @__PURE__ */ jsxs("div", { className: "footer-inner", children: [
    /* @__PURE__ */ jsx("section", { className: "footer-logo-section", children: /* @__PURE__ */ jsx("div", { className: "footer-logo-wrapper", children: /* @__PURE__ */ jsx(
      "img",
      {
        src: typeof logo === "string" ? logo : logo.src,
        className: "footer-logo-img",
        loading: "lazy",
        alt: "hh3d - Xem phim Vietsub HD"
      }
    ) }) }),
    /* @__PURE__ */ jsx("nav", { className: "mb-4", "aria-label": "Liên kết chân trang và Liên hệ", children: /* @__PURE__ */ jsxs("ul", { className: "footer-nav-list", children: [
      navLinks.map((link) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: link.href, className: "footer-nav-link", children: link.name }) }, link.href)),
      /* @__PURE__ */ jsxs("li", { className: "text-sm", children: [
        "Liên hệ:",
        " ",
        /* @__PURE__ */ jsx(
          "a",
          {
            href: "https://t.me/meomeochill",
            target: "_blank",
            rel: "noopener noreferrer",
            className: "footer-contact-link",
            children: "@meomeochill"
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "footer-copyright-divider", children: /* @__PURE__ */ jsx("address", { className: "footer-copyright-text", children: /* @__PURE__ */ jsxs("p", { children: [
      "Copyright © ",
      year,
      " MePhimTV."
    ] }) }) })
  ] }) });
};

export { $$Layout as $, Footer as F, Header as H };
