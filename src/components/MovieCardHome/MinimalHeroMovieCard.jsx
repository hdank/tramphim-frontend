import React, { useState, useEffect, useRef } from "react";
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
  const [mobileImageLoaded, setMobileImageLoaded] = useState(true);
  const mobileImgRef = useRef(null);

  useEffect(() => {
    // reset mobile image loaded flag on featured change to trigger fade
    setMobileImageLoaded(false);
    // if the new image is already cached/complete, immediately set loaded
    const img = mobileImgRef.current;
    if (img && img.complete) {
      // allow DOM to update before showing
      setTimeout(() => setMobileImageLoaded(true), 0);
    }
  }, [activeIndex]);

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
  const subtitle = ten_khac || "";
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
    <section className="minimal-hero-card relative bg-transparent sm:bg-[#0b1220]/60 rounded-3xl p-6 lg:p-8 mb-8 overflow-hidden">
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
      {/* dotted overlay pattern (now visible on all sizes so it overlays the mobile poster) */}
      <div
        className="absolute inset-0 z-10"
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
          {/* Left content (hidden on small screens - mobile shows poster + controls only) */}
          <div className="hidden lg:block lg:flex-1">
            {title && (
              <div className="flex items-center gap-3 mb-3">
                <span className="inline-block w-8 h-1 rounded-full bg-cyan-400" />
                <h3 className="header-title">{title}</h3>
              </div>
            )}

            <h2 className="header-title text-2xl sm:text-3xl lg:text-4xl leading-tight mb-2">
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
              <p className="text-gray-300 max-w-2xl mb-6 block md:block font-mono">
                {description.length > 180 ? description.substring(0, 180) + "..." : description}
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
              
              {/* Controls under the image for mobile (centered) */}
              <div className="mt-4 flex items-center justify-center gap-3 px-1 z-40">
                <a
                  href={movieLink}
                  className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-b from-yellow-400 to-yellow-500 shadow-lg"
                  aria-label="Play"
                >
                  <svg className="h-6 w-6 text-black" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                  </svg>
                </a>

                <a
                  href={movieLink}
                  className="h-12 px-4 rounded-md border border-white/10 text-sm text-white/90 flex items-center gap-2"
                >
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
            {/* Mobile: poster image + controls stacked (visible only on small screens) */}
            <div className="relative w-full block lg:hidden mb-4">
              {/* clickable area for the banner (navigates to movie page) */}
              <a href={movieLink} className="block rounded-2xl overflow-hidden relative -mx-10 md:-mx-14 lg:mx-0">
                <img
                  ref={mobileImgRef}
                  src={convertImage(banner_url || poster_url, 1200)}
                  alt={ten_phim}
                  className="w-full rounded-none shadow-lg object-cover transition-opacity duration-500 ease-in-out"
                  loading="lazy"
                  onLoad={() => setMobileImageLoaded(true)}
                  style={{ opacity: mobileImageLoaded ? 1 : 0 }}
                />

                {/* darker gradient overlay for legibility (heavier at bottom) */}
                <div
                  className="absolute inset-0 rounded-lg pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(0,0,0,0.0) 10%, rgba(0,0,0,0.55) 40%, rgba(0,0,0,0.95) 100%)",
                  }}
                  aria-hidden="true"
                />

                {/* Title + subtitle positioned above the circular carousel (centered) */}
                <div className="absolute left-4 right-4 bottom-24 z-40 flex flex-col items-center text-center px-2">
                  <h2 className="text-white font-bold text-2xl leading-tight truncate max-w-full">
                    {ten_phim}
                  </h2>
                  {subtitle && <div className="text-yellow-400 text-sm mt-1">{subtitle}</div>}
                </div>
              </a>

              {/* Bottom centered overlay: circular interactive thumbnails + compact badges */}
              <div className="absolute left-4 right-4 bottom-4 z-40 flex items-center justify-center">
                <div className="flex items-center gap-3 bg-transparent py-1 px-2 rounded-md">
                  {movies.slice(0, 6).map((m, i) => {
                    const isActiveThumb = i === activeIndex;
                    return (
                      <button
                        key={`thumb-btn-${i}`}
                        onClick={(e) => {
                          // prevent the parent anchor from navigating when clicking thumbs
                          e.stopPropagation();
                          e.preventDefault && e.preventDefault();
                          setActiveIndex(i);
                        }}
                        className={`w-8 h-8 rounded-full overflow-hidden ring-2 ${isActiveThumb ? "ring-cyan-400" : "ring-white/20"} focus:outline-none`}
                        title={m.ten_phim}
                        aria-label={`Chuyển tới ${m.ten_phim}`}
                      >
                        <img src={m.poster_url} alt={m.ten_phim} className="w-full h-full object-cover" loading="lazy" />
                      </button>
                    );
                  })}
                </div>
                {/* compact badges to the right of thumbnails on larger mobiles, hidden on very small */}
                <div className="ml-3 hidden xs:flex items-center gap-2">
                  {nam_phat_hanh && (
                    <span className="text-xs bg-white/5 text-white/90 px-2 py-1 rounded-full border border-white/5">
                      {nam_phat_hanh}
                    </span>
                  )}
                  {badges[0] && (
                    <span className="text-xs bg-white/5 text-white/90 px-2 py-1 rounded-full border border-white/5">
                      {badges[0]}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="relative hidden lg:block h-full" style={{ minHeight: 0 }}>
              {/* desktop uses background underlay; keep an accessible poster for non-decorative scenarios */}
              <img
                src={convertImage(banner_url || poster_url, 1200)}
                alt={ten_phim}
                className="w-full rounded-2xl object-cover hidden"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>

        {/* Thumbnails */}
        <div className="mt-6 hidden lg:block">
          <div className="flex gap-3 overflow-x-auto pb-3">
            {movies.map((m, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={m.id || m.slug || idx}
                  onClick={() => setActiveIndex(idx)}
                className={`flex-shrink-0 rounded-lg overflow-hidden w-16 h-24 sm:w-20 sm:h-28 shadow-sm border ${isActive ? "ring-2 ring-cyan-400" : "border-white/5"}`}
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


