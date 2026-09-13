"use client";

import { IPopulatedBookingResponse } from "@/data/booking";
import { PAYMENT_STATUS_STYLES } from "@/lib/constants/bookingStatus";
import { ArrowUpRight, CheckCircle2, IndianRupee, User } from "lucide-react";
import { motion } from "motion/react";
import Button from "../ui/Button";
import { useRouter } from "next/navigation";

interface CompletedRideProps {
  booking: IPopulatedBookingResponse;
  role: string;
}

const CompletedRide = ({ booking, role }: CompletedRideProps) => {
  const router = useRouter();

  const otherPerson =
    role === "driver" ? booking?.user : booking?.driver;

  const otherPersonLabel = role === "driver" ? "Passenger" : "Driver";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-dvh w-full bg-background text-secondary flex flex-col overflow-y-auto"
    >
      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-8 sm:py-12">

        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-6 sm:mb-8"
        >
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-emerald-400/10 flex items-center justify-center">
            <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-emerald-400/20 flex items-center justify-center">
              <CheckCircle2 size={36} className="text-emerald-400 sm:hidden" />
              <CheckCircle2 size={45} className="text-emerald-400 hidden sm:block" />
            </div>
          </div>
        </motion.div>


        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="w-full max-w-md mx-auto text-center flex flex-col gap-3"
        >
          <div className="mb-1">
            <p className="text-xs sm:text-sm tracking-[0.2em] sm:tracking-[0.25em] font-semibold mb-2 text-emerald-400/80">
              Trip successfully complete
            </p>
            <h1 className="text-black text-2xl sm:text-3xl lg:text-4xl font-black mb-2">
              Ride Completed!
            </h1>
            <p className="text-sm sm:text-base text-secondary/70 leading-relaxed max-w-xs sm:max-w-sm mx-auto">
              {role === "driver"
                ? "You have successfully dropped off the customer. Great job!"
                : "You have successfully completed your ride. Hope you enjoyed the trip!"}
            </p>
          </div>


          <div className="bg-background/50 border border-background/30 rounded-xl p-5">
            <p className="text-secondary/60 text-[11px] tracking-wide font-semibold mb-2 text-center">
              {role === "driver" ? "Fare Collected" : "Fare Paid"}
            </p>
            <p className="text-secondary text-4xl sm:text-5xl font-black flex items-center justify-center gap-1 mb-4">
              <IndianRupee size={28} strokeWidth={2.5} className="mt-1" />
              {booking?.fare}
            </p>
            <div className="flex items-center justify-between text-xs border-t border-background/50 pt-3">
              <span className="text-secondary/60">Payment Status</span>
              <span className={PAYMENT_STATUS_STYLES[booking?.paymentStatus]?.badge}>
                {PAYMENT_STATUS_STYLES[booking?.paymentStatus]?.label ??
                  booking.paymentStatus}
              </span>
            </div>
          </div>

          {otherPerson && (
            <div className="bg-background/50 border border-background/30 rounded-xl px-5 py-4 flex items-center gap-4">

              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-emerald-400/20 flex items-center justify-center shrink-0">
                {otherPerson.name ? (
                  <span className="text-emerald-400 font-bold text-base sm:text-lg uppercase">
                    {otherPerson.name.charAt(0)}
                  </span>
                ) : (
                  <User size={20} className="text-emerald-400" />
                )}
              </div>


              <div className="flex flex-col text-left min-w-0">
                <span className="text-[11px] text-secondary/50 font-medium tracking-wide">
                  {otherPersonLabel}
                </span>
                <span className="text-secondary font-semibold text-sm sm:text-base truncate">
                  {otherPerson.name ?? "Unknown"}
                </span>
              </div>
            </div>
          )}


          <div className="pt-1">
            <Button
              size="sm"
              variant="primary"
              rightIcon={<ArrowUpRight className="h-5 w-5" />}
              onClick={() => router.push("/")}
              className="w-full sm:w-auto"
            >
              Back to Home
            </Button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CompletedRide;