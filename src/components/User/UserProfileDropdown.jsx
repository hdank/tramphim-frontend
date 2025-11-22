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
                                <p className="text-xs text-gray-400">🪙 <b>{user.points} Đậu</b></p>
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
                                <a
                                    href="/mua-premium"
                                    className="group flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white"
                                >
                                    <div className="mr-3 h-5 w-5 flex items-center justify-center text-red-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                            <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                                        </svg>
                                    </div>
                                    Mua tài khoản Youtube Premium
                                </a>
                            </>
                        )}
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
