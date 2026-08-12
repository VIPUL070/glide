"use client";

import React, { useState } from "react";
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
  CreditCard,
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
} from "lucide-react";
import { VehicleType } from "@/data/booking";
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

  const pickup = params.get("pickup");
  const dropoff = params.get("dropoff");
  const mobile = params.get("mobile") || "";
  const vehicleParam = (params.get("vehicle") as VehicleType) || "car";
  const fare = Number(params.get("fare"));
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
  const [paymentMethod, setPaymentMethod] = useState<"card" | "upi" | "cash">(
    "card"
  );
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const serviceFee = Math.round(fare * 0.1);
  const totalFare = fare + serviceFee;

  const handleBooking = async () => {
    setIsSubmitting(true);
    setFormError("");

    try {
      await axios.post(`/api/booking/create`, {
        driverId ,
        vehicleId,
        pickupAddress: pickup,
        dropoffAddress: dropoff,
        pickUpLocation: {
          type: "Point",
          coordinates: [pickupLon, pickupLat]
        },
        dropoffLocation: {
          type: "Point",
          coordinates: [dropoffLon, dropoffLat]
        },
        userMobile: mobile.replace(/\s+/g, "").trim(),
        fare,
      });

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

  return (
    <div className="min-h-screen w-full pt-[9vh] relative bg-foreground text-secondary antialiased select-none z-10">
      <div className="min-h-screen bg-background text-foreground selection:bg-neutral-900 selection:text-white">
        <header className="relative z-40 w-full border-b border-neutral-200/80 bg-white/80 apple-blur">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => router.back()}
              className="group flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-secondary transition-colors hover:text-black focus:outline-none"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              <span>Back to Selection</span>
            </button>

            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">
              <Lock className="h-3.5 w-3.5 text-emerald-600" />
              <span>Secure Booking</span>
            </div>
          </div>
        </header>

        {/* Main Container */}
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
          <motion.div
            variants={heroContainerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 gap-8 lg:grid-cols-12"
          >
            <div className="flex flex-col gap-6 lg:col-span-7 xl:col-span-8">
              <motion.div variants={itemVariants} className="space-y-1">
                <h1 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
                  Confirm your Booking
                </h1>
                <p className="text-sm text-secondary">
                  Review route details and enter rider info to complete
                  reservation.
                </p>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-sm transition-all hover:shadow-md"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-secondary">
                    Trip Details
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                    <Sparkles className="h-3 w-3" /> Instant Booking
                  </span>
                </div>

                <div className="relative flex flex-col gap-6 pl-2">
                  <div className="absolute left-4.75 top-6.5 h-[calc(100%-52px)] w-0.5 rounded-full bg-neutral-200" />

                  <div className="relative flex items-start gap-4">
                    <div className="z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-black text-white shadow-sm">
                      <MapPin className="h-3.5 w-3.5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                          Pickup Location
                        </p>
                        {pickupLat && pickupLon && (
                          <span className="text-[12px] font-medium text-neutral-400">
                            {pickupLat.toFixed(4)}, {pickupLon.toFixed(4)}
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm font-semibold text-neutral-800">
                        {pickup}
                      </p>
                    </div>
                  </div>

                  <div className="relative flex items-start gap-4">
                    <div className="z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-neutral-300 bg-white text-neutral-700 shadow-sm">
                      <Navigation className="h-3.5 w-3.5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                          Dropoff Destination
                        </p>
                        {dropoffLat && dropoffLon && (
                          <span className="text-[12px] font-medium text-neutral-400">
                            {dropoffLat.toFixed(4)}, {dropoffLon.toFixed(4)}
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm font-semibold text-neutral-800">
                        {dropoff}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-sm transition-all hover:shadow-md"
              >
                <h2 className="mb-4 text-xs font-bold uppercase tracking-wider text-secondary">
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

              <motion.div
                variants={itemVariants}
                className="rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-sm transition-all hover:shadow-md"
              >
                <h2 className="mb-4 text-xs font-bold uppercase tracking-wider text-secondary">
                  Select Payment Method
                </h2>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("card")}
                    className={`relative flex flex-col items-start justify-between rounded-2xl border p-4 text-left transition-all ${
                      paymentMethod === "card"
                        ? "border-black bg-neutral-900 text-white shadow-md"
                        : "border-neutral-200 bg-white text-neutral-800 hover:border-neutral-300"
                    }`}
                  >
                    <CreditCard className="h-5 w-5" />
                    <div className="mt-4">
                      <p className="text-sm font-semibold">Card</p>
                      <p
                        className={`text-xs ${
                          paymentMethod === "card"
                            ? "text-neutral-400"
                            : "text-neutral-500"
                        }`}
                      >
                        Credit or Debit
                      </p>
                    </div>
                    {paymentMethod === "card" && (
                      <CheckCircle2 className="absolute right-3 top-3 h-4 w-4 text-white" />
                    )}
                  </button>

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
                        Google / Apple Pay
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

              <motion.div
                variants={itemVariants}
                className="flex items-center gap-4 rounded-3xl border border-neutral-200/80 bg-neutral-100/60 p-5"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-neutral-900 shadow-sm">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-neutral-900">
                    Free Cancellation Guarantee
                  </p>
                  <p className="text-xs text-secondary">
                    Cancel up to 15 minutes before driver dispatch with zero
                    penalties or charges.
                  </p>
                </div>
              </motion.div>
            </div>

            <div className="lg:col-span-5 xl:col-span-4">
              <motion.div
                variants={itemVariants}
                className="sticky top-24 rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-xl shadow-neutral-200/50"
              >
                <div className="flex items-center gap-4 border-b border-neutral-100 pb-5">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-neutral-900 text-white">
                    <VehicleIcon className="h-8 w-8" />
                  </div>
                  <div>
                    <span className="rounded-md bg-neutral-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-neutral-600">
                      Selected Vehicle
                    </span>
                    <h3 className="mt-0.5 ml-1 text-base font-bold text-neutral-900">
                      {vehicleTitle}
                    </h3>
                  </div>
                </div>

                <div className="my-6 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-secondary">
                    Fare Details
                  </h4>

                  <div className="flex justify-between text-md text-neutral-600">
                    <span>Service Tax & Platform Fee</span>

                    <span className="font-medium text-neutral-900 flex items-center">
                      <IndianRupee className="h-3.5 w-3.5 mr-0.5 stroke-3" />
                      {serviceFee.toFixed(2)}
                    </span>
                  </div>

                  <div className="border-t border-dashed border-neutral-200 pt-3">
                    <div className="flex items-baseline justify-between">
                      <span className="text-base font-bold text-neutral-900">
                        Total Price
                      </span>
                      <div className="text-right">
                        <span className="text-2xl font-black text-neutral-900 flex items-center">
                          <IndianRupee className="h-4 w-4 mr-0.5 stroke-3" />
                          {totalFare.toFixed(2)}
                        </span>
                        <p className="text-[12px] text-neutral-400">
                          All taxes included
                        </p>
                      </div>
                    </div>
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
                  className="w-full rounded-2xl! py-4"
                  onClick={handleBooking}
                  disabled={isSubmitting}
                  rightIcon={<ChevronRight className="h-4 w-4" />}
                >
                  {isSubmitting ? <Spinner /> : "Request Ride"}
                </Button>

                <div className="mt-4 flex items-center justify-center gap-2 text-[12px] text-neutral-400">
                  <Clock className="h-3.5 w-3.5" />
                  <span>Driver arrives in ~5 mins upon confirmation</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </main>

        <div className="fixed bottom-0 left-0 right-0 z-40 border-t h-40 border-neutral-200 bg-white/90 p-6 apple-blur lg:hidden">
          <div className="mx-auto flex max-w-md flex-col items-center justify-between gap-4">
            <div>
              <p className="text-[14px] uppercase font-bold text-neutral-400">
                Total Payable
              </p>
              <p className="text-xl font-black text-neutral-900">
                ${totalFare.toFixed(2)}
              </p>
            </div>
            <Button
              variant="primary"
              size="lg"
              className="flex-1 min-w-0! rounded-2xl!"
              onClick={handleBooking}
              disabled={isSubmitting}
            >
              {isSubmitting ? <Spinner /> : "Request Ride"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
