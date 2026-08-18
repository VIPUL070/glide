"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import axios, { isAxiosError } from "axios";
import {
  MapPin,
  Navigation,
  Clock,
  IndianRupee,
  Phone,
  CheckCircle2,
  XCircle,
  Car,
  CalendarDays,
  Loader2,
  ArrowRight,
  Inbox,
  RefreshCw,
  CreditCard,
  Banknote,
} from "lucide-react";
import { useTilt } from "@/hooks/useTilt";
import { formatDate, formatTime, timeAgo, truncate } from "@/lib/utils";
import { IBookingResponse } from "@/data/booking";
import Button from "@/components/ui/Button";

const SkeletonCard = ({ index }: { index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{
      delay: index * 0.08,
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    }}
    className="rounded-2xl border border-black/6 bg-white p-5 sm:p-6 overflow-hidden relative"
  >
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg--to-r from-transparent via-black/4 to-transparent" />
    <div className="space-y-4">
      <div className="flex justify-between items-start">
        <div className="h-3 w-24 rounded-full bg-black/6" />
        <div className="h-5 w-16 rounded-full bg-black/6" />
      </div>
      <div className="space-y-3 pt-1">
        <div className="flex gap-3 items-center">
          <div className="w-8 h-8 rounded-full bg-black/6 shrink-0" />
          <div className="h-3 flex-1 rounded-full bg-black/6" />
        </div>
        <div className="ml-4 w-px h-4 bg-black/6" />
        <div className="flex gap-3 items-center">
          <div className="w-8 h-8 rounded-full bg-black/6 shrink-0" />
          <div className="h-3 w-3/4 rounded-full bg-black/6" />
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <div className="h-9 flex-1 rounded-xl bg-black/6" />
        <div className="h-9 flex-1 rounded-xl bg-black/6" />
      </div>
    </div>
  </motion.div>
);

const EmptyState = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.96 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
    className="col-span-full flex flex-col items-center justify-center py-24 px-6 text-center"
  >
    <motion.div
      initial={{ y: 8 }}
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      className="w-20 h-20 rounded-3xl bg-black/4 flex items-center justify-center mb-6"
    >
      <Inbox className="w-9 h-9 text-black/25" strokeWidth={1.5} />
    </motion.div>
    <p className="text-[17px] font-semibold text-black/80 mb-1.5">
      No pending requests
    </p>
    <p className="text-[14px] text-black/40 max-w-60 leading-relaxed">
      New ride requests will appear here as they come in.
    </p>
  </motion.div>
);

