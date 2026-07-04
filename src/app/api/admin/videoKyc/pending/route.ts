import { auth } from "@/auth";
import connectDB from "@/lib/db";
import User from "@/models/User.model";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectDB();
        const session = await auth();
        if (!session || !session.user?.email || session.user.role !== "admin") {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const partners = await User.find({
            role: "partner",
            videoKycStatus: { $in: ["pending", "in_progress"] }
        }).select("name email _id videoKycStatus");

        if (partners.length === 0) {
            return NextResponse.json(
                { message: "No partners found with pending or in-progress KYC status", },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                message: "Partners fetched successfully",
                partners
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("Video KYC status fetching error:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}