"use client";

import { BookingsSkeleton } from "@/components/Booking/BookingSkeleton";
import CompletedRide from "@/components/Ride/CompletedRide";
import DriverPanel, { MobileSheet } from "@/components/Ride/DriverPanel";
import {
  BookingStatus,
  IPopulatedBookingResponse,
  RIDE_STATUS,
} from "@/data/booking";
import { getSocket } from "@/lib/socket";
import { RootState } from "@/redux/store";
import axios from "axios";
import { AlertCircle } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

interface DriverPanelProps {
  booking: IPopulatedBookingResponse;
  status: BookingStatus;
  distanceToPickup: number;
  distanceToDropoff: number;
  etaToPickup: number;
  etaToDropoff: number;
  currRole?: string;
  setStatus?: React.Dispatch<React.SetStateAction<string>>;
}

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

  const [status, setStatus] = useState<BookingStatus>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [distanceToPickup, setDistanceToPickup] = useState<number>(0);
  const [distanceToDropoff, setDistanceToDropoff] = useState<number>(0);
  const [etaToPickup, setEtaToPickup] = useState<number>(0);
  const [etaToDropoff, setEtaToDropoff] = useState<number>(0);

  const [currRole, setCurrRole] = useState("");
  const { userData } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const controller = new AbortController();

    if (userData) {
      const role = userData._id === booking?.driver._id ? "driver" : "user";
      setCurrRole(role);
    }

    return () => controller.abort();
  }, [userData, booking?.driver._id]);

  useEffect(() => {
    const controller = new AbortController();

    const getActiveRide = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await axios.get(`/api/partner/my-active`, {
          signal: controller.signal,
        });
        setBooking(data);
        setPickup([
          data.pickUpLocation.coordinates[1],
          data.pickUpLocation.coordinates[0],
        ]);
        setDropoff([
          data.dropoffLocation.coordinates[1],
          data.dropoffLocation.coordinates[0],
        ]);
        setStatus(data.bookingStatus);
      } catch (err: unknown) {
        if (axios.isCancel(err)) return;
        console.error("Partner bookings API fetch failure:", err);
        setError("Unable to retrieve bookings. Please verify your connection.");
      } finally {
        setLoading(false);
      }
    };

    getActiveRide();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) return;

    const socket = getSocket();

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setDriverPos([pos.coords.latitude, pos.coords.longitude]);
        socket.emit("driver-location-update", {
          bookingId: booking?._id,
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          status,
        });
      },
      (err) => console.log("gps error", err),
      { enableHighAccuracy: true, maximumAge: 2000, timeout: 10000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [booking?._id, status]);

  useEffect(() => {
    if(!booking?._id) return;
    
    const socket = getSocket();
    socket.emit("join", booking?._id);
    socket.on("driver-location", ({ lat, lng }) => {
      setDriverPos([lat, lng]);
    });
    return () => {
      socket.off("join");
      socket.off("driver-location");
    };
  }, [booking?._id]);

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

   if(booking && status === "completed"){
    <CompletedRide booking={booking} role="driver"/>
  }

  if (!booking || !status) return null;

  const panelSetStatus: React.Dispatch<React.SetStateAction<string>> = (
    nextStatus
  ) => {
    setStatus((currentStatus) => {
      const value =
        typeof nextStatus === "function"
          ? nextStatus(currentStatus ?? "")
          : nextStatus;
      return value as BookingStatus;
    });
  };

  const panelProps: DriverPanelProps = {
    booking,
    status,
    distanceToPickup,
    distanceToDropoff,
    etaToPickup,
    etaToDropoff,
    currRole,
    setStatus: panelSetStatus
  };

  return (
    <div className="h-dvh w-full bg-background text-secondary flex flex-col overflow-hidden">
      <div className="hidden lg:flex h-full w-full">
        {/* Map */}
        <div className="relative flex-1 h-full z-0">
          {pickup && dropoff ? (
            <LiveRideMap
              driverPos={driverPos}
              pickup={pickup}
              dropoff={dropoff}
              rideStatus={RIDE_STATUS}
              currStatus={status}
              onStats={({
                distanceToPickup,
                distanceToDropoff,
                etaToPickup,
                etaToDropoff,
              }) => {
                setDistanceToPickup(distanceToPickup);
                setDistanceToDropoff(distanceToDropoff);
                setEtaToPickup(etaToPickup);
                setEtaToDropoff(etaToDropoff);
              }}
            />
          ) : (
            <div className="w-full h-full bg-neutral-100 flex items-center justify-center text-sm text-neutral-500">
              Waiting for location data…
            </div>
          )}
        </div>

        {/* Side panel */}
        <aside
          className="
            relative shrink-0 h-full overflow-hidden
            w-85 xl:w-95 2xl:w-105
            border-l border-neutral-100
          "
        >
          <DriverPanel {...panelProps} />
        </aside>
      </div>

      {/* MOBILE / SMALL TABLET */}
      <div className="relative flex lg:hidden h-full w-full">
        {/* Map */}
        <div className="absolute inset-0 z-0">
          {pickup && dropoff ? (
            <LiveRideMap
              driverPos={driverPos}
              pickup={pickup}
              dropoff={dropoff}
              rideStatus={RIDE_STATUS}
              currStatus={status}
              onStats={({
                distanceToPickup,
                distanceToDropoff,
                etaToPickup,
                etaToDropoff,
              }) => {
                setDistanceToPickup(distanceToPickup);
                setDistanceToDropoff(distanceToDropoff);
                setEtaToPickup(etaToPickup);
                setEtaToDropoff(etaToDropoff);
              }}
            />
          ) : (
            <div className="w-full h-full bg-neutral-100 flex items-center justify-center text-sm text-neutral-500">
              Waiting for location data…
            </div>
          )}
        </div>

        {/* Bottom part */}
        <MobileSheet {...panelProps} />
      </div>
    </div>
  );
};

export default ActiveRide;