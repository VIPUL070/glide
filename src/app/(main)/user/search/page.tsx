"use client";

import { useState, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import dynamic from "next/dynamic";
import { springs } from "@/lib/animation";

const SearchMap = dynamic(() => import("@/components/Booking/SearchMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-neutral-100 flex items-center justify-center text-sm text-secondary/70 animate-pulse">
      Loading map environment...
      <p className="text-xs text-secondary/70 animate-pulse">Plotting your route...</p>
    </div>
  ),
});

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [pickup, setpickup] = useState(searchParams.get("pickup") || "");
  const [dropoff, setDropoff] = useState(searchParams.get("dropoff") || "");

  const [km, setKm] = useState<number>(0);

  const mapProps = useMemo(() => {
    return {
      pickup: {
        name: pickup,
        lat: parseFloat(searchParams.get("pickuplat") || "0"),
        lon: parseFloat(searchParams.get("pickuplon") || "0"),
      },
      dropoff: {
        name: dropoff,
        lat: parseFloat(searchParams.get("dropofflat") || "0"),
        lon: parseFloat(searchParams.get("dropofflon") || "0"),
      },
    };
  }, [searchParams,pickup,dropoff]);

  return (
    <div className="h-dvh w-full pt-[9vh] relative overflow-hidden bg-foreground text-foreground antialiased select-none">
      <div className="w-full h-full grid grid-cols-1 lg:grid-cols-12">
        
        <div className="hidden lg:flex lg:col-span-3 xl:col-span-3 border-r border-neutral-100 flex-col justify-between p-8 bg-background z-10">
          <div className="space-y-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              transition={springs}
              onClick={() => router.back()}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-secondary/20 bg-background text-secondary hover:border-foreground/30 hover:text-foreground cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
            </motion.button>
            
            <div className="space-y-1">
              <h1 className="text-xl font-bold tracking-tight">Live Route</h1>
              <p className="text-xs text-secondary/70 font-medium">Tracking active locations</p>
            </div>
          </div>
        </div>

        <div className="col-span-1 lg:col-span-9 xl:col-span-9 h-full w-full relative bg-primary">
          
          <div className="absolute top-6 left-6 z-1000 block lg:hidden">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              transition={springs}
              onClick={() => router.back()}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-neutral-200/80 bg-background/90 backdrop-blur-md text-secondary shadow-md cursor-pointer"
            >
              <ArrowLeft className="h-5 w-5 text-foreground" />
            </motion.button>
          </div>

          <SearchMap
            pickup={mapProps.pickup}
            dropoff={mapProps.dropoff}
            distance={setKm}
            onChange={(p:string,d:string) => {setpickup(p); setDropoff(d)}}
          />
        </div>

      </div>
    </div>
  );
}

export default function Search() {
  return (
    <Suspense fallback={<div className="h-screen w-screen bg-background" />}>
      <SearchContent />
    </Suspense>
  );
}