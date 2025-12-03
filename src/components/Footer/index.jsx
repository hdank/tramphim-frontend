import React from "react";
import { motion } from "framer-motion";
import logo from "../../assets/logo.png";

const Footer = () => {
  const navLinks = [
    { name: "Giới thiệu", href: "/gioi-thieu" },
    { name: "Chính sách bảo mật", href: "/chinh-sach-bao-mat" },
    { name: "Điều khoản sử dụng", href: "/dieu-khoan-su-dung" },
    { name: "Hỏi - Đáp", href: "/hoi-dap" },
    { name: "Tuyên bố miễn trừ trách nhiệm", href: "/tuyen-bo-mien-tru" },
  ];

  const socialLinks = [
    { 
      name: "Facebook", 
      href: "https://www.facebook.com/profile.php?id=61581940541481",
      icon: (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      )
    },
    { 
      name: "TikTok", 
      href: "https://www.tiktok.com/@tramphim.com",
      icon: (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
        </svg>
      )
    },
  ];

  const year = new Date().getFullYear();

  return (
    <footer className="footer-new">
      <div className="footer-inner-new">
        {/* Top section with logo and links */}
        <div className="footer-top">
          <div className="footer-brand">
            <img
              src={typeof logo === "string" ? logo : logo.src}
              className="footer-logo-new"
              loading="lazy"
              alt="Trạm Phim - Xem phim Vietsub HD"
            />
            <p className="footer-tagline">
              Xem phim hay, chất lượng cao với phụ đề Việt
            </p>
          </div>
          
          <div className="footer-links-section">
            <h3 className="footer-section-title">Liên kết</h3>
            <nav aria-label="Liên kết chân trang">
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', listStyle: 'none', padding: 0, margin: 0 }}>
                {navLinks.map((link, index) => (
                  <li key={link.href}>
                    <a 
                      href={link.href}
                      style={{ 
                        color: '#d1d5db !important', 
                        fontSize: '14px',
                        textDecoration: 'none',
                        display: 'block'
                      }}
                    >
                      <span style={{ color: '#d1d5db' }}>{link.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          
          <div className="footer-social-section">
            <h3 className="footer-section-title">Liên hệ</h3>
            <div className="footer-social-links">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-icon"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>

          </div>
        </div>
        
        {/* Bottom copyright */}
        <div className="footer-bottom">
          <div className="footer-divider-line"></div>
          <p className="footer-copyright">
            © {year} Trạm Phim. Tất cả quyền được bảo lưu.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
