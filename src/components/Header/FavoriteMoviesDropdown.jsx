import React from "react";

const FAVORITE_DB_NAME = "FavoriteDB";
const FAVORITE_DB_VERSION = 2;
const FAVORITE_STORE_NAME = "FavoriteDB";

const initFavoriteDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(FAVORITE_DB_NAME, FAVORITE_DB_VERSION);

    request.onerror = (event) => reject(event.target.error);
    request.onsuccess = (event) => resolve(event.target.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(FAVORITE_STORE_NAME)) {
        db.createObjectStore(FAVORITE_STORE_NAME, { keyPath: "slug" });
      }
    };
  });
};

const getAllFavoriteMovies = async () => {
  let db;
  try {
    db = await initFavoriteDB();
    const transaction = db.transaction([FAVORITE_STORE_NAME], "readonly");
    const store = transaction.objectStore(FAVORITE_STORE_NAME);

    const result = await new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = (event) => reject(event.target.error);
    });

    return result || [];
  } catch (error) {
    console.error("Error fetching favorite movies:", error);
    return [];
  } finally {
    if (db) db.close();
  }
};

const clearFavoriteMovies = async () => {
  let db;
  try {
    db = await initFavoriteDB();
    const transaction = db.transaction([FAVORITE_STORE_NAME], "readwrite");
    const store = transaction.objectStore(FAVORITE_STORE_NAME);
    const request = store.clear();

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve();
      request.onerror = (event) => reject(event.target.error);
    });
  } catch (error) {
    console.error("Error clearing favorite movies:", error);
    throw error;
  } finally {
    if (db) db.close();
  }
};

export const BookmarkIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="h-6 w-6 text-white"
    fill="none"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
    />
  </svg>
);

export const FavoriteMoviesDropdown = ({ movies, onClose, onClear }) => {
  return (
    <div
      className="custom-scrollbar absolute right-0 top-full z-[51] max-h-[40vh] w-80 overflow-hidden overflow-y-auto rounded-md bg-[#23252b] shadow-2xl backdrop-blur-xl"
      role="menu"
    >
      <div className="flex items-center justify-between border-b border-white/10 p-3">
        <h4 className="text-sm font-medium text-white">Phim Yêu Thích</h4>

        {movies.length > 0 && (
          <button
            onClick={onClear}
            className="text-xs text-red-400 transition-colors hover:text-red-500"
          >
            Xóa tất cả
          </button>
        )}
      </div>

      <div className="p-2">
        {movies.length > 0 ? (
          movies.map((movie) => (
            <a
              key={movie.slug}
              href={`/phim/${movie.slug}`}
              onClick={onClose}
              className="flex cursor-pointer items-center space-x-3 rounded-md px-3 py-3 transition-all duration-200 hover:bg-white/10 focus:bg-white/10 focus:outline-none"
              role="menuitem"
            >
              <img
                src={movie.poster_url}
                alt={movie.ten_phim}
                className="h-14 w-10 flex-shrink-0 rounded-[4px] object-fill"
                aria-hidden="true"
              />

              <div className="min-w-0 flex-1">
                <h4 className="truncate text-[13px] font-medium text-white hover:text-sky-300">
                  {movie.ten_phim}
                </h4>

                <p className="truncate text-xs text-white/60">
                  {movie.ten_khac}
                </p>
              </div>
            </a>
          ))
        ) : (
          <div
            className="p-4 text-center text-xs text-white/60"
            role="status"
            aria-live="polite"
          >
            Chưa có phim yêu thích.
          </div>
        )}
      </div>
    </div>
  );
};

export { getAllFavoriteMovies, clearFavoriteMovies };
