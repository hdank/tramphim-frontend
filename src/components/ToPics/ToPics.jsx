import React from 'react';
import { motion } from 'framer-motion';

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

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

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

      <motion.div
        className="themes-container"
        role="navigation"
        aria-label="Các chủ đề phim"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {themesToMap.map(({ ten, slug, color }, index) => (
          <motion.a
            key={slug || ten}
            href={getHref(slug)}
            className={`theme-card-new ${color}`}
            variants={cardVariants}
            whileHover={{ 
              y: -6,
              transition: { duration: 0.3 }
            }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Gradient overlay for depth */}
            <div className="theme-card-overlay" />
            
            {/* Content */}
            <div className="theme-content-new">
              <h3 className="theme-title-new">
                {ten || viewAllTheme.name}
              </h3>

              <div className="theme-link-new">
                {(ten || viewAllTheme.name) !== viewAllTheme.name ? (
                  <span className="flex items-center gap-1">
                    Xem chủ đề
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                ) : (
                  <span>Xem tất cả ({fetchedThemes.length} chủ đề)</span>
                )}
              </div>
            </div>
            
            {/* Decorative wave pattern */}
            <svg
              className="theme-svg-new"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              viewBox="0 0 1440 200"
            >
              {Array.from({ length: 8 }, (_, i) => {
                const y = 80 + i * 15;
                const amp = 30;
                return (
                  <path
                    key={i}
                    d={`
                      M0,${y}
                      C 360,${y - amp} 720,${y + amp} 1080,${y}
                      C 1260,${y - amp} 1440,${y + amp} 1440,${y}
                    `}
                    stroke="rgba(255,255,255,0.15)"
                    fill="none"
                    strokeWidth="1.5"
                  />
                );
              })}
            </svg>
          </motion.a>
        ))}
      </motion.div>
    </section>
  );
};

export default ThemeSection;