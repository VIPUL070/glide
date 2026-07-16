import { BatteryCharging, Eye, Gauge, Layers, ShieldCheck, Zap } from "lucide-react";

interface VehicleStat {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface VehicleCategory {
  id: string;
  category: string;
  name: string;
  description: string;
  image: string;
  stats: VehicleStat[];
}

export const NAV_ITEMS = ["Home", "Bookings", "About Us", "Contact"]

export const FOOTER_LINKS = [
  { name: "Privacy policy", href: "/privacy-policy" },
  { name: "Refund policy", href: "/refund-policy" },
  { name: "Terms of service", href: "/terms-of-service" },
  { name: "Contact information", href: "/contact" },
];

export const VEHICLE_DATA: VehicleCategory[] = [
  {
    id: "v0",
    category: "ALL VEHICLES",
    name: "The Glide Fleet",
    description: "Explore our entire premium fleet of micro-mobility, intelligent sedans, and robust utility vehicles.",
    image: "/slide-1.webp",
    stats: [
      { label: "Available Fleets", value: "4 Classes", icon: Layers },
      { label: "Network Coverage", value: "Global", icon: ShieldCheck },
      { label: "Avg. Charging", value: "30 Mins", icon: BatteryCharging },
      { label: "System Status", value: "Optimal", icon: Eye },
    ],
  },
  {
    id: "v1",
    category: "BIKE",
    name: "Glide Pulse",
    description: "An ultra-nimble electric motorcycle engineered for rapid city splitting and high-torque lane navigation.",
    image: "/slide-2.webp",
    stats: [
      { label: "Top Velocity", value: "160 km/h", icon: Gauge },
      { label: "Pure Range", value: "210 km", icon: BatteryCharging },
      { label: "0-100 km/h", value: "3.5s", icon: Zap },
      { label: "Rider Assist", value: "Cornering ABS", icon: ShieldCheck },
    ],
  },
  {
    id: "v2",
    category: "URBAN SEDAN",
    name: "Glide Volt",
    description: "A highly efficient, smooth electric sedan optimized for everyday commuting and tight city spaces.",
    image: "/slide-3.webp",
    stats: [
      { label: "Top Velocity", value: "180 km/h", icon: Gauge },
      { label: "Pure Range", value: "480 km", icon: BatteryCharging },
      { label: "0-100 km/h", value: "6.2s", icon: Zap },
      { label: "Autopilot", value: "Standard", icon: ShieldCheck },
    ],
  },
  {
    id: "v3",
    category: "PREMIUM SUV",
    name: "Glide Terra",
    description: "A robust all-wheel-drive utility vehicle offering expansive luggage space and all-weather road stability.",
    image: "/slide-4.webp",
    stats: [
      { label: "Top Velocity", value: "210 km/h", icon: Gauge },
      { label: "Pure Range", value: "540 km", icon: BatteryCharging },
      { label: "0-100 km/h", value: "4.8s", icon: Zap },
      { label: "Traction Control", value: "Dual-Motor AWD", icon: ShieldCheck },
    ],
  },
  {
    id: "v4",
    category: "AUTONOMOUS EV",
    name: "Glide Pilot-S",
    description: "A premium flagship electric sedan featuring full-self driving artificial intelligence and theater configurations.",
    image: "/slide-5.webp",
    stats: [
      { label: "Top Velocity", value: "250 km/h", icon: Gauge },
      { label: "Pure Range", value: "650 km", icon: BatteryCharging },
      { label: "0-100 km/h", value: "2.4s", icon: Zap },
      { label: "Self-Driving", value: "Level 5 AI", icon: ShieldCheck },
    ],
  },
];