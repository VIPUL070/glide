import { BookingStatus, PaymentStatus } from "@/models/Booking.model";

export interface StatusStyleConfig {
  container: string;
  text: string;
  icon: string;
  badge: string;
  border: string;
  indicator: string;
  label: string;
}

export const BOOKING_STATUS_STYLES: Record<BookingStatus, StatusStyleConfig> = {
  requested: {
    container: "bg-amber-50/70 border-amber-200/80 hover:border-amber-300",
    text: "text-amber-900",
    icon: "text-amber-700",
    badge: "bg-amber-100/90 text-amber-900 border-amber-200",
    border: "border-amber-300",
    indicator: "bg-amber-500",
    label: "Requested",
  },
  awaiting_payment: {
    container: "bg-violet-50/70 border-violet-200/80 hover:border-violet-300",
    text: "text-violet-900",
    icon: "text-violet-700",
    badge: "bg-violet-100/90 text-violet-900 border-violet-200",
    border: "border-violet-300",
    indicator: "bg-violet-500",
    label: "Awaiting Payment",
  },
  confirmed: {
    container: "bg-blue-50/70 border-blue-200/80 hover:border-blue-300",
    text: "text-blue-900",
    icon: "text-blue-700",
    badge: "bg-blue-100/90 text-blue-900 border-blue-200",
    border: "border-blue-300",
    indicator: "bg-blue-500",
    label: "Confirmed",
  },
  started: {
    container: "bg-cyan-50/70 border-cyan-200/80 hover:border-cyan-300",
    text: "text-cyan-900",
    icon: "text-cyan-700",
    badge: "bg-cyan-100/90 text-cyan-900 border-cyan-200",
    border: "border-cyan-300",
    indicator: "bg-cyan-500",
    label: "In Progress",
  },
  completed: {
    container: "bg-emerald-50/70 border-emerald-200/80 hover:border-emerald-300",
    text: "text-emerald-900",
    icon: "text-emerald-700",
    badge: "bg-emerald-100/90 text-emerald-900 border-emerald-200",
    border: "border-emerald-300",
    indicator: "bg-emerald-500",
    label: "Completed",
  },
  cancelled: {
    container: "bg-rose-50/70 border-rose-200/80 hover:border-rose-300",
    text: "text-rose-900",
    icon: "text-rose-700",
    badge: "bg-rose-100/90 text-rose-900 border-rose-200",
    border: "border-rose-300",
    indicator: "bg-rose-500",
    label: "Cancelled",
  },
  rejected: {
    container: "bg-red-50/70 border-red-200/80 hover:border-red-300",
    text: "text-red-900",
    icon: "text-red-700",
    badge: "bg-red-100/90 text-red-900 border-red-200",
    border: "border-red-300",
    indicator: "bg-red-500",
    label: "Rejected",
  },
  expired: {
    container: "bg-zinc-100/70 border-zinc-200/80 hover:border-zinc-300",
    text: "text-zinc-800",
    icon: "text-zinc-600",
    badge: "bg-zinc-200/90 text-zinc-800 border-zinc-300",
    border: "border-zinc-300",
    indicator: "bg-zinc-400",
    label: "Expired",
  },
  idle: {
    container: "bg-slate-50/70 border-slate-200/80 hover:border-slate-300",
    text: "text-slate-800",
    icon: "text-slate-600",
    badge: "bg-slate-100/90 text-slate-800 border-slate-200",
    border: "border-slate-300",
    indicator: "bg-slate-400",
    label: "Idle",
  },
};

export const PAYMENT_STATUS_STYLES: Record<
  PaymentStatus,
  { badge: string; label: string; dot: string }
> = {
  paid: {
    badge: "bg-emerald-50 text-emerald-900 border-emerald-200",
    dot: "bg-emerald-600",
    label: "Paid",
  },
  pending: {
    badge: "bg-amber-50 text-amber-900 border-amber-200",
    dot: "bg-amber-500",
    label: "Pending",
  },
  cash: {
    badge: "bg-slate-100 text-slate-800 border-slate-200",
    dot: "bg-slate-600",
    label: "Cash on Dropoff",
  },
  failed: {
    badge: "bg-rose-50 text-rose-900 border-rose-200",
    dot: "bg-rose-600",
    label: "Failed",
  },
};

export const formatCurrency = (amount: number = 0): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatBookingId = (id: string): string => {
  if (!id) return "BK-UNKNOWN";
  return `BK-${id.slice(-6).toUpperCase()}`;
};