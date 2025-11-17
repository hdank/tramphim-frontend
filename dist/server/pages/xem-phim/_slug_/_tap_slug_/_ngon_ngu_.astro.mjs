/* empty css                                           */
import { e as createComponent, f as createAstro, r as renderTemplate, u as unescapeHTML, h as addAttribute, l as renderComponent, n as Fragment$1, m as maybeRenderHead } from '../../../../chunks/astro/server_BuMcwEkM.mjs';
import 'kleur/colors';
import { $ as $$Layout, H as Header, F as Footer } from '../../../../chunks/index_eDR0il5k.mjs';
import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { useRef, useState, useEffect, useCallback } from 'react';
import Artplayer from 'artplayer';
import Hls from 'hls.js';
import { E as Episodes, F as FacebookComments } from '../../../../chunks/FacebookComments_C5Z5DPDx.mjs';
import { T as TopMovies } from '../../../../chunks/TopMovies_Dnd2_qIw.mjs';
import { r as rutGonTinhTrangNgonNgu, a as rutGonTinhTrangPhim, b as capitalizeWords, c as cleanhtml, g as getDisplayEpisodeNumber } from '../../../../chunks/movieUtils_BzNI1rrt.mjs';
import 'clsx';
export { renderers } from '../../../../renderers.mjs';

