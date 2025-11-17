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
    marvel: "phim marvel, chủ đề marvel, phim siêu anh hùng",
    dc: "phim dc, chủ đề dc, phim siêu anh hùng",

    default: "phim online, phim vietsub, phim HD",
  };

  API_URL = `${BASE_URL}/api/filter/?page=${initialPage}&limit=${limit}&chu_de=${slug}&sort=ngay-tao`;
  console.log("Fetching category data (Topic) from URL:", API_URL);

  const categoryData = await fetchJson(API_URL);

  const topResponse = await fetchJson(
    `${BASE_URL}/api/filter/?page=1&limit=10&sort=luot-xem`,
  );
  const topmovies = topResponse?.data || [];

  if (!categoryData || !topmovies) {
    return { error: "Không thể lấy dữ liệu. Vui lòng thử lại sau." };
  }

  currentCategoryName = categoryData.filters?.chủ_đề || slug;

  metaKeywords = keywordsMap[slug] || keywordsMap["default"];

  return {
    categoryData,
    topmovies,
    currentCategoryName,
    metaKeywords,
  };
}
