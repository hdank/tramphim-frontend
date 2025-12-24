/* empty css                                 */
import { e as createComponent, l as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_Boq9MD4A.mjs';
import 'piccolore';
import { $ as $$Layout } from '../chunks/Layout_D08VFffu.mjs';
import { jsx, jsxs } from 'react/jsx-runtime';
import { createContext, useRef, useEffect, useState } from 'react';
import { g as getHomePageData } from '../chunks/getMovieHome_CQGfeJ3H.mjs';
import Hls from 'hls.js';
export { renderers } from '../renderers.mjs';

const FocusContext = createContext({
  focusKey: null,
  setFocusKey: () => {
  }
});
function FocusProvider({ children }) {
  const rootRef = useRef(null);
  useEffect(() => {
    let lastKeyTime = 0;
    function getFocusableItems() {
      return Array.from(document.querySelectorAll(".tv-item"));
    }
    function focusItem(el) {
      try {
        el && el.focus && el.focus();
      } catch (err) {
      }
    }
    function onKey(e) {
      const keys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Enter", "Backspace"];
      if (!keys.includes(e.key)) return;
      const now = Date.now();
      if (e.repeat && now - lastKeyTime < 40) return;
      lastKeyTime = now;
      if (e.key === "Enter") {
        const active2 = document.activeElement;
        if (active2 && typeof active2.click === "function") {
          e.preventDefault();
          active2.click();
        }
        return;
      }
      if (e.key === "Backspace") {
        try {
          if (window.history && window.history.length > 1) {
            e.preventDefault();
            window.history.back();
          }
        } catch (err) {
        }
        return;
      }
      e.preventDefault();
      const active = document.activeElement;
      const items = getFocusableItems();
      if (!items.length) return;
      if (!active || active === document.body || !active.classList || !active.classList.contains("tv-item")) {
        focusItem(items[0]);
        return;
      }
      const row = parseInt(active.getAttribute("data-row") || "0", 10);
      const col = parseInt(active.getAttribute("data-col") || "0", 10);
      if (e.key === "ArrowLeft") {
        const target = items.find((it) => parseInt(it.getAttribute("data-row") || "0", 10) === row && parseInt(it.getAttribute("data-col") || "0", 10) === col - 1);
        if (target) focusItem(target);
        else {
          const container = active.closest(".tv-row");
          if (container) container.scrollBy({ left: -320, behavior: "smooth" });
        }
        return;
      }
      if (e.key === "ArrowRight") {
        const target = items.find((it) => parseInt(it.getAttribute("data-row") || "0", 10) === row && parseInt(it.getAttribute("data-col") || "0", 10) === col + 1);
        if (target) focusItem(target);
        else {
          const container = active.closest(".tv-row");
          if (container) container.scrollBy({ left: 320, behavior: "smooth" });
        }
        return;
      }
      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        const rowDelta = e.key === "ArrowUp" ? -1 : 1;
        const targetRowIndex = row + rowDelta;
        const candidates = items.filter((it) => parseInt(it.getAttribute("data-row") || "0", 10) === targetRowIndex);
        if (candidates.length === 0) {
          return;
        }
        const activeRect = active.getBoundingClientRect();
        const activeCenterX = activeRect.left + activeRect.width / 2;
        let best = null;
        let bestDist = Infinity;
        candidates.forEach((c) => {
          const r = c.getBoundingClientRect();
          const centerX = r.left + r.width / 2;
          const d = Math.abs(centerX - activeCenterX);
          if (d < bestDist) {
            bestDist = d;
            best = c;
          }
        });
        if (best) {
          focusItem(best);
          const container = best.closest(".tv-row");
          if (container) {
            const rect = best.getBoundingClientRect();
            const contRect = container.getBoundingClientRect();
            if (rect.left < contRect.left || rect.right > contRect.right) {
              container.scrollBy({ left: rect.left - contRect.left - 20, behavior: "smooth" });
            }
          }
        }
      }
    }
    function initFocus() {
      const items = getFocusableItems();
      if (items.length) {
        try {
          items[0].tabIndex = 0;
          items[0].focus();
        } catch {
        }
      }
    }
    window.addEventListener("keydown", onKey);
    setTimeout(initFocus, 250);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  return /* @__PURE__ */ jsx(FocusContext.Provider, { value: {}, children: /* @__PURE__ */ jsx("div", { ref: rootRef, className: "tv-focus-root", tabIndex: 0, children }) });
}

function FocusableItem({ movie, rowIndex, colIndex, onPlay }) {
  const handleKey = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onPlay && onPlay(movie);
    }
  };
  return /* @__PURE__ */ jsxs(
    "button",
    {
      className: "tv-item",
      "data-row": rowIndex,
      "data-col": colIndex,
      onKeyDown: handleKey,
      onClick: () => onPlay && onPlay(movie),
      style: {
        width: 300,
        height: 170,
        display: "inline-block",
        marginRight: 16,
        background: "#111",
        borderRadius: 8,
        overflow: "hidden",
        textAlign: "left",
        padding: 8,
        color: "#fff"
      },
      children: [
        /* @__PURE__ */ jsx(
          "img",
          {
            src: movie.poster_url,
            alt: movie.ten_phim || movie.ten_khac,
            style: { width: "100%", height: 120, objectFit: "cover", borderRadius: 6 },
            loading: "lazy"
          }
        ),
        /* @__PURE__ */ jsx("div", { style: { marginTop: 8, fontSize: 16, fontWeight: 600 }, children: movie.ten_phim }),
        /* @__PURE__ */ jsx("div", { style: { opacity: 0.8, fontSize: 13 }, children: movie.ten_khac })
      ]
    }
  );
}
function TVRow({ movies = [], rowIndex = 0, onPlay = () => {
} }) {
  return /* @__PURE__ */ jsx("div", { className: "tv-row", role: "list", style: { whiteSpace: "nowrap", overflowX: "auto", paddingBottom: 6 }, children: movies.map((movie, idx) => /* @__PURE__ */ jsx(FocusableItem, { movie, rowIndex, colIndex: idx, onPlay }, movie.id || movie.slug || idx)) });
}

