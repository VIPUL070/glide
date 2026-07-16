"use client";
import { motion } from "motion/react";
import { AlertCircle } from "lucide-react";

interface FormErrorProps {
  message: string;
}

export default function FormError({ message }: FormErrorProps) {
  if (!message) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ 
        opacity: 1, 
        y: 0, 
        scale: 1,
        x: [0, -6, 4, -4, 2, 0] 
      }}
      exit={{ opacity: 0, scale: 0.95, y: -8 }}
      transition={{ 
        duration: 0.3,
        x: { duration: 0.4, ease: "easeOut" }
      }}
      className="flex items-start gap-2.5 rounded-xl border border-red-500/10 bg-red-500/5 p-3.5 text-sm text-red-500 shadow-inner backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.6, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 350, damping: 15 }}
        className="mt-0.5 shrink-0"
      >
        <AlertCircle className="h-4 w-4 text-red-500" />
      </motion.div>
      
      <span className="font-medium leading-relaxed selection:bg-red-500/20">
        {message}
      </span>
    </motion.div>
  );
}