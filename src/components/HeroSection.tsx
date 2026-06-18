"use client";
import { Bike, Bus, Car, Truck } from "lucide-react";
import { motion } from "framer-motion";
import Button from "./ui/Button";
import { heroContainerVariants, iconVariants } from "@/lib/animation";

const HeroSection = () => {


  return (
    <div className="relative min-h-dvh w-full overflow-hidden bg-neutral-950">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/hero-image.webp')",
        }}
      >
        <div className="absolute inset-0 bg-linear-to-r from-black/50 via-black/20 to-transparent" />
      </div>

      <div className="relative top-28 z-10 left-6 sm:left-25 max-w-lg flex flex-col justify-center items-start gap-5 p-4">
        <motion.h1
          initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-[3rem] sm:text-[4rem] md:text-[5rem] text-primary tracking-tighter font-semibold flex flex-col leading-none"
        >
          <span>BOOK</span>
          <span>YOUR</span>
          <span>VEHICLE</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-primary/70 text-[0.9rem] tracking-tight max-w-sm"
        >
          From daily rides to heavy transport. All in one premium platform.
        </motion.p>

        <motion.div
          variants={heroContainerVariants}
          initial="hidden"
          animate="visible"
          className="bg-neutral-900/40 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/40 rounded-xl w-full max-w-sm h-16 px-4 flex items-center justify-between gap-2 mt-2"
        >
          {[
            { Icon: Bike, label: "Bike" },
            { Icon: Car, label: "Car" },
            { Icon: Bus, label: "Bus" },
            { Icon: Truck, label: "Truck" },
          ].map(({ Icon, label }) => (
            <motion.div
              key={label}
              variants={iconVariants}
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="p-2.5 rounded-lg text-primary/60 hover:text-primary hover:bg-white/5 transition-colors duration-200 cursor-pointer flex items-center justify-center"
              title={label}
            >
              <Icon size={24} strokeWidth={1.5} />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-2"
        >
          <Button size="lg" className="rounded-xl px-8 shadow-lg shadow-black/20 hover:shadow-xl transition-all">
            Book now
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSection;