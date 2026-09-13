"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Button from "../ui/Button";

function AboutSuccess() {
  return (
    <section className="bg-[#FAF7F2] py-20 lg:py-28 px-6 sm:px-10 lg:px-20 border-b border-black/5">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="lg:col-span-7 space-y-6"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-950 tracking-tight leading-[1.15]">
            Our success Depends on <br />
            Our Customers Success.
          </h2>

          <p className="text-neutral-600 text-sm sm:text-base leading-relaxed max-w-xl">
            At our core, our mission is to lead globally in intelligent vehicle bookings and
            fleet safety. We empower riders and corporate clients to streamline airport transfers,
            road trips, and daily commutes with guaranteed reliability.
          </p>

          <div>
            <Button
              size="sm"
              variant="primary"
              motionEffect="slide"
              className=" bg-[#EFC76E] border border-neutral-900/10 text-neutral-950 shadow-sm hover:bg-[#e6be60] transition-colors"
            >
              Collaborate Now
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-6 pt-8 border-t border-neutral-300/60 max-w-lg">
            <div>
              <span className="block text-2xl sm:text-3xl font-bold text-neutral-950 ">
                12+
              </span>
              <span className="block text-xs sm:text-sm text-neutral-600 mt-1">
                Trusted Partnerships
              </span>
            </div>
            <div>
              <span className="block text-2xl sm:text-3xl font-bold text-neutral-950">
                10+
              </span>
              <span className="block text-xs sm:text-sm text-neutral-600 mt-1">
                Active Fleet Vehicles
              </span>
            </div>
            <div>
              <span className="block text-2xl sm:text-3xl font-bold text-neutral-950">
                88%
              </span>
              <span className="block text-xs sm:text-sm text-neutral-600 mt-1">
                Trip Efficiency Boost
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="lg:col-span-5 flex justify-center lg:justify-end"
        >
          <div className="w-full max-w-md aspect-4/5 relative rounded-4xl overflow-hidden border-2 border-neutral-900/15 shadow-md bg-neutral-200">
            <Image
              src="/success.webp"
              alt="Happy customer booking a ride"
              className="w-full h-full object-cover"
              fill 
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default AboutSuccess;