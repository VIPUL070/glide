import mongoose, { Document } from "mongoose";

type vehicleType = "bike" | "car" | "loading" | "ev" | "truck";

export interface IVehicle extends Document {
    owner: mongoose.Types.ObjectId;
    type: vehicleType;
    vehicleModel: string;
    number: string;
    imageUrl?: string;
    baseFare?: number;
    pricePerKM?: number;
    waitingCharge?: number;
    status: "approved" | "pending" | "rejected";
    rejectionReason?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const vehicleSchema = new mongoose.Schema<IVehicle>(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true
        },
        type: {
            type: String,
            enum:["bike", "car", "loading", "ev", "truck"],
            required: true,
        },
        vehicleModel: {
            type: String,
            required: true,
        },
        number: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
        },
        imageUrl: {
            type: String,
            default: "",
        },
        baseFare: {
            type: Number,
            min: 0,
            default: 0,
        },
        pricePerKM: {
            type: Number,
            min: 0,
        },
        waitingCharge: {
            type: Number,
            min: 0,
            default: 0,
        },
        status: {
            type: String,
            enum: ["approved", "pending", "rejected"],
            default: "pending",
        },
        rejectionReason: {
            type: String,
            trim: true,
            default: "",
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {timestamps: true}
);

const Vehicle = mongoose.models.Vehicle || mongoose.model("Vehicle", vehicleSchema);
export default Vehicle;