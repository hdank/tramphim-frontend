// src/components/MovieDetail/MovieActions.jsx
// Note: This file should be .jsx or .tsx for React, not .astro.
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// --- IndexedDB Constants (outside the component) ---
const DB_NAME = "FavoriteDB";
const DB_VERSION = 2;
const STORE_NAME = "FavoriteDB";

// --- IndexedDB Helper Functions (outside the component) ---
const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "slug" });
      }
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      reject("Error opening database: " + event.target.errorCode);
    };
  });
};

const addMovieToFavorites = async (movie) => {
  try {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    if (!movie || !movie.slug) {
      throw new Error("Movie object or slug is missing.");
    }

    const movieToAdd = {
      slug: movie.slug,
      ten_phim: movie.ten_phim,
      ten_khac: movie.ten_khac,
      banner_url: movie.banner_url,
      poster_url: movie.poster_url,
    };
    store.add(movieToAdd);
    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  } catch (error) {
    console.error("Error adding movie to favorites:", error);
    throw error;
  }
};

const removeMovieFromFavorites = async (slug) => {
  try {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(slug);
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error("Error removing movie from favorites:", error);
    throw error;
  }
};

const isMovieFavorite = async (slug) => {
  try {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(slug);

    return new Promise((resolve) => {
      request.onsuccess = () => resolve(!!request.result);
      request.onerror = () => resolve(false);
    });
  } catch (error) {
    console.error("Error checking favorite status:", error);
    return false;
  }
};

