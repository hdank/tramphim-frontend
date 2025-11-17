import React, { useEffect } from "react";

const FacebookComments = ({ url }) => {
  useEffect(() => {
    if (window.FB) {
      window.FB.XFBML.parse();
    }
  }, [url]);

  return (
    <div className="min-h-[100px] w-full rounded-lg bg-white">
      <div
        className="fb-comments"
        data-href={url}
        data-width="100%"
        data-numposts="10"
        data-colorscheme="light"
      ></div>
    </div>
  );
};

export default FacebookComments;
