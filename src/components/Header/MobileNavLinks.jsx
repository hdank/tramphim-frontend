import React from "react";

const navLinksMobile = [
  { href: "/", label: "Đề xuất" },
  {
    href: "/phim/hien-ngu",
    label: "Hiến Ngư",
  },
  { href: "/loai-phim/phim-le", label: "Phim Lẻ" },
  { href: "/loai-phim/phim-bo", label: "Phim Bộ" },
  { href: "/anime", label: "Anime" },
  { href: "/loai-phim/hoat-hinh", label: "Hoạt Hình" },
];

export const MobileNavLinks = ({ currentPath, handleInternalNavLinkClick }) => {
  return (
    <div className="hide-scrollbar flex gap-2 overflow-x-auto px-2 pb-4 sm:flex lg:hidden">
      {navLinksMobile.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className={`flex-shrink-0 px-2 text-base font-medium transition-colors duration-300 ${
            currentPath === link.href ? "text-whhite" : "text-gray-400"
          }`}
          onClick={(e) => handleInternalNavLinkClick(e, link.href)}
        >
          {link.label}
        </a>
      ))}
    </div>
  );
};
