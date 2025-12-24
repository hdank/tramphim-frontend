function rutGonTinhTrangPhim(tinhTrang) {
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

function rutGonTinhTrangNgonNgu(str) {
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

function cleanhtml(name) {
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

function capitalizeWords(str) {
  if (!str) return "";
  return str
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

const getDisplayEpisodeNumber = (tapSlug) => {
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

export { rutGonTinhTrangPhim as a, capitalizeWords as b, cleanhtml as c, getDisplayEpisodeNumber as g, rutGonTinhTrangNgonNgu as r };
