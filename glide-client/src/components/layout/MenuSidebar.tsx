"use client";
import { NAV_ITEMS, NAV_ITEMS_PARTNER, NavItem, UserRole } from "@/data/home";
import { RootState } from "@/redux/store";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSelector } from "react-redux";
import Badge from "./Badge";

const MenuSidebar = ({
  handleClick,
  counts,
}: {
  handleClick: () => void;
  counts: number;
}) => {
  const { userData } = useSelector((state: RootState) => state.user);

  function useNavItems(role: UserRole): NavItem[] {
    return role === "partner" ? NAV_ITEMS_PARTNER : NAV_ITEMS;
  }

  const NAV_ITEM = useNavItems(userData?.role as UserRole);

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClick}
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm cursor-pointer"
      />

      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        exit={{ x: "-100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 220 }}
        className="fixed top-0 left-0 bottom-0 h-full w-[95vw] sm:w-[65vw] md:w-[45vw] max-w-100 z-50 bg-background text-secondary shadow-2xl overflow-y-auto flex flex-col p-5 sm:p-6 md:p-8 selection:bg-transparent"
      >
        {/* Sidebar Header with exact Close container alignment */}
        <div className="flex justify-end items-center mb-6 sm:mb-8">
          <button
            onClick={handleClick}
            className="border border-secondary rounded px-3 py-0.5 text-[12px] sm:text-[14px] font-bold tracking-tighter uppercase transition-all duration-200 hover:border-secondary text-secondary focus:outline-none cursor-pointer"
          >
            CLOSE
          </button>
        </div>

        {/* Navigation Items Link-Stack */}
        <nav className="flex flex-col w-full divide-y divide-secondary/30 border-t border-b border-secondary/30 font-normal tracking-wider">
          {/* Flat Navigation Item Link Array */}
          {NAV_ITEM.map((item: NavItem, idx) => {
            const path = item.href;
            if (counts > 0 && item.label === "Pending Requests") {
              item.pendingReq = counts;
            }

            return (
              <Link
                key={idx}
                href={path}
                onClick={handleClick}
                className="py-4 text-[15px] sm:text-[16px] text-secondary uppercase font-medium block transition-all duration-200 hover:opacity-70"
              >
                {item.label}
                {item.pendingReq &&
                  item.pendingReq !== undefined &&
                  item.pendingReq > 0 && <Badge counts={item.pendingReq} />}
              </Link>
            );
          })}
        </nav>
      </motion.div>
    </>
  );
};

export default MenuSidebar;