import { auth } from "@/auth";
import connectDB from "@/lib/db";
import BankDetail from "@/models/BankDetail.model";
import User from "@/models/User.model";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const bankDetailSchema = z.object({
    accountHolder: z.string().min(1),
    accountNumber: z.string().min(1),
    mobileNumber: z.string().min(1),
    ifscCode: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/),
    upi: z.string().optional().or(z.literal("")),
});

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json(
                { message: "Unauthorized: Please log in first." },
                { status: 401 }
            );
        }

        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return NextResponse.json(
                { message: "User not found in the database." },
                { status: 404 }
            );
        }
        
        const body = await req.json();
        const rawData = {
            accountHolder: body.accountHolder,
            accountNumber: body.accountNumber,
            ifscCode: typeof body.ifscCode === "string" ? body.ifscCode.toUpperCase() : body.ifscCode,
            mobileNumber: body.mobileNumber,
            upi: typeof body.upi === "string" ? body.upi.toLowerCase() : body.upi,
        };

        const validation = bankDetailSchema.safeParse(rawData);
        if (!validation.success) {
            return NextResponse.json(
                { message: "Validation failed", errors: validation.error },
                { status: 400 }
            );
        }

        const { accountHolder, accountNumber, ifscCode, upi , mobileNumber} = validation.data;

        const updatePayload = {
            accountHolder,
            accountNumber,
            ifscCode,
            upi: upi || undefined,
            status: "added" as const,
        };

        const bankDetails = await BankDetail.findOneAndUpdate(
            { owner: user._id },
            { $set: updatePayload },
            { upsert: true, new: true }
        );

        user.steps = 3;
        user.partnerStatus = "pending"
        user.mobileNumber = mobileNumber;
        await user.save();

        return NextResponse.json(
            { message: "Bank details saved successfully.", bankDetails},
            { status: 200 }
        );

    } catch (error) {
        console.error("Bank Detail Saving Error:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        await connectDB();
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json(
                { message: "Unauthorized: Please log in first." },
                { status: 401 }
            );
        }

        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return NextResponse.json(
                { message: "User not found in the database." },
                { status: 404 }
            );
        }

        const bankDetails = await BankDetail.findOne({ owner: user._id });
        
        if (bankDetails) {
            return NextResponse.json(
            { message: "Bank details fetched successfully.", bankDetails , mobileNumber: user.mobileNumber},
            { status: 200 }
        );
        } else {
            return null;
        }

    } catch (error) {
        console.error("Bank Detail Fetching Error:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}