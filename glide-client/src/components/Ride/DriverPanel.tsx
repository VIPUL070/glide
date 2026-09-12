"use client";

import {
  BookingStatus,
  IPopulatedBookingResponse,
  STATUS_LABEL,
} from "@/data/booking";
import { motion, AnimatePresence } from "framer-motion";
import ChatPanel from "./ChatPanel";
import { dotPulseVariants, sheetVariants } from "@/lib/animation";
import { formatDate, formatTime, truncate } from "@/lib/utils";
import { Clock, MessageCircle, Navigation, Phone, Zap } from "lucide-react";
import Button from "../ui/Button";
import { useState } from "react";
import { DropoffOtpBlock, PickupOtpBlock } from "./OtpInputRow";

interface DriverPanelProps {
  booking: IPopulatedBookingResponse;
  status: BookingStatus;
  distanceToPickup: number;
  distanceToDropoff: number;
  etaToPickup: number;
  etaToDropoff: number;
  onChatOpen?: () => void;
  currRole?: string;
  setStatus?: React.Dispatch<React.SetStateAction<string>>;
}

interface StatusCapsuleProps {
  status: BookingStatus;
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  sublabel?: string;
}

const StatusCapsule = ({ status }: StatusCapsuleProps) => {
  const info = STATUS_LABEL[status];
  const isLive = status === "confirmed" || status === "started";

  return (
    <motion.div
      layout
      className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/90 backdrop-blur-sm px-3 py-1.5 shadow-sm"
    >
      <motion.span
        className={`w-2 h-2 rounded-full shrink-0 ${info.dot}`}
        variants={isLive ? dotPulseVariants : {}}
        animate={isLive ? "pulse" : undefined}
      />
      <span className="text-xs font-semibold text-secondary leading-none">
        {info.label}
      </span>
    </motion.div>
  );
};

const StatCard = ({ icon, label, value, sublabel }: StatCardProps) => (
  <div className="flex items-start gap-3 rounded-xl bg-neutral-50 border border-neutral-100 px-4 py-3">
    <div className="mt-0.5 text-neutral-500 shrink-0">{icon}</div>
    <div className="min-w-0">
      <p className="text-[11px] text-neutral-400 font-medium leading-none mb-1">
        {label}
      </p>
      <p className="text-[15px] font-bold text-secondary leading-none tracking-tight">
        {value}
      </p>
      {sublabel && (
        <p className="text-[11px] text-neutral-400 mt-0.5 leading-none">
          {sublabel}
        </p>
      )}
    </div>
  </div>
);

