/* empty css                                     */
import { e as createComponent, f as createAstro, r as renderTemplate, u as unescapeHTML, h as addAttribute, l as renderComponent, n as Fragment, m as maybeRenderHead } from '../../chunks/astro/server_BuMcwEkM.mjs';
import 'kleur/colors';
import { $ as $$Layout, H as Header, F as Footer } from '../../chunks/index_eDR0il5k.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
/* empty css                                     */
import { r as rutGonTinhTrangNgonNgu, c as cleanhtml, b as capitalizeWords } from '../../chunks/movieUtils_BzNI1rrt.mjs';
import { a as alarmGif, E as Episodes, F as FacebookComments } from '../../chunks/FacebookComments_C5Z5DPDx.mjs';
import { T as TopMovies } from '../../chunks/TopMovies_Dnd2_qIw.mjs';
import 'clsx';
export { renderers } from '../../renderers.mjs';

const qrtele = new Proxy({"src":"/_astro/qrtele.J0DJ4xmr.png","width":500,"height":500,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/home/vohaidang/Desktop/tramphim-v2/ui/src/assets/qrtele.png";
							}
							
							return target[name];
						}
					});

const DB_NAME = "FavoriteDB";
const DB_VERSION = 2;
const STORE_NAME = "FavoriteDB";
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
      poster_url: movie.poster_url
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
  const expiryDate = /* @__PURE__ */ new Date();
  expiryDate.setDate(expiryDate.getDate() + 30);
  document.cookie = `${cookieName}=${value}; expires=${expiryDate.toUTCString()}; path=/; samesite=Lax`;
};
const API_BASE_URL = "https://api.motchillx.site";
const MovieDetail = ({
  movie,
  thongbao,
  firstEpisodeSlug,
  firstEpisodeType,
  initialIsFavorite
}) => {
  const [isSharePopupOpen, setIsSharePopupOpen] = useState(false);
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
        /* @__PURE__ */ jsx(
          "svg",
          {
            xmlns: "http://www.w3.org/2000/svg",
            width: "20",
            height: "20",
            viewBox: "0 0 24 24",
            fill: "currentColor",
            className: "h-3 w-3 text-yellow-400",
            children: /* @__PURE__ */ jsx("path", { d: "M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.511 8.243-7.447-3.957-7.447 3.957 1.511-8.243-6.064-5.828 8.332-1.151z" })
          },
          i
        )
      );
    }
    const emptyStars = 5 - fullStars;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        /* @__PURE__ */ jsx(
          "svg",
          {
            xmlns: "http://www.w3.org/2000/svg",
            width: "20",
            height: "20",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            className: "h-2.5 w-2.5 text-gray-300",
            children: /* @__PURE__ */ jsx("path", { d: "M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.511 8.243-7.447-3.957-7.447 3.957 1.511-8.243-6.064-5.828 8.332-1.151z" })
          },
          i + fullStars
        )
      );
    }
    return stars;
  };
  const handleCopyLink = () => {
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
    if (isLiked) {
      return;
    }
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/phim/${movie.slug}/like`,
        {
          method: "POST"
        }
      );
      if (response.ok) {
        setLikeCount((prevCount) => prevCount + 1);
        if (isDisliked) {
          setDislikeCount((prevCount) => prevCount > 0 ? prevCount - 1 : 0);
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
      return;
    }
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/phim/${movie.slug}/dislike`,
        {
          method: "POST"
        }
      );
      if (response.ok) {
        setDislikeCount((prevCount) => prevCount + 1);
        if (isLiked) {
          setLikeCount((prevCount) => prevCount > 0 ? prevCount - 1 : 0);
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
  return /* @__PURE__ */ jsxs("div", { className: "flex w-full flex-col gap-6 lg:flex-row lg:justify-between", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex w-full flex-row items-start gap-8 lg:w-[70%] 2xl:w-[75%]", children: [
      /* @__PURE__ */ jsx("div", { className: "w-[30%] flex-shrink-0 lg:h-full lg:w-[35%] 2xl:w-[27%]", children: /* @__PURE__ */ jsxs("div", { className: "relative aspect-[2/3] rounded-lg lg:aspect-auto lg:h-full", children: [
        /* @__PURE__ */ jsx(
          "img",
          {
            src: movie.poster_url,
            alt: `Poster phim ${movie.ten_phim}`,
            className: "absolute left-0 top-0 h-full w-full rounded-lg object-cover",
            loading: "eager",
            fetchPriority: "high"
          }
        ),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "pointer-events-none absolute bottom-0 left-0 h-[100%] w-full rounded-b-[6px]",
            style: {
              background: "linear-gradient(to top, rgba(30, 30, 30, 0.2), transparent)"
            },
            "aria-hidden": "true"
          }
        )
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex w-full flex-1 flex-col items-start gap-3 lg:h-full lg:justify-between", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex w-full flex-col gap-1", children: [
          /* @__PURE__ */ jsx("h1", { className: "text-left text-lg font-semibold leading-tight text-white lg:text-xl", children: movie.ten_phim }),
          movie.ten_khac && /* @__PURE__ */ jsx("p", { className: "text-left text-sm font-normal text-[#ffd875]", children: movie.ten_khac }),
          /* @__PURE__ */ jsxs("div", { className: "mt-2 flex w-full flex-wrap items-center justify-start gap-1 text-xs font-medium sm:flex lg:gap-6 lg:text-sm", children: [
            movie.tinh_trang && /* @__PURE__ */ jsxs("div", { className: "text-left lg:flex-none", children: [
              /* @__PURE__ */ jsx("span", { className: "hidden text-gray-300 lg:inline", children: "Tình Trạng:" }),
              /* @__PURE__ */ jsx("span", { className: "ml-0 font-semibold text-sky-300 lg:ml-2", children: movie.tinh_trang })
            ] }),
            movie.nam_phat_hanh && /* @__PURE__ */ jsxs("div", { className: "text-left before:pr-2 before:content-['/'] lg:flex-none lg:before:content-none", children: [
              /* @__PURE__ */ jsx("span", { className: "hidden text-gray-300 lg:inline", children: "Năm:" }),
              /* @__PURE__ */ jsxs("span", { className: "ml-0 text-[#ECECEC] lg:ml-2", children: [
                movie.nam_phat_hanh,
                " "
              ] })
            ] }),
            movie.ngon_ngu && /* @__PURE__ */ jsxs("div", { className: "text-left before:pr-2 before:content-['/'] lg:flex-none lg:before:content-none", children: [
              /* @__PURE__ */ jsx("span", { className: "hidden text-gray-300 lg:inline", children: "Ngôn ngữ:" }),
              /* @__PURE__ */ jsx("span", { className: "ml-0 text-[#ECECEC] lg:ml-2", children: rutGonTinhTrangNgonNgu(movie.ngon_ngu) })
            ] })
          ] }),
          movie.the_loai && movie.the_loai.length > 0 && /* @__PURE__ */ jsxs("div", { className: "mt-2", children: [
            /* @__PURE__ */ jsx("span", { className: "mr-2 text-xs font-medium text-gray-300 lg:text-sm", children: "Thể loại:" }),
            /* @__PURE__ */ jsx("div", { className: "inline-flex flex-wrap gap-1", children: movie.the_loai.map((genre, index) => /* @__PURE__ */ jsxs(
              "span",
              {
                className: "text-xs text-[#ECECEC] lg:text-sm",
                children: [
                  genre.ten,
                  index < movie.the_loai.length - 1 && " / "
                ]
              },
              genre.ten
            )) })
          ] }),
          movie.dao_dien && /* @__PURE__ */ jsx("div", { className: "py-1", children: /* @__PURE__ */ jsxs("h2", { className: "my-1 text-xs font-medium text-gray-300 lg:text-sm", children: [
            "Đạo diễn:",
            /* @__PURE__ */ jsx("span", { className: "ml-2 font-normal text-[#ECECEC]", children: movie.dao_dien })
          ] }) }),
          movie.dien_vien && /* @__PURE__ */ jsx("div", { className: "my-1 flex flex-col gap-1 text-xs font-medium text-gray-300 lg:text-sm", children: /* @__PURE__ */ jsxs("span", { className: "line-clamp-1", children: [
            "Diễn viên:",
            /* @__PURE__ */ jsx("span", { className: "ml-2 font-normal text-[#ECECEC]", children: movie.dien_vien.length > 0 ? movie.dien_vien.map((actor) => actor.ten).join(", ") : "Đang cập nhật" })
          ] }) }),
          movie.thoi_luong && /* @__PURE__ */ jsx("div", { className: "py-1", children: /* @__PURE__ */ jsxs("h2", { className: "text-xs font-medium text-gray-300 lg:text-sm", children: [
            "Thời Lượng:",
            /* @__PURE__ */ jsx("span", { className: "ml-2 font-normal text-[#ECECEC]", children: movie.thoi_luong })
          ] }) }),
          movie.mo_ta && /* @__PURE__ */ jsxs("div", { className: "hidden flex-row gap-2 py-1 text-xs sm:flex lg:text-sm", children: [
            /* @__PURE__ */ jsx("h2", { className: "whitespace-nowrap font-medium text-gray-300 lg:text-sm", children: "Nội Dung:" }),
            /* @__PURE__ */ jsx("span", { className: "line-clamp-2 font-normal text-[#ECECEC]", children: movie.mo_ta })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-4 flex w-full flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-row items-center gap-4", children: [
            /* @__PURE__ */ jsx(
              "a",
              {
                href: `/xem-phim/${movie.slug}/${firstEpisodeSlug}/${firstEpisodeType}`,
                className: "inline-block rounded-full bg-sky-400 px-6 py-2.5 text-center text-sm font-semibold text-white transition-all duration-300 ease-in-out hover:scale-105",
                children: "Xem Ngay"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: handleFavorite,
                "aria-label": isFavorite ? "Xóa khỏi danh sách yêu thích" : "Thêm vào danh sách yêu thích",
                className: `inline-flex items-center gap-2 rounded-full border p-2.5 text-center text-sm font-semibold transition-all duration-300 ease-in-out hover:scale-105 ${isFavorite ? "border-sky-300 text-sky-300" : "border-gray-400 text-gray-400 hover:border-white hover:text-white"}`,
                children: /* @__PURE__ */ jsx(
                  "svg",
                  {
                    xmlns: "http://www.w3.org/2000/svg",
                    width: "20",
                    height: "20",
                    viewBox: "0 0 24 24",
                    fill: isFavorite ? "currentColor" : "none",
                    stroke: "currentColor",
                    strokeWidth: "2",
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    className: "h-4 w-4",
                    children: /* @__PURE__ */ jsx("path", { d: "M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" })
                  }
                )
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "hidden flex-row items-center gap-4 sm:flex", children: [
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsx(
                "svg",
                {
                  onClick: () => setIsSharePopupOpen(!isSharePopupOpen),
                  xmlns: "http://www.w3.org/2000/svg",
                  width: "26",
                  height: "26",
                  viewBox: "0 0 48 48",
                  className: "cursor-pointer text-gray-300 transition-all duration-300 ease-in-out hover:scale-105",
                  children: /* @__PURE__ */ jsxs(
                    "g",
                    {
                      fill: "none",
                      stroke: "#d1d5db",
                      strokeLinecap: "round",
                      strokeLinejoin: "round",
                      strokeWidth: "4",
                      children: [
                        /* @__PURE__ */ jsx("path", { d: "M28 6H42V20" }),
                        " ",
                        /* @__PURE__ */ jsx("path", { d: "M42 29.4737V39C42 40.6569 40.6569 42 39 42H9C7.34315 42 6 40.6569 6 39V9C6 7.34315 7.34315 6 9 6L18 6" }),
                        /* @__PURE__ */ jsx("path", { d: "M25.7998 22.1999L41.0998 6.8999" }),
                        " "
                      ]
                    }
                  )
                }
              ),
              isSharePopupOpen && /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "absolute right-0 top-full z-50 mt-2 w-[350px] rounded-lg bg-[#35373d] p-4 shadow-lg",
                  onClick: (e) => e.stopPropagation(),
                  children: [
                    /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-white", children: "Chia Sẻ" }),
                    /* @__PURE__ */ jsxs("div", { className: "mt-2 flex flex-row items-center gap-2", children: [
                      /* @__PURE__ */ jsx(
                        "input",
                        {
                          type: "text",
                          readOnly: true,
                          value: window.location.href,
                          className: "flex-1 rounded-md bg-[#ffffff18] px-2 py-1 text-xs text-gray-300 outline-none"
                        }
                      ),
                      /* @__PURE__ */ jsxs(
                        "button",
                        {
                          onClick: handleCopyLink,
                          className: "rounded-md bg-sky-400 px-3 py-1 text-xs font-semibold text-white",
                          children: [
                            "Sao Chép",
                            " "
                          ]
                        }
                      )
                    ] })
                  ]
                }
              )
            ] }),
            movie.luot_xem && /* @__PURE__ */ jsxs("div", { className: "flex flex-row py-1", children: [
              /* @__PURE__ */ jsx(
                "svg",
                {
                  xmlns: "http://www.w3.org/2000/svg",
                  width: "28",
                  height: "28",
                  viewBox: "0 0 24 24",
                  className: "cursor-pointer text-gray-300 transition-all duration-300 ease-in-out hover:scale-105",
                  children: /* @__PURE__ */ jsx(
                    "path",
                    {
                      fill: "currentColor",
                      d: "M6 8c0-2.21 1.79-4 4-4s4 1.79 4 4s-1.79 4-4 4s-4-1.79-4-4m3.14 11.75L8.85 19l.29-.75c.7-1.75 1.94-3.11 3.47-4.03c-.82-.14-1.69-.22-2.61-.22c-4.42 0-8 1.79-8 4v2h7.27c-.04-.09-.09-.17-.13-.25M17 18c-.56 0-1 .44-1 1s.44 1 1 1s1-.44 1-1s-.44-1-1-1m6 1c-.94 2.34-3.27 4-6 4s-5.06-1.66-6-4c.94-2.34 3.27-4 6-4s5.06 1.66 6 4m-3.5 0a2.5 2.5 0 0 0-5 0a2.5 2.5 0 0 0 5 0"
                    }
                  )
                }
              ),
              /* @__PURE__ */ jsx("span", { className: "font-normal text-gray-300", children: movie.luot_xem })
            ] }),
            movie.luot_like >= 0 && /* @__PURE__ */ jsxs("div", { className: "flex flex-row py-1", children: [
              /* @__PURE__ */ jsx(
                "svg",
                {
                  onClick: handleLike,
                  xmlns: "http://www.w3.org/2000/svg",
                  width: "28",
                  height: "28",
                  viewBox: "0 0 24 24",
                  className: `cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 ${isLiked ? "text-sky-300" : "text-gray-300"}`,
                  children: /* @__PURE__ */ jsx(
                    "path",
                    {
                      fill: "currentColor",
                      d: "M20 8h-5.612l1.123-3.367c.202-.608.1-1.282-.275-1.802S14.253 2 13.612 2H12c-.297 0-.578.132-.769.36L6.531 8H4c-1.103 0-2 .897-2 2v9c0 1.103.897 2 2 2h13.307a2.01 2.01 0 0 0 1.873-1.298l2.757-7.351A1 1 0 0 0 22 12v-2c0-1.103-.897-2-2-2M4 10h2v9H4zm16 1.819L17.307 19H8V9.362L12.468 4h1.146l-1.562 4.683A.998.998 0 0 0 13 10h7z"
                    }
                  )
                }
              ),
              /* @__PURE__ */ jsx("span", { className: "font-normal text-gray-300", children: likeCount })
            ] }),
            movie.luot_dislike >= 0 && /* @__PURE__ */ jsxs("div", { className: "flex flex-row py-1", children: [
              /* @__PURE__ */ jsx(
                "svg",
                {
                  onClick: handleDislike,
                  xmlns: "http://www.w3.org/2000/svg",
                  width: "28",
                  height: "28",
                  viewBox: "0 0 24 24",
                  className: `rotate-180 cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 ${isDisliked ? "text-sky-300" : "text-gray-300"}`,
                  children: /* @__PURE__ */ jsx(
                    "path",
                    {
                      fill: "currentColor",
                      d: "M20 8h-5.612l1.123-3.367c.202-.608.1-1.282-.275-1.802S14.253 2 13.612 2H12c-.297 0-.578.132-.769.36L6.531 8H4c-1.103 0-2 .897-2 2v9c0 1.103.897 2 2 2h13.307a2.01 2.01 0 0 0 1.873-1.298l2.757-7.351A1 1 0 0 0 22 12v-2c0-1.103-.897-2-2-2M4 10h2v9H4zm16 1.819L17.307 19H8V9.362L12.468 4h1.146l-1.562 4.683A.998.998 0 0 0 13 10h7z"
                    }
                  )
                }
              ),
              /* @__PURE__ */ jsx("span", { className: "font-normal text-gray-300", children: dislikeCount })
            ] })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-row items-center justify-between gap-4 sm:hidden", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative flex items-center justify-center gap-6", children: [
        /* @__PURE__ */ jsxs(
          "svg",
          {
            onClick: () => setIsSharePopupOpen(!isSharePopupOpen),
            xmlns: "http://www.w3.org/2000/svg",
            width: "26",
            height: "26",
            viewBox: "0 0 48 48",
            className: "cursor-pointer text-gray-300 transition-all duration-300 ease-in-out hover:scale-105",
            children: [
              /* @__PURE__ */ jsxs(
                "g",
                {
                  fill: "none",
                  stroke: "#d1d5db",
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  strokeWidth: "4",
                  children: [
                    /* @__PURE__ */ jsx("path", { d: "M28 6H42V20" }),
                    /* @__PURE__ */ jsx("path", { d: "M42 29.4737V39C42 40.6569 40.6569 42 39 42H9C7.34315 42 6 40.6569 6 39V9C6 7.34315 7.34315 6 9 6L18 6" }),
                    /* @__PURE__ */ jsx("path", { d: "M25.7998 22.1999L41.0998 6.8999" })
                  ]
                }
              ),
              " "
            ]
          }
        ),
        isSharePopupOpen && /* @__PURE__ */ jsx(
          "div",
          {
            className: "fixed inset-0 z-40 bg-black bg-opacity-50",
            onClick: () => setIsSharePopupOpen(false),
            children: /* @__PURE__ */ jsxs(
              "div",
              {
                className: "fixed left-1/2 top-1/2 z-50 w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-[#1a1a1a] p-4 shadow-lg",
                onClick: (e) => e.stopPropagation(),
                children: [
                  /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-white", children: "Chia Sẻ" }),
                  /* @__PURE__ */ jsxs("div", { className: "mt-2 flex flex-row items-center gap-2", children: [
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "text",
                        readOnly: true,
                        value: window.location.href,
                        className: "flex-1 rounded-md bg-[#ffffff18] px-2 py-1 text-xs text-gray-300 outline-none"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        onClick: handleCopyLink,
                        className: "rounded-md bg-sky-400 px-3 py-1 text-xs font-semibold text-white",
                        children: "Sao Chép"
                      }
                    )
                  ] })
                ]
              }
            )
          }
        ),
        movie.luot_xem && /* @__PURE__ */ jsxs("div", { className: "flex flex-row py-1", children: [
          /* @__PURE__ */ jsx(
            "svg",
            {
              xmlns: "http://www.w3.org/2000/svg",
              width: "28",
              height: "28",
              viewBox: "0 0 24 24",
              className: "cursor-pointer text-gray-300 transition-all duration-300 ease-in-out hover:scale-105",
              children: /* @__PURE__ */ jsx(
                "path",
                {
                  fill: "currentColor",
                  d: "M6 8c0-2.21 1.79-4 4-4s4 1.79 4 4s-1.79 4-4 4s-4-1.79-4-4m3.14 11.75L8.85 19l.29-.75c.7-1.75 1.94-3.11 3.47-4.03c-.82-.14-1.69-.22-2.61-.22c-4.42 0-8 1.79-8 4v2h7.27c-.04-.09-.09-.17-.13-.25M17 18c-.56 0-1 .44-1 1s.44 1 1 1s1-.44 1-1s-.44-1-1-1m6 1c-.94 2.34-3.27 4-6 4s-5.06-1.66-6-4c.94-2.34 3.27-4 6-4s5.06 1.66 6 4m-3.5 0a2.5 2.5 0 0 0-5 0a2.5 2.5 0 0 0 5 0"
                }
              )
            }
          ),
          /* @__PURE__ */ jsx("span", { className: "font-normal text-gray-300", children: movie.luot_xem })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-6", children: [
        movie.luot_like >= 0 && /* @__PURE__ */ jsxs("div", { className: "flex flex-row py-1", children: [
          /* @__PURE__ */ jsx(
            "svg",
            {
              onClick: handleLike,
              xmlns: "http://www.w3.org/2000/svg",
              width: "28",
              height: "28",
              viewBox: "0 0 24 24",
              className: `cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 ${isLiked ? "text-sky-300" : "text-gray-300"}`,
              children: /* @__PURE__ */ jsx(
                "path",
                {
                  fill: "currentColor",
                  d: "M20 8h-5.612l1.123-3.367c.202-.608.1-1.282-.275-1.802S14.253 2 13.612 2H12c-.297 0-.578.132-.769.36L6.531 8H4c-1.103 0-2 .897-2 2v9c0 1.103.897 2 2 2h13.307a2.01 2.01 0 0 0 1.873-1.298l2.757-7.351A1 1 0 0 0 22 12v-2c0-1.103-.897-2-2-2M4 10h2v9H4zm16 1.819L17.307 19H8V9.362L12.468 4h1.146l-1.562 4.683A.998.998 0 0 0 13 10h7z"
                }
              )
            }
          ),
          /* @__PURE__ */ jsx("span", { className: "font-normal text-gray-300", children: likeCount })
        ] }),
        movie.luot_dislike >= 0 && /* @__PURE__ */ jsxs("div", { className: "flex flex-row py-1", children: [
          /* @__PURE__ */ jsx(
            "svg",
            {
              onClick: handleDislike,
              xmlns: "http://www.w3.org/2000/svg",
              width: "28",
              height: "28",
              viewBox: "0 0 24 24",
              className: `rotate-180 cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 ${isDisliked ? "text-sky-300" : "text-gray-300"}`,
              children: /* @__PURE__ */ jsx(
                "path",
                {
                  fill: "currentColor",
                  d: "M20 8h-5.612l1.123-3.367c.202-.608.1-1.282-.275-1.802S14.253 2 13.612 2H12c-.297 0-.578.132-.769.36L6.531 8H4c-1.103 0-2 .897-2 2v9c0 1.103.897 2 2 2h13.307a2.01 2.01 0 0 0 1.873-1.298l2.757-7.351A1 1 0 0 0 22 12v-2c0-1.103-.897-2-2-2M4 10h2v9H4zm16 1.819L17.307 19H8V9.362L12.468 4h1.146l-1.562 4.683A.998.998 0 0 0 13 10h7z"
                }
              )
            }
          ),
          /* @__PURE__ */ jsx("span", { className: "font-normal text-gray-300", children: dislikeCount })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2 rounded-lg bg-[#ffffff1a] p-4 lg:w-[25%]", children: [
      movie.tmdb && /* @__PURE__ */ jsxs("div", { className: "flex h-fit w-full flex-shrink-0 items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-end gap-1 text-white", children: [
          /* @__PURE__ */ jsx("span", { className: "text-2xl font-bold", children: movie.tmdb }),
          /* @__PURE__ */ jsx("span", { className: "text-sm", children: "/10" }),
          " "
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-end gap-2", children: [
          /* @__PURE__ */ jsx("div", { className: "flex items-center gap-1", children: renderStars(movie.tmdb) }),
          /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-300", children: "Đánh Giá" }),
          " "
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        thongbao && /* @__PURE__ */ jsxs("div", { className: "my-2 flex w-full flex-col items-start gap-4 text-sm text-white", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-row items-center justify-center gap-2", children: [
            /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
              "img",
              {
                src: alarmGif.src,
                alt: "Thông Báo",
                className: "h-8 w-8 rounded-full bg-[#0005]"
              }
            ) }),
            /* @__PURE__ */ jsx("span", { className: "font-semibold text-transparent text-white", children: "Thông Báo" })
          ] }),
          /* @__PURE__ */ jsx(
            "span",
            {
              className: "text-sm leading-6",
              dangerouslySetInnerHTML: {
                __html: thongbao.noidung
              }
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-8 hidden flex-col items-center justify-center gap-2 sm:flex", children: [
          /* @__PURE__ */ jsx(
            "img",
            {
              src: typeof qrtele === "string" ? qrtele : qrtele.src,
              alt: "Mã QR Telegram",
              className: "h-32 w-32 object-contain"
            }
          ),
          /* @__PURE__ */ jsx("h3", { className: "text-xs font-medium text-gray-300", children: "Tham gia group Telegram" })
        ] })
      ] })
    ] }),
    " "
  ] });
};

const Actor = () => /* @__PURE__ */ jsx(
  "svg",
  {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    className: "h-full w-full p-2 text-gray-600",
    children: /* @__PURE__ */ jsx(
      "path",
      {
        fill: "currentColor",
        d: "M4 22a8 8 0 1 1 16 0zm8-9c-3.315 0-6-2.685-6-6s2.685-6 6-6s6 2.685 6 6s-2.685 6-6 6"
      }
    )
  }
);
const MovieActors = ({ actors }) => {
  if (!actors || actors.length === 0) {
    return /* @__PURE__ */ jsxs("div", { className: "flex min-h-[200px] w-full flex-col items-center justify-center rounded-lg bg-[#00000033] text-gray-500", children: [
      /* @__PURE__ */ jsx(Actor, { className: "h-20 w-20" }),
      /* @__PURE__ */ jsx("span", { children: "Không có diễn viên." })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "w-full", children: [
    /* @__PURE__ */ jsx("h3", { className: "mb-4 text-lg font-semibold text-white lg:text-2xl", children: "Diễn viên" }),
    /* @__PURE__ */ jsx("ul", { className: "grid grid-cols-2 gap-4 lg:grid-cols-6", children: actors.map((actor) => /* @__PURE__ */ jsx("li", { className: "flex flex-col items-center text-center", children: /* @__PURE__ */ jsxs(
      "a",
      {
        href: `/dien-vien/${actor.slug}`,
        className: "group relative flex w-full flex-col",
        children: [
          /* @__PURE__ */ jsx("div", { className: "relative flex h-52 w-full flex-shrink-0 items-center justify-center overflow-hidden rounded-md bg-gray-800", children: actor.anh_url ? /* @__PURE__ */ jsx(
            "img",
            {
              src: actor.anh_url,
              alt: actor.ten,
              className: "h-auto w-full object-cover transition-transform duration-300 group-hover:scale-105",
              loading: "lazy"
            }
          ) : /* @__PURE__ */ jsx("div", { className: "flex h-auto w-full items-center justify-center", children: /* @__PURE__ */ jsx(Actor, {}) }) }),
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "absolute bottom-0 left-0 h-[70%] w-full rounded-b-md",
              style: {
                background: "linear-gradient(to top, rgba(30, 30, 30, 0.8) 5%, transparent 100%)"
              },
              "aria-hidden": "true"
            }
          ),
          /* @__PURE__ */ jsx("p", { className: "absolute bottom-0 left-0 right-0 z-20 px-2 py-1 text-xs lg:text-sm font-medium text-white transition-colors duration-200 group-hover:text-blue-300", children: actor.ten })
        ]
      }
    ) }, actor.id)) })
  ] });
};

const EmptyBoxIcon$1 = () => /* @__PURE__ */ jsx(
  "svg",
  {
    xmlns: "http://www.w3.org/2000/svg",
    width: "64",
    height: "64",
    viewBox: "0 0 24 24",
    children: /* @__PURE__ */ jsxs("g", { fill: "none", fillRule: "evenodd", children: [
      /* @__PURE__ */ jsx("path", { d: "m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z" }),
      /* @__PURE__ */ jsx(
        "path",
        {
          fill: "currentColor",
          d: "M11.084 3.244a3 3 0 0 1 1.607-.063l.225.063L19.45 5.34c.19.063.361.181.486.346l.07.105l2.75 4.747a1 1 0 0 1-.44 1.407l-.12.047l-2.051.658v4.33a2 2 0 0 1-1.237 1.848l-.152.056l-5.84 1.872a3 3 0 0 1-1.607.063l-.225-.062l-5.84-1.873a2 2 0 0 1-1.382-1.743l-.007-.162V12.65l-2.051-.658a1 1 0 0 1-.617-1.338l.057-.116l2.75-4.747a1 1 0 0 1 .445-.406l.11-.045zM13 12.305v6.324l5.145-1.65v-3.687l-3.09.991a1 1 0 0 1-1.106-.353l-.064-.098zm-2 0l-.885 1.527a1 1 0 0 1-1.17.451l-3.09-.991v3.687L11 18.63zM5.32 7.49l-1.723 2.977l5.191 1.666l1.725-2.977zm13.36 0l-5.193 1.666l1.724 2.977l5.192-1.666zm-6.375-2.342a1 1 0 0 0-.49-.03l-.12.03L8.13 6.292L12 7.533l3.87-1.241z"
        }
      )
    ] })
  }
);
const MovieImages = ({ imagesData }) => {
  const images = Array.isArray(imagesData?.images) ? imagesData.images : [];
  if (images.length === 0) {
    return /* @__PURE__ */ jsxs("div", { className: "flex min-h-[200px] w-full flex-col items-center justify-center rounded-lg bg-[#00000033] text-gray-500", children: [
      /* @__PURE__ */ jsx(EmptyBoxIcon$1, {}),
      /* @__PURE__ */ jsx("span", { children: "Không có hình ảnh." })
    ] });
  }
  const backdrops = images.filter((image) => image.loai_anh === "backdrop").slice(0, 5);
  const posters = images.filter((image) => image.loai_anh === "poster").slice(0, 5);
  const combinedImages = [];
  const totalImages = Math.max(backdrops.length, posters.length * 2);
  for (let i = 0; i < totalImages; i++) {
    if (i < backdrops.length) {
      combinedImages.push(backdrops[i]);
    }
    if (i % 2 === 0 && i / 2 < posters.length) {
      combinedImages.push(posters[i / 2]);
    }
  }
  const finalImages = combinedImages.slice(0, 10);
  return /* @__PURE__ */ jsxs("div", { className: "w-full", children: [
    /* @__PURE__ */ jsx("h3", { className: "mb-4 text-lg font-semibold text-white lg:text-2xl", children: "Hình ảnh" }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-5 items-stretch gap-1.5 lg:grid-cols-8", children: finalImages.map((image) => /* @__PURE__ */ jsx(
      "div",
      {
        className: `overflow-hidden ${image.loai_anh === "backdrop" ? "col-span-2" : "col-span-1"}`,
        children: /* @__PURE__ */ jsx(
          "img",
          {
            src: image.duong_dan_file,
            alt: "Hình ảnh phim",
            className: "h-full w-full object-cover",
            loading: "lazy"
          }
        )
      },
      image.id
    )) })
  ] });
};

