import mongoose, { Schema, Document } from "mongoose";

export interface IBankDetail extends Document {
    owner: mongoose.Types.ObjectId;
    accountHolder: string;
    accountNumber: string;
    ifscCode: string;
    upi?: string;
    status: "not_added" | "added" | "verified";
    createdAt: Date;
    updatedAt: Date;
}

const bankDetailSchema = new Schema<IBankDetail>(
    {
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },
        accountHolder: {
            type: String,
            required: true,
        },
        accountNumber: {
            type: String,
            required: true,
        },
        ifscCode: {
            type: String,
            required: true,
            uppercase: true,
        },
        upi: {
            type: String,
            lowercase: true,
        },
        status: {
            type: String,
            enum: ["not_added", "added", "verified"],
            default: "not_added",
        },
    },
    {
        timestamps: true
    }
);

const BankDetail = mongoose.models.BankDetail || mongoose.model<IBankDetail>("BankDetail", bankDetailSchema);
export default BankDetail;