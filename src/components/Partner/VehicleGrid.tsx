"use client";
import { motion, AnimatePresence } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { itemVariants, onboardingContainerVariants, springs } from "@/lib/animation";
import { VEHICLE_OPTIONS } from "@/data/vehicleOnBoarding";

interface VehicleGridProps {
  options: typeof VEHICLE_OPTIONS;
  selectedId: string | null;
  onSelect: (id: string) => void;
}

function VehicleGrid({ options, selectedId, onSelect }: VehicleGridProps) {
  return (
    <motion.div
      variants={onboardingContainerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-3 w-full"
    >
      {options.map((vehicle) => {
        const Icon = vehicle.icon as LucideIcon;
        const isSelected = selectedId === vehicle.id;

        return (
          <motion.button
            key={vehicle.id}
            variants={itemVariants}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={springs.tight}
            onClick={() => onSelect(vehicle.id)}
            className={`
              group relative flex flex-col items-start justify-between rounded-2xl border p-3 text-left
              transition-[border-color,box-shadow] duration-300 cursor-pointer outline-none min-h-35 w-full
              bg-background select-none focus-visible:ring-5 focus-visible:ring-secondary/30
              ${
                isSelected
                  ? "border-secondary/60"
                  : "border-secondary/30 hover:border-secondary/20 hover:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.04)]"
              }
            `}
          >
            <AnimatePresence>
              {isSelected && (
                <motion.div
                  layoutId="activeSelectionInk"
                  className="absolute inset-0 rounded-2xl bg-secondary/8 border border-secondary/80"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={springs.fluid}
                />
              )}
            </AnimatePresence>

            {/* Icon Container */}
            <motion.div
              className="relative z-10 p-2 rounded-xl bg-secondary/8 border border-secondary/8"
              animate={isSelected ? { scale: 1.05, backgroundColor: "rgba(0,0,0,0.01)" } : { scale: 1 }}
              transition={springs.tight}
            >
              <Icon
                className={`h-5 w-5 transition-colors duration-300 ${
                  isSelected ? "text-secondary" : "text-secondary/80 group-hover:text-secondary/80"
                }`}
                strokeWidth={isSelected ? 2 : 1.5}
              />
            </motion.div>

            {/* Details of vehicle*/}
            <div className="relative z-10 mt-4">
              <span
                className={`block text-[14px] font-medium tracking-tight transition-colors duration-200 ${
                  isSelected ? "text-secondary" : "text-secondary/80 group-hover:text-secondary/90"
                }`}
              >
                {vehicle.label}
              </span>
              <span
                className={`mt-1 block text-[13px] leading-normal font-normal transition-colors duration-200 ${
                  isSelected ? "text-secondary/80" : "text-secondary/60 group-hover:text-secondary/70"
                }`}
              >
                {vehicle.description}
              </span>
            </div>
          </motion.button>
        );
      })}
    </motion.div>
  );
}

export default VehicleGrid;