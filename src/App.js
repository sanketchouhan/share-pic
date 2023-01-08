import React, { useContext } from "react";
import { Routes, Route, useSearchParams } from "react-router-dom";
import InitialLoading from "./components/InitialLoading";
import ToastNotification from "./components/ToastNotification";
import GlobalContext from "./context/GlobalContext";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import PostDetail from "./pages/PostDetail";
import UserProfile from "./pages/UserProfile";

function App() {
  const { initialLoading } = useContext(GlobalContext);

  const [searchParams, setSearchParams] = useSearchParams();
  const selectedPostId = searchParams.get("postId");

  const removePostIdParam = () => {
    if (searchParams.has("postId")) {
      searchParams.delete("postId");
      setSearchParams(searchParams);
    }
  };

  if (initialLoading) return <InitialLoading />;

  return (
    <>
      <Routes>
        <Route path="/" element={<Home setSearchParams={setSearchParams} />} />
        <Route
          path="/category/:categoryId"
          element={<Home setSearchParams={setSearchParams} />}
        />
        <Route
          path="/user/:userId"
          element={<UserProfile setSearchParams={setSearchParams} />}
        />
        <Route path="/*" element={<NotFound />} />
      </Routes>
      {selectedPostId ? (
        <PostDetail
          selectedPostId={selectedPostId}
          setSearchParams={setSearchParams}
          removePostIdParam={removePostIdParam}
        />
      ) : null}
      <ToastNotification />
    </>
  );
}

export default App;
