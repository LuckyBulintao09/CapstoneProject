"use client";
import { useState, useEffect } from "react";
import { UserIcon } from "@heroicons/react/24/solid";

const Sidebars = ({ activeItem, onItemClick }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <section className="w-full pr-4">
      <div className="flex justify-center items-center py-4 md:hidden ">
        <div className="relative flex rounded-full bg-primary p-1  w-full max-w-lg ">
          <button
            onClick={() => onItemClick("account")}
            className={`${
              activeItem === "account" ? "bg-white text-black" : "text-white"
            } flex-1 py-1 px-2 rounded-full focus:outline-none transition-colors duration-300 text-sm`}
          >
            Account
          </button>
          <button
            onClick={() => onItemClick("hosting-verification")}
            className={`${
              activeItem === "hosting-verification"
                ? "bg-white text-black"
                : "text-white"
            } flex-1 py-1 px-2 rounded-full focus:outline-none transition-colors duration-300 text-sm`}
          >
            Hosting Verification
          </button>
        </div>
      </div>

      <nav className="md:flex flex-col justify-center gap-2 hidden ">
        <div
          onClick={() => onItemClick("account")}
          className={`flex items-center gap-2 p-2 rounded-md cursor-pointer text-sm md:text-base lg:text-md ${
            activeItem === "account"
              ? "bg-primary text-white"
              : "hover:black hover:bg-opacity-30"
          }`}
        >
          <UserIcon className="h-5 w-5" />
          <span>Account</span>
        </div>
        <div
          onClick={() => onItemClick("hosting-verification")}
          className={`flex items-center gap-2 p-2 rounded-md cursor-pointer text-sm md:text-base lg:text-md ${
            activeItem === "hosting-verification"
              ? "bg-primary text-white"
              : "hover:bg-gray-700 hover:bg-opacity-30"
          }`}
        >
          <UserIcon className="h-5 w-5" />
          <span>Hosting Verification</span>
        </div>
      </nav>
    </section>
  );
};

export default Sidebars;