const DB_NAME = "VideoProgressDB";
const DB_VERSION = 1;
const STORE_NAME = "videoProgress";
const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
        store.createIndex("lastUpdated", "lastUpdated", { unique: false });
      }
    };
  });
};
const saveProgressToDB = async (progressData) => {
  try {
    const db = await initDB();
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    await new Promise((resolve, reject) => {
      const request = store.put(progressData);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
    db.close();
  } catch (error) {
    console.error("Error saving progress to IndexedDB:", error);
  }
};
const getProgressFromDB = async (progressKey) => {
  try {
    const db = await initDB();
    const transaction = db.transaction([STORE_NAME], "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const result = await new Promise((resolve, reject) => {
      const request = store.get(progressKey);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    db.close();
    return result || null;
  } catch (error) {
    console.error("Error getting progress from IndexedDB:", error);
    return null;
  }
};
const cleanupOldProgress = async () => {
  try {
    const db = await initDB();
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const index = store.index("lastUpdated");
    const twoDaysAgo = /* @__PURE__ */ new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    const request = index.openCursor(
      IDBKeyRange.upperBound(twoDaysAgo.toISOString())
    );
    request.onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        cursor.delete();
        cursor.continue();
      }
    };
    db.close();
  } catch (error) {
    console.error("Error cleaning up old progress:", error);
  }
};
const processVideoUrl = async (originalLink, skipAdApiEndpoint) => {
  if (!originalLink || !skipAdApiEndpoint)
    return { url: originalLink, success: false };
  try {
    const url = new URL(skipAdApiEndpoint);
    url.searchParams.append("url", originalLink);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8e3);
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (!response.ok) {
      return { url: originalLink, success: false };
    }
    const playlistData = await response.text();
    if (playlistData.includes("#EXTM3U")) {
      const blob = new Blob([playlistData], {
        type: "application/vnd.apple.mpegurl"
      });
      const blobUrl = URL.createObjectURL(blob);
      return { url: blobUrl, success: true };
    } else {
      return { url: originalLink, success: false };
    }
  } catch (error) {
    return { url: originalLink, success: false };
  }
};
const VideoPlayer = ({
  originalUrl,
  skipAdApiUrl,
  banner,
  poster,
  slug,
  ngonngu,
  sotap,
  ten_phim,
  vietsubEpisodes = [],
  thuyetminhEpisodes = [],
  skipTimes = {
    intro: {
      end: 60
    },
    recap: null
  },
  activeServer
}) => {
  const containerRef = useRef(null);
  const artRef = useRef(null);
  const hlsRef = useRef(null);
  const hasNavigated = useRef(false);
  const [videoSource, setVideoSource] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [playerInitialized, setPlayerInitialized] = useState(false);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState("00:00");
  const [videoDuration, setVideoDuration] = useState("00:00");
  const [showSkipIntro, setShowSkipIntro] = useState(false);
  const [isIntroTime, setIsIntroTime] = useState(false);
  const [autoSkipIntro, setAutoSkipIntro] = useState(false);
  const [isIframe, setIsIframe] = useState(false);
  const hasSkippedIntro = useRef(false);
  const [showResumePopup, setShowResumePopup] = useState(false);
  const [resumeTimeState, setResumeTimeState] = useState(0);
  useEffect(() => {
    const storedValue = localStorage.getItem("autoSkipIntro");
    if (storedValue !== null) {
      setAutoSkipIntro(storedValue === "true");
    }
  }, []);
  const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds < 0) return "00:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };
  const getProgressKey = useCallback(() => {
    return `video_progress_${slug}_${sotap}_${ngonngu}`;
  }, [slug, sotap, ngonngu]);
  const getProgressFromIndexedDB = useCallback(async () => {
    if (isIframe) return null;
    try {
      const progressKey = getProgressKey();
      const savedData = await getProgressFromDB(progressKey);
      if (savedData) {
        return {
          progress: savedData.progress || 0,
          duration: savedData.duration || null,
          lastUpdated: savedData.lastUpdated || null
        };
      }
      return null;
    } catch (error2) {
      console.error("Lỗi khi lấy progress từ IndexedDB:", error2);
      return null;
    }
  }, [getProgressKey, isIframe]);
  const saveProgressToIndexedDB = useCallback(
    async (progress, duration) => {
      if (isIframe) return;
      try {
        const progressKey = getProgressKey();
        const dataToSave = {
          id: progressKey,
          progress,
          duration,
          lastUpdated: (/* @__PURE__ */ new Date()).toISOString(),
          slug,
          sotap,
          ngonngu,
          poster,
          banner,
          ten_phim
        };
        await saveProgressToDB(dataToSave);
        if (Math.random() < 0.1) {
          cleanupOldProgress();
        }
      } catch (error2) {
        console.error("Không thể lưu progress:", error2);
      }
    },
    [getProgressKey, slug, sotap, ngonngu, poster, ten_phim, banner, isIframe]
  );
  const findNextEpisodeUrl = useCallback(() => {
    const currentEpisodeSlug = sotap;
    const currentEpisodeType = ngonngu;
    const episodesList = currentEpisodeType === "vietsub" ? vietsubEpisodes : thuyetminhEpisodes;
    const getEpisodeNumber = (ep) => {
      const epNumStr = (ep.tap_phim?.so_tap || ep.so_tap || "").toString();
      const match = epNumStr.match(/\d+/);
      return match ? parseInt(match[0], 10) : 0;
    };
    const filteredAndSortedList = episodesList.filter((ep) => {
      const epNum = (ep.tap_phim?.so_tap || ep.so_tap || "").toString().toLowerCase();
      return !["full", "fullhd", "hd", ""].includes(epNum);
    }).sort((a, b) => getEpisodeNumber(a) - getEpisodeNumber(b));
    console.log(
      "DEBUG [Next Episode]: Current Slug (sotap):",
      currentEpisodeSlug
    );
    console.log(
      "DEBUG [Next Episode]: Filtered & Sorted Count:",
      filteredAndSortedList.length
    );
    const currentIndex = filteredAndSortedList.findIndex((ep) => {
      const apiSlug = (ep.tap_phim?.slug || ep.slug)?.toString();
      return apiSlug === currentEpisodeSlug;
    });
    if (currentIndex === -1) {
      return null;
    }
    if (currentIndex === filteredAndSortedList.length - 1) {
      return null;
    }
    const nextEpisode = filteredAndSortedList[currentIndex + 1];
    const nextSoTap = nextEpisode.tap_phim?.slug;
    if (nextSoTap) {
      const nextUrl = `/xem-phim/${slug}/${nextSoTap}/${currentEpisodeType}`;
      return nextUrl;
    }
    return null;
  }, [sotap, ngonngu, vietsubEpisodes, thuyetminhEpisodes, slug]);
  const handleSkipIntro = () => {
    const art = artRef.current;
    if (art && skipTimes.intro && skipTimes.intro.end) {
      art.seek = skipTimes.intro.end;
      setShowSkipIntro(false);
    }
  };
  useEffect(() => {
    let isMounted = true;
    let createdBlobUrl = null;
    const setupVideo = async () => {
      if (!originalUrl) {
        setError("Không tìm thấy nguồn video.");
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      setError(null);
      if (originalUrl.endsWith(".m3u8")) {
        setIsIframe(false);
        const result = await processVideoUrl(originalUrl, skipAdApiUrl);
        if (isMounted) {
          if (result.success) {
            createdBlobUrl = result.url;
          }
          setVideoSource(result.url);
          setIsLoading(false);
        }
      } else {
        setIsIframe(true);
        setVideoSource(originalUrl);
        setIsLoading(false);
      }
    };
    setupVideo();
    return () => {
      isMounted = false;
      if (createdBlobUrl) {
        URL.revokeObjectURL(createdBlobUrl);
      }
    };
  }, [originalUrl, skipAdApiUrl]);
  const handleTouchAction = useCallback((e) => {
    const art = artRef.current;
    if (!art || !art.template || !art.template.$video) return;
    const container = art.template.$video;
    const currentTime2 = (/* @__PURE__ */ new Date()).getTime();
    const seekTime = 5;
    if (!art._lastTap) art._lastTap = 0;
    const tapLength = currentTime2 - art._lastTap;
    const rect = container.getBoundingClientRect();
    const x = e.changedTouches[0].clientX - rect.left;
    const isLeftArea = x < rect.width * 0.4;
    const isRightArea = x > rect.width * 0.6;
    const isCenterArea = x >= rect.width * 0.4 && x <= rect.width * 0.6;
    if (isCenterArea) {
      if (tapLength > 300) {
        if (art.playing) {
          art.pause();
        } else {
          art.play();
        }
      }
    } else if (tapLength < 300 && tapLength > 0) {
      e.preventDefault();
      if (isLeftArea) {
        art.seek = Math.max(0, art.currentTime - seekTime);
      } else if (isRightArea) {
        art.seek = Math.min(art.duration, art.currentTime + seekTime);
      }
      if (art.paused) {
        art.play();
      }
    }
    art._lastTap = currentTime2;
  }, []);
  useEffect(() => {
    if (isIframe || !videoSource || !containerRef.current || isLoading) {
      return;
    }
    if (artRef.current) {
      if (artRef.current.template && artRef.current.template.$video) {
        artRef.current.template.$video.removeEventListener(
          "touchend",
          handleTouchAction
        );
      }
      artRef.current.destroy();
      artRef.current = null;
    }
    const art = new Artplayer({
      container: containerRef.current,
      url: videoSource,
      type: "m3u8",
      isLive: false,
      autoplay: false,
      pip: false,
      loop: false,
      flip: false,
      playbackRate: false,
      aspectRatio: false,
      fullscreen: false,
      mutex: true,
      backdrop: true,
      playsInline: true,
      airplay: true,
      notice: true,
      theme: "#a2b2ff",
      lang: "vi-VN",
      moreVideoAttr: {
        crossOrigin: "anonymous"
      },
      icons: {
        loading: `
          <svg class="h-10 w-10 lg:h-20 lg:w-20 text-[#a2b2ff]" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2A10 10 0 1 0 22 12A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8A8 8 0 0 1 12 20Z" opacity="0.5"/><path fill="currentColor" d="M20 12h2A10 10 0 0 0 12 2V4A8 8 0 0 1 20 12Z"><animateTransform attributeName="transform" dur="1s" from="0 12 12" repeatCount="indefinite" to="360 12 12" type="rotate"/></path></svg>
        `,
        state: `
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1408 1600"
            class="h-12 w-12 lg:h-16 lg:w-16"
          >
            <path
              fill="currentColor"
              d="M1384 831L56 1569q-23 13-39.5 3T0 1536V64q0-26 16.5-36T56 31l1328 738q23 13 23 31t-23 31"
            />
          </svg>
        `
      },
      customType: {
        m3u8: function(video, url) {
          if (Hls.isSupported()) {
            const hls = new Hls();
            hlsRef.current = hls;
            hls.loadSource(url);
            hls.attachMedia(video);
            hls.on(Hls.Events.ERROR, (event, data) => {
              if (data.fatal) {
                if (videoSource !== originalUrl) {
                  setVideoSource(originalUrl);
                } else {
                  setError("Không thể tải video. Vui lòng thử server khác.");
                }
              }
            });
          } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = url;
          } else {
            setError("Trình duyệt không hỗ trợ phát video này.");
          }
        }
      },
      controls: [
        {
          html: `<button aria-label="Play/Pause" class="art-icon art-icon-playpause text-white hover:text-[#ffd785] !w-8 !h-8 lg:!w-10 lg:!h-10 ">
          <svg class="pause w-full h-full" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="m10 16c.55 0 1-.45 1-1v-6c0-.55-.45-1-1-1s-1 .45-1 1v6c0 .55.45 1 1 1zm2-14c-5.52 0-10 4.48-10 10s4.48 10 10 10 10-4.48 10-10-4.48-10-10-10zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm2-4c.55 0 1-.45 1-1v-6c0-.55-.45-1-1-1s-1 .45-1 1v6c0 .55.45 1 1 1z" fill="currentColor"></path>
          </svg>
          <svg class="play hidden w-full h-full" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="m10.8 15.9 4.67-3.5c.27-.2.27-.6 0-.8l-4.67-3.5c-.33-.25-.8-.01-.8.4v7c0 .41.47.65.8.4zm1.2-13.9c-5.52 0-10 4.48-10 10s4.48 10 10 10 10-4.48 10-10-4.48-10-10-10zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="currentColor"></path>
          </svg>
        </button>`,
          position: "left",
          mounted: function($control) {
            const art2 = this;
            const playBtn = $control.querySelector(".play");
            const pauseBtn = $control.querySelector(".pause");
            $control.addEventListener("click", () => {
              art2.toggle();
            });
            art2.on("play", () => {
              playBtn.classList.add("hidden");
              pauseBtn.classList.remove("hidden");
            });
            art2.on("pause", () => {
              playBtn.classList.remove("hidden");
              pauseBtn.classList.add("hidden");
            });
          },
          tooltip: "Phát/Tạm dừng"
        },
        {
          position: "left",
          html: `<button aria-label="Lùi 10 giây" class="art-icon art-icon-backward art-mobile-hide text-white hover:text-[#ffd785]" >
                  <svg class="w-6 h-6 xmlns="http://www.w3.org/2000/svg" viewBox="0 0 56 56"><path fill="currentColor" d="M28 54.402c13.055 0 23.906-10.828 23.906-23.906c0-11.531-8.437-21.305-19.383-23.46v-3.33c0-1.664-1.148-2.11-2.437-1.195l-7.477 5.226c-1.054.75-1.078 1.875 0 2.649l7.453 5.25c1.313.937 2.461.492 2.461-1.196v-3.35c8.86 2.015 15.375 9.914 15.375 19.406A19.84 19.84 0 0 1 28 50.418c-11.063 0-19.945-8.86-19.922-19.922c.023-6.656 3.258-12.539 8.25-16.101c.961-.727 1.266-1.829.656-2.813c-.562-.96-1.851-1.219-2.883-.422C8.055 15.543 4.094 22.621 4.094 30.496c0 13.078 10.828 23.906 23.906 23.906m5.648-14.039c3.891 0 6.446-3.68 6.446-9.304c0-5.672-2.555-9.399-6.446-9.399s-6.445 3.727-6.445 9.399c0 5.625 2.555 9.304 6.445 9.304m-12.21-.281c.913 0 1.5-.633 1.5-1.617V23.723c0-1.149-.61-1.875-1.665-1.875c-.633 0-1.078.21-1.922.773l-3.257 2.18c-.516.375-.774.797-.774 1.36c0 .773.61 1.429 1.36 1.429c.445 0 .656-.094 1.125-.422l2.18-1.594v12.89c0 .962.585 1.618 1.452 1.618m12.21-2.555c-2.062 0-3.398-2.46-3.398-6.468c0-4.079 1.312-6.563 3.398-6.563c2.11 0 3.375 2.461 3.375 6.563c0 4.007-1.289 6.468-3.375 6.468"/></svg>
                  </button>`,
          mounted: function($control) {
            const art2 = this;
            $control.addEventListener("click", () => {
              art2.seek = Math.max(0, art2.currentTime - 10);
            });
          },
          tooltip: "Lùi 10s"
        },
        {
          position: "left",
          html: `<button aria-label="Tiến 10 giây" class="art-icon art-icon-forward art-mobile-hide text-white hover:text-[#ffd785]" >
                    <svg class="w-6 h-6"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 56 56"><path fill="currentColor" d="M28 54.402c13.055 0 23.906-10.828 23.906-23.906c0-7.875-3.984-14.953-10.008-19.336c-1.03-.797-2.32-.539-2.906.422c-.586.984-.281 2.086.656 2.813c4.993 3.562 8.25 9.445 8.274 16.101C47.945 41.56 39.039 50.418 28 50.418c-11.063 0-19.899-8.86-19.899-19.922c0-9.492 6.516-17.39 15.376-19.406v3.375c0 1.664 1.148 2.11 2.413 1.195l7.5-5.25c1.055-.726 1.079-1.851 0-2.625l-7.476-5.25c-1.29-.937-2.437-.492-2.437 1.196v3.304C12.507 9.168 4.094 18.965 4.094 30.496c0 13.078 10.828 23.906 23.906 23.906m5.672-14.039c3.89 0 6.422-3.68 6.422-9.304c0-5.672-2.532-9.399-6.422-9.399s-6.445 3.727-6.445 9.399c0 5.625 2.554 9.304 6.445 9.304m-12.235-.281c.914 0 1.524-.633 1.524-1.617V23.723c0-1.149-.633-1.875-1.688-1.875c-.633 0-1.054.21-1.922.773l-3.234 2.18c-.539.375-.773.797-.773 1.36c0 .773.609 1.429 1.359 1.429c.422 0 .656-.094 1.125-.422l2.18-1.594v12.89c0 .962.562 1.618 1.43 1.618m12.235-2.555c-2.086 0-3.399-2.46-3.399-6.468c0-4.079 1.29-6.563 3.399-6.563c2.086 0 3.351 2.461 3.351 6.563c0 4.007-1.289 6.468-3.351 6.468"/></svg>
                  </button>`,
          mounted: function($control) {
            const art2 = this;
            $control.addEventListener("click", () => {
              art2.seek = Math.min(art2.duration, art2.currentTime + 10);
            });
          },
          tooltip: "Tiến 10s"
        },
        {
          position: "right",
          html: `<button aria-label="Tập kế tiếp" class="art-icon art-icon-next-episode text-white hover:text-[#ffd785]" >
                 <svg class="lg:w-6 lg:h-6 h-5 w-5" height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
           <path fill="currentColor" d="m4.028 20.882a1 1 0 0 0 1.027-.05l12-8a1 1 0 0 0 0-1.664l-12-8a1 1 0 0 0 -1.555.832v16a1 1 0 0 0 .528.882zm1.472-15.013 9.2 6.131-9.2 6.131z"></path>
           <path fill="currentColor" d="m19.5 19a1 1 0 0 0 1-1v-12a1 1 0 0 0 -2 0v12a1 1 0 0 0 1 1z"></path>
          </svg>
          
                  </button>`,
          mounted: function($control) {
            const nextUrl = findNextEpisodeUrl();
            if (!nextUrl) {
              $control.style.opacity = "0.5";
              $control.style.pointerEvents = "none";
              $control.title = "Đã hết tập";
            } else {
              $control.style.opacity = "1";
              $control.style.pointerEvents = "auto";
              $control.title = "Tập kế tiếp";
              $control.addEventListener("click", () => {
                window.location.href = nextUrl;
              });
            }
          },
          tooltip: `Tập kế tiếp`
        },
        {
          position: "right",
          html: `<button aria-label="Hình trong hình" class="art-icon art-icon-pip text-white hover:text-[#ffd785]">
                    <svg class="lg:w-6 lg:h-6 h-5 w-5" viewBox="0 0 98 98" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4.08334 14.1667C4.08334 10.853 6.76964 8.16675 10.0833 8.16675H75.6667C78.9804 8.16675 81.6667 10.853 81.6667 14.1667V35.6251C81.6667 37.374 80.2489 38.7917 78.5 38.7918V38.7918V38.7918C76.8432 38.7918 75.5 37.4486 75.5 35.7918V26.5V20.5C75.5 17.1863 72.8137 14.5 69.5 14.5L17 14.5C13.6863 14.5 11 17.1863 11 20.5V56.5C11 59.8137 13.6863 62.5 17 62.5L21 62.5C22.933 62.5 24.5 64.067 24.5 66V66V66C24.5 67.887 22.9703 69.4167 21.0833 69.4167H10.0833C6.76963 69.4167 4.08334 66.7305 4.08334 63.4167V14.1667Z" fill="currentColor"></path>
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M36.75 53.0833C36.75 50.8282 38.5782 49 40.8333 49H89.8333C92.0885 49 93.9167 50.8282 93.9167 53.0833V85.75C93.9167 88.0052 92.0885 89.8333 89.8333 89.8333H40.8333C38.5782 89.8333 36.75 88.0052 36.75 85.75V53.0833ZM49 57.1667C46.7448 57.1667 44.9167 58.9948 44.9167 61.25V77.5833C44.9167 79.8385 46.7448 81.6667 49 81.6667H81.6667C83.9218 81.6667 85.75 79.8385 85.75 77.5833V61.25C85.75 58.9948 83.9218 57.1667 81.6667 57.1667H49Z" fill="currentColor"></path>
                            <path d="M40.8333 53.0833H89.8333V85.75H40.8333V53.0833Z" fill="currentColor">
                            </path>
                          </svg>
                   </button>`,
          mounted: function($control) {
            const art2 = this;
            $control.addEventListener("click", () => {
              if (document.pictureInPictureElement) {
                document.exitPictureInPicture();
              } else {
                art2.play();
                art2.video.requestPictureInPicture();
              }
            });
          },
          tooltip: "Hình trong hình (PIP)"
        },
        {
          position: "left",
          html: `
                <div class="art-volume-control">
                
                 <button aria-label="Âm lượng" class="art-icon art-icon-volume text-white hover:text-[#ffd785]" style="margin: 10px 5px; flex-shrink: 0;">
                   <svg class="volumn-high lg:w-6 lg:h-6 !w-5 !h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                    <path fill="currentColor" d="M215.03 71.05L126.06 160H24c-13.26 0-24 10.74-24 24v144c0 13.25 10.74 24 24 24h102.06l88.97 88.95c15.03 15.03 40.97 4.47 40.97-16.97V88.02c0-21.46-25.96-31.98-40.97-16.97m233.32-51.08c-11.17-7.33-26.18-4.24-33.51 6.95c-7.34 11.17-4.22 26.18 6.95 33.51c66.27 43.49 105.82 116.6 105.82 195.58S488.06 408.1 421.79 451.59c-11.17 7.32-14.29 22.34-6.95 33.5c7.04 10.71 21.93 14.56 33.51 6.95C528.27 439.58 576 351.33 576 256S528.27 72.43 448.35 19.97M480 256c0-63.53-32.06-121.94-85.77-156.24c-11.19-7.14-26.03-3.82-33.12 7.46s-3.78 26.21 7.41 33.36C408.27 165.97 432 209.11 432 256s-23.73 90.03-63.48 115.42c-11.19 7.14-14.5 22.07-7.41 33.36c6.51 10.36 21.12 15.14 33.12 7.46C447.94 377.94 480 319.54 480 256m-141.77-76.87c-11.58-6.33-26.19-2.16-32.61 9.45c-6.39 11.61-2.16 26.2 9.45 32.61C327.98 228.28 336 241.63 336 256c0 14.38-8.02 27.72-20.92 34.81c-11.61 6.41-15.84 21-9.45 32.61c6.43 11.66 21.05 15.8 32.61 9.45c28.23-15.55 45.77-45 45.77-76.88s-17.54-61.32-45.78-76.86" />
                   </svg>
                   <svg class="volumn-mute hidden w-7 h-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" stroke="#fff" stroke-linecap="round" stroke-miterlimit="10" stroke-width="32" d="M416 432L64 80"/><path fill="currentColor" d="M243.33 98.86a23.89 23.89 0 0 0-25.55 1.82l-.66.51l-28.52 23.35a8 8 0 0 0-.59 11.85l54.33 54.33a8 8 0 0 0 13.66-5.66v-64.49a24.51 24.51 0 0 0-12.67-21.71m8 236.43L96.69 180.69A16 16 0 0 0 85.38 176H56a24 24 0 0 0-24 24v112a24 24 0 0 0 24 24h69.76l92 75.31a23.9 23.9 0 0 0 25.87 1.69A24.51 24.51 0 0 0 256 391.45v-44.86a16 16 0 0 0-4.67-11.3M352 256c0-24.56-5.81-47.87-17.75-71.27a16 16 0 1 0-28.5 14.55C315.34 218.06 320 236.62 320 256q0 4-.31 8.13a8 8 0 0 0 2.32 6.25l14.36 14.36a8 8 0 0 0 13.55-4.31A146 146 0 0 0 352 256m64 0c0-51.18-13.08-83.89-34.18-120.06a16 16 0 0 0-27.64 16.12C373.07 184.44 384 211.83 384 256c0 23.83-3.29 42.88-9.37 60.65a8 8 0 0 0 1.9 8.26L389 337.4a8 8 0 0 0 13.13-2.79C411 311.76 416 287.26 416 256"/><path fill="currentColor" d="M480 256c0-74.25-20.19-121.11-50.51-168.61a16 16 0 1 0-27 17.22C429.82 147.38 448 189.5 448 256c0 46.19-8.43 80.27-22.43 110.53a8 8 0 0 0 1.59 9l11.92 11.92a8 8 0 0 0 12.92-2.16C471.6 344.9 480 305 480 256"/></svg>
                 </button>
                 <div class="art-custom-volume-control art-mobile-hide" style="display: flex; align-items: center; transition: none; opacity: 1;">
                  <input type="range" class="art-volume-range" min="0" max="1" step="0.01" value="1" >
                 </div>
                </div>
                `,
          mounted: function($control) {
            const art2 = this;
            const volumeBtn = $control.querySelector(".art-icon-volume");
            const volumeRangeContainer = $control.querySelector(
              ".art-custom-volume-control"
            );
            const volumeRange = $control.querySelector(".art-volume-range");
            const volumeHighSvg = $control.querySelector(".volumn-high");
            const volumeMuteSvg = $control.querySelector(".volumn-mute");
            let lastVolume = 1;
            volumeRange.style.setProperty("--val", `${art2.volume * 100}%`);
            const isMobile = window.innerWidth <= 768;
            if (isMobile) {
              volumeRangeContainer.style.display = "none";
            }
            volumeBtn.addEventListener("click", (e) => {
              e.stopPropagation();
              const isMobileCheck = window.innerWidth <= 768;
              if (isMobileCheck) {
                const isHidden = volumeRangeContainer.style.display === "none";
                volumeRangeContainer.style.display = isHidden ? "flex" : "none";
              } else {
                if (art2.volume > 0) {
                  lastVolume = art2.volume;
                  art2.volume = 0;
                  volumeRange.value = 0;
                  volumeRange.style.setProperty("--val", "0%");
                } else {
                  art2.volume = lastVolume;
                  volumeRange.value = lastVolume;
                  volumeRange.style.setProperty(
                    "--val",
                    `${lastVolume * 100}%`
                  );
                }
              }
            });
            volumeRange.addEventListener("input", (e) => {
              art2.volume = e.target.value;
              e.target.style.setProperty("--val", `${e.target.value * 100}%`);
            });
            art2.on("volumechange", () => {
              volumeRange.value = art2.volume;
              volumeRange.style.setProperty("--val", `${art2.volume * 100}%`);
              if (art2.volume === 0 || art2.muted) {
                volumeHighSvg.classList.add("hidden");
                volumeMuteSvg.classList.remove("hidden");
              } else {
                volumeHighSvg.classList.remove("hidden");
                volumeMuteSvg.classList.add("hidden");
              }
            });
            if (art2.volume === 0) {
              volumeHighSvg.classList.add("hidden");
              volumeMuteSvg.classList.remove("hidden");
            } else {
              volumeHighSvg.classList.remove("hidden");
              volumeMuteSvg.classList.add("hidden");
            }
            volumeRange.value = art2.volume;
          },
          tooltip: "Âm lượng"
        },
        {
          position: "right",
          html: `<button aria-label="Toàn màn hình" class="art-icon art-icon-fullscreen text-white hover:text-[#ffd785]">
          <svg class="lg:w-6 lg:h-6 h-5 w-5 " viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18.73 55C21.3421 55 23.4601 53.1121 23.4601 50.5L23.4601 27.4601L48 27.4601C50.6121 27.4601 53 25.3421 53 22.7301C53 20.118 50.6121 18 48 18L18.73 18C16.118 18 14 20.118 14 22.73L14 50.5C14 53.1121 16.118 55 18.73 55Z" fill="currentColor"></path>
            <path d="M53.9997 105.27C53.9997 102.658 51.6118 100.54 48.9997 100.54L23.4601 100.54L23.4601 78C23.4601 75.3879 21.3421 73 18.73 73C16.118 73 14 75.3879 14 78L14 105.27C14 107.882 16.118 110 18.73 110L48.9997 110C51.6118 110 53.9997 107.882 53.9997 105.27Z" fill="currentColor"></path>
            <path d="M74 22.73C74 25.3421 76.3879 27.4601 79 27.4601L104.54 27.46L104.54 50C104.54 52.6121 106.658 55 109.27 55C111.882 55 114 52.6121 114 50L114 22.73C114 20.118 111.882 18 109.27 18L79 18C76.3879 18 74 20.118 74 22.73Z" fill="currentColor"></path>
            <path d="M109.27 72C106.658 72 104.54 74.3879 104.54 77V100.54L80 100.54C77.3879 100.54 75 102.658 75 105.27C75 107.882 77.3879 110 80 110L109.27 110C111.882 110 114 107.882 114 105.27V77C114 74.3879 111.882 72 109.27 72Z" fill="currentColor"></path>
          </svg>
           </button>`,
          mounted: function($control) {
            const art2 = this;
            const fullscreenIn = $control.querySelector(".fullscreen-in");
            const fullscreenOut = $control.querySelector(".fullscreen-out");
            $control.addEventListener("click", () => {
              art2.fullscreen = !art2.fullscreen;
            });
            art2.on("fullscreen", (state) => {
              if (state) {
                if (fullscreenIn) fullscreenIn.classList.add("hidden");
                if (fullscreenOut) fullscreenOut.classList.remove("hidden");
              } else {
                if (fullscreenIn) fullscreenIn.classList.remove("hidden");
                if (fullscreenOut) fullscreenOut.classList.add("hidden");
              }
            });
          },
          tooltip: "Toàn màn hình"
        }
      ]
    });
    artRef.current = art;
    art.on("ready", async () => {
      const progressData = await getProgressFromIndexedDB();
      if (progressData && progressData.progress > 0) {
        setShowResumePopup(true);
        setResumeTimeState(progressData.progress);
        art.seek = progressData.progress;
      } else {
        art.play();
      }
      if (art.duration) {
        setVideoDuration(formatTime(art.duration));
      }
      if (art.template && art.template.$video) {
        art.template.$video.addEventListener("touchend", handleTouchAction);
      }
    });
    art.on("video:timeupdate", () => {
      const currentTimeInSeconds = art.currentTime;
      const durationInSeconds = art.duration;
      if (durationInSeconds > 0) {
        setCurrentTime(formatTime(currentTimeInSeconds));
        setVideoDuration(formatTime(durationInSeconds));
      }
      if (skipTimes.intro && skipTimes.intro.end) {
        if (currentTimeInSeconds <= skipTimes.intro.end) {
          setShowSkipIntro(true);
          setIsIntroTime(true);
          if (autoSkipIntro && currentTimeInSeconds > 1 && !hasSkippedIntro.current) {
            art.seek = skipTimes.intro.end;
            setShowSkipIntro(false);
            hasSkippedIntro.current = true;
          }
        } else {
          setShowSkipIntro(false);
          setIsIntroTime(false);
        }
      }
      const nextUrl = findNextEpisodeUrl();
      if (nextUrl) {
        const remainingTime = durationInSeconds - currentTimeInSeconds;
        if (remainingTime > 0 && remainingTime <= 60 && !hasNavigated.current) {
          hasNavigated.current = true;
          let countdown = 5;
          const intervalId = setInterval(() => {
            if (countdown > 0) {
              art.notice.show = `Chuyển tập sau ${countdown} giây...`;
              countdown--;
            } else {
              clearInterval(intervalId);
              if (artRef.current) {
                artRef.current.destroy();
              }
              window.location.href = nextUrl;
            }
          }, 1e3);
        }
      }
    });
    art.on("play", () => {
      let progressSaveInterval = setInterval(async () => {
        if (art && art.duration && art.currentTime > 0) {
          await saveProgressToIndexedDB(art.currentTime, art.duration);
        }
      }, 3e4);
      artRef.current.progressSaveInterval = progressSaveInterval;
    });
    art.on("pause", async () => {
      if (artRef.current.progressSaveInterval) {
        clearInterval(artRef.current.progressSaveInterval);
      }
      if (art && art.duration && art.currentTime > 0) {
        await saveProgressToIndexedDB(art.currentTime, art.duration);
      }
    });
    art.on("ended", async () => {
      if (artRef.current.progressSaveInterval) {
        clearInterval(artRef.current.progressSaveInterval);
      }
      if (art && art.duration) {
        await saveProgressToDB(art.duration, art.duration);
      }
    });
    const handleUnload = async () => {
      if (artRef.current && artRef.current.duration && artRef.current.currentTime > 0) {
        await saveProgressToIndexedDB(
          artRef.current.currentTime,
          artRef.current.duration
        );
      }
    };
    window.addEventListener("beforeunload", handleUnload);
    window.addEventListener("pagehide", handleUnload);
    return () => {
      handleUnload();
      window.removeEventListener("beforeunload", handleUnload);
      window.removeEventListener("pagehide", handleUnload);
      hasNavigated.current = false;
      if (artRef.current && artRef.current.progressSaveInterval) {
        clearInterval(artRef.current.progressSaveInterval);
      }
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      if (artRef.current) {
        if (artRef.current.template && artRef.current.template.$video) {
          artRef.current.template.$video.removeEventListener(
            "touchend",
            handleTouchAction
          );
        }
        artRef.current.destroy();
        artRef.current = null;
      }
    };
  }, [
    videoSource,
    isLoading,
    handleTouchAction,
    getProgressFromIndexedDB,
    saveProgressToIndexedDB,
    banner,
    slug,
    sotap,
    ngonngu,
    originalUrl,
    isIframe,
    findNextEpisodeUrl,
    playerInitialized,
    skipTimes,
    autoSkipIntro
  ]);
  const handleCustomBannerClick = () => {
    setPlayerInitialized(true);
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `group relative z-[10] aspect-[16/9] w-full overflow-hidden rounded-none bg-black lg:aspect-[16/9] 2xl:aspect-[16/8] ${isIntroTime ? "art-intro-progress" : ""}`,
      children: [
        error && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 z-10 flex items-center justify-center bg-black bg-opacity-75", children: /* @__PURE__ */ jsx("p", { className: "p-4 text-center text-lg text-red-500", children: error }) }),
        !playerInitialized && !isIframe ? /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: handleCustomBannerClick,
            className: "absolute inset-0 flex cursor-pointer items-center justify-center",
            "aria-label": "Phát video",
            children: [
              /* @__PURE__ */ jsx(
                "img",
                {
                  src: banner,
                  alt: `Banner phim ${ten_phim ?? ""}`.trim() || "Banner phim",
                  className: "absolute inset-0 h-full w-full object-cover",
                  loading: "eager",
                  decoding: "async",
                  fetchPriority: "high"
                }
              ),
              /* @__PURE__ */ jsx("span", { className: "absolute inset-0 bg-black/30", "aria-hidden": "true" }),
              /* @__PURE__ */ jsx("span", { className: "relative z-10 text-white", children: /* @__PURE__ */ jsx(
                "svg",
                {
                  xmlns: "http://www.w3.org/2000/svg",
                  at: true,
                  viewBox: "0 0 1408 1600",
                  className: "h-12 w-12 lg:h-14 lg:w-14",
                  "aria-hidden": "true",
                  children: /* @__PURE__ */ jsx(
                    "path",
                    {
                      fill: "currentColor",
                      d: "M1384 831L56 1569q-23 13-39.5 3T0 1536V64q0-26 16.5-36T56 31l1328 738q23 13 23 31t-23 31"
                    }
                  )
                }
              ) })
            ]
          }
        ) : isIframe ? /* @__PURE__ */ jsx(
          "iframe",
          {
            src: originalUrl,
            title: `Trình phát ${ten_phim ?? "video"}`,
            allowFullScreen: true,
            className: "h-full w-full",
            referrerPolicy: "origin",
            sandbox: "allow-forms allow-pointer-lock allow-same-origin allow-scripts allow-top-navigation-by-user-activation",
            allow: "autoplay; encrypted-media; picture-in-picture"
          }
        ) : /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("div", { ref: containerRef, className: "h-full w-full" }),
          showSkipIntro && /* @__PURE__ */ jsx("div", { className: "absolute b bottom-12 right-2 z-[100] lg:bottom-20 lg:right-6 lg:transition-all lg:duration-500 lg:ease-in-out lg:hover:scale-105", children: /* @__PURE__ */ jsx(
            "button",
            {
              onClick: handleSkipIntro,
              className: "rounded border bg-black/50 px-2 py-1 lg:p-2 text-[10px] font-semibold text-white transition-colors lg:text-sm",
              children: /* @__PURE__ */ jsx("span", { children: "Bỏ qua giới thiệu" })
            }
          ) })
        ] })
      ]
    }
  );
};

