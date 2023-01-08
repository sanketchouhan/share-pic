import React, { useState } from "react";
import userLogo from "../assets/user.png";

function UserShimmer({ photoURL, imageStyle }) {
  const [loading, setLoading] = useState(true);
  return (
    <>
      {loading && <img src={userLogo} className={imageStyle} alt="user" />}
      <img
        className={`${imageStyle} ${loading ? `hidden` : `block`}`}
        src={photoURL}
        alt="user"
        onLoad={() => setLoading(false)}
      />
    </>
  );
}

export default UserShimmer;
