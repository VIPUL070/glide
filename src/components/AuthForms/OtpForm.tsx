"use client";
import { useState, useRef, SyntheticEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { stepContent } from "@/data/authForm";
import Button from "../ui/Button";
import axios from "axios";
import Spinner from "../ui/Spinner";
import FormError from "../ui/FormError";

interface OTPProps {
    onStepChange: () => void;
    email: string;
}
function OtpForm({email, onStepChange}: OTPProps) {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const otpRefs = useRef<HTMLInputElement[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleOtpChange = (value: string, index: number) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOTP = async (e: SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await axios.post("/api/auth/verify-otp", {
        email,
        otp: otp.join(""),
      });
      onStepChange();
      setOtp(new Array(6).fill(""));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message ?? "Something went wrong!");
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="text-center mb-6">
        <h1 className="text-[2.25rem] font-extrabold tracking-tight uppercase text-secondary">
          {stepContent["otp"].title}
        </h1>
        <p className="text-[0.9rem] pt-1 text-secondary/60 tracking-tight">
          {stepContent["otp"].subtitle}
        </p>
      </div>

      <form onSubmit={handleVerifyOTP} className="space-y-3">
        <div className="flex flex-col gap-2.5 items-center py-2">
          <label className="text-sm font-medium tracking-wide text-secondary/60 uppercase self-start">
            Security Code
          </label>
          <div className="flex justify-between w-full gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  otpRefs.current[index] = el!;
                }}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(e.target.value, index)}
                onKeyDown={(e) => handleOtpKeyDown(e, index)}
                className="w-full aspect-square text-center text-xl font-semibold rounded-xl border border-secondary/10 bg-secondary/2 text-secondary outline-none transition-all duration-300 placeholder:text-secondary/30 focus:border-secondary focus:bg-transparent focus:ring-1 focus:ring-secondary"
                placeholder="-"
                required
              />
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {error && <FormError message={error} />}
        </AnimatePresence>

        <Button
          whileHover="hover"
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="group flex w-full items-center justify-center gap-2 rounded-xl bg-secondary px-4 py-3.5 text-sm font-medium text-background shadow-lg transition-colors duration-200 hover:opacity-90 cursor-pointer"
        >
          {loading ? (
            <Spinner />
          ) : (
            <>
              {stepContent["otp"].buttonText}
              <motion.div
                variants={{ hover: { x: 3 } }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
              >
                <ArrowRight className="h-4 w-4" />
              </motion.div>
            </>
          )}
        </Button>
      </form>
    </div>
  );
}

export default OtpForm;