function MovieCard({ movies = [], title, loading, error }) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  if (!loading && (error || !movies || movies.length === 0)) {
    return /* @__PURE__ */ jsxs(
      "section",
      {
        className: "relative h-auto pt-2",
        "aria-label": `${title.replace(/\s+/g, "-")}-heading`,
        children: [
          /* @__PURE__ */ jsx("div", { className: "mb-4 flex items-center justify-between", children: /* @__PURE__ */ jsx(
            "h2",
            {
              id: `${title.replace(/\s+/g, "-")}-heading`,
              className: "text-lg font-bold text-white lg:text-2xl",
              children: title
            }
          ) }),
          /* @__PURE__ */ jsxs("div", { className: "flex min-h-[200px] flex-col items-center justify-center p-8 text-center text-gray-400", children: [
            /* @__PURE__ */ jsx(
              "svg",
              {
                xmlns: "http://www.w3.org/2000/svg",
                className: "mb-4 h-16 w-16 text-gray-600",
                fill: "none",
                viewBox: "0 0 24 24",
                stroke: "currentColor",
                children: /* @__PURE__ */ jsx(
                  "path",
                  {
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeWidth: 2,
                    d: "M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  }
                )
              }
            ),
            /* @__PURE__ */ jsx("p", { className: "mb-2 text-lg font-semibold text-white", children: "Rất tiếc, không tìm thấy phim nào." }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-400", children: "Vui lòng thử lại sau hoặc kiểm tra kết nối mạng của bạn." })
          ] })
        ]
      }
    );
  }
  if (loading) {
    return /* @__PURE__ */ jsxs(
      "section",
      {
        className: "relative h-auto pt-2",
        "aria-label": `${title.replace(/\s+/g, "-")}-heading`,
        children: [
          /* @__PURE__ */ jsx("div", { className: "mb-4 flex items-center justify-between", children: /* @__PURE__ */ jsx(
            "h2",
            {
              id: `${title.replace(/\s+/g, "-")}-heading`,
              className: "py-4 text-lg font-semibold lg:text-xl",
              children: title
            }
          ) }),
          /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center p-8", children: /* @__PURE__ */ jsx("p", { className: "text-gray-400", children: "Đang tải..." }) })
        ]
      }
    );
  }
  const moviesToDisplay = isMobile ? movies.slice(0, 6) : movies;
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsxs(
    "section",
    {
      className: "relative h-auto",
      "aria-label": `${title.replace(/\s+/g, "-")}-heading`,
      children: [
        /* @__PURE__ */ jsx("div", { className: "mb-4 flex items-center justify-between", children: /* @__PURE__ */ jsx(
          "h2",
          {
            id: `${title.replace(/\s+/g, "-")}-heading`,
            className: "py-4 text-lg font-semibold lg:text-xl",
            children: title
          }
        ) }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-3 md:grid-cols-5 md:gap-4 lg:grid-cols-5", children: moviesToDisplay.map((movie, index) => {
          const {
            id,
            slug,
            ten_phim,
            poster_url,
            tinh_trang,
            ngon_ngu,
            ten_khac
          } = movie;
          const movieKey = id || slug || `movie-${index}`;
          return /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
            "a",
            {
              href: `/phim/${slug}`,
              className: "group relative block h-full",
              children: /* @__PURE__ */ jsxs("div", { className: "relative h-full", children: [
                /* @__PURE__ */ jsxs("div", { className: "relative aspect-[2/3] w-full overflow-hidden rounded-md", children: [
                  /* @__PURE__ */ jsx(
                    "img",
                    {
                      src: poster_url,
                      alt: `Poster phim ${ten_phim || ten_khac}`,
                      className: "h-full w-full object-cover",
                      loading: "lazy"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "div",
                    {
                      className: "absolute bottom-0 left-0 h-[40%] w-full rounded-b-[4px]",
                      style: {
                        background: "linear-gradient(to top,rgba(0,0,0,0.7) 10%, transparent 100%)"
                      },
                      "aria-hidden": "true"
                    }
                  ),
                  /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" }),
                  /* @__PURE__ */ jsxs("div", { className: "absolute bottom-2 left-2 flex flex-col gap-2 font-semibold", children: [
                    /* @__PURE__ */ jsx("span", { className: "w-fit whitespace-nowrap rounded-[4px] bg-sky-300 px-2 py-0.5 text-[10px] text-black lg:py-1 lg:text-xs", children: rutGonTinhTrangNgonNgu(ngon_ngu) }),
                    /* @__PURE__ */ jsx("span", { className: "w-fit whitespace-nowrap rounded-[4px] bg-[linear-gradient(90deg,#e5330b_0%,#ff670b_51%,#d9a666_100%)] px-2 py-0.5 text-[10px] text-white lg:py-1 lg:text-xs", children: rutGonTinhTrangPhim(tinh_trang) })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-start justify-center gap-1 py-4", children: [
                  /* @__PURE__ */ jsx(
                    "h3",
                    {
                      className: "line-clamp-2 text-start text-[13px] font-normal text-white hover:text-sky-300 lg:text-sm",
                      title: ten_phim,
                      children: ten_phim
                    }
                  ),
                  /* @__PURE__ */ jsx("p", { className: "line-clamp-1 text-start text-xs font-normal text-gray-400 lg:text-[13px]", children: ten_khac })
                ] })
              ] })
            }
          ) }, movieKey);
        }) })
      ]
    }
  ) });
}

