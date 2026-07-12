import mongoose, { Document } from "mongoose";

export type VideoKycStatus = "not_required" | "pending" | "in_progress" | "approved" | "rejected"

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: "user" | "partner" | "admin";
    isEmailVerified?: boolean;
    otp?: string;
    otpExpiry?: Date;
    mobileNumber?: string;
    steps?: number;
    partnerStatus?: "pending" | "approved" | "rejected";
    rejectionReason?: string;
    videoKycStatus?: VideoKycStatus;
    videoKycRoomId?: string;
    kycRejectionReason?: string;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUser>({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
    },
    role: {
        type: String,
        default: "user",
        enum: ["user", "partner", "admin"]
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    otp: {
        type: String,
    },
    otpExpiry: {
        type: Date
    },
    mobileNumber: {
        type: String
    },
    steps: {
        type: Number,
        min: 0,
        max: 8,
        default: 0,
    },
    partnerStatus: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    },
    rejectionReason: {
        type: String,
        trim: true,
        default: "",
    },
    videoKycStatus: {
        type: String,
        enum: ["not_required", "pending", "in_progress", "approved", "rejected"],
        default: "not_required"
    },
    videoKycRoomId: {
        type: String,
        default:null
    },
    kycRejectionReason: {
        type: String,
        trim: true,
        default: "",
    }
}, { timestamps: true })

const User = mongoose.models.User || mongoose.model("User", userSchema)
export default User;