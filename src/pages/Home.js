import React, { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { breakpointColumnsObj } from "../utils/data";
import { useEffect } from "react";
import {
  getAllPaginatedItems,
  getQueryPaginatedItems,
} from "../firebase/FirebaseService";
import GlobalContext from "../context/GlobalContext";
import MasonryLayout from "../components/MasonryLayout";
import Spinner from "../components/Spinner";
import SideBar from "../components/SideBar";
import Header from "../components/Header";
import { useRef } from "react";

const NO_OF_ITEMS_All_POSTS = 40;

const Home = ({ setSearchParams }) => {
  const [posts, setPosts] = useState([]);
  const [lastPostIndex, setLastPostIndex] = useState(null);

  const [initialLoading, setInitialLoading] = useState(true);
  const [morePostsLoading, setMorePostsLoading] = useState(false);

  const { categoryId } = useParams();

  const loadMoreDivRef = useRef(null);

  const { setToastMessage } = useContext(GlobalContext);

  const getPaginatedPosts = () => {
    if (!morePostsLoading)
      if (categoryId) {
        getQueryPaginatedItems(
          "sharePicAppPosts",
          "category",
          "==",
          categoryId,
          "title",
          lastPostIndex,
          NO_OF_ITEMS_All_POSTS
        )
          .then((querySnapshot) => {
            let _posts = [];
            querySnapshot.forEach((doc) => {
              _posts.push({ ...doc.data(), id: doc.id });
            });
            const newPosts = [...posts, ..._posts];
            setPosts(newPosts);
            setLastPostIndex(querySnapshot.docs[querySnapshot.docs.length - 1]);
          })
          .catch((err) => {
            setToastMessage("Something went wrong. Please try again later!");
          })
          .finally(() => {
            setInitialLoading(false);
            setMorePostsLoading(false);
          });
      } else {
        getAllPaginatedItems(
          "sharePicAppPosts",
          "title",
          lastPostIndex,
          NO_OF_ITEMS_All_POSTS
        )
          .then((querySnapshot) => {
            let _posts = [];
            querySnapshot.forEach((doc) => {
              _posts.push({ ...doc.data(), id: doc.id });
            });
            const newPosts = [...posts, ..._posts];
            setPosts(newPosts);
            setLastPostIndex(querySnapshot.docs[querySnapshot.docs.length - 1]);
          })
          .catch((err) => {
            setToastMessage("Something went wrong. Please try again later!");
          })
          .finally(() => {
            setInitialLoading(false);
            setMorePostsLoading(false);
          });
      }
  };

  useEffect(() => {
    setPosts([]);
    setInitialLoading(true);
    setLastPostIndex(null);
  }, [categoryId]);

  useEffect(() => {
    if (!posts.length && initialLoading && !lastPostIndex) getPaginatedPosts();
  }, [posts, initialLoading, lastPostIndex]);

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
    <div className="w-full h-screen flex flex-col gap-0.5 bg-slate-200">
      <Header />
      <div
        className="flex-1 flex gap-0.5"
        style={{ height: "calc(100% - 70px)" }}
      >
        <SideBar />
        <div className="flex-1 p-2 overflow-y-scroll bg-slate-50">
          {initialLoading ? (
            <div className="w-full h-full flex items-center justify-center">
              <Spinner message={`Loading posts...`} />
            </div>
          ) : posts?.length > 0 ? (
            <>
              <MasonryLayout
                posts={posts}
                breakpointColumnsObj={breakpointColumnsObj}
                setSearchParams={setSearchParams}
              />

              {!morePostsLoading && <div ref={loadMoreDivRef} />}
              <div className="text-center">
                <Spinner message={`Loading more posts...`} />
              </div>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-lg font-medium">
              No Posts
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
