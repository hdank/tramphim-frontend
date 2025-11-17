

const PhanLienQuan = ({ movie }) => {
  if (!movie || movie.length === 0) {
    return null; // Không hiển thị gì nếu không có dữ liệu
  }

  return (
    <div className="py-4">
      <div className="grid grid-cols-3 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {movie.map((phan) => (
          <a
            key={phan.id}
            href={`/phim/${phan.phim.slug}`}
            className="group block overflow-hidden rounded-lg"
          >
            <div className="relative pb-[150%]">
              <img
                src={phan.phim.poster_url}
                alt={phan.phim.ten_phim}
                className="absolute inset-0 h-full w-full rounded-lg object-cover"
              />
              <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-black via-transparent to-transparent opacity-70 transition-opacity duration-200 group-hover:opacity-100"></div>
              <span className="absolute bottom-0 rounded bg-black bg-opacity-50 p-1 text-center text-xs font-medium text-white">
                {phan.phim.ten_phim}
              </span>

              <span className="absolute left-2 top-2 rounded-md bg-[linear-gradient(90deg,#e5330b_0%,#ff670b_51%,#d9a666_100%)] px-2 py-1 text-xs font-semibold text-white">
                {" "}
                {phan.ten_phan}
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default PhanLienQuan;
