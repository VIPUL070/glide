export type BookingStatus =
  | "idle"
  | "requested"
  | "awaiting_payment"
  | "confirmed"
  | "started"
  | "completed"
  | "cancelled"
  | "rejected"
  | "expired";

export type PaymentStatus = "pending" | "paid" | "cash" | "failed";

export interface GeoLocation {
  type?: string;
  coordinates?: [number, number];
  address?: string;
}

export type BookingSortOption =
  | "newest"
  | "oldest"
  | "fare_high"
  | "fare_low"
  | "recently_updated";

export interface BookingFilterState {
  searchQuery: string;
  statusFilter: BookingStatus | "all";
  paymentFilter: PaymentStatus | "all";
  sortBy: BookingSortOption;
}