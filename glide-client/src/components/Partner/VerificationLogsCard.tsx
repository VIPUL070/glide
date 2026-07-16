"use client";
import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowUpRight } from "lucide-react";
import Button from "../ui/Button";
import Spinner from "../ui/Spinner";
import { statCardVariants } from "@/lib/animation";
import { IUser } from "@/models/User.model";
import axios, { isAxiosError } from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";

const VerificationLogsCard = ({ userData, onOpen }: { userData: IUser | null; onOpen: () => void }) => {
  const { vehicles } = useSelector((state: RootState) => state.vehicle);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const currentStep = userData?.steps;
  const isAllGood = currentStep === 7 || currentStep === 8;
  const isRejected = userData && userData?.partnerStatus === "rejected";
  const isKycRejected = userData && userData?.videoKycStatus === "rejected";
  const isVehicleRejected = vehicles && vehicles.status === "rejected";

  const handleRetryKyc = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    try {
      await axios.patch(`/api/partner/videoKyc/retry`);
    } catch (error) {
      if (isAxiosError(error)) {
        console.log(error.response?.data?.message ?? "Something went wrong!");
      } else if (error instanceof Error) {
        console.log(error.message);
      } else {
        console.log("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  }, [loading]);

  const getLogState = () => {
    if (isAllGood) {
      return {
        type: "success",
        title: "Verification Complete",
        message: "All good! Everything is verified and running smoothly.",
        isError: false,
      };
    }
    if (isRejected) {
      return {
        type: "partner",
        title: "Partner Rejected",
        reason: userData?.rejectionReason || "No reason provided",
        isError: true,
        action: (
          <Button
            onClick={() => router.push("/partner/onboarding/vehicle")}
            rightIcon={
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            }
            className="bg-white hover:bg-white/90 text-xs text-black border border-white/8 transition-all group w-full mt-4"
          >
            Check & Update
          </Button>
        ),
      };
    }
    if (isKycRejected) {
      return {
        type: "kyc",
        title: "KYC Rejected",
        reason: userData?.kycRejectionReason || "No reason provided",
        isError: true,
        action: (
          <Button
            onClick={handleRetryKyc}
            disabled={loading}
            rightIcon={
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            }
            className="bg-white hover:bg-white/90 text-xs text-black border border-white/8 transition-all group w-full mt-4"
          >
            {loading ? <Spinner /> : "Retry KYC"}
          </Button>
        ),
      };
    }
    if (isVehicleRejected) {
      return {
        type: "vehicle",
        title: "Vehicle Rejected",
        reason: vehicles.rejectionReason || "No reason provided",
        isError: true,
        action: (
          <Button
            onClick={onOpen}
            rightIcon={
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            }
            className="bg-white hover:bg-white/90 text-xs text-black border border-white/8 transition-all group w-full mt-4"
          >
            Update Vehicle Info
          </Button>
        ),
      };
    }

    return {
      type: "pending",
      title: "Under Onboarding",
      message: "Partner under onboarding......",
      isError: false,
      footer: (
        <div className="text-xs text-primary/60 mt-4">
          Recheck your submitted payloads.
        </div>
      ),
    };
  };

  const logState = getLogState();

  return (
    <motion.div
      custom={2}
      variants={statCardVariants}
      initial="hidden"
      animate="visible"
      className="bg-[#121212] border border-white/10 rounded-3xl p-6 flex flex-col justify-between min-h-62.5"
    >
      <div>
        <p className="text-xs text-primary/60 uppercase tracking-wider mb-3">
          Verification Logs
        </p>

        <h4
          className={`text-base font-medium mb-4 ${
            logState.isError ? "text-rose-400" : "text-emerald-400"
          }`}
        >
          {logState.title}
        </h4>

        {logState.isError ? (
          <div className="flex flex-col gap-2 p-4 rounded-xl bg-rose-500/5 border border-rose-500/20">
            <span className="text-xs font-semibold text-rose-400/60 uppercase tracking-wider">
              Rejection Reason
            </span>
            <span className="text-sm text-rose-300 leading-relaxed">
              {logState.reason}
            </span>
          </div>
        ) : logState.type === "success" ? (
          <div className="flex flex-col items-center justify-center gap-3 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-center">
            <CheckCircle2 className="text-emerald-400 w-8 h-8" />
            <span className="text-sm text-emerald-300 font-medium">
              {logState.message}
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 text-center">
            <span className="text-primary text-md animate-pulse">
              <CheckCircle2 />
            </span>
            <span className="text-xs text-primary/60">{logState.message}</span>
          </div>
        )}
      </div>

      {logState.action || logState.footer}
    </motion.div>
  );
};

export default VerificationLogsCard;