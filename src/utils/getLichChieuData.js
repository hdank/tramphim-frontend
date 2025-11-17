const BASE_URL = import.meta.env.PUBLIC_API_BASE_URL;

export async function getLichChieuPageData() {
  const endpoints = [
    {
      key: "movies_thu2",
      url: `${BASE_URL}/api/phim/lich-chieu/2`,
    },
    {
      key: "movies_thu3",
      url: `${BASE_URL}/api/phim/lich-chieu/3`,
    },
    {
      key: "movies_thu4",
      url: `${BASE_URL}/api/phim/lich-chieu/4`,
    },
    {
      key: "movies_thu5",
      url: `${BASE_URL}/api/phim/lich-chieu/5`,
    },
    {
      key: "movies_thu6",
      url: `${BASE_URL}/api/phim/lich-chieu/6`,
    },
    {
      key: "movies_thu7",
      url: `${BASE_URL}/api/phim/lich-chieu/7`,
    },
    {
      key: "movies_cn",
      url: `${BASE_URL}/api/phim/lich-chieu/8`,
    },
  ];

  try {
    const results = await Promise.all(
      endpoints.map(({ url }) =>
        fetch(url)
          .then((res) => res.json())
          .catch(() => []),
      ),
    );

    return results.reduce((acc, res, i) => {
      const key = endpoints[i].key;
      acc[key] = res;
      return acc;
    }, {});
  } catch (err) {
    console.error("Error fetching showtime data:", err);
    return Object.fromEntries(endpoints.map((e) => [e.key, []]));
  }
}
