import { auth } from "@/auth";
import connectDB from "@/lib/db";
import Vehicle from "@/models/Vehicle.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
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

        const vehicle = await Vehicle.findById(vId).populate("owner", "-password");
        if (!vehicle) {
            return NextResponse.json(
                { message: "Vehicle not found or invalid." },
                { status: 404 } 
            );
        }

        return NextResponse.json(
            {
                message: "Vehicle details fetched successfully",
                vehicle
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("Fetching Vehicle Review Details Error:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}