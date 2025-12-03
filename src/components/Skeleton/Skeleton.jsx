import React from "react";
import { motion } from "framer-motion";

// Base Shimmer Skeleton Component
export const Shimmer = ({ className = "" }) => (
  <div className={`skeleton-shimmer ${className}`}>
    <div className="shimmer-wave" />
  </div>
);

// Movie Card Skeleton
export const MovieCardSkeleton = ({ index = 0 }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3, delay: index * 0.05 }}
    className="flex flex-col"
  >
    <div className="skeleton-shimmer aspect-[2/3] w-full rounded-lg" />
    <div className="mt-3 space-y-2">
      <div className="skeleton-shimmer h-4 w-3/4 rounded" />
      <div className="skeleton-shimmer h-3 w-1/2 rounded" />
    </div>
  </motion.div>
);

// Movie Card Skeleton for Top 10 with ranking
export const MovieCardTopSkeleton = ({ index = 0 }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3, delay: index * 0.05 }}
    className="flex flex-col"
  >
    <div className="skeleton-shimmer aspect-[2/3] w-full rounded-lg" />
    <div className="flex items-center gap-x-4 py-4">
      <div className="skeleton-shimmer h-12 w-12 rounded" />
      <div className="flex-1 space-y-2">
        <div className="skeleton-shimmer h-4 w-3/4 rounded" />
        <div className="skeleton-shimmer h-3 w-1/2 rounded" />
      </div>
    </div>
  </motion.div>
);

// Hero Banner Skeleton
export const HeroSkeleton = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="relative aspect-[16/9] w-full overflow-hidden rounded-lg"
  >
    <div className="skeleton-shimmer absolute inset-0" />
    <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-8">
      <div className="skeleton-shimmer mb-4 h-8 w-1/3 rounded lg:h-10" />
      <div className="flex gap-2">
        <div className="skeleton-shimmer h-6 w-20 rounded-full" />
        <div className="skeleton-shimmer h-6 w-32 rounded-full" />
      </div>
    </div>
  </motion.div>
);

// Theme Card Skeleton
export const ThemeCardSkeleton = ({ index = 0 }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3, delay: index * 0.08 }}
    className="movie-card-item-column-gap-4 h-[70px] sm:h-[100px] lg:h-[120px]"
  >
    <div className="skeleton-shimmer h-full w-full rounded-lg" />
  </motion.div>
);

// Section Header Skeleton
export const SectionHeaderSkeleton = () => (
  <div className="mb-4">
    <div className="flex items-center gap-3 mb-2">
      <div className="skeleton-shimmer h-1 w-8 rounded-full" />
      <div className="skeleton-shimmer h-6 w-40 rounded lg:h-8 lg:w-52" />
    </div>
    <div className="skeleton-shimmer h-px w-full" />
  </div>
);

// Grid Skeleton for multiple cards
export const MovieGridSkeleton = ({ count = 6, type = "default" }) => {
  const SkeletonComponent = type === "top" ? MovieCardTopSkeleton : MovieCardSkeleton;
  
  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-5 xl:grid-cols-6 lg:gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonComponent key={index} index={index} />
      ))}
    </div>
  );
};

// Full Section Skeleton with header
export const SectionSkeleton = ({ count = 6, type = "default" }) => (
  <section className="relative h-auto pt-2">
    <SectionHeaderSkeleton />
    <div className="py-4">
      <MovieGridSkeleton count={count} type={type} />
    </div>
  </section>
);

// Search Result Skeleton
export const SearchResultSkeleton = () => (
  <div className="flex items-center space-x-3 px-3 py-3">
    <div className="skeleton-shimmer h-16 w-12 flex-shrink-0 rounded" />
    <div className="flex-1 space-y-2">
      <div className="skeleton-shimmer h-4 w-3/4 rounded" />
      <div className="skeleton-shimmer h-3 w-1/2 rounded" />
    </div>
  </div>
);

export default {
  Shimmer,
  MovieCardSkeleton,
  MovieCardTopSkeleton,
  HeroSkeleton,
  ThemeCardSkeleton,
  SectionHeaderSkeleton,
  MovieGridSkeleton,
  SectionSkeleton,
  SearchResultSkeleton,
};
