import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  IoArrowRedoOutline,
  IoClose,
  IoDownloadOutline,
  IoHeart,
  IoHeartOutline,
} from "react-icons/io5";
import {
  getItem,
  getQueryPaginatedItems,
  updateItem,
} from "../firebase/FirebaseService";
import MasonryLayout from "../components/MasonryLayout";
import { detailPostBreakpointColumnsObj } from "../utils/data";
import Spinner from "../components/Spinner";
import GlobalContext from "../context/GlobalContext";
import ImageShimmer from "../components/ImageShimmer";
import UserShimmer from "../components/UserShimmer";
import { arrayRemove, arrayUnion } from "firebase/firestore";

const NO_OF_ITEMS_QUERY_POSTS = 20;

const PostDetail = ({ selectedPostId, setSearchParams, removePostIdParam }) => {
  const [postDetail, setPostDetail] = useState(null);
  const [postLoading, setPostLoading] = useState(true);
  const [postUser, setPostUser] = useState(null);

  const [relatedPosts, setRelatedPosts] = useState([]);
  const [lastPostIndex, setLastPostIndex] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [morePostsLoading, setMorePostsLoading] = useState(false);

  const loadMoreDivRef = useRef(null);

  const navigate = useNavigate();
  const { user, setToastMessage } = useContext(GlobalContext);

  const getPostDetail = () => {
    setPostLoading(true);
    getItem("sharePicAppPosts", selectedPostId)
      .then((docSnap) => {
        if (docSnap.exists()) {
          setPostDetail({ ...docSnap.data(), id: docSnap.id });
          getItem("sharePicAppUsers", docSnap.data().postedBy).then((doc) => {
            setPostUser(doc.data());
          });
        } else {
          setToastMessage("Post not found!");
          navigate("/", { replace: true });
        }
      })
      .catch((err) => {
        setToastMessage("Something went wrong. Please try again later!");
      })
      .finally(() => {
        setPostLoading(false);
      });
  };

  useEffect(() => {
    setPostDetail(null);
    setPostLoading(true);
    setPostUser(null);
    setRelatedPosts([]);
    setInitialLoading(true);
    setLastPostIndex(null);
  }, [selectedPostId]);

  useEffect(() => {
    if (
      (!postDetail,
      postLoading,
      !postUser,
      !relatedPosts.length,
      initialLoading,
      !lastPostIndex)
    )
      getPostDetail();
  }, [
    postDetail,
    postLoading,
    postUser,
    relatedPosts,
    initialLoading,
    lastPostIndex,
  ]);

  const getPaginatedPosts = () => {
    if (postDetail && !morePostsLoading)
      getQueryPaginatedItems(
        "sharePicAppPosts",
        "category",
        "==",
        postDetail.category,
        "title",
        lastPostIndex,
        NO_OF_ITEMS_QUERY_POSTS
      )
        .then((querySnapshot) => {
          let _posts = [];
          querySnapshot.forEach((doc) => {
            _posts.push({ ...doc.data(), id: doc.id });
          });
          const newPosts = [...relatedPosts, ..._posts];
          setRelatedPosts(newPosts);
          setLastPostIndex(querySnapshot.docs[querySnapshot.docs.length - 1]);
        })
        .catch((err) => {
          setToastMessage("Something went wrong. Please try again later!");
        })
        .finally(() => {
          setInitialLoading(false);
          setMorePostsLoading(false);
        });
  };

  useEffect(() => {
    getPaginatedPosts();
  }, [postDetail]);

  const isPostLiked = () => {
    return user && postDetail?.likes.filter((id) => id === user.id).length > 0;
  };

  const updateSavePost = (id) => {
    if (!user) {
      setToastMessage("Please login to continue.");
      return;
    }
    if (!postLoading) {
      setPostLoading(true);
      updateItem("sharePicAppPosts", id, {
        likes: isPostLiked() ? arrayRemove(user.id) : arrayUnion(user.id),
      })
        .then(() => {
          setToastMessage(isPostLiked() ? "Post unliked!" : "Post liked!");
        })
        .catch((err) => {
          setToastMessage("Something went wrong. Please try again later!");
        })
        .finally(() => {
          setPostLoading(false);
        });
    }
  };

  // infinite scroll
  const handleObserver = (entries) => {
    const [entry] = entries;

    if (entry.isIntersecting) {
      setMorePostsLoading(true);
      getPaginatedPosts();
    }
  };

  const option = {
    root: null,
    rootMargin: "0px",
    threshold: 1.0,
  };

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, option);
    if (loadMoreDivRef.current) observer.observe(loadMoreDivRef.current);

    return () => {
      if (loadMoreDivRef.current) observer.observe(loadMoreDivRef.current);
    };
  }, [loadMoreDivRef, option]);

  return (
    <div className="fixed top-0 left-0 w-full h-screen bg-black bg-opacity-75 backdrop-blur-[1px]">
      <div
        className="bg-white m-auto mt-10 rounded-t-xl relative"
        style={{ maxWidth: "900px", height: "calc(100% - 40px)" }}
      >
        <span
          className="absolute top-0 -right-10 cursor-pointer"
          onClick={removePostIdParam}
        >
          <IoClose size={32} color={`#ffffff`} />
        </span>
        <div className="h-full p-5 overflow-y-scroll">
          <Link
            to={`/user/${postUser?.id}`}
            className="flex gap-5 p-5 items-center"
          >
            <UserShimmer
              photoURL={postUser?.displayImage.small}
              imageStyle={"w-12 h-12 rounded-full object-cover"}
            />
            <div className="truncate">
              <p className="font-semibold text-xl capitalize truncate">
                {postUser?.displayName}
              </p>
              <p className="font-normal text-sm truncate text-gray-500">
                {postUser?.email}
              </p>
            </div>
          </Link>
          <ImageShimmer
            imageURL={postDetail?.displayImage.medium}
            imageStyle={
              "w-full object-contain m-auto max-h-[600px] max-w-[600px]"
            }
          />
          <div
            className="flex items-start justify-between gap-5 mt-5 m-auto"
            style={{ maxWidth: "600px" }}
          >
            <h4 className="font-medium text-lg">{postDetail?.title}</h4>
            <div className="flex gap-3 items-center justify-end">
              <span
                className="cursor-pointer"
                onClick={() => updateSavePost(postDetail?.id)}
              >
                {isPostLiked() ? (
                  <IoHeart fontSize={30} color="red" />
                ) : (
                  <IoHeartOutline fontSize={30} color="red" />
                )}
              </span>
              <a
                href={postDetail?.displayImage.medium}
                target="_blank"
                className="outline-none"
                rel="noreferrer"
              >
                <IoArrowRedoOutline fontSize={30} color="gray" />
              </a>
              <a
                href={postDetail?.displayImage.medium}
                download=""
                target={"_blank"}
                className="outline-none"
              >
                <IoDownloadOutline fontSize={30} color="gray" />
              </a>
            </div>
          </div>
          <div className="mt-10">
            <h4 className="text-center font-semibold">Related Posts</h4>
            {initialLoading ? (
              <div className="text-center">
                <Spinner message={`Loading posts...`} />
              </div>
            ) : relatedPosts?.length > 0 ? (
              <>
                <MasonryLayout
                  posts={relatedPosts}
                  breakpointColumnsObj={detailPostBreakpointColumnsObj}
                  setSearchParams={setSearchParams}
                />
                {!morePostsLoading && <div ref={loadMoreDivRef} />}
                <div className="text-center">
                  <Spinner message={`Loading more posts...`} />
                </div>
              </>
            ) : (
              <div className="text-center font-medium mt-5">No post found</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
