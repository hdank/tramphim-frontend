import React, { useState } from 'react';
import { useAuth } from '../../context/AuthProvider';

export default function UserProfile() {
    const { user, logout, uploadAvatar } = useAuth();
    const [uploading, setUploading] = useState(false);
    const [uploadMessage, setUploadMessage] = useState(null);

    const handleAvatarChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setUploadMessage({
                type: 'error',
                text: 'Vui lòng chọn một ảnh'
            });
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setUploadMessage({
                type: 'error',
                text: 'Ảnh không được vượt quá 5MB'
            });
            return;
        }

        setUploading(true);
        const result = await uploadAvatar(file);
        setUploading(false);

        if (result.success) {
            setUploadMessage({
                type: 'success',
                text: 'Tải ảnh đại diện thành công'
            });
            setTimeout(() => setUploadMessage(null), 3000);
        } else {
            setUploadMessage({
                type: 'error',
                text: result.message
            });
        }
    };

    if (!user) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#191B24] text-white">
                <p>Đang tải thông tin...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#191B24] px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl bg-[#23252b] shadow-2xl ring-1 ring-white/10">
                <div className="bg-sky-600 px-4 py-5 sm:px-6">
                    <h3 className="text-lg font-medium leading-6 text-white">
                        Thông tin tài khoản
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm text-sky-100">
                        Chi tiết cá nhân và cài đặt.
                    </p>
                </div>
                <div className="border-t border-white/10 px-4 py-5 sm:p-0">
                    <dl className="sm:divide-y sm:divide-white/10">
                        {/* Avatar Section */}
                        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
                            <dt className="text-sm font-medium text-gray-400">Ảnh đại diện</dt>
                            <dd className="mt-1 text-sm text-white sm:col-span-2 sm:mt-0">
                                <div className="flex flex-col gap-4">
                                    {user.anh_dai_dien_url ? (
                                        <img
                                            src={user.anh_dai_dien_url}
                                            alt="Avatar"
                                            className="h-24 w-24 rounded-full object-cover ring-2 ring-sky-500"
                                        />
                                    ) : (
                                        <div className="h-24 w-24 rounded-full bg-gray-700 flex items-center justify-center text-gray-400">
                                        </div>
                                    )}
                                    <label className="relative inline-flex cursor-pointer">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleAvatarChange}
                                            disabled={uploading}
                                            className="hidden"
                                        />
                                        <span className="rounded-md bg-sky-500/10 px-3 py-2 text-sm font-semibold text-sky-400 shadow-sm hover:bg-sky-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                            {uploading ? 'Đang tải...' : 'Chọn ảnh'}
                                        </span>
                                    </label>
                                    {uploadMessage && (
                                        <p className={`text-sm font-medium ${uploadMessage.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                                            {uploadMessage.text}
                                        </p>
                                    )}
                                </div>
                            </dd>
                        </div>
                        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
                            <dt className="text-sm font-medium text-gray-400">Tên đăng nhập</dt>
                            <dd className="mt-1 text-sm text-white sm:col-span-2 sm:mt-0">
                                {user.username}
                            </dd>
                        </div>
                        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
                            <dt className="text-sm font-medium text-gray-400">Email</dt>
                            <dd className="mt-1 text-sm text-white sm:col-span-2 sm:mt-0">
                                {user.email}
                            </dd>
                        </div>
                        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
                            <dt className="text-sm font-medium text-gray-400">Vai trò</dt>
                            <dd className="mt-1 text-sm text-white sm:col-span-2 sm:mt-0 capitalize">
                                {user.vai_tro}
                            </dd>
                        </div>
                    </dl>
                </div>
                <div className="bg-[#2a2c33] px-4 py-4 sm:px-6">
                    <button
                        onClick={logout}
                        className="rounded-md bg-red-500/10 px-3 py-2 text-sm font-semibold text-red-400 shadow-sm hover:bg-red-500/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 transition-colors"
                    >
                        Đăng xuất
                    </button>
                </div>
            </div>
        </div>
    );
}
