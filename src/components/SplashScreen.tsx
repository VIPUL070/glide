"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SplashScreenProps {
  onComplete: () => void;
}

const premiumEase = [0.76, 0, 0.24, 1] as const;

function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
    }, 3800);

    return () => clearTimeout(timer);
  },[]);

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {!isExiting && (
        <motion.div
          initial={{ y: 0 }}
          exit={{ 
            y: "-100%", 
            transition: { duration: 1.2, ease: premiumEase }
          }}
          className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-[#030303] overflow-hidden select-none"
        >

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(15,15,15,0.8)_0%,rgba(3,3,3,1)_100%)]" />

          <div className="relative flex items-center justify-center gap-12 sm:gap-24 md:gap-32 lg:gap-44 z-10 w-full max-w-5xl px-8">
            

            <motion.div
              initial={{ opacity: 0, filter: "blur(4px)" }}
              animate={{ 
                opacity: [0, 0.3, 0.1, 1, 0.4, 1],
                filter: ["blur(4px)", "blur(1px)", "blur(2px)", "blur(0px)", "blur(1px)", "blur(0px)"]
              }}
              transition={{
                duration: 2.2,
                times: [0, 0.2, 0.3, 0.5, 0.6, 0.8],
                ease: "easeInOut",
                delay: 0.4
              }}
              className="relative w-1/2 aspect-2/1 drop-shadow-[0_0_35px_rgba(255,255,255,0.25)]"
            >
              <svg viewBox="0 0 200 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="spiderGlowLeft" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="60%" stopColor="#f5f5f5" />
                    <stop offset="100%" stopColor="#b3b3b3" />
                  </linearGradient>
                </defs>

                <path 
                  d="M 10,15 C 60,35 130,65 190,75 C 150,88 90,82 25,48 C 12,40 8,25 10,15 Z" 
                  fill="url(#spiderGlowLeft)"
                />
              </svg>

              <div className="absolute top-[60%] right-[15%] -translate-x-1/2 -translate-y-1/2 w-12 h-12 sm:w-20 sm:h-20 bg-white/20 rounded-full blur-xl mix-blend-screen pointer-events-none animate-pulse" />
            </motion.div>


            <motion.div
              initial={{ opacity: 0, filter: "blur(4px)" }}
              animate={{ 
                opacity: [0, 0.3, 0.1, 1, 0.4, 1],
                filter: ["blur(4px)", "blur(1px)", "blur(2px)", "blur(0px)", "blur(1px)", "blur(0px)"]
              }}
              transition={{
                duration: 2.2,
                times: [0, 0.2, 0.3, 0.5, 0.6, 0.8],
                ease: "easeInOut",
                delay: 0.4
              }}
              className="relative w-1/2 aspect-2/1 scale-x-[-1] drop-shadow-[0_0_35px_rgba(255,255,255,0.25)]"
            >
              <svg viewBox="0 0 200 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="spiderGlowRight" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="60%" stopColor="#f5f5f5" />
                    <stop offset="100%" stopColor="#b3b3b3" />
                  </linearGradient>
                </defs>
                <path 
                  d="M 10,15 C 60,35 130,65 190,75 C 150,88 90,82 25,48 C 12,40 8,25 10,15 Z" 
                  fill="url(#spiderGlowRight)"
                />
              </svg>
              
              <div className="absolute top-[60%] right-[15%] -translate-x-1/2 -translate-y-1/2 w-12 h-12 sm:w-20 sm:h-20 bg-white/20 rounded-full blur-xl mix-blend-screen pointer-events-none animate-pulse" />
            </motion.div>

          </div>

          <motion.div 
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 0.4 }}
            transition={{ delay: 1.2, duration: 1.8, ease: premiumEase }}
            className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-neutral-800 to-transparent origin-center"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default SplashScreen;