const DriverPanel = ({
  booking,
  status,
  distanceToPickup,
  distanceToDropoff,
  etaToPickup,
  etaToDropoff,
  onChatOpen,
  currRole,
  setStatus,
}: DriverPanelProps) => {
  const [chatOpenDesktop, setChatOpenDesktop] = useState(false);
  const isArriving = status === "confirmed";

  const displayDistance = isArriving ? distanceToPickup : distanceToDropoff;
  const displayEta = isArriving ? etaToPickup : etaToDropoff;
  const liveStatus = STATUS_LABEL[status];

  const distanceLabel =
    displayDistance < 1
      ? `${Math.round(displayDistance * 1000)} m`
      : `${displayDistance.toFixed(1)} km`;

  const etaLabel = displayEta < 1 ? `< 1 min` : `${Math.round(displayEta)} min`;

  const canChat = status === "confirmed" || status === "started";
  const handleChatOpen = onChatOpen ?? (() => setChatOpenDesktop(true));

  return (
    <div className="relative h-full flex flex-col bg-white overflow-hidden">
      <AnimatePresence mode="wait">
        {chatOpenDesktop && !onChatOpen ? (
          <ChatPanel
            key="chat"
            booking={booking}
            currRole={currRole}
            onClose={() => setChatOpenDesktop(false)}
          />
        ) : (
          <motion.div
            key="panel"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 12 }}
            transition={{ duration: 0.22 }}
            className="flex flex-col h-full overflow-y-auto"
          >
            {/* Status bar */}
            <div className="px-5 pt-5 pb-4 border-b border-neutral-100">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <StatusCapsule status={status} />
                  <p className="mt-2 text-[13px] text-neutral-400 leading-snug max-w-50">
                    {liveStatus.sublabel}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[11px] text-neutral-400">
                    {formatDate(booking.createdAt)}
                  </p>
                  <p className="text-[11px] text-neutral-400">
                    {formatTime(booking.createdAt)}
                  </p>
                </div>
              </div>
            </div>

            {/* Distance & ETA */}
            <div className="px-5 py-4 space-y-2.5 border-b border-neutral-100">
              <AnimatePresence mode="wait">
                <motion.div
                  key={isArriving ? "arriving-stats" : "started-stats"}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                  className="grid grid-cols-2 gap-2.5"
                >
                  <StatCard
                    icon={<Navigation className="w-4 h-4" />}
                    label={isArriving ? "To pickup" : "To dropoff"}
                    value={distanceLabel}
                    sublabel="distance"
                  />
                  <StatCard
                    icon={<Clock className="w-4 h-4" />}
                    label="ETA"
                    value={etaLabel}
                    sublabel="estimated"
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Route info */}
            <div className="px-5 py-4 space-y-3 border-b border-neutral-100">
              <div className="flex gap-3">
                <div className="flex flex-col items-center pt-1 shrink-0">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <div className="w-px flex-1 bg-neutral-200 my-1" />
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                </div>
                <div className="flex-1 space-y-3 min-w-0">
                  <div>
                    <p className="text-[11px] font-medium text-neutral-400 mb-0.5">
                      Pickup
                    </p>
                    <p className="text-sm text-secondary font-medium leading-snug">
                      {truncate(booking.pickupAddress, 42)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] font-medium text-neutral-400 mb-0.5">
                      Dropoff
                    </p>
                    <p className="text-sm text-secondary font-medium leading-snug">
                      {truncate(booking.dropoffAddress, 42)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Fare info */}
            <div className="px-5 py-4 border-b border-neutral-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-neutral-400">
                  <Zap className="w-4 h-4" />
                  <span className="text-[13px]">Fare</span>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-secondary leading-none">
                    ₹{booking.fare?.toFixed(0)}
                  </p>
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    Your cut: ₹{booking.partnerAmount?.toFixed(0)}
                  </p>
                </div>
              </div>
            </div>

            {/* Customer info */}
            <div className="px-5 py-4 border-b border-neutral-100">
              <p className="text-[11px] font-medium text-neutral-400 mb-2">
                Customer
              </p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center text-sm font-bold text-neutral-600 shrink-0">
                  {booking.user?.name?.charAt(0) ?? "?"}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-secondary leading-none truncate">
                    {booking.user?.name ?? "—"}
                  </p>
                  <p className="text-[12px] text-neutral-400 mt-0.5">
                    {booking.userMobile}
                  </p>
                </div>
              </div>
            </div>

            {/* OTP */}
            {(currRole === "partner" || currRole === "driver") && (
                <AnimatePresence>
                  {status === "confirmed" && (
                    <motion.div
                      key="pickup-otp"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <PickupOtpBlock
                        booking={booking}
                        setStatus={setStatus!}
                      />
                    </motion.div>
                  )}

                  {/* Dropoff OTP */}
                  {status === "started" && (
                    <motion.div
                      key="dropoff-otp"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <DropoffOtpBlock
                        booking={booking}
                        setStatus={setStatus!}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              )}

            {/* CTA buttons */}
            <div className="px-5 py-4 mt-auto space-y-2.5">
              {/* Call button */}
              <motion.a
                href={`tel:${booking.userMobile}`}
                whileTap={{ scale: 0.97 }}
                className="flex items-center justify-center gap-2 w-full rounded-lg bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white text-sm font-semibold py-2 transition-colors"
              >
                <Phone className="w-4 h-4" />
                Call customer
              </motion.a>

              {/* Chat button */}
              {canChat && (
                <Button
                  variant="primary"
                  size="sm"
                  motionEffect="slide"
                  leftIcon={<MessageCircle className="w-4 h-4" />}
                  onClick={handleChatOpen}
                  className="w-full"
                >
                  Message
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

type MobileSheetProps = Omit<DriverPanelProps, "onChatOpen">;

export const MobileSheet = (props: MobileSheetProps) => {
  const [expanded, setExpanded] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <motion.div
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={0.08}
      onDragEnd={(_, info) => {
        if (info.offset.y > 60) setExpanded(false);
        if (info.offset.y < -60) setExpanded(true);
      }}
      variants={sheetVariants}
      animate={expanded ? "expanded" : "collapsed"}
      transition={{ type: "spring", stiffness: 340, damping: 36 }}
      className="absolute bottom-0 left-0 right-0 z-99 bg-white rounded-t-2xl shadow-2xl overflow-hidden"
      style={{ maxHeight: "82dvh" }}
    >
      {/* ChatPanel  */}
      <AnimatePresence>
        {chatOpen && (
          <ChatPanel
            key="chat"
            booking={props.booking}
            currRole={props.currRole}
            onClose={() => setChatOpen(false)}
          />
        )}
      </AnimatePresence>

      {!chatOpen && (
        <button
          className="w-full pt-3 pb-1 flex justify-center focus:outline-none"
          onClick={() => setExpanded((e) => !e)}
          aria-label={expanded ? "Collapse panel" : "Expand panel"}
        >
          <div className="w-10 h-1 rounded-full bg-neutral-300" />
        </button>
      )}

      {/* Scroll container  */}
      <div
        className="overflow-y-auto"
        style={{ maxHeight: "calc(82dvh - 24px)" }}
      >
        <DriverPanel {...props} onChatOpen={() => setChatOpen(true)} />
      </div>
    </motion.div>
  );
};

export default DriverPanel;
