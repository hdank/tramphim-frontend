import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "swiper/css";
import "swiper/css/navigation";

import { rutGonTinhTrangPhim, cleanhtml } from "../../utils/movieUtils";

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
    the_loai
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
            className="hidden md:block"
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              backgroundImage:
                "radial-gradient(circle, rgba(0, 0, 0, 0.3) 1px, transparent 1px)",
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
              className="hero-featured-alt-name"
            >
              {cleanhtml(ten_khac)}
            </motion.p>

            {/* Status + genre badges */}
            {(tinh_trang || badges.length > 0) && (
              <motion.div
                variants={fadeInUp}
                className="hero-featured-meta"
              >
                {tinh_trang && (
                  <span className="hero-meta-badge">
                    {tinh_trang}
                  </span>
                )}
                {badges.slice(0, 4).map((b, i) => (
                  <span key={i} className="hero-meta-badge ml-2">
                    {b}
                  </span>
                ))}
              </motion.div>
            )}

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
              className="hero-featured-actions hidden md:flex"
            >
              <a 
                href={movieLink}
                className="hero-play-btn"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
              </a>
              <a 
                href={movieLink}
                className="hero-info-btn"
                title="Xem chi tiết"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </a>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Right side - Movie thumbnails */}
        <div className="hero-featured-right">
          <div className="hero-thumbnails-container hidden md:flex">
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
      {/* Pagination dots (centered, accessible) - show only on mobile */}
      <div className="absolute left-1/2 transform -translate-x-1/2 bottom-6 flex gap-2 z-30 md:hidden">
        {heroMovies.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-2 rounded-full transition-all focus:outline-none ${
              i === activeIndex ? 'w-6 bg-white' : 'w-2 bg-white/40'
            }`}
            onClick={() => setActiveIndex(i)}
          />
        ))}
      </div>
    </section>
  );
}
