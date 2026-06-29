import { FileText, Video, Car } from "lucide-react";
import { ComponentType } from "react";

export interface OperationCardData {
  id: string;
  title: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
}

export const OPERATIONS_DATA: OperationCardData[] = [
  {
    id: "partnerReview",
    title: "Partner Profile Reviews",
    description: "KYC & Document validation",
    icon: FileText,
  },
  {
    id: "kyc",
    title: "Pending Video KYC",
    description: "Live identity matching sessions",
    icon: Video,

  },
  {
    id: "vehicleReview",
    title: "Vehicle Review ",
    description: "Physical assets & insurance logs",
    icon: Car,
  }
];