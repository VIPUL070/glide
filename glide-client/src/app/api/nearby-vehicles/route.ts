import { auth } from "@/auth";
import connectDB from "@/lib/db";
import User from "@/models/User.model";
import Vehicle from "@/models/Vehicle.model";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

const nearbyVehicleSchema = z.object({
    lat: z.number(),
    lng: z.number(),
    vehicleType: z.string(),
});

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const session = await auth();
        if (!session || !session.user || !session.user.email) {
            return NextResponse.json(
                { message: "Unauthorized: Please log in first." },
                { status: 401 }
            );
        }

        const body = await req.json();
        const parsedBody = nearbyVehicleSchema.safeParse(body);
        if (!parsedBody.success) {
            return NextResponse.json(
                { message: "Validation failed", errors: parsedBody.error },
                { status: 400 }
            );
        }

        const { lat, lng, vehicleType } = parsedBody.data;

        const partners = await User.find({
            role: "partner",
            isOnline: true,
            partnerStatus: "approved",
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [lng, lat]
                    },
                    $maxDistance: 5000
                }
            }
        });

        const partnerIds = partners.map(p => p._id);
        if (partnerIds.length === 0) {
            return NextResponse.json([], { status: 200 });
        }

        const vehicles = await Vehicle.find({
            owner: { $in: partnerIds },
            type: vehicleType,
            status: "approved",
            isActive: true
        }).lean();

        return NextResponse.json(vehicles, { status: 200 });

    } catch (error) {
        console.error("Nearby Vehicles Fetching Error:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}