function SkipIntroButton({ initialAutoSkip = true }) {
  const [autoSkipIntro, setAutoSkipIntro] = useState(initialAutoSkip);
  const writeCookie = useCallback((val) => {
    const set = () => {
      document.cookie = `autoSkipIntro=${val ? 1 : 0}; path=/; max-age=31536000; SameSite=Lax`;
    };
    if ("requestIdleCallback" in window) window.requestIdleCallback(set);
    else setTimeout(set, 0);
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem("autoSkipIntro", String(autoSkipIntro));
    } catch {
    }
  }, [autoSkipIntro]);
  const toggleSkipIntro = () => {
    const next = !autoSkipIntro;
    setAutoSkipIntro(next);
    writeCookie(next);
  };
  return /* @__PURE__ */ jsxs(
    "button",
    {
      onClick: toggleSkipIntro,
      className: "S flex flex-row items-center justify-center gap-2 rounded-md px-1.5 py-0.5 text-xs font-normal text-white transition-all duration-300 lg:px-5",
      children: [
        "Tắt QC",
        /* @__PURE__ */ jsx(
          "span",
          {
            className: `text-xs ${autoSkipIntro ? "text-sky-300" : "text-white"}`,
            children: /* @__PURE__ */ jsxs(
              "svg",
              {
                xmlns: "http://www.w3.org/2000/svg",
                viewBox: "0 0 16 16",
                className: "h-7 w-7 fill-current",
                children: [
                  /* @__PURE__ */ jsx("path", { d: "M11.35 8.337c0-.699-.42-1.138-1.001-1.138c-.584 0-.954.444-.954 1.239v.453c0 .8.374 1.248.972 1.248c.588 0 .984-.44.984-1.2zm-5.413.237l-.734-2.426H5.15l-.734 2.426h1.52z" }),
                  /* @__PURE__ */ jsx("path", { d: "M2 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zm6.209 6.32c0-1.28.694-2.044 1.753-2.044c.655 0 1.156.294 1.336.769h.053v-2.36h1.16V11h-1.138v-.747h-.057c-.145.474-.69.804-1.367.804c-1.055 0-1.74-.764-1.74-2.043v-.695zm-4.04 1.138L3.7 11H2.5l2.013-5.999H5.9L7.905 11H6.644l-.47-1.542H4.17z" })
                ]
              }
            )
          }
        )
      ]
    }
  );
}
function ServerButtons({
  slug,
  so_tap,
  ngon_ngu,
  finalServer,
  hasSv1Video,
  hasSv2Video,
  hasSv3Video,
  initialAutoSkip = true
  // <-- nhận prop từ trang .astro
}) {
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-row items-center justify-center gap-6 rounded-none bg-[#08080a] px-2 py-4 lg:justify-start lg:px-6 lg:py-4", children: [
    /* @__PURE__ */ jsx("p", { className: "hidden text-[12px] font-normal text-white sm:block", children: "Chọn server khác nếu lỗi video hoặc phụ đề" }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-3", children: [
      hasSv1Video && /* @__PURE__ */ jsx(
        "a",
        {
          href: `/xem-phim/${slug}/${so_tap}/${ngon_ngu}?server=sv1`,
          className: `rounded-[4px] px-1.5 py-0.5 text-[12px] font-semibold transition-all duration-300 ${finalServer === "sv1" ? "bg-sky-300 text-black" : "bg-white text-black"}`,
          children: "VIP1"
        }
      ),
      hasSv2Video && /* @__PURE__ */ jsx(
        "a",
        {
          href: `/xem-phim/${slug}/${so_tap}/${ngon_ngu}?server=sv2`,
          className: `rounded-[4px] px-1.5 py-0.5 text-[12px] font-semibold transition-all duration-300 ${finalServer === "sv2" ? "bg-sky-300 text-black" : "bg-white text-black"}`,
          children: "VIP2"
        }
      ),
      hasSv3Video && /* @__PURE__ */ jsx(
        "a",
        {
          href: `/xem-phim/${slug}/${so_tap}/${ngon_ngu}?server=sv3`,
          className: `rounded-[4px] px-1.5 py-0.5 text-[12px] font-semibold transition-all duration-300 ${finalServer === "sv3" ? "bg-sky-300 text-black" : "bg-white text-black"}`,
          children: "VIP3"
        }
      ),
      /* @__PURE__ */ jsx(SkipIntroButton, { initialAutoSkip })
    ] })
  ] });
}

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro$1 = createAstro();
const $$SeoXemPhim = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$SeoXemPhim;
  const {
    tenPhim,
    tenKhac,
    currentEpisode,
    currentType,
    thumbnail,
    slug,
    mota
  } = Astro2.props;
  const siteName = "MephimTv";
  const siteUrl = Astro2.url.origin;
  const canonical = Astro2.url.href;
  const name = capitalizeWords(tenPhim);
  const originName = capitalizeWords(tenKhac);
  const episode = currentEpisode || "1";
  const language = currentType === "vietsub" ? "Vietsub" : currentType === "thuyetminh" ? "Thuy\u1EBFt Minh" : capitalizeWords(currentType);
  const description = cleanhtml(mota || "");
  const poster = thumbnail || `${siteUrl}/thumb_web.png`;
  const seriesUrl = `${siteUrl}/phim/${slug}`;
  const pageTitle = `Phim ${name} | ${originName} ${episode} ${language} HD - ${siteName}`;
  function truncate(text, max = 350) {
    if (!text) return "";
    return text.length > max ? text.slice(0, max).trim() + "[\u2026]" : text;
  }
  const metaDescription = truncate(
    description ? `Xem ${name} ${episode} ${language} m\u1EDBi nh\u1EA5t t\u1EA1i ${siteName}. N\u1ED9i dung phim : ${description}` : `Xem ${name} - ${episode} (${language}) t\u1EA1i ${siteName}.`
  );
  const fullSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Episode",
        "@id": `${canonical}#episode`,
        name: `${name} - ${episode} (${language})`,
        description: metaDescription,
        episodeNumber: parseInt(episode.replace(/\D/g, "")) || 1,
        partOfSeries: {
          "@type": "TVSeries",
          name,
          url: seriesUrl
        },
        url: canonical,
        image: poster,
        uploadDate: (/* @__PURE__ */ new Date()).toISOString(),
        publisher: {
          "@type": "Organization",
          name: siteName,
          logo: { "@type": "ImageObject", url: `${siteUrl}/thumb_web.png` }
        }
      },
      {
        "@type": "VideoObject",
        "@id": `${canonical}#video`,
        name: `${name} - ${episode} (${language})`,
        description: metaDescription,
        thumbnailUrl: [poster],
        embedUrl: canonical,
        contentUrl: canonical,
        uploadDate: (/* @__PURE__ */ new Date()).toISOString(),
        publisher: {
          "@type": "Organization",
          name: siteName,
          logo: { "@type": "ImageObject", url: `${siteUrl}/thumb_web.png` }
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${canonical}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Trang ch\u1EE7", item: siteUrl },
          { "@type": "ListItem", position: 2, name, item: seriesUrl },
          {
            "@type": "ListItem",
            position: 3,
            name: `${episode} ${language}`,
            item: canonical
          }
        ]
      }
    ]
  };
  return renderTemplate(_a || (_a = __template(["<title>", '</title><meta name="description"', '><meta name="robots" content="index, follow"><link rel="canonical"', '><link rel="icon"', '><!-- Open Graph --><meta property="og:type" content="video.episode"><meta property="og:title"', '><meta property="og:description"', '><meta property="og:image"', '><meta property="og:url"', '><meta property="og:site_name"', '><meta property="og:locale" content="vi_VN"><!-- Twitter Card --><meta name="twitter:card" content="player"><meta name="twitter:title"', '><meta name="twitter:description"', '><meta name="twitter:image"', '><meta name="twitter:player"', '><!-- JSON-LD --><script type="application/ld+json">', "<\/script>"])), pageTitle, addAttribute(metaDescription, "content"), addAttribute(canonical, "href"), addAttribute(`${siteUrl}/favicon.ico`, "href"), addAttribute(pageTitle, "content"), addAttribute(metaDescription, "content"), addAttribute(poster, "content"), addAttribute(canonical, "content"), addAttribute(siteName, "content"), addAttribute(pageTitle, "content"), addAttribute(metaDescription, "content"), addAttribute(poster, "content"), addAttribute(canonical, "content"), unescapeHTML(JSON.stringify(fullSchema)));
}, "/home/vohaidang/Desktop/tramphim-v2/ui/src/seometas/SeoXemPhim.astro", void 0);

