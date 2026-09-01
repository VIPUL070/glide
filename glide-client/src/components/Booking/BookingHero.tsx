import { bannerVariants } from "@/lib/bookingAnimation";
import { motion } from "framer-motion";

interface BookingHeroProps {
  totalCount: number;
  activeCount: number;
}

const BookingHero= ({
  totalCount,
  activeCount,
}:BookingHeroProps) => {
  return (
    <motion.section
      variants={bannerVariants}
      initial="hidden"
      animate="visible"
      className="relative w-full rounded-2xl bg-foreground text-primary overflow-hidden border border-foreground/20 shadow-sm"
    >
      {/* Background Grid */}
      <div
        className="absolute inset-0 pointer-events-none bg-[url(/banner-img.jpg)] bg-cover bg-bottom bg-no-repeat"
        aria-hidden="true"
      />
      <div className="relative z-10 px-6 py-7 sm:px-8 sm:py-9 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-xl space-y-1.5">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-background/0 text-primary/90 text-xs font-medium tracking-wide">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Live Booking Console
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary">
            All Bookings
          </h1>
          <p className="text-xs sm:text-sm text-primary/70 leading-relaxed">
            Monitor incoming trip requests, track active routes, inspect fare distributions, and manage dispatch history in real time.
          </p>
        </div>

        <div className="flex items-center gap-3 sm:gap-4 self-start md:self-auto">
          <div className="bg-background/10 backdrop-blur-md rounded-xl p-3.5 min-w-27.5 border border-background/15">
            <p className="text-[11px] font-medium text-primary/70 uppercase tracking-wider">
              Total Managed
            </p>
            <p className="text-xl sm:text-2xl font-bold text-primary tracking-tight">
              {totalCount}
            </p>
          </div>
          <div className="bg-background/10 backdrop-blur-md rounded-xl p-3.5 min-w-27.5 border border-background/15">
            <p className="text-[11px] font-medium text-primary/70 uppercase tracking-wider">
              Active Trips
            </p>
            <p className="text-xl sm:text-2xl font-bold text-emerald-400 tracking-tight">
              {activeCount}
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default BookingHero;