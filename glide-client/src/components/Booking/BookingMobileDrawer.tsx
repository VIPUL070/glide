"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { IPopulatedBookingResponse } from "@/data/booking";
import { backdropVariants, drawerVariants } from "@/lib/bookingAnimation";
import BookingDetails from "./BookingDetails";

interface BookingMobileDrawerProps {
  booking: IPopulatedBookingResponse | null;
  isOpen: boolean;
  onClose: () => void;
  onActive?: () => void
}

const BookingMobileDrawer= ({
  booking,
  isOpen,
  onClose,
  onActive
}:BookingMobileDrawerProps) => {
  // Manage Esc key and Body Scroll Lock
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center md:hidden">

          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            className="fixed inset-0 bg-foreground/60 backdrop-blur-xs"
          />

          <motion.div
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative z-10 w-full max-h-[88vh] bg-background rounded-t-3xl shadow-2xl flex flex-col overflow-hidden"
          >

            <div className="pt-3 pb-2 px-4 flex items-center justify-between border-b border-foreground/10">
              <div className="w-12 h-1 bg-secondary/30 rounded-full mx-auto absolute left-1/2 -translate-x-1/2 top-2" />
              <span className="text-xs font-semibold text-secondary">Trip Inspection</span>
              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded-full text-secondary hover:text-foreground bg-secondary/10"
                aria-label="Close drawer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-y-auto p-4 pb-8">
              <BookingDetails booking={booking} onCloseMobile={onClose} onActive = {onActive}/>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BookingMobileDrawer;