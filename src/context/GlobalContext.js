import React from "react";

const GlobalContext = React.createContext({
  user: null,
  category: null,
  setCategory: () => {},
  cachedData: {},
  dispatchCachedData: () => {},
  initialLoading: true,
  showLoading: false,
  setShowLoading: () => {},
  toastMessage: null,
  setToastMessage: () => {},
});

export default GlobalContext;
