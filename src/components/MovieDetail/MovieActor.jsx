import React from "react";

// SVG component for a person icon
const Actor = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="h-full w-full p-2 text-gray-600"
  >
    <path
      fill="currentColor"
      d="M4 22a8 8 0 1 1 16 0zm8-9c-3.315 0-6-2.685-6-6s2.685-6 6-6s6 2.685 6 6s-2.685 6-6 6"
    />
  </svg>
);

const MovieActors = ({ actors }) => {
  if (!actors || actors.length === 0) {
    return (
      <div className="flex min-h-[200px] w-full flex-col items-center justify-center rounded-lg bg-[#00000033] text-gray-500">
        <Actor className="h-20 w-20" />
        <span>Không có diễn viên.</span>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h3 className="mb-4 text-lg font-semibold text-white lg:text-2xl">
        Diễn viên
      </h3>
      <ul className="grid grid-cols-2 gap-4 lg:grid-cols-6">
        {actors.map((actor) => (
          <li key={actor.id} className="flex flex-col items-center text-center">
            <a
              href={`/dien-vien/${actor.slug}`}
              className="group relative flex w-full flex-col"
            >
              <div className="relative flex h-52 w-full flex-shrink-0 items-center justify-center overflow-hidden rounded-md bg-gray-800">
                {actor.anh_url ? (
                  <img
                    src={actor.anh_url}
                    alt={actor.ten}
                    className="h-auto w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-auto w-full items-center justify-center">
                    <Actor />
                  </div>
                )}
              </div>

              <div
                className="absolute bottom-0 left-0 h-[70%] w-full rounded-b-md"
                style={{
                  background:
                    "linear-gradient(to top, rgba(30, 30, 30, 0.8) 5%, transparent 100%)",
                }}
                aria-hidden="true"
              />

              <p className="absolute bottom-0 left-0 right-0 z-20 px-2 py-1 text-xs lg:text-sm font-medium text-white transition-colors duration-200 group-hover:text-blue-300">
                {actor.ten}
              </p>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MovieActors;
