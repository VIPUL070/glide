import { itemVariants } from "@/lib/animation";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import DataList from "./DataList";
import { ReviewData } from "@/data/adminDashboard";

interface OperationCardProps {
   title: string;
   description:string;
   icon: LucideIcon;
   data: Array<ReviewData>;
   type: "partner" | "kyc" | "vehicle";
}

function OperationCard({ title,description,icon,data ,type}: OperationCardProps) {
  const Icon = icon;

  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      className="bg-foreground text-primary border border-neutral-200/30 rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.01)] flex flex-col justify-between min-h-75"
    >
      <div>
        {/* Card Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100/30 mb-4">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-lg bg-neutral-100 text-secondary`}>
              <Icon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold">{title}</h3>
              <p className="text-[11px] text-primary/70">{description}</p>
            </div>
          </div>
          <div className="bg-background text-secondary p-1.5 w-8 h-8 rounded-lg flex justify-center items-center">
            <p className="text-[14px] font-medium ">{data.length}</p>
          </div>
        </div>
      </div>

      {/* here will be list of the data for the review with person initial  name and email and at right most side the arroww link button */}
      <DataList data={data} type={type} />
    </motion.div>
  );
}

export default OperationCard;