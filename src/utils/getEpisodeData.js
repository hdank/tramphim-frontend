export const BASE_URL = import.meta.env.PUBLIC_API_BASE_URL;
export const DOMAIN_URL = import.meta.env.PUBLIC_DOMAIN;

export const SKIP_AD_STATUS_API_URL = `${BASE_URL}/api/skip_ad/status/skip-ad/`;
export const SKIP_AD_API_URL = `${BASE_URL}/api/skip_ad/link/`;


export const fetchJson = async (url) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Lỗi khi fetch API: ${url} (status: ${res.status})`);
  }
  return await res.json();
};

export const checkSkipAdStatus = async () => {
  try {
    const data = await fetchJson(SKIP_AD_STATUS_API_URL);
    return data?.enabled === true;
  } catch (error) {
    console.error("Lỗi khi kiểm tra trạng thái bộ lọc quảng cáo:", error);
    return false;
  }
};



const fetchEpisodeData = async (slug, so_tap, ngon_ngu, server) => {
  const data = await fetchJson(
    `${BASE_URL}/api/phim/${slug}/tap/${so_tap}/${ngon_ngu}?server=${server}`,
  );
  if (data?.link_video) {
    return {
      link_video: data.link_video,
      tap_phim: data.tap_phim,
      server,
    };
  }
  throw new Error(`Không có link video cho server ${server}`);
};


export const fetchVideoSource = async (
  slug,
  so_tap,
  ngon_ngu,
  preferredServer,
) => {
  const allServers = ["sv2", "sv1", "sv3"];
  const serverStatus = {};
  let finalServer = preferredServer;
  let videoData = null;

  const fetchPromises = allServers.map((server) =>
    fetchEpisodeData(slug, so_tap, ngon_ngu, server)
      .then((data) => {
        serverStatus[server] = true;
        return { server, data };
      })
      .catch(() => {
        serverStatus[server] = false;
        return { server, data: null };
      }),
  );

  const allResults = await Promise.all(fetchPromises);

  const userPreferredServer = preferredServer;
  if (userPreferredServer && serverStatus[userPreferredServer]) {
    const result = allResults.find((res) => res.server === userPreferredServer);
    if (result && result.data) {
      videoData = result.data;
      finalServer = userPreferredServer;
    }
  }


  if (!videoData) {
    for (const server of allServers) {
      const result = allResults.find((res) => res.server === server);
      if (result && result.data) {
        videoData = result.data;
        finalServer = server;
        break
      }
    }
  }

  return {
    videoData,
    finalServer,
    hasSv1Video: serverStatus.sv1 || false,
    hasSv2Video: serverStatus.sv2 || false,
    hasSv3Video: serverStatus.sv3 || false,
  };
};


export const fetchMovieBySlug = async (slug) => {
  try {
    return await fetchJson(`${BASE_URL}/api/phim/${slug}`);
  } catch (error) {
    console.error(`Lỗi khi lấy dữ liệu phim: ${error}`);
    return null;
  }
};

export const fetchEpisodeLists = async (slug, server = null) => {
  const serverParam = server ? `?server=${server}` : "";

  const [vietsubData, thuyetminhData, longtiengData] = await Promise.all([
    fetchJson(`${BASE_URL}/api/phim/${slug}/vietsub${serverParam}`).catch(() => []),
    fetchJson(`${BASE_URL}/api/phim/${slug}/thuyetminh${serverParam}`).catch(() => []),
    fetchJson(`${BASE_URL}/api/phim/${slug}/longtieng${serverParam}`).catch(() => []),
  ]);

  // We deduplicate by episode slug/number to avoid the "mess" of duplicate buttons.
  const deduplicate = (list) => {
    if (!Array.isArray(list)) return [];
    const seen = new Set();
    return list.filter((ep) => {
      const rawKey = ep.tap_phim?.slug || ep.slug || ep.so_tap || ep.tap_phim?.so_tap;
      if (!rawKey) return false;

      // Normalize key: remove 'tap-', then pad numbers to 2 digits
      let key = String(rawKey).toLowerCase().replace(/^tap-/, "");
      if (/^\d+$/.test(key)) key = key.padStart(2, "0");

      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  };

  return {
    vietsubData: server ? vietsubData : deduplicate(vietsubData),
    thuyetminhData: server ? thuyetminhData : deduplicate(thuyetminhData),
    longtiengData: server ? longtiengData : deduplicate(longtiengData),
  };
};


export const fetchSidebarData = async () => {
  const [topData, deXuatData] = await Promise.all([
    fetchJson(`${BASE_URL}/api/filter/?page=1&limit=10&sort=luot-xem`).catch(
      () => ({ data: [] }),
    ),
    fetchJson(`${BASE_URL}/api/filter/?page=1&limit=10&sort=ngay-tao`).catch(
      () => ({ data: [] }),
    ),
  ]);

  return { topData, deXuatData };
};


export const fetchActorFilmography = async (actorSlug) => {
  try {
    return await fetchJson(`${BASE_URL}/api/phim/${actorSlug}/dien-vien/`);
  } catch (error) {
    console.error(`Lỗi khi lấy dữ liệu phim của diễn viên: ${error}`);
    return null;
  }
};

export const fetchAllMovieData = async (slug, so_tap, ngon_ngu, server = null) => {
  const [movie, episodeLists, sidebarData, actors] = await Promise.all([
    fetchMovieBySlug(slug),
    fetchEpisodeLists(slug, server),
    fetchSidebarData(),
    fetchActorFilmography(slug),
  ]);

  return {
    movie,
    actors,
    vietsubData: episodeLists.vietsubData,
    thuyetminhData: episodeLists.thuyetminhData,
    longtiengData: episodeLists.longtiengData,
    ...sidebarData,
  };
};