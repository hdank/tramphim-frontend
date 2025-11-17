import React, { useState, useMemo, useEffect } from "react";
import eposideGif from "../../assets/eposide.gif";
import alarmGif from "../../assets/alarm.gif";

const setCookie = (name, value, days) => {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/; SameSite=Lax";
};

const SortIcon = ({ isAscending }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`h-4 w-4 transition-transform duration-200 ${isAscending ? "rotate-0" : "rotate-180"
      }`}
    width="256"
    height="256"
    viewBox="0 0 256 256"
  >
    <g fill="currentColor">
      <path d="M224 80v88l-24 24H48V64h160a16 16 0 0 1 16 16" opacity="0.2" />
      <path d="M128 128a8 8 0 0 1-8 8H48a8 8 0 0 1 0-16h72a8 8 0 0 1 8 8M48 72h136a8 8 0 0 0 0-16H48a8 8 0 0 0 0 16m56 112H48a8 8 0 0 0 0 16h56a8 8 0 0 0 0-16m125.66-21.66a8 8 0 0 0-11.32 0L192 188.69V112a8 8 0 0 0-16 0v76.69l-26.34-26.35a8 8 0 0 0-11.32 11.32l40 40a8 8 0 0 0 11.32 0l40-40a8 8 0 0 0 0-11.32" />
    </g>
  </svg>
);

