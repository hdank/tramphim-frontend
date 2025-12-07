import { useState, useEffect } from "react";

// Get the API URL from environment or use default
const API_BASE_URL =
  typeof import.meta !== "undefined" && import.meta.env?.PUBLIC_API_BASE_URL
    ? import.meta.env.PUBLIC_API_BASE_URL
    : "https://api.tramphim.com";

// Helper to safely check if we're on native platform
const isNativePlatform = () => {
  try {
    // @ts-ignore
    return window.Capacitor?.isNativePlatform?.() || false;
  } catch {
    return false;
  }
};

/**
 * UpdateChecker component - Checks for app updates on Capacitor apps
 * This component detects if running in a native app context and checks for updates
 */
export default function UpdateChecker() {
  const [updateInfo, setUpdateInfo] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isNativeApp, setIsNativeApp] = useState(false);
  const [isAndroidTV, setIsAndroidTV] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [currentVersionCode, setCurrentVersionCode] = useState(null);

  useEffect(() => {
    checkIfNativeApp();
  }, []);

  const checkIfNativeApp = async () => {
    // Quick check first using window.Capacitor (injected by native app)
    if (!isNativePlatform()) {
      return;
    }

    setIsNativeApp(true);

    // Get the actual app version from native
    let versionCode = 1; // fallback
    try {
      // Dynamic import to avoid issues on web
      const { App } = await import("@capacitor/app");
      const appInfo = await App.getInfo();
      
      // appInfo.build contains the versionCode (as string)
      versionCode = parseInt(appInfo.build, 10) || 1;
      setCurrentVersionCode(versionCode);
    } catch (e) {
      setCurrentVersionCode(1);
    }

    // Detect if running on Android TV
    const isTV = detectAndroidTV();
    setIsAndroidTV(isTV);

    // Check for updates with actual version code
    await checkForUpdates(isTV, versionCode);
  };

  const detectAndroidTV = () => {
    // Check for Android TV using user agent and screen characteristics
    const userAgent = navigator.userAgent.toLowerCase();
    const isLargeScreen = window.screen.width >= 1280;
    const hasNoTouch =
      !("ontouchstart" in window) && navigator.maxTouchPoints === 0;

    // Android TV indicators in user agent
    const tvIndicators = ["android tv", "aftb", "aftt", "afts", "shield"];
    const hasTVIndicator = tvIndicators.some((indicator) =>
      userAgent.includes(indicator)
    );

    return hasTVIndicator || (isLargeScreen && hasNoTouch);
  };

  const checkForUpdates = async (isTV = false, versionCode = 1) => {
    try {
      const platform = isTV ? "android_tv" : "android_mobile";
      const response = await fetch(
        `${API_BASE_URL}/api/app-version/check/${platform}/${versionCode}`
      );

      if (!response.ok) {
        throw new Error("Failed to check for updates");
      }

      const data = await response.json();

      if (data.has_update || data.force_update) {
        setUpdateInfo(data);
        setShowModal(true);

        // If force update, prevent dismissal
        if (data.force_update) {
          setDismissed(false);
        }
      }
    } catch (error) {
      console.error("Error checking for updates:", error);
    }
  };

  const handleUpdate = () => {
    if (updateInfo?.latest_version?.download_url) {
      // Open the download URL in the system browser
      window.open(updateInfo.latest_version.download_url, "_system");
    }
  };

  const handleDismiss = () => {
    // Only allow dismissal for non-force updates
    if (!updateInfo?.force_update) {
      setShowModal(false);
      setDismissed(true);

      // Store dismissal in localStorage to not show again for this session
      try {
        localStorage.setItem(
          `update_dismissed_${updateInfo?.latest_version?.version_code}`,
          Date.now().toString()
        );
      } catch (e) {
        // Ignore localStorage errors
      }
    }
  };

  // Don't render anything if not in native app or no update available
  if (!isNativeApp || !showModal || dismissed) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-[#1e2030] shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-500 to-blue-600 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {updateInfo?.force_update ? "Cập Nhật Bắt Buộc" : "Cập Nhật Mới"}
              </h2>
              <p className="text-sm text-white/80">
                Phiên bản {updateInfo?.latest_version?.version_name}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="mb-4 text-gray-300">{updateInfo?.message}</p>

          {/* Release Notes */}
          {updateInfo?.latest_version?.release_notes && (
            <div className="mb-4 max-h-40 overflow-y-auto rounded-lg bg-[#161824] p-4">
              <h3 className="mb-2 text-sm font-semibold text-sky-400">
                Có gì mới:
              </h3>
              <p className="whitespace-pre-line text-sm text-gray-400">
                {updateInfo.latest_version.release_notes}
              </p>
            </div>
          )}

          {/* File Size */}
          {updateInfo?.latest_version?.file_size && (
            <p className="mb-4 text-sm text-gray-500">
              📦 Kích thước: {updateInfo.latest_version.file_size}
            </p>
          )}

          {/* Force Update Warning */}
          {updateInfo?.force_update && (
            <div className="mb-4 rounded-lg bg-red-500/20 p-3">
              <p className="text-sm text-red-400">
                ⚠️ Phiên bản hiện tại không còn được hỗ trợ. Vui lòng cập nhật để
                tiếp tục sử dụng ứng dụng.
              </p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3">
            {!updateInfo?.force_update && (
              <button
                onClick={handleDismiss}
                className="flex-1 rounded-lg border border-gray-600 px-4 py-3 text-gray-400 transition hover:bg-gray-700"
              >
                Để sau
              </button>
            )}
            <button
              onClick={handleUpdate}
              className={`flex-1 rounded-lg bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-3 font-semibold text-white transition hover:from-sky-600 hover:to-blue-700 ${
                updateInfo?.force_update ? "w-full" : ""
              }`}
            >
              Cập nhật ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
