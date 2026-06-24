"use client";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { VEHICLE_DATA } from "@/data/home";
import { statCardVariants, textFadeVariants } from "@/lib/animation";

const VehicleSlider = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const scrollLeft = container.scrollLeft;
    const itemWidth = container.clientWidth;
    const newIndex = Math.round(scrollLeft / itemWidth);
    
    if (newIndex !== activeIndex && newIndex >= 0 && newIndex < VEHICLE_DATA.length) {
      setActiveIndex(newIndex);
    }
  };

  const scrollToVehicle = (index: number) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const itemWidth = container.clientWidth;
      container.scrollTo({
        left: index * itemWidth,
        behavior: "smooth",
      });
    }
  };

  const activeVehicle = VEHICLE_DATA[activeIndex];

  return (
    <section ref={scrollContainerRef} className="w-full bg-background min-h-[90vh] py-12 md:py-20 px-4 sm:px-8 lg:px-16 xl:px-24 flex flex-col justify-center overflow-hidden border-b border-secondary/5 select-none">
      
      {/* Upper Layout Main Window */}
      <div
      
      className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full max-w-7xl mx-auto flex-1">
        
        {/* Left Side Details Content Module */}
        <div className="order-2 lg:order-1 lg:col-span-5 flex flex-col justify-center h-full min-h-75 lg:pr-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeVehicle.id}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="space-y-4 md:space-y-6"
            >
              <motion.span 
                custom={1} 
                variants={textFadeVariants}
                className="text-[11px] sm:text-[12px] font-bold tracking-[0.3em] text-secondary/60 block uppercase"
              >
                {activeVehicle.category}
              </motion.span>

              <motion.h2 
                custom={2} 
                variants={textFadeVariants}
                className="text-[2.25rem] sm:text-[3rem] lg:text-[3.5rem] font-black tracking-tighter uppercase text-secondary leading-none"
              >
                {activeVehicle.name}
              </motion.h2>
              
              <motion.p 
                custom={3} 
                variants={textFadeVariants}
                className="text-[14px] sm:text-[15px] leading-relaxed text-secondary/70 font-medium tracking-tight max-w-md"
              >
                {activeVehicle.description}
              </motion.p>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center gap-2.5 mt-10 md:mt-12 w-full max-w-xs">
            {VEHICLE_DATA.map((vehicle, idx) => (
              <button
                key={vehicle.id}
                onClick={() => scrollToVehicle(idx)}
                className="h-1 flex-1 relative bg-secondary/10 rounded-full overflow-hidden focus:outline-none group cursor-pointer"
                aria-label={`Navigate to slide ${idx + 1}`}
              >
                {/* Active fill transition timeline tracker */}
                <motion.div 
                  initial={false}
                  animate={{ 
                    width: idx === activeIndex ? "100%" : "0%",
                    opacity: idx === activeIndex ? 1 : 0 
                  }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  className="absolute top-0 left-0 h-full bg-secondary rounded-full"
                />
                <div className="absolute inset-0 bg-secondary/0 group-hover:bg-secondary/5 transition-colors" />
              </button>
            ))}
          </div>
        </div>

        {/* Right Side Image Block */}
        <div className="order-1 lg:order-2 lg:col-span-7 relative w-full aspect-16/10 sm:aspect-video lg:aspect-square xl:aspect-16/11 rounded-2xl overflow-hidden group border border-secondary/10">
          <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent z-10 pointer-events-none" />
          
          <div 
            onScroll={handleScroll}
            className="w-full h-full flex overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden bg-primary"
          >
            {VEHICLE_DATA.map((vehicle) => (
              <div 
                key={vehicle.id}
                className="w-full h-full shrink-0 snap-center relative"
              >
                <Image
                  src={vehicle.image}
                  alt={vehicle.name}
                  fill
                  priority
                  className="object-cover pointer-events-none transition-transform duration-700 ease-out scale-100 group-hover:scale-[1.015]"
                  sizes="(max-w: 1024px) 100vw, 55vw"
                />
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Metrics Section */}
      <div className="w-full max-w-7xl mx-auto mt-12 md:mt-16 pt-8 border-t border-secondary/5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <AnimatePresence mode="popLayout">
            {activeVehicle.stats.map((stat, idx) => {
              const StatIcon = stat.icon;
              return (
                <motion.div
                  key={`${activeVehicle.id}-${idx}`}
                  custom={idx}
                  initial="hidden"
                  animate="visible"
                  variants={statCardVariants}
                  className="bg-secondary/2 border border-secondary/5 rounded-xl p-4 sm:p-5 flex flex-col justify-between group hover:border-secondary/15 transition-colors duration-300 relative overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold tracking-widest text-secondary/40 uppercase">
                      {stat.label}
                    </span>
                    <StatIcon className="w-4 h-4 text-secondary/30 group-hover:text-secondary/60 transition-colors duration-300" />
                  </div>
                  
                  <div className="text-[1.5rem] sm:text-[1.75rem] font-bold tracking-tight text-secondary mt-1">
                    {stat.value}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

    </section>
  );
};

export default VehicleSlider;