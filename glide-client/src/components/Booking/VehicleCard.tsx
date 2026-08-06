"use client";

import { motion } from "framer-motion";
import { Bike, Car, Zap, Package, Truck, LucideIcon, ShieldCheck, IndianRupee } from "lucide-react";
import { springs, itemVariants } from "@/lib/animation";
import { VehicleData } from "@/app/(main)/user/search/page";

type VehicleType = "bike" | "car" | "loading" | "ev" | "truck";

interface VehicleCardProps {
  vehicle: VehicleData;
  distanceKm: number;
}

const vehicleIcons: Record<VehicleType, LucideIcon> = {
  bike: Bike,
  car: Car,
  ev: Zap,
  loading: Package,
  truck: Truck,
};

function VehicleCard({
  vehicle,
  distanceKm,
}: VehicleCardProps) {
  const IconComponent = vehicleIcons[vehicle.type] || Car;
  
  const base = vehicle.baseFare ?? 0;
  const perKm = vehicle.pricePerKM ?? 0;
  const waiting = vehicle.waitingCharge ?? 0;
  const totalFare = base + perKm * distanceKm;

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -4, scale: 1.015 }}
      whileTap={{ scale: 0.985 }}
      transition={springs}
      className="group relative max-w-80 rounded-3xl border border-neutral-300/80 bg-background p-4 flex flex-col justify-between overflow-hidden transition-all duration-300 select-none shadow-xs hover:border-neutral-400 hover:shadow-md cursor-pointer"
    >
      <div className="relative z-10 w-full flex flex-col h-full justify-between gap-4">
        
        <div className="flex items-start justify-between w-full gap-2">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[12px] tracking-wider uppercase px-3.5 py-1 rounded-full bg-foreground text-primary">
                {vehicle.type}
              </span>
              {vehicle.isActive && (
                <span className="text-[12px] px-3.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" /> Live
                </span>
              )}
            </div>
            
            <h3 className="text-lg font-bold tracking-tight text-foreground text-ellipsis overflow-hidden whitespace-nowrap pt-0.5">
              {vehicle.vehicleModel}
            </h3>
            <p className="text-[12px] tracking-widest uppercase font-semibold text-secondary">
              {vehicle.number}
            </p>
          </div>

          <div className="h-10 w-10 shrink-0 rounded-full flex items-center justify-center  bg-foreground border border-neutral-200/60 text-primary shadow-2xs group-hover:scale-110 transition-transform duration-300">
            <IconComponent className="h-4 w-4 stroke-2" />
          </div>
        </div>

        <div className="relative aspect-16/16 my-1 flex items-center justify-center overflow-hidden rounded-2xl bg-linear-to-b from-neutral-50/10 to-neutral-100/40 border border-neutral-300/80">
          {vehicle.imageUrl ? (
            <motion.img
              src={vehicle.imageUrl}
              alt={vehicle.vehicleModel}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="object-cover h-full w-full drop-shadow-md group-hover:scale-105 transition-transform duration-500 ease-out"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center relative">
              <div className="absolute inset-0 opacity-[0.03] bg-radial from-foreground to-transparent" />
              <IconComponent className="h-12 w-12 stroke-1 opacity-20 text-secondary" />
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-1.5 w-full">
          <div className="p-2.5 rounded-xl text-left border border-neutral-200/60 bg-neutral-50/30">
            <span className="text-[9px] font-bold uppercase tracking-wider block text-secondary/50">Base</span>
            <span className="text-xs font-bold flex items-center text-foreground font-mono mt-0.5">
              <IndianRupee className="h-3 w-3 mr-0.5 stroke-[2.5]" />{base}
            </span>
          </div>
          <div className="p-2.5 rounded-xl text-left border border-neutral-200/60 bg-neutral-50/30">
            <span className="text-[13px] font-bold uppercase tracking-wider block text-secondary/50">KM Fare</span>
            <span className="text-[14px] font-bold flex items-center text-foreground font-mono mt-0.5">
              <IndianRupee className="h-3.5 w-3.5 mr-0.5 stroke-[2.5]" />{perKm}<span className="text-[14px] font-sans font-medium text-secondary/60 ml-0.5">/km</span>
            </span>
          </div>
          <div className="p-2.5 rounded-xl text-left border border-neutral-200/60 bg-neutral-50/30">
            <span className="text-[9px] font-bold uppercase tracking-wider block text-secondary/50">Wait Rate</span>
            <span className="text-xs font-bold flex items-center text-foreground font-mono mt-0.5">
              <IndianRupee className="h-3 w-3 mr-0.5 stroke-[2.5]" />{waiting}<span className="text-[9px] font-sans font-medium text-secondary/60 ml-0.5">/min</span>
            </span>
          </div>
        </div>

        <div className="w-full pt-3 border-t border-neutral-200/60 flex items-center justify-between gap-2 mt-1">
          <div className="text-left">
            <span className="text-[10px] font-bold tracking-tight block text-secondary/60 uppercase">Estimated Total</span>
            <div className="flex items-center text-foreground font-extrabold tracking-tight text-xl font-mono mt-0.5">
              <IndianRupee className="h-4 w-4 mr-0.5 stroke-3" />
              <span>{totalFare.toFixed(2)}</span>
            </div>
          </div>

          <div className="text-xs font-bold tracking-tight px-4 py-2 rounded-xl bg-foreground text-background hover:bg-foreground/90 transition-colors duration-200 cursor-pointer shadow-sm">
            Book Ride
          </div>
        </div>

      </div>
    </motion.div>
  );
}

export default VehicleCard;