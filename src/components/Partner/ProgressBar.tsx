"use client";
import { Step, STEPS } from "@/data/vehicleOnBoarding";
import { itemVariants, onboardingContainerVariants } from "@/lib/animation";
import { RootState } from "@/redux/store";
import { Building2, Car, Check, CircleDollarSign, Eye, FileText, Lock, ShieldCheck, Sparkles, Video } from "lucide-react";
import { motion} from "motion/react";
import { useRouter } from "next/navigation";
import React from "react";
import { useSelector } from "react-redux";

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

const ProgressBar = ({handleOpen}: {handleOpen : () => void}) => {
  const { userData } = useSelector((state: RootState) => state.user);
  const reason = userData && userData.videoKycStatus === "approved"
  const activeStep =  reason ? userData.steps! + 1 : 0;
  const router = useRouter();

  const getStepStatus = (id: number) => {
    if (id < activeStep) return "completed";
    if (id === activeStep) return "active";
    return "locked";
  };

  const gotoStep = (step: Step) => {
    if(step.id === 6 && userData?.videoKycStatus === "approved"){
      handleOpen();
    }

    if (step.route && step.id <= activeStep) {
      router.push(step.route);
    }
  };

  return (
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
                  <span className="text-sm p-0.5 sm:px-1.5 sm:py-0.5 rounded bg-background/10 text-primary font-semibold border border-background/10">
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
              <p className="text-[12px] text-neutral-500 mt-0.5">
                {status === "completed"
                  ? "Verified"
                  : status === "active"
                  ? "Action Required"
                  : "Locked"}
              </p>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default ProgressBar;