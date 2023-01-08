import React from "react";
import { useNavigate } from "react-router-dom";
import background from "../assets/404-bg.jpg";

const NotFound = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/", { replace: true });
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      <h1
        className="font-black text-transparent bg-cover bg-no-repeat bg-center bg-clip-text"
        style={{
          fontSize: "12rem",
          backgroundImage: `url(${background})`,
        }}
      >
        {`Oops!`}
      </h1>
      <p className="pb-2 font-semibold uppercase">{`404 - PAGE NOT FOUND`}</p>
      <p
        className="pb-5 text-center"
        style={{ width: "600px" }}
      >{`The page you are looking for might  have been removed or is temporarily unavailable.`}</p>
      <div
        className="bg-blue-500 text-white py-3 px-6 rounded-full hover:bg-blue-600 transition cursor-pointer"
        onClick={handleNavigate}
      >
        {`Go To Homepage`}
      </div>
    </div>
  );
};

export default NotFound;
