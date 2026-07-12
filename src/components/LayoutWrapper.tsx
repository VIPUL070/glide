"use client";
import { useState, useEffect } from "react";
import SplashScreen from "@/components/SplashScreen";

function LayoutWrapper({ children }: { children: React.ReactNode }) {

  const [showSplash, setShowSplash] = useState(false);

  useEffect(() => {
    const hasSeenSplash = sessionStorage.getItem("hasSeenSplash");
    if (!hasSeenSplash) {
      setShowSplash(true);
    }
  }, []);

  useEffect(() => {
    if (showSplash) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [showSplash]);

  const handleSplashComplete = () => {
    sessionStorage.setItem("hasSeenSplash", "true");
    setShowSplash(false);
  };

  return (
    <>
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      
      <div className={showSplash ? "opacity-0 pointer-events-none" : "opacity-100 transition-opacity duration-700"}>
        {children}
      </div>
    </>
  );
}

export default LayoutWrapper;