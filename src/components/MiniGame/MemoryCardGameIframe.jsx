import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthProvider';

export default function MemoryCardGameIframe({ levelId, onClose }) {
    const { user, refreshUser } = useAuth();
    const [gameUrl, setGameUrl] = useState('');

    // Memory game URL (update this to your deployed game URL)
    const GAME_BASE_URL = import.meta.env.PUBLIC_MINIGAME_URL || 'http://localhost:3000';

    useEffect(() => {
        if (user && levelId) {
            const url = `${GAME_BASE_URL}?email=${encodeURIComponent(user.email)}&level_id=${levelId}`;
            setGameUrl(url);
        }
    }, [user, levelId]);

    // Listen for messages from iframe (e.g. game over)
    useEffect(() => {
        const handleMessage = async (event) => {
            if (event.data.type === 'GAME_COMPLETE') {
                console.log("[MemoryCardGameIframe] Game Complete! Score:", event.data.score);
            }
            if (event.data.type === 'POINTS_UPDATED') {
                console.log("[MemoryCardGameIframe] Points Updated! New Points:", event.data.points);
                console.log("[MemoryCardGameIframe] Calling refreshUser()...");
                await refreshUser();
                console.log("[MemoryCardGameIframe] refreshUser() completed");
            }
        };
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [refreshUser]);

    if (!user) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Vui lòng đăng nhập</h2>
                    <a href="/dang-nhap" className="text-sky-400 hover:underline">Đăng nhập ngay</a>
                </div>
            </div>
        );
    }

    if (!gameUrl) return <div className="h-screen bg-gray-900"></div>;

    return (
        <div className="relative w-full h-full bg-gray-900 rounded-xl overflow-hidden shadow-2xl border border-gray-700">
            <button
                onClick={onClose}
                className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full transition-colors"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            <iframe
                src={gameUrl}
                title="Memory Card Game"
                className="w-full h-full border-0"
                allow="fullscreen"
            />
        </div>
    );
}
