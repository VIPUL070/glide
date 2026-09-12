"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { AlertCircle, RefreshCw } from "lucide-react";
import Button from "@/components/ui/Button";
import { IPopulatedBookingResponse } from "@/data/booking";
import { BookingStatus, PaymentStatus } from "@/models/Booking.model";
import { BookingSortOption } from "@/types/bookings";
import { BookingsSkeleton, EmptyBookings } from "@/components/Booking/BookingSkeleton";
import { BookingFilters } from "@/components/Booking/BookingFilters";
import { containerVariants } from "@/lib/bookingAnimation";
import { BookingCard } from "@/components/Booking/BookingCard";
import BookingStats from "@/components/Booking/BookingStats";
import BookingHero from "@/components/Booking/BookingHero";
import BookingDetails from "@/components/Booking/BookingDetails";
import BookingMobileDrawer from "@/components/Booking/BookingMobileDrawer";
import { useRouter } from "next/navigation";

function PartnerBookings() {
  const [bookings, setBookings] = useState<IPopulatedBookingResponse[]>([]);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState<boolean>(false);


  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "all">("all");
  const [paymentFilter, setPaymentFilter] = useState<PaymentStatus | "all">("all");
  const [sortBy, setSortBy] = useState<BookingSortOption>("newest");

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get<IPopulatedBookingResponse[]>(
        "/api/partner/bookings"
      );
      const data = Array.isArray(response.data) ? response.data : [];
      setBookings(data);

      if (data.length > 0) {
        setSelectedBookingId(data[0]._id);
      }
    } catch (err: unknown) {
      console.error("Partner bookings API fetch failure:", err);
      setError("Unable to retrieve bookings. Please verify your connection.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);


  const stats = useMemo(() => {
    const counts = {
      total: bookings.length,
      requested: 0,
      awaiting_payment: 0,
      confirmed: 0,
      started: 0,
      completed: 0,
      cancelled: 0,
    };

    bookings.forEach((b) => {
      if (b.bookingStatus === "requested") counts.requested++;
      else if (b.bookingStatus === "awaiting_payment") counts.awaiting_payment++;
      else if (b.bookingStatus === "confirmed") counts.confirmed++;
      else if (b.bookingStatus === "started") counts.started++;
      else if (b.bookingStatus === "completed") counts.completed++;
      else if (["cancelled", "rejected", "expired"].includes(b.bookingStatus)) counts.cancelled++;
    });

    return counts;
  }, [bookings]);

 
  const filteredBookings = useMemo(() => {
    let result = [...bookings];


    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((b) => {
        const userName = b.user?.name?.toLowerCase() || "";
        const userEmail = b.user?.email?.toLowerCase() || "";
        const userPhone = (b.userMobile || b.user?.mobileNumber || "").toLowerCase();
        const vehicleModel = b.vehicle?.vehicleModel?.toLowerCase() || "";
        const vehicleNumber = b.vehicle?.number?.toLowerCase() || "";
        const pickup = b.pickupAddress?.toLowerCase() || "";
        const dropoff = b.dropoffAddress?.toLowerCase() || "";
        const bookingId = b._id?.toLowerCase() || "";

        return (
          userName.includes(q) ||
          userEmail.includes(q) ||
          userPhone.includes(q) ||
          vehicleModel.includes(q) ||
          vehicleNumber.includes(q) ||
          pickup.includes(q) ||
          dropoff.includes(q) ||
          bookingId.includes(q)
        );
      });
    }

    if (statusFilter !== "all") {
      result = result.filter((b) => b.bookingStatus === statusFilter);
    }

    if (paymentFilter !== "all") {
      result = result.filter((b) => b.paymentStatus === paymentFilter);
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "fare_high":
          return b.fare - a.fare;
        case "fare_low":
          return a.fare - b.fare;
        case "recently_updated":
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        default:
          return 0;
      }
    });

    return result;
  }, [bookings, searchQuery, statusFilter, paymentFilter, sortBy]);


  const selectedBooking = useMemo(() => {
    if (!filteredBookings.length) return null;
    return (
      filteredBookings.find((b) => b._id === selectedBookingId) ||
      filteredBookings[0]
    );
  }, [filteredBookings, selectedBookingId]);

  const handleSelectBooking = (booking: IPopulatedBookingResponse) => {
    setSelectedBookingId(booking._id);
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setIsMobileDrawerOpen(true);
    }
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setPaymentFilter("all");
    setSortBy("newest");
  };

  const hasActiveFilters =
    Boolean(searchQuery.trim()) ||
    statusFilter !== "all" ||
    paymentFilter !== "all" ||
    sortBy !== "newest";

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
          <div className="pt-2">
            <Button variant="primary" size="sm" onClick={fetchBookings}>
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Try Again
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

      <BookingHero
        totalCount={stats.total}
        activeCount={stats.started + stats.confirmed}
      />

      <BookingStats
        stats={stats}
        activeFilter={statusFilter}
        onSelectFilter={setStatusFilter}
        filteredCount={filteredBookings.length}
      />

      {/* 3. Search & Filters Bar */}
      <BookingFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        paymentFilter={paymentFilter}
        onPaymentChange={setPaymentFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onClearFilters={handleClearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {filteredBookings.length === 0 ? (
        <EmptyBookings
          isFiltered={bookings.length > 0}
          onResetFilters={handleClearFilters}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="md:col-span-5 space-y-3"
          >
            {filteredBookings.map((booking) => (
              <BookingCard
                key={booking._id}
                booking={booking}
                isSelected={selectedBooking?._id === booking._id}
                onSelect={handleSelectBooking}
              />
            ))}
          </motion.div>


          <div className="hidden md:block md:col-span-7 sticky top-6">
            <BookingDetails booking={selectedBooking}  onActive = { () => router.push(`/partner/active-ride`)}/>
          </div>
        </div>
      )}

      <BookingMobileDrawer
        booking={selectedBooking}
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
        onActive={ () => router.push(`/partner/active-ride`)}
      />
    </main>
  );
}

export default PartnerBookings;