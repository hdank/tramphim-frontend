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
                    <img
                        src={user.anh_dai_dien_url}
                        alt={user.username}
                        className="h-8 w-8 rounded-full object-cover ring-2 ring-white/10"
                    />
                ) : (
                    <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center ring-2 ring-white/10">
                        <UserIcon />
                    </div>
                )}
            </button>

            {isOpen && (
                <div className="absolute left-4 right-4 mt-2 origin-top-right divide-y divide-gray-100/10 rounded-md bg-[#23252b] shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 sm:left-auto sm:right-0 sm:w-56">
                    <div className="px-4 py-3">
                        {user ? (
                            <>
                                <p className="text-sm text-white">Xin chào,</p>
                                <p className="truncate text-sm font-medium text-white">{user.username}</p>
                            </>
                        ) : (
                            <p className="text-sm text-gray-400">Khách</p>
                        )}
                    </div>

                    <div className="py-1">
                        {user && (
                            <a
                                href="/tai-khoan"
                                className="group flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white"
                            >
                                <UserIcon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-300" aria-hidden="true" />
                                Thông tin tài khoản
                            </a>
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
