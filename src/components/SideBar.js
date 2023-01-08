import React from "react";
import { Link, useParams } from "react-router-dom";
import { categories } from "../utils/data";

const SideBar = () => {
  const { categoryId } = useParams();

  return (
    <div className="flex flex-col gap-4 p-5 bg-slate-100 overflow-scroll hide-scrollbar">
      {categories.map((category) => (
        <Link key={category.name} to={`/category/${category.id}`} className="">
          <img
            src={category.image}
            alt={category.name}
            title={category.name}
            className={`w-16 h-16 rounded-full shadow-sm mb-1 ${
              categoryId === category.id && `border-2 border-red-500`
            } p-0.5`}
            style={{ minWidth: "4rem" }}
          />
          <p className="text-center text-xs capitalize">{category.name}</p>
        </Link>
      ))}
    </div>
  );
};

export default SideBar;
