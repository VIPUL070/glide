"use client";

import { useState, useMemo, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Navigation2,
  Pin,
  RefreshCw,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import dynamic from "next/dynamic";
import { springs, onboardingContainerVariants } from "@/lib/animation";
import axios, { isAxiosError } from "axios";
import VehicleCard from "@/components/Booking/VehicleCard";
import Button from "@/components/ui/Button";

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

export interface VehicleData {
  _id: string;
  owner: string;
  type: "bike" | "car" | "loading" | "ev" | "truck";
  vehicleModel: string;
  number: string;
  imageUrl?: string;
  baseFare?: number;
  pricePerKM?: number;
  waitingCharge?: number;
  status: "approved" | "pending" | "rejected";
  rejectionReason?: string;
  isActive: boolean;
}

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [pickup, setpickup] = useState(searchParams.get("pickup") || "");
  const [dropoff, setDropoff] = useState(searchParams.get("dropoff") || "");
  const vehicleType = searchParams.get("vehicle");
  const mobile = searchParams.get("mobile");
  const [km, setKm] = useState<number>(0);

  const [vehicles, setVehicles] = useState<VehicleData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  const getNearbyVehicles = async (
    lat: number,
    lng: number,
    type: string | null
  ) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.post(`/api/nearby-vehicles`, {
        lat,
        lng,
        vehicleType: type,
      });
      const verifiedData = Array.isArray(data) ? data : data?.vehicles || [];
      setVehicles(verifiedData);
    } catch (err) {
      if (isAxiosError(err)) {
        setError(
          err.response?.data?.message || "Failed to query localized fleets."
        );
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unpredictable network error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (mapProps.pickup.lat && mapProps.pickup.lon) {
      (async () => {
        try {
          await getNearbyVehicles(
            mapProps.pickup.lat,
            mapProps.pickup.lon,
            vehicleType
          );
        } catch (e) {
          console.log(e);
        }
      })();
    }
  }, [mapProps.pickup.lat, mapProps.pickup.lon, vehicleType, pickup, dropoff]);

  return (
    <div className="h-screen w-full pt-[9vh] relative overflow-hidden bg-foreground text-secondary antialiased select-none z-10">
      <div className="w-full h-full grid grid-cols-1 grid-rows-13 lg:grid-rows-1 lg:grid-cols-12">
        <div className="col-span-1 row-span-5 lg:col-span-7 xl:col-span-8 h-full w-full relative bg-primary">
          <div className="absolute top-6 left-6 z-999 block lg:hidden">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              transition={springs.tight}
              onClick={() => router.back()}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-neutral-200/80 bg-background/90 text-secondary shadow-md cursor-pointer"
            >
              <ArrowLeft className="h-5 w-5 text-secondary" />
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
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={springs.tight}
            className="absolute bottom-6 left-6 flex h-10 px-4 items-center gap-3 justify-center rounded-xl border border-neutral-200/80 bg-background/95 backdrop-blur-md text-secondary shadow-lg cursor-pointer z-999"
          >
            <Navigation2 className="h-4 w-4 text-neutral-800 animate-pulse" />
            <div className="flex items-baseline gap-1.5 text-foreground font-semibold  text-sm">
              <span>{km.toFixed(1)}</span>
              <span className="text-[11px] font-sans text-secondary/70 font-medium">
                km
              </span>
            </div>
            <div className="h-3 w-px bg-neutral-200" />
            <span className="text-xs font-medium text-secondary/80">
              ~{Math.max(3, Math.round((km / 25) * 60))} mins away
            </span>
          </motion.div>
        </div>

        <div className="col-span-1 row-span-8 lg:col-span-5 xl:col-span-4 border-l border-neutral-100 flex flex-col xl:items-center justify-between bg-background z-10 h-full overflow-hidden ">
          <div className="flex-1 overflow-y-auto scrollbar-none px-6 py-6 sm:px-8 sm:py-7  space-y-6">
            <div className="flex items-center justify-between">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                transition={springs.tight}
                onClick={() => router.back()}
                className="hidden lg:flex h-10 w-10 items-center justify-center rounded-xl border border-secondary/20 bg-background text-secondary hover:border-foreground/30 hover:text-foreground cursor-pointer transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
              </motion.button>

              <div className="text-right lg:text-left flex-1 lg:pl-4 space-y-0.5">
                <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center justify-end lg:justify-start gap-2">
                  Live Route <Sparkles className="h-4 w-4 text-neutral-400" />
                </h1>
                <p className="text-xs text-secondary/70 font-medium">
                  Verified fleets matching your path
                </p>
              </div>
            </div>

            <div className="relative flex flex-col gap-4 pl-4 bg-neutral-50/50 p-4 rounded-xl border border-neutral-100">
              <div className="relative flex items-start gap-3.5 z-10">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white ring-4 ring-background">
                  <Pin className="h-3.5 w-3.5 fill-white" />
                </div>
                <div className="space-y-0.5 pt-0.5 min-w-0">
                  <span className="text-[12px] font-bold tracking-wider uppercase text-secondary/70 block">
                    Pickup
                  </span>
                  <p className="text-sm font-medium text-foreground truncate leading-snug">
                    {pickup || "Locating coordinates..."}
                  </p>
                </div>
              </div>

              <div className="relative flex items-start gap-3.5 z-10">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-500 text-white ring-4 ring-background">
                  <Pin className="h-3.5 w-3.5 fill-white" />
                </div>
                <div className="space-y-0.5 pt-0.5 min-w-0">
                  <span className="text-[12px] font-bold tracking-wider uppercase text-secondary/70 block">
                    Dropoff
                  </span>
                  <p className="text-sm font-medium text-foreground truncate leading-snug">
                    {dropoff || "Awaiting target position..."}
                  </p>
                </div>
              </div>
            </div>

            <hr className="border-neutral-100" />

            <div>
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div
                    key="loading-skeleton"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-3"
                  >
                    {[1, 2, 3].map((n) => (
                      <div
                        key={n}
                        className="h-20 w-full rounded-xl bg-neutral-50 animate-pulse border border-neutral-100 flex items-center justify-between p-4"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-11 w-11 rounded-lg bg-neutral-200/60" />
                          <div className="space-y-2">
                            <div className="h-3 w-28 rounded bg-neutral-200/60" />
                            <div className="h-2.5 w-16 rounded bg-neutral-200/40" />
                          </div>
                        </div>
                        <div className="h-4 w-14 rounded bg-neutral-200/60" />
                      </div>
                    ))}
                  </motion.div>
                ) : error ? (
                  <motion.div
                    key="error-state"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-8 px-4 border border-red-100 bg-red-50/30 rounded-xl text-center space-y-4"
                  >
                    <div className="h-10 w-10 flex items-center justify-center bg-red-50 rounded-full text-red-500">
                      <AlertCircle className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold text-foreground">
                        Failed
                      </h4>
                      <p className="text-xs text-secondary/70 max-w-xs leading-normal">
                        {error}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
                      onClick={() =>
                        getNearbyVehicles(
                          mapProps.pickup.lat,
                          mapProps.pickup.lon,
                          vehicleType
                        )
                      }
                    >
                      Retry
                    </Button>
                  </motion.div>
                ) : vehicles.length === 0 ? (
                  <motion.div
                    key="empty-state"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center py-10 px-4 border border-dashed border-neutral-200 rounded-xl text-center space-y-4"
                  >
                    <div className="h-10 w-10 flex items-center justify-center bg-neutral-50 rounded-full text-neutral-400">
                      <Navigation2 className="h-4 w-4" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold text-foreground">
                        No Vehicles Nearby
                      </h4>
                      <p className="text-xs text-secondary/60 max-w-xs leading-normal">
                        We are unable to detect any active vehicle within your
                        zone/location.
                      </p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() =>
                        getNearbyVehicles(
                          mapProps.pickup.lat,
                          mapProps.pickup.lon,
                          vehicleType
                        )
                      }
                      leftIcon={<RefreshCw className="h-4 w-4" />}
                    >
                      Retry
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="vehicles-grid"
                    variants={onboardingContainerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-3"
                  >
                    {vehicles.map((vehicle) => (
                      <VehicleCard
                        key={vehicle._id}
                        vehicle={vehicle}
                        distanceKm={km}
                        positions={{
                          pickup,
                          dropoff,
                          pickupLat: mapProps.pickup.lat,
                          pickupLon: mapProps.pickup.lon,
                          dropoffLat: mapProps.dropoff.lat,
                          dropoffLon: mapProps.dropoff.lon,
                          mobile,
                        }}
                      />
                    ))}
                  </motion.div>
                )}
                v
              </AnimatePresence>
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
