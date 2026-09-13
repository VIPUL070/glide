import { BookingStatus } from "@/models/Booking.model";

interface BookingStatsProps {
  stats: {
    total: number;
    requested: number;
    awaiting_payment: number;
    confirmed: number;
    started: number;
    completed: number;
    cancelled: number;
  };
  activeFilter: BookingStatus | "all";
  onSelectFilter: (status: BookingStatus | "all") => void;
  filteredCount: number;
}

const BookingStats= ({
  stats,
  activeFilter,
  onSelectFilter,
  filteredCount,
}:BookingStatsProps) => {
  const tabs: { key: BookingStatus | "all"; label: string; count: number }[] = [
    { key: "all", label: "All Bookings", count: stats.total },
    { key: "requested", label: "Requested", count: stats.requested },
    { key: "confirmed", label: "Confirmed", count: stats.confirmed },
    { key: "started", label: "In Progress", count: stats.started },
    { key: "completed", label: "Completed", count: stats.completed },
    { key: "cancelled", label: "Cancelled", count: stats.cancelled },
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-foreground/10 pb-3">

      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scrollbar-none py-1">
        {tabs.map((tab) => {
          const isActive = activeFilter === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onSelectFilter(tab.key)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                isActive
                  ? "bg-foreground text-primary shadow-xs"
                  : "bg-background text-secondary hover:text-secondary hover:bg-secondary/10"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[12px] font-bold ${
                  isActive
                    ? "bg-background/20 text-primary"
                    : "bg-secondary/10 text-secondary"
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="text-[12px] text-secondary shrink-0 self-end sm:self-center font-medium p-1">
        Showing <span className="font-semibold text-secondary">{filteredCount}</span> results
      </div>
    </div>
  );
};

export default BookingStats;