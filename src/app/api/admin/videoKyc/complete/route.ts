import { auth } from "@/auth";
import connectDB from "@/lib/db";
import User from "@/models/User.model";
import { NextRequest, NextResponse } from "next/server";


export async function PATCH(req: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.email || session.user.role !== "admin") {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        await connectDB();
        const { roomId, action, reason } = await req.json();

        if (!roomId) {
            return NextResponse.json(
                { message: "roomId is required" },
                { status: 400 }
            );
        }

        if (!["approved", "rejected"].includes(action)) {
            return NextResponse.json(
                { message: "Invalid Action. Must be 'approved' or 'rejected'" },
                { status: 400 } 
            );
        }

        if (action === "rejected" && !reason?.trim()) {
            return NextResponse.json(
                { message: "Rejection reason is required" },
                { status: 400 }
            );
        }

        const partner = await User.findOne({
            videoKycRoomId: roomId,
            role: "partner",
        });

        if (!partner) {
            return NextResponse.json(
                { message: "Partner not found with this roomId" },
                { status: 404 }
            );
        }

        partner.videoKycStatus = action;
        partner.steps = 5;
        partner.kycRejectionReason = action === "rejected" ? reason.trim() : "";

        await partner.save();

        return NextResponse.json(
            { message: `Partner KYC ${action} successfully` , status: partner.videoKycStatus},
            { status: 200 } 
        );

    } catch (error) {
        console.error("KYC Approve or Reject Error:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}