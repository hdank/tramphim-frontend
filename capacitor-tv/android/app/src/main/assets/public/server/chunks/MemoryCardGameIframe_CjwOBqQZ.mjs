import { jsx, jsxs } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { u as useAuth } from './Header_CYtzV8Xx.mjs';

function MemoryCardGameIframe({ levelId, onClose }) {
  const { user, refreshUser } = useAuth();
  const [gameUrl, setGameUrl] = useState("");
  const GAME_BASE_URL = "http://localhost:3000";
  useEffect(() => {
    if (user && levelId) {
      const url = `${GAME_BASE_URL}?email=${encodeURIComponent(user.email)}&level_id=${levelId}`;
      setGameUrl(url);
    }
  }, [user, levelId]);
  useEffect(() => {
    const handleMessage = async (event) => {
      if (event.data.type === "GAME_COMPLETE") {
        console.log("[MemoryCardGameIframe] Game Complete! Score:", event.data.score);
      }
      if (event.data.type === "POINTS_UPDATED") {
        console.log("[MemoryCardGameIframe] Points Updated! New Points:", event.data.points);
        console.log("[MemoryCardGameIframe] Calling refreshUser()...");
        await refreshUser();
        console.log("[MemoryCardGameIframe] refreshUser() completed");
      }
      if (event.data.type === "NAVIGATE_BACK") {
        console.log("[MemoryCardGameIframe] Received NAVIGATE_BACK - closing game");
        onClose();
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [refreshUser, onClose]);
  if (!user) {
    return /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center h-screen bg-gray-900 text-white", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold mb-4", children: "Vui lòng đăng nhập" }),
      /* @__PURE__ */ jsx("a", { href: "/dang-nhap", className: "text-sky-400 hover:underline", children: "Đăng nhập ngay" })
    ] }) });
  }
  if (!gameUrl) return /* @__PURE__ */ jsx("div", { className: "h-screen bg-gray-900" });
  return /* @__PURE__ */ jsx("div", { className: "relative w-full h-full bg-gray-900 rounded-xl overflow-hidden shadow-2xl border border-gray-700", children: /* @__PURE__ */ jsx(
    "iframe",
    {
      src: gameUrl,
      title: "Memory Card Game",
      className: "w-full h-full border-0",
      allow: "fullscreen"
    }
  ) });
}

export { MemoryCardGameIframe as M };
