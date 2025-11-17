import React, { useState, useEffect } from "react";

const API_BASE_URL = import.meta.env.PUBLIC_API_BASE_URL;
import {
  rutGonTinhTrangPhim,
  rutGonTinhTrangNgonNgu,
} from "../../utils/movieUtils";

const MovieDetail = ({ movie }) => {
  const [isSharePopupOpen, setIsSharePopupOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [isMobileDetailsVisible, setIsMobileDetailsVisible] = useState(false);
  const [likeCount, setLikeCount] = useState(movie.luot_like || 0);
  const [dislikeCount, setDislikeCount] = useState(movie.luot_dislike || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);

  useEffect(() => {
    setLikeCount(movie.luot_like || 0);
    setDislikeCount(movie.luot_dislike || 0);
  }, [movie]);

  const handleCopyLink = () => {
    const link = window.location.href;
    navigator.clipboard.writeText(link).then(() => {});
  };

  const handleLike = async () => {
    if (isLiked) {
      return; // Prevent multiple likes
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

  const handleToggleDetails = () => {
    if (window.innerWidth < 640) {
      setIsMobileDetailsVisible(true);
    } else {
      setShowDetails(!showDetails);
    }
  };

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between py-4 font-normal text-white">
        <div className="flex flex-wrap items-center gap-6">
          {/* 1. Main H1 tag - KEEP this one */}
          <h1 className="text-left text-base font-bold leading-tight text-white lg:text-2xl">
            {movie.ten_phim}
          </h1>

          {/* Nút Giới thiệu */}
          <button
            onClick={handleToggleDetails}
            className="flex items-center lg:text-sm text-xs font-normal sm:static"
          >
            <span className="">Giới thiệu</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`ml-1 h-4 w-4 -rotate-90 transform transition-transform duration-300 ${
                showDetails ? "hidden -rotate-90 sm:block" : ""
              }`}
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
        </div>

        <div className="ml-auto hidden flex-row items-center justify-end gap-4 sm:flex">
          <div className="relative">
            <svg
              onClick={() => setIsSharePopupOpen(!isSharePopupOpen)}
              xmlns="http://www.w3.org/2000/svg"
              width="26"
              height="26"
              viewBox="0 0 48 48"
              className="cursor-pointer transition-all duration-300 ease-in-out hover:scale-105"
            >
              <g
                fill="none"
                stroke="#9ca3af"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="4"
              >
                <path d="M28 6H42V20" />
                <path d="M42 29.4737V39C42 40.6569 40.6569 42 39 42H9C7.34315 42 6 40.6569 6 39V9C6 7.34315 7.34315 6 9 6L18 6" />
                <path d="M25.7998 22.1999L41.0998 6.8999" />
              </g>
            </svg>
            {isSharePopupOpen && (
              <div
                className="absolute right-0 top-full z-50 mt-2 w-[350px] rounded-lg bg-[#35373d] p-4 shadow-lg"
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
                    className="rounded-md bg-sky-300 px-3 py-1 text-xs font-semibold text-black"
                  >
                    Sao Chép
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
                className="cursor-pointer text-gray-400 transition-all duration-300 ease-in-out hover:scale-105"
              >
                <path
                  fill="currentColor"
                  d="M6 8c0-2.21 1.79-4 4-4s4 1.79 4 4s-1.79 4-4 4s-4-1.79-4-4m3.14 11.75L8.85 19l.29-.75c.7-1.75 1.94-3.11 3.47-4.03c-.82-.14-1.69-.22-2.61-.22c-4.42 0-8 1.79-8 4v2h7.27c-.04-.09-.09-.17-.13-.25M17 18c-.56 0-1 .44-1 1s.44 1 1 1s1-.44 1-1s-.44-1-1-1m6 1c-.94 2.34-3.27 4-6 4s-5.06-1.66-6-4c.94-2.34 3.27-4 6-4s5.06 1.66 6 4m-3.5 0a2.5 2.5 0 0 0-5 0a2.5 2.5 0 0 0 5 0"
                />
              </svg>
              <span className="font-normal text-gray-400">
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
                  isLiked ? "text-sky-300" : "text-gray-400"
                }`}
              >
                <path
                  fill="currentColor"
                  d="M20 8h-5.612l1.123-3.367c.202-.608.1-1.282-.275-1.802S14.253 2 13.612 2H12c-.297 0-.578.132-.769.36L6.531 8H4c-1.103 0-2 .897-2 2v9c0 1.103.897 2 2 2h13.307a2.01 2.01 0 0 0 1.873-1.298l2.757-7.351A1 1 0 0 0 22 12v-2c0-1.103-.897-2-2-2M4 10h2v9H4zm16 1.819L17.307 19H8V9.362L12.468 4h1.146l-1.562 4.683A.998.998 0 0 0 13 10h7z"
                />
              </svg>
              <span className="font-normal text-gray-400">{likeCount}</span>
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
                  isDisliked ? "text-sky-300" : "text-gray-400"
                }`}
              >
                <path
                  fill="currentColor"
                  d="M20 8h-5.612l1.123-3.367c.202-.608.1-1.282-.275-1.802S14.253 2 13.612 2H12c-.297 0-.578.132-.769.36L6.531 8H4c-1.103 0-2 .897-2 2v9c0 1.103.897 2 2 2h13.307a2.01 2.01 0 0 0 1.873-1.298l2.757-7.351A1 1 0 0 0 22 12v-2c0-1.103-.897-2-2-2M4 10h2v9H4zm16 1.819L17.307 19H8V9.362L12.468 4h1.146l-1.562 4.683A.998.998 0 0 0 13 10h7z"
                />
              </svg>
              <span className="font-normal text-gray-400">{dislikeCount}</span>
            </div>
          )}
        </div>
      </div>
     
      <div className="flex w-full flex-wrap items-center gap-2 text-sm font-medium text-[#ECECEC]">
        {[
          movie.tinh_trang && (
            <span className="text-sky-300">
              {rutGonTinhTrangPhim(movie.tinh_trang)}
            </span>
          ),
          movie.nam_phat_hanh && <span>{movie.nam_phat_hanh}</span>,
          movie.ngon_ngu && <span>{movie.ngon_ngu}</span>,
          movie.the_loai && movie.the_loai.length > 0 && (
            <span>
              {movie.the_loai.map((genre, index) => (
                <span key={genre.ten}>
                  {genre.ten}
                  {index < movie.the_loai.length - 1 && " / "}
                </span>
              ))}
            </span>
          ),
        ]
          .filter(Boolean)
          .map((item, index, arr) => (
            <span key={index}>
              {item}
              {index < arr.length - 1 && " / "}
            </span>
          ))}
      </div>
 <div className="flex flex-row items-center justify-between gap-4 sm:hidden pt-4">
        <div className="relative flex items-center justify-center gap-6">
          <svg
            onClick={() => setIsSharePopupOpen(!isSharePopupOpen)}
            xmlns="http://www.w3.org/2000/svg"
            width="26"
            height="26"
            viewBox="0 0 48 48"
            className="cursor-pointer transition-all duration-300 ease-in-out hover:scale-105"
          >
            <g
              fill="none"
              stroke="#9ca3af"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="4"
            >
              <path d="M28 6H42V20" />
              <path d="M42 29.4737V39C42 40.6569 40.6569 42 39 42H9C7.34315 42 6 40.6569 6 39V9C6 7.34315 7.34315 6 9 6L18 6" />
              <path d="M25.7998 22.1999L41.0998 6.8999" />
            </g>
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
                    className="rounded-md bg-blue-300 px-3 py-1 text-xs font-semibold text-black"
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
                className="cursor-pointer text-gray-400 transition-all duration-300 ease-in-out hover:scale-105"
              >
                <path
                  fill="currentColor"
                  d="M6 8c0-2.21 1.79-4 4-4s4 1.79 4 4s-1.79 4-4 4s-4-1.79-4-4m3.14 11.75L8.85 19l.29-.75c.7-1.75 1.94-3.11 3.47-4.03c-.82-.14-1.69-.22-2.61-.22c-4.42 0-8 1.79-8 4v2h7.27c-.04-.09-.09-.17-.13-.25M17 18c-.56 0-1 .44-1 1s.44 1 1 1s1-.44 1-1s-.44-1-1-1m6 1c-.94 2.34-3.27 4-6 4s-5.06-1.66-6-4c.94-2.34 3.27-4 6-4s5.06 1.66 6 4m-3.5 0a2.5 2.5 0 0 0-5 0a2.5 2.5 0 0 0 5 0"
                />
              </svg>
              <span className="font-normal text-gray-400">
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
                  isLiked ? "text-sky-300" : "text-gray-400"
                }`}
              >
                <path
                  fill="currentColor"
                  d="M20 8h-5.612l1.123-3.367c.202-.608.1-1.282-.275-1.802S14.253 2 13.612 2H12c-.297 0-.578.132-.769.36L6.531 8H4c-1.103 0-2 .897-2 2v9c0 1.103.897 2 2 2h13.307a2.01 2.01 0 0 0 1.873-1.298l2.757-7.351A1 1 0 0 0 22 12v-2c0-1.103-.897-2-2-2M4 10h2v9H4zm16 1.819L17.307 19H8V9.362L12.468 4h1.146l-1.562 4.683A.998.998 0 0 0 13 10h7z"
                />
              </svg>
              <span className="font-normal text-gray-400">{likeCount}</span>
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
                  isDisliked ? "text-sky-300" : "text-gray-400"
                }`}
              >
                <path
                  fill="currentColor"
                  d="M20 8h-5.612l1.123-3.367c.202-.608.1-1.282-.275-1.802S14.253 2 13.612 2H12c-.297 0-.578.132-.769.36L6.531 8H4c-1.103 0-2 .897-2 2v9c0 1.103.897 2 2 2h13.307a2.01 2.01 0 0 0 1.873-1.298l2.757-7.351A1 1 0 0 0 22 12v-2c0-1.103-.897-2-2-2M4 10h2v9H4zm16 1.819L17.307 19H8V9.362L12.468 4h1.146l-1.562 4.683A.998.998 0 0 0 13 10h7z"
                />
              </svg>
              <span className="font-normal text-gray-400">{dislikeCount}</span>
            </div>
          )}
        </div>
      </div>
      <div
        className={`mt-4 w-full overflow-hidden rounded-lg bg-[#252525] ${
          showDetails ? "max-h-[500px] px-4 py-6" : "max-h-0 p-0"
        } hidden sm:block`}
      >
        <div className="flex w-full flex-col items-start gap-6 sm:flex-row">
          <div className="flex-shrink-0">
            <div className="relative aspect-[2/3] w-[130px] rounded-lg">
              <img
                src={movie.poster_url}
                alt={`Poster phim ${movie.ten_phim}`}
                className="absolute left-0 top-0 h-full w-full rounded-lg object-cover"
                loading="eager"
                fetchPriority="high"
              />
            </div>
          </div>
          <div className="flex w-full flex-col">
            {/* Changed from h1 to h2 in desktop/tablet detail section */}
            <h2 className="text-left text-base font-semibold leading-tight text-white lg:text-xl">
              {movie.ten_phim}
            </h2>
            {movie.ten_khac && (
              <p className="text-left text-[13px] font-normal text-gray-400">
                {movie.ten_khac}
              </p>
            )}
            <div className="mt-2 flex w-full flex-wrap items-center justify-start gap-1 text-xs font-medium sm:flex lg:gap-3 lg:text-sm">
              {movie.tinh_trang && (
                <div className="text-left lg:flex-none">
                  <span className="hidden text-gray-400 lg:inline">
                    Tình Trạng:
                  </span>
                  <span className="ml-0 text-sky-300 lg:ml-2">
                    {movie.tinh_trang}
                  </span>
                </div>
              )}
              {movie.nam_phat_hanh && (
                <div className="text-left before:pr-2 before:content-['/'] lg:flex-none lg:before:content-none">
                  <span className="hidden text-gray-400 lg:inline">Năm:</span>
                  <span className="ml-0 text-[#ECECEC] lg:ml-2">
                    {movie.nam_phat_hanh}
                  </span>
                </div>
              )}

              {movie.ngon_ngu && (
                <div className="text-left before:pr-2 before:content-['/'] lg:flex-none lg:before:content-none">
                  <span className="hidden text-gray-400 lg:inline">
                    Ngôn ngữ:{" "}
                  </span>
                  <span className="ml-0 text-[#ECECEC] lg:ml-2">
                    {rutGonTinhTrangNgonNgu(movie.ngon_ngu)}
                  </span>
                </div>
              )}
            </div>
            {movie.the_loai && movie.the_loai.length > 0 && (
              <div className="mt-2">
                <span className="mr-2 text-xs font-medium text-gray-400 lg:text-sm">
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
                <h2 className="my-1 text-xs font-medium text-gray-400 lg:text-sm">
                  Đạo diễn:
                  <span className="ml-2 font-normal text-[#ECECEC]">
                    {movie.dao_dien}
                  </span>
                </h2>
              </div>
            )}
            {movie.dien_vien && movie.dien_vien.length > 0 && (
              <div className="my-1 flex flex-col gap-1 text-xs font-medium text-gray-400 lg:text-sm">
                <span className="line-clamp-2">
                  Diễn viên:
                  <span className="ml-2 font-normal text-[#ECECEC]">
                    {movie.dien_vien.map((actor) => actor.ten).join(", ")}
                  </span>
                </span>
              </div>
            )}
            {movie.thoi_luong && (
              <div className="py-1">
                <h2 className="text-xs font-medium text-gray-400 lg:text-sm">
                  Thời Lượng:
                  <span className="ml-2 font-normal text-[#ECECEC]">
                    {movie.thoi_luong}
                  </span>
                </h2
>
              </div>
            )}
            {movie.mo_ta && (
              <div className="hidden flex-row gap-2 py-1 text-xs sm:flex lg:text-sm">
                <h2 className="whitespace-nowrap font-medium text-gray-400 lg:text-sm">
                  Nội Dung:
                </h2>
                <span className="line-clamp-2 font-normal text-[#ECECEC]">
                  {movie.mo_ta}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Popup chi tiết cho Mobile - ĐÃ SỬA CHỈ CHIẾM 75% CHIỀU CAO */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 transform transition-transform duration-300 sm:hidden ${
          isMobileDetailsVisible ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="relative w-full h-[75vh] overflow-y-auto rounded-t-lg bg-[#1a1a1a] px-4 py-2 text-white">
          <button
            onClick={() => setIsMobileDetailsVisible(false)}
            className="absolute right-4 top-2 "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 text-white"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {/* Phần header popup */}
          <div className="flex w-full items-center font-normal text-white pt-4">
            <h2 className="pb-4 text-xl font-normal leading-tight">
              Chi Tiết Phim
            </h2>
          </div>

          {/* Nội dung chi tiết - tương tự phần detail PC */}
          <div className="flex w-full flex-col items-start gap-4">
            <div className="flex w-full flex-col">
              <div className="flex flex-row gap-2">
                <div className="w-[70%]">
                  {/* Changed from h1 to h2 in mobile detail section */}
                  <h2 className="py-2 text-left text-lg font-semibold leading-tight text-white lg:text-xl">
                    {movie.ten_phim}
                  </h2>
                  {movie.ten_khac && (
                    <p className="text-left text-[13px] font-normal text-gray-400">
                      {movie.ten_khac}
                    </p>
                  )}
                  {/* Các thông tin khác */}
                  {movie.tinh_trang && (
                    <div className="mt-2 text-left">
                      <span className="text-sm font-medium text-gray-400">
                        Tình trạng:{" "}
                      </span>
                      <span className="text-sm text-sky-300">
                        {movie.tinh_trang}
                      </span>
                    </div>
                  )}
                  {movie.nam_phat_hanh && (
                    <div className="text-left">
                      <span className="text-sm font-medium text-gray-400">
                        Năm:{" "}
                      </span>
                      <span className="text-sm text-[#ECECEC]">
                        {movie.nam_phat_hanh}
                      </span>
                    </div>
                  )}

                  {movie.ngon_ngu && (
                    <div className="text-left">
                      <span className="text-sm font-medium text-gray-400">
                        Ngôn ngữ:{" "}
                      </span>
                      <span className="text-sm text-[#ECECEC]">
                        {rutGonTinhTrangNgonNgu(movie.ngon_ngu)}
                      </span>
                    </div>
                  )}
                  {movie.the_loai && movie.the_loai.length > 0 && (
                    <div className="text-left">
                      <span className="text-sm font-medium text-gray-400">
                        Thể loại:{" "}
                      </span>
                      <span className="text-sm text-[#ECECEC]">
                        {movie.the_loai.map((genre) => genre.ten).join(" / ")}
                      </span>
                    </div>
                  )}
                  {movie.dao_dien && (
                    <div className="text-left">
                      <span className="text-sm font-medium text-gray-400">
                        Đạo diễn:{" "}
                      </span>
                      <span className="text-sm text-[#ECECEC]">
                        {movie.dao_dien}
                      </span>
                    </div>
                  )}
                  {movie.dien_vien && movie.dien_vien.length > 0 && (
                    <div className="text-left">
                      <span className="text-sm font-medium text-gray-400">
                        Diễn viên:{" "}
                      </span>
                      <span className="text-sm text-[#ECECEC]">
                        {movie.dien_vien.map((actor) => actor.ten).join(", ")}
                      </span>
                    </div>
                  )}
                  {movie.thoi_luong && (
                    <div className="text-left">
                      <span className="text-sm font-medium text-gray-400">
                        Thời lượng:{" "}
                      </span>
                      <span className="text-sm text-[#ECECEC]">
                        {movie.thoi_luong}
                      </span>
                    </div>
                  )}
                </div>
                <div className="relative h-full w-[30%] rounded-lg">
                  <img
                    src={movie.poster_url}
                    alt={`Poster phim ${movie.ten_phim}`}
                    className="absolute left-0 top-0 w-full rounded-lg object-cover"
                  />
                </div>
              </div>
              {movie.mo_ta && (
                <div className="mt-2 text-left">
                  <span className="block text-sm font-medium text-gray-400">
                    Nội dung:
                  </span>
                  <p className="mt-1 text-sm font-normal text-[#ECECEC]">
                    {movie.mo_ta}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;