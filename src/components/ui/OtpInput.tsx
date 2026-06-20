import { useRef } from "react";

interface OtpProps {
  otp: string[];
}

const OtpInput = ({ otp }: OtpProps) => {
  const otpRefs = useRef<HTMLInputElement[]>([]);

  const handleOtpChange = (value: string, index: number) => {
    if (isNaN(Number(value))) return;

    if (value && index < otp.length - 1) {
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

  return (
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
  );
};

export default OtpInput;
