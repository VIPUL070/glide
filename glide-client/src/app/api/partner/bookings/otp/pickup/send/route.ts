import { auth } from "@/auth";
import connectDB from "@/lib/db";
import { sendMail } from "@/lib/sendMail";
import { generateOTP } from "@/lib/utils";
import Booking from "@/models/Booking.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const validIdSchema = z.object({
    bookingId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
        message: "Invalid booking ID format",
    }),
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

        const result = validIdSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json(
                { message: "Validation failed.", errors: result.error.flatten() },
                { status: 400 }
            );
        }

        const { bookingId } = result.data;
        await connectDB();
        const booking = await Booking.findById(bookingId).populate("user")
        if (!booking) {
            return NextResponse.json(
                { message: "No Booking Found with this id." },
                { status: 400 }
            )
        }

        const otp = generateOTP();
        booking.pickupOtp = otp;
        booking.pickupOtpExpires = new Date(Date.now() + 5 * 60 * 1000)
        await booking.save();

        const emailTemplate = `
      <div style="font-family: DM-sans, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Ride OTP</h2>
        <p>Please share this following One-Time Password (OTP) to your driver to start the ride. This code is valid for 5 minutes.</p>
        <h1 style="background: #f4f4f4; padding: 10px; text-align: center; letter-spacing: 5px; color: #333;">${otp}</h1>
        <p>If you did not request this code, please ignore this email.</p>
      </div>
    `;

        if (booking.user.email) {
            await sendMail(booking.user.email, "Your Pickup OTP - GLIDE", emailTemplate)
        }

        return NextResponse.json(
            { message: "Pickup OTP sent/generated successfully." },
            { status: 200 }
        );

    } catch (error) {
        console.log("Error Sending Pickup OTP", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        )
    }
}