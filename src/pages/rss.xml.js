import rss from "@astrojs/rss";

const BASE_URL = import.meta.env.PUBLIC_API_BASE_URL;
const SITE_URL = import.meta.env.PUBLIC_DOMAIN;

async function fetchMovies() {
  const allMovies = [];
  const limit = 64;
  const maxPages = 2;

  for (let page = 1; page <= maxPages; page++) {
    try {
      const res = await fetch(
        `${BASE_URL}/api/filter/?page=${page}&limit=${limit}&sort=moi-cap-nhat`,
      );

      if (!res.ok) break;
      const contentType = res.headers.get("content-type");
      if (!contentType?.includes("application/json")) break;
      const data = await res.json();
      const movies = data?.data?.items || data.data || data.movies || [];
      if (!Array.isArray(movies) || movies.length === 0) break;

      allMovies.push(...movies);
    } catch (err) {
      console.error("Lỗi fetch:", err.message);
      break;
    }
  }

  return allMovies;
}

export async function GET(context) {
  const movies = await fetchMovies();

  return rss({
    title: "Hoạt Hình 3D Vietsub HD mới nhất 2025 - Cập nhật liên tục",
    description:
      "Tổng hợp danh sách phim hoạt hình 3D Vietsub HD mới nhất, được cập nhật liên tục trong năm 2025.",
    site: SITE_URL,
    items: movies.map((movie) => ({
      title: `${movie.ten_phim || movie.title || "Hoạt hình không tên"} - Vietsub HD`,
      description:
        movie.mo_ta ||
        movie.description ||
        "Xem phim hoạt hình 3D Vietsub HD mới nhất với chất lượng cao.",
      pubDate: new Date(
        movie.ngay_tao || movie.created_at || movie.updated_at || Date.now(),
      ),
      link: `${SITE_URL}/phim/${movie.slug}/`,
    })),
    customData: `<language>vi-vn</language>`,
  });
}
