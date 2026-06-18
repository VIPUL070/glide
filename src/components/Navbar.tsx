"use client";
import { useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { NAV_ITEMS } from "@/data/home";
import Image from "next/image";
import Button from "./ui/Button";
import { containerVariants } from "@/lib/animation";
import Link from "next/link";
import AuthModal from "./AuthModal";

const Navbar = () => {
  const { scrollY } = useScroll();
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [isFloating, setIsFloating] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

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
        <div className="relative w-full flex-1 self-stretch grid grid-cols-8">
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

          <div className="col-span-1 border-l-[0.5px] border-white/20 flex  justify-start text-[14px] tracking-tighter uppercase">
            <Button
              variant="transparent"
              size="lg"
              onClick={() => setAuthOpen(true)}
            >
              Log In
            </Button>
          </div>
        </div>
      </motion.div>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
};

export default Navbar;