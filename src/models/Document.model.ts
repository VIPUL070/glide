import mongoose from "mongoose";

export interface IDocument{
    owner: mongoose.Types.ObjectId;
    aadharUrl: string;
    rcUrl: string;
    licenseUrl: string;
    status: "approved" | "pending" | "rejected";
    rejectionReason?: string;
    createdAt: Date;
    updatedAt: Date;
}

const documentSchema = new mongoose.Schema<IDocument>({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    aadharUrl: {
        type: String,
        required: true,
        trim: true,
    },
    rcUrl: {
        type: String,
        required: true,
    },
    licenseUrl: {
        type: String,
        required: true,
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
    }
}, { timestamps: true })

const Document = mongoose.models.Document || mongoose.model("Document", documentSchema);
export default Document;