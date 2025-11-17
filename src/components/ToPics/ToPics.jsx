import React from 'react';

const getHref = (slug) => `chu-de/${slug}`;

const viewAllTheme = {
  name: "Xem tất cả",
  slug: "/",
  color: "from-[#4a4e69] to-[#606480]",
};

const defaultColors = [
  "from-[#6654CC] to-[#8072E2]",
  "from-[#47526D] to-[#596688]",
  "from-[#44A38A] to-[#55C3A5]",
  "from-[#8C60C0] to-[#A277DA]",
  "from-[#9E6445] to-[#B67657]",
  "from-[#7F4E4E] to-[#996363]",
  "from-[#574E7F] to-[#736399]",
];

const ThemeSection = ({ themesData }) => {
  if (!Array.isArray(themesData)) {
    themesData = [];
  }
  const fetchedThemes = themesData.map((theme, index) => ({
    ...theme,
    color: defaultColors[index % defaultColors.length]
  }));

  if (!fetchedThemes || fetchedThemes.length === 0) return null;
  const maxDisplayedThemes = 5;
  const displayedThemes = fetchedThemes.slice(0, maxDisplayedThemes);
  const shouldShowViewAll = fetchedThemes.length > maxDisplayedThemes;

  let themesToMap = [...displayedThemes];
  if (shouldShowViewAll) {
    themesToMap.push(viewAllTheme);
  } else {
    themesToMap = fetchedThemes;
  }

  return (
    <section className="theme-section">
      <div className="theme-header-wrapper">
        <div className="theme-header-group">
          <div className="theme-header-divider-dot"></div>
          <h2 className="theme-header-title">Chủ Đề Hôm Nay</h2>
        </div>
        <div className="theme-header-divider-line"></div>
      </div>

      <div
        className="themes-container"
        role="navigation"
        aria-label="Các chủ đề phim"
      >
        {themesToMap.map(({ ten, slug, color }) => ( // ten là tên từ API
          <a
            key={slug || ten}
            href={getHref(slug)}
            className={`theme-card ${color}`}
          >
            <div className="theme-content">
              <h3 className="theme-title">
                {ten || viewAllTheme.name}
              </h3>

              {(ten || viewAllTheme.name) !== viewAllTheme.name && (
                <div className="theme-link">
                  <span className="mt-2">Xem chủ đề</span>
                </div>
              )}
              {(ten || viewAllTheme.name) === viewAllTheme.name && (
                <div className="theme-link">
                  <span className="mt-2">
                    Xem tất cả ({fetchedThemes.length} chủ đề)
                  </span>
                </div>
              )}
            </div>
            <svg
              className="theme-svg"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              viewBox="0 0 1440 200"
            >
              {Array.from({ length: 40 }, (_, i) => {
                const y =50 + i * 12;  // khoảng cách giữa các wave
                const amp = 40;         // độ cong nhẹ như hình
                return (
                  <path
                    key={i}
                    d={`
          M0,${y}
          C 360,${y - amp} 720,${y + amp} 1080,${y}
          C 1260,${y - amp} 1440,${y + amp} 1440,${y}
        `}
                    stroke="#ccc"
                    fill="none"
                    strokeWidth="2"
                    opacity="0.5"
                  />
                );
              })}
            </svg>

          </a>
        ))}
      </div>
    </section>
  );
};

export default ThemeSection;