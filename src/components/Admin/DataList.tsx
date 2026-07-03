import { ArrowUpRight, CheckCircle2, User } from "lucide-react";
import { ReviewData } from "@/data/adminDashboard";
import { itemVariants } from "@/lib/animation";
import {motion} from "motion/react";
import Button from "../ui/Button";
import { useRouter } from "next/navigation";

interface DataListProps {
  data: ReviewData[];
  type: "partner" | "kyc" | "vehicle";
}

const DataList = ({ data, type }: DataListProps) => {
  const router = useRouter();

  const isKyc = type === "kyc";
  const actionLabel = isKyc ? "KYC" : "Review";

  const getInitials = (name: string) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col gap-1 items-center justify-center py-8 text-center h-full min-h-37.5">
        <p className="text-green-400 font-light pb-1"><CheckCircle2 /></p>
        <p className="text-xs text-primary font-medium tracking-tight">All caught up</p>
        <p className="text-[11px] text-primary/50 mt-0.5">No pending items require attention</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col justify-between overflow-hidden mt-2">

      <div className="space-y-2 max-h-43.75 overflow-y-auto pr-1 scrollbar-none">
        {data.slice(0, 3).map((item, index) => (
          <motion.div
            key={item._id || index}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="group flex items-center justify-between gap-4 p-3 rounded-xl bg-black text-primary border border-neutral-200/10 hover:border-neutral-200/20 transition-all duration-300 ease-out cursor-pointer"
          >

            <div className="flex items-center gap-3 min-w-0">

              <div className="shrink-0 w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center border border-neutral-200/30 text-secondary font-semibold text-[14px] tracking-wider shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]">
                {getInitials(item.name) || <User className="w-3.5 h-3.5 text-secondary/60" />}
              </div>

              <div className="min-w-0 flex flex-col">
                <span className="text-xs font-medium text-primary truncate uppercase tracking-tight">
                  {item.name}
                </span>
                <span className="text-[11px] text-primary/60 truncate max-w-30 sm:max-w-50 md:max-w-60 lg:max-w-26.25 xl:max-w-40">
                  {item.email}
                </span>
              </div>
            </div>

            <Button
              size="sm"
              onClick={type === "partner" ? () => router.push(`/admin/reviews/partner/${item._id}`) : () => router.push(`/admin/reviews/vehicle/${item._id}`) }
              className="bg-background hover:bg-neutral-100 text-black py-1 text-[12px] font-medium tracking-tight"
            >
              <span>{actionLabel}</span>
              <ArrowUpRight className="w-4 h-4 text-black group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200 ease-out" />
            </Button>
          </motion.div>
        ))}
      </div>

      {data.length > 3 && (
        <div className="pt-2 text-right border-t border-neutral-100/10 mt-2">
          <span className="text-[10px] font-medium text-primary/40 tracking-tight">
            + {data.length - 3} more items in queue
          </span>
        </div>
      )}
    </div>
  );
};

export default DataList;