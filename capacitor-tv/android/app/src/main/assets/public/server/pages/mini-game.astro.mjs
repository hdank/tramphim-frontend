/* empty css                                 */
import { e as createComponent, l as renderComponent, r as renderTemplate, n as Fragment, h as addAttribute, m as maybeRenderHead } from '../chunks/astro/server_Boq9MD4A.mjs';
import 'piccolore';
import { $ as $$Layout } from '../chunks/Layout_D08VFffu.mjs';
import { u as useAuth, H as Header } from '../chunks/Header_CYtzV8Xx.mjs';
import { F as Footer } from '../chunks/index_Ce3Y9ZIG.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { M as MemoryCardGameIframe } from '../chunks/MemoryCardGameIframe_CjwOBqQZ.mjs';
/* empty css                                     */
export { renderers } from '../renderers.mjs';

function GameList() {
  const { user } = useAuth();
  const [showLevelModal, setShowLevelModal] = useState(false);
  const [showInsufficientPointsModal, setShowInsufficientPointsModal] = useState(false);
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const GAME_API_URL = "http://localhost:8000";
  useEffect(() => {
    fetchLevels();
  }, []);
  const fetchLevels = async () => {
    try {
      const response = await fetch(`${GAME_API_URL}/game/config`);
      if (!response.ok) throw new Error("Failed to fetch levels");
      const data = await response.json();
      setLevels(data.levels || []);
    } catch (error) {
      console.error("Failed to fetch levels:", error);
    }
  };
  const handlePlayClick = () => {
    if (!user) {
      window.location.href = "/dang-nhap";
      return;
    }
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
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-[#0f172a] text-white p-4 md:p-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-12", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-600", children: "Mini Games" }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-400 text-lg", children: "Chơi game giải trí, nhận đậu đổi quà!" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8", children: [
        /* @__PURE__ */ jsxs("div", { className: "group relative bg-[#1e293b] rounded-2xl overflow-hidden border border-gray-700 hover:border-sky-500 transition-all duration-300 shadow-xl hover:shadow-sky-500/20", children: [
          /* @__PURE__ */ jsxs("div", { className: "aspect-video relative overflow-hidden bg-gray-900 flex items-center justify-center", children: [
            /* @__PURE__ */ jsx(
              "img",
              {
                src: "/mini-game-card.png",
                alt: "Memory Card Game",
                className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-300",
                loading: "lazy",
                decoding: "async"
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold mb-2 text-white group-hover:text-sky-400 transition-colors", children: "Memory Card" }),
            /* @__PURE__ */ jsx("p", { className: "text-gray-400 text-sm mb-6", children: "Lật thẻ tìm cặp giống nhau. Thử thách trí nhớ của bạn!" }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: handlePlayClick,
                className: "w-full py-3 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-bold transition-all transform active:scale-95 shadow-lg shadow-sky-600/20",
                children: "Chơi Ngay"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-[#1e293b]/50 rounded-2xl overflow-hidden border border-gray-800 p-6 flex flex-col items-center justify-center text-center opacity-70", children: [
          /* @__PURE__ */ jsx("span", { className: "text-4xl mb-4", children: "🚀" }),
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-gray-400 mb-2", children: "Sắp ra mắt" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "Nhiều game hấp dẫn khác đang được phát triển" })
        ] })
      ] })
    ] }),
    showLevelModal && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4", children: /* @__PURE__ */ jsxs("div", { className: "bg-[#1e293b] rounded-2xl border border-gray-700 w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in duration-200", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-6", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-white", children: "Chọn Cấp Độ" }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setShowLevelModal(false),
            className: "p-2 hover:bg-gray-700 rounded-full transition-colors",
            children: "✕"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
        levels.map((level) => /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => handleLevelSelect(level.id),
            className: "w-full p-4 bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-sky-500 rounded-xl flex items-center justify-between group transition-all",
            children: [
              /* @__PURE__ */ jsxs("div", { className: "text-left", children: [
                /* @__PURE__ */ jsx("div", { className: "font-bold text-white group-hover:text-sky-400 transition-colors", children: level.name }),
                /* @__PURE__ */ jsxs("div", { className: "text-xs text-gray-400 mt-1", children: [
                  level.pairs_count,
                  " cặp thẻ • ",
                  level.time_limit ? `${level.time_limit}s` : "Không giới hạn"
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-end", children: [
                /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-500 uppercase", children: "Thưởng" }),
                /* @__PURE__ */ jsxs("span", { className: "text-yellow-400 font-bold", children: [
                  "+",
                  level.points_reward,
                  " Đậu"
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-end", children: [
                /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-500 uppercase", children: "Phạt" }),
                /* @__PURE__ */ jsxs("span", { className: "text-red-400 font-bold", children: [
                  "-",
                  level.points_penalty,
                  " Đậu"
                ] })
              ] })
            ]
          },
          level.id
        )),
        levels.length === 0 && /* @__PURE__ */ jsx("div", { className: "text-center py-8 text-gray-500", children: "Đang tải danh sách cấp độ..." })
      ] })
    ] }) }),
    selectedLevel && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-4 bg-black/90 backdrop-blur-md animate-fade-in", children: /* @__PURE__ */ jsx("div", { className: "w-full h-full md:max-w-6xl md:h-[85vh] md:max-h-[900px] relative animate-scale-in md:shadow-2xl md:rounded-2xl overflow-hidden", children: /* @__PURE__ */ jsx(
      MemoryCardGameIframe,
      {
        levelId: selectedLevel,
        onClose: closeGame
      }
    ) }) }),
    showInsufficientPointsModal && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4", children: /* @__PURE__ */ jsxs("div", { className: "bg-[#1e293b] rounded-2xl border border-gray-700 w-full max-w-md p-8 shadow-2xl animate-in fade-in zoom-in duration-200", children: [
      /* @__PURE__ */ jsx("div", { className: "flex justify-center mb-6", children: /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsx("span", { className: "text-4xl", children: "⚠️" }) }) }),
      /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold text-white text-center mb-3", children: "Điểm không đủ" }),
      /* @__PURE__ */ jsxs("p", { className: "text-gray-400 text-center mb-6", children: [
        "Bạn cần ít nhất ",
        /* @__PURE__ */ jsx("span", { className: "text-yellow-400 font-bold", children: "1,500 Đậu" }),
        " để chơi game này."
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-gray-900/50 p-4 rounded-xl border border-gray-700 mb-6 text-center", children: [
        /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-400 mb-1", children: "Số đậu hiện tại" }),
        /* @__PURE__ */ jsxs("div", { className: "text-3xl font-bold text-yellow-400", children: [
          (user.points || 0).toLocaleString("vi-VN"),
          " Đậu"
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "text-sm text-red-400 mt-2", children: [
          "Thiếu ",
          (1500 - (user.points || 0)).toLocaleString("vi-VN"),
          " Đậu"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setShowInsufficientPointsModal(false),
            className: "flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-bold transition-colors",
            children: "Quay lại"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => window.location.href = "/tai-khoan/yeu-thich",
            className: "flex-1 py-3 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-bold transition-colors",
            children: "Kiếm Đậu"
          }
        )
      ] })
    ] }) })
  ] });
}

