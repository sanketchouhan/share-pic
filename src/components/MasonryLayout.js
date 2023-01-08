import React from "react";
import Masonry from "react-masonry-css";
import Post from "./Post";

function MasonryLayout({ posts, breakpointColumnsObj, setSearchParams }) {
  return (
    <Masonry
      className="flex animate-slide-fwd"
      breakpointCols={breakpointColumnsObj}
    >
      {posts?.map((post) => (
        <Post
          key={post.id}
          post={post}
          className="w-max"
          setSearchParams={setSearchParams}
        />
      ))}
    </Masonry>
  );
}

export default MasonryLayout;
