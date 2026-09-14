"use client";

import { useEffect, useState } from "react";
import axios, { isAxiosError } from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Eye,
  EyeOff,
  ChevronDown,
  Plus,
  BarChart2,
  CalendarDays,
  Star,
  PiggyBank,
} from "lucide-react";

export interface EarningData {
  date: string;
  earnings: number;
}

const fallbackData: EarningData[] = [
  { date: "Mon", earnings: 18400 },
  { date: "Tue", earnings: 24500 },
  { date: "Wed", earnings: 42000 },
  { date: "Thu", earnings: 31200 },
  { date: "Fri", earnings: 58000 },
  { date: "Sat", earnings: 74500 },
  { date: "Sun", earnings: 62100 },
];

function AdminEarning() {
  const [earningData, setEarningData] = useState<EarningData[]>(fallbackData);
  const [totalEarning, setTotalEarning] = useState<number>(310700);
  const [showBalance, setShowBalance] = useState<boolean>(true);
  const [selectedCurrency, setSelectedCurrency] = useState<string>("INR");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const fetchEarning = async () => {
      try {
        const { data } = await axios.get(`/api/admin/earning`, {
          signal: controller.signal,
        });

        if (data?.success && data?.earning) {
          const last7DaysData: EarningData[] =
            data.earning.chartData?.slice(-7) || fallbackData;
          setEarningData(last7DaysData);
          setTotalEarning(data.earning.totalAdminCommission || 0);
        }
      } catch (err) {
        if (isAxiosError(err)) {
          console.log("Request canceled:", err.message);
        } else if (err instanceof Error) {
          console.log(err.message);
        } else {
          console.log("Something went wrong");
        }
      }
    };

    fetchEarning();

    return () => {
      controller.abort();
    };
  }, []);

  // Calculation logic
  const avg = earningData.length
    ? Math.round(totalEarning / earningData.length)
    : 0;
  const max = earningData.length
    ? Math.max(...earningData.map((d) => d.earnings))
    : 0;
  const bestDay = earningData.find((d) => d.earnings === max);
  const today = earningData[earningData.length - 1];
  const yesterday = earningData[earningData.length - 2];
  const delta = today && yesterday ? today.earnings - yesterday.earnings : 0;
  const deltaPositive = delta >= 0;
  const deltaPct = yesterday?.earnings
    ? Math.abs(Math.round((delta / yesterday.earnings) * 100))
    : 0;

  const fmt = (n: number) => "₹" + n.toLocaleString();

  const metrics = [
    {
      id: "best-day",
      label: "Best Day",
      value: fmt(max),
      sub: bestDay?.date ?? "–",
      icon: <Star className="w-4 h-4" />,
      color: "text-amber-500",
      bg: "bg-amber-50 border-amber-100",
      deltaText: "Peak Volume",
      deltaPositive: true,
    },
    {
      id: "daily-avg",
      label: "Daily Avg",
      value: fmt(avg),
      sub: "per day across cycle",
      icon: <BarChart2 className="w-4 h-4" />,
      color: "text-blue-500",
      bg: "bg-blue-50 border-blue-100",
      deltaText: "+8.2% vs Last Month",
      deltaPositive: true,
    },
    {
      id: "today",
      label: "Today's Take",
      value: today ? fmt(today.earnings) : "₹0",
      sub:
        today && yesterday
          ? `${deltaPositive ? "+" : ""}${fmt(Math.abs(delta))} vs yesterday`
          : "–",
      icon: <CalendarDays className="w-4 h-4" />,
      color: "text-emerald-500",
      bg: "bg-emerald-50 border-emerald-100",
      deltaText: `${deltaPositive ? "+" : "-"}${deltaPct}% today`,
      deltaPositive: deltaPositive,
    },
    {
      id: "yesterday-delta",
      label: "Yesterday Variance",
      value: `${deltaPositive ? "+" : "-"}${fmt(Math.abs(delta))}`,
      sub: `${deltaPositive ? "▲" : "▼"} ${deltaPct}% from baseline`,
      icon: deltaPositive ? (
        <TrendingUp className="w-4 h-4" />
      ) : (
        <TrendingDown className="w-4 h-4" />
      ),
      color: deltaPositive ? "text-emerald-600" : "text-rose-500",
      bg: deltaPositive
        ? "bg-emerald-50 border-emerald-100"
        : "bg-rose-50 border-rose-100",
      deltaText: deltaPositive ? "Positive Yield" : "Dip vs Yesterday",
      deltaPositive: deltaPositive,
    },
  ];

  return (
    <div className="w-full text-neutral-900 mt-10 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-neutral-300">
            Financial Intelligence
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-display">
            Platform Earnings & Commission
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-7 bg-white rounded-2xl p-3 sm:p-6 border border-neutral-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col gap-4 relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-800">
                <Wallet className="w-5 h-5" />
              </div>
              <span className="font-semibold text-neutral-700 text-sm sm:text-base">
                Total Balance
              </span>
            </div>

            <div className="flex items-center gap-1.5 bg-neutral-50 hover:bg-neutral-100/80 transition-colors border border-neutral-200/60 rounded-full px-3 py-1.5 text-xs font-semibold text-neutral-700 cursor-pointer">
              <span className="text-sm">🇮🇳</span>
              <span>{selectedCurrency}</span>
              <ChevronDown className="w-3 h-3 text-neutral-400 ml-0.5" />
            </div>
          </div>

          <div className="my-2 relative">
            <div className="absolute right-0 top-1/4 -translate-y-1/4 opacity-85 hidden sm:grid grid-cols-4 gap-1.5 pointer-events-none">
              <div className="w-2.5 h-2.5 rounded-sm bg-neutral-100" />
              <div className="w-2.5 h-2.5 rounded-sm bg-neutral-100" />
              <div className="w-2.5 h-2.5 rounded-sm bg-amber-100" />
              <div className="w-2.5 h-2.5 rounded-sm bg-orange-200" />
              <div className="w-2.5 h-2.5 rounded-sm bg-neutral-100" />
              <div className="w-2.5 h-2.5 rounded-sm bg-orange-100" />
              <div className="w-2.5 h-2.5 rounded-sm bg-orange-300" />
              <div className="w-2.5 h-2.5 rounded-sm bg-orange-400" />
              <div className="w-2.5 h-2.5 rounded-sm bg-neutral-100" />
              <div className="w-2.5 h-2.5 rounded-sm bg-neutral-200" />
              <div className="w-2.5 h-2.5 rounded-sm bg-orange-200" />
              <div className="w-2.5 h-2.5 rounded-sm bg-orange-500" />
            </div>

            <div className="flex items-center gap-3">
              <AnimatePresence mode="wait">
                {showBalance ? (
                  <motion.h1
                    key="visible"
                    initial={{ opacity: 0, filter: "blur(4px)" }}
                    animate={{ opacity: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, filter: "blur(4px)" }}
                    className="text-3xl sm:text-4xl lg:text-[34px] font-extrabold tracking-tight text-neutral-950 font-display"
                  >
                    {fmt(totalEarning)}
                  </motion.h1>
                ) : (
                  <motion.h1
                    key="hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-3xl sm:text-4xl lg:text-[34px] font-extrabold text-neutral-400 tracking-widest"
                  >
                    ••••••••
                  </motion.h1>
                )}
              </AnimatePresence>

              <button
                type="button"
                onClick={() => setShowBalance(!showBalance)}
                className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-500 transition-colors"
                title={showBalance ? "Hide Balance" : "Show Balance"}
              >
                {showBalance ? (
                  <Eye className="w-4 h-4" />
                ) : (
                  <EyeOff className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Delta Tag */}
            <div className="mt-3 flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                  deltaPositive
                    ? "bg-orange-50 text-orange-600 border border-orange-200/60"
                    : "bg-rose-50 text-rose-600 border border-rose-200/60"
                }`}
              >
                {deltaPositive ? (
                  <TrendingUp className="w-3 h-3 stroke-[2.5]" />
                ) : (
                  <TrendingDown className="w-3 h-3 stroke-[2.5]" />
                )}
                {deltaPositive ? `+${deltaPct}%` : `-${deltaPct}%`}
              </span>
              <span className="text-xs text-neutral-400 font-medium">
                vs Last Cycle
              </span>
            </div>
          </div>
        </motion.div>

        <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
          {metrics.slice(0, 2).map((metric, idx) => (
            <motion.div
              key={metric.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="rounded-2xl p-4 text-primary bg-linear-to-br from-[#FF6B2C] via-[#FF5412] to-[#E33B00] shadow-lg flex flex-col justify-between"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center ${metric.bg} ${metric.color}`}
                >
                  {metric.icon}
                </div>
                <span className="font-semibold text-sm">{metric.label}</span>
              </div>

              <div className="mt-5 space-y-2">
                <h3 className="text-2xl font-bold tracking-tightfont-display">
                  {metric.value}
                </h3>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                      metric.deltaPositive
                        ? "bg-orange-50 text-orange-600 border border-orange-200/60"
                        : "bg-rose-50 text-rose-600 border border-rose-200/60"
                    }`}
                  >
                    <TrendingUp className="w-3 h-3" />
                    {metric.deltaText}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-7 bg-white rounded-2xl p-3 sm:p-6 border border-neutral-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-neutral-900 text-lg sm:text-xl font-display">
              Earning Overview
            </h3>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-neutral-200/80 text-xs font-semibold text-neutral-700 bg-neutral-50 cursor-pointer hover:bg-neutral-100 transition-colors">
              <span>Last 7 Days</span>
              <ChevronDown className="w-3 h-3 text-neutral-400" />
            </div>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl sm:text-3xl font-extrabold text-neutral-950 font-display">
              {fmt(totalEarning)}
            </span>
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                deltaPositive
                  ? "bg-orange-50 text-orange-600 border border-orange-200/60"
                  : "bg-rose-50 text-rose-600 border border-rose-200/60"
              }`}
            >
              {deltaPositive ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              {deltaPositive ? `+${deltaPct}%` : `-${deltaPct}%`} vs yesterday
            </span>
          </div>

          {/* RECHARTS BAR CHART */}
          <div className="w-full h-70 sm:h-80">
            {isMounted && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={earningData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#F1F5F9"
                  />
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94A3B8", fontSize: 12, fontWeight: 500 }}
                    dy={8}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94A3B8", fontSize: 12 }}
                    tickFormatter={(v) =>
                      "₹" + (v >= 1000 ? (v / 1000).toFixed(0) + "k" : v)
                    }
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(0, 0, 0, 0.02)" }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload as EarningData;
                        const isToday =
                          data.date === today?.date ||
                          data === earningData[earningData.length - 1];
                        const isBest = data.earnings === max && !isToday;

                        return (
                          <div className="bg-neutral-900 text-white rounded-2xl px-3.5 py-2.5 shadow-xl border border-neutral-800 text-xs space-y-1">
                            <div className="flex items-center justify-between gap-3 text-neutral-400">
                              <span>{data.date}</span>
                              {isToday && (
                                <span className="bg-white/20 text-white text-[10px] px-1.5 py-0.2 rounded">
                                  Today
                                </span>
                              )}
                              {isBest && (
                                <span className="bg-orange-500/30 text-orange-300 text-[10px] px-1.5 py-0.2 rounded">
                                  Best Day
                                </span>
                              )}
                            </div>
                            <div className="font-bold text-base text-white">
                              {fmt(data.earnings)}
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="earnings" radius={[8, 8, 8, 8]} maxBarSize={38}>
                    {earningData.map((entry, index) => {
                      const isToday = index === earningData.length - 1;
                      const isBestDay = entry.earnings === max && !isToday;

                      const fillColor = isToday
                        ? "#18181B"
                        : isBestDay
                        ? "#F97316"
                        : "#E2E8F0";

                      return <Cell key={`cell-${index}`} fill={fillColor} />;
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>

        <div className="lg:col-span-5 flex flex-col gap-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="bg-[#18191E] rounded-2xl p-3 sm:p-6 text-white border border-neutral-800 shadow-xl flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-neutral-800 border border-neutral-700/60 flex items-center justify-center text-white">
                  <PiggyBank className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm sm:text-base text-white">
                    Commission Targets
                  </h4>
                  <p className="text-xs text-neutral-400">Monthly Fleet Goal</p>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-1.5 bg-white text-neutral-950 font-bold text-xs px-3.5 py-1.5 rounded-full hover:bg-neutral-100 transition-all shadow-sm"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Add Goal</span>
              </motion.button>
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex justify-between items-baseline text-xs">
                <span className="text-neutral-400">Target Progress</span>
                <span className="font-semibold text-white">
                  {fmt(totalEarning)} / {fmt(500000)}
                </span>
              </div>

              <div className="w-full h-3 rounded-full bg-neutral-800 overflow-hidden p-0.5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${Math.min(
                      Math.round((totalEarning / 500000) * 100),
                      100
                    )}%`,
                  }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full rounded-full bg-linear-to-r from-amber-400 to-orange-500"
                />
              </div>

              <div className="flex justify-between items-center text-[11px] text-neutral-300 pt-1">
                <span>
                  {Math.round((totalEarning / 500000) * 100)}% Completed
                </span>
                <span>{fmt(Math.max(500000 - totalEarning, 0))} Remaining</span>
              </div>
            </div>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-5 pt-2">
            {metrics.slice(2).map((metric, idx) => (
              <motion.div
                key={metric.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * idx }}
                className="bg-white rounded-2xl p-3 border border-neutral-100 shadow-[0_4px_16px_rgba(0,0,0,0.02)] flex flex-col items-center gap-6"
              >
                <div className="w-full flex items-center justify-evenly">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center ${metric.bg} ${metric.color}`}
                  >
                    {metric.icon}
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-neutral-500 block">
                      {metric.label}
                    </span>
                    <span className="text-lg font-bold text-neutral-900 font-display">
                      {metric.value}
                    </span>
                  </div>
                </div>

                <span className="text-xs text-neutral-400 font-medium">
                  {metric.sub}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminEarning;
