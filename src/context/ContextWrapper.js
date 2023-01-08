import React, { useEffect } from "react";
import GlobalContext from "./GlobalContext";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/FirebaseConfig";
import { getItem, setItem } from "../firebase/FirebaseService";

function cachedDataReducer(state, { type, payload }) {
  switch (type) {
    case "user":
      return { ...state, user: [...state.user, payload] };
    case "post":
      return { ...state, post: [...state.post, payload] };
    default:
      return state;
  }
}

export default function ContextWrapper({ children }) {
  const [user, setUser] = React.useState(null);
  const [category, setCategory] = React.useState(null);
  const [initialLoading, setInitialLoading] = React.useState(true);
  const [showLoading, setShowLoading] = React.useState(false);
  const [cachedData, dispatchCachedData] = React.useReducer(cachedDataReducer, {
    user: [],
    post: [],
  });
  const [toastMessage, setToastMessage] = React.useState(null);

  useEffect(
    () =>
      onAuthStateChanged(auth, (user) => {
        if (user) {
          getItem("sharePicAppUsers", user.uid)
            .then((docSnap) => {
              if (docSnap.exists()) {
                setUser(docSnap.data());
                setInitialLoading(false);
              } else {
                const _user = {
                  id: user.uid,
                  displayName: user.displayName,
                  email: user.email,
                  displayImage: {
                    medium: user.photoURL,
                    small: user.photoURL,
                  },
                };
                setItem("sharePicAppUsers", user.uid, _user)
                  .then((docRef) => {
                    setUser(_user);
                    setInitialLoading(false);
                  })
                  .catch((error) => {
                    console.error("Error adding user: ", error);
                    setInitialLoading(false);
                    setToastMessage(
                      "Something went wrong. Please try again later!"
                    );
                  });
              }
            })
            .catch((error) => {
              console.error("Error adding user: ", error);
              setInitialLoading(false);
              setToastMessage("Something went wrong. Please try again later!");
            });
        } else {
          setUser(null);
          setInitialLoading(false);
        }
      }),
    []
  );

  return (
    <GlobalContext.Provider
      value={{
        user,
        cachedData,
        dispatchCachedData,
        category,
        setCategory,
        initialLoading,
        showLoading,
        setShowLoading,
        toastMessage,
        setToastMessage,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
