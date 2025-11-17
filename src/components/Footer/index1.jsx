import logo from "../../assets/logo.png";

const Footer = () => {
  const navLinks = [
    { name: "Hỏi - Đáp", href: "/hoi-dap" },
    { name: "Chính sách bảo mật", href: "/chinh-sach-bao-mat" },
    { name: "Điều khoản sử dụng", href: "/dieu-khoan-su-dung" },
    { name: "Giới thiệu", href: "/gioi-thieu" },
    { name: "Liên hệ", href: "/lien-he" },
  ];

  const year = new Date().getFullYear();

  return (
    <div className="border-t border-gray-700 bg-[#252525] px-4 py-6 text-gray-400">
      <div className="b mx-auto max-w-screen-xl">
        {/* Phần Logo */}
        <section className="mb-4 flex flex-col items-start justify-between md:flex-row md:items-center">
          <div className="flex flex-wrap items-center gap-4 lg:gap-16">
            {/* Logo */}
            <img
              src={typeof logo === "string" ? logo : logo.src}
              className="h-12"
              loading="lazy"
              alt="Motchill - Xem phim Vietsub HD"
            />
          </div>
        </section>

        {/* Phần Nav Links (Backlinks) và Liên hệ */}
        <nav className="mb-4" aria-label="Liên kết chân trang và Liên hệ">
          {/* Sử dụng flex để các li và liên hệ nằm cùng hàng và dễ quản lý khoảng cách */}
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="transition-colors duration-300 hover:text-white"
                >
                  {link.name}
                </a>
              </li>
            ))}

            {/* Thêm mục Liên hệ vào cùng danh sách <ul> */}
            <li className="text-sm">
              Liên hệ:{" "}
              <a
                href="https://t.me/meomeochill"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-white transition-colors hover:text-sky-400"
              >
                @meomeochill
              </a>
            </li>
          </ul>
        </nav>

        {/* Phần Copyright Tối Giản */}
        <div className="border-t border-gray-700 pt-4">
          <address className="text-sm not-italic">
            {/* Đã sửa tên trang web theo yêu cầu của bạn ở bước trước */}
            <p>Copyright © {year} HoatHinh3D.</p>
          </address>
        </div>
      </div>
    </div>
  );
};

export default Footer;
