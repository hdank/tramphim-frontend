import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "swiper/css";
import "swiper/css/navigation";
import { toast } from "react-toastify";
import HeroOverlay from "../HeroOverlay/HeroOverlay";

import {
  rutGonTinhTrangPhim,
  cleanhtml,
  addMovieToFavorites,
  removeMovieFromFavorites,
  isMovieFavorite
} from "../../utils/movieUtils";

// Skeleton with shimmer effect
const HeroSkeleton = () => {
  return (
    <div className="hero-featured-container">
      <div className="hero-featured-bg">
        <div className="skeleton-shimmer absolute inset-0" />
      </div>
      <div className="hero-featured-content">
        <div className="hero-featured-left">
          <div className="skeleton-shimmer mb-4 h-12 w-3/4 rounded-lg lg:h-16" />
          <div className="skeleton-shimmer mb-2 h-4 w-1/2 rounded" />
          <div className="flex gap-2 mb-4">
            <div className="skeleton-shimmer h-6 w-16 rounded-full" />
            <div className="skeleton-shimmer h-6 w-16 rounded-full" />
            <div className="skeleton-shimmer h-6 w-16 rounded-full" />
          </div>
          <div className="skeleton-shimmer mb-4 h-16 w-full rounded" />
          <div className="flex gap-3">
            <div className="skeleton-shimmer h-12 w-12 rounded-full" />
            <div className="skeleton-shimmer h-12 w-12 rounded-full" />
          </div>
        </div>
        <div className="hero-featured-right">
          <div className="flex gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton-shimmer h-16 w-12 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

const staggerChildren = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function MovieCard({ movies = [], loading }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hasSSRBackground, setHasSSRBackground] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const heroMovies = movies.slice(0, 8);
  const activeMovie = heroMovies[activeIndex];
  const touchStartXRef = useRef(0);
  const touchStartYRef = useRef(0);
  const touchMovedRef = useRef(false);
  const SWIPE_THRESHOLD = 40;

  // Auto-rotate every 8 seconds
  useEffect(() => {
    if (heroMovies.length === 0) return;
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % heroMovies.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [heroMovies.length, isPaused]);

  // Check favorite status when active movie changes
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (activeMovie?.slug) {
        const status = await isMovieFavorite(activeMovie.slug);
        setIsFavorite(status);
      }
    };
    checkFavoriteStatus();
  }, [activeMovie]);

  // Detect server-rendered hero image to avoid double-loading and prioritize SSR LCP
  useEffect(() => {
    try {
      if (typeof document !== "undefined") {
        const ssrImg = document.querySelector('.hero-featured-bg-img[data-ssr="true"]');
        if (ssrImg) setHasSSRBackground(true);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const handleFavoriteClick = async () => {
    if (!activeMovie || !activeMovie.slug) {
      toast.error("Không tìm thấy thông tin phim.");
      return;
    }

    try {
      if (isFavorite) {
        await removeMovieFromFavorites(activeMovie.slug);
        setIsFavorite(false);
        toast.info("Đã xóa khỏi danh sách yêu thích");
      } else {
        await addMovieToFavorites(activeMovie);
        setIsFavorite(true);
        toast.success("Đã thêm vào danh sách yêu thích");
      }
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra.");
    }
  };

  if (loading || !heroMovies || heroMovies.length === 0) {
    return <HeroSkeleton />;
  }

  const {
    id,
    slug,
    ten_phim,
    banner_url,
    poster_url,
    title_image_url,
    tinh_trang,
    ten_khac,
    mo_ta,
    the_loai,
    tmdb
  } = activeMovie;

  const movieLink = `/phim/${slug}`;
  // Decode HTML entities in description to avoid showing raw entities like &quot;
  const decodedDescription = cleanhtml(mo_ta);
  // normalize genres/badges
  const rawBadges = Array.isArray(the_loai)
    ? the_loai
    : typeof the_loai === "string" && the_loai.length
      ? the_loai.split(",").map((s) => s.trim())
      : [];
  const badges = rawBadges
    .map((b) => (typeof b === "string" ? b : b && (b.ten || b.name || b.slug || "")))
    .filter(Boolean);

  return (
    <section
      className="hero-featured-section"
      style={{
        position: "relative",
        left: "50%",
        right: "50%",
        marginLeft: "-50vw",
        marginRight: "-50vw",
        width: "100vw",
        minHeight: "60vh"
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={(e) => {
        touchMovedRef.current = false;
        const t = e.touches && e.touches[0];
        if (t) {
          touchStartXRef.current = t.clientX;
          touchStartYRef.current = t.clientY;
        }
      }}
      onTouchMove={(e) => {
        const t = e.touches && e.touches[0];
        if (!t) return;
        const dx = Math.abs(t.clientX - touchStartXRef.current);
        const dy = Math.abs(t.clientY - touchStartYRef.current);
        if (dx > 10 || dy > 10) touchMovedRef.current = true;
      }}
      onTouchEnd={(e) => {
        const touch = e.changedTouches && e.changedTouches[0];
        if (!touch) return;
        const dx = touch.clientX - touchStartXRef.current;
        const dy = touch.clientY - touchStartYRef.current;
        // horizontal swipe
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > SWIPE_THRESHOLD) {
          if (dx < 0) {
            // swipe left -> next
            setActiveIndex((prev) => (prev + 1) % heroMovies.length);
          } else {
            // swipe right -> prev
            setActiveIndex((prev) => (prev - 1 + heroMovies.length) % heroMovies.length);
          }
          return;
        }
        // treat as tap if not moved much and target isn't interactive
        if (!touchMovedRef.current) {
          const target = document.elementFromPoint(touch.clientX, touch.clientY);
          if (target && !target.closest("a, button, input, svg")) {
            window.location.href = `/phim/${heroMovies[activeIndex].slug}`;
          }
        }
      }}
      onClick={(e) => {
        // if user clicked an interactive control, don't navigate
        if (e.target && (e.target.closest && e.target.closest("a, button, input, svg"))) return;
        // navigate to current active movie
        window.location.href = `/phim/${heroMovies[activeIndex].slug}`;
      }}
    >
      {/* Background Image with transition */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="hero-featured-bg"
        >
          <img
            src={banner_url || poster_url}
            alt={ten_phim}
            className="hero-featured-bg-img"
            fetchPriority={hasSSRBackground ? "low" : "high"}
            loading={hasSSRBackground ? "lazy" : "eager"}
            decoding="async"
            style={{ filter: "brightness(1.26) saturate(1.15)" }}
          />
          {/* dotted overlay pattern (desktop-only) */}
          <div
            className="hidden lg:block"
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              backgroundImage:
                "radial-gradient(circle, rgba(10, 10, 15, 0.3) 1px, transparent 1px)",
              backgroundSize: "5px 5px",
              mixBlendMode: "overlay",
              opacity: 1,
              zIndex: 30
            }}
          />
          <div className="hero-featured-gradient" />
          <div className="hero-featured-gradient-left" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="hero-featured-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={staggerChildren}
            className="hero-featured-left"
          >
            {/* Title Image - Display if available */}
            {title_image_url && (
              <motion.div
                variants={fadeInUp}
                className="hero-title-image-wrapper"
              >
                <img
                  src={title_image_url}
                  alt={ten_phim}
                  className="hero-title-image"
                />
              </motion.div>
            )}

            {/* Title - Hide if title image is displayed */}
            {!title_image_url && (
              <motion.h1
                variants={fadeInUp}
                className="hero-featured-title"
              >
                {ten_phim}
              </motion.h1>
            )}

            {/* Alt name */}
            <motion.p
              variants={fadeInUp}
              className="font-medium text-yellow-400 text-base lg:text-lg mb-1"
            >
              {cleanhtml(ten_khac || ten_phim)}
            </motion.p>

            {/* Status + genre badges */}
            <motion.div variants={fadeInUp} className="flex flex-col gap-3 mb-2">
              {/* Row 1: Technical Meta (TMDb, Quality, Year, Duration) */}
              <div className="flex flex-wrap items-center gap-2">
                {tmdb && (
                  <span className="px-2 py-0.5 rounded border border-yellow-400 text-yellow-400 text-xs font-bold tracking-wider">
                    TMDB {tmdb}
                  </span>
                )}
                {tinh_trang && (
                  <span className="px-2 py-0.5 rounded border border-white/60 text-white text-xs font-bold tracking-wider uppercase">
                    {tinh_trang}
                  </span>
                )}
                {/* Placeholder for Year/Quality if available in data, otherwise just static placeholders for design match if needed, but using real data is better. keeping it simple with real data + style */}
                <span className="px-2 py-0.5 rounded border border-white/60 text-white text-xs font-bold tracking-wider">
                  2025
                </span>
              </div>

              {/* Row 2: Genres */}
              {badges.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  {badges.slice(0, 5).map((b, i) => (
                    <span key={i} className="px-3 py-1 rounded bg-white/10 text-gray-200 text-xs font-medium hover:bg-white/20 transition-colors">
                      {b}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Description - hidden on mobile */}
            <motion.p
              variants={fadeInUp}
              className="hero-featured-desc hidden md:block"
            >
              {decodedDescription ? (decodedDescription.length > 200 ? decodedDescription.substring(0, 200) + '...' : decodedDescription) : ''}
            </motion.p>

            {/* Action buttons (hidden on mobile) */}
            <motion.div
              variants={fadeInUp}
              className="flex items-center gap-4 mt-2 hidden md:flex"
            >
              {/* Play Button - Large Red Circle */}
              <a
                href={movieLink}
                className="flex items-center justify-center w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 hover:scale-105 transition-all shadow-[0_0_20px_rgba(220,38,38,0.4)] group"
              >
                <svg className="w-8 h-8 text-white fill-current ml-1" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </a>

              {/* Secondary Actions Pill */}
              <div className="flex items-center rounded-full bg-black/40 backdrop-blur-md border border-white/10 h-14 overflow-hidden">
                {/* Heart Button */}
                <button
                  onClick={handleFavoriteClick}
                  className="w-16 h-full flex items-center justify-center text-white transition-colors border-r border-white/10 hover:bg-white/10 active:scale-95"
                  title={isFavorite ? "Bỏ yêu thích" : "Yêu thích"}
                >
                  <svg
                    className={`w-6 h-6 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-white'}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {isFavorite ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    )}
                  </svg>
                </button>

                {/* Info Button */}
                <a href={movieLink} className="w-16 h-full flex items-center justify-center text-white transition-colors hover:bg-white/10" title="Chi tiết">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </a>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Right side - Movie thumbnails */}
        <div className="hero-featured-right">
          {/* Glass Effect Wrapper for Thumbnails - Recreating the 'Edge Card' look */}
          <div className="hidden md:block relative p-3 rounded-2xl bg-black/20 backdrop-blur-xl border border-white/10 shadow-2xl">
            {/* Gradient glow behind */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

            <div className="hero-thumbnails-container relative z-10">
              {heroMovies.map((movie, index) => (
                <button
                  key={movie.id || movie.slug}
                  onClick={() => setActiveIndex(index)}
                  className={`hero-thumbnail ${index === activeIndex ? 'hero-thumbnail-active' : ''}`}
                >
                  <img
                    src={movie.poster_url}
                    alt={movie.ten_phim}
                    className="hero-thumbnail-img"
                  />
                  {index === activeIndex && (
                    <div className="hero-thumbnail-border" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Pagination dots (centered, accessible) - show only on mobile */}
      <div className="hero-mobile-pagination absolute left-1/2 transform -translate-x-1/2 bottom-6 flex gap-2 z-30 md:hidden">
        {heroMovies.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-2 rounded-full transition-all focus:outline-none ${i === activeIndex ? 'w-6 bg-white' : 'w-2 bg-white/40'
              }`}
            onClick={() => setActiveIndex(i)}
          />
        ))}
      </div>
    </section>
  );
}
