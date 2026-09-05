"use client";

import { BookingsSkeleton } from "@/components/Booking/BookingSkeleton";
import { BookingStatus, IPopulatedBookingResponse, RIDE_STATUS } from "@/data/booking";
import axios from "axios";
import { AlertCircle } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const LiveRideMap = dynamic(() => import("@/components/Ride/LiveRideMap"), {
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

const ActiveRide = () => {
  const [booking, setBooking] = useState<IPopulatedBookingResponse | null>(
    null
  );
  const [driverPos, setDriverPos] = useState<[number, number] | null>(null);
  const [pickup, setPickup] = useState<[number, number] | null>(null);
  const [dropoff, setDropoff] = useState<[number, number] | null>(null);

  const [status,setStatus] = useState<BookingStatus>();

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const getActiveRide = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await axios.get(`/api/partner/my-active`);
        console.log(data);
        setBooking(data);
        setPickup([
          data.pickUpLocation.coordinates[1],
          data.pickUpLocation.coordinates[0],
        ]);
        setDropoff([
          data.dropoffLocation.coordinates[1],
          data.dropoffLocation.coordinates[0],
        ]);
        setStatus(data.bookingStatus)
      } catch (err: unknown) {
        console.error("Partner bookings API fetch failure:", err);
        setError("Unable to retrieve bookings. Please verify your connection.");
      } finally {
        setLoading(false);
      }
    };
    getActiveRide();

    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setDriverPos([lat, lng]);
      },
      (error) => {
        console.log("gps error", error);
      },
      { enableHighAccuracy: true, maximumAge: 2000, timeout: 10000 }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  if (loading) {
    return (
      <main className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <BookingsSkeleton />
      </main>
    );
  }

  if (error) {
    return (
      <main className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-md mx-auto rounded-2xl border border-rose-200 bg-rose-50/70 p-6 text-center space-y-3">
          <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-700 mx-auto">
            <AlertCircle className="w-5 h-5" />
          </div>
          <h2 className="text-sm font-bold text-rose-950">
            Unable to load bookings
          </h2>
          <p className="text-xs text-rose-800 leading-relaxed">{error}</p>
        </div>
      </main>
    );
  }

  return (
    <div className="h-dvh w-full bg-background text-secondary flex flex-col overflow-hidden lg:flex-row">
      <div className="relative flex-1 h-full z-0">
        <LiveRideMap
          driverPos={driverPos}
          pickup={pickup}
          dropoff={dropoff}
          rideStatus={RIDE_STATUS}
          currStatus={status!}
        />
      </div>
    </div>
  );
};

export default ActiveRide;
