"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import {
  ArrowLeft,
  Bike,
  Car,
  CreditCard,
  CheckCircle,
  XCircle,
  ShieldAlert,
  Calendar,
  Milestone,
  Clock,
  DollarSign,
  User,
  Fingerprint,
} from "lucide-react";

import Spinner from "@/components/ui/Spinner";
import Button from "@/components/ui/Button";
import Overlay from "@/components/Admin/Overlay";
import Image from "next/image";
import { IVehicle } from "@/models/Vehicle.model";

export type OverlayType = "idle" | "approve" | "reject";


export type PopulatedVehicle = Omit<IVehicle, 'owner'> & {
  owner: {
    _id: string;
    name: string;
    email: string;
    mobileNumber?: string;
    role?: string;
  } | null; 
};

const VehicleReview = () => {
  const { id } = useParams();
  const router = useRouter();
  
  const [vehicle, setVehicle] = useState<PopulatedVehicle | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [overlayState, setOverlayState] = useState<OverlayType>("idle");

  useEffect(() => {
    const getVehicleDetails = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`/api/admin/reviews/vehicle/${id}`);
        console.log(data)
        setVehicle(data.vehicle);
      } catch (error) {
        console.error("Failed fetching vehicle details", error);
      } finally {
        setLoading(false);
      }
    };
    getVehicleDetails();
  }, [id]);

  const handleApprove = async () => {
    try {
      await axios.patch(`/api/admin/reviews/vehicle/${id}/approve`);
      router.refresh();
      router.push("/");
    } catch (error) {
      console.error(error);
    }
  };

  const handleReject = async (reason: string) => {
    try {
      await axios.patch(`/api/admin/reviews/vehicle/${id}/reject`, {
        rejectionReason: reason,
      });
      router.refresh();
      router.push("/");
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="h-dvh w-screen flex items-center justify-center gap-4  uppercase font-semibold tracking-tighter">
        <p className="text-lg sm:text-xl">Parsing Vehicle Details...</p>
        <Spinner />
      </div>
    );
  }

  if (!vehicle) return null;

  return (
    <div className="h-dvh bg-background text-secondary p-3 sm:p-4 md:p-6 lg:p-8 font-sans selection:bg-neutral-200 antialiased">
      <div className="max-w-[1600px] mx-auto space-y-8">
        
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-neutral-200 rounded-2xl p-4 sm:p-6 sm:mt-11 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
        >
          <div className="flex items-center gap-4 w-full md:w-auto">
            <motion.button
              whileHover={{ x: -4 }}
              className="p-2.5 rounded-xl hover:bg-neutral-100 transition-colors border border-neutral-200 cursor-pointer shrink-0"
              onClick={() => router.back()}
              aria-label="Return to operational ledger"
            >
              <ArrowLeft className="w-5 h-5 text-neutral-600" />
            </motion.button>

            <div className="flex items-center gap-3 truncate w-full">
              <div className="w-12 h-12 bg-neutral-100 border border-neutral-200 rounded-xl flex items-center justify-center font-semibold text-lg shrink-0 text-neutral-700">
                {vehicle.type === "bike" ? <Bike className="w-6 h-6" /> : <Car className="w-6 h-6" />}
              </div>
              <div className="truncate">
                <div className="flex items-center gap-4 flex-wrap">
                  <h1 className="text-lg sm:text-xl font-bold tracking-tight uppercase truncate max-w-70 xs:max-w-none">
                    {vehicle.vehicleModel}
                  </h1>
                  <span
                    className={`text-[10px] px-2.5 py-0.5 ml-4 rounded-full border font-semibold uppercase tracking-wider
                      ${vehicle.status === "rejected" ? "bg-rose-50 text-rose-700 border-rose-200" : ""}
                      ${vehicle.status === "pending" ? "bg-amber-50 text-amber-700 border-amber-200" : ""}
                      ${vehicle.status === "approved" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : ""}
                    `}
                  >
                    {vehicle.status}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs mt-0.5 text-neutral-500 font-medium">
                  <span className="flex items-center gap-1 uppercase tracking-wide bg-neutral-50 border border-neutral-200 px-1.5 py-0.5 rounded text-[11px]  font-bold">
                    {vehicle.number}
                  </span>
                  <span className="flex items-center gap-1 truncate">
                    <User className="w-4 h-4" /> Owner: {vehicle.owner?.name}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-left md:text-right text-xs w-full md:w-auto border-t md:border-t-0 pt-3 md:pt-0 border-neutral-100 font-medium text-secondary/70">
            Node Logged: {new Date(vehicle.createdAt).toLocaleDateString()}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-auto lg:auto-rows-[minmax(180px,auto)]">
          
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="md:col-span-2 lg:row-span-2 bg-white border border-neutral-200 rounded-3xl p-4 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col justify-between space-y-4"
          >
            <div className="space-y-1">
              <span className="text-[12px] font-bold uppercase tracking-widest text-secondary/70">
                Asset Visual Verification
              </span>
              <h2 className="text-md font-bold uppercase tracking-wider ">
                Physical Configuration Frame
              </h2>
            </div>
            
            <div className="relative w-full aspect-video lg:h-full rounded-2xl overflow-hidden bg-neutral-50 border border-neutral-200 group">
              {vehicle.imageUrl ? (
                <Image
                  src={vehicle.imageUrl}
                  alt={`${vehicle.vehicleModel} structural capture asset`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  unoptimized
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-secondary/70 p-4">
                  <ShieldAlert className="w-8 h-8 mb-2 stroke-1" />
                  <p className="text-xs  ">No Image Asset Matrix Registered</p>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-neutral-50 border border-neutral-100 rounded-2xl text-neutral-700">
                  <CreditCard className="w-6 h-6" />
                </div>
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-secondary/70">
                Financial Strategy Tier
              </h2>
              <p className="text-xl font-bold mt-1 tracking-tight">
                Live Clearing Tariffs
              </p>
            </div>

            <div className="space-y-2.5 mt-6">
              <div className="flex justify-between items-center text-sm border-b border-neutral-100 pb-2">
                <span className="text-neutral-500 font-medium flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4" /> Base Fare
                </span>
                <span className="font-bold ">
                  ₹{"       "}{vehicle.baseFare}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-neutral-100 pb-2">
                <span className="text-neutral-500 font-medium flex items-center gap-1.5">
                  <Clock className="w-4 h-4" /> Idle Holds
                </span>
                <span className="font-bold ">
                  ₹{"       "}{vehicle.waitingCharge}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm pt-0.5">
                <span className="text-neutral-500 font-medium flex items-center gap-1.5">
                  <Milestone className="w-4 h-4" /> Price / KM
                </span>
                <span className="font-bold ">
                  ₹{"       "}{vehicle.pricePerKM}
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="p-3 bg-neutral-50 border border-neutral-100 rounded-2xl w-fit text-neutral-700">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-md font-bold uppercase tracking-wider text-secondary/70">
                  Operational Lifecycles
                </h3>
                <div className="space-y-2 mt-3 font-medium text-neutral-600">
                  <p className="text-sm flex items-center justify-between gap-2">
                    <span>Registry Framework:</span>
                    <span className="text-neutral-800   text-[11px]">
                      {new Date(vehicle.createdAt).toLocaleDateString()}
                    </span>
                  </p>
                  <p className="text-sm flex items-center justify-between gap-2">
                    <span>Matrix Synchronized:</span>
                    <span className="text-neutral-800   text-[11px]">
                      {new Date(vehicle.updatedAt).toLocaleDateString()}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {vehicle.rejectionReason && (
              <div className="mt-4 p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <p className="text-[11px] text-rose-700 leading-tight">
                  <strong>Rejection Context:</strong> {vehicle.rejectionReason}
                </p>
              </div>
            )}
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="p-3 bg-neutral-50 border border-neutral-100 rounded-2xl w-fit text-neutral-700">
                <Fingerprint className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-secondary/70">
                  Technical Identifiers
                </h3>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm font-medium text-neutral-500 pt-3 border-t border-neutral-50">
              <span>Routing Pipeline State</span>
              <span className={`font-semibold ${vehicle.isActive ? "text-emerald-600" : "text-secondary/70"}`}>
                {vehicle.isActive ? "ACTIVE" : "INACTIVE"}
              </span>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className="md:col-span-2 xl:col-span-1 bg-white border border-neutral-200 rounded-3xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col justify-between min-h-50 lg:min-h-0"
          >
            <div>
              <h3 className="text-md font-bold text-neutral-800">
                Verification Desk
              </h3>
            </div>

            <div className="mt-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key="actions"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-2 gap-3"
                >
                  <Button
                    disabled={vehicle.status === "approved" || vehicle.status === "rejected"}
                    onClick={() => setOverlayState("reject")}
                    
                  >
                    <XCircle className="w-4 h-4 text-rose-500 shrink-0" /> Reject
                  </Button>
                  <Button
                    disabled={vehicle.status === "approved" || vehicle.status === "rejected"}
                    onClick={() => setOverlayState("approve")}
                    
                  >
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" /> Approve
                  </Button>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>

        </div>
      </div>

      <Overlay
        overlayState={overlayState}
        onClose={() => setOverlayState("idle")}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
};

export default VehicleReview;