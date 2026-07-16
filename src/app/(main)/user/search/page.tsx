"use client";

import { useState, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft,Navigation2, Pin } from "lucide-react";
import dynamic from "next/dynamic";
import { springs } from "@/lib/animation";

const SearchMap = dynamic(() => import("@/components/Booking/SearchMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-neutral-100 flex flex-col gap-2 items-center justify-center text-sm text-secondary/70 animate-pulse">
      Loading map environment...
      <p className="text-xs text-secondary/70 animate-pulse">
        Plotting your route...
      </p>
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
  }, [searchParams, pickup, dropoff]);

  return (
    <div className="h-dvh w-full pt-[9vh] relative overflow-hidden bg-foreground text-secondary antialiased select-none z-40">
      <div className="w-full h-full grid grid-cols-1 grid-rows-5 lg:grid-rows-2 lg:grid-cols-12">

        <div className="col-span-1 row-span-3 lg:col-span-8 xl:col-span-8 h-full w-full relative bg-primary">
          <div className="absolute top-6 left-6 z-900 block lg:hidden">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              transition={springs}
              onClick={() => router.back()}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-neutral-200/80 bg-background/90 backdrop-blur-md text-secondary shadow-md cursor-pointer"
            >
              <ArrowLeft className="h-5 w-5 secondary" />
            </motion.button>
          </div>

          <SearchMap
            pickup={mapProps.pickup}
            dropoff={mapProps.dropoff}
            distance={setKm}
            onChange={(p: string, d: string) => {
              setpickup(p);
              setDropoff(d);
            }}
          />

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            transition={springs}
            className="absolute bottom-6 left-6 z-900 flex h-8 w-35 items-center gap-2 justify-center rounded-xl border border-neutral-200/80 bg-background/90 backdrop-blur-md text-secondary shadow-md cursor-pointer"
          >
            <Navigation2 className="h-4 w-4 text-secondary" />
            <span className="text-sm tracking-tight">{km}km</span>
            <span className="text-sm tracking-tight">
              ~{Math.max(3, Math.round((km / 25) * 60))}min
            </span>
          </motion.div>
        </div>

        <div className="lg:flex lg:col-span-4 row-span-2 xl:col-span-4 border-r border-neutral-100 flex-col justify-between p-8 bg-background z-10">
          <div className="space-y-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              transition={springs}
              onClick={() => router}
              className="hidden lg:flex h-10 w-10 items-center justify-center rounded-xl border border-secondary/20 bg-background text-secondary hover:border-foreground/30 hover:text-foreground cursor-pointer transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
            </motion.button>
            <div className="space-y-1">
              <h1 className="text-xl font-bold tracking-tight text-foreground">
                Live Route
              </h1>
              <p className="text-xs text-secondary/70 font-medium">
                Tracking active locations
              </p>
            </div>

            <div className="relative flex flex-col gap-6 pl-2 mt-4">
              <div className="absolute left-19px top-6 bottom-6 w-0.5 border-l-2 border-dashed border-neutral-200" />

              <div className="relative flex items-start gap-4 z-10">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary/10 text-secondary ring-4 ring-background">
                  <Pin className="h-4 w-4" />
                </div>
                <div className="space-y-1 pt-0.5">
                  <span className="text-[14px] font-semibold tracking-wider uppercase text-secondary/50 block">
                    Pickup Location
                  </span>
                  <p className="text-sm text-foreground leading-snug wrap-break-words">
                    {pickup}
                  </p>
                </div>
              </div>

              <div className="relative flex items-start gap-4 z-10">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-4 ring-background">
                  <Pin className="h-4 w-4" />
                </div>
                <div className="space-y-1 pt-0.5">
                  <span className="text-[14px] font-semibold tracking-wider uppercase text-secondary/50 block">
                    Dropoff Location
                  </span>
                  <p className="text-sm text-foreground leading-snug wrap-break-words">
                    {dropoff}
                  </p>
                </div>
              </div>
            </div>
          </div>
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