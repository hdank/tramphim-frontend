import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { cleanhtml, rutGonTinhTrangNgonNgu } from "../../utils/movieUtils";
import alarmGif from "../../assets/alarm.gif";
import qrfb from "../../assets/qrfb.png";

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

const setMovieFavoriteCookie = (slug, isFavorite) => {
  const cookieName = `fav_${slug}`;
  const value = isFavorite ? "1" : "0";
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 30); // 30 days expiry
  document.cookie = `${cookieName}=${value}; expires=${expiryDate.toUTCString()}; path=/; samesite=Lax`;
};

const API_BASE_URL = import.meta.env.PUBLIC_API_BASE_URL;

const MovieDetail = ({
  movie,
  thongbao,
  firstEpisodeSlug,
  firstEpisodeType,
  initialIsFavorite,
}) => {
  const [isSharePopupOpen, setIsSharePopupOpen] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [likeCount, setLikeCount] = useState(movie.luot_like || 0);
  const [dislikeCount, setDislikeCount] = useState(movie.luot_dislike || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);

  useEffect(() => {
    setLikeCount(movie.luot_like || 0);
    setDislikeCount(movie.luot_dislike || 0);
  }, [movie]);

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating / 2);
    const stars = [];
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg
          key={i}
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-3 w-3 text-yellow-400"
        >
          <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.511 8.243-7.447-3.957-7.447 3.957 1.511-8.243-6.064-5.828 8.332-1.151z" />
        </svg>,
      );
    }
    const emptyStars = 5 - fullStars;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <svg
          key={i + fullStars}
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-2.5 w-2.5 text-gray-300"
        >
          <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.511 8.243-7.447-3.957-7.447 3.957 1.511-8.243-6.064-5.828 8.332-1.151z" />
        </svg>,
      );
    }
    return stars;
  };

  const handleCopyLink = () => {
    const link = window.location.href;
    document.execCommand("copy");
    toast.success("Đã sao chép liên kết!");
  };

  const handleFavorite = async () => {
    if (!movie || !movie.slug) {
      toast.error("Không thể thêm/xóa phim. Thiếu thông tin phim.");
      return;
    }

    try {
      if (isFavorite) {
        await removeMovieFromFavorites(movie.slug);
        setIsFavorite(false);
        setMovieFavoriteCookie(movie.slug, false); // Cập nhật cookie
        toast.info(`Đã xóa "${movie.ten_phim}" khỏi danh sách yêu thích!`);
      } else {
        await addMovieToFavorites(movie);
        setIsFavorite(true);
        setMovieFavoriteCookie(movie.slug, true); // Cập nhật cookie
        toast.success(`Đã thêm "${movie.ten_phim}" vào danh sách yêu thích!`);
      }
    } catch (error) {
      console.error("Favorite action failed:", error);
      toast.error("Lỗi khi cập nhật danh sách yêu thích.");
    }
  };

  const handleLike = async () => {
    if (isLiked) {
      return;
    }
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/phim/${movie.slug}/like`,
        {
          method: "POST",
        },
      );
      if (response.ok) {
        setLikeCount((prevCount) => prevCount + 1);
        if (isDisliked) {
          setDislikeCount((prevCount) => (prevCount > 0 ? prevCount - 1 : 0));
        }
        setIsLiked(true);
        setIsDisliked(false);
      } else {
        console.error("Failed to like the movie");
      }
    } catch (error) {
      console.error("Error liking the movie:", error);
    }
  };

  const handleDislike = async () => {
    if (isDisliked) {
      return; // Prevent multiple dislikes
    }
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/phim/${movie.slug}/dislike`,
        {
          method: "POST",
        },
      );
      if (response.ok) {
        setDislikeCount((prevCount) => prevCount + 1);
        if (isLiked) {
          setLikeCount((prevCount) => (prevCount > 0 ? prevCount - 1 : 0));
        }
        setIsDisliked(true);
        setIsLiked(false);
      } else {
        console.error("Failed to dislike the movie");
      }
    } catch (error) {
      console.error("Error disliking the movie:", error);
    }
  };

  return (
    <div className="flex w-full flex-col gap-6 lg:flex-row lg:justify-between">
      <div className="flex w-full flex-row items-start gap-8 lg:w-[70%] 2xl:w-[75%]">
        <div className="w-[30%] flex-shrink-0 lg:h-full lg:w-[35%] 2xl:w-[27%]">
          <div className="relative aspect-[2/3] rounded-lg lg:aspect-auto lg:h-full">
            <img
              src={movie.poster_url}
              alt={`Poster phim ${movie.ten_phim}`}
              className="absolute left-0 top-0 h-full w-full rounded-lg object-cover"
              loading="eager"
              fetchPriority="high"
            />

            <div
              className="pointer-events-none absolute bottom-0 left-0 h-[100%] w-full rounded-b-[6px]"
              style={{
                background:
                  "linear-gradient(to top, rgba(30, 30, 30, 0.2), transparent)",
              }}
              aria-hidden="true"
            ></div>
          </div>
        </div>

        <div className="flex w-full flex-1 flex-col items-start gap-3 lg:h-full lg:justify-between">
          <div className="flex w-full flex-col gap-1">
            <h1 className="text-left text-lg font-semibold leading-tight text-white lg:text-xl">
              {movie.ten_phim}
            </h1>

            {movie.ten_khac && (
              <p className="text-left text-sm font-normal text-[#ffd875]">
                {movie.ten_khac}
              </p>
            )}

            <div className="mt-2 flex w-full flex-wrap items-center justify-start gap-1 text-xs font-medium sm:flex lg:gap-6 lg:text-sm">
              {movie.tinh_trang && (
                <div className="text-left lg:flex-none">
                  <span className="hidden text-gray-300 lg:inline">
                    Tình Trạng:
                  </span>

                  <span className="ml-0 font-semibold text-sky-300 lg:ml-2">
                    {movie.tinh_trang}
                  </span>
                </div>
              )}

              {movie.nam_phat_hanh && (
                <div className="text-left before:pr-2 before:content-['/'] lg:flex-none lg:before:content-none">
                  <span className="hidden text-gray-300 lg:inline">Năm:</span>

                  <span className="ml-0 text-[#ECECEC] lg:ml-2">
                    {movie.nam_phat_hanh}{" "}
                  </span>
                </div>
              )}

              {movie.ngon_ngu && (
                <div className="text-left before:pr-2 before:content-['/'] lg:flex-none lg:before:content-none">
                  <span className="hidden text-gray-300 lg:inline">
                    Ngôn ngữ:
                  </span>

                  <span className="ml-0 text-[#ECECEC] lg:ml-2">
                    {rutGonTinhTrangNgonNgu(movie.ngon_ngu)}
                  </span>
                </div>
              )}
            </div>

            {movie.the_loai && movie.the_loai.length > 0 && (
              <div className="mt-2">
                <span className="mr-2 text-xs font-medium text-gray-300 lg:text-sm">
                  Thể loại:
                </span>

                <div className="inline-flex flex-wrap gap-1">
                  {movie.the_loai.map((genre, index) => (
                    <span
                      key={genre.ten}
                      className="text-xs text-[#ECECEC] lg:text-sm"
                    >
                      {genre.ten}
                      {index < movie.the_loai.length - 1 && " / "}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {movie.dao_dien && (
              <div className="py-1">
                <h2 className="my-1 text-xs font-medium text-gray-300 lg:text-sm">
                  Đạo diễn:
                  <span className="ml-2 font-normal text-[#ECECEC]">
                    {movie.dao_dien}
                  </span>
                </h2>
              </div>
            )}

            {movie.dien_vien && (
              <div className="my-1 flex flex-col gap-1 text-xs font-medium text-gray-300 lg:text-sm">
                <span className="line-clamp-1">
                  Diễn viên:
                  <span className="ml-2 font-normal text-[#ECECEC]">
                    {movie.dien_vien.length > 0
                      ? movie.dien_vien.map((actor) => actor.ten).join(", ")
                      : "Đang cập nhật"}
                  </span>
                </span>
              </div>
            )}

            {movie.thoi_luong && (
              <div className="py-1">
                <h2 className="text-xs font-medium text-gray-300 lg:text-sm">
                  Thời Lượng:
                  <span className="ml-2 font-normal text-[#ECECEC]">
                    {movie.thoi_luong}
                  </span>
                </h2>
              </div>
            )}

            {movie.mo_ta && (
              <div className="hidden flex-col gap-1 py-1 text-xs sm:flex lg:text-sm">
                <div className="flex flex-row gap-2">
                  <h2 className="whitespace-nowrap font-medium text-gray-300 lg:text-sm">
                    Nội Dung:
                  </h2>
                  <span className={`${isDescriptionExpanded ? '' : 'line-clamp-2'} font-normal text-[#ECECEC]`}>
                    {movie.mo_ta}
                  </span>
                </div>
                {movie.mo_ta.length > 150 && (
                  <button
                    onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                    className="ml-auto text-xs text-sky-400 hover:text-sky-300 transition-colors"
                  >
                    {isDescriptionExpanded ? 'Thu gọn' : 'Đọc thêm'}
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="mt-4 flex w-full flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-row items-center gap-4">
              <a
                href={`/xem-phim/${movie.slug}/${firstEpisodeSlug}/${firstEpisodeType}`}
                className="inline-block rounded-full bg-sky-400 px-6 py-2.5 text-center text-sm font-semibold text-white transition-all duration-300 ease-in-out hover:scale-105"
              >
                Xem Ngay
              </a>

              <button
                onClick={handleFavorite}
                aria-label={
                  isFavorite
                    ? "Xóa khỏi danh sách yêu thích"
                    : "Thêm vào danh sách yêu thích"
                }
                className={`inline-flex items-center gap-2 rounded-full border p-2.5 text-center text-sm font-semibold transition-all duration-300 ease-in-out hover:scale-105 ${
                  isFavorite
                    ? "border-sky-300 text-sky-300"
                    : "border-gray-400 text-gray-400 hover:border-white hover:text-white"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill={isFavorite ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                </svg>
              </button>
            </div>

            <div className="hidden flex-row items-center gap-4 sm:flex">
              <div className="relative">
                <svg
                  onClick={() => setIsSharePopupOpen(!isSharePopupOpen)}
                  xmlns="http://www.w3.org/2000/svg"
                  width="26"
                  height="26"
                  viewBox="0 0 48 48"
                  className="cursor-pointer text-gray-300 transition-all duration-300 ease-in-out hover:scale-105"
                >
                  <g
                    fill="none"
                    stroke="#d1d5db"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="4"
                  >
                    <path d="M28 6H42V20" />{" "}
                    <path d="M42 29.4737V39C42 40.6569 40.6569 42 39 42H9C7.34315 42 6 40.6569 6 39V9C6 7.34315 7.34315 6 9 6L18 6" />
                    <path d="M25.7998 22.1999L41.0998 6.8999" />{" "}
                  </g>
                </svg>

                {isSharePopupOpen && (
                  <div
                    className="absolute right-0 top-full z-50 mt-2 w-[350px] rounded-lg bg-[#35373d] p-4 shadow-lg"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h3 className="text-sm font-semibold text-white">
                      Chia Sẻ
                    </h3>

                    <div className="mt-2 flex flex-row items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={window.location.href}
                        className="flex-1 rounded-md bg-[#ffffff18] px-2 py-1 text-xs text-gray-300 outline-none"
                      />

                      <button
                        onClick={handleCopyLink}
                        className="rounded-md bg-sky-400 px-3 py-1 text-xs font-semibold text-white"
                      >
                        Sao Chép{" "}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {movie.luot_xem && (
                <div className="flex flex-row py-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    className="cursor-pointer text-gray-300 transition-all duration-300 ease-in-out hover:scale-105"
                  >
                    <path
                      fill="currentColor"
                      d="M6 8c0-2.21 1.79-4 4-4s4 1.79 4 4s-1.79 4-4 4s-4-1.79-4-4m3.14 11.75L8.85 19l.29-.75c.7-1.75 1.94-3.11 3.47-4.03c-.82-.14-1.69-.22-2.61-.22c-4.42 0-8 1.79-8 4v2h7.27c-.04-.09-.09-.17-.13-.25M17 18c-.56 0-1 .44-1 1s.44 1 1 1s1-.44 1-1s-.44-1-1-1m6 1c-.94 2.34-3.27 4-6 4s-5.06-1.66-6-4c.94-2.34 3.27-4 6-4s5.06 1.66 6 4m-3.5 0a2.5 2.5 0 0 0-5 0a2.5 2.5 0 0 0 5 0"
                    />
                  </svg>

                  <span className="font-normal text-gray-300">
                    {movie.luot_xem}
                  </span>
                </div>
              )}

              {movie.luot_like >= 0 && (
                <div className="flex flex-row py-1">
                  <svg
                    onClick={handleLike}
                    xmlns="http://www.w3.org/2000/svg"
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    className={`cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 ${
                      isLiked ? "text-sky-300" : "text-gray-300"
                    }`}
                  >
                    <path
                      fill="currentColor"
                      d="M20 8h-5.612l1.123-3.367c.202-.608.1-1.282-.275-1.802S14.253 2 13.612 2H12c-.297 0-.578.132-.769.36L6.531 8H4c-1.103 0-2 .897-2 2v9c0 1.103.897 2 2 2h13.307a2.01 2.01 0 0 0 1.873-1.298l2.757-7.351A1 1 0 0 0 22 12v-2c0-1.103-.897-2-2-2M4 10h2v9H4zm16 1.819L17.307 19H8V9.362L12.468 4h1.146l-1.562 4.683A.998.998 0 0 0 13 10h7z"
                    />
                  </svg>

                  <span className="font-normal text-gray-300">{likeCount}</span>
                </div>
              )}

              {movie.luot_dislike >= 0 && (
                <div className="flex flex-row py-1">
                  <svg
                    onClick={handleDislike}
                    xmlns="http://www.w3.org/2000/svg"
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    className={`rotate-180 cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 ${
                      isDisliked ? "text-sky-300" : "text-gray-300"
                    }`}
                  >
                    <path
                      fill="currentColor"
                      d="M20 8h-5.612l1.123-3.367c.202-.608.1-1.282-.275-1.802S14.253 2 13.612 2H12c-.297 0-.578.132-.769.36L6.531 8H4c-1.103 0-2 .897-2 2v9c0 1.103.897 2 2 2h13.307a2.01 2.01 0 0 0 1.873-1.298l2.757-7.351A1 1 0 0 0 22 12v-2c0-1.103-.897-2-2-2M4 10h2v9H4zm16 1.819L17.307 19H8V9.362L12.468 4h1.146l-1.562 4.683A.998.998 0 0 0 13 10h7z"
                    />
                  </svg>

                  <span className="font-normal text-gray-300">
                    {dislikeCount}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Group 2: Right-aligned icons and text (Mobile/Small Screens) */}
      <div className="flex flex-row items-center justify-between gap-4 sm:hidden">
        <div className="relative flex items-center justify-center gap-6">
          <svg
            onClick={() => setIsSharePopupOpen(!isSharePopupOpen)}
            xmlns="http://www.w3.org/2000/svg"
            width="26"
            height="26"
            viewBox="0 0 48 48"
            className="cursor-pointer text-gray-300 transition-all duration-300 ease-in-out hover:scale-105"
          >
            <g
              fill="none"
              stroke="#d1d5db"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="4"
            >
              <path d="M28 6H42V20" />
              <path d="M42 29.4737V39C42 40.6569 40.6569 42 39 42H9C7.34315 42 6 40.6569 6 39V9C6 7.34315 7.34315 6 9 6L18 6" />
              <path d="M25.7998 22.1999L41.0998 6.8999" />
            </g>{" "}
          </svg>

          {isSharePopupOpen && (
            <div
              className="fixed inset-0 z-40 bg-black bg-opacity-50"
              onClick={() => setIsSharePopupOpen(false)}
            >
              <div
                className="fixed left-1/2 top-1/2 z-50 w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-[#1a1a1a] p-4 shadow-lg"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-sm font-semibold text-white">Chia Sẻ</h3>

                <div className="mt-2 flex flex-row items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={window.location.href}
                    className="flex-1 rounded-md bg-[#ffffff18] px-2 py-1 text-xs text-gray-300 outline-none"
                  />

                  <button
                    onClick={handleCopyLink}
                    className="rounded-md bg-sky-400 px-3 py-1 text-xs font-semibold text-white"
                  >
                    Sao Chép
                  </button>
                </div>
              </div>
            </div>
          )}

          {movie.luot_xem && (
            <div className="flex flex-row py-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                className="cursor-pointer text-gray-300 transition-all duration-300 ease-in-out hover:scale-105"
              >
                <path
                  fill="currentColor"
                  d="M6 8c0-2.21 1.79-4 4-4s4 1.79 4 4s-1.79 4-4 4s-4-1.79-4-4m3.14 11.75L8.85 19l.29-.75c.7-1.75 1.94-3.11 3.47-4.03c-.82-.14-1.69-.22-2.61-.22c-4.42 0-8 1.79-8 4v2h7.27c-.04-.09-.09-.17-.13-.25M17 18c-.56 0-1 .44-1 1s.44 1 1 1s1-.44 1-1s-.44-1-1-1m6 1c-.94 2.34-3.27 4-6 4s-5.06-1.66-6-4c.94-2.34 3.27-4 6-4s5.06 1.66 6 4m-3.5 0a2.5 2.5 0 0 0-5 0a2.5 2.5 0 0 0 5 0"
                />
              </svg>

              <span className="font-normal text-gray-300">
                {movie.luot_xem}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-center gap-6">
          {movie.luot_like >= 0 && (
            <div className="flex flex-row py-1">
              <svg
                onClick={handleLike}
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                className={`cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 ${
                  isLiked ? "text-sky-300" : "text-gray-300"
                }`}
              >
                <path
                  fill="currentColor"
                  d="M20 8h-5.612l1.123-3.367c.202-.608.1-1.282-.275-1.802S14.253 2 13.612 2H12c-.297 0-.578.132-.769.36L6.531 8H4c-1.103 0-2 .897-2 2v9c0 1.103.897 2 2 2h13.307a2.01 2.01 0 0 0 1.873-1.298l2.757-7.351A1 1 0 0 0 22 12v-2c0-1.103-.897-2-2-2M4 10h2v9H4zm16 1.819L17.307 19H8V9.362L12.468 4h1.146l-1.562 4.683A.998.998 0 0 0 13 10h7z"
                />
              </svg>
              <span className="font-normal text-gray-300">{likeCount}</span>
            </div>
          )}

          {movie.luot_dislike >= 0 && (
            <div className="flex flex-row py-1">
              <svg
                onClick={handleDislike}
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                className={`rotate-180 cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 ${
                  isDisliked ? "text-sky-300" : "text-gray-300"
                }`}
              >
                <path
                  fill="currentColor"
                  d="M20 8h-5.612l1.123-3.367c.202-.608.1-1.282-.275-1.802S14.253 2 13.612 2H12c-.297 0-.578.132-.769.36L6.531 8H4c-1.103 0-2 .897-2 2v9c0 1.103.897 2 2 2h13.307a2.01 2.01 0 0 0 1.873-1.298l2.757-7.351A1 1 0 0 0 22 12v-2c0-1.103-.897-2-2-2M4 10h2v9H4zm16 1.819L17.307 19H8V9.362L12.468 4h1.146l-1.562 4.683A.998.998 0 0 0 13 10h7z"
                />
              </svg>
              <span className="font-normal text-gray-300">{dislikeCount}</span>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-2 rounded-lg bg-[#ffffff1a] p-4 lg:w-[25%]">
        {movie.tmdb && (
          <div className="flex h-fit w-full flex-shrink-0 items-center justify-between">
            <div className="flex items-end gap-1 text-white">
              <span className="text-2xl font-bold">{movie.tmdb}</span>
              <span className="text-sm">/10</span> {/**  */}
            </div>

            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-1">
                {renderStars(movie.tmdb)}
              </div>
              <span className="text-sm text-gray-300">Đánh Giá</span>{" "}
            </div>
          </div>
        )}

        <div>
          {thongbao && (
            <div className="my-2 flex w-full flex-col items-start gap-4 text-sm text-white">
              <div className="flex flex-row items-center justify-center gap-2">
                <div>
                  <img
                    src={alarmGif.src}
                    alt="Thông Báo"
                    className="h-8 w-8 rounded-full bg-[#0005]"
                  />
                </div>

                <span className="font-semibold text-transparent text-white">
                  Thông Báo
                </span>
              </div>

              <span
                className="text-sm leading-6"
                dangerouslySetInnerHTML={{
                  __html: thongbao.noidung,
                }}
              />
            </div>
          )}

          <div className="mt-8 hidden flex-col items-center justify-center gap-2 sm:flex">
            <img
              src={typeof qrfb === "string" ? qrfb : qrfb.src}
              alt="Mã QR Facebook"
              className="h-32 w-32 object-contain"
            />

            <h3 className="text-xs font-medium text-gray-300">
              Tham gia group Facebook
            </h3>
          </div>
        </div>
      </div>{" "}
    </div>
  );
};

export default MovieDetail;