const API_BASE_URL = "https://api.motchillx.site";
const MovieDetail = ({ movie }) => {
  const [isSharePopupOpen, setIsSharePopupOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [isMobileDetailsVisible, setIsMobileDetailsVisible] = useState(false);
  const [likeCount, setLikeCount] = useState(movie.luot_like || 0);
  const [dislikeCount, setDislikeCount] = useState(movie.luot_dislike || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  useEffect(() => {
    setLikeCount(movie.luot_like || 0);
    setDislikeCount(movie.luot_dislike || 0);
  }, [movie]);
  const handleCopyLink = () => {
    const link = window.location.href;
    navigator.clipboard.writeText(link).then(() => {
    });
  };
  const handleLike = async () => {
    if (isLiked) {
      return;
    }
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/phim/${movie.slug}/like`,
        {
          method: "POST"
        }
      );
      if (response.ok) {
        setLikeCount((prevCount) => prevCount + 1);
        if (isDisliked) {
          setDislikeCount((prevCount) => prevCount > 0 ? prevCount - 1 : 0);
        }
        setIsLiked(true);
        setIsDisliked(false);
      } else {
        console.error("Failed to like the movie");
      }
    } catch (error) {
      console.error("Error liking the movie:", error);
    }
  };
  const handleDislike = async () => {
    if (isDisliked) {
      return;
    }
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/phim/${movie.slug}/dislike`,
        {
          method: "POST"
        }
      );
      if (response.ok) {
        setDislikeCount((prevCount) => prevCount + 1);
        if (isLiked) {
          setLikeCount((prevCount) => prevCount > 0 ? prevCount - 1 : 0);
        }
        setIsDisliked(true);
        setIsLiked(false);
      } else {
        console.error("Failed to dislike the movie");
      }
    } catch (error) {
      console.error("Error disliking the movie:", error);
    }
  };
  const handleToggleDetails = () => {
    if (window.innerWidth < 640) {
      setIsMobileDetailsVisible(true);
    } else {
      setShowDetails(!showDetails);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "w-full", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex w-full items-center justify-between py-4 font-normal text-white", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-6", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-left text-base font-bold leading-tight text-white lg:text-2xl", children: movie.ten_phim }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: handleToggleDetails,
            className: "flex items-center lg:text-sm text-xs font-normal sm:static",
            children: [
              /* @__PURE__ */ jsx("span", { className: "", children: "Giới thiệu" }),
              /* @__PURE__ */ jsx(
                "svg",
                {
                  xmlns: "http://www.w3.org/2000/svg",
                  width: "24",
                  height: "24",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: "2",
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  className: `ml-1 h-4 w-4 -rotate-90 transform transition-transform duration-300 ${showDetails ? "hidden -rotate-90 sm:block" : ""}`,
                  children: /* @__PURE__ */ jsx("path", { d: "M6 9l6 6 6-6" })
                }
              )
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "ml-auto hidden flex-row items-center justify-end gap-4 sm:flex", children: [
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx(
            "svg",
            {
              onClick: () => setIsSharePopupOpen(!isSharePopupOpen),
              xmlns: "http://www.w3.org/2000/svg",
              width: "26",
              height: "26",
              viewBox: "0 0 48 48",
              className: "cursor-pointer transition-all duration-300 ease-in-out hover:scale-105",
              children: /* @__PURE__ */ jsxs(
                "g",
                {
                  fill: "none",
                  stroke: "#9ca3af",
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  strokeWidth: "4",
                  children: [
                    /* @__PURE__ */ jsx("path", { d: "M28 6H42V20" }),
                    /* @__PURE__ */ jsx("path", { d: "M42 29.4737V39C42 40.6569 40.6569 42 39 42H9C7.34315 42 6 40.6569 6 39V9C6 7.34315 7.34315 6 9 6L18 6" }),
                    /* @__PURE__ */ jsx("path", { d: "M25.7998 22.1999L41.0998 6.8999" })
                  ]
                }
              )
            }
          ),
          isSharePopupOpen && /* @__PURE__ */ jsxs(
            "div",
            {
              className: "absolute right-0 top-full z-50 mt-2 w-[350px] rounded-lg bg-[#35373d] p-4 shadow-lg",
              onClick: (e) => e.stopPropagation(),
              children: [
                /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-white", children: "Chia Sẻ" }),
                /* @__PURE__ */ jsxs("div", { className: "mt-2 flex flex-row items-center gap-2", children: [
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "text",
                      readOnly: true,
                      value: window.location.href,
                      className: "flex-1 rounded-md bg-[#ffffff18] px-2 py-1 text-xs text-gray-300 outline-none"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: handleCopyLink,
                      className: "rounded-md bg-sky-300 px-3 py-1 text-xs font-semibold text-black",
                      children: "Sao Chép"
                    }
                  )
                ] })
              ]
            }
          )
        ] }),
        movie.luot_xem && /* @__PURE__ */ jsxs("div", { className: "flex flex-row py-1", children: [
          /* @__PURE__ */ jsx(
            "svg",
            {
              xmlns: "http://www.w3.org/2000/svg",
              width: "28",
              height: "28",
              viewBox: "0 0 24 24",
              className: "cursor-pointer text-gray-400 transition-all duration-300 ease-in-out hover:scale-105",
              children: /* @__PURE__ */ jsx(
                "path",
                {
                  fill: "currentColor",
                  d: "M6 8c0-2.21 1.79-4 4-4s4 1.79 4 4s-1.79 4-4 4s-4-1.79-4-4m3.14 11.75L8.85 19l.29-.75c.7-1.75 1.94-3.11 3.47-4.03c-.82-.14-1.69-.22-2.61-.22c-4.42 0-8 1.79-8 4v2h7.27c-.04-.09-.09-.17-.13-.25M17 18c-.56 0-1 .44-1 1s.44 1 1 1s1-.44 1-1s-.44-1-1-1m6 1c-.94 2.34-3.27 4-6 4s-5.06-1.66-6-4c.94-2.34 3.27-4 6-4s5.06 1.66 6 4m-3.5 0a2.5 2.5 0 0 0-5 0a2.5 2.5 0 0 0 5 0"
                }
              )
            }
          ),
          /* @__PURE__ */ jsx("span", { className: "font-normal text-gray-400", children: movie.luot_xem })
        ] }),
        movie.luot_like >= 0 && /* @__PURE__ */ jsxs("div", { className: "flex flex-row py-1", children: [
          /* @__PURE__ */ jsx(
            "svg",
            {
              onClick: handleLike,
              xmlns: "http://www.w3.org/2000/svg",
              width: "28",
              height: "28",
              viewBox: "0 0 24 24",
              className: `cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 ${isLiked ? "text-sky-300" : "text-gray-400"}`,
              children: /* @__PURE__ */ jsx(
                "path",
                {
                  fill: "currentColor",
                  d: "M20 8h-5.612l1.123-3.367c.202-.608.1-1.282-.275-1.802S14.253 2 13.612 2H12c-.297 0-.578.132-.769.36L6.531 8H4c-1.103 0-2 .897-2 2v9c0 1.103.897 2 2 2h13.307a2.01 2.01 0 0 0 1.873-1.298l2.757-7.351A1 1 0 0 0 22 12v-2c0-1.103-.897-2-2-2M4 10h2v9H4zm16 1.819L17.307 19H8V9.362L12.468 4h1.146l-1.562 4.683A.998.998 0 0 0 13 10h7z"
                }
              )
            }
          ),
          /* @__PURE__ */ jsx("span", { className: "font-normal text-gray-400", children: likeCount })
        ] }),
        movie.luot_dislike >= 0 && /* @__PURE__ */ jsxs("div", { className: "flex flex-row py-1", children: [
          /* @__PURE__ */ jsx(
            "svg",
            {
              onClick: handleDislike,
              xmlns: "http://www.w3.org/2000/svg",
              width: "28",
              height: "28",
              viewBox: "0 0 24 24",
              className: `rotate-180 cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 ${isDisliked ? "text-sky-300" : "text-gray-400"}`,
              children: /* @__PURE__ */ jsx(
                "path",
                {
                  fill: "currentColor",
                  d: "M20 8h-5.612l1.123-3.367c.202-.608.1-1.282-.275-1.802S14.253 2 13.612 2H12c-.297 0-.578.132-.769.36L6.531 8H4c-1.103 0-2 .897-2 2v9c0 1.103.897 2 2 2h13.307a2.01 2.01 0 0 0 1.873-1.298l2.757-7.351A1 1 0 0 0 22 12v-2c0-1.103-.897-2-2-2M4 10h2v9H4zm16 1.819L17.307 19H8V9.362L12.468 4h1.146l-1.562 4.683A.998.998 0 0 0 13 10h7z"
                }
              )
            }
          ),
          /* @__PURE__ */ jsx("span", { className: "font-normal text-gray-400", children: dislikeCount })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex w-full flex-wrap items-center gap-2 text-sm font-medium text-[#ECECEC]", children: [
      movie.tinh_trang && /* @__PURE__ */ jsx("span", { className: "text-sky-300", children: rutGonTinhTrangPhim(movie.tinh_trang) }),
      movie.nam_phat_hanh && /* @__PURE__ */ jsx("span", { children: movie.nam_phat_hanh }),
      movie.ngon_ngu && /* @__PURE__ */ jsx("span", { children: movie.ngon_ngu }),
      movie.the_loai && movie.the_loai.length > 0 && /* @__PURE__ */ jsx("span", { children: movie.the_loai.map((genre, index) => /* @__PURE__ */ jsxs("span", { children: [
        genre.ten,
        index < movie.the_loai.length - 1 && " / "
      ] }, genre.ten)) })
    ].filter(Boolean).map((item, index, arr) => /* @__PURE__ */ jsxs("span", { children: [
      item,
      index < arr.length - 1 && " / "
    ] }, index)) }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-row items-center justify-between gap-4 sm:hidden pt-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative flex items-center justify-center gap-6", children: [
        /* @__PURE__ */ jsx(
          "svg",
          {
            onClick: () => setIsSharePopupOpen(!isSharePopupOpen),
            xmlns: "http://www.w3.org/2000/svg",
            width: "26",
            height: "26",
            viewBox: "0 0 48 48",
            className: "cursor-pointer transition-all duration-300 ease-in-out hover:scale-105",
            children: /* @__PURE__ */ jsxs(
              "g",
              {
                fill: "none",
                stroke: "#9ca3af",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeWidth: "4",
                children: [
                  /* @__PURE__ */ jsx("path", { d: "M28 6H42V20" }),
                  /* @__PURE__ */ jsx("path", { d: "M42 29.4737V39C42 40.6569 40.6569 42 39 42H9C7.34315 42 6 40.6569 6 39V9C6 7.34315 7.34315 6 9 6L18 6" }),
                  /* @__PURE__ */ jsx("path", { d: "M25.7998 22.1999L41.0998 6.8999" })
                ]
              }
            )
          }
        ),
        isSharePopupOpen && /* @__PURE__ */ jsx(
          "div",
          {
            className: "fixed inset-0 z-40 bg-black bg-opacity-50",
            onClick: () => setIsSharePopupOpen(false),
            children: /* @__PURE__ */ jsxs(
              "div",
              {
                className: "fixed left-1/2 top-1/2 z-50 w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-[#1a1a1a] p-4 shadow-lg",
                onClick: (e) => e.stopPropagation(),
                children: [
                  /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-white", children: "Chia Sẻ" }),
                  /* @__PURE__ */ jsxs("div", { className: "mt-2 flex flex-row items-center gap-2", children: [
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "text",
                        readOnly: true,
                        value: window.location.href,
                        className: "flex-1 rounded-md bg-[#ffffff18] px-2 py-1 text-xs text-gray-300 outline-none"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        onClick: handleCopyLink,
                        className: "rounded-md bg-blue-300 px-3 py-1 text-xs font-semibold text-black",
                        children: "Sao Chép"
                      }
                    )
                  ] })
                ]
              }
            )
          }
        ),
        movie.luot_xem && /* @__PURE__ */ jsxs("div", { className: "flex flex-row py-1", children: [
          /* @__PURE__ */ jsx(
            "svg",
            {
              xmlns: "http://www.w3.org/2000/svg",
              width: "28",
              height: "28",
              viewBox: "0 0 24 24",
              className: "cursor-pointer text-gray-400 transition-all duration-300 ease-in-out hover:scale-105",
              children: /* @__PURE__ */ jsx(
                "path",
                {
                  fill: "currentColor",
                  d: "M6 8c0-2.21 1.79-4 4-4s4 1.79 4 4s-1.79 4-4 4s-4-1.79-4-4m3.14 11.75L8.85 19l.29-.75c.7-1.75 1.94-3.11 3.47-4.03c-.82-.14-1.69-.22-2.61-.22c-4.42 0-8 1.79-8 4v2h7.27c-.04-.09-.09-.17-.13-.25M17 18c-.56 0-1 .44-1 1s.44 1 1 1s1-.44 1-1s-.44-1-1-1m6 1c-.94 2.34-3.27 4-6 4s-5.06-1.66-6-4c.94-2.34 3.27-4 6-4s5.06 1.66 6 4m-3.5 0a2.5 2.5 0 0 0-5 0a2.5 2.5 0 0 0 5 0"
                }
              )
            }
          ),
          /* @__PURE__ */ jsx("span", { className: "font-normal text-gray-400", children: movie.luot_xem })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-6", children: [
        movie.luot_like >= 0 && /* @__PURE__ */ jsxs("div", { className: "flex flex-row py-1", children: [
          /* @__PURE__ */ jsx(
            "svg",
            {
              onClick: handleLike,
              xmlns: "http://www.w3.org/2000/svg",
              width: "28",
              height: "28",
              viewBox: "0 0 24 24",
              className: `cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 ${isLiked ? "text-sky-300" : "text-gray-400"}`,
              children: /* @__PURE__ */ jsx(
                "path",
                {
                  fill: "currentColor",
                  d: "M20 8h-5.612l1.123-3.367c.202-.608.1-1.282-.275-1.802S14.253 2 13.612 2H12c-.297 0-.578.132-.769.36L6.531 8H4c-1.103 0-2 .897-2 2v9c0 1.103.897 2 2 2h13.307a2.01 2.01 0 0 0 1.873-1.298l2.757-7.351A1 1 0 0 0 22 12v-2c0-1.103-.897-2-2-2M4 10h2v9H4zm16 1.819L17.307 19H8V9.362L12.468 4h1.146l-1.562 4.683A.998.998 0 0 0 13 10h7z"
                }
              )
            }
          ),
          /* @__PURE__ */ jsx("span", { className: "font-normal text-gray-400", children: likeCount })
        ] }),
        movie.luot_dislike >= 0 && /* @__PURE__ */ jsxs("div", { className: "flex flex-row py-1", children: [
          /* @__PURE__ */ jsx(
            "svg",
            {
              onClick: handleDislike,
              xmlns: "http://www.w3.org/2000/svg",
              width: "28",
              height: "28",
              viewBox: "0 0 24 24",
              className: `rotate-180 cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 ${isDisliked ? "text-sky-300" : "text-gray-400"}`,
              children: /* @__PURE__ */ jsx(
                "path",
                {
                  fill: "currentColor",
                  d: "M20 8h-5.612l1.123-3.367c.202-.608.1-1.282-.275-1.802S14.253 2 13.612 2H12c-.297 0-.578.132-.769.36L6.531 8H4c-1.103 0-2 .897-2 2v9c0 1.103.897 2 2 2h13.307a2.01 2.01 0 0 0 1.873-1.298l2.757-7.351A1 1 0 0 0 22 12v-2c0-1.103-.897-2-2-2M4 10h2v9H4zm16 1.819L17.307 19H8V9.362L12.468 4h1.146l-1.562 4.683A.998.998 0 0 0 13 10h7z"
                }
              )
            }
          ),
          /* @__PURE__ */ jsx("span", { className: "font-normal text-gray-400", children: dislikeCount })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(
      "div",
      {
        className: `mt-4 w-full overflow-hidden rounded-lg bg-[#252525] ${showDetails ? "max-h-[500px] px-4 py-6" : "max-h-0 p-0"} hidden sm:block`,
        children: /* @__PURE__ */ jsxs("div", { className: "flex w-full flex-col items-start gap-6 sm:flex-row", children: [
          /* @__PURE__ */ jsx("div", { className: "flex-shrink-0", children: /* @__PURE__ */ jsx("div", { className: "relative aspect-[2/3] w-[130px] rounded-lg", children: /* @__PURE__ */ jsx(
            "img",
            {
              src: movie.poster_url,
              alt: `Poster phim ${movie.ten_phim}`,
              className: "absolute left-0 top-0 h-full w-full rounded-lg object-cover",
              loading: "eager",
              fetchPriority: "high"
            }
          ) }) }),
          /* @__PURE__ */ jsxs("div", { className: "flex w-full flex-col", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-left text-base font-semibold leading-tight text-white lg:text-xl", children: movie.ten_phim }),
            movie.ten_khac && /* @__PURE__ */ jsx("p", { className: "text-left text-[13px] font-normal text-gray-400", children: movie.ten_khac }),
            /* @__PURE__ */ jsxs("div", { className: "mt-2 flex w-full flex-wrap items-center justify-start gap-1 text-xs font-medium sm:flex lg:gap-3 lg:text-sm", children: [
              movie.tinh_trang && /* @__PURE__ */ jsxs("div", { className: "text-left lg:flex-none", children: [
                /* @__PURE__ */ jsx("span", { className: "hidden text-gray-400 lg:inline", children: "Tình Trạng:" }),
                /* @__PURE__ */ jsx("span", { className: "ml-0 text-sky-300 lg:ml-2", children: movie.tinh_trang })
              ] }),
              movie.nam_phat_hanh && /* @__PURE__ */ jsxs("div", { className: "text-left before:pr-2 before:content-['/'] lg:flex-none lg:before:content-none", children: [
                /* @__PURE__ */ jsx("span", { className: "hidden text-gray-400 lg:inline", children: "Năm:" }),
                /* @__PURE__ */ jsx("span", { className: "ml-0 text-[#ECECEC] lg:ml-2", children: movie.nam_phat_hanh })
              ] }),
              movie.ngon_ngu && /* @__PURE__ */ jsxs("div", { className: "text-left before:pr-2 before:content-['/'] lg:flex-none lg:before:content-none", children: [
                /* @__PURE__ */ jsxs("span", { className: "hidden text-gray-400 lg:inline", children: [
                  "Ngôn ngữ:",
                  " "
                ] }),
                /* @__PURE__ */ jsx("span", { className: "ml-0 text-[#ECECEC] lg:ml-2", children: rutGonTinhTrangNgonNgu(movie.ngon_ngu) })
              ] })
            ] }),
            movie.the_loai && movie.the_loai.length > 0 && /* @__PURE__ */ jsxs("div", { className: "mt-2", children: [
              /* @__PURE__ */ jsx("span", { className: "mr-2 text-xs font-medium text-gray-400 lg:text-sm", children: "Thể loại:" }),
              /* @__PURE__ */ jsx("div", { className: "inline-flex flex-wrap gap-1", children: movie.the_loai.map((genre, index) => /* @__PURE__ */ jsxs(
                "span",
                {
                  className: "text-xs text-[#ECECEC] lg:text-sm",
                  children: [
                    genre.ten,
                    index < movie.the_loai.length - 1 && " / "
                  ]
                },
                genre.ten
              )) })
            ] }),
            movie.dao_dien && /* @__PURE__ */ jsx("div", { className: "py-1", children: /* @__PURE__ */ jsxs("h2", { className: "my-1 text-xs font-medium text-gray-400 lg:text-sm", children: [
              "Đạo diễn:",
              /* @__PURE__ */ jsx("span", { className: "ml-2 font-normal text-[#ECECEC]", children: movie.dao_dien })
            ] }) }),
            movie.dien_vien && movie.dien_vien.length > 0 && /* @__PURE__ */ jsx("div", { className: "my-1 flex flex-col gap-1 text-xs font-medium text-gray-400 lg:text-sm", children: /* @__PURE__ */ jsxs("span", { className: "line-clamp-2", children: [
              "Diễn viên:",
              /* @__PURE__ */ jsx("span", { className: "ml-2 font-normal text-[#ECECEC]", children: movie.dien_vien.map((actor) => actor.ten).join(", ") })
            ] }) }),
            movie.thoi_luong && /* @__PURE__ */ jsx("div", { className: "py-1", children: /* @__PURE__ */ jsxs("h2", { className: "text-xs font-medium text-gray-400 lg:text-sm", children: [
              "Thời Lượng:",
              /* @__PURE__ */ jsx("span", { className: "ml-2 font-normal text-[#ECECEC]", children: movie.thoi_luong })
            ] }) }),
            movie.mo_ta && /* @__PURE__ */ jsxs("div", { className: "hidden flex-row gap-2 py-1 text-xs sm:flex lg:text-sm", children: [
              /* @__PURE__ */ jsx("h2", { className: "whitespace-nowrap font-medium text-gray-400 lg:text-sm", children: "Nội Dung:" }),
              /* @__PURE__ */ jsx("span", { className: "line-clamp-2 font-normal text-[#ECECEC]", children: movie.mo_ta })
            ] })
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsx(
      "div",
      {
        className: `fixed bottom-0 left-0 right-0 z-50 transform transition-transform duration-300 sm:hidden ${isMobileDetailsVisible ? "translate-y-0" : "translate-y-full"}`,
        children: /* @__PURE__ */ jsxs("div", { className: "relative w-full h-[75vh] overflow-y-auto rounded-t-lg bg-[#1a1a1a] px-4 py-2 text-white", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setIsMobileDetailsVisible(false),
              className: "absolute right-4 top-2 ",
              children: /* @__PURE__ */ jsxs(
                "svg",
                {
                  xmlns: "http://www.w3.org/2000/svg",
                  width: "24",
                  height: "24",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: "2",
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  className: "h-6 w-6 text-white",
                  children: [
                    /* @__PURE__ */ jsx("line", { x1: "18", y1: "6", x2: "6", y2: "18" }),
                    /* @__PURE__ */ jsx("line", { x1: "6", y1: "6", x2: "18", y2: "18" })
                  ]
                }
              )
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "flex w-full items-center font-normal text-white pt-4", children: /* @__PURE__ */ jsx("h2", { className: "pb-4 text-xl font-normal leading-tight", children: "Chi Tiết Phim" }) }),
          /* @__PURE__ */ jsx("div", { className: "flex w-full flex-col items-start gap-4", children: /* @__PURE__ */ jsxs("div", { className: "flex w-full flex-col", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex flex-row gap-2", children: [
              /* @__PURE__ */ jsxs("div", { className: "w-[70%]", children: [
                /* @__PURE__ */ jsx("h2", { className: "py-2 text-left text-lg font-semibold leading-tight text-white lg:text-xl", children: movie.ten_phim }),
                movie.ten_khac && /* @__PURE__ */ jsx("p", { className: "text-left text-[13px] font-normal text-gray-400", children: movie.ten_khac }),
                movie.tinh_trang && /* @__PURE__ */ jsxs("div", { className: "mt-2 text-left", children: [
                  /* @__PURE__ */ jsxs("span", { className: "text-sm font-medium text-gray-400", children: [
                    "Tình trạng:",
                    " "
                  ] }),
                  /* @__PURE__ */ jsx("span", { className: "text-sm text-sky-300", children: movie.tinh_trang })
                ] }),
                movie.nam_phat_hanh && /* @__PURE__ */ jsxs("div", { className: "text-left", children: [
                  /* @__PURE__ */ jsxs("span", { className: "text-sm font-medium text-gray-400", children: [
                    "Năm:",
                    " "
                  ] }),
                  /* @__PURE__ */ jsx("span", { className: "text-sm text-[#ECECEC]", children: movie.nam_phat_hanh })
                ] }),
                movie.ngon_ngu && /* @__PURE__ */ jsxs("div", { className: "text-left", children: [
                  /* @__PURE__ */ jsxs("span", { className: "text-sm font-medium text-gray-400", children: [
                    "Ngôn ngữ:",
                    " "
                  ] }),
                  /* @__PURE__ */ jsx("span", { className: "text-sm text-[#ECECEC]", children: rutGonTinhTrangNgonNgu(movie.ngon_ngu) })
                ] }),
                movie.the_loai && movie.the_loai.length > 0 && /* @__PURE__ */ jsxs("div", { className: "text-left", children: [
                  /* @__PURE__ */ jsxs("span", { className: "text-sm font-medium text-gray-400", children: [
                    "Thể loại:",
                    " "
                  ] }),
                  /* @__PURE__ */ jsx("span", { className: "text-sm text-[#ECECEC]", children: movie.the_loai.map((genre) => genre.ten).join(" / ") })
                ] }),
                movie.dao_dien && /* @__PURE__ */ jsxs("div", { className: "text-left", children: [
                  /* @__PURE__ */ jsxs("span", { className: "text-sm font-medium text-gray-400", children: [
                    "Đạo diễn:",
                    " "
                  ] }),
                  /* @__PURE__ */ jsx("span", { className: "text-sm text-[#ECECEC]", children: movie.dao_dien })
                ] }),
                movie.dien_vien && movie.dien_vien.length > 0 && /* @__PURE__ */ jsxs("div", { className: "text-left", children: [
                  /* @__PURE__ */ jsxs("span", { className: "text-sm font-medium text-gray-400", children: [
                    "Diễn viên:",
                    " "
                  ] }),
                  /* @__PURE__ */ jsx("span", { className: "text-sm text-[#ECECEC]", children: movie.dien_vien.map((actor) => actor.ten).join(", ") })
                ] }),
                movie.thoi_luong && /* @__PURE__ */ jsxs("div", { className: "text-left", children: [
                  /* @__PURE__ */ jsxs("span", { className: "text-sm font-medium text-gray-400", children: [
                    "Thời lượng:",
                    " "
                  ] }),
                  /* @__PURE__ */ jsx("span", { className: "text-sm text-[#ECECEC]", children: movie.thoi_luong })
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "relative h-full w-[30%] rounded-lg", children: /* @__PURE__ */ jsx(
                "img",
                {
                  src: movie.poster_url,
                  alt: `Poster phim ${movie.ten_phim}`,
                  className: "absolute left-0 top-0 w-full rounded-lg object-cover"
                }
              ) })
            ] }),
            movie.mo_ta && /* @__PURE__ */ jsxs("div", { className: "mt-2 text-left", children: [
              /* @__PURE__ */ jsx("span", { className: "block text-sm font-medium text-gray-400", children: "Nội dung:" }),
              /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm font-normal text-[#ECECEC]", children: movie.mo_ta })
            ] })
          ] }) })
        ] })
      }
    )
  ] });
};

const BASE_URL = "https://api.motchillx.site";
const SKIP_AD_STATUS_API_URL = `${BASE_URL}/api/skip_ad/status/skip-ad/`;
const SKIP_AD_API_URL = `${BASE_URL}/api/skip_ad/link/`;
const fetchJson = async (url) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Lỗi khi fetch API: ${url} (status: ${res.status})`);
  }
  return await res.json();
};
const checkSkipAdStatus = async () => {
  try {
    const data = await fetchJson(SKIP_AD_STATUS_API_URL);
    return data?.enabled === true;
  } catch (error) {
    console.error("Lỗi khi kiểm tra trạng thái bộ lọc quảng cáo:", error);
    return false;
  }
};
const fetchEpisodeData = async (slug, so_tap, ngon_ngu, server) => {
  const data = await fetchJson(
    `${BASE_URL}/api/phim/${slug}/tap/${so_tap}/${ngon_ngu}?server=${server}`
  );
  if (data?.link_video) {
    return {
      link_video: data.link_video,
      tap_phim: data.tap_phim,
      server
    };
  }
  throw new Error(`Không có link video cho server ${server}`);
};
const fetchVideoSource = async (slug, so_tap, ngon_ngu, preferredServer) => {
  const allServers = ["sv2", "sv1", "sv3"];
  const serverStatus = {};
  let finalServer = preferredServer;
  let videoData = null;
  const fetchPromises = allServers.map(
    (server) => fetchEpisodeData(slug, so_tap, ngon_ngu, server).then((data) => {
      serverStatus[server] = true;
      return { server, data };
    }).catch(() => {
      serverStatus[server] = false;
      return { server, data: null };
    })
  );
  const allResults = await Promise.all(fetchPromises);
  const userPreferredServer = preferredServer;
  if (serverStatus[userPreferredServer]) {
    const result = allResults.find((res) => res.server === userPreferredServer);
    if (result && result.data) {
      videoData = result.data;
      finalServer = userPreferredServer;
    }
  }
  if (!videoData) {
    for (const server of allServers) {
      const result = allResults.find((res) => res.server === server);
      if (result && result.data) {
        videoData = result.data;
        finalServer = server;
        break;
      }
    }
  }
  return {
    videoData,
    finalServer,
    hasSv1Video: serverStatus.sv1 || false,
    hasSv2Video: serverStatus.sv2 || false,
    hasSv3Video: serverStatus.sv3 || false
  };
};
const fetchMovieBySlug = async (slug) => {
  try {
    return await fetchJson(`${BASE_URL}/api/phim/${slug}`);
  } catch (error) {
    console.error(`Lỗi khi lấy dữ liệu phim: ${error}`);
    return null;
  }
};
const fetchEpisodeLists = async (slug) => {
  const defaultServerForLists = "sv1";
  const [vietsubData, thuyetminhData, longtiengData] = await Promise.all([
    fetchJson(
      `${BASE_URL}/api/phim/${slug}/vietsub?server=${defaultServerForLists}`
    ).catch(() => ({})),
    fetchJson(
      `${BASE_URL}/api/phim/${slug}/thuyetminh?server=${defaultServerForLists}`
    ).catch(() => ({})),
    // ⭐️ FETCH DỮ LIỆU LONG TIẾNG MỚI
    fetchJson(
      `${BASE_URL}/api/phim/${slug}/longtieng?server=${defaultServerForLists}`
    ).catch(() => ({}))
  ]);
  return { vietsubData, thuyetminhData, longtiengData };
};
const fetchSidebarData = async () => {
  const [topData, deXuatData] = await Promise.all([
    fetchJson(`${BASE_URL}/api/filter/?page=1&limit=10&sort=luot-xem`).catch(
      () => ({ data: [] })
    ),
    fetchJson(`${BASE_URL}/api/filter/?page=1&limit=10&sort=ngay-tao`).catch(
      () => ({ data: [] })
    )
  ]);
  return { topData, deXuatData };
};
const fetchActorFilmography = async (actorSlug) => {
  try {
    return await fetchJson(`${BASE_URL}/api/phim/${actorSlug}/dien-vien/`);
  } catch (error) {
    console.error(`Lỗi khi lấy dữ liệu phim của diễn viên: ${error}`);
    return null;
  }
};
const fetchAllMovieData = async (slug, so_tap, ngon_ngu) => {
  const [movie, episodeLists, sidebarData, actors] = await Promise.all([
    fetchMovieBySlug(slug),
    fetchEpisodeLists(slug),
    fetchSidebarData(),
    fetchActorFilmography(slug)
  ]);
  return {
    movie,
    actors,
    vietsubData: episodeLists.vietsubData,
    thuyetminhData: episodeLists.thuyetminhData,
    longtiengData: episodeLists.longtiengData,
    ...sidebarData
  };
};

const $$Astro = createAstro();
const prerender = false;
const $$ngonNgu = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$ngonNgu;
  const { slug, tap_slug, ngon_ngu = "vietsub" } = Astro2.params;
  if (!slug || !tap_slug) {
    return new Response("Kh\xF4ng t\xECm th\u1EA5y phim ho\u1EB7c t\u1EADp phim", { status: 404 });
  }
  const server = Astro2.url.searchParams.get("server") || "sv2";
  let originalVideoUrl = null;
  let phimInfo = {};
  let finalServer = server;
  let hasSv1Video = false;
  let hasSv2Video = false;
  let hasSv3Video = false;
  let skipIntroTime = 0;
  let episodeNumberFromApi = tap_slug;
  try {
    const videoSourceResult = await fetchVideoSource(
      slug,
      tap_slug,
      ngon_ngu,
      server
    );
    if (!videoSourceResult.videoData) {
      return new Response(
        "Kh\xF4ng th\u1EC3 t\u1EA3i d\u1EEF li\u1EC7u phim. Video kh\xF4ng kh\u1EA3 d\u1EE5ng tr\xEAn b\u1EA5t k\u1EF3 m\xE1y ch\u1EE7 n\xE0o.",
        { status: 404 }
      );
    }
    originalVideoUrl = videoSourceResult.videoData.link_video;
    phimInfo = videoSourceResult.videoData.tap_phim?.phim ?? {};
    finalServer = videoSourceResult.finalServer;
    hasSv1Video = videoSourceResult.hasSv1Video;
    hasSv2Video = videoSourceResult.hasSv2Video;
    hasSv3Video = videoSourceResult.hasSv3Video;
    skipIntroTime = videoSourceResult.videoData.tap_phim?.skip_intro_time || 0;
    episodeNumberFromApi = videoSourceResult.videoData.tap_phim?.so_tap || tap_slug;
  } catch (error) {
    console.error("L\u1ED7i khi fetch video source:", error);
    return new Response("\u0110\xE3 x\u1EA3y ra l\u1ED7i h\u1EC7 th\u1ED1ng. Vui l\xF2ng th\u1EED l\u1EA1i sau.", {
      status: 500
    });
  }
  let finalVideoUrl = originalVideoUrl;
  const isSkipAdEnabled = await checkSkipAdStatus();
  if (isSkipAdEnabled && originalVideoUrl) {
    const encodedUrl = encodeURIComponent(originalVideoUrl);
    finalVideoUrl = `${SKIP_AD_API_URL}?url=${encodedUrl}`;
  }
  const {
    movie,
    vietsubData,
    thuyetminhData,
    longtiengData,
    topData,
    deXuatData
  } = await fetchAllMovieData(slug);
  const finalPhimInfo = movie || phimInfo || {};
  const displayEpisode = episodeNumberFromApi || getDisplayEpisodeNumber(tap_slug);
  const tenPhim = finalPhimInfo.ten_phim;
  const tenKhac = finalPhimInfo.ten_khac;
  const poster = finalPhimInfo.poster_url;
  const banner = finalPhimInfo.banner_url;
  const mota = movie?.mo_ta;
  const autoSkipCookie = Astro2.cookies.get("autoSkipIntro")?.value === "1";
  const sortEpisode = Astro2.cookies.get("sortEpisode")?.value !== "0";
  const pageUrl = Astro2.url.href;
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$Layout, {}, { "default": async ($$result2) => renderTemplate`  ${renderComponent($$result2, "Header", Header, { "client:idle": true, "client:component-hydration": "idle", "client:component-path": "/home/vohaidang/Desktop/tramphim-v2/ui/src/components/Header/Header", "client:component-export": "default" })} ${maybeRenderHead()}<main class="main-content-wrapper"> <div class="player-section-flex"> <section class="player-container-section"> ${renderComponent($$result2, "VideoPlayer", VideoPlayer, { "client:load": true, "originalUrl": finalVideoUrl, "slug": slug, "ngonngu": ngon_ngu, "sotap": tap_slug, "banner": banner, "poster": poster, "ten_phim": tenPhim, "activeServer": finalServer, "vietsubEpisodes": vietsubData, "thuyetminhEpisodes": thuyetminhData, "skipTimes": { intro: { end: skipIntroTime || 60 }, recap: null }, "client:component-hydration": "load", "client:component-path": "/home/vohaidang/Desktop/tramphim-v2/ui/src/components/VideoPlayer/VideoPlayer", "client:component-export": "default" })} ${renderComponent($$result2, "ServerButtons", ServerButtons, { "client:idle": true, "slug": slug, "so_tap": tap_slug, "ngon_ngu": ngon_ngu, "finalServer": finalServer, "hasSv1Video": hasSv1Video, "hasSv2Video": hasSv2Video, "hasSv3Video": hasSv3Video, "initialAutoSkip": autoSkipCookie, "client:component-hydration": "idle", "client:component-path": "/home/vohaidang/Desktop/tramphim-v2/ui/src/components/ServerButton/ServerButtons", "client:component-export": "default" })} </section> </div> <div class="movie-detail-divider"> ${renderComponent($$result2, "MovieDetail", MovieDetail, { "movie": movie, "client:load": true, "client:component-hydration": "load", "client:component-path": "/home/vohaidang/Desktop/tramphim-v2/ui/src/components/MovieDetail/MovieDetailPlayer", "client:component-export": "default" })} </div> <div class="episode-and-sidebar-flex"> <section class="episode-list-column"> ${renderComponent($$result2, "Episodes", Episodes, { "client:idle": true, "vietsub": vietsubData, "thuyetminh": thuyetminhData, "longtieng": longtiengData, "slug": slug, "movieTitle": tenPhim, "currentEpisodeSlug": tap_slug, "currentType": ngon_ngu, "initialSortAscending": sortEpisode, "client:component-hydration": "idle", "client:component-path": "/home/vohaidang/Desktop/tramphim-v2/ui/src/components/EposideList/EpisodeList", "client:component-export": "default" })} <div class="comment-section-padding"> <h2 class="comment-section-title">Bình Luận Phim</h2> ${renderComponent($$result2, "FacebookComments", FacebookComments, { "url": pageUrl, "client:visible": true, "client:component-hydration": "visible", "client:component-path": "/home/vohaidang/Desktop/tramphim-v2/ui/src/components/FacebookComments", "client:component-export": "default" })} </div> <div class="recommend-section-wrapper"> ${renderComponent($$result2, "RecommendMovies", MovieCard, { "movies": deXuatData?.data, "title": "\u0110\u1EC1 Xu\u1EA5t Cho B\u1EA1n", "client:idle": true, "loading": false, "error": null, "client:component-hydration": "idle", "client:component-path": "/home/vohaidang/Desktop/tramphim-v2/ui/src/components/Recommended_Movies/RecommendedMovies", "client:component-export": "default" })} </div> </section> <aside class="sidebar-column"> ${renderComponent($$result2, "TopMovies", TopMovies, { "movies": topData?.data ?? [], "client:idle": true, "client:component-hydration": "idle", "client:component-path": "/home/vohaidang/Desktop/tramphim-v2/ui/src/components/TopMovies/TopMovies", "client:component-export": "default" })} </aside> </div> </main> <footer> ${renderComponent($$result2, "Footer", Footer, {})} </footer> `, "head": async ($$result2) => renderTemplate`${renderComponent($$result2, "Fragment", Fragment$1, { "slot": "head" }, { "default": async ($$result3) => renderTemplate` ${renderComponent($$result3, "Seo", $$SeoXemPhim, { "tenPhim": tenPhim, "tenKhac": tenKhac, "currentEpisode": displayEpisode, "currentType": ngon_ngu, "thumbnail": poster, "slug": slug, "mota": mota })} ` })}` })}`;
}, "/home/vohaidang/Desktop/tramphim-v2/ui/src/pages/xem-phim/[slug]/[tap_slug]/[ngon_ngu].astro", void 0);

const $$file = "/home/vohaidang/Desktop/tramphim-v2/ui/src/pages/xem-phim/[slug]/[tap_slug]/[ngon_ngu].astro";
const $$url = "/xem-phim/[slug]/[tap_slug]/[ngon_ngu]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$ngonNgu,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
