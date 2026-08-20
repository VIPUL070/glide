import { auth } from "@/auth";
import connectDB from "@/lib/db";
import Booking from "@/models/Booking.model";
import User from "@/models/User.model";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectDB();

        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json(
                { message: "Unauthorized: Please log in first.", booking: null },
                { status: 401 }
            );
        }
        
        const user = await User.findOne({email: session.user.email});
        const booking = await Booking.findOne(
            {user: user._id,
            bookingStatus : {
                $in: ["requested", "awaiting_payment", "confirmed", "started"]
            }}
        );

        if(!user || !booking){
            return NextResponse.json(
                {message:"Unable to find this user/user's booking.", booking: "idle"},
                {status:400}
            )
        }

        return NextResponse.json(
            { booking },
            { status: 200 }
        )

    } catch (error) {
        console.error("User Booking Fetching Error:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}