"use client";

import { BookingsSkeleton } from "@/components/Booking/BookingSkeleton";
// import { IPopulatedBookingResponse } from "@/data/booking";
import axios from "axios";
import { AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";

const ActiveRide = () => {
  // const [booking, setBooking] = useState<IPopulatedBookingResponse | null>(
  //   null
  // );
  // const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState<boolean>(false);

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
            <h2 className="text-sm font-bold text-rose-950">Unable to load bookings</h2>
            <p className="text-xs text-rose-800 leading-relaxed">{error}</p>
          </div>
        </main>
      );
    }

  return <div>page</div>;
};

export default ActiveRide;