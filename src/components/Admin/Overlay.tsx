"use client";
import { OverlayType } from "@/app/admin/reviews/partner/[id]/page";
import { AlertCircle, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import Button from "../ui/Button";
import axios, { isAxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import Spinner from "../ui/Spinner";
import FormError from "../ui/FormError";

interface OverlayProps {
  overlayState: "idle" | "approve" | "reject";
  handleOverlay: (state: OverlayType) => void;
}
const Overlay = ({ overlayState, handleOverlay }: OverlayProps) => {
  const {id} = useParams();
  const [rejectionReason, setRejectionReason] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const handleApprove = async () => {
    if (loading) return;
    setLoading(true);
    setError("");
    try {
      await axios.patch(`/api/admin/reviews/partner/${id}/approve`);
      handleOverlay("idle");
      router.refresh();
      router.push('/')
    } catch (error) {
      if (isAxiosError(error)) {
        setError(error.response?.data?.message ?? "Something went wrong!");
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      setError("Please provide a reason for rejection.");
      return;
    }
    if (loading) return;
    setLoading(true);
    setError("");
    try {
      await axios.patch(`/api/admin/reviews/partner/${id}/reject` , {rejectionReason});
      handleOverlay("idle");
      setRejectionReason("");
      router.refresh();
      router.push('/')
    } catch (error) {
      if (isAxiosError(error)) {
        setError(error.response?.data?.message ?? "Something went wrong!");
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const closeOverlay = () => {
    setError("");
    handleOverlay("idle");
  };

  return (
    <AnimatePresence>
      {overlayState !== "idle" && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => handleOverlay("idle")}
            className="fixed inset-0 bg-neutral-950/40 dark:bg-neutral-950/60 backdrop-blur-md z-40 cursor-pointer"
          />

          <motion.div
            layoutId="gooeyActionLayout"
            initial={{ y: "100%", opacity: 0.5, scale: 0.98 }}
            animate={{
              y: 0,
              opacity: 1,
              scale: 1,
              transition: { type: "spring", stiffness: 380, damping: 32 },
            }}
            exit={{
              y: "100%",
              opacity: 0,
              scale: 0.98,
              transition: { duration: 0.25, ease: "easeInOut" },
            }}
            className="fixed bottom-0 md:bottom-10 left-0 right-0 max-w-175 mx-auto bg-white dark:bg-neutral-900 border-t border-x border-neutral-200 dark:border-neutral-800 md:rounded-[2.5rem] rounded-t-[2.5rem] shadow-[0_-8px_40px_rgba(0,0,0,0.12)] p-8 z-50 overflow-hidden"
          >
            <div className="w-12 h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-full mx-auto mb-6 opacity-80" />

            <AnimatePresence>
              {error && <FormError message={error} /> }
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {overlayState === "reject" ? (
                <motion.div
                  key="reject-form"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-5"
                >
                  <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400">
                    <AlertCircle className="w-5 h-5" />
                    <h3 className="text-lg font-bold tracking-tight">
                      Provide Rejection Reason
                    </h3>
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 -mt-2">
                    Please detail the parameters failing compliance validations.
                    This message will be updated in the pipeline ledger.
                  </p>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => {setRejectionReason(e.target.value); if (error) setError("");}}
                    placeholder="e.g., Driving License asset clarity threshold check failed or document expired..."
                    className="w-full h-32 p-4 text-sm bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-primary placeholder-neutral-400 font-medium transition-all resize-none"
                  />
                  <div className="flex gap-3 pt-2">
                    <Button
                      onClick={closeOverlay}
                      className="flex-1"
                      disabled={loading}
                    >
                      {loading ? <Spinner /> : "Cancel"}
                    </Button>
                    <Button
                      disabled={loading}
                      onClick={handleReject}
                      className="flex-1 bg-rose-600 hover:bg-rose-600"
                    >
                      {loading ? <Spinner /> : "Confirm"}
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="approve-form"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-5"
                >
                  <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle className="w-5 h-5" />
                    <h3 className="text-lg font-bold tracking-tight">
                      Approve Profile Pipeline
                    </h3>
                  </div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed font-medium">
                    Are you absolute on deploying approval states? This action
                    maps standard parameters and sets live execution flags onto
                    partner workspace node.
                  </p>
                  <div className="flex gap-3 pt-4">
                    <Button
                      disabled={loading}
                      onClick={closeOverlay}
                      className="flex-1"
                    >
                      {loading ? <Spinner /> : "Cancel"}
                    </Button>
                    <Button
                      disabled={loading}
                      onClick={handleApprove}
                      className="flex-1 text-black bg-background hover:bg-background"
                    >
                      {loading ? <Spinner /> : "Confirm"}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Overlay;
