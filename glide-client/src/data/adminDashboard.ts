export interface DashboardStats {
  totalPartners: number;
  approvedPartners: number;
  pendingPartners: number;
  rejectedPartners: number;
}

export type Owner = {
  name:string;
  email:string;
  _id:string;
}

export interface ReviewData {
  name:string;
  email:string;
  _id:string;
  type?:string;
  videoKycStatus?: string;
  videoKycRoomId?: string;
  owner?: Owner | null;
}