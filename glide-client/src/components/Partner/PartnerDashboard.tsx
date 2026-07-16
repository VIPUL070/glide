"use client";
import { STEPS } from "@/data/vehicleOnBoarding";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import ProgressBar from "./ProgressBar";
import StatusCards from "./StatusCards";
import PricingModal from "./PricingModal";
import { useState } from "react";

function PartnerDashboard() {
  const { userData } = useSelector((state: RootState) => state.user);
  const activeStep = userData ? userData.steps! + 1 : 0;
  const [isOpen , setIsOpen] = useState<boolean>(false);

  return (
    <div className="relative pt-[9vh] px-[2vw] min-h-dvh bg-foreground text-primary selection:bg-background/20 selection:text-primary antialiased overflow-x-hidden">

      <PricingModal isOpen={isOpen} onClose={() => setIsOpen(false)} />

      <div className="absolute top-0 left-1/4 w-125 h-125 bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-40 right-1/4 w-150 h-150 bg-blue-500/5 rounded-full blur-[150px] pointer-events-none" />

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
                Application In Progress
              </p>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-primary font-display">
              Welcome back, Partner
            </h1>
          </div>
        </div>

        <section className="mb-12">
          <div className="bg-foregorund border border-background/6 rounded-2xl p-6 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-medium text-primary">
                  Onboarding Milestones
                </h2>
                <p className="text-md text-neutral-400">
                  Complete all checkpoints to unlock your production fleet.
                </p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-primary">
                  {Math.round(((activeStep - 1) / STEPS.length) * 100)}%
                </span>
                <span className="text-neutral-500 text-sm ml-1">done</span>
              </div>
            </div>

            <ProgressBar handleOpen={() => setIsOpen(true)}/>
          </div>
        </section>

        <StatusCards onOpen={() => setIsOpen(true)}/>
      </main>
    </div>
  );
}

export default PartnerDashboard;