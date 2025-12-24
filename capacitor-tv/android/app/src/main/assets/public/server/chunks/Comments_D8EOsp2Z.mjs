import { jsx, jsxs } from 'react/jsx-runtime';
import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { u as useAuth } from './Header_CYtzV8Xx.mjs';
import { toast } from 'react-toastify';
/* empty css                          */

const alarmGif = new Proxy({"src":"/_astro/alarm.D274mdJn.gif","width":150,"height":150,"format":"gif"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "E:/tramphim/tramphim-frontend/src/assets/alarm.gif";
							}
							
							return target[name];
						}
					});

const eposideGif = new Proxy({"src":"/_astro/eposide.CaavVmCT.gif","width":72,"height":72,"format":"gif"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "E:/tramphim/tramphim-frontend/src/assets/eposide.gif";
							}
							
							return target[name];
						}
					});

const setCookie = (name, value, days) => {
  let expires = "";
  {
    const date = /* @__PURE__ */ new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1e3);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value) + expires + "; path=/; SameSite=Lax";
};
const SortIcon = ({ isAscending }) => /* @__PURE__ */ jsx(
  "svg",
  {
    xmlns: "http://www.w3.org/2000/svg",
    className: `h-4 w-4 transition-transform duration-200 ${isAscending ? "rotate-0" : "rotate-180"}`,
    width: "256",
    height: "256",
    viewBox: "0 0 256 256",
    children: /* @__PURE__ */ jsxs("g", { fill: "currentColor", children: [
      /* @__PURE__ */ jsx("path", { d: "M224 80v88l-24 24H48V64h160a16 16 0 0 1 16 16", opacity: "0.2" }),
      /* @__PURE__ */ jsx("path", { d: "M128 128a8 8 0 0 1-8 8H48a8 8 0 0 1 0-16h72a8 8 0 0 1 8 8M48 72h136a8 8 0 0 0 0-16H48a8 8 0 0 0 0 16m56 112H48a8 8 0 0 0 0 16h56a8 8 0 0 0 0-16m125.66-21.66a8 8 0 0 0-11.32 0L192 188.69V112a8 8 0 0 0-16 0v76.69l-26.34-26.35a8 8 0 0 0-11.32 11.32l40 40a8 8 0 0 0 11.32 0l40-40a8 8 0 0 0 0-11.32" })
    ] })
  }
);
const Episodes = ({
  vietsub = [],
  thuyetminh = [],
  longtieng = [],
  movieTitle = "",
  slug,
  currentEpisodeSlug = "",
  currentType = "",
  thongbao,
  initialSortAscending = true
}) => {
  const hasVietsub = vietsub.length > 0;
  const hasThuyetminh = thuyetminh.length > 0;
  const hasLongtieng = longtieng.length > 0;
  const initialShowCount = 40;
  const [sortAscending, setSortAscending] = useState(initialSortAscending);
  const vietsubSortAscending = sortAscending;
  const thuyetminhSortAscending = sortAscending;
  const longtiengSortAscending = sortAscending;
  const [vietsubShowCount, setVietsubShowCount] = useState(initialShowCount);
  const [thuyetminhShowCount, setThuyetminhShowCount] = useState(initialShowCount);
  const [longtiengShowCount, setLongtiengShowCount] = useState(initialShowCount);
  const [vietsubSearchQuery, setVietsubSearchQuery] = useState("");
  const [thuyetminhSearchQuery, setThuyetminhSearchQuery] = useState("");
  const [longtiengSearchQuery, setLongtiengSearchQuery] = useState("");
  const toggleSortAscending = () => {
    setSortAscending((prev) => {
      const newSortState = !prev;
      setCookie("sortEpisode", newSortState ? "1" : "0", 365);
      return newSortState;
    });
  };
  if (!hasVietsub && !hasThuyetminh && !hasLongtieng) {
    return /* @__PURE__ */ jsx("div", { className: "z-20 p-2 text-center text-sm font-medium text-gray-400", children: "Phim này hiện đang cập nhật. Vui lòng quay lại sau!" });
  }
  const sortedAndFilteredVietsub = useMemo(() => {
    let filtered = vietsub.filter(
      (ep) => (ep.tap_phim?.so_tap || ep.so_tap || "").toString().toLowerCase().includes(vietsubSearchQuery.toLowerCase())
    );
    if (!vietsubSortAscending) {
      return filtered.slice().reverse();
    }
    return filtered;
  }, [vietsub, vietsubSearchQuery, vietsubSortAscending]);
  const sortedAndFilteredThuyetminh = useMemo(() => {
    let filtered = thuyetminh.filter(
      (ep) => (ep.tap_phim?.so_tap || ep.so_tap || "").toString().toLowerCase().includes(thuyetminhSearchQuery.toLowerCase())
    );
    if (!thuyetminhSortAscending) {
      return filtered.slice().reverse();
    }
    return filtered;
  }, [thuyetminh, thuyetminhSearchQuery, thuyetminhSortAscending]);
  const sortedAndFilteredLongtieng = useMemo(() => {
    let filtered = longtieng.filter(
      (ep) => (ep.tap_phim?.so_tap || ep.so_tap || "").toString().toLowerCase().includes(longtiengSearchQuery.toLowerCase())
    );
    if (!longtiengSortAscending) {
      return filtered.slice().reverse();
    }
    return filtered;
  }, [longtieng, longtiengSearchQuery, longtiengSortAscending]);
  const getDisplayTypeName = (displayType) => {
    switch (displayType) {
      case "vietsub":
        return "Vietsub";
      case "thuyetminh":
        return "Thuyết Minh";
      case "longtieng":
        return "Lồng Tiếng";
      default:
        return "";
    }
  };
  const renderEpisodeButton = (ep, displayType) => {
    const tap_slug = ep.tap_phim?.slug || "1";
    const soTapRaw = ep.tap_phim?.so_tap || ep.so_tap || "1";
    const soTapDisplay = soTapRaw.toString();
    const href = `/xem-phim/${slug}/${tap_slug}/${displayType}`;
    const isCurrentEpisode = currentEpisodeSlug && currentType && tap_slug === currentEpisodeSlug && displayType === currentType;
    const buttonClasses = `
     relative flex items-center justify-center rounded-[4px] p-2.5 text-center text-[13px] lg:text-sm font-medium transition-colors duration-200
     ${isCurrentEpisode ? "bg-[#252525] shadow-lg text-sky-300" : "bg-[#252525] text-gray-200 hover:text-sky-300"}
  `;
    return /* @__PURE__ */ jsx(
      "a",
      {
        href,
        className: buttonClasses,
        title: `Tập ${soTapDisplay} - ${movieTitle} (${getDisplayTypeName(
          displayType
        )})`,
        children: /* @__PURE__ */ jsxs("div", { className: "flex flex-row items-center justify-center gap-2", children: [
          isCurrentEpisode && /* @__PURE__ */ jsx(
            "img",
            {
              src: eposideGif.src,
              alt: "Playing",
              className: "absolute bottom-0 left-1 h-4 w-4",
              style: {
                filter: "invert(38%) sepia(96%) saturate(2073%) hue-rotate(179deg) brightness(94%) contrast(102%)"
              }
            }
          ),
          /* @__PURE__ */ jsx("span", { children: `${soTapDisplay}` })
        ] })
      },
      ep.id
    );
  };
  const renderShowMoreButton = (count, total, setFunction) => {
    const hiddenCount = total - count;
    if (hiddenCount <= 0) {
      return null;
    }
    return /* @__PURE__ */ jsx(
      "button",
      {
        onClick: () => setFunction(total),
        className: "rounded-[4px] bg-[#252525] p-2.5 text-center text-[13px] font-medium text-gray-200 transition-colors hover:text-sky-300 lg:text-sm",
        children: "Xem thêm"
      }
    );
  };
  const renderCollapseButton = (count, initialCount, setFunction) => {
    if (count <= initialCount) {
      return null;
    }
    return /* @__PURE__ */ jsx(
      "button",
      {
        onClick: () => setFunction(initialCount),
        className: "rounded-[4px] bg-[#252525] p-2.5 text-center text-[13px] font-medium text-gray-200 transition-colors hover:text-sky-300 lg:text-sm",
        children: "Rút gọn"
      }
    );
  };
  const renderSortButton = (currentSortAscending) => /* @__PURE__ */ jsx(
    "button",
    {
      onClick: toggleSortAscending,
      className: "rounded bg-[#353535] p-1 text-white transition-colors duration-200 hover:text-sky-300",
      title: currentSortAscending ? "Sắp xếp Giảm dần (Mới nhất)" : "Sắp xếp Tăng dần (Cũ nhất)",
      children: /* @__PURE__ */ jsx(SortIcon, { isAscending: currentSortAscending })
    }
  );
  return /* @__PURE__ */ jsxs("div", { className: "z-20 space-y-4", children: [
    thongbao && /* @__PURE__ */ jsxs("div", { className: "!my-8 flex w-full flex-row items-center gap-4 rounded-lg bg-gradient-to-r from-[#4158D0] to-[#C850C0] p-2 text-sm text-white", children: [
      /* @__PURE__ */ jsx("div", { className: "flex-shrink-0 rounded-full bg-[#0005]", children: /* @__PURE__ */ jsx("img", { src: alarmGif.src, alt: "Thông Báo", className: "h-8 w-8" }) }),
      /* @__PURE__ */ jsx(
        "span",
        {
          className: "text-base",
          dangerouslySetInnerHTML: { __html: thongbao.noidung }
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: " flex flex-col gap-8", children: [
      hasVietsub && /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            " ",
            /* @__PURE__ */ jsx("h2", { className: "font-seogoe text-lg font-medium text-white lg:text-xl", children: "Vietsub" }),
            renderSortButton(vietsubSortAscending)
          ] }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              placeholder: "Tìm tập...",
              value: vietsubSearchQuery,
              onChange: (e) => setVietsubSearchQuery(e.target.value),
              className: "w-28 rounded-[4px] border border-gray-600 bg-[#252525] p-1 px-2 text-xs text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-sky-300"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-2 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-6 lg:gap-4 xl:grid-cols-7", children: [
          sortedAndFilteredVietsub.slice(
            0,
            vietsubSearchQuery ? sortedAndFilteredVietsub.length : vietsubShowCount
          ).map((ep) => renderEpisodeButton(ep, "vietsub")),
          vietsubSearchQuery === "" && renderShowMoreButton(
            vietsubShowCount,
            sortedAndFilteredVietsub.length,
            setVietsubShowCount
          ),
          vietsubSearchQuery === "" && renderCollapseButton(
            vietsubShowCount,
            initialShowCount,
            setVietsubShowCount
          )
        ] })
      ] }),
      hasThuyetminh && /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            " ",
            /* @__PURE__ */ jsx("h2", { className: "font-seogoe text-lg font-medium text-white lg:text-xl", children: "Thuyết Minh" }),
            renderSortButton(thuyetminhSortAscending)
          ] }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              placeholder: "Tìm tập...",
              value: thuyetminhSearchQuery,
              onChange: (e) => setThuyetminhSearchQuery(e.target.value),
              className: "w-28 rounded-[4px] border border-gray-600 bg-[#252525] p-1 px-2 text-xs text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-sky-300"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-2 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-6 lg:gap-4 xl:grid-cols-7", children: [
          sortedAndFilteredThuyetminh.slice(
            0,
            thuyetminhSearchQuery ? sortedAndFilteredThuyetminh.length : thuyetminhShowCount
          ).map((ep) => renderEpisodeButton(ep, "thuyetminh")),
          thuyetminhSearchQuery === "" && renderShowMoreButton(
            thuyetminhShowCount,
            sortedAndFilteredThuyetminh.length,
            setThuyetminhShowCount
          ),
          thuyetminhSearchQuery === "" && renderCollapseButton(
            thuyetminhShowCount,
            initialShowCount,
            setThuyetminhShowCount
          )
        ] })
      ] }),
      hasLongtieng && /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            " ",
            /* @__PURE__ */ jsx("h2", { className: "font-seogoe text-lg font-medium text-white lg:text-xl", children: "Lồng Tiếng" }),
            renderSortButton(longtiengSortAscending)
          ] }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              placeholder: "Tìm tập...",
              value: longtiengSearchQuery,
              onChange: (e) => setLongtiengSearchQuery(e.target.value),
              className: "w-28 rounded-[4px] border border-gray-600 bg-[#252525] p-1 px-2 text-xs text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-sky-300"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-2 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-6 lg:gap-4 xl:grid-cols-7", children: [
          sortedAndFilteredLongtieng.slice(
            0,
            longtiengSearchQuery ? sortedAndFilteredLongtieng.length : longtiengShowCount
          ).map((ep) => renderEpisodeButton(ep, "longtieng")),
          longtiengSearchQuery === "" && renderShowMoreButton(
            longtiengShowCount,
            sortedAndFilteredLongtieng.length,
            setLongtiengShowCount
          ),
          longtiengSearchQuery === "" && renderCollapseButton(
            longtiengShowCount,
            initialShowCount,
            setLongtiengShowCount
          )
        ] })
      ] })
    ] })
  ] });
};

