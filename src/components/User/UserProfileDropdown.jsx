import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthProvider';
import { HistoryIcon } from '../Header/WatchedMoviesDropdown';
import { BookmarkIcon } from '../Header/FavoriteMoviesDropdown';

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
    </svg>
);

export default function UserProfileDropdown() {
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const isPremium = (user) => {
        if (!user || !user.premium_until) return false;
        return new Date(user.premium_until) > new Date();
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
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleDropdown = () => setIsOpen(!isOpen);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={toggleDropdown}
                className="flex items-center justify-center w-10 h-10 text-white/80 hover:text-white focus:outline-none rounded-md"
                aria-label="User menu"
            >
                {user && user.anh_dai_dien_url ? (
                    <div className="relative h-8 w-8 flex items-center justify-center">
                        {isPremium(user) && (
                            <div
                                className="absolute -inset-[3px] rounded-full"
                                style={{
                                    background: "conic-gradient(from 0deg, #ff0000, #ffffff, #000000, #ff0000)",
                                    animation: "spin 4s linear infinite",
                                    zIndex: 0
                                }}
                            />
                        )}
                        <img
                            src={user.anh_dai_dien_url}
                            alt={user.username}
                            className={`relative h-full w-full rounded-full object-cover z-10 ${isPremium(user) ? "border-2 border-[#1a1c22]" : "ring-2 ring-white/10"}`}
                        />
                    </div>
                ) : (
                    <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center ring-2 ring-white/10">
                        <UserIcon />
                    </div>
                )}
            </button>

            {isOpen && (
                <div className="fixed top-16 left-1/2 z-[60] mt-2 w-[90vw] max-w-sm -translate-x-1/2 origin-top divide-y divide-gray-100/10 rounded-xl bg-[#23252b]/95 backdrop-blur-xl border border-white/10 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none sm:absolute sm:left-auto sm:right-0 sm:top-full sm:mt-2 sm:w-64 sm:translate-x-0 sm:origin-top-right">
                    <div className="px-4 py-3">
                        {user ? (
                            <>
                                <p className="text-sm text-white">Xin chào, {user.username}</p>
                                <div className="flex items-center gap-1 mt-1 text-xs text-yellow-400">
                                    {isPremium(user) ? (
                                        <span className="font-bold bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 text-transparent bg-clip-text drop-shadow-sm tracking-wider">
                                            PREMIUM
                                        </span>
                                    ) : (
                                        <span></span>
                                    )}
                                </div>
                                <p className="text-xs text-gray-400">
                                    🪙 <b>{user.points} Đậu</b>
                                    <a 
                                        href="/hoi-dap" 
                                        className="ml-2 text-gray-500 hover:text-gray-300 transition-colors inline-block"
                                        title="Hỏi - Đáp về Đậu"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                                        </svg>
                                    </a>
                                </p>
                            </>
                        ) : (
                            <p className="text-sm text-gray-400">Khách</p>
                        )}
                    </div>

                    <div className="py-1">
                        {user && (
                            <>
                                <a
                                    href="/tai-khoan"
                                    className="group flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white"
                                >
                                    <UserIcon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-300" aria-hidden="true" />
                                    Thông tin tài khoản
                                </a>
                                {/* <a
                                    href="/mini-game"
                                    className="group flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white"
                                >
                                    <div className="mr-3 h-5 w-5 flex items-center justify-center text-purple-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                        </svg>
                                    </div>
                                    🎮 Mini Games
                                </a> */}
                            </>
                        )}
                        {/* <a
                            href={user ? "/mua-dau" : "/dang-nhap"}
                            className="group flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white"
                        >
                            <div className="mr-3 h-5 w-5 flex items-center justify-center text-yellow-500">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.04-1.34-.87-2.57-2.49-2.97V5h-2v.98c-1.53.37-2.98 1.46-2.98 3.12 0 1.77 1.02 2.29 2.64 2.72 1.88.45 2.42.97 2.42 1.81 0 .99-.72 1.55-2.05 1.55-1.42 0-2.28-.72-2.3-1.67h-1.74c.05 1.47 1.12 2.84 2.98 3.21v1.42h2v-1.41c1.63-.41 2.7-1.51 2.7-3.157 0-1.865-1.22-2.734-2.6-3.144z" />
                                </svg>
                            </div>
                            💰 Kiếm Đậu
                        </a>
                        <a
                            href={user ? "/doi-qua" : "/dang-nhap"}
                            className="group flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white"
                        >
                            <div className="mr-3 h-5 w-5 flex items-center justify-center text-orange-500">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                    <path d="M9.375 3a1.875 1.875 0 000 3.75h1.875v4.5H3.375A1.875 1.875 0 011.5 9.375v-.75c0-1.036.84-1.875 1.875-1.875h3.193A3.375 3.375 0 0112 2.753a3.375 3.375 0 015.432 3.997h3.193c1.035 0 1.875.84 1.875 1.875v.75c0 1.036-.84 1.875-1.875 1.875H12.75v-4.5h1.875a1.875 1.875 0 10-1.875-1.875V6.75h-1.5V4.875C11.25 3.839 10.41 3 9.375 3zM11.25 12.75H3v6.75a2.25 2.25 0 002.25 2.25h6v-9zM12.75 12.75v9h6a2.25 2.25 0 002.25-2.25v-6.75h-8.25z" />
                                </svg>
                            </div>
                            🎁 Đổi Quà
                        </a> */}
                        {/* <a
                            href={user ? "/mua-premium" : "/dang-nhap"}
                            className="group flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white"
                        >
                            <div className="mr-3 h-5 w-5 flex items-center justify-center text-red-500">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                                </svg>
                            </div>
                            Mua tài khoản Youtube Premium - 40k/tháng
                        </a> */}
                        <a
                            href="/tai-khoan/yeu-thich"
                            className="group flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white"
                        >
                            <div className="mr-3 h-5 w-5 flex items-center justify-center">
                                <BookmarkIcon />
                            </div>
                            Phim Yêu Thích
                        </a>
                        <a
                            href="/tai-khoan/lich-su"
                            className="group flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white"
                        >
                            <div className="mr-3 h-5 w-5 flex items-center justify-center">
                                <HistoryIcon />
                            </div>
                            Lịch sử xem
                        </a>
                    </div>

                    <div className="py-1">
                        {user ? (
                            <button
                                onClick={() => {
                                    logout();
                                    setIsOpen(false);
                                }}
                                className="flex w-full items-center px-4 py-2 text-sm text-red-400 hover:bg-white/10 hover:text-red-300"
                            >
                                Đăng xuất
                            </button>
                        ) : (
                            <>
                                <a
                                    href="/dang-nhap"
                                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white"
                                >
                                    Đăng nhập
                                </a>
                                <a
                                    href="/dang-ky"
                                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white"
                                >
                                    Đăng ký
                                </a>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
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

// Inject styles
if (typeof document !== 'undefined') {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
}
