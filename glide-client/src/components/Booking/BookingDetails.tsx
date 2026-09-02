import { motion } from "framer-motion";
import {
  User,
  Phone,
  Mail,
  Car,
  Navigation,
  CheckCircle2,
  XCircle,
  FileText,
  Clock,
} from "lucide-react";
import {
  formatBookingId,
} from "@/lib/constants/bookingStatus";
import Button from "@/components/ui/Button";
import { IPopulatedBookingResponse } from "@/data/booking";
import BookingFinancials from "./BookingFinancials";
import BookingRoute from "./BookingRoute";
import BookingTimeline from "./BookingTimeline";
import BookingStatusBadge from "./BookingStatusBadge";
import { detailPanelVariants } from "@/lib/bookingAnimation";

interface BookingDetailsProps {
  booking: IPopulatedBookingResponse | null;
  onCloseMobile?: () => void;
  onActive?: () => void
}

const BookingDetails= ({
  booking,
  onCloseMobile,
  onActive
}:BookingDetailsProps) => {

  if (!booking) {
    return (
      <div className="h-full min-h-105 rounded-2xl border border-dashed border-secondary/20 bg-primary/30 flex flex-col items-center justify-center p-8 text-center">
        <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary mb-3">
          <Navigation className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-semibold text-foreground">No Booking Selected</h3>
        <p className="text-xs text-secondary mt-1 max-w-xs">
          Select any booking on the left to inspect customer details, live route coordinates, financials, and actions.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      variants={detailPanelVariants}
      initial="hidden"
      animate="visible"
      className="bg-background rounded-2xl border border-foreground/10 shadow-xs overflow-hidden flex flex-col"
    >
      {/* Header Bar */}
      <div className="p-5 border-b border-foreground/10 bg-primary/40 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-foreground font-mono">
              {formatBookingId(booking._id)}
            </h2>
            <BookingStatusBadge status={booking.bookingStatus} size="md" />
          </div>
          <p className="text-xs text-secondary mt-0.5">
            System ID: <span className="font-mono text-[11px]">{booking._id}</span>
          </p>
        </div>

        {onCloseMobile && (
          <button
            type="button"
            onClick={onCloseMobile}
            className="md:hidden text-xs font-semibold px-3 py-1.5 rounded-lg bg-secondary/10 text-foreground"
          >
            Close
          </button>
        )}
      </div>

      <div className="p-5 space-y-6 overflow-y-auto max-h-[calc(100vh-220px)]">
        <BookingTimeline
          status={booking.bookingStatus}
          createdAt={booking.createdAt}
        />

        {/* Journey Details */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-secondary">
            Route Details
          </h4>
          <div className="p-4 rounded-xl border border-foreground/10 bg-primary/30">
            <BookingRoute
              pickupAddress={booking.pickupAddress}
              dropoffAddress={booking.dropoffAddress}
            />
          </div>
        </div>

        {/* Customer & Vehicle Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          <div className="p-4 rounded-xl border border-foreground/10 bg-background space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-foreground/5">
              <User className="w-4 h-4 text-secondary" />
              <h5 className="text-xs font-semibold text-foreground">Customer Profile</h5>
            </div>
            <div className="space-y-1.5 text-xs">
              <p className="font-medium text-foreground">{booking.user?.name || "Not Available"}</p>
              <div className="flex items-center gap-1.5 text-secondary">
                <Phone className="w-3 h-3" />
                <span>{booking.userMobile || booking.user?.mobileNumber || "Unlisted"}</span>
              </div>
              <div className="flex items-center gap-1.5 text-secondary truncate">
                <Mail className="w-3 h-3 shrink-0" />
                <span className="truncate">{booking.user?.email || "Unlisted"}</span>
              </div>
            </div>
          </div>

          {/* Vehicle Card */}
          <div className="p-4 rounded-xl border border-foreground/10 bg-background space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-foreground/5">
              <Car className="w-4 h-4 text-secondary" />
              <h5 className="text-xs font-semibold text-foreground">Assigned Vehicle</h5>
            </div>
            <div className="space-y-1.5 text-xs">
              <p className="font-medium text-foreground">
                {booking.vehicle?.vehicleModel || "Vehicle Pending"}
              </p>
              <p className="font-mono text-secondary text-[11px]">
                {booking.vehicle?.number || "No Plate Listed"}
              </p>
              <div className="flex items-center gap-2 pt-0.5">
                <span className="text-[11px] px-2 py-0.5 rounded bg-secondary/10 text-secondary font-medium">
                  {booking.vehicle?.type || "Standard"}
                </span>
                {booking.vehicle?.isActive && (
                  <span className="text-[11px] text-emerald-800 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" /> Active
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Financials Component */}
        <BookingFinancials
          fare={booking.fare}
          partnerAmount={booking.partnerAmount}
          adminCommission={booking.adminCommission}
          paymentStatus={booking.paymentStatus}
          paymentDeadline={booking.paymentDeadline}
        />


        <div className="pt-2">
          <div className="flex flex-wrap gap-2.5 justify-end">
            {booking.bookingStatus === "requested" && (
              <>
                <Button
                  variant="transparent"
                  size="sm"
                  onClick={() => console.info("Partner rejected booking:", booking._id)}
                >
                  <XCircle className="w-4 h-4 mr-1.5" /> Decline Request
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => console.info("Partner accepted booking:", booking._id)}
                >
                  <CheckCircle2 className="w-4 h-4 mr-1.5" /> Accept Booking
                </Button>
              </>
            )}

            {booking.bookingStatus === "confirmed" && (
              <>
                <Button
                  variant="transparent"
                  size="sm"
                  onClick={() => {
                    const phone = booking.userMobile || booking.user?.mobileNumber;
                    if (phone) window.open(`tel:${phone}`);
                  }}
                >
                  <Phone className="w-4 h-4 mr-1.5" /> Call Customer
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={onActive}
                >
                  <Navigation className="w-4 h-4 mr-1.5" /> Track Trip
                </Button>
              </>
            )}

            {booking.bookingStatus === "started" && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => console.info("Completing trip for:", booking._id)}
              >
                <CheckCircle2 className="w-4 h-4 mr-1.5" /> Complete Drop-off
              </Button>
            )}

            {booking.bookingStatus === "completed" && (
              <Button
                variant="transparent"
                size="sm"
                onClick={() => console.info("Viewing receipt for:", booking._id)}
              >
                <FileText className="w-4 h-4 mr-1.5" /> Download Tax Invoice
              </Button>
            )}

            {["cancelled", "rejected", "expired"].includes(booking.bookingStatus) && (
              <Button
                variant="transparent"
                size="sm"
                onClick={() => console.info("Archiving or logs for:", booking._id)}
              >
                <Clock className="w-4 h-4 mr-1.5" /> Audit Activity Log
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BookingDetails;