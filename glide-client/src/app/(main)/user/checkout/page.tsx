"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bike,
  Car,
  Zap,
  Package,
  Truck,
  LucideIcon,
  MapPin,
  Navigation,
  ShieldCheck,
  Wallet,
  ArrowLeft,
  ChevronRight,
  User,
  Phone,
  Mail,
  Lock,
  Clock,
  Sparkles,
  CheckCircle2,
  IndianRupee,
  Radio,
  XCircle,
  CheckCircle,
} from "lucide-react";
import { IBookingResponse, VehicleType } from "@/data/booking";
import { heroContainerVariants, itemVariants } from "@/lib/animation";
import InputField from "@/components/ui/InputField";
import FormError from "@/components/ui/FormError";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import axios, { isAxiosError } from "axios";

const vehicleIcons: Record<VehicleType, LucideIcon> = {
  bike: Bike,
  car: Car,
  ev: Zap,
  loading: Package,
  truck: Truck,
};

const vehicleNames: Record<VehicleType, string> = {
  bike: "Bike Ride",
  car: "Comfort Sedan",
  ev: "Eco Green EV",
  loading: "Cargo Loader",
  truck: "Heavy Transport Truck",
};

function CheckoutPage() {
  const router = useRouter();
  const params = useSearchParams();

  const pickup = params.get("pickup") || "";
  const dropoff = params.get("dropoff") || "";
  const mobile = params.get("mobile") || "";
  const vehicleParam = (params.get("vehicle") as VehicleType) || "car";
  const fare = Number(params.get("fare")) || 0;
  const driverId = params.get("driverId");
  const vehicleId = params.get("vehicleId");

  const pickupLat = Number(params.get("pickupLat"));
  const pickupLon = Number(params.get("pickupLon"));
  const dropoffLat = Number(params.get("dropoffLat"));
  const dropoffLon = Number(params.get("dropoffLon"));

  const VehicleIcon = vehicleIcons[vehicleParam] || Car;
  const vehicleTitle = vehicleNames[vehicleParam] || "Standard Ride";

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(mobile);
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "cash">("cash");
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<
    "idle" | "requested" | "awaiting_payment" | string
  >("idle");

  const [booking, setBooking] = useState<IBookingResponse>();

  const serviceFee = Math.round(fare * 0.1);
  const totalFare = fare + serviceFee;

  const handleBooking = async () => {
    setIsSubmitting(true);
    setFormError("");

    try {
      const { data } = await axios.post(`/api/booking/create`, {
        driverId,
        vehicleId,
        pickupAddress: pickup,
        dropoffAddress: dropoff,
        pickUpLocation: {
          type: "Point",
          coordinates: [pickupLon, pickupLat],
        },
        dropoffLocation: {
          type: "Point",
          coordinates: [dropoffLon, dropoffLat],
        },
        userMobile: mobile.replace(/\s+/g, "").trim(),
        fare,
      });
      setBooking(data.booking);
      setStatus("requested");
    } catch (err) {
      if (isAxiosError(err)) {
        setFormError(
          err.response?.data?.message || "Failed to query localized fleets."
        );
      } else if (err instanceof Error) {
        setFormError(err.message);
      } else {
        setFormError("An unpredictable network error occurred.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelRequest = async (id: string) => {
    try {
      const { data } = await axios.patch(`/api/booking/${id}/cancel`);
      console.log(data);
      console.log(booking?.bookingStatus);
      setStatus("idle");
    } catch (err) {
      console.error("Failed to cancel ride:", err);
    }
  };

  const findActiveBooking = async () => {
    try {
      const { data } = await axios.get(`/api/booking/active`);
      setBooking(data.booking);
      setStatus(data.booking.bookingStatus || data.booking || "idle");
    } catch (err) {
      if (isAxiosError(err)) {
        console.log(
          err.response?.data?.message || "Failed to query localized fleets."
        );
      } else if (err instanceof Error) {
        console.log(err.message);
      } else {
        console.log("An unpredictable network error occurred.");
      }
    }
  };

  useEffect(() => {
    findActiveBooking();
  }, []);

  return (
    <div className="min-h-screen w-full pt-[9vh] pb-24 lg:pb-12 relative bg-foreground text-neutral-800 antialiased select-none z-10">
      <header className="sticky top-0 z-40 w-full border-b border-neutral-200/80 bg-background backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => router.back()}
            className="group flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-500 transition-colors hover:text-black focus:outline-none"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Selection</span>
          </button>

          <div className="hidden lg:flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">
            <Lock className="h-3.5 w-3.5 text-emerald-600" />
            <span>Secure Booking</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto w-full px-4 py-6 sm:px-6 md:py-8 lg:px-8 lg:py-12 bg-background">
        <motion.div
          variants={heroContainerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 gap-8 lg:grid-cols-12 xl:gap-10"
        >
          <div className="flex flex-col gap-6 lg:col-span-7 xl:col-span-8">
            <motion.div variants={itemVariants} className="space-y-1">
              <h1 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl lg:text-4xl">
                Confirm your Booking
              </h1>
              <p className="text-sm text-neutral-500">
                Review route details and enter rider info to complete
                reservation.
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="rounded-3xl border border-neutral-200/80 bg-white p-5 sm:p-6 shadow-sm transition-all hover:shadow-md"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                  Trip Details
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                  <Sparkles className="h-3 w-3" /> Instant Dispatch
                </span>
              </div>

              <div className="relative flex flex-col gap-6 pl-2">
                <div className="absolute left-4.25 top-6.5 h-[calc(100%-48px)] w-0.5 rounded-full bg-neutral-200" />

                <div className="relative flex items-start gap-4">
                  <div className="z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-black text-white shadow-sm">
                    <MapPin className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                        Pickup Location
                      </p>
                      {pickupLat && pickupLon && (
                        <span className="text-[11px] font-mono text-neutral-400">
                          {pickupLat.toFixed(4)}, {pickupLon.toFixed(4)}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm font-semibold text-neutral-800 wrap-break-word">
                      {pickup || "Location not selected"}
                    </p>
                  </div>
                </div>

                <div className="relative flex items-start gap-4">
                  <div className="z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-neutral-300 bg-white text-neutral-700 shadow-sm">
                    <Navigation className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                        Dropoff Destination
                      </p>
                      {dropoffLat && dropoffLon && (
                        <span className="text-[11px] font-mono text-neutral-400">
                          {dropoffLat.toFixed(4)}, {dropoffLon.toFixed(4)}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm font-semibold text-neutral-800 wrap-break-words">
                      {dropoff || "Destination not selected"}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="rounded-3xl border border-neutral-200/80 bg-white p-5 sm:p-6 shadow-sm transition-all hover:shadow-md"
            >
              <h2 className="mb-4 text-xs font-bold uppercase tracking-wider text-neutral-500">
                Rider Information
              </h2>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <InputField
                    id="fullName"
                    label="Full Name"
                    placeholder="Enter your name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    icon={<User className="h-4 w-4" />}
                  />
                </div>

                <InputField
                  id="phone"
                  label="Phone Number"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  icon={<Phone className="h-4 w-4" />}
                />

                <InputField
                  id="email"
                  label="Email (For Receipt)"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  icon={<Mail className="h-4 w-4" />}
                />
              </div>
            </motion.div>

            {/* Payment Method Selector */}
            {status === "awaiting_payment" && (
              <motion.div
                variants={itemVariants}
                className="rounded-3xl border border-neutral-200/80 bg-white p-5 sm:p-6 shadow-sm transition-all hover:shadow-md"
              >
                <h2 className="mb-4 text-xs font-bold uppercase tracking-wider text-neutral-500">
                  Select Payment Method
                </h2>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("upi")}
                    className={`relative flex flex-col items-start justify-between rounded-2xl border p-4 text-left transition-all ${
                      paymentMethod === "upi"
                        ? "border-black bg-neutral-900 text-white shadow-md"
                        : "border-neutral-200 bg-white text-neutral-800 hover:border-neutral-300"
                    }`}
                  >
                    <Zap className="h-5 w-5" />
                    <div className="mt-4">
                      <p className="text-sm font-semibold">Instant UPI</p>
                      <p
                        className={`text-xs ${
                          paymentMethod === "upi"
                            ? "text-neutral-400"
                            : "text-neutral-500"
                        }`}
                      >
                        Google / PhonePe
                      </p>
                    </div>
                    {paymentMethod === "upi" && (
                      <CheckCircle2 className="absolute right-3 top-3 h-4 w-4 text-white" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("cash")}
                    className={`relative flex flex-col items-start justify-between rounded-2xl border p-4 text-left transition-all ${
                      paymentMethod === "cash"
                        ? "border-black bg-neutral-900 text-white shadow-md"
                        : "border-neutral-200 bg-white text-neutral-800 hover:border-neutral-300"
                    }`}
                  >
                    <Wallet className="h-5 w-5" />
                    <div className="mt-4">
                      <p className="text-sm font-semibold">Pay at Pickup</p>
                      <p
                        className={`text-xs ${
                          paymentMethod === "cash"
                            ? "text-neutral-400"
                            : "text-neutral-500"
                        }`}
                      >
                        Cash or POS
                      </p>
                    </div>
                    {paymentMethod === "cash" && (
                      <CheckCircle2 className="absolute right-3 top-3 h-4 w-4 text-white" />
                    )}
                  </button>
                </div>
              </motion.div>
            )}

            <motion.div
              variants={itemVariants}
              className="flex items-center gap-4 rounded-3xl border border-neutral-200/80 bg-neutral-100/70 p-5"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-neutral-900 shadow-sm">
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-900">
                  Free Cancellation Guarantee
                </p>
                <p className="text-xs text-neutral-500">
                  Cancel up to 15 minutes before driver dispatch with zero
                  penalties or charges.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Status Cards (Idle / Requested / Awaiting Payment) */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="sticky top-24">
              <AnimatePresence mode="wait">
                {/* 1. IDLE STATUS: Request Card without Fare details */}
                {status === "idle" && (
                  <motion.div
                    key="idle-card"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.25 }}
                    className="rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-xl shadow-neutral-200/50"
                  >
                    {/* Vehicle Header */}
                    <div className="flex items-center gap-4 border-b border-neutral-100 pb-5">
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-neutral-900 text-white shadow-inner">
                        <VehicleIcon className="h-8 w-8" />
                      </div>
                      <div>
                        <span className="rounded-md bg-neutral-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-neutral-600">
                          Selected Vehicle
                        </span>
                        <h3 className="mt-0.5 text-base font-bold text-neutral-900">
                          {vehicleTitle}
                        </h3>
                      </div>
                    </div>

                    {/* Booking  Summary */}
                    <div className="my-6 space-y-3.5 rounded-2xl bg-neutral-50 p-4 border border-neutral-100">
                      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                        <Sparkles className="h-4 w-4 text-amber-500" />
                        <span>Ready for Dispatch</span>
                      </div>
                      <p className="text-sm text-neutral-600 leading-relaxed">
                        Driver network active. Drivers nearby are on standby to
                        accept your route request immediately.
                      </p>
                      <div className="flex items-center gap-2 text-xs text-neutral-500 pt-1 border-t border-neutral-200/60">
                        <Clock className="h-3.5 w-3.5 text-neutral-400" />
                        <span>Est. Pickup: 3 - 5 mins after confirmation</span>
                      </div>
                    </div>

                    <AnimatePresence>
                      {formError && (
                        <div className="mb-4">
                          <FormError message={formError} />
                        </div>
                      )}
                    </AnimatePresence>

                    <Button
                      variant="primary"
                      size="sm"
                      className="w-full transition-transform active:scale-[0.98]"
                      onClick={handleBooking}
                      disabled={isSubmitting}
                      rightIcon={<ChevronRight className="h-4 w-4" />}
                    >
                      {isSubmitting ? <Spinner /> : "Request Ride"}
                    </Button>

                    <div className="mt-4 flex items-center justify-center gap-2 text-[12px] text-neutral-400">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                      <span>Zero booking fee prior to driver acceptance</span>
                    </div>
                  </motion.div>
                )}

                {/* 2. REQUESTED STATUS: Animated Loader */}
                {status === "requested" && (
                  <motion.div
                    key="requested-card"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="relative overflow-hidden rounded-2xl border border-neutral-900/10 bg-background p-3 sm:p-6 text-secondary shadow-xl"
                  >
                    <div className="absolute -top-24 -left-24 h-56 w-56 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-24 -right-24 h-56 w-56 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />

                    <div className="relative z-10 flex flex-col items-center text-center">
                      <div className="relative my-6 flex h-44 w-44 items-center justify-center">
                        <motion.div
                          className="absolute inset-0 rounded-full border border-emerald-500/30 bg-emerald-500/5"
                          animate={{
                            scale: [1, 1.4, 1.8],
                            opacity: [0.6, 0.25, 0],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeOut",
                          }}
                        />

                        <motion.div
                          className="absolute inset-4 rounded-full border border-emerald-400/40"
                          animate={{
                            scale: [1, 1.3, 1.6],
                            opacity: [0.8, 0.3, 0],
                          }}
                          transition={{
                            duration: 3,
                            delay: 1,
                            repeat: Infinity,
                            ease: "easeOut",
                          }}
                        />

                        <motion.div
                          className="absolute inset-2 rounded-full border-2 border-dashed border-neutral-700/60"
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 20,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        />

                        <motion.div
                          className="absolute inset-6 rounded-full border-t-2 border-r-2 border-emerald-400 border-b-transparent border-l-transparent"
                          animate={{ rotate: -360 }}
                          transition={{
                            duration: 2.5,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        />

                        <motion.div
                          animate={{ scale: [0.95, 1.08, 0.95] }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                          className="relative flex h-15 w-15 items-center justify-center rounded-xl bg-linear-to-tr from-neutral-900 via-neutral-800 to-neutral-700 shadow-2xl border border-neutral-700"
                        >
                          <VehicleIcon className="h-7 w-7 text-emerald-400" />
                          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
                          </span>
                        </motion.div>
                      </div>

                      {/* Animated Text & Status Details */}
                      <div className="space-y-2 mb-6">
                        <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-medium text-emerald-400">
                          <Radio className="h-3 w-3 animate-pulse" />
                          <span>Connecting Local Drivers</span>
                        </div>
                        <h3 className="text-xl font-bold tracking-tight sm:text-2xl">
                          Waiting for Rider Acceptance...
                        </h3>
                        <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                          Broadcasting your ride request to highest-rated
                          drivers nearby. This usually takes under a minute.
                        </p>
                      </div>

                      {/* Cancel Button */}
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleCancelRequest(booking!._id)}
                        className="w-full transition-transform active:scale-[0.98]"
                        leftIcon={
                          <XCircle className="h-4 w-4 text-rose-500 transition-transform group-hover:rotate-90" />
                        }
                      >
                        Cancel Ride
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* 3. AWAITING_PAYMENT STATUS: Price, Fare Details & Pay Button */}
                {status === "awaiting_payment" && (
                  <motion.div
                    key="awaiting-payment-card"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.3 }}
                    className="rounded-3xl border border-emerald-500/30 bg-white p-6 shadow-xl shadow-emerald-500/5"
                  >
                    {/* Accepted badge */}
                    <div className="mb-4 flex items-center justify-between rounded-xl bg-emerald-50 p-3 text-emerald-800 border border-emerald-200/60">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-emerald-600" />
                        <span className="text-xs font-bold uppercase tracking-wider">
                          Ride Accepted by Driver!
                        </span>
                      </div>
                    </div>

                    {/* Vehicle Title */}
                    <div className="flex items-center gap-4 border-b border-neutral-100 pb-5">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-neutral-900 text-white">
                        <VehicleIcon className="h-7 w-7" />
                      </div>
                      <div>
                        <span className="rounded-md bg-neutral-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-neutral-600">
                          Confirmed Vehicle
                        </span>
                        <h3 className="mt-0.5 text-base font-bold text-neutral-900">
                          {vehicleTitle}
                        </h3>
                      </div>
                    </div>

                    {/* Fare Details */}
                    <div className="my-6 space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                        Fare Breakdown
                      </h4>

                      <div className="flex justify-between text-sm text-neutral-600">
                        <span>Base Trip Fare</span>
                        <span className="font-medium text-neutral-900 flex items-center">
                          <IndianRupee className="h-3.5 w-3.5 mr-0.5" />
                          {fare.toFixed(2)}
                        </span>
                      </div>

                      <div className="flex justify-between text-sm text-neutral-600">
                        <span>Service Tax & Platform Fee</span>
                        <span className="font-medium text-neutral-900 flex items-center">
                          <IndianRupee className="h-3.5 w-3.5 mr-0.5" />
                          {serviceFee.toFixed(2)}
                        </span>
                      </div>

                      <div className="border-t border-dashed border-neutral-200 pt-3">
                        <div className="flex items-baseline justify-between">
                          <span className="text-base font-bold text-neutral-900">
                            Total Fare
                          </span>
                          <div className="text-right">
                            <span className="text-2xl font-black text-neutral-900 flex items-center justify-end">
                              <IndianRupee className="h-5 w-5 mr-0.5 stroke-[2.5]" />
                              {totalFare.toFixed(2)}
                            </span>
                            <p className="text-[11px] text-neutral-400">
                              Inclusive of all taxes & insurance
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Button
                      variant="primary"
                      size="sm"
                      className="w-full active:scale-[0.98]"
                      rightIcon={<ChevronRight className="h-4 w-4" />}
                    >
                      {paymentMethod === "cash"
                        ? "Start Ride"
                        : `Pay ₹${totalFare.toFixed(2)}`}
                    </Button>

                    <div className="mt-4 flex items-center justify-center gap-2 text-[12px] text-neutral-400">
                      <Lock className="h-3.5 w-3.5 text-emerald-600" />
                      <span>Encrypted 256-bit Payment Authorization</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

export default CheckoutPage;
