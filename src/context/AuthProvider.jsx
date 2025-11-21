import React, { useEffect } from 'react';
import { atom } from 'nanostores';
import { useStore } from '@nanostores/react';
import axios from 'axios';

const BASE_URL = import.meta.env.PUBLIC_API_BASE_URL;

// Stores
export const userStore = atom(null);
export const loadingStore = atom(true);

// Actions
export const checkAuth = async () => {
    if (typeof window === 'undefined') return;

    const token = localStorage.getItem('access_token');
    if (token) {
        try {
            const response = await axios.get(`${BASE_URL}/api/auth/profile/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            userStore.set(response.data);
        } catch (error) {
            console.error("Auth check failed:", error);
            // Only remove token if 401? Or always?
            // For now, keep it simple
            localStorage.removeItem('access_token');
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
        formData.append('username', username);
        formData.append('password', password);

        const response = await axios.post(`${BASE_URL}/api/auth/login/`, formData, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        const { access_token } = response.data;
        localStorage.setItem('access_token', access_token);

        // Fetch user profile immediately after login
        const profileResponse = await axios.get(`${BASE_URL}/api/auth/profile/`, {
            headers: { Authorization: `Bearer ${access_token}` },
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
        await axios.post(`${BASE_URL}/api/auth/register/`, userData);
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
    localStorage.removeItem('access_token');
    userStore.set(null);
    window.location.href = '/';
};

const refreshUser = async () => {
    console.log("[AuthProvider] refreshUser() called");
    const token = localStorage.getItem('access_token');
    if (token) {
        try {
            console.log("[AuthProvider] Fetching profile from", `${BASE_URL}/api/auth/profile/`);
            const response = await axios.get(`${BASE_URL}/api/auth/profile/`, {
                headers: { Authorization: `Bearer ${token}` },
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
        const token = localStorage.getItem('access_token');
        if (!token) {
            return {
                success: false,
                message: "Vui lòng đăng nhập trước"
            };
        }

        const formData = new FormData();
        formData.append('file', file);

        const response = await axios.post(`${BASE_URL}/api/auth/upload-avatar/`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        });

        // Update user store with new avatar URL
        const updatedUser = await axios.get(`${BASE_URL}/api/auth/profile/`, {
            headers: { Authorization: `Bearer ${token}` },
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
        const response = await axios.post(`${BASE_URL}/api/auth/forgot-password/`, {
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
        const response = await axios.post(`${BASE_URL}/api/auth/reset-password/`, {
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

// Hook for React components
export const useAuth = () => {
    const user = useStore(userStore);
    const loading = useStore(loadingStore);

    return { user, loading, login, register, logout, uploadAvatar, requestPasswordReset, resetPassword, refreshUser };
};

// AuthProvider component to initialize auth on mount
// Can be used in Layout or Pages to ensure auth is checked
export const AuthProvider = ({ children }) => {
    useEffect(() => {
        checkAuth();
    }, []);

    return <>{children}</>;
};
