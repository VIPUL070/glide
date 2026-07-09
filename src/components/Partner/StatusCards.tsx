"use cleint";
import { motion } from "motion/react";
import {
  Award,
  ChevronRight,
  HelpCircle,
  TrendingUp,
} from "lucide-react";
import Button from "../ui/Button";
import { statCardVariants } from "@/lib/animation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import ActiveStatusCard from "./ActiveStatusCard";
import VerificationLogsCard from "./VerificationLogsCard";

const StatusCards = ({onOpen}: {onOpen:() => void}) => {
  const { userData } = useSelector((state: RootState) => state.user);

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 text-primary">
      <motion.div
        custom={0}
        variants={statCardVariants}
        initial="hidden"
        animate="visible"
        className="md:col-span-2 lg:row-span-2 bg-linear-to-br from-[#141414] to-[#0D0D0D] border border-white/8 rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden group shadow-xl"
      >
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-white/1 rounded-full blur-3xl group-hover:bg-white/3 transition-all duration-700" />

        {/* STATUS CARD  */}
        <ActiveStatusCard
          userData={{
            steps: userData?.steps,
            videoKycStatus: userData?.videoKycStatus,
            videoKycRoomId: userData?.videoKycRoomId,
          }}
        />
      </motion.div>

      <motion.div
        custom={1}
        variants={statCardVariants}
        initial="hidden"
        animate="visible"
        className="bg-[#121212] border border-white/6 rounded-3xl p-6 flex flex-col justify-between group relative overflow-hidden"
      >
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs text-primary/60 uppercase tracking-wider">
              Projected Yield
            </p>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <h4 className="text-sm text-primary/60">Regional Premium Tier</h4>
          <p className="text-4xl font-semibold tracking-tightmt-1">
            ₹45,000
            <span className="text-lg text-neutral-500 font-normal">/wk</span>
          </p>
          <div className="mt-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-3">
            <p className="text-xs text-emerald-400 leading-snug">
              High demand window active in your registered zone. Complete
              registration to lock maximum priority match rates.
            </p>
          </div>
        </div>
        <div className="text-xs text-primary/60 flex items-center justify-between mt-4 pt-4 border-t border-white/4">
          <span>Based on typical fleet cycles</span>
          <HelpCircle className="w-3.5 h-3.5 hover:text-primary cursor-pointer" />
        </div>
      </motion.div>

      {/* REJECTION CARD  */}
      <VerificationLogsCard userData={userData} onOpen={onOpen} />

      <motion.div
        custom={3}
        variants={statCardVariants}
        initial="hidden"
        animate="visible"
        className="md:col-span-2 lg:col-span-1 bg-[#121212] border border-white/6 rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden"
      >
        <div>
          <div className="flex items-center gap-2 text-primary/60 text-xs uppercase tracking-wider mb-4">
            <Award className="w-3.5 h-3.5 text-blue-400" />
            <span>Tier Rewards</span>
          </div>
          <h4 className="text-lg font-medium mb-2">Ecosystem Perks</h4>
          <p className="text-xs text-primary/70 mb-4">
            Unlocking automatically at Step 8 Activation:
          </p>

          <ul className="space-y-3">
            <li className="flex items-start gap-2.5 text-xs text-primary/60">
              <div className="h-1.5 w-1.5 rounded-full bg-blue-400 mt-1.5" />
              <div>
                <span className="font-medium">10% Fuel Surcharge</span>
                <p className="text-primary/60">
                  Applicable across all network fuel partners.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-2.5 text-xs text-neutral-300">
              <div className="h-1.5 w-1.5 rounded-full bg-blue-400 mt-1.5" />
              <div>
                <span className="text-primary font-medium">
                  24/7 Dedicated Dispatch Line
                </span>
                <p className="text-primary/60">
                  Direct bypass to senior support engineers.
                </p>
              </div>
            </li>
          </ul>
        </div>
        <div className="mt-6 pt-4 border-t border-white/4 text-xs text-primary/60">
          Perks structural rules apply standard terms.
        </div>
      </motion.div>

      <motion.div
        custom={4}
        variants={statCardVariants}
        initial="hidden"
        animate="visible"
        className="bg-[#121212] border border-white/6 rounded-3xl p-6 flex flex-col justify-between group"
      >
        <div>
          <p className="text-xs text-primary/70 uppercase tracking-wider mb-4">
            Support Engine
          </p>
          <h4 className="text-base font-medium  mb-1">
            Need help with setups?
          </h4>
          <p className="text-xs text-primary/60 leading-relaxed">
            Connect with an onboarding expert to assist with document
            formatting, bank validations, or compliance structures.
          </p>
        </div>

        <div className="mt-6">
          <Button
            rightIcon={
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            }
            className=" bg-background hover:bg-background text-xs text-black border border-white/8 transition-all group"
          >
            Open Support Terminal
          </Button>
        </div>
      </motion.div>
    </section>
  );
};

export default StatusCards;
