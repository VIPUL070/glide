"use client";
import { heroContainerVariants } from "@/lib/animation";
import axios from "axios";
import { motion } from "motion/react";
import {
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  Video,
  Car,
} from "lucide-react";
import { useEffect, useState } from "react";
import AdminCards from "./AdminCards";
import { DashboardStats, ReviewData } from "@/data/adminDashboard";
import OperationCard from "./OperationCard";

function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalPartners: 0,
    approvedPartners: 0,
    pendingPartners: 0,
    rejectedPartners: 0,
  });
  const [partnerReviews, setPartnerReviews] = useState<ReviewData[]>([]);
  const [pendingKyc, setPendingKyc] = useState<ReviewData[]>([]);
  const [vehicleReviews, setVehicleReviews] = useState<ReviewData[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const getDashboardData = async () => {
      try {
        const { data } = await axios.get("/api/admin/dashboard", { signal });
        setStats(data);
        setPartnerReviews(data.pendingPartnerReview);
        setVehicleReviews(data.pendingVehicles)
      } catch (error) {
        if (axios.isCancel(error)) return;
        console.error("Error loading dashboard metrics:", error);
      }
    };

    const getKycData = async () => {
      try {
        const { data } = await axios.get("/api/admin/videoKyc/pending", {
          signal,
        });
        if(data){
          setPendingKyc(data.partners)
        }
      } catch (error) {
        if (axios.isCancel(error)) return;
      }
    };

    getDashboardData();
    getKycData();

    return () => {
      controller.abort();
    };
  }, []);

  const cardData = [
    {
      id: "total",
      title: "Total Partners",
      value: stats.totalPartners.toLocaleString() || "0",
      icon: Users,
      topBarColor: "bg-background",
      iconContainerClass: "bg-neutral-100 text-neutral-900",
      footerContent: (
        <>
          <span className="font-semibold text-emerald-600">+4.2%</span>
          <span className="text-primary/70">vs previous month</span>
        </>
      ),
    },
    {
      id: "pending",
      title: "Pending Request",
      value: stats.pendingPartners.toLocaleString() || "0",
      icon: Clock,
      topBarColor: "bg-amber-400",
      iconContainerClass:
        "bg-amber-50 text-amber-600 border border-amber-100 animate-pulse",
      footerContent: (
        <span className="font-medium text-amber-700 ">
          Requires Immediate Action
        </span>
      ),
    },
    {
      id: "active",
      title: "Active Partners",
      value: stats.approvedPartners.toLocaleString() || "0",
      icon: CheckCircle2,
      topBarColor: "bg-emerald-400",
      iconContainerClass:
        "bg-emerald-50 text-emerald-600 border border-emerald-100",
      footerContent: (
        <span className="text-emerald-600 font-medium">
          94.1% Live Conversion
        </span>
      ),
    },
    {
      id: "denied",
      title: "Denied / Revoked",
      value: stats.rejectedPartners.toLocaleString() || "0",
      icon: XCircle,
      topBarColor: "bg-rose-400",
      iconContainerClass: "bg-rose-50 text-rose-600 border border-rose-100",
      footerContent: (
        <span className="text-primary/70">Compliance & risk blocklist</span>
      ),
    },
  ];

  return (
    <div className="min-h-dvh pt-[9vh] px-[2vw] bg-black text-primary selection:bg-black/5 antialiased overflow-x-hidden">
      <div className="absolute top-0 right-0 w-150 h-150 bg-blue-500/2 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-40 left-0 w-125 h-125 bg-amber-500/2 rounded-full blur-[140px] pointer-events-none" />

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10 pb-6 border-b border-neutral-200">
          <div>
            <p className="text-xs uppercase tracking-widest text-primary mb-1">
              Operations Control
            </p>
            <h1 className="text-3xl font-bold tracking-tight font-display">
              Partner Onboarding Requests
            </h1>
          </div>
        </div>

        <motion.section
          variants={heroContainerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8"
        >
          {cardData.map((card) => (
            <AdminCards
              key={card.id}
              title={card.title}
              value={card.value}
              icon={card.icon}
              topBarColor={card.topBarColor}
              iconContainerClass={card.iconContainerClass}
              footerContent={card.footerContent}
            />
          ))}
        </motion.section>

        <div className="mb-4 mt-10">
          <h2 className="text-lg font-bold mb-4 tracking-tight">
            Active Operations Queue
          </h2>
        </div>

        <motion.section
          variants={heroContainerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          <OperationCard
            title="Partner Profile Reviews"
            description="Document validation"
            icon={FileText}
            data={partnerReviews ?? []}
            type="partner"
          />
          <OperationCard
            title="Pending Video KYC"
            description="Live identity matching"
            icon={Video}
            data={pendingKyc ?? []}
            type="kyc"
          />
          <OperationCard
            title="Vehicle Reviews"
            description="Physical assets review"
            icon={Car}
            data={vehicleReviews ?? []}
            type="vehicle"
          />
        </motion.section>
      </main>
    </div>
  );
}

export default AdminDashboard;