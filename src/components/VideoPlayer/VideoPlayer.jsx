import { useRef, useEffect, useCallback, useState } from "react";
import Artplayer from "artplayer";
import Hls from "hls.js";

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

    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    const request = index.openCursor(
      IDBKeyRange.upperBound(twoDaysAgo.toISOString()),
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
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      return { url: originalLink, success: false };
    }

    const playlistData = await response.text();

    if (playlistData.includes("#EXTM3U")) {
      const blob = new Blob([playlistData], {
        type: "application/vnd.apple.mpegurl",
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
      end: 60,
    },
    recap: null,
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
  // State để lưu trữ thời điểm cần tiếp tục phát
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
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
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
          lastUpdated: savedData.lastUpdated || null,
        };
      }
      return null;
    } catch (error) {
      console.error("Lỗi khi lấy progress từ IndexedDB:", error);
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
          lastUpdated: new Date().toISOString(),
          slug,
          sotap,
          ngonngu,
          poster,
          banner,
          ten_phim,
        };

        await saveProgressToDB(dataToSave);
        if (Math.random() < 0.1) {
          cleanupOldProgress();
        }
      } catch (error) {
        console.error("Không thể lưu progress:", error);
      }
    },
    [getProgressKey, slug, sotap, ngonngu, poster, ten_phim, banner, isIframe],
  );

  const findNextEpisodeUrl = useCallback(() => {
    // sotap là slug (ví dụ: 'tap-01')
    const currentEpisodeSlug = sotap;
    const currentEpisodeType = ngonngu;

    const episodesList =
      currentEpisodeType === "vietsub" ? vietsubEpisodes : thuyetminhEpisodes;

    // --- HELPER FUNCTION: Trích xuất số tập để sắp xếp ---
    const getEpisodeNumber = (ep) => {
      // Lấy từ tap_phim.so_tap (ví dụ: "Tập 01")
      const epNumStr = (ep.tap_phim?.so_tap || ep.so_tap || "").toString();
      // Dùng Regex để tìm số (vd: "Tập 01" -> "01")
      const match = epNumStr.match(/\d+/);
      return match ? parseInt(match[0], 10) : 0;
    };
    // ----------------------------------------------------

    // 1. Lọc và Sắp xếp danh sách tập
    const filteredAndSortedList = episodesList
      .filter((ep) => {
        // Lọc các tập không phải là số (như "full" hoặc "" rỗng)
        const epNum = (ep.tap_phim?.so_tap || ep.so_tap || "")
          .toString()
          .toLowerCase();
        return !["full", "fullhd", "hd", ""].includes(epNum);
      })
      .sort((a, b) => getEpisodeNumber(a) - getEpisodeNumber(b)); // Sắp xếp theo số tập đã trích xuất

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
    const currentTime = new Date().getTime();
    const seekTime = 5;

    if (!art._lastTap) art._lastTap = 0;
    const tapLength = currentTime - art._lastTap;
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
    art._lastTap = currentTime;
  }, []);

  const handleResumePlayback = (resumeTime) => {
    const art = artRef.current;
    if (art) {
      art.seek = resumeTime;
      art.play(); // Play only when user clicks "Xem Tiếp"
      setShowResumePopup(false);
    }
  };

  const handleRestartPlayback = () => {
    const art = artRef.current;
    if (art) {
      art.seek = 0;
      art.play(); // Play only when user clicks "Xem Lại từ đầu"
      setShowResumePopup(false);
    }
  };

  useEffect(() => {
    if (isIframe || !videoSource || !containerRef.current || isLoading) {
      return;
    }

    if (artRef.current) {
      if (artRef.current.template && artRef.current.template.$video) {
        artRef.current.template.$video.removeEventListener(
          "touchend",
          handleTouchAction,
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
        crossOrigin: "anonymous",
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
        `,
      },
      customType: {
        m3u8: function (video, url) {
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
        },
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
          mounted: function ($control) {
            const art = this;
            const playBtn = $control.querySelector(".play");
            const pauseBtn = $control.querySelector(".pause");
            $control.addEventListener("click", () => {
              art.toggle();
            });
            art.on("play", () => {
              playBtn.classList.add("hidden");
              pauseBtn.classList.remove("hidden");
            });
            art.on("pause", () => {
              playBtn.classList.remove("hidden");
              pauseBtn.classList.add("hidden");
            });
          },
          tooltip: "Phát/Tạm dừng",
        },
        {
          position: "left",
          html: `<button aria-label="Lùi 10 giây" class="art-icon art-icon-backward art-mobile-hide text-white hover:text-[#ffd785]" >
                  <svg class="w-6 h-6 xmlns="http://www.w3.org/2000/svg" viewBox="0 0 56 56"><path fill="currentColor" d="M28 54.402c13.055 0 23.906-10.828 23.906-23.906c0-11.531-8.437-21.305-19.383-23.46v-3.33c0-1.664-1.148-2.11-2.437-1.195l-7.477 5.226c-1.054.75-1.078 1.875 0 2.649l7.453 5.25c1.313.937 2.461.492 2.461-1.196v-3.35c8.86 2.015 15.375 9.914 15.375 19.406A19.84 19.84 0 0 1 28 50.418c-11.063 0-19.945-8.86-19.922-19.922c.023-6.656 3.258-12.539 8.25-16.101c.961-.727 1.266-1.829.656-2.813c-.562-.96-1.851-1.219-2.883-.422C8.055 15.543 4.094 22.621 4.094 30.496c0 13.078 10.828 23.906 23.906 23.906m5.648-14.039c3.891 0 6.446-3.68 6.446-9.304c0-5.672-2.555-9.399-6.446-9.399s-6.445 3.727-6.445 9.399c0 5.625 2.555 9.304 6.445 9.304m-12.21-.281c.913 0 1.5-.633 1.5-1.617V23.723c0-1.149-.61-1.875-1.665-1.875c-.633 0-1.078.21-1.922.773l-3.257 2.18c-.516.375-.774.797-.774 1.36c0 .773.61 1.429 1.36 1.429c.445 0 .656-.094 1.125-.422l2.18-1.594v12.89c0 .962.585 1.618 1.452 1.618m12.21-2.555c-2.062 0-3.398-2.46-3.398-6.468c0-4.079 1.312-6.563 3.398-6.563c2.11 0 3.375 2.461 3.375 6.563c0 4.007-1.289 6.468-3.375 6.468"/></svg>
                  </button>`,
          mounted: function ($control) {
            const art = this;
            $control.addEventListener("click", () => {
              art.seek = Math.max(0, art.currentTime - 10);
            });
          },
          tooltip: "Lùi 10s",
        },

        {
          position: "left",
          html: `<button aria-label="Tiến 10 giây" class="art-icon art-icon-forward art-mobile-hide text-white hover:text-[#ffd785]" >
                    <svg class="w-6 h-6"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 56 56"><path fill="currentColor" d="M28 54.402c13.055 0 23.906-10.828 23.906-23.906c0-7.875-3.984-14.953-10.008-19.336c-1.03-.797-2.32-.539-2.906.422c-.586.984-.281 2.086.656 2.813c4.993 3.562 8.25 9.445 8.274 16.101C47.945 41.56 39.039 50.418 28 50.418c-11.063 0-19.899-8.86-19.899-19.922c0-9.492 6.516-17.39 15.376-19.406v3.375c0 1.664 1.148 2.11 2.413 1.195l7.5-5.25c1.055-.726 1.079-1.851 0-2.625l-7.476-5.25c-1.29-.937-2.437-.492-2.437 1.196v3.304C12.507 9.168 4.094 18.965 4.094 30.496c0 13.078 10.828 23.906 23.906 23.906m5.672-14.039c3.89 0 6.422-3.68 6.422-9.304c0-5.672-2.532-9.399-6.422-9.399s-6.445 3.727-6.445 9.399c0 5.625 2.554 9.304 6.445 9.304m-12.235-.281c.914 0 1.524-.633 1.524-1.617V23.723c0-1.149-.633-1.875-1.688-1.875c-.633 0-1.054.21-1.922.773l-3.234 2.18c-.539.375-.773.797-.773 1.36c0 .773.609 1.429 1.359 1.429c.422 0 .656-.094 1.125-.422l2.18-1.594v12.89c0 .962.562 1.618 1.43 1.618m12.235-2.555c-2.086 0-3.399-2.46-3.399-6.468c0-4.079 1.29-6.563 3.399-6.563c2.086 0 3.351 2.461 3.351 6.563c0 4.007-1.289 6.468-3.351 6.468"/></svg>
                  </button>`,
          mounted: function ($control) {
            const art = this;
            $control.addEventListener("click", () => {
              art.seek = Math.min(art.duration, art.currentTime + 10);
            });
          },
          tooltip: "Tiến 10s",
        },
        {
          position: "right",
          html: `<button aria-label="Tập kế tiếp" class="art-icon art-icon-next-episode text-white hover:text-[#ffd785]" >
                 <svg class="lg:w-6 lg:h-6 h-5 w-5" height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
           <path fill="currentColor" d="m4.028 20.882a1 1 0 0 0 1.027-.05l12-8a1 1 0 0 0 0-1.664l-12-8a1 1 0 0 0 -1.555.832v16a1 1 0 0 0 .528.882zm1.472-15.013 9.2 6.131-9.2 6.131z"></path>
           <path fill="currentColor" d="m19.5 19a1 1 0 0 0 1-1v-12a1 1 0 0 0 -2 0v12a1 1 0 0 0 1 1z"></path>
          </svg>
          
                  </button>`,
          mounted: function ($control) {
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
          tooltip: `Tập kế tiếp`,
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
          mounted: function ($control) {
            const art = this;
            $control.addEventListener("click", () => {
              if (document.pictureInPictureElement) {
                document.exitPictureInPicture();
              } else {
                art.play();
                art.video.requestPictureInPicture();
              }
            });
          },
          tooltip: "Hình trong hình (PIP)",
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
          mounted: function ($control) {
            const art = this;
            const volumeBtn = $control.querySelector(".art-icon-volume");
            const volumeRangeContainer = $control.querySelector(
              ".art-custom-volume-control",
            );
            const volumeRange = $control.querySelector(".art-volume-range");
            const volumeHighSvg = $control.querySelector(".volumn-high");
            const volumeMuteSvg = $control.querySelector(".volumn-mute");

            let lastVolume = 1;

            volumeRange.style.setProperty("--val", `${art.volume * 100}%`);

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
                if (art.volume > 0) {
                  lastVolume = art.volume;
                  art.volume = 0;
                  volumeRange.value = 0;
                  volumeRange.style.setProperty("--val", "0%");
                } else {
                  art.volume = lastVolume;
                  volumeRange.value = lastVolume;
                  volumeRange.style.setProperty(
                    "--val",
                    `${lastVolume * 100}%`,
                  );
                }
              }
            });

            volumeRange.addEventListener("input", (e) => {
              art.volume = e.target.value;
              e.target.style.setProperty("--val", `${e.target.value * 100}%`);
            });

            art.on("volumechange", () => {
              volumeRange.value = art.volume;
              volumeRange.style.setProperty("--val", `${art.volume * 100}%`);

              if (art.volume === 0 || art.muted) {
                volumeHighSvg.classList.add("hidden");
                volumeMuteSvg.classList.remove("hidden");
              } else {
                volumeHighSvg.classList.remove("hidden");
                volumeMuteSvg.classList.add("hidden");
              }
            });

            if (art.volume === 0) {
              volumeHighSvg.classList.add("hidden");
              volumeMuteSvg.classList.remove("hidden");
            } else {
              volumeHighSvg.classList.remove("hidden");
              volumeMuteSvg.classList.add("hidden");
            }
            volumeRange.value = art.volume;
          },
          tooltip: "Âm lượng",
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
          mounted: function ($control) {
            const art = this;
            const fullscreenIn = $control.querySelector(".fullscreen-in");
            const fullscreenOut = $control.querySelector(".fullscreen-out");

            $control.addEventListener("click", () => {
              art.fullscreen = !art.fullscreen;
            });

            art.on("fullscreen", (state) => {
              if (state) {
                if (fullscreenIn) fullscreenIn.classList.add("hidden");
                if (fullscreenOut) fullscreenOut.classList.remove("hidden");
              } else {
                if (fullscreenIn) fullscreenIn.classList.remove("hidden");
                if (fullscreenOut) fullscreenOut.classList.add("hidden");
              }
            });
          },
          tooltip: "Toàn màn hình",
        },
      ],
    });

    artRef.current = art;

    art.on("ready", async () => {
      const progressData = await getProgressFromIndexedDB();
      if (progressData && progressData.progress > 0) {
        // Show the resume playback popup instead of seeking immediately
        setShowResumePopup(true);
        // Lưu lại thời điểm cần tiếp tục vào state, chưa seek vội
        setResumeTimeState(progressData.progress);
        // Video sẽ tự động seek đến thời điểm này khi popup hiện lên,
        // nhưng sẽ không tự động play do `autoplay: false` ở trên.
        art.seek = progressData.progress;
      } else {
        // Nếu không có progress cũ, tự động play ngay.
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

          if (
            autoSkipIntro &&
            currentTimeInSeconds > 1 &&
            !hasSkippedIntro.current
          ) {
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
          }, 1000);
        }
      }
    });

    art.on("play", () => {
      let progressSaveInterval = setInterval(async () => {
        if (art && art.duration && art.currentTime > 0) {
          await saveProgressToIndexedDB(art.currentTime, art.duration);
        }
      }, 30000);
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
      if (
        artRef.current &&
        artRef.current.duration &&
        artRef.current.currentTime > 0
      ) {
        await saveProgressToIndexedDB(
          artRef.current.currentTime,
          artRef.current.duration,
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
            handleTouchAction,
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
    autoSkipIntro,
  ]);

  const handleCustomBannerClick = () => {
    setPlayerInitialized(true);
  };

  return (
    <div
      className={`group relative z-[10] aspect-[16/9] w-full overflow-hidden rounded-none bg-black lg:aspect-[16/9] 2xl:aspect-[16/8] ${
        isIntroTime ? "art-intro-progress" : ""
      }`}
    >
      {error && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black bg-opacity-75">
          <p className="p-4 text-center text-lg text-red-500">{error}</p>
        </div>
      )}

      {!playerInitialized && !isIframe ? (
        <button
          type="button"
          onClick={handleCustomBannerClick}
          className="absolute inset-0 flex cursor-pointer items-center justify-center"
          aria-label="Phát video"
        >
          <img
            src={banner}
            alt={`Banner phim ${ten_phim ?? ""}`.trim() || "Banner phim"}
            className="absolute inset-0 h-full w-full object-cover"
            loading="eager"
            decoding="async"
            fetchPriority="high"
          />
          <span className="absolute inset-0 bg-black/30" aria-hidden="true" />
          <span className="relative z-10 text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              at
              viewBox="0 0 1408 1600"
              className="h-12 w-12 lg:h-14 lg:w-14"
              aria-hidden="true"
            >
              <path
                fill="currentColor"
                d="M1384 831L56 1569q-23 13-39.5 3T0 1536V64q0-26 16.5-36T56 31l1328 738q23 13 23 31t-23 31"
              />
            </svg>
          </span>
        </button>
      ) : isIframe ? (
        <iframe
          src={originalUrl}
          title={`Trình phát ${ten_phim ?? "video"}`}
          allowFullScreen
          className="h-full w-full"
          referrerPolicy="origin"
          sandbox="allow-forms allow-pointer-lock allow-same-origin allow-scripts allow-top-navigation-by-user-activation"
          allow="autoplay; encrypted-media; picture-in-picture"
        />
      ) : (
        <>
          <div ref={containerRef} className="h-full w-full" />
          {showSkipIntro && (
            <div className="absolute b bottom-12 right-2 z-[100] lg:bottom-20 lg:right-6 lg:transition-all lg:duration-500 lg:ease-in-out lg:hover:scale-105">
              <button
                onClick={handleSkipIntro}
                className="rounded border bg-black/50 px-2 py-1 lg:p-2 text-[10px] font-semibold text-white transition-colors lg:text-sm"
              >
                <span>Bỏ qua giới thiệu</span>
              </button>
            </div>
          )}
          {/* 
{showResumePopup && (
  <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-70">
    <div className="rounded-lg bg-[#23252b] p-6 text-center text-white">
      <p className="mb-4 text-sm md:text-base">
        Bạn đang xem tới phút{" "}
        <span className="font-bold">
          {formatTime(resumeTimeState)}{" "}
          {/* Sử dụng resumeTimeState *-/}
        </span>
        , bạn có muốn xem tiếp không?
      </p>
      <div className="flex justify-center gap-4">
        <button
          onClick={() => handleResumePlayback(resumeTimeState)}
          className="rounded-md bg-sky-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-sky-600 md:text-base"
        >
          Xem Tiếp
        </button>
        <button
          onClick={handleRestartPlayback}
          className="rounded-md border border-gray-400 px-4 py-2 text-xs font-semibold text-gray-200 transition hover:bg-gray-700 md:text-base"
        >
          Xem Lại từ đầu
        </button>
      </div>
    </div>
  </div>
)}
*/}
        </>
      )}
    </div>
  );
};

export default VideoPlayer;
