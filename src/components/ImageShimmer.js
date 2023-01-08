import React, { useState } from "react";
import imageLoading from "../assets/image-loading.gif";

function ImageShimmer({ imageURL, imageStyle }) {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading && <img src={imageLoading} className={imageStyle} alt="post" />}
      <img
        className={`${imageStyle} ${loading ? `hidden` : `block`}`}
        src={imageURL}
        alt="post"
        onLoad={() => setLoading(false)}
      />
    </>
  );
}

export default ImageShimmer;
