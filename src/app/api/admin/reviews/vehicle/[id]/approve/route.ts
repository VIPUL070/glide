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
        
        const { id: vId } = await context.params;
        const vehicle = await Vehicle.findById(vId);
        if (!vehicle) {
            return NextResponse.json(
                { message: "Vehicle not found or invalid" },
                { status: 404 }
            );
        }

        const partner = await User.findById(vehicle.owner);
        if (!partner || partner.role !== "partner") {
            return NextResponse.json(
                { message: "Partner not found or invalid role" },
                { status: 404 }
            );
        }

        if (vehicle.status === "approved") {
            return NextResponse.json(
                { message: "Vehicle already approved" },
                { status: 400 }
            );
        }

        vehicle.status = "approved";
        vehicle.rejectionReason = "";
        partner.steps = 7;
        partner.steps = 8;
        
        await Promise.all([
            vehicle.save(),
            partner.save()
        ])

        return NextResponse.json(
            { message: "Vehicle approved successfully" },
            { status: 200 }
        );

    } catch (error) {
        console.error("Approve Vehicle Error:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}