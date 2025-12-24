import { jsx, Fragment, jsxs } from 'react/jsx-runtime';
import { useEffect, useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { atom } from 'nanostores';
import { useStore } from '@nanostores/react';
import axios from 'axios';
import { toast } from 'react-toastify';

const logo = new Proxy({"src":"/_astro/logo.CijVfbQw.png","width":1080,"height":487,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "E:/tramphim/tramphim-frontend/src/assets/logo.png";
							}
							
							return target[name];
						}
					});

const BASE_URL$1 = "https://api.tramphim.com";
const userStore = atom(null);
const loadingStore = atom(true);
const checkAuth = async () => {
  if (typeof window === "undefined") return;
  const token = localStorage.getItem("access_token");
  if (token) {
    try {
      const response = await axios.get(`${BASE_URL$1}/api/auth/profile/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      userStore.set(response.data);
    } catch (error) {
      console.error("Auth check failed:", error);
      localStorage.removeItem("access_token");
      userStore.set(null);
    }
  } else {
    userStore.set(null);
  }
  loadingStore.set(false);
};
const login = async (username, password) => {
  try {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);
    const response = await axios.post(`${BASE_URL$1}/api/auth/login/`, formData, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" }
    });
    const { access_token } = response.data;
    localStorage.setItem("access_token", access_token);
    const profileResponse = await axios.get(`${BASE_URL$1}/api/auth/profile/`, {
      headers: { Authorization: `Bearer ${access_token}` }
    });
    userStore.set(profileResponse.data);
    return { success: true };
  } catch (error) {
    console.error("Login failed:", error);
    return {
      success: false,
      message: error.response?.data?.detail || "Đăng nhập thất bại"
    };
  }
};
const register = async (userData) => {
  try {
    await axios.post(`${BASE_URL$1}/api/auth/register/`, userData);
    return { success: true };
  } catch (error) {
    console.error("Register failed:", error);
    return {
      success: false,
      message: error.response?.data?.detail || "Đăng ký thất bại"
    };
  }
};
const logout = () => {
  localStorage.removeItem("access_token");
  userStore.set(null);
  window.location.href = "/";
};
const refreshUser = async () => {
  console.log("[AuthProvider] refreshUser() called");
  const token = localStorage.getItem("access_token");
  if (token) {
    try {
      console.log("[AuthProvider] Fetching profile from", `${BASE_URL$1}/api/auth/profile/`);
      const response = await axios.get(`${BASE_URL$1}/api/auth/profile/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("[AuthProvider] Profile fetched successfully:", response.data);
      userStore.set(response.data);
      console.log("[AuthProvider] userStore updated with new user data");
      return { success: true, user: response.data };
    } catch (error) {
      console.error("[AuthProvider] User refresh failed:", error);
      return { success: false };
    }
  }
  console.log("[AuthProvider] No token found");
  return { success: false };
};
const uploadAvatar = async (file) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      return {
        success: false,
        message: "Vui lòng đăng nhập trước"
      };
    }
    const formData = new FormData();
    formData.append("file", file);
    const response = await axios.post(`${BASE_URL$1}/api/auth/upload-avatar/`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data"
      }
    });
    const updatedUser = await axios.get(`${BASE_URL$1}/api/auth/profile/`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    userStore.set(updatedUser.data);
    return {
      success: true,
      avatar_url: response.data.avatar_url
    };
  } catch (error) {
    console.error("Avatar upload failed:", error);
    return {
      success: false,
      message: error.response?.data?.detail || "Tải ảnh đại diện thất bại"
    };
  }
};
const requestPasswordReset = async (email) => {
  try {
    const response = await axios.post(`${BASE_URL$1}/api/auth/forgot-password/`, {
      email
    });
    return {
      success: true,
      message: response.data.message
    };
  } catch (error) {
    console.error("Request password reset failed:", error);
    return {
      success: false,
      message: error.response?.data?.detail || "Yêu cầu đặt lại mật khẩu thất bại"
    };
  }
};
const resetPassword = async (email, code, newPassword, confirmPassword) => {
  try {
    const response = await axios.post(`${BASE_URL$1}/api/auth/reset-password/`, {
      email,
      code,
      new_password: newPassword,
      confirm_password: confirmPassword
    });
    return {
      success: true,
      message: response.data.message
    };
  } catch (error) {
    console.error("Reset password failed:", error);
    return {
      success: false,
      message: error.response?.data?.detail || "Đặt lại mật khẩu thất bại"
    };
  }
};
const useAuth = () => {
  const user = useStore(userStore);
  const loading = useStore(loadingStore);
  return { user, loading, login, register, logout, uploadAvatar, requestPasswordReset, resetPassword, refreshUser };
};
const AuthProvider = ({ children }) => {
  useEffect(() => {
    checkAuth();
  }, []);
  return /* @__PURE__ */ jsx(Fragment, { children });
};

const HistoryIcon = () => /* @__PURE__ */ jsx(
  "svg",
  {
    xmlns: "http://www.w3.org/2000/svg",
    width: "24",
    height: "24",
    viewBox: "0 0 48 48",
    className: "h-6 w-6 text-white",
    children: /* @__PURE__ */ jsxs("g", { fill: "none", stroke: "#fff", strokeLinejoin: "round", strokeWidth: "4", children: [
      /* @__PURE__ */ jsx("path", { d: "M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4S4 12.954 4 24s8.954 20 20 20Z" }),
      /* @__PURE__ */ jsx("path", { strokeLinecap: "round", d: "M24.008 12v12.01l8.479 8.48" })
    ] })
  }
);

const BookmarkIcon = () => /* @__PURE__ */ jsx(
  "svg",
  {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    strokeWidth: 1.5,
    stroke: "currentColor",
    className: "h-6 w-6 text-white",
    fill: "none",
    children: /* @__PURE__ */ jsx(
      "path",
      {
        strokeLinecap: "round",
        strokeLinejoin: "round",
        d: "M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
      }
    )
  }
);

