"use cleint";
import { motion } from "motion/react";
import {
  ArrowUpRight,
  Award,
  CheckCircle2,
  ChevronRight,
  HelpCircle,
  TrendingUp,
} from "lucide-react";
import Button from "../ui/Button";
import { statCardVariants } from "@/lib/animation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";

const StatusCards = () => {
  const { userData } = useSelector((state: RootState) => state.user);
  const isPending = userData && userData?.partnerStatus === "pending";
  const isRejected = userData && userData?.partnerStatus === "rejected";
  const router = useRouter();

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
        <div className="hidden">
          <div className="flex items-center justify-between mb-8">
            <span className="text-xs uppercase tracking-widest px-3 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-300">
              Current Block
            </span>
            <span className="flex items-center gap-1.5 text-xs text-amber-400 bg-amber-400/5 px-2.5 py-1 rounded-md border border-amber-400/10">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              Pending
            </span>
          </div>

          <h3 className="text-3xl font-bold tracking-tight text-white mb-4 max-w-md">
            Parnter under review 
          </h3>
          <p className="text-neutral-400 text-base leading-relaxed max-w-lg mb-6">
            Connect your account securely to process weekly payouts, fuel
            incentives, and performance-based ecosystem bonuses.
          </p>

          <div className="space-y-3 max-w-sm">
            <div className="flex items-center gap-3 text-sm text-neutral-300">
              <div className="w-1.5 h-1.5 bg-neutral-500 rounded-full" />
              <span>Instant deposits configuration ready</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-neutral-300">
              <div className="w-1.5 h-1.5 bg-neutral-500 rounded-full" />
              <span>Encrypted with bank-grade AES-256 protocols</span>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between hidden">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-white text-black flex items-center justify-center font-bold">
              3
            </div>
            <div>
              <p className="text-xs text-neutral-400">NEXT ACTION</p>
              <p className="text-sm font-semibold text-white">
                Bank Authentication
              </p>
            </div>
          </div>
          <Button
            rightIcon={<ArrowUpRight className="w-4 h-4" />}
            className="bg-white hover:bg-neutral-100 text-black text-xs flex items-center gap-2 shadow-lg transition-colors duration-200"
          >
            Initiate Now
          </Button>
        </div>
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
      <motion.div
        custom={2}
        variants={statCardVariants}
        initial="hidden"
        animate="visible"
        className="bg-[#121212] border border-white/6 rounded-3xl p-6 flex flex-col justify-between"
      >
        <div>
          <p className="text-xs text-primary/60 uppercase tracking-wider mb-3">
            Verification Logs
          </p>
          <h4
            className={`text-base font-medium mb-4 ${
              isRejected ? "text-rose-400" : ""
            }`}
          >
            {isRejected ? "Partner Rejected" : "Review Status"}
          </h4>
          {isRejected ? (
            <div className="flex items-center flex-col gap-10 justify-between p-2 rounded-lg bg-white/2 border border-white/3">
              <span className="text-rose-500 text-md">Rejection Reason</span>
              <span className="text-xs text-rose-500 ">{userData?.rejectionReason}</span>
            </div>
          ) : (
            <div className="flex items-center flex-col gap-10 justify-between p-2 rounded-lg bg-white/2 border border-white/3">
              <span className="text-primary text-md"><CheckCircle2 /></span>
              <span className="text-xs text-primary/60">Partner under onboarding......</span>
            </div>
          )}
          
        </div>
        {isRejected ? (
          <Button onClick={() => router.push('/partner/onboarding/vehicle')} rightIcon={<ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform"/>} className="bg-background hover:bg-background text-xs text-black border border-white/8 transition-all group">Check & Update</Button>
        ) : (
          <div className="text-xs text-primary/60 mt-4">
            Recheck your submitted payloads.
          </div>
        )}
      </motion.div>

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