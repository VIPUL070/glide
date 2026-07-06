import { Bike, Car, LucideIcon, Package, Truck, Zap, User, Landmark, Smartphone } from "lucide-react";

export type DocKey = "aadhar" | "rc" | "license";

export type Step = {
  id: number;
  title: string;
  route?: string;
};

interface VehicleOption {
  id: string;
  label: string;
  icon: LucideIcon;
  description: string;
}

interface DocumentTypeItem {
  key: DocKey; 
  title: string;
  description: string;
}

export interface FormFieldItem {
  id: string;
  stateKey: "holderName" | "accountNumber" | "ifscCode" | "mobileNumber" | "upiId";
  label: string;
  type: string;
  placeholder: string;
  icon?: LucideIcon;
  isOptional?: boolean;
  className: string;
}

export const VEHICLE_OPTIONS: VehicleOption[] = [
  { id: "bike", label: "Bike", icon: Bike, description: "Swift city rides" },
  { id: "car", label: "Car", icon: Car, description: "Premium sedan fleet" },
  { id: "ev", label: "EV", icon: Zap, description: "Eco-friendly transit" },
  { id: "loading", label: "Loading", icon: Package, description: "Cargo logistics" },
  { id: "truck", label: "Truck", icon: Truck, description: "Heavy-duty hauling" },
];

export const DOCUMENT_TYPES: DocumentTypeItem[] = [
  {
    key: "aadhar",
    title: "Aadhaar / ID Proof",
    description: "Government-issued primary tracking identification framework document.",
  },
  {
    key: "rc",
    title: "Vehicle RC (Registration Certificate)",
    description: "Official registration certificate validating transport property compliance.",
  },
  {
    key: "license",
    title: "Driving License",
    description: "Valid government authorization ledger mapping operator permissions.",
  }]

export const BANK_FORM_FIELDS: FormFieldItem[] = [
  {
    id: "holder-name",
    stateKey: "holderName",
    label: "Bank Account Holder Name",
    type: "text",
    placeholder: "e.g., Jane Doe",
    icon: User,
    className: "sm:col-span-2 relative",
  },
  {
    id: "account-number",
    stateKey: "accountNumber",
    label: "Account Number",
    type: "password",
    placeholder: "e.g., 001234567890",
    className: "relative",
  },
  {
    id: "ifsc-code",
    stateKey: "ifscCode",
    label: "IFSC Code",
    type: "text",
    placeholder: "e.g., SBIN0001234",
    icon: Landmark,
    className: "relative",
  },
  {
    id: "mobile-number",
    stateKey: "mobileNumber",
    label: "Linked Mobile Number",
    type: "tel",
    placeholder: "e.g., +91 98765 43210",
    icon: Smartphone,
    className: "relative",
  },
  {
    id: "upi-id",
    stateKey: "upiId",
    label: "UPI ID",
    type: "text",
    placeholder: "e.g., username@bank",
    isOptional: true,
    className: "relative",
  },
];

export const STEPS: Step[] = [
  { id: 1, title: "Vehicle", route: "/partner/onboarding/vehicle" },
  { id: 2, title: "Document", route: "/partner/onboarding/document" },
  { id: 3, title: "Bank", route: "/partner/onboarding/bank" },
  { id: 4, title: "Review"},
  { id: 5, title: "Video KYC" },
  { id: 6, title: "Pricing" },
  { id: 7, title: "Final Review" },
  { id: 8, title: "Live" },
];

export interface CardContent {
  badge: string;
  heading: string;
  description: string;
  features: string[];
  nextStepNumber: number;
  nextStepTitle: string;
  route?:string;
}

export const STEP_CARD_CONTENT: Record<number, CardContent> = {
  0: {
    badge: "Vehicle Details",
    heading: "Add Your Vehicle",
    description: "Provide your vehicle details and registration information to get started on the platform.",
    features: [
      "RC & Insurance validation ready",
      "Supports multiple vehicle categories"
    ],
    nextStepNumber: 2,
    nextStepTitle: "Document Upload",
    route: "/partner/onboarding/vehicle"
  },
  1: {
    badge: "Document Upload",
    heading: "Verify Your Identity",
    description: "Upload your driver's license, Aadhar, and RC for secure background verification.",
    features: [
      "Secure data encryption checks",
      "Automated compliance parsing"
    ],
    nextStepNumber: 3,
    nextStepTitle: "Bank Authentication",
    route: "/partner/onboarding/document"
  },
  2: {
    badge: "Bank Details",
    heading: "Verify Your Bank Details",
    description: "Connect your account securely to process weekly payouts, fuel incentives, and performance-based ecosystem bonuses.",
    features: [
      "Instant deposits configuration ready",
      "Encrypted with bank-grade AES-256 protocols"
    ],
    nextStepNumber: 4,
    nextStepTitle: "Profile Review",
    route: "/partner/onboarding/bank"
  },
  3: {
    badge: "Profile Review",
    heading: "Application Processing",
    description: "Our operations team is verifying your submitted vehicle details and identity structures.",
    features: [
      "Real-time audit queue placement",
      "Support desk alert monitoring"
    ],
    nextStepNumber: 5,
    nextStepTitle: "Video KYC"
  },
  4: {
    badge: "KYC Completed",
    heading: "KYC Verification Finished",
    description: "Your live check and digital identity requirements are now fully processed and valid.",
    features: [
      "Verified user criteria passed",
      "Credentials securely locked"
    ],
    nextStepNumber: 6,
    nextStepTitle: "Pricing Setup"
  },
  5: {
    badge: "Pricing Configuration",
    heading: "Ecosystem Pricing",
    description: "Review and evaluate your dynamic payout scales, operational bonuses, and milestone structures.",
    features: [
      "Transparent tier configuration",
      "Performance incentives calculated"
    ],
    nextStepNumber: 7,
    nextStepTitle: "Final Review"
  },
  6: {
    badge: "Final Audit",
    heading: "Concluding Compliance Check",
    description: "Your complete ecosystem profile is currently undergoing the final verification protocol.",
    features: [
      "Contract configurations preparing",
      "Compliance audit in final run"
    ],
    nextStepNumber: 8,
    nextStepTitle: "Take Account Live"
  },
  7: {
    badge: "Live Status",
    heading: "Welcome Aboard Partner!",
    description: "Your partner profile is fully activated. You are now officially integrated into the platform network.",
    features: [
      "Live request matching unlocked",
      "Ecosystem wallet operational"
    ],
    nextStepNumber: 8,
    nextStepTitle: "Open Dashboard"
  }
};