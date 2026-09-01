import { BOOKING_STATUS_STYLES } from "@/lib/constants/bookingStatus";
import { BookingStatus } from "@/models/Booking.model";

interface BookingStatusBadgeProps {
  status: BookingStatus;
  size?: "sm" | "md";
}

const BookingStatusBadge= ({
  status,
  size = "sm",
}:BookingStatusBadgeProps) => {
  const config = BOOKING_STATUS_STYLES[status] || BOOKING_STATUS_STYLES.idle;

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-md border tracking-tight ${
        config.badge
      } ${
        size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs"
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.indicator}`} />
      {config.label}
    </span>
  );
};

export default BookingStatusBadge;