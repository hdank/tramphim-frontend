export const BASE_URL = import.meta.env.PUBLIC_API_BASE_URL;

export async function getAllTheLoaiPaths() {
  const apiUrl = `${BASE_URL}/api/theloai`;
  try {
    const res = await fetch(apiUrl);
    const data = await res.json();

    if (!Array.isArray(data)) return [];

    return data.map((item) => ({
      params: { slug: item.slug },
    }));
  } catch (err) {
    console.error("Lỗi khi gọi API /api/theloai:", err);
    return [];
  }
}
