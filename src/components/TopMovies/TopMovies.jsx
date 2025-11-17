import React, { useEffect, useState } from "react";

const TopMovies = ({ movies = [] }) => {
  if (!movies || movies.length === 0) return null;

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
  }, [movies]);

  const rankColor = (i) =>
    i < 3 ? "border-b-2 border-sky-400" : "text-gray-400";

  return (
    <div className="">
      <h2 className="mb-4 text-lg font-semibold lg:text-xl">Bảng Xếp Hạng</h2>

      <div
        className="grid lg:grid-cols-2 xl:grid-cols-1"
        onMouseLeave={() => setActiveIndex(0)}
      >
        {movies.slice(0, 10).map((movie, i) => {
          const { id, slug, ten_phim, poster_url } = movie;
          const key = id || slug;
          const isActive = i === activeIndex;

          return (
            <div
              key={key}
              className={`group flex flex-col justify-center gap-0 rounded-md py-2 transition-colors duration-300 2xl:gap-2 ${
                isActive ? "" : ""
              } cursor-pointer`}
              onMouseEnter={() => setActiveIndex(i)}
            >
              <a
                href={`/phim/${slug}`}
                title={ten_phim}
                className="flex items-center gap-2"
              >
                <span
                  className={`w-6 text-center font-quicksand text-lg font-extrabold ${rankColor(
                    i,
                  )}`}
                >
                  {i + 1}
                </span>

                <p className="line-clamp-2 flex-1 text-sm font-normal text-white transition-colors group-hover:text-sky-300">
                  {ten_phim}
                </p>
              </a>

              <div
                className={`max-h-0 overflow-hidden px-4 opacity-0 ${
                  isActive ? "2xl:max-h-[200px] 2xl:opacity-100" : ""
                }`}
                aria-hidden={!isActive}
              >
                <div className="md:w-30 aspect-[2/3] overflow-hidden rounded-md sm:w-20">
                  <img
                    src={poster_url}
                    alt={ten_phim}
                    className="h-full w-full object-cover transition-opacity duration-700"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TopMovies;
