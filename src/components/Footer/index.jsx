import React from "react";
import logo from "../../assets/logo.png";

const Footer = () => {
  const navLinks = [
    { name: "Hỏi - Đáp", href: "/" },
    { name: "Chính sách bảo mật", href: "/" },
    { name: "Điều khoản sử dụng", href: "/" },
    { name: "Giới thiệu", href: "/" },
  ];

  const year = new Date().getFullYear();

  return (
    <div className="footer-base">
      <div className="footer-inner">
        <section className="footer-logo-section">
          <div className="footer-logo-wrapper">
            <img
              src={typeof logo === "string" ? logo : logo.src}
              className="footer-logo-img"
              loading="lazy"
              alt="hh3d - Xem phim Vietsub HD"
            />
          </div>
        </section>

        <nav className="mb-4" aria-label="Liên kết chân trang và Liên hệ">
          <ul className="footer-nav-list">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="footer-nav-link">
                  {link.name}
                </a>
              </li>
            ))}

            <li className="text-sm">
              Liên hệ:{" "}
              <a
                href="https://t.me/meomeochill"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-contact-link"
              >
                @meomeochill
              </a>
            </li>
          </ul>
        </nav>

        <div className="footer-copyright-divider">
          <address className="footer-copyright-text">
            <p>Copyright © {year} Trạm Phim.</p>
          </address>
        </div>
      </div>
    </div>
  );
};

export default Footer;
