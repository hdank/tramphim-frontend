import React from 'react';
import { useAuth } from '../../context/AuthProvider';
import './MiniGamePlayer.css';

export default function MiniGamePlayer() {
    const { user } = useAuth();

    // Memory game URL (update this to your deployed game URL)
    const GAME_BASE_URL = import.meta.env.PUBLIC_MINIGAME_URL || 'http://localhost:3000';

    if (!user) {
        return (
            <div className="minigame-auth-required">
                <div className="auth-message-card">
                    <div className="auth-icon">🔒</div>
                    <h2>Vui lòng đăng nhập</h2>
                    <p>Bạn cần đăng nhập để chơi mini game và nhận điểm thưởng!</p>
                    <a href="/dang-nhap" className="btn-login">
                        Đăng nhập ngay
                    </a>
                </div>
            </div>
        );
    }

    const gameUrl = `${GAME_BASE_URL}?email=${encodeURIComponent(user.email)}`;

    return (
        <div className="minigame-container">
            <div className="minigame-header">
                <h1>🎮 Mini Game - Lật Thẻ</h1>
                <div className="game-info">
                    <p className="welcome-text">
                        Chào <span className="user-name">{user.username}</span>!
                    </p>
                    <p className="instruction">
                        Hoàn thành game để nhận điểm thưởng vào tài khoản của bạn!
                    </p>
                </div>
            </div>

            <div className="game-wrapper">
                <iframe
                    src={gameUrl}
                    title="Memory Card Game"
                    className="game-iframe"
                    allow="fullscreen"
                />
            </div>

            <div className="game-footer">
                <div className="tip-box">
                    <span className="tip-icon">💡</span>
                    <p>Mẹo: Tập trung ghi nhớ vị trí các thẻ để tìm cặp nhanh hơn!</p>
                </div>
            </div>
        </div>
    );
}
