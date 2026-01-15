// src/utils/getMovieData.js

export const BASE_URL = import.meta.env.PUBLIC_API_BASE_URL;

export async function getMoviePageData(slug) {
  const urlVietsub = `${BASE_URL}/api/phim/${slug}/vietsub/?server=sv1`;
  const urlThuyetMinh = `${BASE_URL}/api/phim/${slug}/thuyetminh/?server=sv1`;
  const urlLongTieng = `${BASE_URL}/api/phim/${slug}/longtieng/?server=sv1`; // Đã có
  const urlTop = `${BASE_URL}/api/filter/?page=1&limit=10&sort=luot-xem`;
  const urlDeXuat = `${BASE_URL}/api/phim/?page=1&limit=15`;
  const urlActors = `${BASE_URL}/api/phim/${slug}/dien-vien`;
  const urlImages = `${BASE_URL}/api/phim/${slug}/images`;
  const urlThongBao = `${BASE_URL}/api/phim/${slug}/thong-bao`;


  try {
    const [
      vietsub,
      thuyetminh,
      longtieng,
      top,
      deXuat,
      actors,
      images, // Biến này chứa kết quả từ API /images
      thongbao,
    ] = await Promise.all([
      fetch(urlVietsub).then((r) => r.json()),
      fetch(urlThuyetMinh).then((r) => r.json()),
      fetch(urlLongTieng).then((r) => r.json()),
      fetch(urlTop).then((r) => r.json()),
      fetch(urlDeXuat).then((r) => r.json()).catch(() => []),
      fetch(urlActors).then((r) => r.json()),
      fetch(urlImages).then((r) => r.json()), // Lệnh gọi API /images
      fetch(urlThongBao).then((r) => r.json()),
    ]);

    let firstEpisode = null;
    if (vietsub && vietsub.length > 0) {
      firstEpisode = vietsub[0];
    } else if (thuyetminh && thuyetminh.length > 0) {
      firstEpisode = thuyetminh[0];
    } else if (longtieng && longtieng.length > 0) {
      firstEpisode = longtieng[0];
    } else {
      console.log("❌ Không tìm thấy tập phim nào.");
    }

    return {
      vietsub,
      thuyetminh,
      longtieng,
      topmovies: top?.data || [],
      dexuatmovies: deXuat,
      actors: actors || [],
      images: images || [],
      thongbao: thongbao || [],
      firstEpisode,
    };
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu trang phim:", error);
    return {
      vietsub: [],
      thuyetminh: [],
      longtieng: [],
      topmovies: [],
      dexuatmovies: [],
      actors: [],
      images: [],
      thongbao: [],
      firstEpisode: null,
    };
  }
}