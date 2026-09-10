import { auth } from "@/auth";
import connectDB from "@/lib/db";
import Booking from "@/models/Booking.model";
import User from "@/models/User.model";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectDB();

        const session = await auth();
        if (!session?.user || session?.user?.role !== "partner") {
            return NextResponse.json(
                { message: "Unauthorized. Login First!" },
                { status: 401 }
            )
        }

        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return NextResponse.json(
                { message: "User with this email not found," },
                { status: 400 }
            )
        }

        const booking = await Booking.findOne({
            driver: user._id,
            bookingStatus: { $in: ["confirmed", "started", "completed"] },
        }).populate("user vehicle driver")

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