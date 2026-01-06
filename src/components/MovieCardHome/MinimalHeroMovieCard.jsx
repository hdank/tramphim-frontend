import React, { useState, useEffect } from "react";
import { cleanhtml, convertImage } from "../../utils/movieUtils";

/**
 * MinimalHeroMovieCard
 *
 * Redesigned to look like the provided screenshot:
 * - Left: large title, badges, description, big play button
 * - Right: large poster/banner with rounded corners
 * - Row of small thumbnails below
 */
export default function MinimalHeroMovieCard({ movies = [], title = "", loading = false }) {
  if (loading || !movies || movies.length === 0) return null;

  const [activeIndex, setActiveIndex] = useState(0);
  useEffect(() => {
    if (!movies || movies.length === 0) return;
    if (activeIndex >= movies.length) setActiveIndex(0);
  }, [movies, activeIndex]);

  const featured = movies[activeIndex];
  const {
    slug,
    ten_phim,
    poster_url,
    banner_url,
    mo_ta,
    ten_khac,
    the_loai,
    nam_phat_hanh,
  } = featured;

  const description = cleanhtml(mo_ta || ten_khac || "");
  const movieLink = `/phim/${slug}`;

  // badges from genres if available (safe split)
  const rawBadges = Array.isArray(the_loai)
    ? the_loai
    : typeof the_loai === "string" && the_loai.length
    ? the_loai.split(",").map((s) => s.trim())
    : [];

  // Normalize badges to strings (API sometimes returns objects like {id, ten, slug})
  const badges = rawBadges
    .map((b) =>
      typeof b === "string" ? b : b && (b.ten || b.name || b.slug || "")
    )
    .filter(Boolean);

  return (
    <section className="minimal-hero-card relative bg-[#0b1220]/60 rounded-3xl p-6 lg:p-8 mb-8 overflow-hidden">
      {/* Background underlay (featured poster/banner) */}
      <div
        className="minimal-hero-bg absolute inset-0 z-0 bg-no-repeat"
        style={{
          backgroundImage: `url(${convertImage(banner_url || poster_url, 1600)})`,
          backgroundPosition: "right center",
          backgroundSize: "60% auto",
        }}
        aria-hidden="true"
      />
      {/* dotted overlay pattern (desktop-only) */}
      <div
        className="hidden md:block absolute inset-0 z-10"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(0, 0, 0, 0.28) 1px, transparent 1px)",
          backgroundSize: "5px 5px",
          mixBlendMode: "overlay",
          opacity: 1,
        }}
        aria-hidden="true"
      />
      {/* general gradient to ensure readability */}
      <div
        className="hero-featured-gradient absolute inset-0 z-20"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(90deg, rgba(2,6,23,0.92) 0%, rgba(2,6,23,0.8) 30%, rgba(2,6,23,0.6) 50%, rgba(2,6,23,0.2) 75%, rgba(2,6,23,0) 100%)",
        }}
      />
      {/* smoother fade overlay (subtle) sits above general gradient but below content */}
      <div
        className="minimal-hero-fade absolute inset-0 z-25 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(90deg, rgba(2,6,23,1) 0%, rgba(2,6,23,0.95) 10%, rgba(2,6,23,0.85) 25%, rgba(2,6,23,0.6) 40%, rgba(2,6,23,0.25) 60%, rgba(2,6,23,0) 85%)",
        }}
      />

      <div className="max-w-[1300px] mx-0 relative z-30 pl-4 md:pl-8">
        <div className="lg:flex lg:items-start lg:gap-8">
          {/* Left content */}
          <div className="lg:flex-1">
            {title && (
              <div className="flex items-center gap-3 mb-3">
                <span className="inline-block w-8 h-1 rounded-full bg-cyan-400" />
                <h3 className="header-title">{title}</h3>
              </div>
            )}

            <h2 className="header-title text-3xl lg:text-4xl leading-tight mb-2">
              {ten_phim}
            </h2>

            <div className="flex items-center gap-3 mb-4 flex-wrap">
              {badges.slice(0, 6).map((b, i) => (
                <span key={i} className="text-xs bg-white/5 text-white/90 px-3 py-1 rounded-full border border-white/5">
                  {b}
                </span>
              ))}
              {nam_phat_hanh && (
                <span className="text-xs bg-white/5 text-white/90 px-3 py-1 rounded-full border border-white/5">
                  {nam_phat_hanh}
                </span>
              )}
            </div>

            {description && (
              <p className="text-gray-300 max-w-2xl mb-6 hidden md:block font-mono">
                {description.length > 260 ? description.substring(0, 260) + "..." : description}
              </p>
            )}

            <div className="flex items-center gap-4">
              <a
                href={movieLink}
                className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-b from-yellow-400 to-yellow-500 shadow-lg"
                aria-label="Play"
              >
                <svg className="h-6 w-6 text-black" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
              </a>

              <div className="flex items-center gap-2">
                <a href={movieLink} className="h-12 px-4 rounded-md border border-white/10 text-sm text-white/90 flex items-center gap-2">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Xem chi tiết
                </a>
              </div>
            </div>
          </div>

          {/* Right poster/banner */}
          {/* Right area now uses the background underlay; keep slide controls positioned over it */}
          <div className="mt-6 lg:mt-0 lg:w-[640px] lg:flex-shrink-0">
            <div className="relative h-0 lg:h-0" style={{ minHeight: 0 }}>
            </div>
          </div>
        </div>

        {/* Thumbnails */}
        <div className="mt-6">
          <div className="flex gap-3 overflow-x-auto pb-3">
            {movies.map((m, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={m.id || m.slug || idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`flex-shrink-0 rounded-lg overflow-hidden w-20 h-28 shadow-sm border ${isActive ? "ring-2 ring-cyan-400" : "border-white/5"}`}
                  title={m.ten_phim}
                >
                  <img src={m.poster_url} alt={m.ten_phim} className="w-full h-full object-cover" loading="lazy" />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}


