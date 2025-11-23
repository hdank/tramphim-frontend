import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthProvider';
import MemoryCardGameIframe from './MemoryCardGameIframe';

export default function GameList() {
    const { user } = useAuth();
    const [showLevelModal, setShowLevelModal] = useState(false);
    const [showInsufficientPointsModal, setShowInsufficientPointsModal] = useState(false);
    const [levels, setLevels] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedLevel, setSelectedLevel] = useState(null);

    // Game Backend URL
    const GAME_API_URL = import.meta.env.PUBLIC_MINIGAME_API_URL || 'http://localhost:8000';

    useEffect(() => {
        fetchLevels();
    }, []);

    const fetchLevels = async () => {
        try {
            const response = await fetch(`${GAME_API_URL}/game/config`);
            if (!response.ok) throw new Error('Failed to fetch levels');
            const data = await response.json();
            // The endpoint returns { levels: [...], images: [...] }
            setLevels(data.levels || []);
        } catch (error) {
            console.error("Failed to fetch levels:", error);
        }
    };

    const handlePlayClick = () => {
        if (!user) {
            window.location.href = '/dang-nhap';
            return;
        }

        // Check if user has minimum points (15000)
        if ((user.points || 0) < 1500) {
            setShowInsufficientPointsModal(true);
            return;
        }

        setShowLevelModal(true);
    };

    const handleLevelSelect = (levelId) => {
        setSelectedLevel(levelId);
        setShowLevelModal(false);
    };

    const closeGame = () => {
        setSelectedLevel(null);
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-white p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-600">
                        Mini Games
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Chơi game giải trí, nhận đậu đổi quà!
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Memory Card Game Card */}
                    <div className="group relative bg-[#1e293b] rounded-2xl overflow-hidden border border-gray-700 hover:border-sky-500 transition-all duration-300 shadow-xl hover:shadow-sky-500/20">
                        <div className="aspect-video bg-gradient-to-br from-indigo-900 to-purple-900 flex items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-0 opacity-30 bg-[url('https://images.unsplash.com/photo-1605806616949-1e87b487bc2a?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center"></div>
                            <span className="text-6xl transform group-hover:scale-110 transition-transform duration-300">🎴</span>
                        </div>

                        <div className="p-6">
                            <h3 className="text-xl font-bold mb-2 text-white group-hover:text-sky-400 transition-colors">
                                Memory Card
                            </h3>
                            <p className="text-gray-400 text-sm mb-6">
                                Lật thẻ tìm cặp giống nhau. Thử thách trí nhớ của bạn!
                            </p>

                            <button
                                onClick={handlePlayClick}
                                className="w-full py-3 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-bold transition-all transform active:scale-95 shadow-lg shadow-sky-600/20"
                            >
                                Chơi Ngay
                            </button>
                        </div>
                    </div>

                    {/* Coming Soon Card */}
                    <div className="bg-[#1e293b]/50 rounded-2xl overflow-hidden border border-gray-800 p-6 flex flex-col items-center justify-center text-center opacity-70">
                        <span className="text-4xl mb-4">🚀</span>
                        <h3 className="text-lg font-bold text-gray-400 mb-2">Sắp ra mắt</h3>
                        <p className="text-sm text-gray-500">Nhiều game hấp dẫn khác đang được phát triển</p>
                    </div>
                </div>
            </div>

            {/* Level Selection Modal */}
            {showLevelModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-[#1e293b] rounded-2xl border border-gray-700 w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-white">Chọn Cấp Độ</h3>
                            <button
                                onClick={() => setShowLevelModal(false)}
                                className="p-2 hover:bg-gray-700 rounded-full transition-colors"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-3">
                            {levels.map((level) => (
                                <button
                                    key={level.id}
                                    onClick={() => handleLevelSelect(level.id)}
                                    className="w-full p-4 bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-sky-500 rounded-xl flex items-center justify-between group transition-all"
                                >
                                    <div className="text-left">
                                        <div className="font-bold text-white group-hover:text-sky-400 transition-colors">
                                            {level.name}
                                        </div>
                                        <div className="text-xs text-gray-400 mt-1">
                                            {level.pairs_count} cặp thẻ • {level.time_limit ? `${level.time_limit}s` : 'Không giới hạn'}
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-xs text-gray-500 uppercase">Thưởng</span>
                                        <span className="text-yellow-400 font-bold">+{level.points_reward} Đậu</span>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-xs text-gray-500 uppercase">Phạt</span>
                                        <span className="text-red-400 font-bold">-{level.points_penalty} Đậu</span>
                                    </div>
                                </button>
                            ))}

                            {levels.length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                    Đang tải danh sách cấp độ...
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Game Modal - Fullscreen on mobile */}
            {selectedLevel && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-4 bg-black/90 backdrop-blur-md animate-fade-in">
                    <div className="w-full h-full md:max-w-6xl md:h-[85vh] md:max-h-[900px] relative animate-scale-in md:shadow-2xl md:rounded-2xl overflow-hidden">
                        <MemoryCardGameIframe
                            levelId={selectedLevel}
                            onClose={closeGame}
                        />
                    </div>
                </div>
            )}

            {/* Insufficient Points Modal */}
            {showInsufficientPointsModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-[#1e293b] rounded-2xl border border-gray-700 w-full max-w-md p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-center mb-6">
                            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
                                <span className="text-4xl">⚠️</span>
                            </div>
                        </div>

                        <h3 className="text-2xl font-bold text-white text-center mb-3">
                            Điểm không đủ
                        </h3>

                        <p className="text-gray-400 text-center mb-6">
                            Bạn cần ít nhất <span className="text-yellow-400 font-bold">15,000 Đậu</span> để chơi game này.
                        </p>

                        <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700 mb-6 text-center">
                            <div className="text-sm text-gray-400 mb-1">Số đậu hiện tại</div>
                            <div className="text-3xl font-bold text-yellow-400">
                                {(user.points || 0).toLocaleString('vi-VN')} Đậu
                            </div>
                            <div className="text-sm text-red-400 mt-2">
                                Thiếu {(15000 - (user.points || 0)).toLocaleString('vi-VN')} Đậu
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowInsufficientPointsModal(false)}
                                className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-bold transition-colors"
                            >
                                Quay lại
                            </button>
                            <button
                                onClick={() => window.location.href = '/tai-khoan/yeu-thich'}
                                className="flex-1 py-3 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-bold transition-colors"
                            >
                                Kiếm Đậu
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
