import React, { useEffect } from "react";
import GlobalContext from "../context/GlobalContext";

const ToastNotification = () => {
  const { toastMessage, setToastMessage } = React.useContext(GlobalContext);
  const [showMessage, setShowMessage] = React.useState(false);

  useEffect(() => {
    if (toastMessage) {
      setShowMessage(true);

      setTimeout(() => {
        setShowMessage(false);
        setTimeout(() => {
          setToastMessage(null);
        }, 1000);
      }, 3000);
    }
  }, [toastMessage]);

  return (
    <div
      className={`px-5 py-2 rounded-lg text-sm text-center bg-gray-900 bg-opacity-90 text-white font-sans fixed left-2/4 -bottom-10 z-50 ${
        showMessage ? `showToastMessage` : null
      }`}
      style={{
        minWidth: "150px",
        minHeight: "36px",
        transform: "translateX(-50%)",
        transition: "bottom .2s ease",
      }}
    >
      {toastMessage}
    </div>
  );
};

export default ToastNotification;
