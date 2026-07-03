import { motion } from "motion/react";
import { LucideIcon } from "lucide-react";
import { itemVariants } from "@/lib/animation";

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  topBarColor: string;
  iconContainerClass: string;
  footerContent: React.ReactNode;
}

function AdminCards({
  title,
  value,
  icon: Icon,
  topBarColor,
  iconContainerClass,
  footerContent,
}: DashboardCardProps) {
  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -2 }}
      className="bg-foreground border border-neutral-200/30 rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col justify-between group cursor-pointer text-primary relative overflow-hidden"
    >
      <div className={`absolute top-0 left-0 right-0 h-0.75 ${topBarColor}`} />
      
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs uppercase tracking-wider">{title}</span>
        <div className={`p-2 rounded-xl ${iconContainerClass}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div>
        <p className="text-4xl font-bold tracking-tight">{value}</p>
        <div className="flex items-center gap-1.5 mt-2 text-xs">
          {footerContent}
        </div>
      </div>
    </motion.div>
  );
}

export default AdminCards;