const BookingCard = ({
  booking,
  index,
  onAccept,
  onReject,
}: {
  booking: IBookingResponse;
  index: number;
  onAccept: (id: string) => Promise<void> | void;
  onReject: (id: string) => Promise<void> | void;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const { rotateX, rotateY, handleMouseMove, handleMouseLeave } =
    useTilt(cardRef);
  const [actionLoading, setActionLoading] = useState<
    "accept" | "reject" | null
  >(null);
  const [dismissed, setDismissed] = useState(false);

  const isCash = booking.paymentStatus === "cash";

  const handleBookingAccept = async () => {
    if (actionLoading) return;
    setActionLoading("accept");
    setDismissed(true);
    setTimeout(() => onAccept(booking._id), 300);
  };

  const handleBookingReject = async () => {
    if (actionLoading) return;
    setActionLoading("reject");
    setDismissed(true);
    setTimeout(() => onReject(booking._id), 300);
  };

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          key={booking._id}
          layout
          initial={{ opacity: 0, y: 32, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95, y: -12 }}
          transition={{
            layout: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] },
            default: {
              delay: index * 0.09,
              duration: 0.55,
              ease: [0.25, 0.46, 0.45, 0.94],
            },
          }}
          style={{ perspective: 800 }}
        >
          <motion.div
            ref={cardRef}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            whileHover={{ scale: 1.012 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="group relative rounded-2xl border border-black/[0.07] bg-white shadow-[0_2px_20px_-4px_rgba(0,0,0,0.08)] overflow-hidden cursor-default"
          >
            <motion.div
              className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-black/10 to-transparent opacity-0 group-hover:opacity-100"
              transition={{ duration: 0.25 }}
            />

            <motion.div
              className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100"
              style={{
                background:
                  "radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(0,0,0,0.018), transparent 60%)",
              }}
              transition={{ duration: 0.3 }}
            />

            <div className="p-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1.5 text-black/40">
                  <Clock className="w-3.5 h-3.5" strokeWidth={2} />
                  <span className="text-[12px] tracking-tight">
                    {timeAgo(booking.createdAt)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium tracking-wide ${
                      isCash
                        ? "bg-amber-50 text-amber-700 border border-amber-200/60"
                        : "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                    }`}
                  >
                    {isCash ? (
                      <Banknote className="w-3 h-3" strokeWidth={2} />
                    ) : (
                      <CreditCard className="w-3 h-3" strokeWidth={2} />
                    )}
                    {isCash ? "Cash" : "Online"}
                  </span>

                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-blue-50 text-blue-600 border border-blue-200/60 tracking-wide">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                    New
                  </span>
                </div>
              </div>

              <div className="relative flex flex-col gap-0 mb-5">
                <div className="flex items-start gap-3">
                  <div className="flex flex-col items-center shrink-0 pt-0.5">
                    <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center shadow-sm">
                      <Navigation
                        className="w-3.5 h-3.5 text-white"
                        strokeWidth={2.5}
                      />
                    </div>

                    <div className="w-px flex-1 min-h-7 bg-linear-to-b from-black/20 to-black/05 my-1" />
                  </div>
                  <div className="pb-1 min-w-0">
                    <p className="text-[11px] text-black/50 uppercase tracking-widest mb-0.5">
                      Pickup
                    </p>
                    <p className="text-[13.5px] font-medium text-black/80 leading-snug">
                      {truncate(booking.pickupAddress, 42)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="shrink-0 pt-0.5">
                    <div className="w-8 h-8 rounded-full bg-black/[0.07] border border-black/1 flex items-center justify-center">
                      <MapPin
                        className="w-3.5 h-3.5 text-black/60"
                        strokeWidth={2.5}
                      />
                    </div>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] text-black/50 uppercase tracking-widest mb-0.5">
                      Drop-off
                    </p>
                    <p className="text-[13.5px] font-medium text-black/80 leading-snug">
                      {truncate(booking.dropoffAddress, 42)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 mb-5 px-3.5 py-3 rounded-xl bg-black/2.5 border border-black/5">
                <div className="flex items-center gap-1.5 flex-1 min-w-0">
                  <IndianRupee
                    className="w-3.5 h-3.5 text-black/50 shrink-0"
                    strokeWidth={2}
                  />
                  <div>
                    <p className="text-[11px] text-black/50 leading-none mb-0.5">
                      Total Fare
                    </p>
                    <p className="text-[17px] font-semibold text-black tracking-tight leading-none">
                      {booking.fare.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>

                <div className="w-px h-8 bg-black/8" />

                <div className="flex items-center gap-1.5 flex-1 min-w-0">
                  <CalendarDays
                    className="w-3.5 h-3.5 text-black/50 shrink-0"
                    strokeWidth={2}
                  />
                  <div>
                    <p className="text-[11px] text-black/50 leading-none mb-0.5">
                      Requested
                    </p>
                    <p className="text-[12px] font-medium text-black/70 leading-none">
                      {formatTime(booking.createdAt)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-5 text-secondary">
                <Phone className="w-3.5 h-3.5 shrink-0" strokeWidth={2} />
                <span className="text-[12.5px]">{booking.userMobile}</span>
                <span className="text-black/20">·</span>
                <span className="text-[11px]">
                  {formatDate(booking.createdAt)}
                </span>
              </div>

              <div className="flex gap-2.5">
                {/* Accept */}
                <Button
                  onClick={handleBookingAccept}
                  disabled={!!actionLoading}
                  size="sm"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  leftIcon={
                    <CheckCircle2 className="w-4 h-4" strokeWidth={2.5} />
                  }
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="relative flex-1 flex items-center justify-center gap-2 h-10 sm:h-11 rounded-xl bg-black text-white text-[13px] font-medium tracking-wide overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <AnimatePresence mode="wait">
                    {actionLoading === "accept" ? (
                      <motion.span
                        key="loader"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                      >
                        <Loader2
                          className="w-4 h-4 animate-spin"
                          strokeWidth={2.5}
                        />
                      </motion.span>
                    ) : (
                      <motion.span
                        key="label"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        className="flex items-center gap-1.5"
                      >
                        Accept Ride
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Button>

                {/* Reject */}
                <Button
                  onClick={handleBookingReject}
                  disabled={!!actionLoading}
                  size="sm"
                  variant="transparent"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  leftIcon={<XCircle className="w-4 h-4" strokeWidth={2.5} />}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="flex-1  border border-black/10 hover:bg-red-50 hover:border-red-200/70 text-black/60 hover:text-red-600 transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <AnimatePresence mode="wait">
                    {actionLoading === "reject" ? (
                      <motion.span
                        key="loader"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                      >
                        <Loader2
                          className="w-4 h-4 animate-spin"
                          strokeWidth={2.5}
                        />
                      </motion.span>
                    ) : (
                      <motion.span
                        key="label"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        className="flex items-center gap-1.5"
                      >
                        Decline
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const PendingRequestsPage = () => {
  const [bookings, setBookings] = useState<IBookingResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);
    try {
      const { data } = await axios.get<IBookingResponse[]>(
        `/api/partner/bookings/pending`
      );
      setBookings(data);
    } catch (error) {
      if (isAxiosError(error)) {
        console.log(error.response?.data?.message ?? "Something went wrong!");
      } else if (error instanceof Error) {
        console.log(error.message);
      } else {
        console.log("An unexpected error occurred.");
      }
    } finally {
      if (isRefresh) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleAccept = async (id: string) => {
    try {
      await axios.patch(`/api/partner/bookings/${id}/accept`);
      setBookings((prev) => prev.filter((b) => b._id !== id));
    } catch (error) {
      if (isAxiosError(error)) {
        console.log(error.response?.data?.message ?? "Something went wrong!");
      } else if (error instanceof Error) {
        console.log(error.message);
      } else {
        console.log("An unexpected error occurred.");
      }
    }
  };

  const handleReject = async (id: string) => {
    try {
      await axios.patch(`/api/partner/bookings/${id}/reject`);
      setBookings((prev) => prev.filter((b) => b._id !== id));
    } catch (error) {
      if (isAxiosError(error)) {
        console.log(error.response?.data?.message ?? "Something went wrong!");
      } else if (error instanceof Error) {
        console.log(error.message);
      } else {
        console.log("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      {/* ── Header ── */}
      <div className="sticky top-0 z-20 border-b border-black/6 bg-[#f5f5f7]/80 apple-blur">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-black flex items-center justify-center shadow-sm">
                <Car className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-[15px] sm:text-[17px] font-semibold text-black tracking-tight leading-none">
                  Pending Requests
                </h1>
                <AnimatePresence mode="wait">
                  {!loading && (
                    <motion.p
                      initial={{ opacity: 0, y: 3 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-[11px] text-black/40 mt-0.5"
                    >
                      {bookings.length === 0
                        ? "No requests"
                        : `${bookings.length} request${
                            bookings.length > 1 ? "s" : ""
                          } waiting`}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <motion.button
              onClick={() => fetchBookings(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={loading || refreshing}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12.5px] font-medium text-black/55 bg-white border border-black/8 shadow-sm hover:bg-black/3 transition-colors duration-150 disabled:opacity-50"
            >
              <motion.span
                animate={{ rotate: refreshing ? 360 : 0 }}
                transition={{
                  duration: 0.8,
                  ease: "linear",
                  repeat: refreshing ? Infinity : 0,
                }}
              >
                <RefreshCw className="w-3.5 h-3.5" strokeWidth={2.5} />
              </motion.span>
              <span className="hidden sm:inline">Refresh</span>
            </motion.button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        {!loading && bookings.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 mb-6 px-4 py-2.5 rounded-xl bg-white border border-black/6 shadow-sm w-fit"
          >
            <span className="relative flex w-2 h-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-[12px] font-medium text-black/50">
              Live — updates in real time
            </span>
            <ArrowRight className="w-3 h-3 text-secondary" strokeWidth={2.5} />
          </motion.div>
        )}

        {/* Error banner */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mb-6 px-4 py-3 rounded-xl bg-red-50 border border-red-200/60 text-[13px] text-red-600"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5"
        >
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <SkeletonCard key={i} index={i} />
            ))
          ) : bookings.length === 0 ? (
            <EmptyState />
          ) : (
            bookings.map((booking, i) => (
              <BookingCard
                key={booking._id}
                booking={booking}
                index={i}
                onAccept={handleAccept}
                onReject={handleReject}
              />
            ))
          )}
        </motion.div>
      </div>

      <style jsx global>{`
        @keyframes shimmer {
          100% {
            transform: translateX(200%);
          }
        }
      `}</style>
    </div>
  );
};

export default PendingRequestsPage;
