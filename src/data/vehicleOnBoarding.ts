import { Bike, Car, LucideIcon, Package, Truck, Zap, User, CreditCard, Landmark, Smartphone } from "lucide-react";

interface VehicleOption {
  id: string;
  label: string;
  icon: LucideIcon;
  description: string;
}

type DocKey = "aadhar" | "rc" | "license";

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
    icon: CreditCard,
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