const API_BASE_URL = "https://api.tramphim.com";
const ReplyForm = React.memo(({ parentId, isSubmitting, onSubmit, onCancel }) => {
  const [text, setText] = useState("");
  const textareaRef = useRef(null);
  useEffect(() => {
    textareaRef.current?.focus();
  }, [parentId]);
  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) {
      toast.error("Vui lòng nhập nội dung trả lời");
      return;
    }
    await onSubmit(trimmed, () => setText(""));
  };
  return /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "mt-3", children: [
    /* @__PURE__ */ jsx(
      "textarea",
      {
        ref: textareaRef,
        value: text,
        onChange: (event) => setText(event.target.value),
        placeholder: "Viết trả lời...",
        className: "w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-sky-400 resize-none",
        rows: "2"
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-2 mt-2", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "submit",
          disabled: isSubmitting,
          className: "px-4 py-1 bg-sky-400 text-white rounded text-sm font-medium hover:bg-sky-500 transition-colors disabled:opacity-50",
          children: isSubmitting ? "Đang gửi..." : "Gửi"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => {
            setText("");
            onCancel?.();
          },
          className: "px-4 py-1 bg-white/10 text-gray-300 rounded text-sm font-medium hover:bg-white/20 transition-colors",
          children: "Hủy"
        }
      )
    ] })
  ] });
});
const Comments = ({ slug }) => {
  const { user} = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [expandedReplies, setExpandedReplies] = useState({});
  const [isMounted, setIsMounted] = useState(false);
  const fetchComments = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/binhluan/phim/${slug}/`);
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      } else {
        console.error("Failed to fetch comments");
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  }, [slug]);
  useEffect(() => {
    setIsMounted(true);
    fetchComments();
  }, [fetchComments]);
  useEffect(() => {
    const scrollToHash = () => {
      const hash = window.location.hash;
      if (hash && comments.length > 0) {
        const targetId = hash.substring(1).replace("binh_luan_", "");
        const targetComment = comments.find((c) => c.id === targetId);
        const scrollToElement = (attempt = 0) => {
          const element = document.getElementById(hash.substring(1));
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "center" });
            element.classList.add("ring-2", "ring-sky-400", "bg-white/10");
            setTimeout(() => {
              element.classList.remove("ring-2", "ring-sky-400", "bg-white/10");
            }, 3e3);
          } else if (attempt < 15) {
            if (attempt === 0 && targetComment && targetComment.parent_id) {
              setExpandedReplies((prev) => ({
                ...prev,
                [targetComment.parent_id]: true
              }));
            }
            setTimeout(() => scrollToElement(attempt + 1), 400);
          }
        };
        scrollToElement();
      }
    };
    scrollToHash();
    const handleHashChange = () => scrollToHash();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [comments]);
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Vui lòng đăng nhập để bình luận");
      return;
    }
    if (!commentText.trim()) {
      toast.error("Vui lòng nhập bình luận");
      return;
    }
    setSubmitting(true);
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(`${API_BASE_URL}/api/binhluan/add/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          slug,
          noi_dung: commentText,
          parent: null
        })
      });
      if (response.ok) {
        const newComment = await response.json();
        if (!newComment.parent_id) {
          setComments([newComment, ...comments]);
        }
        setCommentText("");
        toast.success("Bình luận đã được thêm!");
      } else {
        const errorText = await response.text();
        console.error("API error response:", errorText);
        if (response.status === 500) {
          setTimeout(async () => {
            await fetchComments();
            setCommentText("");
            toast.success("Bình luận đã được thêm!");
          }, 500);
        } else {
          try {
            const errorData = JSON.parse(errorText);
            toast.error(errorData.detail || "Lỗi khi thêm bình luận");
          } catch (e2) {
            toast.error(`Lỗi ${response.status}: ${errorText || "Lỗi khi thêm bình luận"}`);
          }
        }
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
      if (error.message && (error.message.includes("CORS") || error.message.includes("Failed to fetch"))) {
        setTimeout(() => fetchComments(), 500);
      } else {
        toast.error("Lỗi khi gửi bình luận");
      }
    } finally {
      setSubmitting(false);
    }
  };
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Bạn có chắc muốn xóa bình luận này? Hành động này không thể hoàn tác.")) {
      return;
    }
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(`${API_BASE_URL}/api/binhluan/${commentId}/`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (response.ok) {
        setComments(comments.filter((c) => c.id !== commentId));
        toast.success("Xóa bình luận thành công!");
      } else {
        const errorData = await response.json();
        toast.error(errorData.detail || "Lỗi khi xóa bình luận");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Lỗi khi xóa bình luận");
    }
  };
  const handleSubmitReply = async (parentId, text, onSuccess) => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để trả lời");
      return;
    }
    setSubmitting(true);
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(`${API_BASE_URL}/api/binhluan/add/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          slug,
          noi_dung: text,
          parent: parentId
        })
      });
      if (response.ok) {
        await fetchComments();
        setReplyingTo(null);
        onSuccess?.();
        toast.success("Trả lời đã được thêm!");
      } else {
        const errorText = await response.text();
        console.error("API error response:", errorText);
        if (response.status === 500) {
          setTimeout(async () => {
            await fetchComments();
            setReplyingTo(null);
            onSuccess?.();
            toast.success("Trả lời đã được thêm!");
          }, 500);
        } else {
          try {
            const errorData = JSON.parse(errorText);
            toast.error(errorData.detail || "Lỗi khi thêm trả lời");
          } catch (e) {
            toast.error(`Lỗi ${response.status}: ${errorText || "Lỗi khi thêm trả lời"}`);
          }
        }
      }
    } catch (error) {
      console.error("Error submitting reply:", error);
      if (error.message && (error.message.includes("CORS") || error.message.includes("Failed to fetch"))) {
        setTimeout(async () => {
          await fetchComments();
          setReplyingTo(null);
          onSuccess?.();
        }, 500);
      } else {
        toast.error("Lỗi khi gửi trả lời");
      }
    } finally {
      setSubmitting(false);
    }
  };
  const toggleReplies = (commentId) => {
    setExpandedReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = /* @__PURE__ */ new Date();
    const seconds = Math.floor((now - date) / 1e3);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    if (seconds < 60) return "Vừa xong";
    if (minutes < 60) return `${minutes} phút trước`;
    if (hours < 24) return `${hours} giờ trước`;
    if (days < 7) return `${days} ngày trước`;
    return date.toLocaleDateString("vi-VN");
  };
  const CommentItem = ({ comment, allComments, isReply = false }) => {
    const replies = allComments?.filter((c) => c.parent_id === comment.id) || [];
    return /* @__PURE__ */ jsxs("div", { className: `flex gap-3 ${isReply ? "ml-8" : "mb-6"}`, id: `binh_luan_${comment.id}`, children: [
      /* @__PURE__ */ jsx("div", { className: "flex-shrink-0", children: comment.nguoi_dung?.anh_dai_dien_url ? /* @__PURE__ */ jsx(
        "img",
        {
          src: comment.nguoi_dung.anh_dai_dien_url,
          alt: comment.nguoi_dung.username,
          className: "w-10 h-10 rounded-full object-cover ring-2 ring-white/10"
        }
      ) : /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold", children: comment.nguoi_dung?.username?.charAt(0).toUpperCase() }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-white/5 rounded-lg p-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx("span", { className: "font-medium text-white", children: comment.nguoi_dung?.username }),
            /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-400", children: formatDate(comment.thoi_gian) })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-200 mt-2 break-words", children: comment.noi_dung })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2 mt-2", children: [
          !isReply && /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setReplyingTo(comment.id),
              className: "text-xs text-gray-400 hover:text-sky-300 transition-colors",
              children: "Trả lời"
            }
          ),
          user && user.id === comment.nguoi_dung.id && /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => handleDeleteComment(comment.id),
              className: "text-xs text-gray-400 hover:text-red-400 transition-colors",
              children: "Xóa"
            }
          )
        ] }),
        replyingTo === comment.id && /* @__PURE__ */ jsx(
          ReplyForm,
          {
            parentId: comment.id,
            isSubmitting: submitting,
            onSubmit: (text, reset) => handleSubmitReply(comment.id, text, () => {
              reset();
            }),
            onCancel: () => setReplyingTo(null)
          }
        ),
        replies.length > 0 && /* @__PURE__ */ jsxs("div", { className: "mt-4", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => toggleReplies(comment.id),
              className: "text-xs text-gray-400 hover:text-sky-300 transition-colors",
              children: expandedReplies[comment.id] ? "Ẩn trả lời" : `Xem ${replies.length} trả lời`
            }
          ),
          expandedReplies[comment.id] && /* @__PURE__ */ jsx("div", { className: "mt-3 space-y-3", children: replies.map((reply) => /* @__PURE__ */ jsx(
            CommentItem,
            {
              comment: reply,
              allComments,
              isReply: true
            },
            reply.id
          )) })
        ] })
      ] })
    ] });
  };
  const topLevelComments = comments.filter((comment) => !comment.parent_id);
  return /* @__PURE__ */ jsxs("div", { className: "w-full max-w-4xl mx-auto rounded-lg bg-white/5 p-6 border border-white/10", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-white mb-6", children: "Bình Luận" }),
    !isMounted ? /* @__PURE__ */ jsx("div", { className: "mb-8 p-4 bg-white/5 rounded-lg border border-white/10 text-center", children: /* @__PURE__ */ jsx("p", { className: "text-gray-400", children: "Đang tải..." }) }) : user ? /* @__PURE__ */ jsx("form", { onSubmit: handleSubmitComment, className: "mb-8", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
      /* @__PURE__ */ jsx("div", { className: "flex-shrink-0", children: user.anh_dai_dien_url ? /* @__PURE__ */ jsx(
        "img",
        {
          src: user.anh_dai_dien_url,
          alt: user.username,
          className: "w-10 h-10 rounded-full object-cover ring-2 ring-white/10"
        }
      ) : /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold", children: user.username?.charAt(0).toUpperCase() }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsx(
          "textarea",
          {
            value: commentText,
            onChange: (e) => setCommentText(e.target.value),
            placeholder: "Chia sẻ ý kiến của bạn...",
            className: "w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-sky-400 resize-none",
            rows: "3"
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "flex justify-end mt-3", children: /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            disabled: submitting || !commentText.trim(),
            className: "px-6 py-2 bg-sky-400 text-white rounded-lg font-medium hover:bg-sky-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
            children: submitting ? "Đang gửi..." : "Bình luận"
          }
        ) })
      ] })
    ] }) }) : /* @__PURE__ */ jsxs("div", { className: "mb-8 p-4 bg-white/5 rounded-lg border border-white/10 text-center", children: [
      /* @__PURE__ */ jsx("p", { className: "text-gray-300 mb-4", children: "Vui lòng đăng nhập để bình luận" }),
      /* @__PURE__ */ jsx(
        "a",
        {
          href: "/dang-nhap",
          className: "inline-block px-6 py-2 bg-sky-400 text-white rounded-lg font-medium hover:bg-sky-500 transition-colors",
          children: "Đăng nhập"
        }
      )
    ] }),
    loading ? /* @__PURE__ */ jsx("div", { className: "text-center py-8 text-gray-400", children: "Đang tải bình luận..." }) : topLevelComments.length === 0 ? /* @__PURE__ */ jsx("div", { className: "text-center py-8 text-gray-400", children: "Chưa có bình luận nào. Hãy là người đầu tiên bình luận!" }) : /* @__PURE__ */ jsx("div", { className: "space-y-0", children: topLevelComments.map((comment) => /* @__PURE__ */ jsx(
      CommentItem,
      {
        comment,
        allComments: comments
      },
      comment.id
    )) })
  ] });
};

export { Comments as C, Episodes as E, alarmGif as a };
