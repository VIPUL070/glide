import { auth } from "@/auth";
import connectDB from "@/lib/db";
import Booking from "@/models/Booking.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const activeRideSchema = z.object({
    bookingId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
        message: "Invalid booking ID format",
    }),
});

export async function POST(req: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user || session?.user?.role !== "user") {
            return NextResponse.json(
                { message: "Unauthorized. Login First!" },
                { status: 401 }
            )
        }

        const rawBody = await req.json();
        const result = activeRideSchema.safeParse(rawBody);
        if (!result.success) {
            return NextResponse.json(
                {
                    message: "Validation failed",
                    errors: result.error.flatten().fieldErrors,
                },
                { status: 422 }
            );
        }

        const { bookingId  } = result.data;
        await connectDB();

        const booking = await Booking.findById(bookingId).populate("user vehicle driver")

        if (!booking) {
            return NextResponse.json(
                { message: "No active booking found." },
                { status: 404 }
            );
        }

        return NextResponse.json(
            booking,
            { status: 200 }
        )

    } catch (error) {
        console.log("Error Fetching Active Ride", error)
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        )
    }
}