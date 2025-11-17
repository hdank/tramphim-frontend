import React from "react";

// Video Progress IndexedDB Constants
const PROGRESS_DB_NAME = "VideoProgressDB";
const PROGRESS_DB_VERSION = 1;
const PROGRESS_STORE_NAME = "videoProgress";
const initProgressDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(PROGRESS_DB_NAME, PROGRESS_DB_VERSION);

    request.onerror = (event) => reject(event.target.error);
    request.onsuccess = (event) => resolve(event.target.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(PROGRESS_STORE_NAME)) {
        const store = db.createObjectStore(PROGRESS_STORE_NAME, {
          keyPath: "id",
        });
        store.createIndex("lastUpdated", "lastUpdated", { unique: false });
      }
    };
  });
};

const getAllProgressFromDB = async () => {
  let db;
  try {
    db = await initProgressDB();
    const transaction = db.transaction([PROGRESS_STORE_NAME], "readonly");
    const store = transaction.objectStore(PROGRESS_STORE_NAME);

    const result = await new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = (event) => reject(event.target.error);
    });

    return result || [];
  } catch (error) {
    console.error("Error getting all progress from IndexedDB:", error);
    return [];
  } finally {
    if (db) db.close();
  }
};

const getProgressPercentage = (progress, duration) => {
  if (!duration || duration <= 0) return 0;
  return Math.min(Math.max((progress / duration) * 100, 0), 100);
};

export const HistoryIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 48 48"
    className="h-6 w-6 text-white"
  >
    <g fill="none" stroke="#fff" strokeLinejoin="round" strokeWidth="4">
      <path d="M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4S4 12.954 4 24s8.954 20 20 20Z" />
      <path strokeLinecap="round" d="M24.008 12v12.01l8.479 8.48" />
    </g>
  </svg>
);

export const WatchedMoviesDropdown = ({ movies, onClose }) => {
  return (
    <div
      className="custom-scrollbar absolute -right-2 top-full max-h-[40vh] w-80 overflow-hidden overflow-y-auto rounded-md bg-[#23252b] shadow-2xl backdrop-blur-xl"
      role="menu"
      aria-label="watched-movies-button"
    >
      <div className="flex items-center justify-between border-b border-white/10 p-3">
        <h4 className="text-sm font-medium text-white">Lịch sử xem</h4>
      </div>
      <div className="p-2">
        {movies.length > 0 ? (
          movies.map((movie) => {
            const progressPercentage = getProgressPercentage(
              movie.progress,
              movie.duration,
            );
            const movieLanguage = movie.ngonngu || "vi";

            return (
              <a
                key={movie.id}
                href={`/xem-phim/${movie.slug}/tap-${movie.sotap}/${movieLanguage}`}
                onClick={onClose}
                className="flex cursor-pointer items-center space-x-3 rounded-md px-3 py-3 transition-all duration-200 hover:bg-white/10 focus:bg-white/10 focus:outline-none"
                role="option"
                tabIndex={0}
                aria-selected={false}
                aria-label={`Tiếp tục xem phim ${movie.ten_phim} tập ${movie.sotap}`}
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={movie.banner}
                    alt={movie.ten_phim || "Ảnh bìa phim"}
                    className="h-14 w-24 rounded-[4px] object-fill"
                    aria-hidden="true"
                  />
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-600/70">
                    <div
                      className="h-full bg-sky-300"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="truncate text-[13px] font-medium text-white hover:text-sky-300">
                    {movie.ten_phim}
                  </h4>
                  <p className="truncate text-xs text-white/60">
                    Đang xem tập {movie.sotap}
                  </p>
                </div>
              </a>
            );
          })
        ) : (
          <div
            className="p-4 text-center text-white/60"
            role="status"
            aria-live="polite"
          >
            Không có phim nào đang xem.
          </div>
        )}
      </div>
    </div>
  );
};

export { getAllProgressFromDB };
