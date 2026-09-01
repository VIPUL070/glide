import { useState, useEffect } from "react";
import { Search, RotateCcw, ArrowUpDown, Filter } from "lucide-react";
import { BookingStatus, PaymentStatus } from "@/models/Booking.model";
import { BookingSortOption } from "@/types/bookings";

interface BookingFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: BookingStatus | "all";
  onStatusChange: (status: BookingStatus | "all") => void;
  paymentFilter: PaymentStatus | "all";
  onPaymentChange: (payment: PaymentStatus | "all") => void;
  sortBy: BookingSortOption;
  onSortChange: (sort: BookingSortOption) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export const BookingFilters= ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  paymentFilter,
  onPaymentChange,
  sortBy,
  onSortChange,
  onClearFilters,
  hasActiveFilters,
}:BookingFiltersProps) => {
  const [localSearch, setLocalSearch] = useState(searchQuery);

  // Debounced Search Propagate
  useEffect(() => {
    const handler = setTimeout(() => {
      onSearchChange(localSearch);
    }, 280);
    return () => clearTimeout(handler);
  }, [localSearch, onSearchChange]);

  return (
    <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
      {/* Search Input */}
      <div className="relative flex-1 min-w-60">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary pointer-events-none" />
        <input
          type="text"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          placeholder="Search by customer, phone, vehicle, address or ID..."
          className="w-full pl-9.5 pr-4 py-3 text-xs bg-background border border-foreground/15 rounded-xl text-secondary placeholder:text-secondary/50 focus:outline-hidden focus:border-foreground/40 focus:ring-1 focus:ring-foreground/20 transition-all"
        />
      </div>

      {/* Dropdown Filters */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Status Filter */}
        <div className="flex items-center gap-1.5 bg-background border border-foreground/15 rounded-xl px-2.5 py-2.5 text-sm text-secondary">
          <Filter className="w-3.5 h-3.5 text-secondary/60" />
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value as BookingStatus | "all")}
            aria-label="Filter by booking status"
            className="bg-transparent text-secondary text-xs focus:outline-hidden cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="requested">Requested</option>
            <option value="awaiting_payment">Awaiting Payment</option>
            <option value="confirmed">Confirmed</option>
            <option value="started">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="rejected">Rejected</option>
            <option value="expired">Expired</option>
          </select>
        </div>

        {/* Payment Filter */}
        <div className="flex items-center gap-1.5 bg-background border border-foreground/15 rounded-xl px-2.5 py-2.5 text-xs text-secondary">
          <select
            value={paymentFilter}
            onChange={(e) => onPaymentChange(e.target.value as PaymentStatus | "all")}
            aria-label="Filter by payment status"
            className="bg-transparent text-secondary text-xs focus:outline-hidden cursor-pointer"
          >
            <option value="all">All Payments</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="cash">Cash on Drop</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        {/* Sort Sorter */}
        <div className="flex items-center gap-1.5 bg-background border border-foreground/15 rounded-xl px-2.5 py-2.5 text-xs text-secondary">
          <ArrowUpDown className="w-3.5 h-3.5 text-secondary/60" />
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as BookingSortOption)}
            aria-label="Sort bookings list"
            className="bg-transparent text-secondary text-xs focus:outline-hidden cursor-pointer"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="fare_high">Highest Fare</option>
            <option value="fare_low">Lowest Fare</option>
            <option value="recently_updated">Recently Updated</option>
          </select>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={() => {
              setLocalSearch("");
              onClearFilters();
            }}
            className="inline-flex items-center gap-1 px-2.5 py-2.5 rounded-xl text-xs font-medium text-secondary hover:text-secondary bg-secondary/10 hover:bg-secondary/15 transition-colors"
          >
            <RotateCcw className="w-3 h-3" /> Clear
          </button>
        )}
      </div>
    </div>
  );
};

export default BookingFilters;