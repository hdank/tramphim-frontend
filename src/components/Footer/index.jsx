import React from "react";
import logo from "../../assets/logo.png";

const Footer = () => {
  const navLinks = [
    { name: "Giới thiệu", href: "/gioi-thieu" },
    { name: "Chính sách bảo mật", href: "/chinh-sach-bao-mat" },
    { name: "Điều khoản sử dụng", href: "/dieu-khoan-su-dung" },
    { name: "Hỏi - Đáp", href: "/hoi-dap" },
    { name: "Tuyên bố miễn trừ trách nhiệm", href: "/tuyen-bo-mien-tru" },
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
                href="https://www.facebook.com/profile.php?id=61581940541481"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-contact-link"
              >
                TramPhim
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