const EmptyBoxIcon = () => /* @__PURE__ */ jsx(
  "svg",
  {
    xmlns: "http://www.w3.org/2000/svg",
    width: "64",
    height: "64",
    viewBox: "0 0 24 24",
    children: /* @__PURE__ */ jsxs("g", { fill: "none", fillRule: "evenodd", children: [
      /* @__PURE__ */ jsx("path", { d: "m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z" }),
      /* @__PURE__ */ jsx(
        "path",
        {
          fill: "currentColor",
          d: "M11.084 3.244a3 3 0 0 1 1.607-.063l.225.063L19.45 5.34c.19.063.361.181.486.346l.07.105l2.75 4.747a1 1 0 0 1-.44 1.407l-.12.047l-2.051.658v4.33a2 2 0 0 1-1.237 1.848l-.152.056l-5.84 1.872a3 3 0 0 1-1.607.063l-.225-.062l-5.84-1.873a2 2 0 0 1-1.382-1.743l-.007-.162V12.65l-2.051-.658a1 1 0 0 1-.617-1.338l.057-.116l2.75-4.747a1 1 0 0 1 .445-.406l.11-.045zM13 12.305v6.324l5.145-1.65v-3.687l-3.09.991a1 1 0 0 1-1.106-.353l-.064-.098zm-2 0l-.885 1.527a1 1 0 0 1-1.17.451l-3.09-.991v3.687L11 18.63zM5.32 7.49l-1.723 2.977l5.191 1.666l1.725-2.977zm13.36 0l-5.193 1.666l1.724 2.977l5.192-1.666zm-6.375-2.342a1 1 0 0 0-.49-.03l-.12.03L8.13 6.292L12 7.533l3.87-1.241z"
        }
      )
    ] })
  }
);
const EmptyState = () => /* @__PURE__ */ jsxs("div", { className: "flex min-h-[200px] w-full flex-col items-center justify-center rounded-lg bg-[#00000033] text-gray-500", children: [
  /* @__PURE__ */ jsx(EmptyBoxIcon, {}),
  /* @__PURE__ */ jsx("span", { children: "Không có trailer." })
] });
const Trailer = ({ trailer_url }) => {
  if (!trailer_url) {
    return /* @__PURE__ */ jsx(EmptyState, {});
  }
  let videoId = null;
  try {
    const url = new URL(trailer_url);
    if (url.hostname === "www.youtube.com" || url.hostname === "youtube.com") {
      const params = new URLSearchParams(url.search);
      videoId = params.get("v");
    }
  } catch (e) {
    return /* @__PURE__ */ jsx(EmptyState, {});
  }
  if (!videoId) {
    return /* @__PURE__ */ jsx(EmptyState, {});
  }
  const embedUrl = `https://www.youtube.com/embed/${videoId}`;
  return /* @__PURE__ */ jsxs("div", { className: "w-full", children: [
    /* @__PURE__ */ jsx("h3", { className: "mb-4 text-lg font-semibold text-white lg:text-2xl", children: "Trailer" }),
    /* @__PURE__ */ jsx("div", { className: "max-w-lg", children: /* @__PURE__ */ jsx("div", { className: "relative aspect-[16/9] w-full overflow-hidden rounded-lg", children: /* @__PURE__ */ jsx(
      "iframe",
      {
        className: "absolute left-0 top-0 h-full w-full",
        src: embedUrl,
        title: "Movie Trailer",
        allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
        allowFullScreen: true,
        fetchPriority: "high"
      }
    ) }) })
  ] });
};

