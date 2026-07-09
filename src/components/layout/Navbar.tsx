"use client";
import { useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { NAV_ITEMS } from "@/data/home";
import Image from "next/image";
import Button from "../ui/Button";
import { containerVariants } from "@/lib/animation";
import Link from "next/link";
import AuthModal from "../AuthModal";
import MenuSidebar from "./MenuSidebar";
import SearchDrawer from "./SearchDrawer";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import ProfileMenu from "./ProfileMenu";
import { signOut } from "next-auth/react";
import { setUserData } from "@/redux/userSlice";
import { setVehicles } from "@/redux/vehicleSlice";

const Navbar = () => {
  const { scrollY } = useScroll();
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [isFloating, setIsFloating] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const { userData } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();

  useMotionValueEvent(scrollY, "change", (currentScrollY) => {
    if (currentScrollY === 0) {
      setIsNavVisible(true);
      setIsFloating(false);
    } else if (currentScrollY > lastScrollY) {
      setIsNavVisible(false);
      setIsFloating(true);
    } else if (currentScrollY < lastScrollY) {
      setIsNavVisible(true);
      setIsFloating(true);
    }
    setLastScrollY(currentScrollY);
  });

  const handleSignOut = async () => {
    try {
      dispatch(setUserData(null));
      dispatch(setVehicles(null));
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      console.error("Sign out processing exception:", error);
    }
  };

  let currentVariant = "visibleFull";
  if (!isNavVisible) currentVariant = "hidden";
  else if (isFloating) currentVariant = "visibleFloating";

  return (
    <>
      <motion.div
        variants={containerVariants}
        animate={currentVariant}
        initial="visibleFull"
        className="fixed left-0 right-0 mx-auto z-50 min-h-[9vh] text-primary flex items-center justify-center"
      >
        <div className="hidden lg:grid relative w-full flex-1 self-stretch grid-cols-8">
          <div className="col-span-1 border-r-[0.5px] border-white/30 flex items-center justify-end">
            <a
              href=""
              className="relative w-30 h-[9vh] flex items-center justify-end bg-transparent"
            >
              <Image
                src="/nav-logo.svg"
                alt="GLIDE Logo"
                fill
                className="object-cover object-right"
                priority
              />
            </a>
          </div>

          {userData?.role !== "admin" && (
            <>
              <div className="col-span-4 flex items-center justify-center gap-8 text-[15px] tracking-tighter uppercase px-4 border-r-[0.5px] border-white/30">
                {NAV_ITEMS.map((item, index) => {
                  const href =
                    item === "Home"
                      ? "/"
                      : `/${item.toLowerCase().replace(/\s+/g, "-")}`;

                  return (
                    <Link
                      key={index}
                      href={href}
                      className="relative group hover:opacity-70 py-1"
                    >
                      {item}
                      <div className="absolute left-0 bottom-0 h-px w-0 origin-left rounded-sm bg-current opacity-0 transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:w-full group-hover:opacity-100" />
                    </Link>
                  );
                })}
              </div>

              <div className="col-span-2 flex items-center px-4">
                <div className="relative flex items-center w-full max-w-100">
                  <input
                    type="text"
                    placeholder="SEARCH"
                    className="relative h-[7vh] w-full border-none p-3 text-[12px] tracking-widest placeholder-primary/80 uppercase focus:outline-none focus:border-none transition-all duration-200 bg-transparent"
                  />
                </div>
              </div>
            </>
          )}

          <div className={`col-span-1 border-l-[0.5px] border-white/20 flex justify-start items-center text-[14px] tracking-tighter uppercase pl-2 ${userData?.role === 'admin' ? "pl-[75vw]" : ""}`}>
            {userData ? (
              <ProfileMenu
                userData={userData}
                isMobile={false}
                handleLogOut={handleSignOut}
              />
            ) : (
              <Button
                variant="transparent"
                size="lg"
                onClick={() => setAuthOpen(true)}
              >
                Log In
              </Button>
            )}
          </div>
        </div>

        {/* MOBILE & TABLET NAVBAR LAYOUT                                            */}
        <div className="flex lg:hidden relative w-full flex-1 self-stretch items-center justify-between px-4 sm:px-6 md:px-8">
          {/* Left Action: Menu Trigger & Logo */}

          {userData?.role !== "admin" ? (
            <div className="flex items-center gap-3 md:gap-5">
              <button
                onClick={() => setIsSidebarOpen(true)}
                aria-label="Open Navigation Menu"
                className="p-2 -ml-2 text-primary hover:opacity-70 transition-opacity focus:outline-none flex items-center justify-center cursor-pointer"
              >
                <svg
                  className="w-6 h-6 sm:w-7 sm:h-7"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>

              <a
                href=""
                className="relative w-24 h-[5vh] sm:w-28 sm:h-[6vh] flex items-center bg-transparent"
              >
                <Image
                  src="/nav-logo.svg"
                  alt="GLIDE Logo"
                  fill
                  className="object-contain object-left"
                  priority
                />
              </a>
            </div>
          ) : (
            <div className="flex items-center gap-3 md:gap-5">
              <a
                href=""
                className="relative w-24 h-[5vh] sm:w-28 sm:h-[6vh] flex items-center bg-transparent"
              >
                <Image
                  src="/nav-logo.svg"
                  alt="GLIDE Logo"
                  fill
                  className="object-contain object-left"
                  priority
                />
              </a>
            </div>
          )}

          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search"
              className="p-2 text-primary hover:opacity-70 transition-opacity focus:outline-none flex items-center justify-center cursor-pointer"
            >
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>

            {userData ? (
              <ProfileMenu
                userData={userData}
                isMobile={true}
                handleLogOut={handleSignOut}
              />
            ) : (
              <Button
                variant="transparent"
                size="sm"
                onClick={() => setAuthOpen(true)}
                className="text-[12px] sm:text-[13px] tracking-tighter uppercase px-2 sm:px-3"
              >
                Log In
              </Button>
            )}
          </div>
        </div>
      </motion.div>

      {/* MOBILE / TABLET SIDEBAR DRAWER & OVERLAY (LEFT SIDE) */}
      {userData?.role !== "admin" && (
        <AnimatePresence>
          {isSidebarOpen && (
            <MenuSidebar handleClick={() => setIsSidebarOpen(false)} />
          )}
        </AnimatePresence>
      )}

      {/* MOBILE / TABLET SEARCH SIDEBAR DRAWER & OVERLAY (RIGHT SIDE) */}
      <AnimatePresence>
        {isSearchOpen && (
          <SearchDrawer handleClick={() => setIsSearchOpen(false)} />
        )}
      </AnimatePresence>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
};

export default Navbar;