const $$MiniGame = createComponent(($$result, $$props, $$slots) => {
  const title = "Mini Game - Tr\u1EA1m Phim";
  const description = "Th\u1EED th\xE1ch tr\xED nh\u1EDB v\u1EDBi game l\u1EADt th\u1EBB v\xE0 nh\u1EADn \u0111i\u1EC3m th\u01B0\u1EDFng!";
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$Layout, { "data-astro-cid-6zw3wqtg": true }, { "default": ($$result2) => renderTemplate`  ${renderComponent($$result2, "Header", Header, { "client:load": true, "client:component-hydration": "load", "client:component-path": "E:/tramphim/tramphim-frontend/src/components/Header/Header", "client:component-export": "default", "data-astro-cid-6zw3wqtg": true })} ${maybeRenderHead()}<div class="main-container" data-astro-cid-6zw3wqtg> <div class="main-content-wrapper" data-astro-cid-6zw3wqtg> <main id="main-content" class="minigame-page" data-astro-cid-6zw3wqtg> ${renderComponent($$result2, "GameList", GameList, { "client:load": true, "client:component-hydration": "load", "client:component-path": "E:/tramphim/tramphim-frontend/src/components/MiniGame/GameList", "client:component-export": "default", "data-astro-cid-6zw3wqtg": true })} </main> </div> </div> <footer data-astro-cid-6zw3wqtg> ${renderComponent($$result2, "Footer", Footer, { "data-astro-cid-6zw3wqtg": true })} </footer> `, "head": ($$result2) => renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "slot": "head" }, { "default": ($$result3) => renderTemplate` <title>${title}</title> <meta name="description"${addAttribute(description, "content")}> <meta property="og:title"${addAttribute(title, "content")}> <meta property="og:description"${addAttribute(description, "content")}> ` })}` })} `;
}, "E:/tramphim/tramphim-frontend/src/pages/mini-game.astro", void 0);

const $$file = "E:/tramphim/tramphim-frontend/src/pages/mini-game.astro";
const $$url = "/mini-game";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$MiniGame,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
