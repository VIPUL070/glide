import { auth } from "@/auth";
import connectDB from "@/lib/db";
import Booking from "@/models/Booking.model";
import User from "@/models/User.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import z from 'zod';

const OTPSchema = z.object({
    bookingId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
        message: "Invalid booking ID format",
    }),
    otp: z.string().min(4, "OTP must be at least 4 characters")
});

export async function POST(req: NextRequest) {
    try {

        const session = await auth();
        if (!session?.user) {
            return NextResponse.json(
                { message: "Unauthorized. Please Login First." },
                { status: 401 }
            )
        }

        let body;
        try {
            body = await req.json();
        } catch {
            return NextResponse.json(
                { message: "Invalid JSON body." },
                { status: 400 }
            );
        }

        const result = OTPSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json(
                { message: "Validation failed.", errors: result.error.flatten() },
                { status: 400 }
            );
        }

        const { bookingId, otp } = result.data;
        await connectDB();
        const booking = await Booking.findById(bookingId).populate("user")
        if (!booking) {
            return NextResponse.json(
                { message: "No Booking Found with this id." },
                { status: 400 }
            )
        }

        const user = await User.findOne({email: booking.user.email});
        if (!user) {
            return NextResponse.json(
                { message: "User not found!" },
                { status: 404 }
            );
        }

        if (!booking.pickupOtp) {
            return NextResponse.json(
                { message: "Pickup OTP not Generated." },
                { status: 400 }
            );
        }

        if(booking.pickupOtp !== otp){
            return NextResponse.json(
                {message: "Incorrect Pickup OTP."},
                {status:400}
            )
        }

        if (new Date() > new Date(booking.pickupOtpExpires)) {
            return NextResponse.json(
                { message: "OTP has expired. Please request a new one." },
                { status: 400 }
            );
        }

        booking.bookingStatus = "started";
        booking.pickupOtp ="";
        booking.pickupOtpExpires = "";
        await booking.save();

        return NextResponse.json(
            { message: "Pickup OTP verified successfully!" },
            { status: 200 }
        );

    } catch (error) {
        console.error("Pickup OTP Verification Error:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}