// --- Main Component ---
export default function MovieActions({
  firstEpisodeSlug,
  firstEpisodeType,
  movie,
}) {
  const [hrefXemNgay, setHrefXemNgay] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);

  const movieSlug = movie?.slug;
  const movieName = movie?.ten_phim;

  useEffect(() => {
    let initialHref;
    if (firstEpisodeType && firstEpisodeSlug) {
      initialHref = `/xem-phim/${movieSlug}/tap-${firstEpisodeSlug}/${firstEpisodeType}`;
    } else {
      initialHref = `/xem-phim/${movieSlug}/tap-full/vietsub`;
    }
    setHrefXemNgay(initialHref); // Check favorite status when the component mounts or movie changes

    const checkFavoriteStatus = async () => {
      if (movieSlug) {
        const status = await isMovieFavorite(movieSlug);
        setIsFavorite(status);
      }
    };
    checkFavoriteStatus();
  }, [movieSlug, firstEpisodeSlug, firstEpisodeType]);

  const handleShare = () => {
    const shareData = {
      title: `${movieName || "Phim"} | MotChill`,
      text: "Khám phá phim hấp dẫn mỗi ngày ",
      url: window.location.href,
    };

    if (navigator.share) {
      navigator
        .share(shareData)
        .catch((error) => console.log("Lỗi khi chia sẻ:", error));
    } else if (navigator.clipboard) {
      navigator.clipboard
        .writeText(shareData.url)
        .then(() => toast.success("📋 Đã sao chép đường dẫn!"))
        .catch(() =>
          toast.error("⚠️ Không thể sao chép, vui lòng copy thủ công."),
        );
    } else {
      alert(
        "⚠️ Trình duyệt của bạn không hỗ trợ sao chép tự động. Hãy copy đường dẫn này: " +
          shareData.url,
      );
    }
  };

  const handleFavoriteClick = async () => {
    if (!movieSlug) {
      toast.error("Không tìm thấy thông tin phim để lưu.");
      return;
    }

    try {
      if (isFavorite) {
        await removeMovieFromFavorites(movieSlug);
        setIsFavorite(false);
        toast.warn("Đã xóa phim khỏi danh sách yêu thích.");
      } else {
        await addMovieToFavorites(movie);
        setIsFavorite(true);
        toast.success("Đã thêm phim vào danh sách yêu thích!");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  const handleCommentClick = () => {
    const commentsSection = document.getElementById("movie-comments");
    if (commentsSection) {
      commentsSection.scrollIntoView({
        behavior: "smooth", // Cuộn mượt mà
        block: "start", // Căn chỉnh phần tử ở đầu viewport
      });
    }
  };
  return (
    <>
      <div className="hidden flex-row items-center justify-center gap-8 lg:flex">
        <a
          href={hrefXemNgay}
          className="flex w-[20%] items-center justify-center gap-4 rounded-full bg-gradient-to-br from-[#FECF59] to-[#FFF1CC] px-8 py-4 text-base font-medium text-gray-900 shadow-lg transition-all duration-200 hover:shadow-[0_4px_20px_rgba(255,222,150,1)]"
          aria-label="Xem phim ngay"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M21.409 9.353a2.998 2.998 0 0 1 0 5.294L8.597 21.614C6.534 22.737 4 21.277 4 18.968V5.033c0-2.31 2.534-3.769 4.597-2.648z" />
          </svg>
          Xem ngay
        </a>
        <div className="ml-4 flex flex-row items-center gap-4">
          <button
            onClick={handleShare}
            className="flex flex-col items-center justify-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold text-white transition-colors duration-200 hover:bg-[#ffffff10] hover:text-[#ffd785]"
            aria-label="Chia sẻ phim"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M20.336 3.221L3.873 8.71a.35.35 0 0 0-.027.654l6.05 2.593a.2.2 0 0 0 .196-.021l5.931-4.238c.184-.13.41.096.28.28l-4.238 5.931a.2.2 0 0 0-.02.195l2.592 6.05a.35.35 0 0 0 .654-.026L20.78 3.664a.35.35 0 0 0-.443-.443"
              />
            </svg>
            Chia sẻ
          </button>
          <button
            onClick={handleCommentClick}
            className="flex flex-col items-center justify-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold text-white transition-colors duration-200 hover:bg-[#ffffff10] hover:text-[#ffd785]"
            aria-label="Bình luận về phim"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 20 20"
            >
              <path
                fill="currentColor"
                d="M5.4 17.604c.33.437.957.526 1.399.2l4.011-2.962h4.59c1.436 0 2.6-1.149 2.6-2.566v-6.71C18 4.149 16.836 3 15.4 3H4.6C3.164 3 2 4.149 2 5.566v6.71c0 1.418 1.164 2.566 2.6 2.566h.6v2.171c0 .213.07.42.2.591M9.5 10a.5.5 0 0 1 0-1H15a.5.5 0 0 1 0 1zm-2-1a.5.5 0 0 1 0 1H5a.5.5 0 0 1 0-1zM5 11h5.5a.5.5 0 0 1 0 1H5a.5.5 0 0 1 0-1m7.5 1a.5.5 0 0 1 0-1H15a.5.5 0 0 1 0 1z"
              />
            </svg>
            Bình luận
          </button>
          <button
            onClick={handleFavoriteClick}
            className="group flex flex-col items-center justify-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold text-white transition-colors duration-200 hover:bg-[#ffffff10] hover:text-[#ffd785]"
            aria-label={
              isFavorite
                ? "Xóa khỏi danh sách yêu thích"
                : "Thêm vào danh sách yêu thích"
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              className={`transition-colors duration-300 ${
                isFavorite
                  ? "fill-[#ffd785]"
                  : "fill-white group-hover:fill-[#ffd785]"
              }`}
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            {isFavorite ? "Đã yêu thích" : "Yêu thích"}
          </button>
          <div className="group flex flex-row items-center justify-center gap-2 rounded-full bg-[#3556b6] px-6 py-3 text-base font-semibold text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <g fill="none">
                <path
                  fill="url(#SVGEm3qYdaJ)"
                  d="M5 19h15.281S20 19.5 20 20s.281 1 .281 1H6a1 1 0 0 1-1-1z"
                />
                <path
                  fill="url(#SVGSyoMhcka)"
                  d="M4 4.5A2.5 2.5 0 0 1 6.5 2H18a2.5 2.5 0 0 1 2.5 2.5v14.25a.75.75 0 0 1-.75.75H5.5a1 1 0 0 0 1 1h13.25a.75.75 0 0 1 0 1.5H6.5A2.5 2.5 0 0 1 4 19.5z"
                />
                <path
                  fill="url(#SVGM48Eddck)"
                  fillOpacity="0.3"
                  d="M4 4.5A2.5 2.5 0 0 1 6.5 2H18a2.5 2.5 0 0 1 2.5 2.5v14.25a.75.75 0 0 1-.75.75H5.5a1 1 0 0 0 1 1h13.25a.75.75 0 0 1 0 1.5H6.5A2.5 2.5 0 0 1 4 19.5z"
                />
                <path
                  fill="url(#SVGcC5bNeRc)"
                  fillOpacity="0.3"
                  d="M4 4.5A2.5 2.5 0 0 1 6.5 2H18a2.5 2.5 0 0 1 2.5 2.5v14.25a.75.75 0 0 1-.75.75H5.5a1 1 0 0 0 1 1h13.25a.75.75 0 0 1 0 1.5H6.5A2.5 2.5 0 0 1 4 19.5z"
                />
                <path
                  fill="url(#SVGQmfrVdlt)"
                  fillOpacity="0.3"
                  d="M4 4.5A2.5 2.5 0 0 1 6.5 2H18a2.5 2.5 0 0 1 2.5 2.5v14.25a.75.75 0 0 1-.75.75H5.5a1 1 0 0 0 1 1h13.25a.75.75 0 0 1 0 1.5H6.5A2.5 2.5 0 0 1 4 19.5z"
                />
                <path
                  fill="url(#SVGKMb6hcCi)"
                  d="m10.542 8.608l1.1-2.23a.678.678 0 0 1 1.216 0l1.1 2.23l2.461.357c.556.08.778.764.376 1.157l-1.78 1.735l.42 2.45a.678.678 0 0 1-.984.716l-2.201-1.157l-2.2 1.157a.678.678 0 0 1-.985-.715l.42-2.45l-1.78-1.736a.678.678 0 0 1 .376-1.157z"
                />
                <defs>
                  <radialGradient
                    id="SVGM48Eddck"
                    cx="0"
                    cy="0"
                    r="1"
                    gradientTransform="matrix(4 3.5 -1.30282 1.48894 12 12.5)"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#171155" />
                    <stop offset="1" stopColor="#4a43cb" stopOpacity="0" />
                  </radialGradient>
                  <radialGradient
                    id="SVGcC5bNeRc"
                    cx="0"
                    cy="0"
                    r="1"
                    gradientTransform="matrix(4.4375 -3.75 2.09822 2.4829 14 12)"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#171155" />
                    <stop offset="1" stopColor="#4a43cb" stopOpacity="0" />
                  </radialGradient>
                  <radialGradient
                    id="SVGQmfrVdlt"
                    cx="0"
                    cy="0"
                    r="1"
                    gradientTransform="rotate(139.399 3.596 8.72)scale(4.60977 2.09909)"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#171155" />
                    <stop offset="1" stopColor="#4a43cb" stopOpacity="0" />
                  </radialGradient>
                  <linearGradient
                    id="SVGEm3qYdaJ"
                    x1="12.174"
                    x2="12.174"
                    y1="20.4"
                    y2="18"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#9deaff" />
                    <stop offset=".716" stopColor="#58aafe" />
                  </linearGradient>
                  <linearGradient
                    id="SVGSyoMhcka"
                    x1="9.693"
                    x2="12.681"
                    y1="5.742"
                    y2="27.308"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#20ac9d" />
                    <stop offset="1" stopColor="#2052cb" />
                  </linearGradient>
                  <linearGradient
                    id="SVGKMb6hcCi"
                    x1="10.893"
                    x2="13.647"
                    y1="7.655"
                    y2="17.289"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#ffe06b" />
                    <stop offset="1" stopColor="#ff835c" />
                  </linearGradient>
                </defs>
              </g>
            </svg>
            {movie.tmdb && <span className="text-white">{movie.tmdb}</span>}
            <span className="text-xs text-[#ffd785] underline">Đánh Giá</span>
          </div>
        </div>
      </div>
      <div className="mt-4 flex w-full flex-col gap-3 lg:hidden">
        <div className="flex flex-col items-center justify-center gap-6">
          <a
            href={hrefXemNgay}
            className="flex w-[60%] items-center justify-center gap-2 rounded-full bg-gradient-to-br from-[#FECF59] to-[#FFF1CC] px-6 py-3 text-base font-semibold text-gray-900 shadow-lg transition-all duration-200 hover:drop-shadow-xl md:w-[40%] lg:w-[70%]"
            aria-label="Xem phim ngay"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M21.409 9.353a2.998 2.998 0 0 1 0 5.294L8.597 21.614C6.534 22.737 4 21.277 4 18.968V5.033c0-2.31 2.534-3.769 4.597-2.648z" />
            </svg>
            Xem ngay
          </a>
          <div className="flex flex-row items-center justify-center gap-4">
            <button
              onClick={handleShare}
              className="flex flex-col items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-white transition-colors duration-200 hover:text-[#ffd785]"
              aria-label="Chia sẻ phim"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M20.336 3.221L3.873 8.71a.35.35 0 0 0-.027.654l6.05 2.593a.2.2 0 0 0 .196-.021l5.931-4.238c.184-.13.41.096.28.28l-4.238 5.931a.2.2 0 0 0-.02.195l2.592 6.05a.35.35 0 0 0 .654-.026L20.78 3.664a.35.35 0 0 0-.443-.443"
                />
              </svg>
              Chia sẻ
            </button>
            <button
              onClick={handleCommentClick}
              className="flex flex-col items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-white transition-colors duration-200 hover:bg-slate-200/20 hover:text-[#ffd785]"
              aria-label="Bình luận về phim"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 20 20"
              >
                <path
                  fill="currentColor"
                  d="M5.4 17.604c.33.437.957.526 1.399.2l4.011-2.962h4.59c1.436 0 2.6-1.149 2.6-2.566v-6.71C18 4.149 16.836 3 15.4 3H4.6C3.164 3 2 4.149 2 5.566v6.71c0 1.418 1.164 2.566 2.6 2.566h.6v2.171c0 .213.07.42.2.591M9.5 10a.5.5 0 0 1 0-1H15a.5.5 0 0 1 0 1zm-2-1a.5.5 0 0 1 0 1H5a.5.5 0 0 1 0-1zM5 11h5.5a.5.5 0 0 1 0 1H5a.5.5 0 0 1 0-1m7.5 1a.5.5 0 0 1 0-1H15a.5.5 0 0 1 0 1z"
                />
              </svg>
              Bình luận
            </button>
            <button
              onClick={handleFavoriteClick}
              className="group flex flex-col items-center justify-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold text-white transition-colors duration-200 hover:bg-[#ffffff10] hover:text-[#ffd785]"
              aria-label={
                isFavorite
                  ? "Xóa khỏi danh sách yêu thích"
                  : "Thêm vào danh sách yêu thích"
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className={`transition-colors duration-300 ${
                  isFavorite
                    ? "fill-[#ffd785]"
                    : "fill-white group-hover:fill-[#ffd785]"
                }`}
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              {isFavorite ? "Đã yêu thích" : "Yêu thích"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