function TVLayout({ onPlay }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const data = await getHomePageData();
        if (!mounted) return;
        const curated = [
          { key: "moviehots", title: "Hot" },
          { key: "movieheros", title: "New & Updated" },
          { key: "moviephimles", title: "Movies" },
          { key: "moviephimbos", title: "Series" },
          { key: "movieanimes", title: "Anime" }
        ];
        const prepared = curated.map((c) => ({ title: c.title, movies: data[c.key] || [] })).filter((r) => r.movies && r.movies.length > 0);
        setRows(prepared);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);
  return /* @__PURE__ */ jsxs("div", { className: "tv-layout", style: { background: "#000", color: "#fff", minHeight: "100vh", padding: "24px", boxSizing: "border-box" }, children: [
    /* @__PURE__ */ jsx("header", { style: { fontSize: 36, fontWeight: 700, marginBottom: 20 }, children: "TramPhim TV" }),
    /* @__PURE__ */ jsxs("main", { children: [
      loading && /* @__PURE__ */ jsx("div", { style: { opacity: 0.8 }, children: "Loading..." }),
      error && /* @__PURE__ */ jsx("div", { style: { color: "#f33" }, children: "Failed to load content." }),
      rows.map((row, rowIndex) => /* @__PURE__ */ jsxs("section", { "aria-label": row.title, style: { marginBottom: 28 }, children: [
        /* @__PURE__ */ jsx("h2", { style: { fontSize: 22, marginBottom: 12 }, children: row.title }),
        /* @__PURE__ */ jsx(
          TVRow,
          {
            rowIndex,
            movies: row.movies,
            onPlay: (movie) => {
              const src = movie?.stream_url || movie?.video_url || movie?.file || "";
              onPlay && onPlay({ src, poster: movie.poster_url, title: movie.ten_phim || movie.ten_khac, id: movie.id || movie.slug });
            }
          }
        )
      ] }, row.title))
    ] })
  ] });
}

