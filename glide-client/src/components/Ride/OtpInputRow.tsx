"use client";

import { IPopulatedBookingResponse } from "@/data/booking";
import axios from "axios";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import {motion , AnimatePresence} from "motion/react";
import { useRef, useState } from "react";
import Button from "../ui/Button";
import Spinner from "../ui/Spinner";

interface OtpInputRowProps {
  otp: string[];
  otpRefs: React.MutableRefObject<HTMLInputElement[]>;
  onChange: (value: string, index: number) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>, index: number) => void;
  disabled?: boolean;
}

interface PickupOtpBlockProps {
  booking: IPopulatedBookingResponse;
  setStatus: React.Dispatch<React.SetStateAction<string>>;
}

interface DropoffOtpBlockProps {
  booking: IPopulatedBookingResponse;
  setStatus: React.Dispatch<React.SetStateAction<string>>;
}

const OtpInputRow = ({
  otp,
  otpRefs,
  onChange,
  onKeyDown,
  disabled,
}: OtpInputRowProps) => (
  <div className="flex justify-center gap-2.5 my-1">
    {otp.map((digit, index) => (
      <input
        key={index}
        ref={(el) => {
          otpRefs.current[index] = el!;
        }}
        type="text"
        inputMode="numeric"
        maxLength={1}
        value={digit}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value, index)}
        onKeyDown={(e) => onKeyDown(e, index)}
        className="
          w-12 h-12 sm:w-15 sm:h-15 text-center text-base font-semibold rounded-lg
          border border-neutral-200 bg-neutral-50 text-secondary
          outline-none transition-all duration-100
          placeholder:text-neutral-300
          focus:border-black focus:bg-white focus:ring-1 focus:ring-black
          disabled:opacity-40 disabled:cursor-not-allowed
        "
        placeholder="·"
      />
    ))}
  </div>
);

