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
  children, // Receive children
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
        <svg key={i} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-yellow-400">
          <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.511 8.243-7.447-3.957-7.447 3.957 1.511-8.243-6.064-5.828 8.332-1.151z" />
        </svg>
      );
    }
    return stars;
  };

  const handleCopyLink = () => {
    const link = window.location.href;
    navigator.clipboard.writeText(link);
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
        setMovieFavoriteCookie(movie.slug, false);
        toast.info(`Đã xóa "${movie.ten_phim}" khỏi danh sách yêu thích!`);
      } else {
        await addMovieToFavorites(movie);
        setIsFavorite(true);
        setMovieFavoriteCookie(movie.slug, true);
        toast.success(`Đã thêm "${movie.ten_phim}" vào danh sách yêu thích!`);
      }
    } catch (error) {
      console.error("Favorite action failed:", error);
      toast.error("Lỗi khi cập nhật danh sách yêu thích.");
    }
  };

  const handleLike = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/phim/${movie.slug}/like`, { method: "POST" });
      if (response.ok) {
        if (isLiked) {
          setLikeCount((prev) => (prev > 0 ? prev - 1 : 0));
          setIsLiked(false);
        } else {
          setLikeCount((prev) => prev + 1);
          if (isDisliked) {
            setDislikeCount((prev) => (prev > 0 ? prev - 1 : 0));
            setIsDisliked(false);
          }
          setIsLiked(true);
        }
      }
    } catch (error) {
      console.error("Error liking movie:", error);
    }
  };

  const handleDislike = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/phim/${movie.slug}/dislike`, { method: "POST" });
      if (response.ok) {
        if (isDisliked) {
          setDislikeCount((prev) => (prev > 0 ? prev - 1 : 0));
          setIsDisliked(false);
        } else {
          setDislikeCount((prev) => prev + 1);
          if (isLiked) {
            setLikeCount((prev) => (prev > 0 ? prev - 1 : 0));
            setIsLiked(false);
          }
          setIsDisliked(true);
        }
      }
    } catch (error) {
      console.error("Error disliking movie:", error);
    }
  };

  return (
    <div className="w-full relative">
      <div className="detail-container-box p-6 lg:p-12 xl:p-14 overflow-hidden">
        <div className="relative z-10">

          {/* === MOBILE TOP SECTION (Centered Poster & Titles) === */}
          <div className="flex flex-col items-center text-center lg:hidden mb-10">
            {/* Small Centered Poster */}
            <div className="relative w-40 aspect-[2/3] rounded-xl overflow-hidden shadow-2xl border border-white/10 mb-6">
              <img
                src={movie.poster_url}
                alt={`Poster ${movie.ten_phim}`}
                className="h-full w-full object-cover"
              />
              {movie.tmdb && (
                <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-md px-1.5 py-0.5 rounded border border-white/20">
                  <span className="text-yellow-400 font-bold text-[10px]">TMDB {movie.tmdb}</span>
                </div>
              )}
            </div>

            {/* Centered Titles */}
            <h1 className="text-2xl font-bold text-white uppercase glow-text px-4 mb-2">
              {movie.ten_phim}
            </h1>
            {movie.ten_khac && (
              <h2 className="text-sm text-gray-400 font-medium px-4 mb-4">{movie.ten_khac}</h2>
            )}

            {/* Thông tin phim Toggle */}
            <button
              onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
              className="flex items-center gap-2 text-emerald-400 font-bold text-sm hover:text-emerald-300 transition-colors pb-2"
            >
              <span>Thông tin phim</span>
              <svg className={`w-4 h-4 transition-transform ${isDescriptionExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Expandable Mobile Info */}
            {isDescriptionExpanded && (
              <div className="mt-6 w-full text-left px-2 animate-in">
                <div className="flex flex-col gap-2 text-sm text-gray-300 mb-4 p-4 rounded-xl bg-white/5 border border-white/5">
                  <div className="flex gap-2">
                    <span className="text-gray-500 min-w-[80px]">Thể loại:</span>
                    <span className="text-gray-200">{movie.the_loai?.map(g => g.ten).join(", ")}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-gray-500 min-w-[80px]">Đạo diễn:</span>
                    <span className="text-gray-200">{movie.dao_dien || "N/A"}</span>
                  </div>
                </div>
                <div className="text-sm text-gray-400 leading-relaxed px-2">
                  {movie.mo_ta}
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-10 lg:flex-row lg:items-start">
            {/* === DESKTOP LEFT SIDEBAR (Hidden on mobile) === */}
            <div className="hidden lg:flex w-full flex-shrink-0 lg:w-[300px] xl:w-[340px] flex-col gap-5">
              {/* Poster */}
              <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.5)] border border-white/10 group">
                <img
                  src={movie.poster_url}
                  alt={`Poster phim ${movie.ten_phim}`}
                  className="h-full w-full object-cover"
                  loading="eager"
                  fetchPriority="high"
                />

                {/* Gradient overlay on poster bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>

                {/* Rating Badge on Poster */}
                {movie.tmdb && (
                  <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-2 py-1 rounded-md border border-white/20 flex items-center gap-1">
                    <span className="text-yellow-400 font-bold text-sm tracking-wider">TMDB</span>
                    <span className="text-white font-bold text-sm">{movie.tmdb}</span>
                  </div>
                )}
              </div>

              {/* Title & Info */}
              <div className="flex flex-col gap-3">
                <h1 className="text-2xl lg:text-3xl font-bold text-white uppercase leading-tight tracking-wide glow-text">
                  {movie.ten_phim}
                </h1>
                <h2 className="text-base text-gray-400 font-medium">{movie.ten_khac}</h2>

                {/* Meta Tags Row */}
                <div className="flex flex-wrap gap-2 text-xs font-semibold">
                  {movie.nam_phat_hanh && (
                    <span className="px-2.5 py-1 rounded-md bg-[#ffffff10] text-gray-200 border border-white/5">
                      {movie.nam_phat_hanh}
                    </span>
                  )}
                  {movie.tinh_trang && (
                    <span className="px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/20">
                      {movie.tinh_trang}
                    </span>
                  )}
                  {movie.ngon_ngu && (
                    <span className="px-2.5 py-1 rounded-md bg-sky-500/20 text-sky-400 border border-sky-500/20">
                      {rutGonTinhTrangNgonNgu(movie.ngon_ngu)}
                    </span>
                  )}
                </div>

                {/* Detailed Info List */}
                <div className="mt-2 flex flex-col gap-2 text-sm text-gray-300">
                  <div className="flex gap-2">
                    <span className="text-gray-500 shrink-0 min-w-[70px]">Thể loại:</span>
                    <div className="flex flex-wrap gap-1">
                      {movie.the_loai?.map((g, i) => (
                        <span key={i} className="text-gray-200 hover:text-sky-400 transition-colors cursor-pointer">
                          {g.ten}{i < movie.the_loai.length - 1 ? ", " : ""}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <span className="text-gray-500 shrink-0 min-w-[70px]">Đạo diễn:</span>
                    <span className="text-gray-200">{movie.dao_dien || "Đang cập nhật"}</span>
                  </div>

                  <div className="flex gap-2">
                    <span className="text-gray-500 shrink-0 min-w-[70px]">Quốc gia:</span>
                    <span className="text-gray-200">{movie.quoc_gia?.[0]?.ten || "Đang cập nhật"}</span>
                  </div>

                  <div className="flex gap-2">
                    <span className="text-gray-500 shrink-0 min-w-[70px]">Thời lượng:</span>
                    <span className="text-gray-200">{movie.thoi_luong || "N/A"}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="py-2 border-t border-white/10 mt-2">
                <h3 className="text-white font-semibold mb-1">Nội Dung</h3>
                <div className={`text-sm text-gray-400 leading-relaxed ${isDescriptionExpanded ? '' : 'line-clamp-6'}`}>
                  {movie.mo_ta}
                </div>
                {movie.mo_ta?.length > 200 && (
                  <button
                    onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                    className="text-sky-400 text-xs mt-1 hover:underline"
                  >
                    {isDescriptionExpanded ? "Thu gọn" : "Xem thêm"}
                  </button>
                )}
              </div>

              {/* Notifications & QR */}
              <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-[#1a1a20] to-[#15151a] border border-white/5">
                {thongbao && (
                  <div className="mb-4 text-sm">
                    <div className="flex items-center gap-2 mb-2 text-yellow-400 font-bold">
                      <img src={alarmGif.src} alt="Notice" className="w-5 h-5" />
                      <span>Thông Báo</span>
                    </div>
                    <div className="text-gray-300 text-xs leading-5" dangerouslySetInnerHTML={{ __html: thongbao.noidung }} />
                  </div>
                )}
                <div className="flex flex-col items-center gap-2">
                  <img src={typeof qrfb === "string" ? qrfb : qrfb.src} alt="QR" className="w-24 h-24 rounded-lg bg-white p-1" />
                  <span className="text-xs text-gray-400">Tham gia group Facebook</span>
                </div>
              </div>
            </div>

            {/* === RIGHT CONTENT: Action Bar, Tabs, Episodes === */}
            <div className="flex-1 min-w-0">
              {/* Action Header Bar (Centered on Mobile) */}
              <div className="relative z-20 mb-10 flex flex-col md:flex-row items-center justify-between gap-6 p-6">
                <div className="flex flex-col md:flex-row items-center gap-6 w-full md:w-auto">
                  {/* Watch Button - Pill Shaped & Centered */}
                  <a
                    href={`/xem-phim/${movie.slug}/${firstEpisodeSlug}/${firstEpisodeType}`}
                    className="group relative inline-flex items-center justify-center gap-3 rounded-full mint-gradient w-full md:w-[260px] py-4 text-lg font-bold text-black transition-all hover:scale-[1.03] hover:shadow-[0_0_35px_rgba(114,245,154,0.4)]"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
                      <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                    </svg>
                    <span>Xem Ngay</span>
                  </a>

                  <div className="hidden md:block w-px h-12 bg-white/10"></div>

                  {/* Action Icons Row */}
                  <div className="flex items-center justify-center gap-6 sm:gap-10">
                    <button onClick={handleFavorite} className="flex flex-col items-center gap-2 group">
                      <div className={`transition-all ${isFavorite ? 'text-pink-500 drop-shadow-[0_0_10px_rgba(236,72,153,0.5)]' : 'text-gray-400 group-hover:text-white'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
                      </div>
                      <span className={`text-[11px] font-bold uppercase tracking-wider transition-colors ${isFavorite ? 'text-pink-500' : 'text-gray-400 group-hover:text-white'}`}>Yêu thích</span>
                    </button>

                    <button onClick={handleLike} className="flex flex-col items-center gap-2 group">
                      <div className={`transition-all ${isLiked ? 'text-sky-500 drop-shadow-[0_0_10px_rgba(56,189,248,0.5)]' : 'text-gray-400 group-hover:text-white'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M20 8h-5.612l1.123-3.367c.202-.608.1-1.282-.275-1.802S14.253 2 13.612 2H12c-.297 0-.578.132-.769.36L6.531 8H4c-1.103 0-2 .897-2 2v9c0 1.103.897 2 2 2h13.307a2.01 2.01 0 0 0 1.873-1.298l2.757-7.351A1 1 0 0 0 22 12v-2c0-1.103-.897-2-2-2M4 10h2v9H4zm16 1.819L17.307 19H8V9.362L12.468 4h1.146l-1.562 4.683A.998.998 0 0 0 13 10h7z" /></svg>
                      </div>
                      <span className={`text-[11px] font-bold uppercase tracking-wider transition-colors ${isLiked ? 'text-sky-500' : 'text-gray-400 group-hover:text-white'}`}>{likeCount > 0 ? likeCount : 'Thích'}</span>
                    </button>

                    <button onClick={handleDislike} className="flex flex-col items-center gap-2 group">
                      <div className={`transition-all ${isDisliked ? 'text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'text-gray-400 group-hover:text-white'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor" transform="rotate(180)"><path d="M20 8h-5.612l1.123-3.367c.202-.608.1-1.282-.275-1.802S14.253 2 13.612 2H12c-.297 0-.578.132-.769.36L6.531 8H4c-1.103 0-2 .897-2 2v9c0 1.103.897 2 2 2h13.307a2.01 2.01 0 0 0 1.873-1.298l2.757-7.351A1 1 0 0 0 22 12v-2c0-1.103-.897-2-2-2M4 10h2v9H4zm16 1.819L17.307 19H8V9.362L12.468 4h1.146l-1.562 4.683A.998.998 0 0 0 13 10h7z" /></svg>
                      </div>
                      <span className={`text-[11px] font-bold uppercase tracking-wider transition-colors ${isDisliked ? 'text-red-500' : 'text-gray-400 group-hover:text-white'}`}>{dislikeCount > 0 ? dislikeCount : 'Không thích'}</span>
                    </button>

                    <button onClick={() => setIsSharePopupOpen(!isSharePopupOpen)} className="flex flex-col items-center gap-2 group relative">
                      <div className="text-gray-400 group-hover:text-white transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" /></svg>
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 group-hover:text-white">Chia sẻ</span>

                      {/* Share Popup */}
                      {isSharePopupOpen && (
                        <div className="absolute top-full right-0 mt-4 w-64 p-4 rounded-2xl bg-[#1a1a20] border border-white/10 shadow-3xl z-50 animate-in fade-in slide-in-from-top-2 text-left">
                          <div className="flex flex-col gap-3">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Sao chép liên kết</span>
                            <div className="flex gap-2">
                              <input readOnly value={typeof window !== 'undefined' ? window.location.href : ''} className="flex-1 bg-black/40 rounded-lg px-3 py-2 text-[10px] text-gray-300 border border-white/5 outline-none" />
                              <button onClick={handleCopyLink} className="bg-emerald-500 text-black text-[10px] px-3 py-2 rounded-lg font-bold hover:bg-emerald-400 transition-colors">Copy</button>
                            </div>
                          </div>
                        </div>
                      )}
                    </button>
                  </div>
                </div>

                {/* Stars/Views (Centered on Mobile) */}
                <div className="flex items-center gap-3 py-2 px-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sky-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    </span>
                    <div className="flex flex-col">
                      <span className="text-white font-black text-lg leading-none">{movie.tmdb || "N/A"}</span>
                      <span className="text-[10px] text-gray-500 font-bold uppercase tracking-tight">Đánh giá</span>
                    </div>
                  </div>
                  <div className="w-px h-6 bg-white/10"></div>
                  <div className="flex flex-col">
                    <span className="text-white font-black text-lg leading-none">{movie.luot_xem || 0}</span>
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-tight">Lượt xem</span>
                  </div>
                </div>
              </div>

              {/* Children Content (Tabs, Comments, Sidebar, etc) */}
              <div className="mt-2 text-white">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