const Episodes = ({
  vietsub = [],
  thuyetminh = [],
  longtieng = [],
  movieTitle = "",
  slug,
  currentEpisodeSlug = "",
  currentType = "",
  thongbao,
  initialSortAscending = true,
}) => {
  const hasVietsub = vietsub.length > 0;
  const hasThuyetminh = thuyetminh.length > 0;
  const hasLongtieng = longtieng.length > 0;
  const initialShowCount = 40;
  const [sortAscending, setSortAscending] = useState(initialSortAscending);

  // Gắn trạng thái sắp xếp chung cho từng loại để logic lọc/sắp xếp hoạt động
  const vietsubSortAscending = sortAscending;
  const thuyetminhSortAscending = sortAscending;
  const longtiengSortAscending = sortAscending;

  const [vietsubShowCount, setVietsubShowCount] = useState(initialShowCount);
  const [thuyetminhShowCount, setThuyetminhShowCount] =
    useState(initialShowCount);
  const [longtiengShowCount, setLongtiengShowCount] = useState(initialShowCount);
  const [vietsubSearchQuery, setVietsubSearchQuery] = useState("");
  const [thuyetminhSearchQuery, setThuyetminhSearchQuery] = useState("");
  const [longtiengSearchQuery, setLongtiengSearchQuery] = useState("");

  // Hàm xử lý chung để đảo ngược trạng thái sắp xếp và lưu vào cookie
  const toggleSortAscending = () => {
    setSortAscending((prev) => {
      const newSortState = !prev;
      setCookie("sortEpisode", newSortState ? "1" : "0", 365);
      return newSortState;
    });
  };

  if (!hasVietsub && !hasThuyetminh && !hasLongtieng) {
    return (
      <div className="z-20 p-2 text-center text-sm font-medium text-gray-400">
        Phim này hiện đang cập nhật. Vui lòng quay lại sau!
      </div>
    );
  }

  const sortedAndFilteredVietsub = useMemo(() => {
    let filtered = vietsub.filter((ep) =>
      (ep.tap_phim?.so_tap || ep.so_tap || "")
        .toString()
        .toLowerCase()
        .includes(vietsubSearchQuery.toLowerCase()),
    );
    if (!vietsubSortAscending) {
      return filtered.slice().reverse();
    }
    return filtered;
  }, [vietsub, vietsubSearchQuery, vietsubSortAscending]);

  const sortedAndFilteredThuyetminh = useMemo(() => {
    let filtered = thuyetminh.filter((ep) =>
      (ep.tap_phim?.so_tap || ep.so_tap || "")
        .toString()
        .toLowerCase()
        .includes(thuyetminhSearchQuery.toLowerCase()),
    );
    if (!thuyetminhSortAscending) {
      return filtered.slice().reverse();
    }
    return filtered;
  }, [thuyetminh, thuyetminhSearchQuery, thuyetminhSortAscending]);

  const sortedAndFilteredLongtieng = useMemo(() => {
    let filtered = longtieng.filter((ep) =>
      (ep.tap_phim?.so_tap || ep.so_tap || "")
        .toString()
        .toLowerCase()
        .includes(longtiengSearchQuery.toLowerCase()),
    );
    if (!longtiengSortAscending) {
      return filtered.slice().reverse();
    }
    return filtered;
  }, [longtieng, longtiengSearchQuery, longtiengSortAscending]);

  const getDisplayTypeName = (displayType) => {
    switch (displayType) {
      case "vietsub":
        return "Vietsub";
      case "thuyetminh":
        return "Thuyết Minh";
      case "longtieng":
        return "Lồng Tiếng";
      default:
        return "";
    }
  };

  const renderEpisodeButton = (ep, displayType) => {
    const tap_slug = ep.tap_phim?.slug || "1";
    const soTapRaw = ep.tap_phim?.so_tap || ep.so_tap || "1";
    const soTapDisplay = soTapRaw.toString();
    const href = `/xem-phim/${slug}/${tap_slug}/${displayType}`;

    const isCurrentEpisode =
      currentEpisodeSlug &&
      currentType &&
      tap_slug === currentEpisodeSlug &&
      displayType === currentType;

    const buttonClasses = `
     relative flex items-center justify-center rounded-[4px] p-2.5 text-center text-[13px] lg:text-sm font-medium transition-colors duration-200
     ${isCurrentEpisode
        ? "bg-[#252525] shadow-lg text-sky-300"
        : "bg-[#252525] text-gray-200 hover:text-sky-300"
      }
  `;

    return (
      <a
        key={ep.id}
        href={href}
        className={buttonClasses}
        title={`Tập ${soTapDisplay} - ${movieTitle} (${getDisplayTypeName(
          displayType,
        )})`}
      >
        <div className="flex flex-row items-center justify-center gap-2">
          {isCurrentEpisode && (
            <img
              src={eposideGif.src}
              alt="Playing"
              className="absolute bottom-0 left-1 h-4 w-4"
              style={{
                filter:
                  "invert(38%) sepia(96%) saturate(2073%) hue-rotate(179deg) brightness(94%) contrast(102%)",
              }}
            />
          )}
          <span>{`${soTapDisplay}`}</span>
        </div>
      </a>
    );
  };

  const renderShowMoreButton = (count, total, setFunction) => {
    const hiddenCount = total - count;
    if (hiddenCount <= 0) {
      return null;
    }
    return (
      <button
        onClick={() => setFunction(total)}
        className="rounded-[4px] bg-[#252525] p-2.5 text-center text-[13px] font-medium text-gray-200 transition-colors hover:text-sky-300 lg:text-sm"
      >
        Xem thêm
      </button>
    );
  };

  const renderCollapseButton = (count, initialCount, setFunction) => {
    if (count <= initialCount) {
      return null;
    }
    return (
      <button
        onClick={() => setFunction(initialCount)}
        className="rounded-[4px] bg-[#252525] p-2.5 text-center text-[13px] font-medium text-gray-200 transition-colors hover:text-sky-300 lg:text-sm"
      >
        Rút gọn
      </button>
    );
  };

  // Hàm render nút sắp xếp
  const renderSortButton = (currentSortAscending) => (
    <button
      onClick={toggleSortAscending}
      className="rounded bg-[#353535] p-1 text-white transition-colors duration-200 hover:text-sky-300"
      title={
        currentSortAscending
          ? "Sắp xếp Giảm dần (Mới nhất)"
          : "Sắp xếp Tăng dần (Cũ nhất)"
      }
    >
      <SortIcon isAscending={currentSortAscending} />
    </button>
  );

  return (
    <div className="z-20 space-y-4">
      {thongbao && (
        <div className="!my-8 flex w-full flex-row items-center gap-4 rounded-lg bg-gradient-to-r from-[#4158D0] to-[#C850C0] p-2 text-sm text-white">
          <div className="flex-shrink-0 rounded-full bg-[#0005]">
            <img src={alarmGif.src} alt="Thông Báo" className="h-8 w-8" />
          </div>
          <span
            className="text-base"
            dangerouslySetInnerHTML={{ __html: thongbao.noidung }}
          />
        </div>
      )}

      <div className=" flex flex-col gap-8">
        {/* Phần Vietsub */}
        {hasVietsub && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {" "}
                {/* Group tiêu đề và nút sắp xếp */}
                <h2 className="font-seogoe text-lg font-medium text-white lg:text-xl">
                  Vietsub
                </h2>
                {/* Nút đảo ngược Vietsub */}
                {renderSortButton(vietsubSortAscending)}
              </div>

              <input
                type="text"
                placeholder="Tìm tập..."
                value={vietsubSearchQuery}
                onChange={(e) => setVietsubSearchQuery(e.target.value)}
                className="w-28 rounded-[4px] border border-gray-600 bg-[#252525] p-1 px-2 text-xs text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-sky-300"
              />
            </div>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-6 lg:gap-4 xl:grid-cols-7">
              {sortedAndFilteredVietsub
                .slice(
                  0,
                  vietsubSearchQuery
                    ? sortedAndFilteredVietsub.length
                    : vietsubShowCount,
                )
                .map((ep) => renderEpisodeButton(ep, "vietsub"))}
              {vietsubSearchQuery === "" &&
                renderShowMoreButton(
                  vietsubShowCount,
                  sortedAndFilteredVietsub.length,
                  setVietsubShowCount,
                )}
              {vietsubSearchQuery === "" &&
                renderCollapseButton(
                  vietsubShowCount,
                  initialShowCount,
                  setVietsubShowCount,
                )}
            </div>
          </div>
        )}

        {/* Phần Thuyết Minh */}
        {hasThuyetminh && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {" "}
                {/* Group tiêu đề và nút sắp xếp */}
                <h2 className="font-seogoe text-lg font-medium text-white lg:text-xl">
                  Thuyết Minh
                </h2>
                {/* Nút đảo ngược Thuyết Minh */}
                {renderSortButton(thuyetminhSortAscending)}
              </div>

              <input
                type="text"
                placeholder="Tìm tập..."
                value={thuyetminhSearchQuery}
                onChange={(e) => setThuyetminhSearchQuery(e.target.value)}
                className="w-28 rounded-[4px] border border-gray-600 bg-[#252525] p-1 px-2 text-xs text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-sky-300"
              />
            </div>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-6 lg:gap-4 xl:grid-cols-7">
              {sortedAndFilteredThuyetminh
                .slice(
                  0,
                  thuyetminhSearchQuery
                    ? sortedAndFilteredThuyetminh.length
                    : thuyetminhShowCount,
                )
                .map((ep) => renderEpisodeButton(ep, "thuyetminh"))}
              {thuyetminhSearchQuery === "" &&
                renderShowMoreButton(
                  thuyetminhShowCount,
                  sortedAndFilteredThuyetminh.length,
                  setThuyetminhShowCount,
                )}
              {thuyetminhSearchQuery === "" &&
                renderCollapseButton(
                  thuyetminhShowCount,
                  initialShowCount,
                  setThuyetminhShowCount,
                )}
            </div>
          </div>
        )}

        {/* --- Phần Lồng Tiếng MỚI --- */}
        {hasLongtieng && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {" "}
                {/* Group tiêu đề và nút sắp xếp */}
                <h2 className="font-seogoe text-lg font-medium text-white lg:text-xl">
                  Lồng Tiếng
                </h2>
                {/* Nút đảo ngược Lồng Tiếng */}
                {renderSortButton(longtiengSortAscending)}
              </div>

              <input
                type="text"
                placeholder="Tìm tập..."
                value={longtiengSearchQuery}
                onChange={(e) => setLongtiengSearchQuery(e.target.value)}
                className="w-28 rounded-[4px] border border-gray-600 bg-[#252525] p-1 px-2 text-xs text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-sky-300"
              />
            </div>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-6 lg:gap-4 xl:grid-cols-7">
              {sortedAndFilteredLongtieng
                .slice(
                  0,
                  longtiengSearchQuery
                    ? sortedAndFilteredLongtieng.length
                    : longtiengShowCount,
                )
                .map((ep) => renderEpisodeButton(ep, "longtieng"))}
              {longtiengSearchQuery === "" &&
                renderShowMoreButton(
                  longtiengShowCount,
                  sortedAndFilteredLongtieng.length,
                  setLongtiengShowCount,
                )}
              {longtiengSearchQuery === "" &&
                renderCollapseButton(
                  longtiengShowCount,
                  initialShowCount,
                  setLongtiengShowCount,
                )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Episodes;