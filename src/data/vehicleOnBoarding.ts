import { Bike, Car, LucideIcon, Package, Truck, Zap } from "lucide-react";

interface VehicleOption {
  id: string;
  label: string;
  icon: LucideIcon;
  description: string;
}

export const VEHICLE_OPTIONS: VehicleOption[] = [
  { id: "bike", label: "Bike", icon: Bike, description: "Swift city rides" },
  { id: "car", label: "Car", icon: Car, description: "Premium sedan fleet" },
  { id: "ev", label: "EV", icon: Zap, description: "Eco-friendly transit" },
  { id: "loading", label: "Loading", icon: Package, description: "Cargo logistics" },
  { id: "truck", label: "Truck", icon: Truck, description: "Heavy-duty hauling" },
];