function Player({ src = "", poster = "", title = "", id = "", onClose = () => {
} }) {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const [isBuffering, setIsBuffering] = useState(false);
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;
    try {
      const resumeKey = `resume:${id || src}`;
      const resumePos = parseFloat(localStorage.getItem(resumeKey) || "0");
      if (resumePos > 2) video.currentTime = resumePos;
    } catch (err) {
    }
    if (Hls.isSupported() && src) {
      const hls = new Hls({ maxBufferLength: 30 });
      hlsRef.current = hls;
      hls.attachMedia(video);
      hls.on(Hls.Events.MEDIA_ATTACHED, () => {
        hls.loadSource(src);
      });
      hls.on(Hls.Events.ERROR, (event, data) => {
        console.warn("HLS error", data);
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
    } else {
      video.src = src;
    }
    const onWaiting = () => setIsBuffering(true);
    const onPlaying = () => setIsBuffering(false);
    video.addEventListener("waiting", onWaiting);
    video.addEventListener("playing", onPlaying);
    const saveInterval = setInterval(() => {
      try {
        const resumeKey = `resume:${id || src}`;
        localStorage.setItem(resumeKey, String(video.currentTime || 0));
      } catch (err) {
      }
    }, 2e3);
    if ("mediaSession" in navigator) {
      navigator.mediaSession.metadata = new window.MediaMetadata({
        title: title || "TramPhim",
        artist: "TramPhim",
        artwork: poster ? [{ src: poster, sizes: "512x512", type: "image/png" }] : []
      });
      navigator.mediaSession.setActionHandler("play", () => video.play().catch(() => {
      }));
      navigator.mediaSession.setActionHandler("pause", () => video.pause());
      navigator.mediaSession.setActionHandler("seekbackward", (ev) => {
        video.currentTime = Math.max(0, video.currentTime - (ev.seekOffset || 10));
      });
      navigator.mediaSession.setActionHandler("seekforward", (ev) => {
        video.currentTime = Math.min(video.duration || Infinity, video.currentTime + (ev.seekOffset || 10));
      });
      navigator.mediaSession.setActionHandler("stop", () => {
        video.pause();
        video.currentTime = 0;
      });
    }
    return () => {
      clearInterval(saveInterval);
      video.removeEventListener("waiting", onWaiting);
      video.removeEventListener("playing", onPlaying);
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [src, id, title, poster]);
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: "tv-player-overlay",
      style: {
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.85)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999
      },
      children: /* @__PURE__ */ jsxs("div", { style: { width: "80%", maxWidth: 1280, position: "relative" }, children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => {
              try {
                videoRef.current.pause();
              } catch {
              }
              onClose();
            },
            style: { position: "absolute", right: 8, top: 8, zIndex: 10, fontSize: 18, padding: "8px 12px" },
            children: "Close"
          }
        ),
        /* @__PURE__ */ jsx(
          "video",
          {
            ref: videoRef,
            controls: true,
            poster,
            style: { width: "100%", background: "#000", borderRadius: 8 }
          }
        ),
        isBuffering && /* @__PURE__ */ jsx("div", { style: { position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", color: "#fff" }, children: "Buffering..." })
      ] })
    }
  );
}

function App() {
  const [playerProps, setPlayerProps] = useState(null);
  return /* @__PURE__ */ jsxs(FocusProvider, { children: [
    /* @__PURE__ */ jsx(TVLayout, { onPlay: (props) => setPlayerProps(props) }),
    playerProps && /* @__PURE__ */ jsx(
      Player,
      {
        src: playerProps.src,
        poster: playerProps.poster,
        title: playerProps.title,
        id: playerProps.id,
        onClose: () => setPlayerProps(null)
      },
      playerProps.id || playerProps.src
    )
  ] });
}

const $$Tv = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {}, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="tv-root"> ${renderComponent($$result2, "App", App, { "client:load": true, "client:component-hydration": "load", "client:component-path": "E:/tramphim/tramphim-frontend/src/tv/App.jsx", "client:component-export": "default" })} </div> ` })}`;
}, "E:/tramphim/tramphim-frontend/src/pages/tv.astro", void 0);

const $$file = "E:/tramphim/tramphim-frontend/src/pages/tv.astro";
const $$url = "/tv";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Tv,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
