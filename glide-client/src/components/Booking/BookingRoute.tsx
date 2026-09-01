import { Navigation } from "lucide-react";

interface BookingRouteProps {
  pickupAddress?: string;
  dropoffAddress?: string;
  compact?: boolean;
}

const BookingRoute= ({
  pickupAddress = "Pickup location pending",
  dropoffAddress = "Drop-off location pending",
  compact = false,
}:BookingRouteProps) => {
  return (
    <div className="relative flex flex-col gap-2.5 w-full">
      <div
        className={`absolute left-2.75 ${
          compact ? "top-5 bottom-5" : "top-6 bottom-6"
        } w-[1.5px] bg-secondary/20 border-dashed border-l border-secondary/40`}
        aria-hidden="true"
      />

      {/* Pickup */}
      <div className="flex items-start gap-3 relative z-10">
        <div className="shrink-0 mt-0.5 w-5.5 h-5.5 rounded-full bg-background border border-foreground/30 flex items-center justify-center shadow-xs">
          <div className="w-2 h-2 rounded-full bg-foreground" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold tracking-wider text-secondary uppercase">
            Pickup
          </p>
          <p
            className={`text-xs font-medium text-foreground ${
              compact ? "line-clamp-1" : "line-clamp-2 leading-relaxed"
            }`}
            title={pickupAddress}
          >
            {pickupAddress}
          </p>
        </div>
      </div>

      {/* Dropoff */}
      <div className="flex items-start gap-3 relative z-10">
        <div className="shrink-0 mt-0.5 w-5.5 h-5.5 rounded-full bg-background border border-foreground/30 flex items-center justify-center shadow-xs">
          <Navigation className="w-3 h-3 text-foreground" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold tracking-wider text-secondary uppercase">
            Destination
          </p>
          <p
            className={`text-xs font-medium text-foreground ${
              compact ? "line-clamp-1" : "line-clamp-2 leading-relaxed"
            }`}
            title={dropoffAddress}
          >
            {dropoffAddress}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookingRoute;