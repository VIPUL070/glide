import { auth } from "@/auth";
import connectDB from "@/lib/db";
import Booking from "@/models/Booking.model";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const id = (await context.params).id

        await connectDB();

        const session = await auth();
        if (!session?.user?.email || session.user.role !== "partner") {
            return NextResponse.json(
                { message: "Unauthorized: Please log in first." },
                { status: 401 }
            );
        }

        const booking = await Booking.findById(id);
        if(!booking || booking.bookingStatus !== "requested"){
            return NextResponse.json(
                {message:"Booking Not Found"},
                {status: 400}
            )
        }

        booking.bookingStatus = "awaiting_payment";
        booking.paymentDeadline = new Date(Date.now() + (5 * 60 * 1000) )

        await booking.save();

        return NextResponse.json(
            {message: "Booking Request Accepted"},
            {status: 200}
        )

    } catch (error) {
        console.log("Accepting Ride Error", error)
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        )
    }
}