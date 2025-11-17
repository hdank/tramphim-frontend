// src/utils/getCategoryData.js
export const BASE_URL = import.meta.env.PUBLIC_API_BASE_URL;

const fetchJson = async (url) => {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Lỗi khi fetch API: ${url}`);
    return await res.json();
  } catch (err) {
    console.error(`Fetch error: ${url}`, err);
    return null;
  }
};

export async function getCategoryData(slug, initialPage = 1, limit = 30) {
  let API_URL;
  let currentCategoryName;
  let metaKeywords;

  const keywordsMap = {
    "phim-le":
      "phim lẻ, phim lẻ mới, phim lẻ vietsub, xem phim lẻ, phim le online",
    "phim-bo":
      "phim bộ, phim bộ mới, phim bộ vietsub, xem phim bộ, phim bo online",
    "hoat-hinh": "phim hoạt hình, hoạt hình vietsub, phim anime, phim cartoon",
    "phim-chieu-rap": "phim chiếu rạp, phim rạp, phim ra rạp, phim hay",
  };

  if (slug === "phim-chieu-rap") {
    API_URL = `${BASE_URL}/api/filter/?page=${initialPage}&limit=${limit}&sort=ngay-tao&chieu_rap=true`;
  } else {
    API_URL = `${BASE_URL}/api/filter/?page=${initialPage}&limit=${limit}&loai_phim=${slug}&sort=ngay-tao`;
  }

  const categoryData = await fetchJson(API_URL);
  const topResponse = await fetchJson(
    `${BASE_URL}/api/filter/?page=1&limit=10&sort=luot-xem`,
  );
  const topmovies = topResponse?.data || [];

  if (!categoryData || !topmovies) {
    return { error: "Không thể lấy dữ liệu. Vui lòng thử lại sau." };
  }

  if (slug === "phim-chieu-rap") {
    currentCategoryName = "Phim Chiếu Rạp";
    metaKeywords = keywordsMap["phim-chieu-rap"];
  } else {
    currentCategoryName = categoryData.filters?.loai_phim || slug;
    metaKeywords = keywordsMap[slug] || "phim online, phim vietsub, phim HD";
  }

  return {
    categoryData,
    topmovies,
    currentCategoryName,
    metaKeywords,
  };
}
