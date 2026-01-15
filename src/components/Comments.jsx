import React, { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "../context/AuthProvider";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_BASE_URL = import.meta.env.PUBLIC_API_BASE_URL;

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

  return (
    <form onSubmit={handleSubmit} className="mt-3">
      <textarea
        ref={textareaRef}
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="Viết trả lời..."
        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-sky-400 resize-none"
        rows="2"
      />
      <div className="flex gap-2 mt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-1 bg-sky-400 text-white rounded text-sm font-medium hover:bg-sky-500 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? "Đang gửi..." : "Gửi"}
        </button>
        <button
          type="button"
          onClick={() => {
            setText("");
            onCancel?.();
          }}
          className="px-4 py-1 bg-white/10 text-gray-300 rounded text-sm font-medium hover:bg-white/20 transition-colors"
        >
          Hủy
        </button>
      </div>
    </form>
  );
});

const Comments = ({ slug }) => {
  const { user, loading: authLoading } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [expandedReplies, setExpandedReplies] = useState({});
  const [isMounted, setIsMounted] = useState(false);

  // Fetch comments
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

  // Scroll to comment if there's a hash in the URL
  useEffect(() => {
    const scrollToHash = () => {
      const hash = window.location.hash;
      if (hash && comments.length > 0) {
        const targetId = hash.substring(1).replace('binh_luan_', ''); // Get comment ID

        // Check if this is a reply by finding it in comments
        const targetComment = comments.find(c => c.id === targetId);

        // Retry mechanism to wait for element to appear in DOM
        const scrollToElement = (attempt = 0) => {
          const element = document.getElementById(hash.substring(1));
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // Add highlight effect
            element.classList.add('ring-2', 'ring-sky-400', 'bg-white/10');
            setTimeout(() => {
              element.classList.remove('ring-2', 'ring-sky-400', 'bg-white/10');
            }, 3000);
          } else if (attempt < 15) {
            // If it's a reply and not expanded yet, expand it
            if (attempt === 0 && targetComment && targetComment.parent_id) {
              setExpandedReplies(prev => ({
                ...prev,
                [targetComment.parent_id]: true
              }));
            }
            // Retry up to 15 times with 400ms intervals (total 6 seconds)
            setTimeout(() => scrollToElement(attempt + 1), 400);
          }
        };

        // Start scrolling attempts immediately
        scrollToElement();
      }
    };

    // Scroll on mount and when comments load
    scrollToHash();

    // Listen for hash changes
    const handleHashChange = () => scrollToHash();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [comments]);

  // Submit main comment
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
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          slug: slug,
          noi_dung: commentText,
          parent: null,
        }),
      });

      if (response.ok) {
        const newComment = await response.json();
        // Only add if it's a top-level comment
        if (!newComment.parent_id) {
          setComments([newComment, ...comments]);
        }
        setCommentText("");
        toast.success("Bình luận đã được thêm!");
      } else {
        const errorText = await response.text();
        console.error("API error response:", errorText);

        // Check if it's a 500 error - the comment might still have been created
        if (response.status === 500) {
          // Wait and refresh to check if comment was created
          setTimeout(async () => {
            await fetchComments();
            setCommentText("");
            toast.success("Bình luận đã được thêm!");
          }, 500);
        } else {
          try {
            const errorData = JSON.parse(errorText);
            toast.error(errorData.detail || "Lỗi khi thêm bình luận");
          } catch (e) {
            toast.error(`Lỗi ${response.status}: ${errorText || "Lỗi khi thêm bình luận"}`);
          }
        }
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
      // Check if this is likely a CORS error - if so, still try to refresh comments
      // as the backend may have processed the request
      if (error.message && (error.message.includes("CORS") || error.message.includes("Failed to fetch"))) {
        // Wait a moment and try to refresh comments
        setTimeout(() => fetchComments(), 500);
      } else {
        toast.error("Lỗi khi gửi bình luận");
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Delete comment
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Bạn có chắc muốn xóa bình luận này? Hành động này không thể hoàn tác.")) {
      return;
    }

    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(`${API_BASE_URL}/api/binhluan/${commentId}/`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setComments(comments.filter(c => c.id !== commentId));
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

  // Submit reply
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
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          slug: slug,
          noi_dung: text,
          parent: parentId,
        }),
      });

      if (response.ok) {
        // Refresh all comments to get the updated structure with replies
        await fetchComments();
        setReplyingTo(null);
        onSuccess?.();
        toast.success("Trả lời đã được thêm!");
      } else {
        const errorText = await response.text();
        console.error("API error response:", errorText);

        // Check if it's a 500 error - the reply might still have been created
        if (response.status === 500) {
          // Wait and refresh to check if reply was created
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
      // Check if this is likely a CORS error - if so, still try to refresh comments
      // as the backend may have processed the request
      if (error.message && (error.message.includes("CORS") || error.message.includes("Failed to fetch"))) {
        // Wait a moment and try to refresh comments
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

  // Toggle replies visibility
  const toggleReplies = (commentId) => {
    setExpandedReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return "Vừa xong";
    if (minutes < 60) return `${minutes} phút trước`;
    if (hours < 24) return `${hours} giờ trước`;
    if (days < 7) return `${days} ngày trước`;
    return date.toLocaleDateString("vi-VN");
  };

  // Comment item component
  const CommentItem = ({ comment, allComments, isReply = false }) => {
    // Find replies for this comment from all comments
    const replies = allComments?.filter(c => c.parent_id === comment.id) || [];

    return (
      <div className={`flex gap-3 ${isReply ? "ml-8" : "mb-6"}`} id={`binh_luan_${comment.id}`}>
        {/* Avatar */}
        <div className="flex-shrink-0">
          {comment.nguoi_dung?.anh_dai_dien_url ? (
            <img
              src={comment.nguoi_dung.anh_dai_dien_url}
              alt={comment.nguoi_dung.username}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-white/10"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
              {comment.nguoi_dung?.username?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Comment content */}
        <div className="flex-1">
          <div className="bg-white/5 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <span className="font-medium text-white">
                {comment.nguoi_dung?.username}
              </span>
              <span className="text-xs text-gray-400">
                {formatDate(comment.thoi_gian)}
              </span>
            </div>
            <p className="text-sm text-gray-200 mt-2 break-words">
              {comment.noi_dung}
            </p>
          </div>

          {/* Reply and Delete buttons */}
          <div className="flex gap-2 mt-2">
            {!isReply && (
              <button
                onClick={() => setReplyingTo(comment.id)}
                className="text-xs text-gray-400 hover:text-sky-300 transition-colors"
              >
                Trả lời
              </button>
            )}

            {user && user.id === comment.nguoi_dung.id && (
              <button
                onClick={() => handleDeleteComment(comment.id)}
                className="text-xs text-gray-400 hover:text-red-400 transition-colors"
              >
                Xóa
              </button>
            )}
          </div>

          {/* Reply form */}
          {replyingTo === comment.id && (
            <ReplyForm
              parentId={comment.id}
              isSubmitting={submitting}
              onSubmit={(text, reset) =>
                handleSubmitReply(comment.id, text, () => {
                  reset();
                })
              }
              onCancel={() => setReplyingTo(null)}
            />
          )}

          {/* Nested replies */}
          {replies.length > 0 && (
            <div className="mt-4">
              <button
                onClick={() => toggleReplies(comment.id)}
                className="text-xs text-gray-400 hover:text-sky-300 transition-colors"
              >
                {expandedReplies[comment.id]
                  ? "Ẩn trả lời"
                  : `Xem ${replies.length} trả lời`}
              </button>
              {expandedReplies[comment.id] && (
                <div className="mt-3 space-y-3">
                  {replies.map((reply) => (
                    <CommentItem
                      key={reply.id}
                      comment={reply}
                      allComments={allComments}
                      isReply={true}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  const topLevelComments = comments.filter((comment) => !comment.parent_id);

  return (
    <div className="w-full mt-10">
      {/* Comment Header */}
      <div className="flex items-center gap-3 mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
        </svg>
        <h2 className="text-lg font-bold text-white tracking-wide">
          Bình luận <span className="text-gray-500 font-medium ml-1">({comments.length})</span>
        </h2>
      </div>

      {/* Login Prompt & Input Area */}
      <div className="rounded-xl overflow-hidden bg-[#16161b] border border-white/5">
        {!isMounted ? (
          <div className="p-8 text-center text-gray-500 text-sm">Đang tải bình luận...</div>
        ) : !user ? (
          <div className="p-4 border-b border-white/5">
            <p className="text-xs text-gray-500">
              Vui lòng <a href="/dang-nhap" className="text-yellow-500/80 font-bold hover:underline">đăng nhập</a> để tham gia bình luận.
            </p>
          </div>
        ) : null}

        <div className="relative">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Viết bình luận..."
            className="w-full bg-transparent px-5 py-4 text-sm text-gray-200 placeholder-gray-600 outline-none resize-none min-h-[100px]"
            disabled={!user}
          />

          {/* Action Bar inside Input Area */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-white/5">
            <button className="flex items-center gap-2 text-gray-600 hover:text-gray-400 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
              <span className="text-xs font-bold uppercase tracking-widest">Thêm GIF</span>
            </button>

            <button
              onClick={handleSubmitComment}
              disabled={submitting || !commentText.trim() || !user}
              className="flex items-center gap-2 text-gray-600 hover:text-white transition-all disabled:opacity-30"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 -rotate-45" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
              <span className="text-xs font-bold uppercase tracking-widest">{submitting ? "Đang gửi..." : "Gửi"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Comments list */}
      <div className="mt-10 space-y-6">
        {loading ? (
          <div className="text-center py-8 text-gray-500 text-sm italic">Đang tải bình luận...</div>
        ) : topLevelComments.length === 0 ? (
          <div className="text-center py-20 bg-white/2 rounded-3xl border border-dashed border-white/5">
            <p className="text-gray-600 text-sm">Chưa có bình luận nào. Hãy là người đầu tiên!</p>
          </div>
        ) : (
          <div className="space-y-8">
            {topLevelComments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                allComments={comments}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Comments;
