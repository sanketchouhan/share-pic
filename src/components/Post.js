import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import GlobalContext from "../context/GlobalContext";
import { getItem, updateItem } from "../firebase/FirebaseService";
import { arrayRemove, arrayUnion } from "firebase/firestore";
import UserShimmer from "./UserShimmer";
import ImageShimmer from "./ImageShimmer";
import { IoArrowRedoOutline, IoHeart, IoHeartOutline } from "react-icons/io5";

function Post({
  post: { title, postedBy, displayImage, id, likes },
  setSearchParams,
}) {
  const [postLoading, setPostLoading] = useState(false);
  const [postLiked, setPostLiked] = useState(false);
  const [postedByUser, setPostedByUser] = useState(null);

  const { user, setToastMessage } = useContext(GlobalContext);

  const handleSetSearchParam = () => {
    setSearchParams({ postId: id });
  };

  const updateSavePost = (id) => {
    if (!user) {
      setToastMessage("Please login to continue.");
      return;
    }
    if (!postLoading) {
      setPostLoading(true);
      updateItem("sharePicAppPosts", id, {
        likes: postLiked ? arrayRemove(user.id) : arrayUnion(user.id),
      })
        .then(() => {
          setToastMessage(postLiked ? "Post unliked!" : "Post liked!");
          setPostLiked(!postLiked);
        })
        .catch((err) => {
          setToastMessage("Something went wrong. Please try again later!");
        })
        .finally(() => {
          setPostLoading(false);
        });
    }
  };

  useEffect(() => {
    getItem("sharePicAppUsers", postedBy).then((doc) => {
      setPostedByUser(doc.data());
    });
  }, [postedBy]);

  useEffect(() => {
    user && setPostLiked(likes.filter((id) => id === user.id).length > 0);
  }, [likes, user]);

  return (
    <div className="mx-2 my-4 p-3 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all">
      <Link
        to={`/user/${postedByUser?.id}`}
        className="flex gap-2 pb-2 items-center"
      >
        <UserShimmer
          photoURL={postedByUser?.displayImage.small}
          imageStyle={"w-9 h-9 rounded-full object-cover"}
        />
        <div className="truncate">
          <p className="font-semibold text-sm capitalize truncate">
            {postedByUser?.displayName}
          </p>
          <p className="font-normal text-xs truncate text-gray-500">
            {postedByUser?.email}
          </p>
        </div>
      </Link>
      <div
        onClick={handleSetSearchParam}
        className="relative cursor-pointer w-auto rounded-lg overflow-hidden transition-all duration-500 ease-in-out"
      >
        <ImageShimmer
          imageURL={displayImage.medium}
          imageStyle={"rounded-lg w-full"}
        />
      </div>
      <div className="py-2 text-sm">{title}</div>
      <hr />
      <div className="flex justify-between pt-2">
        <div className="flex items-center gap-1">
          {postLiked ? (
            <button
              onClick={(e) => {
                updateSavePost(id);
              }}
              type="button"
              className="outline-none"
            >
              <IoHeart fontSize={24} color="red" />
            </button>
          ) : (
            <button
              onClick={(e) => {
                updateSavePost(id);
              }}
              type="button"
              className="outline-none"
            >
              <IoHeartOutline fontSize={24} color="red" />
            </button>
          )}
          <p className="text-sm text-gray-500">{`${
            postLiked ? likes.length + 1 : likes.length
          } ${likes.length > 1 ? `likes` : `like`}`}</p>
        </div>
        <a
          href={displayImage.medium}
          target="_blank"
          className="outline-none"
          rel="noreferrer"
        >
          <IoArrowRedoOutline fontSize={24} color="gray" />
        </a>
      </div>
    </div>
  );
}

export default Post;