const UserIcon = () => /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "currentColor", className: "w-6 h-6", children: /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: "M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z", clipRule: "evenodd" }) });
function UserProfileDropdown() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const isPremium = (user2) => {
    if (!user2 || !user2.premium_until) return false;
    return new Date(user2.premium_until) > /* @__PURE__ */ new Date();
  };
  useEffect(() => {
    console.log("[UserProfileDropdown] User updated:", user);
  }, [user]);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const toggleDropdown = () => setIsOpen(!isOpen);
  return /* @__PURE__ */ jsxs("div", { className: "relative", ref: dropdownRef, children: [
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: toggleDropdown,
        className: "flex items-center justify-center w-10 h-10 text-white/80 hover:text-white focus:outline-none rounded-md",
        "aria-label": "User menu",
        children: user && user.anh_dai_dien_url ? /* @__PURE__ */ jsxs("div", { className: "relative h-8 w-8 flex items-center justify-center", children: [
          isPremium(user) && /* @__PURE__ */ jsx(
            "div",
            {
              className: "absolute -inset-[3px] rounded-full",
              style: {
                background: "conic-gradient(from 0deg, #ff0000, #ffffff, #000000, #ff0000)",
                animation: "spin 4s linear infinite",
                zIndex: 0
              }
            }
          ),
          /* @__PURE__ */ jsx(
            "img",
            {
              src: user.anh_dai_dien_url,
              alt: user.username,
              className: `relative h-full w-full rounded-full object-cover z-10 ${isPremium(user) ? "border-2 border-[#1a1c22]" : "ring-2 ring-white/10"}`
            }
          )
        ] }) : /* @__PURE__ */ jsx("div", { className: "h-8 w-8 rounded-full bg-white/10 flex items-center justify-center ring-2 ring-white/10", children: /* @__PURE__ */ jsx(UserIcon, {}) })
      }
    ),
    isOpen && /* @__PURE__ */ jsxs("div", { className: "fixed top-16 left-1/2 z-[60] mt-2 w-[90vw] max-w-sm -translate-x-1/2 origin-top divide-y divide-gray-100/10 rounded-xl bg-[#23252b]/95 backdrop-blur-xl border border-white/10 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none sm:absolute sm:left-auto sm:right-0 sm:top-full sm:mt-2 sm:w-64 sm:translate-x-0 sm:origin-top-right", children: [
      /* @__PURE__ */ jsx("div", { className: "px-4 py-3", children: user ? /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs("p", { className: "text-sm text-white", children: [
          "Xin chào, ",
          user.username
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex items-center gap-1 mt-1 text-xs text-yellow-400", children: isPremium(user) ? /* @__PURE__ */ jsx("span", { className: "font-bold bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 text-transparent bg-clip-text drop-shadow-sm tracking-wider", children: "PREMIUM" }) : /* @__PURE__ */ jsx("span", {}) }),
        /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-400", children: [
          "🪙 ",
          /* @__PURE__ */ jsxs("b", { children: [
            user.points,
            " Đậu"
          ] }),
          /* @__PURE__ */ jsx(
            "a",
            {
              href: "/hoi-dap",
              className: "ml-2 text-gray-500 hover:text-gray-300 transition-colors inline-block",
              title: "Hỏi - Đáp về Đậu",
              children: /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "currentColor", className: "w-4 h-4", children: /* @__PURE__ */ jsx("path", { d: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" }) })
            }
          )
        ] })
      ] }) : /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-400", children: "Khách" }) }),
      /* @__PURE__ */ jsxs("div", { className: "py-1", children: [
        user && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsxs(
            "a",
            {
              href: "/tai-khoan",
              className: "group flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white",
              children: [
                /* @__PURE__ */ jsx(UserIcon, { className: "mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-300", "aria-hidden": "true" }),
                "Thông tin tài khoản"
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "a",
            {
              href: "/mini-game",
              className: "group flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white",
              children: [
                /* @__PURE__ */ jsx("div", { className: "mr-3 h-5 w-5 flex items-center justify-center text-purple-400", children: /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "currentColor", className: "w-5 h-5", children: /* @__PURE__ */ jsx("path", { d: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" }) }) }),
                "🎮 Mini Games"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs(
          "a",
          {
            href: user ? "/mua-dau" : "/dang-nhap",
            className: "group flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white",
            children: [
              /* @__PURE__ */ jsx("div", { className: "mr-3 h-5 w-5 flex items-center justify-center text-yellow-500", children: /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "currentColor", className: "w-5 h-5", children: /* @__PURE__ */ jsx("path", { d: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.04-1.34-.87-2.57-2.49-2.97V5h-2v.98c-1.53.37-2.98 1.46-2.98 3.12 0 1.77 1.02 2.29 2.64 2.72 1.88.45 2.42.97 2.42 1.81 0 .99-.72 1.55-2.05 1.55-1.42 0-2.28-.72-2.3-1.67h-1.74c.05 1.47 1.12 2.84 2.98 3.21v1.42h2v-1.41c1.63-.41 2.7-1.51 2.7-3.157 0-1.865-1.22-2.734-2.6-3.144z" }) }) }),
              "💰 Kiếm Đậu"
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "a",
          {
            href: user ? "/doi-qua" : "/dang-nhap",
            className: "group flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white",
            children: [
              /* @__PURE__ */ jsx("div", { className: "mr-3 h-5 w-5 flex items-center justify-center text-orange-500", children: /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "currentColor", className: "w-5 h-5", children: /* @__PURE__ */ jsx("path", { d: "M9.375 3a1.875 1.875 0 000 3.75h1.875v4.5H3.375A1.875 1.875 0 011.5 9.375v-.75c0-1.036.84-1.875 1.875-1.875h3.193A3.375 3.375 0 0112 2.753a3.375 3.375 0 015.432 3.997h3.193c1.035 0 1.875.84 1.875 1.875v.75c0 1.036-.84 1.875-1.875 1.875H12.75v-4.5h1.875a1.875 1.875 0 10-1.875-1.875V6.75h-1.5V4.875C11.25 3.839 10.41 3 9.375 3zM11.25 12.75H3v6.75a2.25 2.25 0 002.25 2.25h6v-9zM12.75 12.75v9h6a2.25 2.25 0 002.25-2.25v-6.75h-8.25z" }) }) }),
              "🎁 Đổi Quà"
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "a",
          {
            href: user ? "/mua-premium" : "/dang-nhap",
            className: "group flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white",
            children: [
              /* @__PURE__ */ jsx("div", { className: "mr-3 h-5 w-5 flex items-center justify-center text-red-500", children: /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "currentColor", className: "w-5 h-5", children: /* @__PURE__ */ jsx("path", { d: "M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" }) }) }),
              "Mua tài khoản Youtube Premium - 40k/tháng"
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "a",
          {
            href: "/tai-khoan/yeu-thich",
            className: "group flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white",
            children: [
              /* @__PURE__ */ jsx("div", { className: "mr-3 h-5 w-5 flex items-center justify-center", children: /* @__PURE__ */ jsx(BookmarkIcon, {}) }),
              "Phim Yêu Thích"
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "a",
          {
            href: "/tai-khoan/lich-su",
            className: "group flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white",
            children: [
              /* @__PURE__ */ jsx("div", { className: "mr-3 h-5 w-5 flex items-center justify-center", children: /* @__PURE__ */ jsx(HistoryIcon, {}) }),
              "Lịch sử xem"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { className: "py-1", children: user ? /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => {
            logout();
            setIsOpen(false);
          },
          className: "flex w-full items-center px-4 py-2 text-sm text-red-400 hover:bg-white/10 hover:text-red-300",
          children: "Đăng xuất"
        }
      ) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(
          "a",
          {
            href: "/dang-nhap",
            className: "block px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white",
            children: "Đăng nhập"
          }
        ),
        /* @__PURE__ */ jsx(
          "a",
          {
            href: "/dang-ky",
            className: "block px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white",
            children: "Đăng ký"
          }
        )
      ] }) })
    ] })
  ] });
}
const styles = `
@keyframes spin {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}
`;
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}

const BellIcon = ({ hasUnread }) => /* @__PURE__ */ jsx(
  "svg",
  {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: hasUnread ? "currentColor" : "none",
    stroke: "currentColor",
    strokeWidth: "2",
    className: "w-6 h-6",
    children: /* @__PURE__ */ jsx(
      "path",
      {
        strokeLinecap: "round",
        strokeLinejoin: "round",
        d: "M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2M8 1.918l-.797.161A4 4 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4 4 0 0 0-3.203-3.92zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5 5 0 0 1 13 6c0 .88.32 4.2 1.22 6"
      }
    )
  }
);
const API_BASE_URL = "https://api.tramphim.com";
function NotificationDropdown() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const fetchNotifications = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(`${API_BASE_URL}/api/binhluan/user/notifications/`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
        const unread = data.filter((n) => !n.da_xem).length;
        setUnreadCount(unread);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!user) return;
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 3e4);
    return () => clearInterval(interval);
  }, [user]);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      fetchNotifications();
    }
  };
  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(
        `${API_BASE_URL}/api/binhluan/${notificationId}/mark-as-read/`,
        {
          method: "PATCH",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        }
      );
      if (response.ok) {
        setNotifications(
          (prev) => prev.map(
            (n) => n.id === notificationId ? { ...n, da_xem: true } : n
          )
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };
  const deleteNotification = async (e, notificationId) => {
    e.stopPropagation();
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(
        `${API_BASE_URL}/api/binhluan/${notificationId}/delete-notification/`,
        {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        }
      );
      if (response.ok) {
        setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
        setUnreadCount((prev) => Math.max(0, prev - 1));
        toast.success("Xóa thông báo thành công");
      } else {
        toast.error("Lỗi khi xóa thông báo");
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast.error("Lỗi khi xóa thông báo");
    }
  };
  const handleNotificationClick = async (notification) => {
    if (!notification.da_xem) {
      await markAsRead(notification.id);
    }
    if (notification.binh_luan_id) {
      try {
        const token = localStorage.getItem("access_token");
        const response = await fetch(
          `${API_BASE_URL}/api/binhluan/comment/${notification.binh_luan_id}/phim-info/`,
          {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          }
        );
        if (response.ok) {
          const phimInfo = await response.json();
          const movieSlug = phimInfo.slug;
          const commentId = notification.binh_luan_id;
          if (movieSlug && commentId) {
            const url = `/phim/${movieSlug}#binh_luan_${commentId}`;
            const currentPath = window.location.pathname;
            const targetPath = `/phim/${movieSlug}`;
            setIsOpen(false);
            if (currentPath === targetPath) {
              setTimeout(() => {
                const element = document.getElementById(`binh_luan_${commentId}`);
                if (element) {
                  element.scrollIntoView({ behavior: "smooth", block: "center" });
                  element.classList.add("ring-2", "ring-sky-400", "bg-white/10");
                  setTimeout(() => {
                    element.classList.remove("ring-2", "ring-sky-400", "bg-white/10");
                  }, 3e3);
                }
              }, 100);
            } else {
              window.location.href = url;
            }
            return;
          }
        } else {
          toast.error("Không thể tải thông tin phim");
        }
      } catch (error) {
        console.error("Error fetching phim info:", error);
        toast.error("Lỗi khi tải thông tin phim");
      }
    }
    setIsOpen(false);
  };
  return /* @__PURE__ */ jsxs("div", { className: "relative", ref: dropdownRef, children: [
    /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: toggleDropdown,
        className: "relative flex items-center justify-center w-10 h-10 text-white/80 hover:text-white focus:outline-none transition-colors rounded-md",
        "aria-label": "Notifications",
        children: [
          /* @__PURE__ */ jsx(BellIcon, { hasUnread: unreadCount > 0 }),
          unreadCount > 0 && /* @__PURE__ */ jsx("span", { className: "absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center", children: unreadCount > 9 ? "9+" : unreadCount })
        ]
      }
    ),
    isOpen && /* @__PURE__ */ jsxs("div", { className: "fixed top-16 left-1/2 z-[60] mt-2 max-h-[80vh] w-[90vw] max-w-md -translate-x-1/2 overflow-y-auto rounded-xl bg-[#23252b]/95 backdrop-blur-xl border border-white/10 shadow-2xl ring-1 ring-black ring-opacity-5 sm:absolute sm:left-auto sm:right-0 sm:top-full sm:mt-2 sm:w-96 sm:max-h-96 sm:translate-x-0", children: [
      /* @__PURE__ */ jsx("div", { className: "sticky top-0 border-b border-gray-100/10 bg-[#23252b]/95 backdrop-blur-xl px-4 py-3 z-10", children: /* @__PURE__ */ jsx("h3", { className: "text-sm font-medium text-white", children: "Thông báo" }) }),
      loading ? /* @__PURE__ */ jsx("div", { className: "px-4 py-6 text-center text-gray-400", children: /* @__PURE__ */ jsx("p", { className: "text-sm", children: "Đang tải..." }) }) : !user ? /* @__PURE__ */ jsxs("div", { className: "px-4 py-6 text-center", children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-400", children: "Vui lòng đăng nhập để xem thông báo" }),
        /* @__PURE__ */ jsx("a", { href: "/dang-nhap", className: "mt-2 inline-block rounded-md bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/20", children: "Đăng nhập" })
      ] }) : notifications.length === 0 ? /* @__PURE__ */ jsx("div", { className: "px-4 py-6 text-center", children: /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-400", children: "Chưa có thông báo nào" }) }) : /* @__PURE__ */ jsx("div", { className: "divide-y divide-gray-100/10", children: notifications.map((notification) => /* @__PURE__ */ jsxs(
        "div",
        {
          className: `px-4 py-3 transition-colors group flex items-start gap-3 ${notification.da_xem ? "hover:bg-white/5" : "bg-white/10 hover:bg-white/15"}`,
          children: [
            /* @__PURE__ */ jsxs(
              "div",
              {
                onClick: () => handleNotificationClick(notification),
                className: "flex-1 cursor-pointer flex gap-3 items-start min-w-0",
                children: [
                  notification.loai === "system" ? /* @__PURE__ */ jsx("div", { className: "h-8 w-8 rounded-full bg-sky-600 flex-shrink-0 flex items-center justify-center ring-1 ring-white/10", children: /* @__PURE__ */ jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "currentColor", className: "w-5 h-5 text-white", children: [
                    /* @__PURE__ */ jsx("path", { d: "M10.464 8.746c.227-.18.497-.311.786-.394v2.795a2.252 2.252 0 01-.786-.393c-.394-.313-.546-.681-.546-1.004 0-.323.152-.691.546-1.004zM12.75 15.662v-2.824c.347.085.664.228.921.421.427.32.579.686.579.991 0 .305-.152.671-.579.991a2.534 2.534 0 01-.921.42z" }),
                    /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: "M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v.816a3.836 3.836 0 00-1.72.756c-.712.566-1.112 1.35-1.112 2.178 0 .829.4 1.612 1.113 2.178.502.4 1.102.647 1.719.756v2.978a2.536 2.536 0 01-.921-.421l-.879-.66a.75.75 0 00-.9 1.2l.879.66c.533.4 1.169.645 1.821.75V18a.75.75 0 001.5 0v-.81a4.124 4.124 0 001.821-.749c.745-.559 1.179-1.344 1.179-2.191 0-.847-.434-1.632-1.179-2.191a4.122 4.122 0 00-1.821-.75V8.354c.29.082.559.213.786.393l.415.33a.75.75 0 00.933-1.175l-.415-.33a3.836 3.836 0 00-1.719-.755V6z", clipRule: "evenodd" })
                  ] }) }) : notification.binh_luan?.nguoi_dung?.anh_dai_dien_url ? /* @__PURE__ */ jsx(
                    "img",
                    {
                      src: notification.binh_luan.nguoi_dung.anh_dai_dien_url,
                      alt: notification.binh_luan.nguoi_dung.username,
                      className: "h-8 w-8 rounded-full object-cover flex-shrink-0 ring-1 ring-white/10"
                    }
                  ) : /* @__PURE__ */ jsx("div", { className: "h-8 w-8 rounded-full bg-white/10 flex-shrink-0 flex items-center justify-center ring-1 ring-white/10", children: /* @__PURE__ */ jsx("span", { className: "text-xs font-semibold text-white", children: notification.binh_luan?.nguoi_dung?.username?.charAt(0).toUpperCase() }) }),
                  /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                    notification.loai === "system" ? /* @__PURE__ */ jsxs(Fragment, { children: [
                      /* @__PURE__ */ jsx("p", { className: "text-sm text-white font-medium", children: "Hệ thống" }),
                      /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-300 mt-1 whitespace-pre-line", children: notification.noi_dung })
                    ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                      /* @__PURE__ */ jsxs("p", { className: "text-sm text-white", children: [
                        /* @__PURE__ */ jsx("span", { className: "font-medium", children: notification.binh_luan?.nguoi_dung?.username }),
                        " ",
                        notification.loai === "reply" && "đã trả lời bình luận của bạn"
                      ] }),
                      notification.binh_luan?.noi_dung && /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-400 line-clamp-2 mt-1", children: [
                        '"',
                        notification.binh_luan.noi_dung,
                        '"'
                      ] })
                    ] }),
                    /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 mt-1", children: new Date(notification.ngay_tao).toLocaleDateString("vi-VN", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    }) })
                  ] }),
                  !notification.da_xem && /* @__PURE__ */ jsx("div", { className: "w-2 h-2 rounded-full bg-sky-400 flex-shrink-0 mt-2" })
                ]
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: (e) => deleteNotification(e, notification.id),
                className: "flex-shrink-0 text-gray-400 hover:text-red-400 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all p-1",
                title: "Xóa thông báo",
                children: /* @__PURE__ */ jsx(
                  "svg",
                  {
                    xmlns: "http://www.w3.org/2000/svg",
                    viewBox: "0 0 24 24",
                    fill: "none",
                    stroke: "currentColor",
                    strokeWidth: "2",
                    className: "w-4 h-4",
                    children: /* @__PURE__ */ jsx("path", { d: "M18 6L6 18M6 6l12 12" })
                  }
                )
              }
            )
          ]
        },
        notification.id
      )) })
    ] })
  ] });
}

