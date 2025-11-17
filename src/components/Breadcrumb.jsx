import React from "react";

const Breadcrumb = ({ movie }) => {
  if (!movie) return null;

  const homeUrl = "/";
  const movieTitle = movie.ten_phim;

  return (
    <nav
      className="mx-auto flex max-w-screen-xl "
      aria-label="Breadcrumb"
    >
      <ol className="flex flex-wrap items-center justify-start gap-x-1 gap-y-1 text-sm lg:text-base ">
        <li className="inline-flex min-w-0 items-start">
          <a
            href={homeUrl}
            className="whitespace-normal break-words leading-snug text-white hover:text-sky-300"
          >
            Trang Chủ
          </a>
        </li>

        <li aria-current="page" className="min-w-0">
          <div className="flex min-w-0 items-start">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              className="me-1 mt-[2px] shrink-0 lg:mt-[4px]"
              aria-hidden="true"
            >
              <path
                fill="currentColor"
                fillRule="evenodd"
                d="m10.207 8l-3.854 3.854l-.707-.707L8.793 8L5.646 4.854l.707-.708z"
                clipRule="evenodd"
              />
            </svg>

            <span className="min-w-0 max-w-full whitespace-normal break-words font-medium leading-snug text-gray-400">
              {movieTitle}
            </span>
          </div>
        </li>
      </ol>
    </nav>
  );
};

export default Breadcrumb;
