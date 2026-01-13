import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../../assets/logo.png";
import logoOnly from "../../assets/logo_only.png";
import logoSvg from "../../assets/logo.svg";
import logoOnlySvg from "../../assets/logo_only.svg";

import UserProfileDropdown from "../User/UserProfileDropdown";
import NotificationDropdown from "../Notifications/NotificationDropdown";
import { AuthProvider } from "../../context/AuthProvider";

// Ensure HTTPS in production and provide fallback
const getBaseUrl = () => {
  let url = import.meta.env.PUBLIC_API_BASE_URL || 'https://api.tramphim.online';
  // Force HTTPS in production (when not localhost)
  if (url && !url.includes('localhost') && url.startsWith('http://')) {
    url = url.replace('http://', 'https://');
  }
  return url;
};
const BASE_URL = getBaseUrl();

const SearchIcon = () => (
  <svg
    className="h-4 w-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

const CloseIcon = () => (
  <svg
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const DropdownArrowIcon = ({ open }) => (
  <svg
    className={`h-4 w-4 transform transition-transform duration-300 ${open ? "" : "-rotate-90"
      }`}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 9l-7 7-7-7"
    />
  </svg>
);

const MobileMenuIcon = ({ open }) => (
  <div className="relative h-6 w-6">
    <svg
      className={`absolute left-0 top-0 h-6 w-6 transition-all duration-300 ease-in-out ${open ? "scale-75 opacity-0" : "scale-100 opacity-100"
        } `}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        fill="none"
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M4 6h16M4 12h8m-8 6h16"
      />
    </svg>

    {/* Biểu tượng Dấu "X" (khi mở) */}
    <svg
      className={`absolute left-0 top-0 h-6 w-6 transition-all duration-300 ease-in-out ${open ? "scale-100 opacity-100" : "scale-75 opacity-0"
        } `}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M6 18L18 6M6 6l12 12"
        className="text-red-300"
      />
    </svg>
  </div>
);

export default function Header() {
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
  const [showDesktopSearchResults, setShowDesktopSearchResults] =
    useState(false);
  const [isDesktopSearching, setIsDesktopSearching] = useState(false);

  const [mobileSearchQuery, setMobileSearchQuery] = useState("");
  const [mobileSearchResults, setMobileSearchResults] = useState([]);
  const [showMobileSearchResults, setShowMobileSearchResults] = useState(false);
  const [isMobileSearching, setIsMobileSearching] = useState(false);



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



  useEffect(() => {
    if (typeof window === "undefined") return;

    // Update header background based on scroll position.
    // Behavior:
    // - At top (scrollY <= 10) -> transparent background.
    // - When scrolled down (> 10px) -> black background.
    const scrollThreshold = 10; // px after which header gets black background

    let ticking = false;
    const updateBackground = () => {
      const y = window.scrollY || 0;
      // Skip background change on /phim/ pages
      if (window.location.pathname.startsWith('/phim/')) {
        setScrolled(false);
      } else {
        setScrolled(y > scrollThreshold);
      }
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateBackground);
        ticking = true;
      }
    };

    // initialize immediately (handles reloads where page is scrolled)
    updateBackground();
    window.addEventListener("scroll", onScroll, { passive: true });
    setCurrentPath(window.location.pathname);
    fetchTheLoaiList();

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [fetchTheLoaiList]);

  // expose header height as CSS variable for layout calculations (hero)
  useEffect(() => {
    if (typeof window !== "undefined" && headerRef.current) {
      const setHeaderCssVar = () => {
        const height = headerRef.current.offsetHeight || 72;
        document.documentElement.style.setProperty("--header-height", `${height}px`);
      };
      // initialize and update on resize
      setHeaderCssVar();
      window.addEventListener("resize", setHeaderCssVar);
      return () => window.removeEventListener("resize", setHeaderCssVar);
    }
  }, []);

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
        if (
          desktopSearchRef.current &&
          !desktopSearchRef.current.contains(event.target)
        )
          setShowDesktopSearchResults(false);

        if (
          mobileMenuOpen &&
          mobileMenuPanelRef.current &&
          !mobileMenuPanelRef.current.contains(event.target) &&
          headerRef.current &&
          !headerRef.current.contains(event.target)
        ) {
          setMobileMenuOpen(false);
        }

        if (
          mobileTheLoaiRef.current &&
          !mobileTheLoaiRef.current.contains(event.target)
        ) {
          setShowMobileTheLoai(false);
        }

        if (
          mobileQuocGiaRef.current &&
          !mobileQuocGiaRef.current.contains(event.target)
        ) {
          setShowMobileQuocGia(false);
        }
        if (
          mobileSearchInputRef.current &&
          !mobileSearchInputRef.current.contains(event.target) &&
          !event.target.closest(".mobile-search-results-dropdown")
        ) {
          setShowMobileSearchResults(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (desktopSearchQuery.trim().length < 1) {
      setDesktopSearchResults([]);
      setShowDesktopSearchResults(false);
      return;
    }

    setIsDesktopSearching(true);
    setShowDesktopSearchResults(true); // Show dropdown immediately when typing

    const handler = setTimeout(async () => {
      try {
        const searchUrl = `${BASE_URL}/api/search/?q=${encodeURIComponent(desktopSearchQuery.trim())}`;
        const response = await fetch(searchUrl);
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();

        const resultsArray = Array.isArray(data) ? data :
          (data && data.data && data.data.items ? data.data.items : []);

        setDesktopSearchResults(resultsArray);
        setShowDesktopSearchResults(true); // Keep dropdown open
      } catch (error) {
        console.error("Search error:", error);
        setDesktopSearchResults([]);
        setShowDesktopSearchResults(true); // Show "no results" message
      } finally {
        setIsDesktopSearching(false);
      }
    }, 150); // Reduced debounce for faster response

    return () => {
      clearTimeout(handler);
      setIsDesktopSearching(false);
    };
  }, [desktopSearchQuery]);

  useEffect(() => {
    if (mobileSearchQuery.trim().length < 1) {
      setMobileSearchResults([]);
      setShowMobileSearchResults(false);
      return;
    }

    setIsMobileSearching(true);
    setShowMobileSearchResults(true); // Show dropdown immediately when typing

    const handler = setTimeout(async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/api/search/?q=${encodeURIComponent(mobileSearchQuery.trim())}`,
        );
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();

        const resultsArray = Array.isArray(data) ? data :
          (data && data.data && data.data.items ? data.data.items : []);

        setMobileSearchResults(resultsArray);
        setShowMobileSearchResults(true); // Keep dropdown open
      } catch (error) {
        console.error("Lỗi khi tìm kiếm trên mobile:", error);
        setMobileSearchResults([]);
        setShowMobileSearchResults(true); // Show "no results" message
      } finally {
        setIsMobileSearching(false);
      }
    }, 150); // Reduced debounce for faster response

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
          desktopSearchQuery,
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
          mobileSearchQuery,
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
    setShowQuocGia(dropdown === "quocgia" ? !showQuocGia : false);
  };

  const toggleMobileDropdown = (dropdown) => {
    setShowMobileTheLoai(dropdown === "theloai" ? !showMobileTheLoai : false);
    setShowMobileQuocGia(dropdown === "quocgia" ? !showMobileQuocGia : false);
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
    searchType,
  }) => (
    <div className="z-[9999] p-2" role="listbox" aria-label="Kết quả tìm kiếm">
      {isSearching ? (
        <div
          className="p-4 text-center text-xs text-white/60"
          role="status"
          aria-live="polite"
        >
          Đang tìm kiếm phim
        </div>
      ) : results.length > 0 ? (
        <>
          {results.slice(0, 5).map((movie) => (
            <div
              key={movie.id}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onResultClick(movie);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onResultClick(movie);
                }
              }}
              className="flex cursor-pointer items-center space-x-3 rounded-md px-3 py-3 transition-all duration-200 focus:bg-white/10 focus:outline-none"
              role="option"
              tabIndex={0}
              aria-selected={false}
              aria-label={`Phim ${movie.ten_phim}, ${movie.tinh_trang}, ${movie.ngon_ngu}`}
            >
              <img
                src={movie.poster_url}
                alt=""
                className="h-16 w-12 flex-shrink-0 rounded-[4px] object-fill"
                onError={(e) => {
                  e.target.src = "/placeholder-image.jpg";
                }}
                aria-hidden="true"
              />
              <div className="min-w-0 flex-1">
                <h4 className="truncate text-[13px] font-medium text-white hover:text-sky-300">
                  {movie.ten_phim}
                </h4>
                <p className="truncate text-xs text-white/60">
                  {movie.tinh_trang} • {movie.ngon_ngu}
                </p>
              </div>
            </div>
          ))}
          {results.length > 5 && (
            <a
              href={`/tim-kiem?q=${encodeURIComponent(
                (searchType === "desktop"
                  ? desktopSearchQuery
                  : mobileSearchQuery) || "",
              ).trim()}`}
              className="block border-t border-white/10 px-3 py-2 text-center text-[13px] text-white hover:text-sky-300"
              onClick={(e) =>
                handleInternalNavLinkClick(
                  e,
                  `/tim-kiem?q=${encodeURIComponent(
                    (searchType === "desktop"
                      ? desktopSearchQuery
                      : mobileSearchQuery) || "",
                  ).trim()}`,
                )
              }
              aria-label={`Xem tất cả ${results.length} kết quả tìm kiếm`}
            >
              Xem tất cả ({results.length} kết quả)
            </a>
          )}
        </>
      ) : (
        <div
          className="p-4 text-center text-white/60"
          role="status"
          aria-live="polite"
        >
          Không tìm thấy kết quả.
        </div>
      )}
    </div>
  );

  const navLinksDesktop = [
    { href: "/loai-phim/phim-chieu-rap", label: "Phim Chiếu Rạp" },
    { href: "/loai-phim/phim-le", label: "Phim Lẻ" },
    { href: "/loai-phim/phim-bo", label: "Phim Bộ" },
    { href: "/loai-phim/hoat-hinh", label: "Hoạt Hình" },
    { href: "/anime", label: "Anime" },

  ];

  return (
    <AuthProvider>
      {(showMobileSearchResults && mobileSearchQuery.trim().length >= 1) ||
        mobileMenuOpen ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeAllPopups}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              closeAllPopups();
            }
          }}
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
          role="button"
          tabIndex={0}
          aria-label="Đóng overlay"
        ></motion.div>
      ) : null}
        <header
        ref={headerRef}
        className={`header-wrapper-main z-50 mx-auto max-w-screen-2xl px-[1px] py-0 transition-all duration-500 ease-out lg:px-6 lg:py-2 2xl:px-4 ${scrolled ? 'header-scrolled' : ''
          }`}
        role="banner"
      >
        <div className="md:h-18 relative flex h-16 w-full items-center justify-between">
          <div className="flex flex-grow items-center gap-4 sm:gap-16">
            <div className="flex flex-row items-center gap-2 lg:gap-4">
              <button
                onClick={() => setMobileMenuOpen((p) => !p)}
                className="flex text-white/80 hover:text-white focus:text-white xl:hidden"
                aria-label={mobileMenuOpen ? "Đóng menu" : "Mở menu"}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-menu"
              >
                <MobileMenuIcon open={mobileMenuOpen} />
              </button>
              <div>
                <a
                  href="/"
                  className="flex-shrink-0 "
                  aria-label="Trang chủ"
                  onClick={(e) => handleInternalNavLinkClick(e, "/")}
                >
                  <picture>
                  <source
                    media="(max-width: 767px)"
                    srcSet={typeof logoOnlySvg === "string" ? logoOnlySvg : (typeof logoOnly === "string" ? logoOnly : logoOnly.src)}
                  />
                  <img
                    src={typeof logoSvg === "string" ? logoSvg : (typeof logo === "string" ? logo : logo.src)}
                    alt="Logo trang web phim"
                    width="96"
                    height="96"
                    fetchPriority="high"
                    loading="eager"
                    className="h-12 w-auto sm:h-14 md:h-16 lg:h-20 xl:h-24"
                    style={{ maxWidth: 'none' }}
                  />
                  </picture>
                </a>
              </div>
              <nav
                className="hidden items-center text-xs lg:space-x-2 lg:text-sm xl:flex 2xl:space-x-6"
                role="navigation"
                aria-label="Menu chính"
              >
                <nav
                  className="ml-8 hidden items-center text-xs lg:space-x-6 lg:text-sm xl:flex 2xl:space-x-6"
                  role="navigation"
                  aria-label="Menu chính"
                >
                  {navLinksDesktop.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      className={`font-mediumm relative py-2 text-[13px] transition-all duration-300 ${currentPath === link.href ? "text-white" : "text-white"
                        } hover:text-sky-300`}
                      onClick={(e) => handleInternalNavLinkClick(e, link.href)}
                    >
                      {link.label}
                      <span
                        className={`absolute bottom-0 left-0 h-0.5 w-full transform rounded-full bg-sky-300 transition-transform duration-300 ${currentPath === link.href
                          ? "scale-x-100"
                          : "scale-x-0"
                          }`}
                        aria-hidden="true"
                      ></span>
                    </a>
                  ))}
                  <div
                    className="relative hidden text-[13px] lg:block"
                    ref={theLoaiRef}
                  >
                    <button
                      onClick={() => toggleDropdown("theloai")}
                      onKeyDown={(e) => handleDropdownKeyDown(e, "theloai")}
                      className="flex items-center space-x-2 py-2 font-medium text-white"
                      aria-expanded={showTheLoai}
                      aria-haspopup="true"
                      aria-controls="theloai-dropdown"
                      id="theloai-button"
                    >
                      <span>Thể Loại</span>
                      <DropdownArrowIcon open={showTheLoai} />
                    </button>
                    {showTheLoai && theLoaiList.length > 0 && (
                      <div
                        className="absolute left-2 top-full z-[51] mt-5 w-[30rem] overflow-hidden rounded-lg bg-[#23252b] shadow-2xl backdrop-blur-xl"
                        role="menu"
                        aria-labelledby="theloai-button"
                        id="theloai-dropdown"
                      >
                        <div className="px-2 py-4">
                          <div className="grid grid-cols-3 gap-1">
                            {theLoaiList.map((item) => (
                              <a
                                key={item.id}
                                href={`/the-loai/${item.slug}`}
                                className="block px-3 py-2 text-xs text-white hover:text-sky-300"
                                onClick={(e) =>
                                  handleInternalNavLinkClick(
                                    e,
                                    `/the-loai/${item.slug}`,
                                  )
                                }
                                role="menuitem"
                              >
                                {item.ten}
                              </a>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </nav>
              </nav>
            </div>

            <div className="relative flex-grow lg:hidden">
              <form
                onSubmit={handleMobileSearchSubmit}
                className="relative flex-grow"
                role="search"
              >
                <label htmlFor="mobile-search" className="sr-only">
                  Tìm kiếm phim
                </label>
                <input
                  ref={mobileSearchInputRef}
                  id="mobile-search"
                  type="text"
                  value={mobileSearchQuery}
                  onChange={(e) => setMobileSearchQuery(e.target.value)}
                  onFocus={() => {
                    if (
                      mobileSearchQuery.trim().length >= 1 ||
                      mobileSearchResults.length > 0
                    ) {
                      setShowMobileSearchResults(true);
                    }
                  }}
                  placeholder="Tìm kiếm phim..."
                  className="h-8 w-full max-w-[180px] rounded-[4px] bg-white/10 px-4 pr-10 text-xs text-white placeholder-white/60 focus:outline-none"
                  autoComplete="off"
                  aria-describedby={
                    showMobileSearchResults
                      ? "mobile-search-results"
                      : undefined
                  }
                  aria-expanded={showMobileSearchResults}
                  aria-autocomplete="list"
                  role="combobox"
                />
                {mobileSearchQuery.length > 0 ? (
                  <button
                    type="button"
                    onClick={() => {
                      setMobileSearchQuery("");
                      setShowMobileSearchResults(false);
                    }}
                    className="absolute right-0 top-0 h-full rounded-[4px] px-3 text-white/70 hover:text-white focus:outline-none"
                    aria-label="Xóa tìm kiếm"
                  >
                    <CloseIcon />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="absolute right-2 top-0 h-full rounded-[4px] text-white/70 hover:text-white focus:outline-none"
                    aria-label="Tìm kiếm"
                  >
                    <SearchIcon />
                  </button>
                )}
              </form>
            </div>
          </div>

          <div className="flex flex-shrink-0 items-center justify-center gap-2 px-0 md:gap-2 md:pl-2 lg:gap-3">
            <div ref={desktopSearchRef} className="relative hidden lg:block">
              <form
                onSubmit={handleDesktopSearchSubmit}
                className="relative"
                role="search"
              >
                <label htmlFor="desktop-search" className="sr-only">
                  Tìm kiếm phim
                </label>
                <input
                  ref={desktopSearchInputRef}
                  id="desktop-search"
                  type="text"
                  value={desktopSearchQuery}
                  onChange={(e) => setDesktopSearchQuery(e.target.value)}
                  onFocus={() => {
                    if (
                      desktopSearchQuery.trim().length >= 1 ||
                      desktopSearchResults.length > 0
                    ) {
                      setShowDesktopSearchResults(true);
                    }
                  }}
                  placeholder="Tìm kiếm phim..."
                  className="w-[20rem] rounded-md bg-[#ffffff20] px-3 py-2.5 pr-12 text-sm text-white placeholder-white/60 focus:outline focus:outline-2 focus:outline-offset-[1px] focus:outline-[white]"
                  autoComplete="off"
                  aria-describedby={
                    showDesktopSearchResults ? "search-results" : undefined
                  }
                  aria-expanded={showDesktopSearchResults}
                  aria-autocomplete="list"
                  role="combobox"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 flex h-6 -translate-y-1/2 items-center gap-2 border-l border-white/30 pl-3 text-white/70 transition-colors hover:text-white"
                  aria-label="Tìm kiếm"
                >
                  <SearchIcon />
                </button>
              </form>
              {showDesktopSearchResults && desktopSearchQuery.trim().length >= 1 && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-full z-50 mt-2 max-h-[60vh] w-full overflow-y-auto rounded-xl bg-[#1a1c22]/95 shadow-2xl backdrop-blur-xl border border-white/10"
                  id="search-results"
                >
                  <SearchResultsDropdown
                    results={desktopSearchResults}
                    isSearching={isDesktopSearching}
                    searchQueryLength={desktopSearchQuery.trim().length}
                    onResultClick={handleDesktopSearchResultClick}
                    searchType="desktop"
                  />
                </motion.div>
              )}
            </div>

            {/* Download App Button - Desktop Only */}
            <a
              href="/tai-ung-dung"
              className="hidden lg:flex items-center gap-1.5 rounded-lg bg-sky-500 px-3 py-1.5 text-xs font-medium text-white transition-all hover:bg-sky-600"
              title="Tải ứng dụng TrạmPhim"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 15v4c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" x2="12" y1="15" y2="3" />
              </svg>
              <span>Tải App</span>
            </a>

            <NotificationDropdown />
            <UserProfileDropdown />
          </div>
        </div>
      </header>
      {
        showMobileSearchResults && mobileSearchQuery.trim().length >= 1 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mobile-search-results-dropdown fixed left-0 right-0 z-[51] max-h-[100vh] overflow-y-auto rounded-xl bg-[#0F111A]/95 shadow-2xl backdrop-blur-xl border border-white/10 lg:hidden"
            style={{ top: "var(--header-height)" }}
            onClick={(e) => e.stopPropagation()}
            onTouchEnd={(e) => e.stopPropagation()}
            id="mobile-search-results"
          >
            <SearchResultsDropdown
              results={mobileSearchResults}
              isSearching={isMobileSearching}
              searchQueryLength={mobileSearchQuery.trim().length}
              onResultClick={handleMobileSearchResultClick}
              searchType="mobile"
            />
          </motion.div>
        )
      }
      {
        mobileMenuOpen && (
          <motion.div
            ref={mobileMenuPanelRef}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed left-0 right-0 z-[51] w-full border-t border-white/10 bg-[#1a1a1a]/95 backdrop-blur-xl text-sm font-medium shadow-2xl lg:m-8 lg:w-[30%] xl:hidden"
            style={{ top: "var(--header-height)" }}
            id="mobile-menu"
            role="navigation"
            aria-label="Menu di động"
          >
            <div className="px-3 py-3">
              {/* Download App Button - Mobile */}
              <a
                href="/tai-ung-dung"
                className="mb-3 flex items-center gap-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-3 text-white shadow-lg"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 15v4c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" x2="12" y1="15" y2="3" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-white/80">Tải ứng dụng</p>
                  <p className="font-semibold">TrạmPhim</p>
                </div>
              </a>

              <div className="grid grid-cols-1 gap-1">
                {[
                  { href: "/", label: "Trang Chủ" },
                  { href: "/loai-phim/phim-chieu-rap", label: "Phim Chiếu Rạp" },
                  { href: "/lich-chieu", label: "Lịch Chiếu" },
                  { href: "/loai-phim/hoat-hinh", label: "Phim Hoạt Hình" },
                  { href: "/anime", label: "Anime" },
                  { href: "/loai-phim/phim-le", label: "Phim Lẻ" },
                  { href: "/loai-phim/phim-bo", label: "Phim Bộ" },
                ].map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className={`block rounded-md px-3 py-2 text-left text-xs transition-all hover:bg-white/10 hover:text-white focus:bg-none focus:text-white ${currentPath === link.href ? "text-sky-300" : "text-white/90"
                      }`}
                    onClick={(e) => handleInternalNavLinkClick(e, link.href)}
                  >
                    {link.label}
                  </a>
                ))}
              </div>

              {/* THỂ LOẠI MOBILE DROP DOWN */}
              <div className="relative my-2" ref={mobileTheLoaiRef}>
                <button
                  onClick={() => toggleMobileDropdown("theloai")}
                  className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-xs text-left transition-all focus:bg-none hover:text-white  ${showMobileTheLoai ? "text-sky-300" : "text-white/90"
                    }`}
                  aria-expanded={showMobileTheLoai}
                  aria-haspopup="true"
                >
                  Thể Loại
                  <DropdownArrowIcon open={showMobileTheLoai} />
                </button>

                {showMobileTheLoai && theLoaiList.length > 0 && (
                  <div className="mt-1 grid grid-cols-3 gap-3 rounded-lg bg-white/5 px-3 py-2 text-white">
                    {theLoaiList.map((item) => {
                      return (
                        <a
                          key={item.id}
                          href={`/the-loai/${item.slug}`}
                          className={`block py-1 text-xs font-normal text-white transition-all hover:text-sky-300`}
                          onClick={(e) =>
                            handleInternalNavLinkClick(
                              e,
                              `/the-loai/${item.slug}`,
                            )
                          }
                        >
                          {item.ten}
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )
      }
    </AuthProvider >
  );
}
