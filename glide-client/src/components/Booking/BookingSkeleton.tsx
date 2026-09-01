import { RotateCcw, CalendarX2 } from "lucide-react";
import Button from "@/components/ui/Button";

export const BookingsSkeleton= () => {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-36 w-full rounded-2xl bg-secondary/10" />


      <div className="flex gap-2 pb-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-8 w-24 rounded-lg bg-secondary/10" />
        ))}
      </div>


      <div className="h-10 w-full rounded-xl bg-secondary/10" />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-2">
        <div className="md:col-span-5 space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-44 rounded-xl bg-secondary/10" />
          ))}
        </div>
        <div className="hidden md:block md:col-span-7">
          <div className="h-96 rounded-2xl bg-secondary/10" />
        </div>
      </div>
    </div>
  );
};

interface EmptyBookingsProps {
  isFiltered: boolean;
  onResetFilters?: () => void;
}

export const EmptyBookings= ({
  isFiltered,
  onResetFilters,
}:EmptyBookingsProps) => {
  return (
    <div className="rounded-2xl border border-dashed border-secondary/25 bg-primary/20 py-16 px-6 text-center flex flex-col items-center justify-center">
      <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary mb-3.5">
        <CalendarX2 className="w-6 h-6" />
      </div>
      <h3 className="text-sm font-semibold text-foreground">
        {isFiltered ? "No matching bookings found" : "No bookings registered yet"}
      </h3>
      <p className="text-xs text-secondary mt-1 max-w-sm leading-relaxed">
        {isFiltered
          ? "There are no bookings matching your active search query, status, or payment filters. Try resetting the criteria."
          : "Assigned customer rides, completed trips, and incoming travel requests will automatically appear in this workspace."}
      </p>

      {isFiltered && onResetFilters && (
        <div className="mt-4">
          <Button variant="primary" size="sm" onClick={onResetFilters}>
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" /> Clear All Filters
          </Button>
        </div>
      )}
    </div>
  );
};