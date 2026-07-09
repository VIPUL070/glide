import { auth } from "@/auth";
import connectDB from "@/lib/db";
import User from "@/models/User.model";
import Vehicle from "@/models/Vehicle.model";
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

        const { id: vId } = await context.params;
        const vehicle = await Vehicle.findById(vId);
        if (!vehicle) {
            return NextResponse.json(
                { message: "Vehicle not found or invalid" },
                { status: 404 }
            );
        }

        vehicle.status = "rejected";
        vehicle.rejectionReason = rejectionReason;
        await vehicle.save();

        return NextResponse.json(
            { message: "Vehicle rejected successfully" },
            { status: 200 }
        );

    } catch (error) {
        console.error("Reject Vehicle Error:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}