const getBaseUrl = () => {
  let url = "https://api.tramphim.com";
  if (url && !url.includes("localhost") && url.startsWith("http://")) {
    url = url.replace("http://", "https://");
  }
  return url;
};
const BASE_URL = getBaseUrl();
const SearchIcon = () => /* @__PURE__ */ jsx(
  "svg",
  {
    className: "h-4 w-4",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    "aria-hidden": "true",
    children: /* @__PURE__ */ jsx(
      "path",
      {
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeWidth: 2,
        d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      }
    )
  }
);
const CloseIcon = () => /* @__PURE__ */ jsx(
  "svg",
  {
    className: "h-5 w-5",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    "aria-hidden": "true",
    children: /* @__PURE__ */ jsx(
      "path",
      {
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeWidth: 2,
        d: "M6 18L18 6M6 6l12 12"
      }
    )
  }
);
const DropdownArrowIcon = ({ open }) => /* @__PURE__ */ jsx(
  "svg",
  {
    className: `h-4 w-4 transform transition-transform duration-300 ${open ? "" : "-rotate-90"}`,
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    "aria-hidden": "true",
    children: /* @__PURE__ */ jsx(
      "path",
      {
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeWidth: 2,
        d: "M19 9l-7 7-7-7"
      }
    )
  }
);
const MobileMenuIcon = ({ open }) => /* @__PURE__ */ jsxs("div", { className: "relative h-6 w-6", children: [
  /* @__PURE__ */ jsx(
    "svg",
    {
      className: `absolute left-0 top-0 h-6 w-6 transition-all duration-300 ease-in-out ${open ? "scale-75 opacity-0" : "scale-100 opacity-100"} `,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      "aria-hidden": "true",
      children: /* @__PURE__ */ jsx(
        "path",
        {
          fill: "none",
          stroke: "#fff",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: "2",
          d: "M4 6h16M4 12h8m-8 6h16"
        }
      )
    }
  ),
  /* @__PURE__ */ jsx(
    "svg",
    {
      className: `absolute left-0 top-0 h-6 w-6 transition-all duration-300 ease-in-out ${open ? "scale-100 opacity-100" : "scale-75 opacity-0"} `,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      "aria-hidden": "true",
      children: /* @__PURE__ */ jsx(
        "path",
        {
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: 1.5,
          d: "M6 18L18 6M6 6l12 12",
          className: "text-red-300"
        }
      )
    }
  )
] });
function Header() {
  const [theLoaiList, setTheLoaiList] = useState([]);
  const [showTheLoai, setShowTheLoai] = useState(false);
  const [showQuocGia, setShowQuocGia] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showMobileTheLoai, setShowMobileTheLoai] = useState(false);
  const [showMobileQuocGia, setShowMobileQuocGia] = useState(false);
  const [currentPath, setCurrentPath] = useState("");
  const [desktopSearchQuery, setDesktopSearchQuery] = useState("");
  const [desktopSearchResults, setDesktopSearchResults] = useState([]);
  const [showDesktopSearchResults, setShowDesktopSearchResults] = useState(false);
  const [isDesktopSearching, setIsDesktopSearching] = useState(false);
  const [mobileSearchQuery, setMobileSearchQuery] = useState("");
  const [mobileSearchResults, setMobileSearchResults] = useState([]);
  const [showMobileSearchResults, setShowMobileSearchResults] = useState(false);
  const [isMobileSearching, setIsMobileSearching] = useState(false);
  const theLoaiRef = useRef(null);
  const quocGiaRef = useRef(null);
  const desktopSearchRef = useRef(null);
  const mobileMenuPanelRef = useRef(null);
  const mobileSearchInputRef = useRef(null);
  const desktopSearchInputRef = useRef(null);
  const headerRef = useRef(null);
  const mobileTheLoaiRef = useRef(null);
  const mobileQuocGiaRef = useRef(null);
  const fetchTheLoaiList = useCallback(async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/theloai/`);
      if (!response.ok) {
        throw new Error("Lỗi khi fetch danh sách thể loại");
      }
      const data = await response.json();
      setTheLoaiList(data);
    } catch (error) {
      console.error("Fetch TheLoai List Error:", error);
      setTheLoaiList([]);
    }
  }, []);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleScroll = () => setScrolled(window.scrollY > 50);
      window.addEventListener("scroll", handleScroll);
      setCurrentPath(window.location.pathname);
      fetchTheLoaiList();
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [fetchTheLoaiList]);
  useEffect(() => {
    if (typeof document !== "undefined") {
      const handleKeyDown = (event) => {
        if (event.key === "Escape") {
          closeAllPopups();
        }
      };
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, []);
  useEffect(() => {
    if (typeof document !== "undefined") {
      const handleClickOutside = (event) => {
        if (theLoaiRef.current && !theLoaiRef.current.contains(event.target))
          setShowTheLoai(false);
        if (quocGiaRef.current && !quocGiaRef.current.contains(event.target))
          setShowQuocGia(false);
        if (desktopSearchRef.current && !desktopSearchRef.current.contains(event.target))
          setShowDesktopSearchResults(false);
        if (mobileMenuOpen && mobileMenuPanelRef.current && !mobileMenuPanelRef.current.contains(event.target) && headerRef.current && !headerRef.current.contains(event.target)) {
          setMobileMenuOpen(false);
        }
        if (mobileTheLoaiRef.current && !mobileTheLoaiRef.current.contains(event.target)) {
          setShowMobileTheLoai(false);
        }
        if (mobileQuocGiaRef.current && !mobileQuocGiaRef.current.contains(event.target)) {
          setShowMobileQuocGia(false);
        }
        if (mobileSearchInputRef.current && !mobileSearchInputRef.current.contains(event.target) && !event.target.closest(".mobile-search-results-dropdown")) {
          setShowMobileSearchResults(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [mobileMenuOpen]);
  useEffect(() => {
    if (desktopSearchQuery.trim().length < 1) {
      setDesktopSearchResults([]);
      setShowDesktopSearchResults(false);
      return;
    }
    setIsDesktopSearching(true);
    setShowDesktopSearchResults(true);
    const handler = setTimeout(async () => {
      try {
        const searchUrl = `${BASE_URL}/api/search/?q=${encodeURIComponent(desktopSearchQuery.trim())}`;
        const response = await fetch(searchUrl);
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        const resultsArray = Array.isArray(data) ? data : data && data.data && data.data.items ? data.data.items : [];
        setDesktopSearchResults(resultsArray);
        setShowDesktopSearchResults(true);
      } catch (error) {
        console.error("Search error:", error);
        setDesktopSearchResults([]);
        setShowDesktopSearchResults(true);
      } finally {
        setIsDesktopSearching(false);
      }
    }, 150);
    return () => {
      clearTimeout(handler);
      setIsDesktopSearching(false);
    };
  }, [desktopSearchQuery]);
  useEffect(() => {
    if (mobileSearchQuery.trim().length < 1) {
      setMobileSearchResults([]);
      setShowMobileSearchResults(false);
      return;
    }
    setIsMobileSearching(true);
    setShowMobileSearchResults(true);
    const handler = setTimeout(async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/api/search/?q=${encodeURIComponent(mobileSearchQuery.trim())}`
        );
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        const resultsArray = Array.isArray(data) ? data : data && data.data && data.data.items ? data.data.items : [];
        setMobileSearchResults(resultsArray);
        setShowMobileSearchResults(true);
      } catch (error) {
        console.error("Lỗi khi tìm kiếm trên mobile:", error);
        setMobileSearchResults([]);
        setShowMobileSearchResults(true);
      } finally {
        setIsMobileSearching(false);
      }
    }, 150);
    return () => {
      clearTimeout(handler);
      setIsMobileSearching(false);
    };
  }, [mobileSearchQuery]);
  const closeAllPopups = () => {
    setShowTheLoai(false);
    setShowQuocGia(false);
    setShowDesktopSearchResults(false);
    setShowMobileSearchResults(false);
    setMobileMenuOpen(false);
    setDesktopSearchQuery("");
    setMobileSearchQuery("");
    setShowMobileTheLoai(false);
    setShowMobileQuocGia(false);
  };
  const handleInternalNavLinkClick = (e, href) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      window.location.href = href;
    }
    closeAllPopups();
  };
  const handleDesktopSearchSubmit = (e) => {
    e.preventDefault();
    if (desktopSearchQuery.trim()) {
      if (typeof window !== "undefined") {
        window.location.href = `/tim-kiem?q=${encodeURIComponent(
          desktopSearchQuery
        )}`;
      }
      setShowDesktopSearchResults(false);
    }
  };
  const handleMobileSearchSubmit = (e) => {
    e.preventDefault();
    if (mobileSearchQuery.trim()) {
      if (typeof window !== "undefined") {
        window.location.href = `/tim-kiem?q=${encodeURIComponent(
          mobileSearchQuery
        )}`;
      }
      setShowMobileSearchResults(false);
      setMobileSearchQuery("");
      setMobileMenuOpen(false);
    }
  };
  const handleDesktopSearchResultClick = (movie) => {
    setDesktopSearchQuery("");
    setShowDesktopSearchResults(false);
    if (typeof window !== "undefined") {
      window.location.href = `/phim/${movie.slug}`;
    }
  };
  const handleMobileSearchResultClick = (movie) => {
    setMobileSearchQuery("");
    setShowMobileSearchResults(false);
    if (typeof window !== "undefined") {
      window.location.href = `/phim/${movie.slug}`;
    }
  };
  const toggleDropdown = (dropdown) => {
    setShowTheLoai(!showTheLoai );
    setShowQuocGia(false);
    setShowQuocGia(false);
  };
  const toggleMobileDropdown = (dropdown) => {
    setShowMobileTheLoai(!showMobileTheLoai );
    setShowMobileQuocGia(false);
  };
  const handleDropdownKeyDown = (event, dropdown) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleDropdown();
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      toggleDropdown();
    }
  };
  const SearchResultsDropdown = ({
    results,
    isSearching,
    searchQueryLength,
    onResultClick,
    searchType
  }) => /* @__PURE__ */ jsx("div", { className: "z-[9999] p-2", role: "listbox", "aria-label": "Kết quả tìm kiếm", children: isSearching ? /* @__PURE__ */ jsx(
    "div",
    {
      className: "p-4 text-center text-xs text-white/60",
      role: "status",
      "aria-live": "polite",
      children: "Đang tìm kiếm phim"
    }
  ) : results.length > 0 ? /* @__PURE__ */ jsxs(Fragment, { children: [
    results.slice(0, 5).map((movie) => /* @__PURE__ */ jsxs(
      "div",
      {
        onClick: (e) => {
          e.preventDefault();
          e.stopPropagation();
          onResultClick(movie);
        },
        onKeyDown: (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onResultClick(movie);
          }
        },
        className: "flex cursor-pointer items-center space-x-3 rounded-md px-3 py-3 transition-all duration-200 focus:bg-white/10 focus:outline-none",
        role: "option",
        tabIndex: 0,
        "aria-selected": false,
        "aria-label": `Phim ${movie.ten_phim}, ${movie.tinh_trang}, ${movie.ngon_ngu}`,
        children: [
          /* @__PURE__ */ jsx(
            "img",
            {
              src: movie.poster_url,
              alt: "",
              className: "h-16 w-12 flex-shrink-0 rounded-[4px] object-fill",
              onError: (e) => {
                e.target.src = "/placeholder-image.jpg";
              },
              "aria-hidden": "true"
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsx("h4", { className: "truncate text-[13px] font-medium text-white hover:text-sky-300", children: movie.ten_phim }),
            /* @__PURE__ */ jsxs("p", { className: "truncate text-xs text-white/60", children: [
              movie.tinh_trang,
              " • ",
              movie.ngon_ngu
            ] })
          ] })
        ]
      },
      movie.id
    )),
    results.length > 5 && /* @__PURE__ */ jsxs(
      "a",
      {
        href: `/tim-kiem?q=${encodeURIComponent(
          (searchType === "desktop" ? desktopSearchQuery : mobileSearchQuery) || ""
        ).trim()}`,
        className: "block border-t border-white/10 px-3 py-2 text-center text-[13px] text-white hover:text-sky-300",
        onClick: (e) => handleInternalNavLinkClick(
          e,
          `/tim-kiem?q=${encodeURIComponent(
            (searchType === "desktop" ? desktopSearchQuery : mobileSearchQuery) || ""
          ).trim()}`
        ),
        "aria-label": `Xem tất cả ${results.length} kết quả tìm kiếm`,
        children: [
          "Xem tất cả (",
          results.length,
          " kết quả)"
        ]
      }
    )
  ] }) : /* @__PURE__ */ jsx(
    "div",
    {
      className: "p-4 text-center text-white/60",
      role: "status",
      "aria-live": "polite",
      children: "Không tìm thấy kết quả."
    }
  ) });
  const navLinksDesktop = [
    { href: "/loai-phim/phim-chieu-rap", label: "Phim Chiếu Rạp" },
    { href: "/loai-phim/phim-le", label: "Phim Lẻ" },
    { href: "/loai-phim/phim-bo", label: "Phim Bộ" },
    { href: "/loai-phim/hoat-hinh", label: "Hoạt Hình" },
    { href: "/anime", label: "Anime" }
  ];
  return /* @__PURE__ */ jsxs(AuthProvider, { children: [
    showMobileSearchResults && mobileSearchQuery.trim().length >= 1 || mobileMenuOpen ? /* @__PURE__ */ jsx(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        onClick: closeAllPopups,
        onKeyDown: (e) => {
          if (e.key === "Escape") {
            closeAllPopups();
          }
        },
        className: "fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden",
        role: "button",
        tabIndex: 0,
        "aria-label": "Đóng overlay"
      }
    ) : null,
    /* @__PURE__ */ jsx(
      "header",
      {
        ref: headerRef,
        className: `header-wrapper-main z-50 mx-auto max-w-screen-2xl px-4 py-0 transition-all duration-500 ease-out lg:px-6 lg:py-2 2xl:px-4 ${scrolled ? "header-scrolled" : ""}`,
        role: "banner",
        children: /* @__PURE__ */ jsxs("div", { className: "md:h-18 relative flex h-16 w-full items-center justify-between", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-grow items-center gap-4 sm:gap-16", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex flex-row items-center gap-2 lg:gap-4", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => setMobileMenuOpen((p) => !p),
                  className: "flex text-white/80 hover:text-white focus:text-white xl:hidden",
                  "aria-label": mobileMenuOpen ? "Đóng menu" : "Mở menu",
                  "aria-expanded": mobileMenuOpen,
                  "aria-controls": "mobile-menu",
                  children: /* @__PURE__ */ jsx(MobileMenuIcon, { open: mobileMenuOpen })
                }
              ),
              /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
                "a",
                {
                  href: "/",
                  className: "flex-shrink-0 ",
                  "aria-label": "Trang chủ",
                  onClick: (e) => handleInternalNavLinkClick(e, "/"),
                  children: /* @__PURE__ */ jsx(
                    "img",
                    {
                      src: typeof logo === "string" ? logo : logo.src,
                      alt: "Logo trang web phim",
                      className: "h-12 w-auto sm:h-14 md:h-16 lg:h-20 xl:h-24"
                    }
                  )
                }
              ) }),
              /* @__PURE__ */ jsx(
                "nav",
                {
                  className: "hidden items-center text-xs lg:space-x-2 lg:text-sm xl:flex 2xl:space-x-6",
                  role: "navigation",
                  "aria-label": "Menu chính",
                  children: /* @__PURE__ */ jsxs(
                    "nav",
                    {
                      className: "ml-8 hidden items-center text-xs lg:space-x-6 lg:text-sm xl:flex 2xl:space-x-6",
                      role: "navigation",
                      "aria-label": "Menu chính",
                      children: [
                        navLinksDesktop.map((link) => /* @__PURE__ */ jsxs(
                          "a",
                          {
                            href: link.href,
                            className: `font-mediumm relative py-2 text-[13px] transition-all duration-300 ${currentPath === link.href ? "text-white" : "text-white"} hover:text-sky-300`,
                            onClick: (e) => handleInternalNavLinkClick(e, link.href),
                            children: [
                              link.label,
                              /* @__PURE__ */ jsx(
                                "span",
                                {
                                  className: `absolute bottom-0 left-0 h-0.5 w-full transform rounded-full bg-sky-300 transition-transform duration-300 ${currentPath === link.href ? "scale-x-100" : "scale-x-0"}`,
                                  "aria-hidden": "true"
                                }
                              )
                            ]
                          },
                          link.href
                        )),
                        /* @__PURE__ */ jsxs(
                          "div",
                          {
                            className: "relative hidden text-[13px] lg:block",
                            ref: theLoaiRef,
                            children: [
                              /* @__PURE__ */ jsxs(
                                "button",
                                {
                                  onClick: () => toggleDropdown(),
                                  onKeyDown: (e) => handleDropdownKeyDown(e),
                                  className: "flex items-center space-x-2 py-2 font-medium text-white",
                                  "aria-expanded": showTheLoai,
                                  "aria-haspopup": "true",
                                  "aria-controls": "theloai-dropdown",
                                  id: "theloai-button",
                                  children: [
                                    /* @__PURE__ */ jsx("span", { children: "Thể Loại" }),
                                    /* @__PURE__ */ jsx(DropdownArrowIcon, { open: showTheLoai })
                                  ]
                                }
                              ),
                              showTheLoai && theLoaiList.length > 0 && /* @__PURE__ */ jsx(
                                "div",
                                {
                                  className: "absolute left-2 top-full z-[51] mt-5 w-[30rem] overflow-hidden rounded-lg bg-[#23252b] shadow-2xl backdrop-blur-xl",
                                  role: "menu",
                                  "aria-labelledby": "theloai-button",
                                  id: "theloai-dropdown",
                                  children: /* @__PURE__ */ jsx("div", { className: "px-2 py-4", children: /* @__PURE__ */ jsx("div", { className: "grid grid-cols-3 gap-1", children: theLoaiList.map((item) => /* @__PURE__ */ jsx(
                                    "a",
                                    {
                                      href: `/the-loai/${item.slug}`,
                                      className: "block px-3 py-2 text-xs text-white hover:text-sky-300",
                                      onClick: (e) => handleInternalNavLinkClick(
                                        e,
                                        `/the-loai/${item.slug}`
                                      ),
                                      role: "menuitem",
                                      children: item.ten
                                    },
                                    item.id
                                  )) }) })
                                }
                              )
                            ]
                          }
                        )
                      ]
                    }
                  )
                }
              )
            ] }),
            /* @__PURE__ */ jsx("div", { className: "relative flex-grow lg:hidden", children: /* @__PURE__ */ jsxs(
              "form",
              {
                onSubmit: handleMobileSearchSubmit,
                className: "relative flex-grow",
                role: "search",
                children: [
                  /* @__PURE__ */ jsx("label", { htmlFor: "mobile-search", className: "sr-only", children: "Tìm kiếm phim" }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      ref: mobileSearchInputRef,
                      id: "mobile-search",
                      type: "text",
                      value: mobileSearchQuery,
                      onChange: (e) => setMobileSearchQuery(e.target.value),
                      onFocus: () => {
                        if (mobileSearchQuery.trim().length >= 1 || mobileSearchResults.length > 0) {
                          setShowMobileSearchResults(true);
                        }
                      },
                      placeholder: "Tìm kiếm phim...",
                      className: "h-8 w-full rounded-[4px] bg-white/10 px-4 pr-10 text-xs text-white placeholder-white/60 focus:outline-none",
                      autoComplete: "off",
                      "aria-describedby": showMobileSearchResults ? "mobile-search-results" : void 0,
                      "aria-expanded": showMobileSearchResults,
                      "aria-autocomplete": "list",
                      role: "combobox"
                    }
                  ),
                  mobileSearchQuery.length > 0 ? /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => {
                        setMobileSearchQuery("");
                        setShowMobileSearchResults(false);
                      },
                      className: "absolute right-0 top-0 h-full rounded-[4px] px-3 text-white/70 hover:text-white focus:outline-none",
                      "aria-label": "Xóa tìm kiếm",
                      children: /* @__PURE__ */ jsx(CloseIcon, {})
                    }
                  ) : /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "submit",
                      className: "absolute right-2 top-0 h-full rounded-[4px] text-white/70 hover:text-white focus:outline-none",
                      "aria-label": "Tìm kiếm",
                      children: /* @__PURE__ */ jsx(SearchIcon, {})
                    }
                  )
                ]
              }
            ) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-shrink-0 items-center justify-center gap-2 px-0 md:gap-2 md:pl-2 lg:gap-3", children: [
            /* @__PURE__ */ jsxs("div", { ref: desktopSearchRef, className: "relative hidden lg:block", children: [
              /* @__PURE__ */ jsxs(
                "form",
                {
                  onSubmit: handleDesktopSearchSubmit,
                  className: "relative",
                  role: "search",
                  children: [
                    /* @__PURE__ */ jsx("label", { htmlFor: "desktop-search", className: "sr-only", children: "Tìm kiếm phim" }),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        ref: desktopSearchInputRef,
                        id: "desktop-search",
                        type: "text",
                        value: desktopSearchQuery,
                        onChange: (e) => setDesktopSearchQuery(e.target.value),
                        onFocus: () => {
                          if (desktopSearchQuery.trim().length >= 1 || desktopSearchResults.length > 0) {
                            setShowDesktopSearchResults(true);
                          }
                        },
                        placeholder: "Tìm kiếm phim...",
                        className: "w-[20rem] rounded-md bg-[#ffffff20] px-3 py-2.5 pr-12 text-sm text-white placeholder-white/60 focus:outline focus:outline-2 focus:outline-offset-[1px] focus:outline-[white]",
                        autoComplete: "off",
                        "aria-describedby": showDesktopSearchResults ? "search-results" : void 0,
                        "aria-expanded": showDesktopSearchResults,
                        "aria-autocomplete": "list",
                        role: "combobox"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "submit",
                        className: "absolute right-3 top-1/2 flex h-6 -translate-y-1/2 items-center gap-2 border-l border-white/30 pl-3 text-white/70 transition-colors hover:text-white",
                        "aria-label": "Tìm kiếm",
                        children: /* @__PURE__ */ jsx(SearchIcon, {})
                      }
                    )
                  ]
                }
              ),
              showDesktopSearchResults && desktopSearchQuery.trim().length >= 1 && /* @__PURE__ */ jsx(
                motion.div,
                {
                  initial: { opacity: 0, y: -10, scale: 0.95 },
                  animate: { opacity: 1, y: 0, scale: 1 },
                  exit: { opacity: 0, y: -10, scale: 0.95 },
                  transition: { duration: 0.2 },
                  className: "absolute right-0 top-full z-50 mt-2 max-h-[60vh] w-full overflow-y-auto rounded-xl bg-[#1a1c22]/95 shadow-2xl backdrop-blur-xl border border-white/10",
                  id: "search-results",
                  children: /* @__PURE__ */ jsx(
                    SearchResultsDropdown,
                    {
                      results: desktopSearchResults,
                      isSearching: isDesktopSearching,
                      searchQueryLength: desktopSearchQuery.trim().length,
                      onResultClick: handleDesktopSearchResultClick,
                      searchType: "desktop"
                    }
                  )
                }
              )
            ] }),
            /* @__PURE__ */ jsxs(
              "a",
              {
                href: "/tai-ung-dung",
                className: "hidden lg:flex items-center gap-1.5 rounded-lg bg-sky-500 px-3 py-1.5 text-xs font-medium text-white transition-all hover:bg-sky-600",
                title: "Tải ứng dụng TrạmPhim",
                children: [
                  /* @__PURE__ */ jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
                    /* @__PURE__ */ jsx("path", { d: "M3 15v4c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-4" }),
                    /* @__PURE__ */ jsx("polyline", { points: "7 10 12 15 17 10" }),
                    /* @__PURE__ */ jsx("line", { x1: "12", x2: "12", y1: "15", y2: "3" })
                  ] }),
                  /* @__PURE__ */ jsx("span", { children: "Tải App" })
                ]
              }
            ),
            /* @__PURE__ */ jsx(NotificationDropdown, {}),
            /* @__PURE__ */ jsx(UserProfileDropdown, {})
          ] })
        ] })
      }
    ),
    showMobileSearchResults && mobileSearchQuery.trim().length >= 1 && /* @__PURE__ */ jsx(
      motion.div,
      {
        initial: { opacity: 0, y: -10 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -10 },
        className: "mobile-search-results-dropdown absolute left-0 right-0 top-16 z-[51] max-h-[100vh] overflow-y-auto rounded-xl bg-[#0F111A]/95 shadow-2xl backdrop-blur-xl border border-white/10 lg:hidden",
        onClick: (e) => e.stopPropagation(),
        onTouchEnd: (e) => e.stopPropagation(),
        id: "mobile-search-results",
        children: /* @__PURE__ */ jsx(
          SearchResultsDropdown,
          {
            results: mobileSearchResults,
            isSearching: isMobileSearching,
            searchQueryLength: mobileSearchQuery.trim().length,
            onResultClick: handleMobileSearchResultClick,
            searchType: "mobile"
          }
        )
      }
    ),
    mobileMenuOpen && /* @__PURE__ */ jsx(
      motion.div,
      {
        ref: mobileMenuPanelRef,
        initial: { opacity: 0, y: -20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
        transition: { duration: 0.3, ease: "easeOut" },
        className: "absolute left-0 right-0 top-16 z-[51] w-full border-t border-white/10 bg-[#1a1a1a]/95 backdrop-blur-xl text-sm font-medium shadow-2xl lg:m-8 lg:w-[30%] xl:hidden",
        id: "mobile-menu",
        role: "navigation",
        "aria-label": "Menu di động",
        children: /* @__PURE__ */ jsxs("div", { className: "px-3 py-3", children: [
          /* @__PURE__ */ jsxs(
            "a",
            {
              href: "/tai-ung-dung",
              className: "mb-3 flex items-center gap-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-3 text-white shadow-lg",
              children: [
                /* @__PURE__ */ jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-lg bg-white/20", children: /* @__PURE__ */ jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
                  /* @__PURE__ */ jsx("path", { d: "M3 15v4c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-4" }),
                  /* @__PURE__ */ jsx("polyline", { points: "7 10 12 15 17 10" }),
                  /* @__PURE__ */ jsx("line", { x1: "12", x2: "12", y1: "15", y2: "3" })
                ] }) }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-white/80", children: "Tải ứng dụng" }),
                  /* @__PURE__ */ jsx("p", { className: "font-semibold", children: "TrạmPhim" })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-1", children: [
            { href: "/", label: "Trang Chủ" },
            { href: "/loai-phim/phim-chieu-rap", label: "Phim Chiếu Rạp" },
            { href: "/lich-chieu", label: "Lịch Chiếu" },
            { href: "/loai-phim/hoat-hinh", label: "Phim Hoạt Hình" },
            { href: "/anime", label: "Anime" },
            { href: "/loai-phim/phim-le", label: "Phim Lẻ" },
            { href: "/loai-phim/phim-bo", label: "Phim Bộ" }
          ].map((link) => /* @__PURE__ */ jsx(
            "a",
            {
              href: link.href,
              className: `block rounded-md px-3 py-2 text-left text-xs transition-all hover:bg-white/10 hover:text-white focus:bg-none focus:text-white ${currentPath === link.href ? "text-sky-300" : "text-white/90"}`,
              onClick: (e) => handleInternalNavLinkClick(e, link.href),
              children: link.label
            },
            link.href
          )) }),
          /* @__PURE__ */ jsxs("div", { className: "relative my-2", ref: mobileTheLoaiRef, children: [
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => toggleMobileDropdown(),
                className: `flex w-full items-center justify-between rounded-md px-3 py-2 text-xs text-left transition-all focus:bg-none hover:text-white  ${showMobileTheLoai ? "text-sky-300" : "text-white/90"}`,
                "aria-expanded": showMobileTheLoai,
                "aria-haspopup": "true",
                children: [
                  "Thể Loại",
                  /* @__PURE__ */ jsx(DropdownArrowIcon, { open: showMobileTheLoai })
                ]
              }
            ),
            showMobileTheLoai && theLoaiList.length > 0 && /* @__PURE__ */ jsx("div", { className: "mt-1 grid grid-cols-3 gap-3 rounded-lg bg-white/5 px-3 py-2 text-white", children: theLoaiList.map((item) => {
              return /* @__PURE__ */ jsx(
                "a",
                {
                  href: `/the-loai/${item.slug}`,
                  className: `block py-1 text-xs font-normal text-white transition-all hover:text-sky-300`,
                  onClick: (e) => handleInternalNavLinkClick(
                    e,
                    `/the-loai/${item.slug}`
                  ),
                  children: item.ten
                },
                item.id
              );
            }) })
          ] })
        ] })
      }
    )
  ] });
}

export { Header as H, logo as l, useAuth as u };
