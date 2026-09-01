import { motion } from "framer-motion";
import { User, Car, ShieldCheck } from "lucide-react";
import {
  BOOKING_STATUS_STYLES,
  formatBookingId,
  formatCurrency,
} from "@/lib/constants/bookingStatus";
import { IPopulatedBookingResponse } from "@/data/booking";
import { cardVariants } from "@/lib/bookingAnimation";
import BookingStatusBadge from "./BookingStatusBadge";
import BookingRoute from "./BookingRoute";

interface BookingCardProps {
  booking: IPopulatedBookingResponse;
  isSelected: boolean;
  onSelect: (booking: IPopulatedBookingResponse) => void;
}

export const BookingCard = ({
  booking,
  isSelected,
  onSelect,
}:BookingCardProps) => {
  const statusTheme =
    BOOKING_STATUS_STYLES[booking.bookingStatus] || BOOKING_STATUS_STYLES.idle;

  const formattedTime = new Date(booking.createdAt).toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <motion.div
      variants={cardVariants}
      layoutId={`booking-card-${booking._id}`}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.18 }}
      onClick={() => onSelect(booking)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(booking);
        }
      }}
      tabIndex={0}
      role="button"
      aria-pressed={isSelected}
      aria-label={`Booking ${formatBookingId(booking._id)}, Status ${statusTheme.label}, Fare ${formatCurrency(booking.fare)}`}
      className={`relative w-full text-left p-4 rounded-xl border transition-all cursor-pointer select-none focus:outline-hidden focus-visible:ring-2 focus-visible:ring-foreground/40 ${
        statusTheme.container
      } ${
        isSelected
          ? "ring-2 ring-foreground/80 border-transparent shadow-md bg-background"
          : "border-foreground/10 hover:border-foreground/25 bg-background/90"
      }`}
    >

      <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-foreground/5">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-semibold text-foreground tracking-tight">
            {formatBookingId(booking._id)}
          </span>
          {booking.pickupOtp && booking.bookingStatus === "confirmed" && (
            <span className="inline-flex items-center gap-1 text-[10px] bg-foreground/5 px-1.5 py-0.5 rounded text-secondary font-medium">
              <ShieldCheck className="w-3 h-3 text-secondary" /> OTP
            </span>
          )}
        </div>
        <BookingStatusBadge status={booking.bookingStatus} size="sm" />
      </div>

      {/* Customer & Vehicle Info */}
      <div className="grid grid-cols-2 gap-2 my-3 text-xs">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-6 h-6 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
            <User className="w-3.5 h-3.5 text-secondary" />
          </div>
          <div className="truncate">
            <p className="font-medium text-foreground truncate">
              {booking.user?.name || "Anonymous User"}
            </p>
            <p className="text-[11px] text-secondary truncate">
              {booking.userMobile || booking.user?.mobileNumber || "No Phone"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 min-w-0">
          <div className="w-6 h-6 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
            <Car className="w-3.5 h-3.5 text-secondary" />
          </div>
          <div className="truncate">
            <p className="font-medium text-foreground truncate">
              {booking.vehicle?.vehicleModel || "Assigned Vehicle"}
            </p>
            <p className="text-[11px] text-secondary font-mono truncate">
              {booking.vehicle?.number || "No Plate"}
            </p>
          </div>
        </div>
      </div>

      {/* Route Section */}
      <div className="py-2 px-2.5 rounded-lg bg-primary/70 border border-foreground/5 my-2">
        <BookingRoute
          pickupAddress={booking.pickupAddress}
          dropoffAddress={booking.dropoffAddress}
          compact
        />
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between pt-2 mt-1 text-xs">
        <span className="text-[11px] text-secondary font-medium">
          {formattedTime}
        </span>
        <div className="flex items-baseline gap-1">
          <span className="text-[10px] text-secondary uppercase font-semibold">
            Fare
          </span>
          <span className="text-sm font-bold text-foreground">
            {formatCurrency(booking.fare)}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default BookingCard;