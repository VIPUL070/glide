"use client";

import { IPopulatedBookingResponse } from "@/data/booking";
import { chatPanelVariants } from "@/lib/animation";
import { formatTime } from "@/lib/utils";
import axios, { isAxiosError } from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";

interface ChatPanelProps {
  booking: IPopulatedBookingResponse;
  onClose: () => void;
  currRole?: string;
}

interface ChatMessage {
  _id?: string;
  bookingId: string;
  sender: string;
  text: string;
  createdAt?: string;
  updatedAt: string;
  _v?:number | string;
}

const POLL_INTERVAL = 4000;

const ChatPanel = ({ booking, onClose, currRole }: ChatPanelProps) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState<string>("");
  const [sending, setSending] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = useCallback(
    async (silent = false) => {
      try {
        const { data } = await axios.get<ChatMessage []>(`/api/chat/get-all`, {
          params: { bookingId: booking._id },
        });
        setMessages(data ?? []);
        setError(null);
      } catch (err) {
        if (!silent) {
          setError(
            isAxiosError(err)
              ? err.response?.data?.message ?? "Failed to load messages"
              : "Failed to load messages"
          );
        }
      } finally {
        if (!silent) setLoadingMessages(false);
      }
    },
    [booking._id]
  );

  // Initial load + polling 
  useEffect(() => {
    fetchMessages();
    pollRef.current = setInterval(() => fetchMessages(true), POLL_INTERVAL);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [fetchMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  const sendMessage = async () => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;

    const optimistic: ChatMessage = {
      bookingId: booking._id,
      sender: currRole ?? "user",
      text: trimmed,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      _id: `optimistic-${Date.now()}`,
      _v: `optimistic-${Date.now()}`,
    };
    setMessages((prev) => [...(prev), optimistic]);
    setText("");
    setShowSuggestions(false);
    setSuggestions([]);
    setSending(true);

    try {
      const { data } = await axios.post(`/api/chat/send`, {
        bookingId: booking._id,
        sender: currRole,
        text: trimmed,
      });
      await fetchMessages(true);
      console.log(data);
    } catch (error) {
      setMessages((prev) => prev.filter((m) => m._id !== optimistic._id));
      setText(trimmed);
      setError(
        isAxiosError(error)
          ? (error.response?.data?.message ?? "Failed to send")
          : "Failed to send"
      );
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

   const getAISuggestions = async () => {
    if (loadingSuggestions) return;
    if (showSuggestions) {
      setShowSuggestions(false);
      return;
    }
    setShowSuggestions(true);
 
    if (suggestions.length > 0) return; // already fetched
 
    const lastMessage = messages.filter((m) => m.sender !== currRole).at(-1)?.text;
    if (!lastMessage) return;
    setLoadingSuggestions(true);
    try {
      const { data } = await axios.post(`/api/chat/ai-suggestions`, {
        lastMessage,
        role: currRole,
      });
      const parsedData = JSON.parse(data) 
      setSuggestions(parsedData.suggestions);
    } catch {
      setSuggestions([]);
    } finally {
      setLoadingSuggestions(false);
    }
  };
 
  const applySuggestion = (s: string) => {
    setText(s);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };
 
  const isOwnMessage = (msg: ChatMessage) => msg.sender === currRole;
  const otherName =
    currRole === "driver"
      ? (booking.user?.name ?? "Customer")
      : (booking.driver?.name ?? "Driver");
  const otherInitial = otherName.charAt(0).toUpperCase();

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
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-neutral-100 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center text-xs font-bold text-neutral-600 shrink-0">
            {otherInitial}
          </div>
          <div>
            <p className="text-sm font-semibold text-secondary leading-none">
              {otherName}
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
 
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scrollbar-none">
        {loadingMessages && (
          <div className="flex flex-col gap-3">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}
              >
                <div
                  className="h-9 rounded-2xl bg-neutral-100 animate-pulse"
                  style={{ width: `${48 + i * 14}%` }}
                />
              </div>
            ))}
          </div>
        )}
 
        {/* Error state */}
        {!loadingMessages && error && messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-center">
            <p className="text-xs text-red-400">{error}</p>
            <button
              onClick={() => fetchMessages()}
              className="text-xs text-neutral-500 underline underline-offset-2"
            >
              Retry
            </button>
          </div>
        )}
 
        {/* Empty state */}
        {!loadingMessages && !error && messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-center">
            <MessageCircle className="w-8 h-8 text-neutral-200" />
            <p className="text-xs text-neutral-400">
              No messages yet. Say hello!
            </p>
          </div>
        )}
 
        {/* Message bubbles */}
        {!loadingMessages &&
          messages.map((msg, i) => {
            const own = isOwnMessage(msg);
            const isOptimistic = msg._id?.startsWith("optimistic-");
            return (
              <motion.div
                key={msg._id ?? i}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.18 }}
                className={`flex items-end gap-2 ${own ? "flex-row-reverse" : "flex-row"}`}
              >
                {/* Avatar */}
                {!own && (
                  <div className="w-6 h-6 rounded-full bg-neutral-200 flex items-center justify-center text-[10px] font-bold text-neutral-600 shrink-0 mb-0.5">
                    {otherInitial}
                  </div>
                )}
 
                <div
                  className={`flex flex-col gap-0.5 max-w-[72%] ${
                    own ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`
                      px-3 py-2 rounded-2xl text-sm leading-snug break-words
                      ${
                        own
                          ? "bg-black text-white rounded-br-sm"
                          : "bg-neutral-100 text-secondary rounded-bl-sm"
                      }
                      ${isOptimistic ? "opacity-60" : "opacity-100"}
                    `}
                  >
                    {msg.text}
                  </div>
                  {msg.createdAt && (
                    <p className="text-[10px] text-neutral-400 px-1">
                      {formatTime(msg.createdAt)}
                      {isOptimistic && " · sending…"}
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
 
        <div ref={bottomRef} />
      </div>
 
      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-neutral-100 bg-neutral-50"
          >
            <div className="px-4 py-2.5 flex flex-wrap gap-2">
              {loadingSuggestions ? (
                <>
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="h-7 rounded-full bg-neutral-200 animate-pulse"
                      style={{ width: `${60 + i * 20}px` }}
                    />
                  ))}
                </>
              ) : suggestions.length > 0 ? (
                suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => applySuggestion(s)}
                    className="text-xs px-3 py-1.5 rounded-full bg-white border border-neutral-200 text-secondary hover:border-black/30 transition-colors leading-none"
                  >
                    {s}
                  </button>
                ))
              ) : (
                <p className="text-xs text-neutral-400 py-0.5">
                  No suggestions available
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
 
      <AnimatePresence>
        {error && !loadingMessages && messages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className="mx-4 mb-1 px-3 py-2 rounded-lg bg-red-50 border border-red-100 text-xs text-red-500"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>
 
      <div className="shrink-0 px-4 py-3 border-t border-neutral-100">
        <div className="flex items-center gap-2 rounded-xl bg-neutral-50 border border-neutral-200 px-3 py-2 focus-within:border-neutral-400 transition-colors">
          {/* AI suggestions  */}
          <button
            onClick={getAISuggestions}
            aria-label="AI reply suggestions"
            className={`
              shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-colors
              ${
                showSuggestions
                  ? "bg-black text-white"
                  : "text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100"
              }
            `}
          >
            <Sparkles className="w-3.5 h-3.5" />
          </button>
 
          <input
            ref={inputRef}
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message…"
            className="flex-1 bg-transparent text-sm text-secondary placeholder:text-neutral-400 focus:outline-none min-w-0"
          />
 
          {/* Send button */}
          <button
            onClick={sendMessage}
            disabled={sending || !text.trim()}
            aria-label="Send message"
            className="
              shrink-0 w-7 h-7 rounded-lg bg-black flex items-center justify-center
              disabled:opacity-30 disabled:cursor-not-allowed
              active:scale-95 transition-all cursor-pointer
            "
          >
            {sending ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full"
              />
            ) : (
              <Send className="w-3.5 h-3.5 text-white" />
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatPanel;