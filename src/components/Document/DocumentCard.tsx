"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, CheckCircle2, FileText } from "lucide-react";
import { docsCardVariants, springs } from "@/lib/animation";

interface DocumentSlotProps {
  title: string;
  description: string;
  isUploaded: boolean;
  onToggle: () => void;
}

function DocumentCard({ title, description, isUploaded, onToggle }: DocumentSlotProps) {
  return (
    <motion.div
      variants={docsCardVariants}
      whileHover={{ scale: 1.015, y: -2 }}
      whileTap={{ scale: 0.985 }}
      transition={springs.tight}
      onClick={onToggle}
      className={`
        group relative flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-2xl border p-5 sm:p-6 text-left
        transition-[border-color,box-shadow] duration-300 cursor-pointer outline-none w-full bg-background select-none
        focus-visible:ring-2 focus-visible:ring-secondary/20
        ${
          isUploaded
            ? "border-secondary/30 bg-secondary/1"
            : "border-secondary/10 hover:border-secondary/20 hover:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.04)]"
        }
      `}
    >
      {/* container background */}
      <AnimatePresence>
        {isUploaded && (
          <motion.div
            layoutId={`activeDocInk-${title}`}
            className="absolute inset-0 rounded-2xl bg-secondary/1.5 border border-secondary/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={springs.fluid}
          />
        )}
      </AnimatePresence>

      {/* Document Text */}
      <div className="relative z-10 flex gap-4 items-start">
        <div className={`p-3 rounded-xl border transition-colors duration-300 ${
          isUploaded ? "bg-secondary/5 border-secondary/20" : "bg-secondary/2 border-secondary/10"
        }`}>
          <FileText className={`h-5 w-5 ${isUploaded ? "text-secondary" : "text-secondary/40"}`} />
        </div>
        <div>
          <span className={`block text-[15px] font-medium tracking-tight transition-colors duration-200 ${
            isUploaded ? "text-secondary" : "text-secondary/80 group-hover:text-secondary"
          }`}>
            {title}
          </span>
          <span className="mt-1 block text-xs leading-normal font-normal text-secondary/50">
            {description}
          </span>
        </div>
      </div>

      {/* State Indicator */}
      <div className="relative z-10 mt-4 sm:mt-0 w-full sm:w-auto flex justify-end">
        <AnimatePresence mode="wait">
          {isUploaded ? (
            <motion.div
              key="uploaded"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={springs.tight}
              className="flex items-center gap-2 bg-secondary/10 px-3 py-1.5 rounded-xl border border-secondary/10"
            >
              <CheckCircle2 className="h-3.5 w-3.5 text-secondary" />
              <span className="text-[11px] font-medium tracking-wide uppercase text-secondary">Ready</span>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 text-secondary/70 group-hover:text-secondary/80 px-3 py-1.5 transition-colors duration-200"
            >
              <Upload className="h-4 w-4 stroke-[1.75]" />
              <span className="text-xs font-medium">Upload File</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default DocumentCard;