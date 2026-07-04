export interface DashboardStats {
  totalPartners: number;
  approvedPartners: number;
  pendingPartners: number;
  rejectedPartners: number;
}

export interface ReviewData {
  name:string;
  email:string;
  _id:string;
  type?:string;
  videoKycStatus?: string;
}