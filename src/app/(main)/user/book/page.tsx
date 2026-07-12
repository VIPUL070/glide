"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Layers,
  CheckCircle2,
  Phone,
  User,
  Navigation,
  LocateFixed,
  MapPin,
} from "lucide-react";
import {
  heroContainerVariants,
  inputRowVariants,
  itemVariants,
} from "@/lib/animation";
import InputField from "@/components/ui/InputField";
import Button from "@/components/ui/Button";
import { Suggestions, VEHICLE_OPTIONS, VehicleType } from "@/data/booking";
import axios, { isAxiosError } from "axios";

function BookingPage() {
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [phone, setPhone] = useState("");
  const [userName, setUserName] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleType>();
  const [locating, setLocating] = useState(false);
  const [addressSuggestion, setAddressSuggestions] = useState<Suggestions[]>(
    []
  );
  const [dropSuggestions, setDropSuggestions] = useState<Suggestions[]>(
    []
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingStep, setBookingStep] = useState<"compose" | "confirmed">(
    "compose"
  );

  const searchAddress = async (
    q: string,
    setResults: (r: Suggestions[]) => void
  ) => {
    try {
      if (!q || q.trim().length < 3) {
        setResults([]);
        return;
      }

      const { data } = await axios.get(
        `https://photon.komoot.io/api/?q=${encodeURIComponent(
          q.trim()
        )}&limit=8&lang=en`
      );

      const res: Suggestions[] = (data.features ?? []).map((f: any) => ({
        id: String(f.properties.osm_id),
        name: f.properties.name,
        city: f.properties.city,
        state: f.properties.state,
        country: f.properties.country,
        countrycode: f.properties.countrycode,
        lat: f.geometry.coordinates[1],
        lng: f.geometry.coordinates[0],
      }));
      setResults(res);
    } catch (error) {
      if (isAxiosError(error)) {
        console.log(error.response?.data?.message || "Something went wrong");
      } else if (error instanceof Error) {
        console.log(error.message);
      } else {
        console.log("Some unexpected error occured.");
      }
    }
  };

  const formatAddress = (p: Suggestions) =>
    [p.name, p.city, p.state, p.country].filter(Boolean).join(",");

  const getCurrentLocation = () => {
    if (locating) return;
    if (!navigator.geolocation) return;
    setLocating(true);
    setPickup("");
    navigator.geolocation.getCurrentPosition(async ({ coords }) => {
      try {
        const { data } = await axios.get(
          `https://photon.komoot.io/reverse?lon=${coords.longitude}&lat=${coords.latitude}`
        );
        console.log(data)

        if (data.features.length) {
          const p = data.features[0].properties;
          const address = [p.name, p.street, p.city, p.state, p.country]
            .filter(Boolean)
            .join(",");
          setPickup(address);
          setAddressSuggestions([]);
        }
      } catch (error) {
        if (isAxiosError(error)) {
          console.log(error.response?.data?.message || "Something went wrong");
        } else if (error instanceof Error) {
          console.log(error.message);
        } else {
          console.log("Some unexpected error occured.");
        }
      } finally {
        setLocating(false);
      }
    });
  };

  const handleBookingExecution = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="h-full relative pt-[9vh] bg-foreground text-primary antialiased selection:bg-neutral-200">
      <div className="w-full grid grid-cols-1 lg:grid-cols-1 min-h-[calc(100vh-69px)]">
        <div className="col-span-1 lg:col-span-1  border-r border-secondary/10 flex flex-col justify-between bg-background text-secondary overflow-y-auto max-h-[calc(100vh-69px)] scrollbar-none lg:px-[25vw] lg:py-[5vh] md:px-[15vw] md:py-[5vh]">
          <AnimatePresence mode="wait">
            {bookingStep === "compose" ? (
              <motion.form
                key="booking-form"
                variants={heroContainerVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleBookingExecution}
                className="p-6 md:p-8 space-y-8 flex-1"
              >
                <motion.div variants={itemVariants} className="space-y-1.5">
                  <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                    Where can we take you?
                  </h1>
                  <p className="text-sm font-normal">
                    Select your route and time.
                  </p>
                </motion.div>

                <motion.div
                  variants={inputRowVariants}
                  className="space-y-4 relative"
                >
                  <div className="relative">
                    <InputField
                      label="Pick-up Location"
                      id="pickup"
                      type="text"
                      required
                      placeholder="Enter pickup coordinates or address"
                      value={pickup}
                      disabled={locating}
                      onChange={(e) => {
                        setPickup(e.target.value);
                        searchAddress(e.target.value, setAddressSuggestions);
                      }}
                      icon={
                        <LocateFixed
                          onClick={getCurrentLocation}
                          className={`h-7 w-7 text-black bg-foreground/15 rounded-lg p-1.5 ${locating ? "animate-spin bg-transparent": ""}`}
                        />
                      }
                    />
                    <AnimatePresence>
                      {addressSuggestion.length > 0 && (
                        <motion.ul
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute z-50 w-full bg-white mt-1 border border-neutral-200 rounded-xl shadow-xl max-h-60 overflow-y-auto divided-y divide-neutral-100 divide-y"
                        >
                          {addressSuggestion.map((item) => (
                            <motion.li
                              key={item.id}
                              whileHover={{ backgroundColor: "#f5f5f5" }}
                              onClick={() => {
                                setPickup(formatAddress(item));
                                setAddressSuggestions([]);
                              }}
                              className="px-4 py-3 text-sm text-left text-neutral-800 cursor-pointer flex items-center gap-3"
                            >
                              <MapPin className="h-4 w-4 text-neutral-400 shrink-0" />
                              <span className="truncate">
                                {formatAddress(item)}
                              </span>
                            </motion.li>
                          ))}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="relative">
                    <InputField
                      label="Drop-off Destination"
                      id="dropoff"
                      type="text"
                      required
                      placeholder="Where to? (Destination)"
                      value={dropoff}
                      onChange={(e) => {
                        setDropoff(e.target.value)
                        searchAddress(e.target.value, setDropSuggestions);
                      }}
                      icon={<Navigation className="h-4 w-4 text-black" />}
                    />

                    <AnimatePresence>
                      {dropSuggestions.length > 0 && (
                        <motion.ul
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute z-50 w-full bg-white mt-1 border border-neutral-200 rounded-xl shadow-xl max-h-60 overflow-y-auto divided-y divide-neutral-100 divide-y"
                        >
                          {dropSuggestions.map((item) => (
                            <motion.li
                              key={item.id}
                              whileHover={{ backgroundColor: "#f5f5f5" }}
                              onClick={() => {
                                setDropoff(formatAddress(item));
                                setDropSuggestions([]);
                              }}
                              className="px-4 py-3 text-sm text-left text-neutral-800 cursor-pointer flex items-center gap-3"
                            >
                              <MapPin className="h-4 w-4 text-neutral-400 shrink-0" />
                              <span className="truncate">
                                {formatAddress(item)}
                              </span>
                            </motion.li>
                          ))}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>

                <motion.div
                  variants={inputRowVariants}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                >
                  <InputField
                    label="Passenger Name"
                    id="userName"
                    type="text"
                    placeholder="John Doe"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    icon={<User className="h-4 w-4 text-black" />}
                  />
                  <InputField
                    label="Mobile Number"
                    id="phone"
                    type="tel"
                    required
                    placeholder="+91 XXXXX XXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    icon={<Phone className="h-4 w-4 text-black" />}
                  />
                </motion.div>

                <motion.div
                  variants={inputRowVariants}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-neutral-50 p-4 rounded-2xl border border-secondary/5"
                >
                  <InputField
                    label="Departure Date"
                    id="bookingDate"
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                  />
                  <InputField
                    label="Target Window Time"
                    id="bookingTime"
                    type="time"
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                  />
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-[13px] font-bold tracking-widest uppercase opacity-80">
                      Select Fleet Vehicle
                    </label>
                    <span className="text-xs  font-medium flex items-center gap-1">
                      <Layers className="h-3 w-3" /> 5 Tiers
                    </span>
                  </div>

                  <div className="space-y-2 max-h-70 overflow-y-auto pr-1">
                    {VEHICLE_OPTIONS.map((v) => {
                      const isSelected = selectedVehicle === v.id;
                      return (
                        <motion.div
                          key={v.id}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          onClick={() => setSelectedVehicle(v.id)}
                          className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${
                            isSelected
                              ? "border-black bg-foreground text-primary shadow-md shadow-neutral-200"
                              : "border-secondary/10 bg-background text-secondary hover:bg-neutral-50"
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className={`p-3 rounded-xl transition-colors ${
                                isSelected
                                  ? "bg-background/10 text-primary"
                                  : "bg-background/10 text-secondary"
                              }`}
                            >
                              {<v.icon className="h-5 w-5" />}
                            </div>
                            <div className="text-left">
                              <div className="flex items-center gap-2">
                                <h4 className="text-sm font-bold tracking-tight">
                                  {v.name}
                                </h4>
                                {v.popular && (
                                  <span
                                    className={`text-[9px] px-1.5 py-0.5 rounded-full uppercase font-black tracking-widest ${
                                      isSelected
                                        ? "bg-background text-secondary"
                                        : "bg-foreground text-primary"
                                    }`}
                                  >
                                    Best Value
                                  </span>
                                )}
                              </div>
                              <p
                                className={`text-xs ${
                                  isSelected
                                    ? "text-primary/70"
                                    : "text-secondary"
                                }`}
                              >
                                {v.tagline}
                              </p>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="text-sm font-extrabold block">
                              {v.capacity}
                            </span>
                            <span
                              className={`text-[10px] block ${
                                isSelected
                                  ? "text-primary/80"
                                  : "text-secondary"
                              }`}
                            >
                              ETA: {v.eta}
                            </span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="pt-4 border-t border-neutral-100"
                >
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={isSubmitting || !pickup || !dropoff || !phone}
                    className="w-full"
                  >
                    {isSubmitting ? "Booking..." : `Confirm Booking`}
                  </Button>
                </motion.div>
              </motion.form>
            ) : (
              <motion.div
                key="booking-confirmed"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="p-8 md:p-12 text-center my-auto space-y-6"
              >
                <div className="w-16 h-16 bg-neutral-900 text-primary rounded-full flex items-center justify-center mx-auto shadow-xl">
                  <CheckCircle2 className="h-8 w-8 text-emerald-400" />
                </div>

                <div className="space-y-2">
                  <h2 className="text-2xl font-black tracking-tight">
                    Your booking is confirmed.
                  </h2>
                  <p className="text-sm text-secondary max-w-sm mx-auto">
                    A driverhas accepted your booking. Track details below.
                  </p>
                </div>

                <div className="bg-neutral-50 rounded-2xl border border-secondary/10 p-5 text-left space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-neutral-200/60"></div>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-secondary">
                      Route
                    </span>
                    <p className="text-sm font-semibold truncate">
                      <span className="text-emerald-500">From:</span> {pickup}
                    </p>
                    <p className="text-sm font-semibold truncate">
                      <span className="text-indigo-500">To:</span> {dropoff}
                    </p>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest font-bold text-secondary block">
                        Assigned Vehicle
                      </span>
                      <span className="text-xs font-bold uppercase">
                        {selectedVehicle} Model
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  variant="transparent"
                  size="md"
                  className="w-full"
                  onClick={() => {
                    setBookingStep("compose");
                    setPickup("");
                    setDropoff("");
                  }}
                >
                  Configure New Booking
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="p-4 bg-neutral-50 text-center border-t border-neutral-100 text-[13px] tracking-wide text-secondary/70 font-medium">
            Thank you for booking a ride. Have a safe journey
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingPage;
