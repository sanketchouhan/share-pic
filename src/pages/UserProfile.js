import React, { useContext, useState } from "react";
import logoIcon from "../assets/color-logo.png";
import { Link, useNavigate, useParams } from "react-router-dom";
import UserShimmer from "../components/UserShimmer";
import MasonryLayout from "../components/MasonryLayout";
import { useEffect } from "react";
import {
  getItem,
  getQueryItem,
  signOutService,
} from "../firebase/FirebaseService";
import GlobalContext from "../context/GlobalContext";
import { userProfileBreakpointColumnsObj } from "../utils/data";
import Spinner from "../components/Spinner";

const UserProfile = ({ setSearchParams }) => {
  const [userDetails, setUserDetails] = useState(null);
  const [userPostsData, setUserPostsData] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [userDetailsLoading, setUserDetailsLoading] = useState(true);
  const [userPostsLoading, setUserPostsLoading] = useState(false);

  const { userId } = useParams();
  const { user, setToastMessage } = useContext(GlobalContext);
  const navigate = useNavigate();

  const getUserDetails = (userId) => {
    setUserDetailsLoading(true);
    getItem("sharePicAppUsers", userId)
      .then((doc) => {
        if (doc.exists()) {
          setUserDetails({ ...doc.data() });
        } else {
          setToastMessage("User not found!");
          navigate("/", { replace: true });
        }
      })
      .catch((err) => {
        setToastMessage("Something went wrong. Please try again later!");
      })
      .finally(() => {
        setUserDetailsLoading(false);
      });
  };

  const getUserPosts = (userId) => {
    setUserPostsLoading(true);
    getQueryItem("sharePicAppPosts", "postedBy", "==", userId)
      .then((querySnapshot) => {
        let _posts = [];
        querySnapshot.forEach((doc) => {
          _posts.push({ ...doc.data(), id: doc.id });
        });
        let details = {};
        details.posts = _posts.length;
        details.likes = _posts.reduce(
          (acc, post) => (acc += post.likes.length),
          0
        );
        setUserPostsData(details);
        setUserPosts(_posts);
      })
      .catch((err) => {
        setToastMessage("Something went wrong. Please try again later!");
      })
      .finally(() => {
        setUserPostsLoading(false);
      });
  };

  function handleSignOut(e) {
    signOutService().catch((error) => {
      setToastMessage("Error in Sign out. Please try again.");
    });
  }

  useEffect(() => {
    if (userId) {
      getUserDetails(userId);
      getUserPosts(userId);
    }
  }, [userId]);

  return (
    <div className="flex w-full h-screen gap-0.5 bg-slate-200">
      <div className="w-80 flex flex-col items-center p-5 bg-slate-100">
        <Link to={"/"}>
          <img src={logoIcon} alt="logo" className="w-40 pb-20" />
        </Link>
        {userDetailsLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <Spinner message={`Loading profile...`} />
          </div>
        ) : (
          <>
            <UserShimmer
              photoURL={userDetails?.displayImage.medium}
              imageStyle={"rounded-full w-40 h-40 shadow-xl object-cover"}
            />
            <h1 className="font-semibold text-2xl text-center mt-5">
              {userDetails?.displayName}
            </h1>
            <p className="text-base text-center text-gray-500">
              {userDetails?.email}
            </p>

            <div className="w-full grid grid-cols-3 gap-2 mt-10 text-center">
              <div className="">
                <h4 className="font-semibold text-lg">
                  {userPostsData?.posts}
                </h4>
                <p className="text-base text-gray-500">Posts</p>
              </div>
              <div className="">
                <h4 className="font-semibold text-lg">
                  {userPostsData?.likes}
                </h4>
                <p className="text-base text-gray-500">Likes</p>
              </div>
              <div className="">
                <h4 className="font-semibold text-lg">
                  {Math.floor(parseInt(userPostsData?.likes) / 3)}
                </h4>
                <p className="text-base text-gray-500">Shares</p>
              </div>
            </div>
            {user && user.id === userId ? (
              <div
                className="mt-20 py-3 px-10 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600  cursor-pointer"
                onClick={handleSignOut}
              >
                Logout
              </div>
            ) : null}
          </>
        )}
      </div>
      <div className="flex-1 p-5 overflow-y-auto bg-slate-50">
        {userPostsLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <Spinner message={`Loading posts...`} />
          </div>
        ) : (
          <>
            {userPosts?.length > 0 ? (
              <>
                <div className="text-lg font-semibold">Latest Posts</div>
                <MasonryLayout
                  posts={userPosts}
                  breakpointColumnsObj={userProfileBreakpointColumnsObj}
                  setSearchParams={setSearchParams}
                />
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-lg font-medium">
                No Posts
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
