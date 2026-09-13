"use client";

import { motion } from "framer-motion";
import Image from "next/image";

function AboutMission() {
  return (
    <section className="bg-[#FCDCD1] py-20 lg:py-28 px-6 sm:px-10 lg:px-20 border-b border-black/5">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="lg:col-span-6 relative"
        >
          <div className="relative rounded-3xl overflow-hidden border-2 border-neutral-900/15 shadow-lg aspect-4/3 bg-neutral-100">
            <Image
              src="/mission.webp"
              alt="Our mobility engineering team"
              className="w-full h-full object-cover"
              fill
            />
          </div>

          <div className="absolute -top-4 -left-4 w-4 h-4 rounded-full border-2 border-neutral-900/20 bg-white" />
          <div className="absolute -bottom-4 -right-4 w-4 h-4 rounded-full border-2 border-neutral-900/20 bg-white" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="lg:col-span-6 space-y-8"
        >
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-950 tracking-tight">
              Our Mission
            </h2>
            <p className="mt-4 text-neutral-700 text-sm sm:text-base leading-relaxed">
              We provide tailored on-demand vehicle mobility solutions to boost ride
              accessibility, minimize route delays, and support personal and corporate travel.
              We empower drivers and riders to experience seamless transit with reliable
              technology built for everyday convenience.
            </p>
          </div>

          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-950 tracking-tight">
              Our Value
            </h2>
            <p className="mt-4 text-neutral-700 text-sm sm:text-base leading-relaxed">
              We set the global benchmark in clean, safe, and transparent vehicle bookings.
              Through innovative dispatch algorithms, upfront fair pricing, and safety-verified
              fleets, we simplify how people discover, reserve, and drive the ideal vehicle.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default AboutMission;