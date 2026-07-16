import { auth } from "@/auth";
import connectDB from "@/lib/db";
import User from "@/models/User.model";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user?.email || session.user.role !== "admin") {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        await connectDB();
        const { rejectionReason } = await req.json();
        const { id: pId } = await context.params;

        const partner = await User.findById(pId);
        if (!partner || partner.role !== "partner") {
            return NextResponse.json(
                { message: "Partner not found or invalid role" },
                { status: 404 }
            );
        }

        partner.partnerStatus = "rejected";
        partner.rejectionReason = rejectionReason;
        await partner.save();

        return NextResponse.json(
            { message: "Partner rejected successfully" },
            { status: 200 }
        );

    } catch (error) {
        console.error("Reject Partner Error:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}