"use client";
import { motion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "transparent"; 
type Size = "sm" | "md" | "lg";
type MotionEffect = "slide" | "none";

export interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  variant?: Variant;
  size?: Size;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  motionEffect?: MotionEffect;
  onClick?: () => void;
  children: ReactNode;
}

const baseClasses =
  "relative inline-flex shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-lg font-medium uppercase tracking-wider transition-colors duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-border-strong disabled:pointer-events-none disabled:opacity-60 text-center text-[14px]";

const sizeClasses: Record<Size, string> = {
  sm: "px-6 min-w-[100px] py-2 sm:min-w-[160px]", 
  md: "px-4 min-w-[140px] py-2.2 sm:min-w-[200px]", 
  lg: "px-8 min-w-[300px]  py-2.5 md:min-w-[360px]", 
};

const variantClasses: Record<Variant, string> = {
  primary: "bg-black text-primary hover:bg-black/90 active:bg-black/80",
  transparent: "bg-transparent text-white transition-colors",
};

const textAnimation = {
  initial: { y: 0 },
  hover: { y: "-130%" },
};

const secondaryTextAnimation = {
  initial: { y: "130%" },
  hover: { y: 0 },
};

const gradientAnimation = {
  initial: { opacity: 0, scale: 1 },
  hover: { opacity: 1 },
  tap: { opacity: 1, scale: 0.98 },
};

const ButtonContent = ({
  children,
  leftIcon,
  rightIcon,
}: Pick<ButtonProps, "children" | "leftIcon" | "rightIcon">) => (
  <span className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap w-full execution-center">
    {leftIcon}
    {children}
    {rightIcon}
  </span>
);

const Button = ({
  type = "button",
  variant = "primary",
  size = "sm",
  motionEffect = "slide",
  className,
  leftIcon,
  rightIcon,
  children,
  onClick,
  ...props
}: ButtonProps) => {
  const isTransparent = variant === "transparent";

  return (
    <motion.button
      type={type}
      onClick={onClick}
      className={cn(
        baseClasses,
        isTransparent ? "w-full px-2" : sizeClasses[size],
        variantClasses[variant],
        className
      )}
      whileHover="hover"
      whileTap="tap"
      initial="initial"
      {...props}
    >
      {!isTransparent && (
        <motion.span
          className="absolute inset-0 pointer-events-none mix-blend-screen"
          style={{
            backgroundImage: "repeating-linear-gradient(-45deg, transparent, transparent 3px, rgba(255,255,255,0.08) 5px, rgba(255,255,255,0.08) 1px)",
          }}
          variants={gradientAnimation}
          transition={{ duration: 0.2 }}
        />
      )}

      {motionEffect === "none" ? (
        <ButtonContent leftIcon={leftIcon} rightIcon={rightIcon}>
          {children}
        </ButtonContent>
      ) : (
        <span className="relative inline-flex h-[1.35em] items-center justify-center overflow-hidden w-full">
          <motion.span
            className="w-full inline-flex items-center justify-center"
            variants={textAnimation}
            transition={{ duration: 0.32, ease: [0.215, 0.61, 0.355, 1] }}
          >
            <ButtonContent leftIcon={leftIcon} rightIcon={rightIcon}>
              {children}
            </ButtonContent>
          </motion.span>
          <motion.span
            variants={secondaryTextAnimation}
            transition={{ duration: 0.32, ease: [0.215, 0.61, 0.355, 1] }}
            className="absolute inset-0 inline-flex items-center justify-center w-full"
          >
            <ButtonContent leftIcon={leftIcon} rightIcon={rightIcon}>
              {children}
            </ButtonContent>
          </motion.span>
        </span>
      )}
    </motion.button>
  );
};

export default Button;