export const PickupOtpBlock = ({ booking,setStatus}: PickupOtpBlockProps) => {
  const [otpMode, setOtpMode] = useState(false);
  const [otp, setOtp] = useState<string[]>(new Array(4).fill(""));
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");
  const otpRefs = useRef<HTMLInputElement[]>([]);
 
  const handleOtpChange = (value: string, index: number) => {
    if (isNaN(Number(value))) return;
    const next = [...otp];
    next[index] = value.substring(value.length - 1);
    setOtp(next);
    if (value && index < 3) otpRefs.current[index + 1]?.focus();
  };
 
  const handleOtpKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };
 
  const handleSendOtp = async () => {
    try {
      await axios.post(`/api/partner/bookings/otp/pickup/send`, {
        bookingId: booking._id,
      });
      setOtpMode(true);
      setError("");
    } catch (err) {
      setError(
        axios.isAxiosError(err)
          ? (err.response?.data?.message ?? "Failed to send OTP")
          : "Failed to send OTP"
      );
    }
  };
 
  const handleVerify = async () => {
    const code = otp.join("").toString();
    if (code.length < 4) return;
    setLoading(true);
    setError("");
    try {
      await axios.post("/api/partner/bookings/otp/pickup/verify", {
        bookingId: booking._id,
        otp: code,
      });
      setVerified(true);
      setOtp(new Array(4).fill(""));
      setStatus("started");
    } catch (err) {
      setError(
        axios.isAxiosError(err)
          ? (err.response?.data?.message ?? "Invalid OTP")
          : "Invalid OTP"
      );
      setOtp(new Array(4).fill(""));
      setTimeout(() => otpRefs.current[0]?.focus(), 50);
    } finally {
      setLoading(false);
    }
  };
 
  if (verified) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-5 my-3 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 flex items-center gap-2"
      >
        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
        <p className="text-[13px] font-semibold text-emerald-700">
          Pickup verified — ride started!
        </p>
      </motion.div>
    );
  }
 
  return (
    <div className="px-5 py-4 border-b border-neutral-100 space-y-3">
      <AnimatePresence mode="wait">
        {!otpMode ? (
          <motion.div
            key="arrived-btn"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
          >
            <Button
              size="sm"
              variant="primary"
              rightIcon={<ArrowUpRight className="h-4 w-4" />}
              onClick={handleSendOtp}
              className="w-full"
            >
              I&apos;ve Arrived at Pickup
            </Button>
            {error && (
              <p className="text-[11px] text-red-500 mt-1.5 text-center">
                {error}
              </p>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="otp-entry"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-medium text-neutral-400 uppercase tracking-wide">
                Pickup OTP
              </p>
              <p className="text-[11px] text-neutral-400">
                Ask customer for the OTP
              </p>
            </div>
 
            <OtpInputRow
              otp={otp}
              otpRefs={otpRefs}
              onChange={handleOtpChange}
              onKeyDown={handleOtpKeyDown}
              disabled={loading}
            />
 
            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-[11px] text-red-500 text-center"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>
 
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setOtpMode(false);
                  setOtp(new Array(4).fill(""));
                  setError("");
                }}
                className="flex-1 py-2 rounded-lg border border-neutral-200 text-xs font-medium text-neutral-500 hover:bg-neutral-50 transition-colors"
              >
                Cancel
              </button>
              <Button
                size="sm"
                variant="primary"
                onClick={handleVerify}
                disabled={otp.join("").length < 4 || loading}
                className="flex-1"
              >
                {loading ? (
                  <Spinner />
                ) : (
                  "Verify & Start"
                )}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

 
export const DropoffOtpBlock = ({ booking,setStatus }: DropoffOtpBlockProps) => {
  const [otpMode, setOtpMode] = useState(false);
  const [otp, setOtp] = useState<string[]>(new Array(4).fill(""));
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState("");
  const otpRefs = useRef<HTMLInputElement[]>([]);
 
  const handleOtpChange = (value: string, index: number) => {
    if (isNaN(Number(value))) return;
    const next = [...otp];
    next[index] = value.substring(value.length - 1);
    setOtp(next);
    if (value && index < 3) otpRefs.current[index + 1]?.focus();
  };
 
  const handleOtpKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };
 
  const handleSendOtp = async () => {
    try {
      await axios.post(`/api/partner/bookings/otp/dropoff/send`, {
        bookingId: booking._id,
      });
      setOtpMode(true);
      setError("");
    } catch (err) {
      setError(
        axios.isAxiosError(err)
          ? (err.response?.data?.message ?? "Failed to send OTP")
          : "Failed to send OTP"
      );
    }
  };
 
  const handleVerify = async () => {
    const code = otp.join("").toString();
    if (code.length < 4) return;
    setLoading(true);
    setError("");
    try {
      await axios.post("/api/partner/bookings/otp/dropoff/verify", {
        bookingId: booking._id,
        otp: code,
      });
      setCompleted(true);
      setOtp(new Array(4).fill(""));
      setStatus("completed")
    } catch (err) {
      setError(
        axios.isAxiosError(err)
          ? (err.response?.data?.message ?? "Invalid OTP")
          : "Invalid OTP"
      );
      setOtp(new Array(4).fill(""));
      setTimeout(() => otpRefs.current[0]?.focus(), 50);
    } finally {
      setLoading(false);
    }
  };
 
  if (completed) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-5 my-3 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 flex items-center gap-2"
      >
        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
        <p className="text-[13px] font-semibold text-emerald-700">
          Ride completed successfully!
        </p>
      </motion.div>
    );
  }
 
  return (
    <div className="px-5 py-4 border-b border-neutral-100 space-y-3">
      <AnimatePresence mode="wait">
        {!otpMode ? (
          <motion.div
            key="complete-btn"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
          >
            <Button
              size="sm"
              variant="primary"
              rightIcon={<ArrowUpRight className="h-4 w-4" />}
              onClick={handleSendOtp}
              className="w-full"
            >
              Mark as Dropped
            </Button>
            {error && (
              <p className="text-[11px] text-red-500 mt-1.5 text-center">
                {error}
              </p>
            )}
          </motion.div>
        ) : (
         
          <motion.div
            key="drop-otp-entry"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-medium text-neutral-400 uppercase tracking-wide">
                Dropoff OTP
              </p>
              <p className="text-[11px] text-neutral-400">
                Ask customer for the code
              </p>
            </div>
 
            <OtpInputRow
              otp={otp}
              otpRefs={otpRefs}
              onChange={handleOtpChange}
              onKeyDown={handleOtpKeyDown}
              disabled={loading}
            />
 
            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-[11px] text-red-500 text-center"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>
 
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setOtpMode(false);
                  setOtp(new Array(4).fill(""));
                  setError("");
                }}
                className="flex-1 py-2 rounded-lg border border-neutral-200 text-xs font-medium text-neutral-500 hover:bg-neutral-50 transition-colors"
              >
                Cancel
              </button>
              <Button
                size="sm"
                variant="primary"
                onClick={handleVerify}
                disabled={otp.join("").length < 4 || loading}
                className="flex-1"
              >
                {loading ? (
                  <Spinner />
                ) : (
                  "Complete Ride"
                )}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};