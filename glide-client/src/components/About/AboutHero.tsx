"use client";

import { motion } from "framer-motion";
import Image from "next/image";

function AboutHero() {
  return (
    <section className="bg-[#FAF7F2] mt-[9vh] py-20 lg:py-28 px-6 sm:px-10 lg:px-20 border-b border-black/5 overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="lg:col-span-6 space-y-6"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-neutral-900 leading-[1.12]">
            About Our Drive with Seamless Freedom and Reliability
          </h1>
          <p className="text-neutral-600 text-base sm:text-lg leading-relaxed max-w-lg">
            Wherever you need to travel should never be limited by logistics. Seamless
            on-demand vehicle booking, transparent fares, and a verified fleet will change
            how you move every day.
          </p>
        </motion.div>


        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="lg:col-span-6 relative flex flex-col items-center lg:items-end"
        >

          <svg
            className="absolute inset-0 w-full h-full pointer-events-none stroke-neutral-400/40 hidden md:block"
            fill="none"
            strokeWidth="1.5"
          >
            <line x1="20%" y1="70%" x2="50%" y2="25%" />
            <circle cx="20%" cy="70%" r="3" className="fill-neutral-400" />
            <line x1="50%" y1="25%" x2="80%" y2="60%" />
            <circle cx="80%" cy="60%" r="3" className="fill-neutral-400" />
          </svg>

          <div className="w-full max-w-lg space-y-4 relative z-10">

            <div className="w-full h-44 sm:h-52 relative rounded-2xl overflow-hidden border border-neutral-900/10 shadow-sm bg-neutral-200">
              <Image
                src="/slide-3.webp"
                alt="Fleet Dispatch Center"
                className="w-full h-full object-cover"
                fill
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="h-44 sm:h-56 relative rounded-2xl overflow-hidden border border-neutral-900/10 shadow-sm bg-neutral-200">
                <Image
                  src="/slide-4.webp"
                  alt="Premium Luxury Car"
                  className="w-full h-full object-cover"
                  fill
                />
              </div>
              <div className="h-44 sm:h-56 rounded-2xl relative overflow-hidden border border-neutral-900/10 shadow-sm bg-neutral-200">
                <Image
                  src="/slide-5.webp"
                  alt="City Commute Vehicle"
                  className="w-full h-full object-cover"
                  fill
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default AboutHero;