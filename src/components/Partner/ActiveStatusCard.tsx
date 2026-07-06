"use client";
import { CardContent, STEP_CARD_CONTENT, STEPS } from "@/data/vehicleOnBoarding";
import Button from "../ui/Button";
import { ArrowUpRight } from "lucide-react";
import { VideoKycStatus } from "@/models/User.model";
import { useRouter } from "next/navigation";

interface UserData {
  steps?: number;
  videoKycStatus?: VideoKycStatus;
  videoKycRoomId?: string;
}

function ActiveStatusCard({ userData }: { userData: UserData }) {
  const currentStepId = userData?.steps || 0;
  const isVideoKycInProgress = userData?.videoKycStatus === "in_progress";
  const isVideoKycPending = userData?.steps === 4 && userData?.videoKycStatus === "pending";
  const stepMeta = STEPS.find((s) => s.id === currentStepId);
  const router = useRouter();

  const gotoStep = (content: CardContent) => {
    if(content.route){
        router.push(content.route)
    }
  }

  const defaultContent = {
    badge: stepMeta?.title || "",
    heading: `${stepMeta?.title || "Partner"} Setup`,
    description:
      "Complete your configuration requirements to take your profile live.",
    features: [
      "Configuration parameters ready",
      "Encrypted with bank-grade protocols",
    ],
    nextStepNumber: currentStepId,
    nextStepTitle: "Next Setup Phase",
  };

  const content = isVideoKycInProgress
  ? {
      badge: "In Progress KYC",
      heading: "Video KYC Verification",
      description: "Your live video verification is currently being processed by our compliance agents.",
      features: [
        "Keep original documents handy",
        "Ensure clear lighting conditions",
      ],
      nextStepNumber: 5,
      nextStepTitle: "Video KYC Verification",
      route: `/video-kyc/${userData?.videoKycRoomId}`
    }
  : isVideoKycPending
  ? {
      badge: "Pending KYC",
      heading: "Video KYC Initiating",
      description: "Your live video verification is currently being initiated by the admin.",
      features: [
        "Keep original documents handy",
        "Ensure clear lighting conditions",
      ],
      nextStepNumber: 6,
      nextStepTitle: "Pricing Setup",
    }
  : STEP_CARD_CONTENT[currentStepId] || defaultContent;

  return (
    <>
      <div className="">
        <div className="flex items-center justify-between mb-8">
          <span className="text-xs uppercase tracking-widest px-3 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-300">
            Current Block
          </span>
          <span
            className={`flex items-center gap-1.5 text-xs ${
              isVideoKycInProgress
                ? "bg-emerald-400/5 text-emerald-400"
                : "bg-amber-400/5 text-amber-400 "
            } px-2.5 py-1 rounded-md border border-amber-400/10"`}
          >
            <span
              className={`"w-1.5 h-1.5 rounded-full ${
                isVideoKycInProgress ? "bg-emerald-400" : "bg-amber-400"
              }  animate-pulse" `}
            />
            {content.badge}
          </span>
        </div>

        <h3 className="text-3xl font-bold tracking-tight text-white mb-4 max-w-md">
          {content.heading}
        </h3>
        <p className="text-neutral-400 text-base leading-relaxed max-w-lg mb-6">
          {content.description}
        </p>

        <div className="space-y-3 max-w-sm">
          <div className="flex items-center gap-3 text-sm text-neutral-300">
            <div className="w-1.5 h-1.5 bg-neutral-500 rounded-full" />
            <span>{content.features[0] || ""}</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-neutral-300">
            <div className="w-1.5 h-1.5 bg-neutral-500 rounded-full" />
            <span>{content.features[1] || ""}</span>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-white text-black flex items-center justify-center font-bold">
            {content.nextStepNumber}
          </div>
          <div>
            <p className="text-xs text-neutral-400">NEXT ACTION</p>
            <p className="text-sm font-semibold text-white">
              {content.nextStepTitle}
            </p>
          </div>
        </div>
        {userData.steps === 3 || isVideoKycPending ? (
          <></>
        ) : (
          <Button
            onClick={() => gotoStep(content)}
            rightIcon={<ArrowUpRight className="w-4 h-4" />}
            className="bg-white hover:bg-neutral-100 text-black text-xs flex items-center gap-2 shadow-lg transition-colors duration-200"
          >
            {isVideoKycInProgress ? "Join Now" : "Initiate Now"}
          </Button>
        )}
      </div>
    </>
  );
}

export default ActiveStatusCard;