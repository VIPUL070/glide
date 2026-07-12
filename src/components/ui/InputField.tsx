"use client";
import { ReactNode, useState } from "react";
import { Eye, EyeOff} from "lucide-react";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: ReactNode;
}

const InputField = ({ label,icon, id, type, ...props }: InputFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="flex flex-col gap-1.5 w-full align-left text-left">
      <label htmlFor={id} className="text-sm font-medium tracking-wide text-secondary uppercase">
        {label}
      </label>
      <div className="relative w-full">
        <input
          id={id}
          type={isPassword ? (showPassword ? "text" : "password") : type}
          {...props}
          className="w-full rounded-xl border border-secondary/50 bg-secondary/2 px-4 py-3.5 pr-11 text-[14px] text-secondary outline-none transition-all duration-300 placeholder:text-secondary/60 focus:border-secondary focus:bg-transparent focus:ring-1 focus:ring-secondary"
        />
        {isPassword ? (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary/40 hover:text-secondary/80 transition-colors cursor-pointer focus:outline-none"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        ): (
          <button
            type="button"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary/40 hover:text-secondary/80 transition-colors cursor-pointer focus:outline-none"
          >
            {icon}
          </button>
        )}
      </div>
    </div>
  );
};

export default InputField;