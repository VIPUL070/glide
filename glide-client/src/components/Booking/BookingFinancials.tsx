import { formatCurrency, PAYMENT_STATUS_STYLES } from "@/lib/constants/bookingStatus";
import { PaymentStatus } from "@/models/Booking.model";

interface BookingFinancialsProps {
  fare: number;
  partnerAmount: number;
  adminCommission: number;
  paymentStatus: PaymentStatus;
  paymentDeadline?: string;
}

const BookingFinancials = ({
  fare,
  partnerAmount,
  adminCommission,
  paymentStatus,
  paymentDeadline,
}:BookingFinancialsProps) => {
  const paymentBadge = PAYMENT_STATUS_STYLES[paymentStatus] || PAYMENT_STATUS_STYLES.pending;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-secondary">
          Fare & Settlement
        </h4>
        <div
          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium border ${paymentBadge.badge}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${paymentBadge.dot}`} />
          {paymentBadge.label}
        </div>
      </div>

      <div className="rounded-xl border border-foreground/10 bg-primary/60 p-4 space-y-3">
        <div className="flex justify-between items-center text-xs text-secondary">
          <span>Gross Customer Fare</span>
          <span className="font-medium text-foreground">{formatCurrency(fare)}</span>
        </div>

        <div className="flex justify-between items-center text-xs text-secondary">
          <span>Platform Service Fee</span>
          <span className="font-medium text-rose-900/80">-{formatCurrency(adminCommission)}</span>
        </div>

        {paymentDeadline && paymentStatus === "pending" && (
          <div className="text-[11px] text-amber-900 bg-amber-50 border border-amber-200/80 px-2.5 py-1.5 rounded-md">
            Payment deadline: {new Date(paymentDeadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        )}

        <div className="pt-2 border-t border-foreground/10 flex justify-between items-center bg-foreground text-background px-3.5 py-2.5 rounded-lg shadow-xs">
          <div>
            <p className="text-[10px] uppercase font-semibold text-primary/70 tracking-wide">
              Partner Net Earnings
            </p>
            <p className="text-xs font-normal text-primary/80">Direct credit on completion</p>
          </div>
          <span className="text-base font-semibold tracking-tight text-background">
            {formatCurrency(partnerAmount)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BookingFinancials;