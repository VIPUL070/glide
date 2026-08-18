import { 
  Bike, 
  Car, 
  Zap, 
  Truck, 
  Package,
  LucideIcon, 
} from "lucide-react";

export type VehicleType = "bike" | "car" | "loading" | "ev" | "truck";

export interface VehicleOption {
  id: VehicleType;
  name: string;
  tagline: string;
  capacity: string;
  eta: string;
  icon: LucideIcon;
  popular?: boolean;
}

export interface Suggestions {
  id: string;
  name: string;
  city?: string;
  state?:string;
  country?: string;
  countrycode?: string;
  lat: number;
  lng: number
}

export const VEHICLE_OPTIONS: VehicleOption[] = [
  { id: "bike", name: "Moto Fast", tagline: "Zip through traffic alone", capacity: "1 Pax", eta: "2 mins",  icon: Bike},
  { id: "car", name: "Uber Premium", tagline: "High-end everyday rides", capacity: "4 Pax", eta: "4 mins", icon: Car, popular: true },
  { id: "ev", name: "Eco EV", tagline: "Sustainable luxury mobility", capacity: "4 Pax", eta: "5 mins", icon: Zap },
  { id: "loading", name: "Courier Lite", tagline: "Instant package delivery", capacity: "Max 20kg", eta: "7 mins",  icon: Package },
  { id: "truck", name: "Heavy Truck", tagline: "Large scale heavy transit", capacity: "Max 2 Tons", eta: "15 mins", icon: Truck },
];

export type BookingStatus =
  | "idle"
  | "requested"
  | "awaiting_payment"
  | "confirmed"
  | "started"
  | "completed"
  | "cancelled"
  | "rejected"
  | "expired";

export type PaymentStatus = "pending" | "paid" | "cash" | "failed";

export interface GeoLocation {
  type: "Point";
  coordinates: [number, number]; 
}

export interface IBookingResponse {
  _id: string;
  user: string ;
  driver: string;
  vehicle: string ;
  pickupAddress: string;
  dropoffAddress: string;
  pickUpLocation: GeoLocation;
  dropoffLocation: GeoLocation;
  fare: number;
  userMobile: string;
  driverMobile: string;
  bookingStatus: BookingStatus;
  paymentStatus: PaymentStatus;
  paymentDeadline?: string;
  adminCommission: number;
  partnerAmount: number;
  pickupOtp?: string;
  pickupOtpExpires?: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}