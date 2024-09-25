"use client";

import { useState } from "react";
import { LucideAlignJustify, X } from "lucide-react";
import spiels from "@/lib/constants/spiels";
import Image from "next/image";
import { ModeToggle } from "../mode-toggle";
import { NavbarMenu } from "./NavbarMenu";
import { NavbarModalRegistration } from "./NavbarModalRegistration";
import { NavbarModalLogin } from "./NavbarModalLogin";
import { Button } from "../ui/button";

function NavBar() {
  const [menu, setMenu] = useState(false);
  const [modalType, setModalType] = useState<null | "login" | "register">(null);

  const toggleMenu = () => setMenu((prev) => !prev);
  const openModal = (type: "login" | "register") => {
    setModalType(type);
    setMenu(false);
  };
  const closeModal = () => setModalType(null);

  return (
    <div className="md:sticky md:top-0 md:shadow-lg z-[50] bg-white bg-opacity-80 backdrop-blur-md dark:bg-card">
      {/* DESKTOP */}
      <div className="hidden lg:block animate-in fade-in zoom-in p-4">
        <div className="flex justify-between mx-2 md:mx-[30px] items-center">
          <Image
            src="/Logo.png"
            alt="Logo"
            width={160}
            height={80}
            className="h-8 w-auto scale-[2]"
          />
          <NavbarMenu />
          <div className="flex items-center gap-[6px]">
            <ModeToggle />
            <Button size="sm" onClick={() => openModal("register")}>
              {spiels.BUTTON_SIGN_UP}
            </Button>
          </div>
        </div>
      </div>

      {/* MOBILE */}
      <div className="block lg:hidden shadow-sm fixed top-0 w-full z-[999] bg-white bg-opacity-80 backdrop-blur-md dark:bg-card h-[76px] p-0 m-0">
        <div className="flex justify-between px-4 items-center h-full w-full">
          <Image src="/logo.png" alt="logo" width={80} height={28} />
          <div className="flex items-center gap-[20px]">
            {menu ? (
              <X
                className="cursor-pointer dark:text-white text-black"
                onClick={toggleMenu}
              />
            ) : (
              <LucideAlignJustify
                className="cursor-pointer"
                onClick={toggleMenu}
              />
            )}
            <ModeToggle />
          </div>
        </div>

        {menu && (
          <div className="bg-white dark:bg-card bg-opacity-90 py-4 w-full">
            <div className="flex flex-col gap-8 mt-8 mx-4">
              {spiels.NAVBAR_OVERALL_LIST.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className="hover:text-card cursor-pointer flex items-center gap-2 font-[500] text-gray"
                >
                  {item.label}
                </a>
              ))}
              <a
                onClick={() => openModal("register")}
                className="cursor-pointer"
              >
                {spiels.BUTTON_SIGN_UP}
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {modalType === "register" && (
        <NavbarModalRegistration
          isOpen={modalType === "register"}
          onClose={closeModal}
          openModal={openModal}
        />
      )}
      {modalType === "login" && (
        <NavbarModalLogin
          isOpen={modalType === "login"}
          onClose={closeModal}
          openModal={openModal}
        />
      )}
    </div>
  );
}

export default NavBar;