const PhanLienQuan = ({ movie }) => {
  if (!movie || movie.length === 0) {
    return null;
  }
  return /* @__PURE__ */ jsx("div", { className: "py-4", children: /* @__PURE__ */ jsx("div", { className: "grid grid-cols-3 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6", children: movie.map((phan) => /* @__PURE__ */ jsx(
    "a",
    {
      href: `/phim/${phan.phim.slug}`,
      className: "group block overflow-hidden rounded-lg",
      children: /* @__PURE__ */ jsxs("div", { className: "relative pb-[150%]", children: [
        /* @__PURE__ */ jsx(
          "img",
          {
            src: phan.phim.poster_url,
            alt: phan.phim.ten_phim,
            className: "absolute inset-0 h-full w-full rounded-lg object-cover"
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 rounded-lg bg-gradient-to-t from-black via-transparent to-transparent opacity-70 transition-opacity duration-200 group-hover:opacity-100" }),
        /* @__PURE__ */ jsx("span", { className: "absolute bottom-0 rounded bg-black bg-opacity-50 p-1 text-center text-xs font-medium text-white", children: phan.phim.ten_phim }),
        /* @__PURE__ */ jsxs("span", { className: "absolute left-2 top-2 rounded-md bg-[linear-gradient(90deg,#e5330b_0%,#ff670b_51%,#d9a666_100%)] px-2 py-1 text-xs font-semibold text-white", children: [
          " ",
          phan.ten_phan
        ] })
      ] })
    },
    phan.id
  )) }) });
};

const MovieTabsAndCast = ({
  vietsubEpisodes,
  thuyetMinhEpisodes,
  longtiengEpisodes,
  slug,
  currentType,
  actors,
  images,
  phanlienquan,
  trailer_url,
  movieTitle,
  initialSortAscending
}) => {
  const [activeTab, setActiveTab] = useState("episodes");
  return /* @__PURE__ */ jsxs("div", { className: "py-4", children: [
    /* @__PURE__ */ jsx("h2", { className: "mb-4 text-lg font-semibold lg:text-xl", children: "Mục Phim" }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3 border-b border-gray-700 text-xs lg:gap-8 lg:text-base", children: [
      /* @__PURE__ */ jsx(
        TabButton,
        {
          label: "Tập Phim",
          tabName: "episodes",
          activeTab,
          setActiveTab
        }
      ),
      phanlienquan && phanlienquan.length > 0 && /* @__PURE__ */ jsx(
        TabButton,
        {
          label: "Phần Liên Quan",
          tabName: "phanlienquans",
          activeTab,
          setActiveTab
        }
      ),
      /* @__PURE__ */ jsx(
        TabButton,
        {
          label: "Trailer",
          tabName: "trailer",
          activeTab,
          setActiveTab
        }
      ),
      /* @__PURE__ */ jsx(
        TabButton,
        {
          label: "Diễn viên",
          tabName: "cast",
          activeTab,
          setActiveTab
        }
      ),
      /* @__PURE__ */ jsx(
        TabButton,
        {
          label: "Hình ảnh",
          tabName: "images",
          activeTab,
          setActiveTab
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "pt-4 lg:pt-8", children: [
      activeTab === "episodes" && /* @__PURE__ */ jsx(
        Episodes,
        {
          vietsub: vietsubEpisodes,
          thuyetminh: thuyetMinhEpisodes,
          longtieng: longtiengEpisodes,
          slug,
          currentType,
          movieTitle,
          initialSortAscending
        }
      ),
      activeTab === "cast" && /* @__PURE__ */ jsx(MovieActors, { actors }),
      activeTab === "images" && /* @__PURE__ */ jsx(MovieImages, { imagesData: images }),
      activeTab === "trailer" && /* @__PURE__ */ jsx(Trailer, { trailer_url }),
      activeTab === "phanlienquans" && /* @__PURE__ */ jsx(PhanLienQuan, { movie: phanlienquan })
    ] })
  ] });
};
const TabButton = ({ label, tabName, activeTab, setActiveTab }) => {
  const isActive = activeTab === tabName;
  return /* @__PURE__ */ jsxs(
    "button",
    {
      className: `duration-400 relative px-2 py-4 text-xs lg:text-sm font-medium transition-colors ease-in-out ${isActive ? "text-white" : "text-gray-400 hover:text-white"}`,
      onClick: () => setActiveTab(tabName),
      children: [
        label,
        isActive && /* @__PURE__ */ jsx(
          "span",
          {
            className: "absolute bottom-0 left-1/2 -translate-x-1/2 transform border-b-2 border-sky-300",
            style: { width: "20px" }
          }
        )
      ]
    }
  );
};

const BASE_URL = "https://api.motchillx.site";
async function getMoviePageData(slug) {
  const urlVietsub = `${BASE_URL}/api/phim/${slug}/vietsub/?server=sv1`;
  const urlThuyetMinh = `${BASE_URL}/api/phim/${slug}/thuyetminh/?server=sv1`;
  const urlLongTieng = `${BASE_URL}/api/phim/${slug}/longtieng/?server=sv1`;
  const urlTop = `${BASE_URL}/api/filter/?page=1&limit=10&sort=luot-xem`;
  const urlDeXuat = `${BASE_URL}/api/phim/?page=1&limit=15`;
  const urlActors = `${BASE_URL}/api/phim/${slug}/dien-vien`;
  const urlImages = `${BASE_URL}/api/phim/${slug}/images`;
  const urlThongBao = `${BASE_URL}/api/phim/${slug}/thong-bao`;
  try {
    const [
      vietsub,
      thuyetminh,
      longtieng,
      top,
      deXuat,
      actors,
      images,
      // Biến này chứa kết quả từ API /images
      thongbao
    ] = await Promise.all([
      fetch(urlVietsub).then((r) => r.json()),
      fetch(urlThuyetMinh).then((r) => r.json()),
      fetch(urlLongTieng).then((r) => r.json()),
      fetch(urlTop).then((r) => r.json()),
      fetch(urlDeXuat).then((r) => r.json()),
      fetch(urlActors).then((r) => r.json()),
      fetch(urlImages).then((r) => r.json()),
      // Lệnh gọi API /images
      fetch(urlThongBao).then((r) => r.json())
    ]);
    let firstEpisode = null;
    if (vietsub && vietsub.length > 0) {
      firstEpisode = vietsub[0];
    } else if (thuyetminh && thuyetminh.length > 0) {
      firstEpisode = thuyetminh[0];
    } else if (longtieng && longtieng.length > 0) {
      firstEpisode = longtieng[0];
    } else {
      console.log("❌ Không tìm thấy tập phim nào.");
    }
    return {
      vietsub,
      thuyetminh,
      longtieng,
      topmovies: top?.data || [],
      dexuatmovies: deXuat?.data || [],
      actors: actors || [],
      images: images || [],
      thongbao: thongbao || [],
      firstEpisode
    };
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu trang phim:", error);
    return {
      vietsub: [],
      thuyetminh: [],
      longtieng: [],
      topmovies: [],
      dexuatmovies: [],
      actors: [],
      images: [],
      thongbao: [],
      firstEpisode: null
    };
  }
}

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro$1 = createAstro();
const $$SeoPhim = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$SeoPhim;
  const { movie, slug } = Astro2.props;
  const SEO = {
    siteName: "MePhimTV",
    siteUrl: Astro2.url.origin,
    canonical: Astro2.url.href,
    name: capitalizeWords(movie.ten_phim || ""),
    originName: movie.ten_khac || "",
    year: movie.nam_phat_hanh || "",
    description: cleanhtml(movie.mo_ta),
    poster: movie.poster_url,
    genres: Array.isArray(movie.the_loai) ? movie.the_loai.map((g) => g.ten) : []
  };
  const pageTitle = `Phim ${SEO.name} | ${SEO.originName} - ${SEO.siteName}`;
  const metaDescription = `Xem Phim ${SEO.name} ${SEO.year} Vietsub Thuy\u1EBFt minh m\u1EDBi nh\u1EA5t tr\xEAn ${SEO.siteName} - ${SEO.description}`.slice(0, 250).trim() + "\u2026";
  const fullSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Movie",
        "@id": `${SEO.canonical}#movie`,
        name: SEO.name,
        description: SEO.description,
        image: SEO.poster,
        url: SEO.canonical,
        genre: SEO.genres
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${SEO.canonical}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Trang ch\u1EE7", item: `${SEO.siteUrl}/` },
          { "@type": "ListItem", position: 2, name: "Phim", item: `${SEO.siteUrl}/phim` },
          { "@type": "ListItem", position: 3, name: SEO.name, item: SEO.canonical }
        ]
      },
      {
        "@type": "WebSite",
        "@id": `${SEO.siteUrl}#website`,
        url: SEO.siteUrl,
        name: SEO.siteName,
        potentialAction: {
          "@type": "SearchAction",
          target: `${SEO.siteUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "Organization",
        "@id": `${SEO.siteUrl}#organization`,
        name: SEO.siteName,
        url: SEO.siteUrl,
        logo: {
          "@type": "ImageObject",
          url: `${SEO.siteUrl}/thumb_web.png`
        }
      }
    ]
  };
  return renderTemplate(_a || (_a = __template(["<title>", '</title><meta name="description"', '><link rel="canonical"', '><meta property="og:title"', '><meta property="og:description"', '><meta property="og:image"', '><meta property="og:url"', '><meta property="og:type" content="video.movie"><meta property="og:site_name"', '><meta property="og:locale" content="vi_VN"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title"', '><meta name="twitter:description"', '><meta name="twitter:image"', '><script type="application/ld+json">', "<\/script>"])), pageTitle, addAttribute(metaDescription, "content"), addAttribute(SEO.canonical, "href"), addAttribute(pageTitle, "content"), addAttribute(metaDescription, "content"), addAttribute(SEO.poster, "content"), addAttribute(SEO.canonical, "content"), addAttribute(SEO.siteName, "content"), addAttribute(pageTitle, "content"), addAttribute(metaDescription, "content"), addAttribute(SEO.poster, "content"), unescapeHTML(JSON.stringify(fullSchema)));
}, "/home/vohaidang/Desktop/tramphim-v2/ui/src/seometas/SeoPhim.astro", void 0);

