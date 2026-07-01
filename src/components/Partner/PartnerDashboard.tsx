"use client";
import React from "react";
import { motion } from "motion/react";
import {
  Check,
  Lock,
  Car,
  FileText,
  Building2,
  Eye,
  Video,
  CircleDollarSign,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Step, STEPS } from "@/data/vehicleOnBoarding";
import { itemVariants, onboardingContainerVariants } from "@/lib/animation";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

const stepIcons: Record<
  number,
  React.ComponentType<React.ComponentProps<"svg">>
> = {
  1: Car,
  2: FileText,
  3: Building2,
  4: Eye,
  5: Video,
  6: CircleDollarSign,
  7: ShieldCheck,
  8: Sparkles,
};

function PartnerDashboard() {
  const { userData } = useSelector((state: RootState) => state.user);
  const activeStep = userData ? userData.steps! + 1 : 0;
  const router = useRouter();

  const getStepStatus = (id: number) => {
    if (id < activeStep) return "completed";
    if (id === activeStep) return "active";
    return "locked";
  };

  const gotoStep = (step: Step) => {
    if (step.route && step.id <= activeStep) {
      router.push(step.route);
    }
  };

  return (
    <div className="relative pt-[9vh] px-[2vw] min-h-dvh bg-foreground text-primary selection:bg-background/20 selection:text-primary antialiased overflow-x-hidden">
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

            <motion.div
              variants={onboardingContainerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3"
            >
              {STEPS.map((step) => {
                const status = getStepStatus(step.id);
                const StepIcon = stepIcons[step.id] || Car;

                return (
                  <motion.div
                    key={step.id}
                    variants={itemVariants}
                    whileHover={status !== "locked" ? { scale: 1.04 } : {}}
                    onClick={() => gotoStep(step)}
                    className={`relative p-4 rounded-xl border flex flex-col justify-between transition-all duration-300 min-h-35.5 cursor-pointer group ${
                      status === "active"
                        ? "bg-background/4 border-background/30 shadow-[0_0_25px_rgba(255,255,255,0.05)]"
                        : status === "completed"
                        ? "bg-emerald-500/2 border-emerald-500/20"
                        : "bg-foreground/20 border-background/3 opacity-50 select-none"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div
                        className={`p-2 rounded-lg transition-colors ${
                          status === "active"
                            ? "bg-background text-secondary"
                            : status === "completed"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-background/3 text-neutral-500"
                        }`}
                      >
                        <StepIcon className="w-4.5 h-4.5" />
                      </div>

                      <div className="flex items-center justify-center">
                        {status === "completed" ? (
                          <div className="bg-emerald-500 rounded-full p-0.5 text-secondary">
                            <Check className="w-3 h-3 stroke-3" />
                          </div>
                        ) : status === "active" ? (
                          <span className="text-sm  px-1.5 py-0.5 rounded bg-background/10 text-primary font-semibold border border-background/10">
                            ID: 0{step.id}
                          </span>
                        ) : (
                          <Lock className="w-3 h-3 text-neutral-600" />
                        )}
                      </div>
                    </div>

                    <div>
                      <p
                        className={`text-sm font-medium tracking-tight truncate transition-colors ${
                          status === "active"
                            ? "text-primary"
                            : "text-neutral-400 group-hover:text-neutral-200"
                        }`}
                      >
                        {step.title}
                      </p>
                      <p className="text-[12px] text-neutral-500 font-mono mt-0.5">
                        {status === "completed"
                          ? "Verified"
                          : status === "active"
                          ? "Action Required"
                          : "Locked"}
                      </p>
                    </div>

                    {status === "active" && (
                      <motion.div
                        layoutId="activeGlowLine"
                        className="absolute bottom-[-5] left-0 right-0 h-0.5 bg-linear-to-r from-neutral-200 to-primary rounded-xl"
                      />
                    )}
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default PartnerDashboard;
