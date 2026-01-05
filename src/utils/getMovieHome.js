const BASE_URL = import.meta.env.PUBLIC_API_BASE_URL;

export async function getHomePageData() {
  const endpoints = [
    { key: "themes", url: `${BASE_URL}/api/phim/chu-de/`, isObject: true },
    { key: "moviehots", url: `${BASE_URL}/api/filter/?page=1&limit=18&sort=luot-xem` },
    { key: "moviechieuraps", url: `${BASE_URL}/api/filter/?page=1&limit=24&loai_phim=phim-le&chieu_rap=true` },
    { key: "movieheros", url: `${BASE_URL}/api/filter/?page=1&limit=18&sort=moi-cap-nhat` },
    { key: "movieupdates", url: `${BASE_URL}/api/filter/?page=1&limit=24&loai_phim=phim-bo&sort=moi-cap-nhat` },
    { key: "moviephimbos", url: `${BASE_URL}/api/filter/?page=1&limit=18&loai_phim=phim-bo&sort=ngay-tao` },
    { key: "moviephimles", url: `${BASE_URL}/api/filter/?page=1&limit=18&loai_phim=phim-le&sort=ngay-tao` },
    { key: "movieanimes", url: `${BASE_URL}/api/filter/?page=1&limit=12&loai_phim=hoat-hinh&quoc_gia=nhat-ban&nam_phat_hanh=2025&sort=ngay-tao` },
    { key: "movie2026", url: `${BASE_URL}/api/filter/?page=1&limit=12&nam_phat_hanh=2026&sort=ngay-tao` },
    { key: "latestAnimes", url: `${BASE_URL}/api/filter/?page=1&limit=18&loai_phim=hoat-hinh&quoc_gia=nhat-ban&sort=ngay-tao` },
    { key: "chineseAnime", url: `${BASE_URL}/api/filter/?page=1&limit=12&loai_phim=hoat-hinh&quoc_gia=trung-quoc&sort=ngay-tao` },
    { key: "dramaMovies", url: `${BASE_URL}/api/filter/?page=1&limit=12&the_loai=chinh-kich&the_loai=tam-ly&the_loai=tinh-cam&sort=ngay-tao` }
  ];

  try {
    const results = await Promise.all(
      endpoints.map(async (e) => {
        try {
          const res = await fetch(e.url);
          if (!res.ok) throw new Error();
          return res.json();
        } catch {
          return e.isObject ? {} : { data: [] };
        }
      })
    );

    return results.reduce((acc, res, i) => {
      const { key, isObject } = endpoints[i];
      acc[key] = isObject ? res : res.data || [];
      return acc;
    }, {});

  } catch {
    return Object.fromEntries(
      endpoints.map((e) => [e.key, e.isObject ? {} : []])
    );
  }
}
