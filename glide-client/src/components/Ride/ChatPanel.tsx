"use client";

import { IPopulatedBookingResponse } from "@/data/booking";
import { chatPanelVariants } from "@/lib/animation";
import { motion } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import { useRef } from "react";

interface ChatPanelProps {
  booking: IPopulatedBookingResponse;
  onClose: () => void;
  currRole?: string;
}

const ChatPanel = ({ booking, onClose}: ChatPanelProps) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      key="chat-panel"
      variants={chatPanelVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="
        absolute inset-0 z-20 flex flex-col bg-white 
        lg:relative lg:inset-auto lg:z-auto lg:rounded-2xl lg:border lg:border-neutral-100 lg:shadow-sm
      "
    >
      {/* Chat header */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-neutral-100 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center text-xs font-bold text-neutral-600">
            {booking.driver?.name?.charAt(0) ?? "D"}
          </div>
          <div>
            <p className="text-sm font-semibold text-secondary leading-none">
              {booking.driver?.name ?? "Driver"}
            </p>
            <p className="text-[11px] text-neutral-400 mt-0.5">In-ride chat</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors flex items-center justify-center text-neutral-500"
          aria-label="Close chat"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages area */}
      {/* <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scrollbar-none">
        <div className="h-full flex flex-col items-center justify-center gap-2 text-center">
          <MessageCircle className="w-8 h-8 text-neutral-200" />
          <p className="text-xs text-neutral-400">
            Send a message to your driver
          </p>
        </div>
        <div ref={bottomRef} />
      </div> */}

      {/* Input area */}
      {/* <div className="shrink-0 px-4 py-3 border-t border-neutral-100">
        <div className="flex items-center gap-2 rounded-xl bg-neutral-50 border border-neutral-100 px-3 py-2.5">
          <input
            type="text"
            placeholder="Type a message…"
            className="flex-1 bg-transparent text-sm text-secondary placeholder:text-neutral-400 focus:outline-none"
          />
          <button
            className="w-7 h-7 rounded-lg bg-black flex items-center justify-center shrink-0"
            aria-label="Send message"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div> */}


      
    </motion.div>
  );
};

export default ChatPanel;