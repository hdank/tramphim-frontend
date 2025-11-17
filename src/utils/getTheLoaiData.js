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
const buildInitialApiUrl = (page, limit, theLoaiSlug, searchParams) => {
  let url = `${BASE_URL}/api/filter/?page=${page}&limit=${limit}`;
  if (theLoaiSlug) url += `&the_loai=${encodeURIComponent(theLoaiSlug)}`;

  for (const [key, value] of searchParams.entries()) {
    if (!["page", "limit", "the_loai"].includes(key)) {
      url += `&${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    }
  }
  if (!searchParams.has("sort")) {
    url += `&sort=ngay-tao`;
  }

  return url;
};
export async function fetchTheLoaiData(theLoaiSlug, page, limit, searchParams) {
  const API_URL = buildInitialApiUrl(page, limit, theLoaiSlug, searchParams);
  const TOP_URL = `${BASE_URL}/api/filter/?page=1&limit=10&sort=luot-xem`;

  const categoryData = await fetchJson(API_URL);
  const topResponse = await fetchJson(TOP_URL);
  const topmovies = topResponse?.data || [];

  const currentCategoryName = categoryData?.filters?.the_loai || theLoaiSlug;

  if (!categoryData || !topmovies) {
    return { error: "Không thể lấy dữ liệu. Vui lòng thử lại sau." };
  }

  return { categoryData, topmovies, currentCategoryName, BASE_URL };
}
