import React from "react";
import logo from "../assets/color-logo.png";

function InitialLoading() {
  return (
    <div className="bg-white w-full h-screen fixed top-0 right-0 flex flex-col justify-center items-center z-50">
      <div className="p-5">
        <img src={logo} alt="" width="200px" />
      </div>
    </div>
  );
}

export default InitialLoading;
