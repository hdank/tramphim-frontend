import React, { useState, useEffect } from "react";
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
  const heroMovies = movies.slice(0, 8);
  const activeMovie = heroMovies[activeIndex];

  // Auto-rotate every 8 seconds
  useEffect(() => {
    if (heroMovies.length === 0) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % heroMovies.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [heroMovies.length]);

  if (loading || !heroMovies || heroMovies.length === 0) {
    return <HeroSkeleton />;
  }

  const { 
    id, 
    slug, 
    ten_phim, 
    banner_url, 
    poster_url,
    tinh_trang, 
    ten_khac,
    mo_ta
  } = activeMovie;

  const movieLink = `/phim/${slug}`;

  return (
    <section className="hero-featured-section">
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
            {/* Title */}
            <motion.h1 
              variants={fadeInUp}
              className="hero-featured-title"
            >
              {ten_phim}
            </motion.h1>

            {/* Alt name */}
            <motion.p 
              variants={fadeInUp}
              className="hero-featured-alt-name"
            >
              {cleanhtml(ten_khac)}
            </motion.p>

            {/* Status badge */}
            {tinh_trang && (
              <motion.div 
                variants={fadeInUp}
                className="hero-featured-meta"
              >
                <span className="hero-meta-badge">
                  {tinh_trang}
                </span>
              </motion.div>
            )}

            {/* Description */}
            <motion.p 
              variants={fadeInUp}
              className="hero-featured-desc"
            >
              {mo_ta ? (mo_ta.length > 200 ? mo_ta.substring(0, 200) + '...' : mo_ta) : ''}
            </motion.p>

            {/* Action buttons */}
            <motion.div 
              variants={fadeInUp}
              className="hero-featured-actions"
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
          <div className="hero-thumbnails-container">
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
    </section>
  );
}
