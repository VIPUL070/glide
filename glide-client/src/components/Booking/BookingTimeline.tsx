import { Check, Clock, AlertTriangle } from "lucide-react";
import { BookingStatus } from "@/models/Booking.model";

interface BookingTimelineProps {
  status: BookingStatus;
  createdAt: string;
}

const ORDERED_STEPS: BookingStatus[] = [
  "requested",
  "confirmed",
  "started",
  "completed",
];

const STEP_LABELS: Record<string, string> = {
  requested: "Trip Requested",
  confirmed: "Confirmed & Assigned",
  started: "Trip In Progress",
  completed: "Successfully Completed",
};

const BookingTimeline = ({
  status,
  createdAt,
}:BookingTimelineProps) => {
  const isTerminalNegative = ["cancelled", "rejected", "expired"].includes(status);
  const currentIndex = ORDERED_STEPS.indexOf(status);

  const formattedCreatedDate = new Date(createdAt).toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-secondary">
          Journey Progression
        </h4>
        <span className="text-[11px] text-secondary/80">Created {formattedCreatedDate}</span>
      </div>

      {isTerminalNegative ? (
        <div className="p-3 rounded-lg border border-rose-200 bg-rose-50/70 flex items-center gap-2.5 text-rose-900">
          <AlertTriangle className="w-4 h-4 shrink-0 text-rose-700" />
          <div className="text-xs">
            <span className="font-semibold capitalize">{status}</span> — This booking was terminated before trip completion.
          </div>
        </div>
      ) : (
        <div className="relative flex items-center justify-between pt-1">

          <div className="absolute left-3 right-3 top-3.5 -translate-y-1/2 h-0.5 bg-secondary/15 z-0" />

          {ORDERED_STEPS.map((step, idx) => {
            const isCompleted = currentIndex >= idx;
            const isCurrent = currentIndex === idx;

            return (
              <div key={step} className="relative z-10 flex flex-col items-center group">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                    isCompleted
                      ? "bg-foreground text-background shadow-xs ring-2 ring-background"
                      : "bg-primary border border-secondary/30 text-secondary"
                  } ${isCurrent ? "ring-2 ring-foreground/20" : ""}`}
                >
                  {isCompleted ? (
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  ) : (
                    <Clock className="w-3 h-3 text-secondary/60" />
                  )}
                </div>
                <span
                  className={`text-[10px] mt-1.5 font-medium whitespace-nowrap ${
                    isCurrent
                      ? "text-foreground font-semibold"
                      : isCompleted
                      ? "text-foreground/80"
                      : "text-secondary/60"
                  }`}
                >
                  {STEP_LABELS[step]?.split(" ")[0]}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BookingTimeline;