const Breadcrumb = ({ movie }) => {
  if (!movie) return null;
  const homeUrl = "/";
  const movieTitle = movie.ten_phim;
  return /* @__PURE__ */ jsx(
    "nav",
    {
      className: "mx-auto flex max-w-screen-xl ",
      "aria-label": "Breadcrumb",
      children: /* @__PURE__ */ jsxs("ol", { className: "flex flex-wrap items-center justify-start gap-x-1 gap-y-1 text-sm lg:text-base ", children: [
        /* @__PURE__ */ jsx("li", { className: "inline-flex min-w-0 items-start", children: /* @__PURE__ */ jsx(
          "a",
          {
            href: homeUrl,
            className: "whitespace-normal break-words leading-snug text-white hover:text-sky-300",
            children: "Trang Chủ"
          }
        ) }),
        /* @__PURE__ */ jsx("li", { "aria-current": "page", className: "min-w-0", children: /* @__PURE__ */ jsxs("div", { className: "flex min-w-0 items-start", children: [
          /* @__PURE__ */ jsx(
            "svg",
            {
              xmlns: "http://www.w3.org/2000/svg",
              width: "16",
              height: "16",
              viewBox: "0 0 16 16",
              className: "me-1 mt-[2px] shrink-0 lg:mt-[4px]",
              "aria-hidden": "true",
              children: /* @__PURE__ */ jsx(
                "path",
                {
                  fill: "currentColor",
                  fillRule: "evenodd",
                  d: "m10.207 8l-3.854 3.854l-.707-.707L8.793 8L5.646 4.854l.707-.708z",
                  clipRule: "evenodd"
                }
              )
            }
          ),
          /* @__PURE__ */ jsx("span", { className: "min-w-0 max-w-full whitespace-normal break-words font-medium leading-snug text-gray-400", children: movieTitle })
        ] }) })
      ] })
    }
  );
};

const $$Astro = createAstro();
const prerender = false;
const revalidate = 5;
const $$slug = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$slug;
  const { slug } = Astro2.params;
  console.log("\u{1F504} RENDER MOVIE PAGE:", slug, /* @__PURE__ */ new Date());
  let movie = null;
  try {
    const movieApiUrl = `${BASE_URL}/api/phim/${slug}/`;
    const movieResponse = await fetch(movieApiUrl);
    if (movieResponse.ok) {
      const movieData = await movieResponse.json();
      movie = movieData;
    } else {
    }
  } catch (error) {
  }
  if (!movie) {
    return new Response(null, {
      status: 404,
      statusText: "Not Found"
    });
  }
  let vietsub = [];
  let thuyetminh = [];
  let longtieng = [];
  let firstEpisode = null;
  let actors = [];
  let images = [];
  let topmovies = [];
  let thongbao = [];
  let phanLienQuan = [];
  try {
    const moviePageData = await getMoviePageData(slug);
    vietsub = moviePageData.vietsub || [];
    thuyetminh = moviePageData.thuyetminh || [];
    longtieng = moviePageData.longtieng || [];
    firstEpisode = moviePageData.firstEpisode || null;
    phanLienQuan = moviePageData.phanlienquan || null;
    topmovies = moviePageData.topmovies;
    actors = moviePageData.actors || [];
    images = moviePageData.images || [];
    thongbao = moviePageData.thongbao;
  } catch (error) {
  }
  const firstEpisodeSlug = firstEpisode?.tap_phim?.slug;
  const firstEpisodeType = firstEpisode?.ngon_ngu;
  const pageUrl = Astro2.url.href;
  const slugCookieName = `fav_${slug}`;
  const initialIsFavorite = Astro2.cookies.get(slugCookieName)?.value === "1";
  const sortEpisode = Astro2.cookies.get("sortEpisode")?.value !== "0";
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$Layout, {}, { "default": async ($$result2) => renderTemplate`  ${maybeRenderHead()}<div class="relative"${addAttribute({
    backgroundImage: `url(${movie.banner_url})`,
    backgroundSize: "auto",
    backgroundPosition: "center"
  }, "style")}> <img${addAttribute(movie.banner_url, "src")} alt="banner phim" fetchpriority="high" decoding="async" class="hidden"> <div class="movie-banner-background"></div> <div class="movie-content-base"> <div class="header-shadow"> ${renderComponent($$result2, "Header", Header, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/home/vohaidang/Desktop/tramphim-v2/ui/src/components/Header/Header", "client:component-export": "default" })} </div> <main class="main-content-layout"> ${renderComponent($$result2, "MovieDetail", MovieDetail, { "movie": movie, "firstEpisodeSlug": firstEpisodeSlug, "firstEpisodeType": firstEpisodeType, "client:load": true, "thongbao": thongbao, "initialIsFavorite": initialIsFavorite, "client:component-hydration": "load", "client:component-path": "/home/vohaidang/Desktop/tramphim-v2/ui/src/components/MovieDetail/MovieDetailStaticInfo", "client:component-export": "default" })} </main> </div> </div> <div class="breadcrumb-padding"> ${renderComponent($$result2, "Breadcrumb", Breadcrumb, { "movie": movie })} </div> <div class="page-wrapper-base"> <div class="main-column-flex"> <div class="detail-tabs-column"> ${renderComponent($$result2, "MovieTabsAndCast", MovieTabsAndCast, { "vietsubEpisodes": vietsub, "thuyetMinhEpisodes": thuyetminh, "longtiengEpisodes": longtieng, "slug": slug, "currentType": null, "movieTitle": movie.ten_phim, "trailer_url": movie.trailer_url, "phanlienquan": phanLienQuan, "actors": actors, "images": { images }, "initialSortAscending": sortEpisode, "client:load": true, "client:component-hydration": "load", "client:component-path": "/home/vohaidang/Desktop/tramphim-v2/ui/src/components/MovieDetail/MovieTab", "client:component-export": "default" })} <div class="comment-section-padding"> <h2 class="comment-section-title">Bình Luận Phim</h2> ${renderComponent($$result2, "FacebookComments", FacebookComments, { "url": pageUrl, "client:visible": true, "client:component-hydration": "visible", "client:component-path": "/home/vohaidang/Desktop/tramphim-v2/ui/src/components/FacebookComments", "client:component-export": "default" })} </div> </div> <div class="sidebar-column"> ${renderComponent($$result2, "TopMovies", TopMovies, { "movies": topmovies, "client:idle": true, "client:component-hydration": "idle", "client:component-path": "/home/vohaidang/Desktop/tramphim-v2/ui/src/components/TopMovies/TopMovies", "client:component-export": "default" })} </div> </div> </div> <footer class="px-0"> ${renderComponent($$result2, "Footer", Footer, {})} </footer> `, "head": async ($$result2) => renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "slot": "head" }, { "default": async ($$result3) => renderTemplate` ${renderComponent($$result3, "SEO", $$SeoPhim, { "movie": movie, "slug": slug })} ` })}` })}`;
}, "/home/vohaidang/Desktop/tramphim-v2/ui/src/pages/phim/[slug].astro", void 0);

const $$file = "/home/vohaidang/Desktop/tramphim-v2/ui/src/pages/phim/[slug].astro";
const $$url = "/phim/[slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$slug,
	file: $$file,
	prerender,
	revalidate,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
