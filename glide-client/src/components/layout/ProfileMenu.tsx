"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, LogOut, ChevronRight } from "lucide-react";
import { IUser } from "@/models/User.model";
import { useRouter } from "next/navigation";

interface ProfileMenuProps {
  userData: IUser;
  isMobile?: boolean;
  handleLogOut: () => void;
}

export const ProfileMenu = ({
  userData,
  isMobile = false,
  handleLogOut,
}: ProfileMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const initial = userData?.name ? userData.name.charAt(0).toUpperCase() : "U";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  const handleNavigate = (path: string) => {
    setIsOpen(false);
    router.push(path);
  };

  return (
    <div
      ref={menuRef}
      className="relative flex items-center justify-center h-full"
      onMouseEnter={() => !isMobile && setIsOpen(true)}
      onMouseLeave={() => !isMobile && setIsOpen(false)}
    >
      {/* Profile Trigger Button */}
      <motion.button
        type="button"
        whileTap={{ scale: 0.97 }}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className="flex items-center gap-2.5 focus:outline-none cursor-pointer h-full py-1 px-2"
      >
        {/* Typographic Avatar Container */}
        <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-background/20 bg-background/5 flex items-center justify-center transition-all duration-300 hover:border-primary/50 group">
          <span className="text-[13px] font-semibold tracking-wider text-primary opacity-80 group-hover:opacity-100 transition-opacity">
            {initial}
          </span>
        </div>

        {/* Name context text solely on Desktop viewports */}
        {!isMobile && userData?.name && (
          <span className="hidden xl:inline text-[13px] tracking-tight font-medium normal-case max-w-22.5 truncate text-primary/80 transition-colors duration-200 hover:text-primary">
            {userData.name.split(" ")[0]}
          </span>
        )}
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="absolute right-0 top-full w-52 bg-black/95 backdrop-blur-md border border-background/10 rounded-md shadow-[0_20px_50px_rgba(0,0,0,0.7)] py-2 z-50 text-primary origin-top-right mt-1"
          >
            {/* Quick Context User Card */}
            <div className="px-4 py-1.5 mb-1 select-none">
              <p className="text-[10px] uppercase tracking-widest text-primary/40 font-bold">
                Account
              </p>
              <p className="text-[12px] font-medium truncate text-primary/70 mt-0.5">
                {userData.email}
              </p>
            </div>

            <div className="h-px bg-white/10 my-1 mx-2" />

            {/* View Profile Option */}
            <motion.div
              whileHover={{
                x: 3,
                backgroundColor: "rgba(255, 255, 255, 0.05)",
              }}
              onClick={() => handleNavigate("/user/profile")}
              className="flex items-center justify-between px-4 py-2.5 text-[12px] tracking-wider uppercase font-medium cursor-pointer text-primary/90 hover:text-primary transition-colors duration-150"
            >
              <span>View Profile</span>
              <User className="w-3.5 h-3.5 opacity-60" />
            </motion.div>

            <div className="h-px bg-background/10 my-1 mx-2" />

            {/* Become a Partner Option */}
            {userData?.role === "user" && (
              <>
                <motion.div
                  onClick={() => handleNavigate("/partner/onboarding/vehicle")}
                  whileHover={{
                    x: 3,
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                  }}
                  className="flex items-center justify-between px-4 py-2.5 text-[12px] tracking-wider uppercase font-medium cursor-pointer text-primary/90 hover:text-primary transition-colors duration-150"
                >
                  <span>Become a partner</span>
                  <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                </motion.div>
                <div className="h-px bg-background/10 my-1 mx-2" />
              </>
            )}

            {/* Logout Option */}
            <motion.div
              onClick={() => {
                setIsOpen(false);
                handleLogOut();
              }}
              whileHover={{
                x: 3,
                backgroundColor: "rgba(239, 68, 68, 0.08)",
              }}
              className="flex items-center justify-between px-4 py-2.5 text-[12px] tracking-wider uppercase font-medium cursor-pointer text-red-400 hover:text-red-300 transition-colors duration-150"
            >
              <span>Logout</span>
              <LogOut className="w-3.5 h-3.5" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileMenu;