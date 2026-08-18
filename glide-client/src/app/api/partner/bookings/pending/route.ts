import { auth } from "@/auth";
import connectDB from "@/lib/db";
import Booking from "@/models/Booking.model";
import User from "@/models/User.model";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectDB();

        const session = await auth();
        if (!session?.user?.email || session.user.role !== "partner") {
            return NextResponse.json(
                { message: "Unauthorized: Please log in first." },
                { status: 401 }
            );
        }

        const partner = await User.findOne({ email: session.user.email })
        if (!partner) {
            return NextResponse.json(
                { message: "Partner profile not found" },
                { status: 404 }
            );
        }

        const bookings = await Booking.find({
            driver: partner._id,
            bookingStatus: "requested"
        })

        return NextResponse.json(
            bookings,
            {status: 200}
        )

    } catch (error) {
        console.error("Pending Requests Fetching Error:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}