import React, { useState, useEffect, useRef } from "react";

const CommentBox = ({ url }) => {
  const [showComments, setShowComments] = useState(false);
  const fbRef = useRef(null);

  useEffect(() => {
    if (showComments && window.FB && fbRef.current) {
      window.FB.XFBML.parse(fbRef.current);
    }
  }, [showComments]);

  return (
    <div className="border-6 mb-4 rounded-[4px] bg-white pt-1">
      <h3 className="border-b border-gray-200 px-4 py-2 text-lg font-semibold text-black">
        Bình luận phim
      </h3>

      <div className="px-4 py-2">
        <button
          onClick={() => setShowComments(!showComments)}
          className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          {showComments ? "Ẩn bình luận" : "Hiện bình luận"}
        </button>
      </div>

      {showComments && (
        <div className="px-4" ref={fbRef}>
          <div
            className="fb-comments"
            data-href={url || window.location.href}
            data-width="100%"
            data-numposts="10"
            data-colorscheme="light"
          ></div>
        </div>
      )}
    </div>
  );
};

export default CommentBox;
