import React, { useEffect, useState } from "react";

const TopMovies = ({ movies = [] }) => {
  if (!movies || movies.length === 0) return null;

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
  }, [movies]);

  const rankColor = (i) =>
    i < 3
      ? "bg-gradient-to-b from-[#ffd700] via-[#fff8dc] to-[#daa520] bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(218,165,32,0.4)]"
      : "text-gray-400";

  return (
    <div className="">
      <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold lg:text-xl"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none"><g clip-path="url(#clip0_137_1522)"><path fill-rule="evenodd" clip-rule="evenodd" d="M1.88063 16.9893C1.85433 14.5926 3.02764 11.8941 5.01236 10.0083C6.37475 8.71478 9.24978 6.77138 13.4408 7.83575L12.9199 8.87882C12.8072 9.09921 12.5893 9.25197 12.3376 9.28829L8.75391 9.81296C8.44337 9.84426 8.15161 9.98951 7.93247 10.2199C7.67577 10.4879 7.53929 10.8385 7.54805 11.2092C7.55682 11.5761 7.70708 11.9154 7.97004 12.1646L10.5758 14.6715C10.7536 14.838 10.835 15.0847 10.7937 15.3289L10.7499 15.5793C8.00009 14.1844 4.54279 15.2888 1.88063 16.9893ZM23.5748 12.1671C23.799 11.9555 23.9455 11.6675 23.988 11.3532C24.0356 10.9863 23.938 10.6244 23.7151 10.3351C23.4909 10.0459 23.1666 9.86054 22.8047 9.81421L19.2097 9.28829C18.958 9.25197 18.7401 9.09921 18.6299 8.88133L17.0221 5.66319L17.0208 5.66069C16.8869 5.39773 16.6777 5.19112 16.4198 5.06214C16.0867 4.88934 15.7085 4.85678 15.3517 4.96823C14.9935 5.07967 14.7018 5.32635 14.5277 5.66319L14.2986 6.12275C10.4356 5.00955 6.58762 5.92114 3.71885 8.64591C0.810006 11.4095 -0.591196 15.5255 0.233998 18.8876C0.310382 19.1982 0.539533 19.4473 0.841311 19.5513C0.941486 19.5863 1.04417 19.6026 1.14685 19.6026C1.35471 19.6026 1.56132 19.5325 1.72912 19.3998C3.68629 17.8521 7.69831 15.7096 10.3216 17.4977C10.3492 17.5165 10.3805 17.519 10.4093 17.5352L10.1776 18.8601C10.1275 19.1493 10.1776 19.4599 10.3216 19.7366C10.6797 20.4128 11.5225 20.672 12.2012 20.3189L15.4143 18.6547C15.6384 18.537 15.9101 18.5357 16.1343 18.6535L19.3562 20.3226C19.5703 20.4266 19.7919 20.4792 20.0098 20.4792C20.0812 20.4792 20.1513 20.4729 20.2202 20.4616C20.9778 20.3326 21.4949 19.6164 21.371 18.8601L20.7574 15.3289C20.7148 15.0835 20.795 14.838 20.9765 14.669L23.5748 12.1671Z" fill="currentColor"></path></g></svg>Bảng Xếp Hạng</h2>

      <div className="flex flex-col gap-2" onMouseLeave={() => setActiveIndex(0)}>
        {movies.slice(0, 10).map((movie, i) => {
          const { id, slug, ten_phim, poster_url } = movie;
          const key = id || slug;
          const isActive = i === activeIndex;

          return (
            <div
              key={key}
              className={`group flex items-center justify-start gap-3 rounded-md py-3 px-2 transition-colors duration-300 cursor-pointer ${isActive ? 'bg-[#111318]' : ''}`}
              onMouseEnter={() => setActiveIndex(i)}
            >
              <a
                href={`/phim/${slug}`}
                title={ten_phim}
                className="flex items-center gap-3 w-full"
              >
                <span
                  className={`w-10 text-center font-quicksand text-2xl font-black italic ${rankColor(i)}`}
                >
                  {i + 1}
                </span>

                <div className="flex-1">
                  <p className="line-clamp-2 text-sm font-medium text-white transition-colors group-hover:text-sky-300">
                    {ten_phim}
                  </p>
                </div>

                <div className={`hidden md:block w-14 overflow-hidden rounded-md ${isActive ? 'opacity-100' : 'opacity-40'}`}>
                  <img src={poster_url} alt={ten_phim} className="h-full w-full object-cover" />
                </div>
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TopMovies;
