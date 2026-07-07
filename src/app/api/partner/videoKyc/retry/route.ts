import { auth } from "@/auth";
import connectDB from "@/lib/db";
import User from "@/models/User.model";
import { NextResponse } from "next/server";

export async function PATCH() {
    try {
        const session = await auth();
        if (!session?.user?.email || session.user.role !== "partner") {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        await connectDB();

        const partner = await User.findOne({ email: session.user.email });
        if (!partner) {
            return NextResponse.json(
                { message: "Partner profile not found" },
                { status: 404 }
            );
        }

        if (partner.videoKycStatus !== "rejected") {
            return NextResponse.json(
                { message: "KYC retry is only allowed for rejected applications" },
                { status: 400 }
            );
        }

        partner.videoKycStatus = "pending";
        partner.kycRejectionReason="";
        partner.steps = 4;
        partner.roomId = "";
        await partner.save();

        return NextResponse.json(
            { message: "Partner KYC retry executed successfully" },
            { status: 200 }
        );

    } catch (error) {
        console.error("KYC Retry Error:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}