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
        if (!session?.user) {
            return NextResponse.json(
                { message: "Unauthorized: Please log in first." },
                { status: 401 }
            );
        }

        const booking = await Booking.findById(id);
        if(!booking || booking.bookingStatus !== "awaiting_payment"){
            return NextResponse.json(
                {message:"Booking Not Found"},
                {status: 400}
            )
        }

        booking.paymentStatus = "cash";
        booking.bookingStatus = "confirmed";
        await booking.save();

        return NextResponse.json(
            {success:true,message: "Booking Request Confirmed Successfully."},
            {status: 200}
        )

    } catch (error) {
        console.log("Confirm Request Error", error)
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        )
    }
}