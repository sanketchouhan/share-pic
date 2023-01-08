import React, { useContext } from "react";
import logoIcon from "../assets/color-logo.png";
import notificationLogo from "../assets/notification.png";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";
import GlobalContext from "../context/GlobalContext";
import { signInWithGoogleService } from "../firebase/FirebaseService";

const Header = () => {
  const { user, setToastMessage } = useContext(GlobalContext);

  const handelSignin = () => {
    signInWithGoogleService().catch((error) => {
      setToastMessage("Error in Sign in. Please try again.");
    });
  };

  return (
    <div className="py-3 px-5 flex gap-5 items-center justify-between bg-white">
      <div className="flex gap-5 items-center">
        <Link to={"/"}>
          <img src={logoIcon} alt="logo" className="w-32" />
        </Link>
      </div>
      <div className="flex items-center gap-5">
        <img
          src={notificationLogo}
          alt="notification"
          className={
            "w-9 h-9 rounded-full cursor-pointer bg-gray-400 p-1.5 hover:bg-gray-500 transition-all"
          }
        />
        {user ? (
          <Link to={`/user/${user.id}`}>
            <img
              src={user.displayImage.small}
              alt="user"
              className="w-9 h-9 rounded-full cursor-pointer"
              title="User"
            />
          </Link>
        ) : (
          <button
            onClick={handelSignin}
            className="flex items-center gap-2 px-4 py-2 cursor-pointer text-gray-600 rounded border shadow-sm hover:shadow-md transition-all"
          >
            <FcGoogle size={18} />
            <span className="hidden sm:block text-sm font-medium">Sign In</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default Header;
