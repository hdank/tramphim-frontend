export function rutGonTinhTrangPhim(tinhTrang) {
  if (!tinhTrang) return "";

  const txt = tinhTrang.toLowerCase();
  const tapFullMatch = tinhTrang.match(/\(\d+\/\d+\)/);
  const tapNMatch = tinhTrang.match(/tập\s*\d+(\/\d+)?/i);

  if (txt.includes("hoàn tất") || txt.includes("full")) {
    return tapFullMatch ? `Trọn Bộ ${tapFullMatch[0]}` : "Trọn Bộ";
  }

  if (tapNMatch) {
    return `Cập Nhật ${tapNMatch[0]}`;
  }

  if (txt.includes("update") || txt.includes("cập nhật")) {
    return "Cập Nhật";
  }

  return tinhTrang;
}

export function rutGonTinhTrangNgonNgu(str) {
  if (!str) return "Chưa rõ";

  const lower = str.toLowerCase();
  const hasLT = lower.includes("lồng tiếng");
  const hasTM = lower.includes("thuyết minh");
  const hasVS = lower.includes("vietsub");

  // Trường hợp kết hợp nhiều loại
  if (hasVS && hasTM && hasLT) return "VS-TM-LT"; // VS + TM + LT
  if (hasVS && hasTM) return "VS-TM";             // VS + TM
  if (hasVS && hasLT) return "VS-LT";             // VS + LT
  if (hasTM && hasLT) return "TM-LT";             // TM + LT

  // Trường hợp đơn lẻ
  if (hasVS) return "Vietsub";
  if (hasTM) return "Thuyết Minh";
  if (hasLT) return "LT";

  return "Chưa rõ";
}

export function cleanhtml(name) {
  if (!name) {
    return "";
  }

  const htmlEntities = {
    "&#039;": "'",
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
  };

  let cleanedName = name.replace(
    /(&#039;|&amp;|&lt;|&gt;|&quot;)/g,
    (match) => {
      return htmlEntities[match];
    },
  );

  return cleanedName;
}

export function capitalizeWords(str) {
  if (!str) return "";
  return str
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function convertImage(url, width) {
  if (!url) return "";
  return url; // giữ nguyên như ban đầu
}

export const getDisplayEpisodeNumber = (tapSlug) => {
  if (!tapSlug) {
    return "";
  }

  const lowerSlug = tapSlug.toLowerCase();

  if (
    lowerSlug === "full" ||
    lowerSlug === "all" ||
    lowerSlug === "nguyen-phim"
  ) {
    return "Full";
  }

  const match =
    lowerSlug.match(/(?:tap|episode)[\-]?(\d+)/i) || lowerSlug.match(/^(\d+)$/);

  if (match && match[1]) {
    return match[1];
  }

  return tapSlug;
};

// --- IndexedDB Constants ---
const DB_NAME = "FavoriteDB";
const DB_VERSION = 2;
const STORE_NAME = "FavoriteDB";

// --- IndexedDB Helper Functions ---
export const openDB = () => {
  if (typeof window === 'undefined') return Promise.reject("No window");
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "slug" });
      }
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      reject("Error opening database: " + event.target.errorCode);
    };
  });
};

export const addMovieToFavorites = async (movie) => {
  try {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    if (!movie || !movie.slug) {
      throw new Error("Movie object or slug is missing.");
    }

    const movieToAdd = {
      slug: movie.slug,
      ten_phim: movie.ten_phim,
      ban_quyen: movie.ban_quyen || false, // Ensure consistent object shape if needed
      poster_url: movie.poster_url || "",
      thumb_url: movie.thumb_url || "",
      banner_url: movie.banner_url || "",
      nam_phat_hanh: movie.nam_phat_hanh || "",
    };
    store.add(movieToAdd);
    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  } catch (error) {
    console.error("Error adding movie to favorites:", error);
    throw error;
  }
};

export const removeMovieFromFavorites = async (slug) => {
  try {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(slug);
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error("Error removing movie from favorites:", error);
    throw error;
  }
};

export const isMovieFavorite = async (slug) => {
  try {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(slug);

    return new Promise((resolve) => {
      request.onsuccess = () => resolve(!!request.result);
      request.onerror = () => resolve(false);
    });
  } catch (error) {
    console.error("Error checking favorite status:", error);
    return false;
  }
};
